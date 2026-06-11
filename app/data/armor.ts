import { Spell, SpellSlotGroup, Quality, Item } from "./structures";
import { getImageUrl, populateSpellGroups } from "./utils";

export enum ArmorType {
    HEAD = "HEAD",
    ARMOR = "ARMOR",
    SHOES = "SHOES"
}

export class Armor implements Item {

    private constructor (
        readonly id: number,
        readonly name: string,
        readonly tier: number,
        readonly enchantment: number,
        readonly quality: Quality,
        readonly item_power: number,
        readonly icon: string,
        readonly identifier: string,
        readonly stats: { name: string; value: string }[],
        readonly passiveSpells: Spell[],
        readonly activeSpells: Spell[],
        readonly activeSpell?: number,
        readonly passive?: number
    ) {
        this.armorType = identifier.split("_")[1] as ArmorType;
    }

    readonly armorType: ArmorType;

    getSpells(): Spell[] {
        return [this.getSelectedActiveSpell() || this.activeSpells[0], this.getSelectedPassiveSpell() || this.passiveSpells[0]];
    }

    getSelectedActiveSpell(): Spell | undefined {
        return this.activeSpells?.[this.activeSpell ?? -1] ?? undefined;
    }

    getSelectedPassiveSpell(): Spell | undefined {
        return this.passiveSpells?.[this.passive ?? -1] ?? null;
    }

    public static async getById(id: number, enchantment: number, quality: number, activeSpell?: number, passive?: number) : Promise<Armor | undefined> {
        try {
            const res = await fetch(`https://api.openalbion.com/api/v3/armor-stats/armor/${id}`, {
                next: { 
                    revalidate: 86400, 
                    tags: ['openalbion-armor-stats'] 
                }
            });
            
            const json = await res.json();
            const rawArmorData: any[] = json.data;
            const armorEnchantData: any = rawArmorData.find((w) => w.enchantment == enchantment);
            if (!armorEnchantData) {
                throw new Error(`Armor has no .${enchantment} enchant`);
            }
            const qualityStr = Quality[quality]
            const armorQualityData: any = armorEnchantData.stats.find((w: any) => w.quality == qualityStr)
            if (!armorEnchantData) {
                throw new Error(`Armor has no ${qualityStr} quality`);
            }
            
            const spellsRes = await fetch(`https://api.openalbion.com/api/v3/spells/armor/${id}`, {
                next: { 
                revalidate: 86400,
                tags: [`openalbion-spells-armor-${id}`]
                }
            });
            const spellsJson = await spellsRes.json();
            const spellGroups: SpellSlotGroup[] = spellsJson.data || [];
                      
            populateSpellGroups(spellGroups);

            const passiveSpells = spellGroups.find((s) => s.slot == "Passive");
            const activeSpells = spellGroups.find((s) => s.slot != "Passive");
    
            return new Armor(
                id,
                armorQualityData.armor.name,
                parseInt((armorQualityData.armor.tier as string).split(".")[0]),
                enchantment,
                quality,
                armorQualityData.stats[0].value,
                getImageUrl(armorQualityData.armor.identifier, enchantment, quality),
                armorQualityData.armor.identifier,
                (armorQualityData.stats as {name: string, value: string}[]).filter((s) => s.name != "Item Power"),
                passiveSpells?.spells || [],
                activeSpells?.spells || [],
                activeSpell,
                passive
            );
    
          } catch (error) {
                console.error("Failed to load OpenAlbion armor in serverless route:", error);
                return;
          }
    }

}