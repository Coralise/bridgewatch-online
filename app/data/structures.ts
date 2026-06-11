import { createClient, PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js'
import "dotenv/config"

export interface Item {
    id: number;
    name: string;
    tier: number;
    enchantment: number;
    quality: Quality;
    item_power: number;
    identifier: string;
    icon: string;
    stats: {name: string, value: string}[]

    getSpells: () => Spell[];
}

const subcategory_ids = {
    weapon: [2,3,4,5,6,7,10,11,12,13,14,17,18,19,20,21],
    offhand: [8,15,22],

}
  
export type SpellAttributes = {name: string, value: string}[];

export interface Spell {
  id: number;
  type: "Passive" | "Active";
  keybind: string;
  name: string;
  preview?: string;
  icon: string;
  attributes: SpellAttributes;
  description: string;
  description_html: string;
}

export interface SpellSlotGroup {
  slot: string;
  type: "Passive" | "Active";
  keybind: string;
  spells: Spell[];
}

export enum Quality {
  Normal,
  Good,
  Outstanding,
  Excellent,
  Masterpiece
}

export enum KeybindMap {
  "Passive" = "",
  "First Slot" = "Q",
  "Second Slot" = "W",
  "Third Slot" = "E",
  "Fourth Slot" = "D",
  "Fifth Slot" = "R",
  "Sixth Slot" = "F",
  "Seventh Slot" = "1",
  "Eighth Slot" = "2"
}

export enum Slot {
  PASSIVE = "Passive",
  FIRST_SLOT = "First Slot",
  SECOND_SLOT = "Second Slot",
  THIRD_SLOT = "Third Slot",
  FOURTH_SLOT = "Fourth Slot",
  FIFTH_SLOT = "Fifth Slot",
  SIXTH_SLOT = "Sixth Slot",
  SEVENTH_SLOT = "Seventh Slot",
  EIGTH_SLOT = "Eighth Slot"
}