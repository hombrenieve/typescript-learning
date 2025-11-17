import { Inventory, BaseItem, Weapon, Consumable } from '../../src/items/Inventory';

describe('Inventory', () => {
  let inventory: Inventory<BaseItem>;

  beforeEach(() => {
    inventory = new Inventory<BaseItem>(5); // Small inventory for testing
  });

  describe('constructor', () => {
    test('should create empty inventory with specified max slots', () => {
      expect(inventory.isEmpty()).toBe(true);
      expect(inventory.getItemCount()).toBe(0);
      expect(inventory.getAllItems()).toHaveLength(0);
    });
  });

  describe('addItem', () => {
    test('should add item to inventory', () => {
      const weapon = new Weapon('sword1', 'Iron Sword', 1, 100, 10);
      
      const result = inventory.addItem(weapon);
      
      expect(result).toBe(true);
      expect(inventory.getItem('sword1')).toBe(weapon);
      expect(inventory.isEmpty()).toBe(false);
    });

    test('should stack consumable items', () => {
      const potion1 = new Consumable('potion', 'Health Potion', 2, 50, () => {});
      const potion2 = new Consumable('potion', 'Health Potion', 3, 50, () => {});
      
      inventory.addItem(potion1);
      inventory.addItem(potion2);
      
      const storedPotion = inventory.getItem('potion');
      expect(storedPotion?.quantity).toBe(5); // 2 + 3
    });

    test('should not stack non-stackable items', () => {
      const weapon1 = new Weapon('sword', 'Iron Sword', 1, 100, 10);
      const weapon2 = new Weapon('sword2', 'Iron Sword 2', 1, 100, 10); // Different ID
      
      inventory.addItem(weapon1);
      const result = inventory.addItem(weapon2);
      
      expect(result).toBe(true); // Should succeed with different ID
      expect(inventory.getAllItems()).toHaveLength(2);
    });

    test('should reject item when inventory is full', () => {
      // Fill inventory to capacity
      for (let i = 0; i < 5; i++) {
        const weapon = new Weapon(`sword${i}`, `Sword ${i}`, 1, 100, 10);
        inventory.addItem(weapon);
      }
      
      const extraWeapon = new Weapon('extra', 'Extra Sword', 1, 100, 10);
      const result = inventory.addItem(extraWeapon);
      
      expect(result).toBe(false);
      expect(inventory.isFull()).toBe(true);
    });

    test('should not exceed max stack size for stackable items', () => {
      const potion1 = new Consumable('potion', 'Health Potion', 50, 50, () => {});
      const potion2 = new Consumable('potion', 'Health Potion', 60, 50, () => {}); // Same ID, would exceed max stack (99)
      
      inventory.addItem(potion1);
      const result = inventory.addItem(potion2);
      
      expect(result).toBe(false); // Should fail because 50 + 60 > 99 (max stack)
    });
  });

  describe('removeItem', () => {
    test('should remove item completely when quantity matches', () => {
      const weapon = new Weapon('sword', 'Iron Sword', 1, 100, 10);
      inventory.addItem(weapon);
      
      const removed = inventory.removeItem('sword', 1);
      
      expect(removed).toBe(weapon);
      expect(inventory.getItem('sword')).toBeUndefined();
    });

    test('should reduce quantity when removing partial amount', () => {
      const potion = new Consumable('potion', 'Health Potion', 5, 50, () => {});
      inventory.addItem(potion);
      
      const removed = inventory.removeItem('potion', 2);
      
      expect(removed?.quantity).toBe(2);
      expect(inventory.getItem('potion')?.quantity).toBe(3);
    });

    test('should return null for non-existent item', () => {
      const removed = inventory.removeItem('nonexistent');
      
      expect(removed).toBeNull();
    });

    test('should remove entire item when requested quantity exceeds available', () => {
      const potion = new Consumable('potion', 'Health Potion', 3, 50, () => {});
      inventory.addItem(potion);
      
      const removed = inventory.removeItem('potion', 10);
      
      expect(removed?.quantity).toBe(3);
      expect(inventory.getItem('potion')).toBeUndefined();
    });
  });

  describe('useItem', () => {
    test('should use consumable item', () => {
      let effectCalled = false;
      const potion = new Consumable('potion', 'Health Potion', 2, 50, () => {
        effectCalled = true;
      });
      inventory.addItem(potion);
      
      const result = inventory.useItem('potion');
      
      expect(result).toBe(true);
      expect(effectCalled).toBe(true);
      expect(inventory.getItem('potion')?.quantity).toBe(1);
    });

    test('should remove item when quantity reaches 0 after use', () => {
      const potion = new Consumable('potion', 'Health Potion', 1, 50, () => {});
      inventory.addItem(potion);
      
      inventory.useItem('potion');
      
      expect(inventory.getItem('potion')).toBeUndefined();
    });

    test('should fail to use non-usable item', () => {
      const weapon = new Weapon('sword', 'Iron Sword', 1, 100, 10);
      inventory.addItem(weapon);
      
      const result = inventory.useItem('sword');
      
      expect(result).toBe(false);
    });

    test('should fail to use non-existent item', () => {
      const result = inventory.useItem('nonexistent');
      
      expect(result).toBe(false);
    });
  });

  describe('getItemsByType', () => {
    test('should return items of specified type', () => {
      const weapon = new Weapon('sword', 'Iron Sword', 1, 100, 10);
      const potion = new Consumable('potion', 'Health Potion', 1, 50, () => {});
      
      inventory.addItem(weapon);
      inventory.addItem(potion);
      
      const weapons = inventory.getItemsByType('weapon');
      const consumables = inventory.getItemsByType('consumable');
      
      expect(weapons).toHaveLength(1);
      expect(weapons[0]).toBe(weapon);
      expect(consumables).toHaveLength(1);
      expect(consumables[0]).toBe(potion);
    });

    test('should return empty array for type with no items', () => {
      const armor = inventory.getItemsByType('armor');
      
      expect(armor).toHaveLength(0);
    });
  });

  describe('getTotalValue', () => {
    test('should calculate total value of all items', () => {
      const weapon = new Weapon('sword', 'Iron Sword', 1, 100, 10);
      const potion = new Consumable('potion', 'Health Potion', 3, 50, () => {});
      
      inventory.addItem(weapon);
      inventory.addItem(potion);
      
      const totalValue = inventory.getTotalValue();
      
      expect(totalValue).toBe(250); // 100 + (3 * 50)
    });

    test('should return 0 for empty inventory', () => {
      expect(inventory.getTotalValue()).toBe(0);
    });
  });

  describe('getItemCount', () => {
    test('should return total quantity of all items', () => {
      const weapon = new Weapon('sword', 'Iron Sword', 1, 100, 10);
      const potion = new Consumable('potion', 'Health Potion', 5, 50, () => {});
      
      inventory.addItem(weapon);
      inventory.addItem(potion);
      
      expect(inventory.getItemCount()).toBe(6); // 1 + 5
    });
  });

  describe('display', () => {
    test('should not throw error when displaying inventory', () => {
      const weapon = new Weapon('sword', 'Iron Sword', 1, 100, 10);
      inventory.addItem(weapon);
      
      expect(() => inventory.display()).not.toThrow();
    });
  });
});

describe('BaseItem subclasses', () => {
  describe('Weapon', () => {
    test('should create weapon with correct properties', () => {
      const weapon = new Weapon('sword1', 'Iron Sword', 1, 100, 15, 80);
      
      expect(weapon.id).toBe('sword1');
      expect(weapon.name).toBe('Iron Sword');
      expect(weapon.type).toBe('weapon');
      expect(weapon.quantity).toBe(1);
      expect(weapon.value).toBe(100);
      expect(weapon.attackBonus).toBe(15);
      expect(weapon.durability).toBe(80);
    });

    test('should have default durability of 100', () => {
      const weapon = new Weapon('sword1', 'Iron Sword', 1, 100, 15);
      
      expect(weapon.durability).toBe(100);
    });

    test('should return formatted description', () => {
      const weapon = new Weapon('sword1', 'Iron Sword', 1, 100, 15, 90);
      
      const description = weapon.getDescription();
      
      expect(description).toContain('Iron Sword');
      expect(description).toContain('Attack +15');
      expect(description).toContain('Durability: 90%');
    });
  });

  describe('Consumable', () => {
    test('should create consumable with correct properties', () => {
      const effect = jest.fn();
      const potion = new Consumable('potion1', 'Health Potion', 3, 50, effect);
      
      expect(potion.id).toBe('potion1');
      expect(potion.name).toBe('Health Potion');
      expect(potion.type).toBe('consumable');
      expect(potion.quantity).toBe(3);
      expect(potion.value).toBe(50);
      expect(potion.stackable).toBe(true);
      expect(potion.maxStack).toBe(99);
      expect(potion.usable).toBe(true);
    });

    test('should execute effect when used', () => {
      const effect = jest.fn();
      const potion = new Consumable('potion1', 'Health Potion', 2, 50, effect);
      
      potion.use();
      
      expect(effect).toHaveBeenCalledTimes(1);
      expect(potion.quantity).toBe(1);
    });

    test('should not use when quantity is 0', () => {
      const effect = jest.fn();
      const potion = new Consumable('potion1', 'Health Potion', 0, 50, effect);
      
      potion.use();
      
      expect(effect).not.toHaveBeenCalled();
      expect(potion.quantity).toBe(0);
    });
  });
});
