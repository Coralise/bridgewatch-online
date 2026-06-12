import "dotenv/config";
import { Weapon } from "./weapon";
import { Armor } from "./armor";
import { Accessory } from "./accessory";
import { Consumable } from "./consumables";
import { Item } from "./structures";
import * as SupabaseHandler from "./SupabaseHandler";

export const Role = {
    1: "Offensive Tank",
    2: "Defensive Tank",
    3: "Healer",
    4: "Support",
    5: "Melee DPS",
    6: "Ranged DPS"
}

export const Category = {
    1: ["Zone vs. Zone", "ZvZ"],
    2: ["Solo Red Zone Roaming", "Solo RZ"],
    3: ["Group Red Zone Roaming", "Group RZ"],
    4: ["Ganking", "Gank"],
    5: ["Clap", "Clap"],
    6: ["Brawl", "Brawl"],
    7: ["Bomb Squad", "Bomb"],
}

export class Build {

    private constructor (
        readonly id: number,
        readonly createdAt: Date,
        readonly lastUpdated: Date,
        readonly submittedBy: string,
        readonly name: string,
        readonly role: number,
        readonly category: number,
        readonly votes: number,
        readonly description: string | null,
        readonly comments: any,
        readonly swaps: Item[],
        readonly weapon?: Weapon,
        readonly offhand?: Weapon,
        readonly helmet?: Armor,
        readonly armor?: Armor,
        readonly boots?: Armor,
        readonly cape?: Accessory,
        readonly food?: Consumable,
        readonly potion?: Consumable
    ) {}

    getAllItems(): Item[] {
         const items: Item[] = [];
         if (this.weapon) items.push(this.weapon);
         if (this.offhand) items.push(this.offhand);
         if (this.helmet) items.push(this.helmet);
         if (this.armor) items.push(this.armor);
         if (this.boots) items.push(this.boots);
         if (this.cape) items.push(this.cape);
         if (this.food) items.push(this.food);
         if (this.potion) items.push(this.potion);
         if (this.swaps && this.swaps.length) items.push(...this.swaps);
         return items;
    }

    getBaseAverageIp(): number {
        let totalIp = 0;

        // Force cast everything to Number using '+' to prevent string concatenation
        if (this.helmet) totalIp += Number(this.helmet.item_power);
        if (this.armor) totalIp += Number(this.armor.item_power);
        if (this.boots) totalIp += Number(this.boots.item_power);
        if (this.cape) totalIp += Number(this.cape.item_power);

        if (this.weapon) {
            const weaponIp = Number(this.weapon.item_power);
            if (!this.weapon.isOneHanded()) {
                totalIp += weaponIp * 2;
            } else {
                totalIp += weaponIp;
                if (this.offhand) {
                    totalIp += Number(this.offhand.item_power);
                }
            }
        } else if (this.offhand) {
            totalIp += Number(this.offhand.item_power);
        }

        const averageIp = totalIp / 6;

        return Math.round(averageIp);
    }

    public static async getBuild(id: number): Promise<Build | undefined> {
        const { data, error } = await SupabaseHandler.getBuild(id);

        if (error || !data) return undefined;

        // Parse string inputs into raw array numbers
        const weaponParts = data.weapon ? data.weapon.split(";").map(Number) : [];
        const offhandParts = data.offhand ? data.offhand.split(";").map(Number) : [];
        const helmetParts = data.helmet ? data.helmet.split(";").map(Number) : [];
        const armorParts = data.armor ? data.armor.split(";").map(Number) : [];
        const bootsParts = data.boots ? data.boots.split(";").map(Number) : [];
        const capeParts = data.cape ? data.cape.split(";").map(Number) : [];
        const foodParts = data.food ? data.food.split(";").map(Number) : [];
        const potionParts = data.potion ? data.potion.split(";").map(Number) : [];

        // Execute ALL database operations concurrently in parallel
        const [
            weapon,
            offhand,
            helmet,
            armor,
            boots,
            cape,
            food,
            potion,
            swaps
        ] = await Promise.all([
            Weapon.getById(weaponParts[0], weaponParts[1], weaponParts[2], weaponParts[3], weaponParts[4], weaponParts[5]),
            Weapon.getById(offhandParts[0], offhandParts[1], offhandParts[2]),
            Armor.getById(helmetParts[0], helmetParts[1], helmetParts[2], helmetParts[3], helmetParts[4]),
            Armor.getById(armorParts[0], armorParts[1], armorParts[2], armorParts[3], armorParts[4]),
            Armor.getById(bootsParts[0], bootsParts[1], bootsParts[2], bootsParts[3], bootsParts[4]),
            Accessory.getById(capeParts[0], capeParts[1], capeParts[2]),
            Consumable.getById(foodParts[0], foodParts[1]),
            Consumable.getById(potionParts[0], potionParts[1]),
            data.swaps ? getSwaps(data.swaps) : Promise.resolve([])
        ]);

        return new Build(
            data.id,
            new Date(data.created_at),
            new Date(data.last_updated),
            data.submitted_by,
            data.name,
            data.role,
            data.category,
            data.votes,
            data.description,
            data.comments,
            swaps,
            weapon,
            offhand,
            helmet,
            armor,
            boots,
            cape,
            food,
            potion
        );
    }

    public toJSON() {
        return {
            id: this.id,
            createdAt: this.createdAt.toISOString(), // Dates must be strings
            lastUpdated: this.lastUpdated.toISOString(),
            submittedBy: this.submittedBy,
            name: this.name,
            role: this.role,
            category: this.category,
            votes: this.votes,
            description: this.description,
            comments: this.comments,
            swaps: this.swaps.map(item => ({ ...item })), // Spreads nested fields safely
            weapon: this.weapon ? { ...this.weapon } : undefined,
            offhand: this.offhand ? { ...this.offhand } : undefined,
            helmet: this.helmet ? { ...this.helmet } : undefined,
            armor: this.armor ? { ...this.armor } : undefined,
            boots: this.boots ? { ...this.boots } : undefined,
            cape: this.cape ? { ...this.cape } : undefined,
            food: this.food ? { ...this.food } : undefined,
            potion: this.potion ? { ...this.potion } : undefined,
        };
    }
}

export type SerializedBuild = ReturnType<Build["toJSON"]>;

async function getSwaps(swapsStr: string): Promise<Item[]> {
    if (!swapsStr) return [];

    // 1. Split by hyphen to isolate each individual item segment
    const itemSegments = swapsStr.split("-");
    const promises: Promise<Weapon | Armor | Consumable | Accessory | undefined>[] = [];

    for (const segment of itemSegments) {
        if (!segment) continue;

        // 2. Split by semicolon to separate the item type from its stats
        const parts = segment.split(";");
        const slotType = parts[0].toLowerCase(); // e.g., "shoes", "head"
        
        // 3. Extract the remaining values and convert them to numbers
        const p = parts.slice(1).map(Number);

        // 4. Route to the correct class method based on the slot string prefix
        switch (slotType) {
            case "weapon":
                promises.push(Weapon.getById(p[0], p[1], p[2], p[3], p[4], p[5]));
                break;
                
            case "offhand":
                promises.push(Weapon.getById(p[0], p[1], p[2]));
                break;
                
            case "head":
            case "helmet":
            case "armor":
            case "shoes":
            case "boots":
                promises.push(Armor.getById(p[0], p[1], p[2], p[3], p[4]));
                break;
                
            case "cape":
                promises.push(Accessory.getById(p[0], p[1], p[2]));
                break;
                
            case "potion":
            case "meal":
            case "food":
                promises.push(Consumable.getById(p[0], p[1]));
                break;
                
            default:
                // Skip unknown item types gracefully
                break;
        }
    }

    // Resolve all targeted database lookups concurrently in parallel
    const results = await Promise.all(promises);

    // Filter out undefined results cleanly
    return results.filter((item): item is Weapon | Armor | Consumable | Accessory => item !== undefined);
}