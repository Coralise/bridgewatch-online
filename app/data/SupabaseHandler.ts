import { Database } from "@/types/database.types";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export const supabase = createClient<Database>(
  supabaseUrl, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const isServer = typeof window === 'undefined';
export const supabaseAdmin = isServer && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient<Database>(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    })
  : null;


// ==========================================
// FUNCTIONS
// ==========================================

export async function getBuild(id: number) {
    return await supabase
        .from('builds')
        .select("*")
        .eq('id', id)
        .single();
}

export async function getBuildWithUser(id: number) {
    return await supabase
        .from('builds_with_author_view')
        .select("*")
        .eq('id', id)
        .single();
}

export interface IUser {
    discordId: string;
    name: string;
    ign?: string;
    imageUrl?: string;
}

export async function getUserDetails(id: string): Promise<IUser | undefined> {

    let { data, error } = await supabase
        .from('users_public_view')
        .select("*")
        .eq('discord_id', id)
        .single();

    if (error) {
        console.error("Error fetching user details:", error.message);
        return;
    }

    if (!data || !data.discord_id) return;

    return {
        discordId: data.discord_id,
        name: data.name || "Anon",
        ign: data.ign || undefined,
        imageUrl: data.image_url || undefined
    };
}

export async function updateIgn(userId: string, newIgn: string) {
    if (!supabaseAdmin) {
        console.error("updateIgn can only be executed in a server-side environment.");
        return;
    }

    const { data, error } = await supabaseAdmin
        .from('users')
        .update({ ign: newIgn })
        .eq('discord_id', userId)
        .select();

    if (error) {
        console.error("Failed to upsert vote:", error.message);
        return false;
    }

    return true;
}

type UpsertTarget =
    | { user?: { id?: string; name?: string; email?: string; image?: string } }
    | { id?: string; name?: string; email?: string; image?: string };

export async function upsertUser(target: UpsertTarget) {
    if (!supabaseAdmin) {
        console.error("upsertUser can only be executed in a server-side environment.");
        return;
    }

    const id = (target as any).user?.id ?? (target as any).id;
    const name = (target as any).user?.name ?? (target as any).name;
    const email = (target as any).user?.email ?? (target as any).email;
    const image = (target as any).user?.image ?? (target as any).image;

    if (!id) return;

    const { data, error } = await supabaseAdmin.from('users').upsert({
        discord_id: id,
        name: name ?? null,
        email: email ?? null,
        image_url: image ?? null,
    }).select();

    if (error) {
        console.error('Error upserting user:', error);
        throw new Error('Failed to upsert user');
    }
}

export interface IComment {
  id: number;
  comment: string;
  created_at: string;
  author: {
    discord_id: string;
    name: string;
    image_url?: string;
  };
}

export async function getComments(buildId: number, fromIndex: number, amount: number): Promise<IComment[]> {
    const toIndex = fromIndex + amount - 1;

    let { data: comments, error } = await supabase
        .from('comments')
        .select(`
            id,
            comment,
            created_at,
            author:users_public_view (
                discord_id,
                name,
                image_url
            )
        `)
        .eq('build_id', buildId)
        .order('created_at', { ascending: false })
        .range(fromIndex, toIndex);

    if (error) {
        console.error("Failed to fetch comments:", error.message);
        return [];
    }

    return (comments as unknown as IComment[]) || [];
}

export async function addComment(buildId: number, authorId: string, comment: string): Promise<boolean> {
    if (!supabaseAdmin) {
        console.error("addComment can only be executed in a server-side environment.");
        return false;
    }

    const { error } = await supabaseAdmin
        .from('comments')
        .insert([
            {
                build_id: buildId,
                commenter_id: authorId,
                comment: comment
            },
        ]);

    if (error) {
        console.error("Failed to add comment on server:", error.message);
        return false;
    }

    return true;
}

export async function getLastCommentTimestamp(authorId: string): Promise<string | null> {
    if (!supabaseAdmin) return null;

    const { data, error } = await supabaseAdmin
        .from('comments')
        .select('created_at')
        .eq('commenter_id', authorId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error("Error fetching last comment timestamp:", error.message);
        return null;
    }

    return data ? data.created_at : null;
}

export enum VoteType {
    NEUTRAL = 0,
    PLUS = 1,
    MINUS = -1
}

export async function updateVote(userId: string, buildId: number, voteType: VoteType): Promise<boolean> {
    if (!supabaseAdmin) return false;

    // Fixed the comparison: If it IS neutral, delete their record (unvote)
    if (voteType === VoteType.NEUTRAL) {
        const { error } = await supabaseAdmin
            .from('votes')
            .delete()
            .eq('user_id', userId)
            .eq('build_id', buildId);

        if (error) {
            console.error("Failed to delete vote:", error.message);
            return false;
        }
    } else {
        const { error } = await supabaseAdmin
            .from('votes')
            .upsert({ 
                user_id: userId, 
                build_id: buildId, 
                vote_type: voteType 
            });

        if (error) {
            console.error("Failed to upsert vote:", error.message);
            return false;
        }
    }

    return true;
}

/**
 * Calculates the total aggregate vote score for a build.
 * Sums up all the 1s (likes) and -1s (dislikes).
 */
export async function getVotes(buildId: number): Promise<number> {
    const { data, error } = await supabase
        .from('votes')
        .select('vote_type')
        .eq('build_id', buildId);

    if (error) {
        console.error(`Failed to fetch total votes for build ${buildId}:`, error.message);
        return 0;
    }

    // Sum up all the vote weights (e.g., 1 + 1 - 1 + 1 = 2)
    const totalScore = data?.reduce((sum, row) => sum + row.vote_type, 0) || 0;
    
    return totalScore;
}

/**
 * Fetches a single specific user's vote status for a build.
 * Returns 1 (PLUS), -1 (MINUS), or null if they haven't voted yet.
 */
export async function getVote(buildId: number, userId: string): Promise<VoteType> {
    const { data, error } = await supabase
        .from('votes')
        .select('vote_type')
        .eq('build_id', buildId)
        .eq('user_id', userId)
        .maybeSingle();

    if (error) {
        console.error(`Failed to fetch user ${userId} vote for build ${buildId}:`, error.message);
        return VoteType.NEUTRAL;
    }

    return data ? data.vote_type : VoteType.NEUTRAL;
}