import { Spell, SpellSlotGroup, Quality, Item, KeybindMap, Slot } from "./structures";
import { fetchWithRestCaching, getImageUrl, populateSpellGroups } from "./utils";

interface IWeapon extends Item {
  spellGroups: SpellSlotGroup[];
}

export enum WeaponType {
  ONE_HANDED = "MAIN",
  TWO_HANDED = "2H",
  OFFHAND = "OFF"
}

export class Weapon implements IWeapon {

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
        readonly spellGroups: SpellSlotGroup[],
        readonly firstSpell?: number,
        readonly secondSpell?: number,
        readonly passive?: number
    ) {
      this.type = identifier.split("_")[1] as WeaponType;
    }

    getSpells(): Spell[] {
      const spells = [
        this.getSpell(Slot.FIRST_SLOT, this.firstSpell ?? 0),
        this.getSpell(Slot.SECOND_SLOT, this.secondSpell ?? 0),
        this.getSpellsBySlot(Slot.THIRD_SLOT)?.[0],
        this.getSpell(Slot.PASSIVE, this.passive ?? 0),
      ];

      return spells.filter((spell): spell is Spell => Boolean(spell));
    }

    readonly type: WeaponType;

    getSpell(slot: string, i: number) {
      const spells = this.getSpellsBySlot(slot);
      return spells?.[i] ?? undefined;
    }

    getSpellsBySlot(slot: string): Spell[] | undefined {
        if (!this.spellGroups) return [];
        const group = this.spellGroups.find(g => g.slot === slot);
        return group ? group.spells : undefined;
    }

    isOneHanded(): boolean {
        return this.identifier.split("_")[1] === "MAIN";
    }

    public static async getById(id: number, enchantment: number, quality: number, firstSpell?: number, secondSpell?: number, passive?: number) : Promise<Weapon | undefined> {
      try {
        const res = await fetchWithRestCaching(`https://api.openalbion.com/api/v3/weapon-stats/weapon/${id}`, 'openalbion-weapon-stats')
        
        const json = await res.json();
        const rawWeaponData: any[] = json.data;
        const weaponEnchantData: any = rawWeaponData.find((w) => w.enchantment == enchantment);
        if (!weaponEnchantData) {
          throw new Error(`Weapon has no .${enchantment} enchant`);
        }
        const qualityStr = Quality[quality]
        const weaponQualityData: any = weaponEnchantData.stats.find((w: any) => w.quality == qualityStr)
        if (!weaponEnchantData) {
          throw new Error(`Weapon has no ${qualityStr} quality`);
        }
        
        let spellGroups: SpellSlotGroup[] = [];
        try {
          const spellsRes = await fetchWithRestCaching(`https://api.openalbion.com/api/v3/spells/weapon/${id}`, `openalbion-spells-weapon-${id}`);
          const spellsJson = await spellsRes.json();
          spellGroups = spellsJson.data || [];
          
          populateSpellGroups(spellGroups);

        } catch (spellError) {
          console.error(`Failed to fetch spells for weapon ${id}:`, spellError);
        }

        return new Weapon(
          id,
          weaponQualityData.weapon.name,
          parseInt((weaponQualityData.weapon.tier as string).split(".")[0]),
          enchantment,
          quality,
          weaponQualityData.stats[0].value,
          getImageUrl(weaponQualityData.weapon.identifier, enchantment, quality),
          weaponQualityData.weapon.identifier,
          (weaponQualityData.stats as {name: string, value: string}[]).filter((s) => s.name != "Item Power"),
          spellGroups,
          firstSpell,
          secondSpell,
          passive
        );

      } catch (error) {
        console.error("Failed to load OpenAlbion weapon in serverless route:", error);
        return;
      }
    }

}
