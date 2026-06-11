import { Spell, SpellSlotGroup, Quality, Item } from "./structures";
import { fetchWithRestCaching, getImageUrl } from "./utils";

export enum ConsumableType {
    MEAL = "MEAL",
    "POTION" = "POTION",
    "FOCUSPOTION" = "FOCUSPOTION"
}

export class Consumable implements Item {

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
        public readonly description: string,
    ) {
        this.consumableType = identifier.split("_")[1] as ConsumableType;
    }

    getSpells = () => [
        {
            id: this.id,
            type: "Active",
            keybind: this.consumableType == ConsumableType.MEAL ? "2" : "1",
            name: this.name,
            icon: this.icon,
            attributes: [],
            description: this.description,
            description_html: this.description,
        } as unknown as Spell
    ];

    readonly consumableType: ConsumableType;

    public static async getById(id: number, enchantment: number) : Promise<Consumable | undefined> {
        try {
            const res = await fetchWithRestCaching(`https://api.openalbion.com/api/v3/consumable-stats/consumable/${id}`, 'openalbion-consumable-stats')
            
            const json = await res.json();
            const rawConsumableData: any[] = json.data;
            const consumableEnchantData: any = rawConsumableData.find((w) => w.enchantment == enchantment);
            if (!consumableEnchantData) {
                throw new Error(`Consumable has no .${enchantment} enchant`);
            }
            const consumableQualityData: any = consumableEnchantData.stats[0];
    
            return new Consumable(
                id,
                consumableQualityData.consumable.name,
                parseInt((consumableQualityData.consumable.tier as string).split(".")[0]),
                enchantment,
                Quality.Normal,
                consumableQualityData.stats[0].value,
                getImageUrl(consumableQualityData.consumable.identifier, enchantment, Quality.Normal),
                consumableQualityData.consumable.identifier,
                (consumableQualityData.stats as {name: string, value: string}[]).filter((s) => s.name != "Item Power"),
                consumableQualityData.consumable.info
            );
    
          } catch (error) {
                console.error("Failed to load OpenAlbion consumable in serverless route:", error);
                return;
          }
    }

}