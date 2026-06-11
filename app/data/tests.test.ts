import { expect, test } from "vitest";

import { Quality } from "./structures"
import { Weapon, WeaponType } from "./weapon";
import { Armor } from "./armor";
import { Accessory } from "./accessory";
import { Consumable } from "./consumables";
import { Build } from "./build";

// WEAPON/OFFHAND
test("Get T4.2 Good Weapon", async () => {
    const weapon = await Weapon.getById(393, 2, 1);

    expect(weapon).toBeDefined();
    expect(weapon!.tier).toBe(4);
    expect(weapon!.quality).toBe(Quality.Good);
});

test("Get T1 Masterpiece Weapon", async () => {
    const weapon = await Weapon.getById(37, 0, 4);

    expect(weapon).toBeDefined();
    expect(weapon!.tier).toBe(1);
    expect(weapon!.quality).toBe(Quality.Masterpiece);

    // console.log(weapon?.getSpells()[0]);
});

test("Get T6.3 Outstanding Offhand", async () => {
    const weapon = await Weapon.getById(234, 3, 2);

    expect(weapon).toBeDefined();
    expect(weapon!.tier).toBe(6);
    expect(weapon!.quality).toBe(Quality.Outstanding);
    expect(weapon!.type).toBe(WeaponType.OFFHAND);
});

// ARMOR
test("Get T4.2 Excellent Shoes", async () => {
    const armor = await Armor.getById(295, 2, 3);

    expect(armor).toBeDefined();
    expect(armor!.tier).toBe(4);
});

test("Get T4.1 Excellent Shoes", async () => {
    const armor = await Armor.getById(295, 1, 3);

    expect(armor).toBeDefined();
    expect(armor!.tier).toBe(4);
});

test("Get T4.2 Good Shoes", async () => {
    const armor = await Armor.getById(295, 2, 1);

    expect(armor).toBeDefined();
    expect(armor!.tier).toBe(4);
});

test("Get T8.4 Masterpiece Martlock Cape", async () => {
    const accessory = await Accessory.getById(59, 4, 4);

    expect(accessory).toBeDefined();
    expect(accessory!.tier).toBe(8);
});

test("Get T2 Normal Cape", async () => {
    const accessory = await Accessory.getById(1, 0, 0);

    expect(accessory).toBeDefined();
    expect(accessory!.tier).toBe(2);
});

test("Get T7.1 Excellent Satchel of Insight", async () => {
    const accessory = await Accessory.getById(69, 1, 3);

    expect(accessory).toBeDefined();
    expect(accessory!.tier).toBe(7);
});

test("Get .0 Pork Omelette", async () => {
    const consumable = await Consumable.getById(9, 0);

    expect(consumable).toBeDefined();
    expect(consumable!.name).toBe("Pork Omelette");
    
});

test("Get .2 Pork Omelette", async () => {
    const consumable = await Consumable.getById(9, 2);

    expect(consumable).toBeDefined();
    expect(consumable!.name).toBe("Pork Omelette");
});

test("Get T8.1 Invisibility Potion", async () => {
    const consumable = await Consumable.getById(70, 1);

    expect(consumable).toBeDefined();
    expect(consumable!.name).toBe("Invisibility Potion");
});

test("Get Build ID 2", async () => {
    const build = await Build.getBuild(2); 
});