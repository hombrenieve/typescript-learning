import { ItemData, ItemType } from '../types';
import { log, validate } from '../utils/decorators';

export interface Stackable {
  stackable: boolean;
  maxStack: number;
}

export interface Usable {
  usable: boolean;
  use(): void;
}

export abstract class BaseItem implements ItemData {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: ItemType,
    public quantity: number,
    public readonly value: number
  ) {}

  abstract getDescription(): string;
}

export class Weapon extends BaseItem {
  constructor(
    id: string,
    name: string,
    quantity: number,
    value: number,
    public readonly attackBonus: number,
    public readonly durability: number = 100
  ) {
    super(id, name, "weapon", quantity, value);
  }

  getDescription(): string {
    return `${this.name} - Attack +${this.attackBonus} (Durability: ${this.durability}%)`;
  }
}

export class Consumable extends BaseItem implements Stackable, Usable {
  public readonly stackable = true;
  public readonly maxStack = 99;
  public readonly usable = true;

  constructor(
    id: string,
    name: string,
    quantity: number,
    value: number,
    private effect: () => void
  ) {
    super(id, name, "consumable", quantity, value);
  }

  getDescription(): string {
    return `${this.name} x${this.quantity} - Consumable item`;
  }

  use(): void {
    if (this.quantity > 0) {
      this.effect();
      this.quantity--;
    }
  }
}

export class Inventory<T extends BaseItem> {
  private items: Map<string, T> = new Map();

  constructor(private maxSlots: number = 20) {}

  @log
  @validate(
    (args) => args[0] && typeof args[0] === 'object',
    'Item must be a valid item object'
  )
  addItem(item: T): boolean {
    const existingItem = this.items.get(item.id);

    if (existingItem && this.isStackable(existingItem)) {
      const stackable = existingItem as T & Stackable;
      if (existingItem.quantity + item.quantity <= stackable.maxStack) {
        existingItem.quantity += item.quantity;
        return true;
      } else {
        // Cannot stack - would exceed max stack size
        return false;
      }
    }

    if (this.items.size >= this.maxSlots) {
      console.log("❌ Inventory is full!");
      return false;
    }

    this.items.set(item.id, item);
    return true;
  }

  @log
  removeItem(itemId: string, quantity: number = 1): T | null {
    const item = this.items.get(itemId);
    if (!item) return null;

    if (item.quantity <= quantity) {
      this.items.delete(itemId);
      return item;
    }

    item.quantity -= quantity;
    // Return a copy with the removed quantity
    const removedItem = Object.create(Object.getPrototypeOf(item));
    Object.assign(removedItem, item);
    removedItem.quantity = quantity;
    return removedItem;
  }

  @log
  useItem(itemId: string): boolean {
    const item = this.items.get(itemId);
    if (!item || !this.isUsable(item)) {
      return false;
    }

    const usableItem = item as T & Usable;
    usableItem.use();

    if (item.quantity <= 0) {
      this.items.delete(itemId);
    }

    return true;
  }

  getItem(itemId: string): T | undefined {
    return this.items.get(itemId);
  }

  getAllItems(): T[] {
    return Array.from(this.items.values());
  }

  getItemsByType(type: ItemType): T[] {
    return this.getAllItems().filter(item => item.type === type);
  }

  getTotalValue(): number {
    return this.getAllItems().reduce((total, item) => total + (item.value * item.quantity), 0);
  }

  getItemCount(): number {
    return this.getAllItems().reduce((total, item) => total + item.quantity, 0);
  }

  isEmpty(): boolean {
    return this.items.size === 0;
  }

  isFull(): boolean {
    return this.items.size >= this.maxSlots;
  }

  // Type guards
  private isStackable(item: T): item is T & Stackable {
    return 'stackable' in item && (item as any).stackable === true;
  }

  private isUsable(item: T): item is T & Usable {
    return 'usable' in item && (item as any).usable === true;
  }

  // Display inventory contents
  display(): void {
    console.log(`\n📦 Inventory (${this.items.size}/${this.maxSlots} slots):`);
    if (this.isEmpty()) {
      console.log("  Empty");
      return;
    }

    this.getAllItems().forEach(item => {
      console.log(`  ${item.getDescription()}`);
    });
    console.log(`💰 Total value: ${this.getTotalValue()} gold`);
  }
}

// TODO: Create specific item types
// - Armor class with defense bonus
// - Potion class with healing effects
// - Implement item crafting system
// - Add item rarity system (common, rare, epic, legendary)
