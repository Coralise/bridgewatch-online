import { Spell, SpellSlotGroup, Quality, Item } from "./structures";
import { getImageUrl, populateSpellGroups } from "./utils";

export enum AccessoryType {
    CAPE = "CAPE",
    CAPEITEM = "CAPEITEM",
    MOUNT = "MOUNT",
    BAG = "BAG",
}

export class Accessory implements Item {

    private constructor (
        public readonly id: number,
        public readonly name: string,
        public readonly tier: number,
        public readonly enchantment: number,
        public readonly quality: Quality,
        public readonly item_power: number,
        public readonly icon: string,
        public readonly identifier: string,
        public readonly stats: { name: string; value: string }[],
        public readonly passiveSpells: Spell[] | undefined,
        public readonly activeSpells: Spell[] | undefined
    ) {
        this.accessoryType = identifier.split("_")[1] as AccessoryType;
    }

    getSpells(): Spell[] {
        return [...(this.passiveSpells ?? []), ...(this.activeSpells ?? [])];
    }

    readonly accessoryType: AccessoryType;

    public static async getById(id: number, enchantment: number, quality: number) : Promise<Accessory | undefined> {
        try {
            const res = await fetch(`https://api.openalbion.com/api/v3/accessory-stats/accessory/${id}`, {
                next: { 
                    revalidate: 86400, 
                    tags: ['openalbion-accessory-stats'] 
                }
            });
            
            const json = await res.json();
            const rawAccessoryData: any[] = json.data;
            const accessoryEnchantData: any = rawAccessoryData.find((w) => w.enchantment == enchantment);
            if (!accessoryEnchantData) {
                throw new Error(`Accessory has no .${enchantment} enchant`);
            }
            const qualityStr = Quality[quality]
            const accessoryQualityData: any = accessoryEnchantData.stats.find((w: any) => w.quality == qualityStr)
            if (!accessoryEnchantData) {
                throw new Error(`Accessory has no ${qualityStr} quality`);
            }
            
            const spellsRes = await fetch(`https://api.openalbion.com/api/v3/spells/accessory/${id}`, {
                next: { 
                revalidate: 86400,
                tags: [`openalbion-spells-accessory-${id}`]
                }
            });
            const spellsJson = await spellsRes.json();
            const spellGroups: SpellSlotGroup[] = spellsJson.data || [];
                                  
            populateSpellGroups(spellGroups);

            const passiveSpells = spellGroups.find((s) => s.slot == "Passive");
            const activeSpells = spellGroups.find((s) => s.slot != "Passive");
    
            return new Accessory(
                id,
                accessoryQualityData.accessory.name,
                parseInt((accessoryQualityData.accessory.tier as string).split(".")[0]),
                enchantment,
                quality,
                accessoryQualityData.stats[0].value,
                getImageUrl(accessoryQualityData.accessory.identifier, enchantment, quality),
                accessoryQualityData.accessory.identifier,
                (accessoryQualityData.stats as {name: string, value: string}[]).filter((s) => s.name != "Item Power"),
                passiveSpells?.spells || undefined,
                activeSpells?.spells || undefined
            );
    
          } catch (error) {
                console.error("Failed to load OpenAlbion accessory in serverless route:", error);
                return;
          }
    }

}