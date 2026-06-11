import { createClient, SupabaseClient } from "@supabase/supabase-js";
import "dotenv/config";
import { KeybindMap, Slot, SpellSlotGroup } from "./structures";

// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY || '');

type UpsertTarget =
    | { user?: { id?: string; name?: string; email?: string; image?: string } }
    | { id?: string; name?: string; email?: string; image?: string };

export async function upsertUser(target: UpsertTarget) {
    // const id = (target as any).user?.id ?? (target as any).id;
    // const name = (target as any).user?.name ?? (target as any).name;
    // const email = (target as any).user?.email ?? (target as any).email;
    // const image = (target as any).user?.image ?? (target as any).image;

    // if (!id) return;

    // const { data, error } = await supabase.from('users').upsert({
    //     discord_id: id,
    //     name: name ?? null,
    //     email: email ?? null,
    //     image_url: image ?? null,
    // }).select();

    // if (error) {
    //     console.error('Error upserting user:', error);
    //     throw new Error('Failed to upsert user');
    // }
}

export function getImageUrl(identifier: string, enchantment: number, quality: number) {
    return `https://render.albiononline.com/v1/item/${identifier}@${enchantment}.png?quality=${quality}&size=217&locale=en`;
}

export async function fetchWithRestCaching(url: string, tag: string): Promise<Response> {
    return fetch(url, {
        next: { 
            revalidate: 86400,
            tags: [tag]
        }
    });
}

export function populateSpellGroups(spellGroups: SpellSlotGroup[], keybind?: string) {
  spellGroups.forEach((spellGroup: SpellSlotGroup) => {
    const kb = keybind ?? (KeybindMap as any)[spellGroup.slot] ?? "";
    // assign keybind to group
    spellGroup.keybind = kb;
    if (Array.isArray(spellGroup.spells)) {
      spellGroup.spells = spellGroup.spells.map((s) => ({
        ...s,
        keybind: kb,
        type: spellGroup.slot === Slot.PASSIVE ? "Passive" : "Active",
      }));
    }
  });
}