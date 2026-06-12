import { Database } from "@/types/database.types";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// ==========================================
// 1. PUBLIC CLIENT (For Browsers & Public Views)
// ==========================================
// This client ALWAYS uses the anon key, ensuring the proper 'apikey' 
// header is attached, even during Next.js server pre-rendering (SSR).
export const supabase = createClient<Database>(
  supabaseUrl, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ==========================================
// 2. ADMIN CLIENT (Strictly for Server-Side Override)
// ==========================================
// Use this only inside API routes, Server Actions, or backend scripts 
// when you intentionally need to bypass RLS.
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

export interface IUser {
    discordId: string;
    name: string;
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
        imageUrl: data.image_url || undefined
    };
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