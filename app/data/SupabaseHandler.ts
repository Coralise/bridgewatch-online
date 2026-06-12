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