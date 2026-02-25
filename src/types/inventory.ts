export interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    category: string;
    packed: boolean;
    photoUrl?: string;
    notes?: string;
}

export interface InventoryItemProps {
    item: InventoryItem;
    onRemove: (id: string) => void;
    onTogglePacked?: (id: string) => void;
}

export interface InventoryState {
    items: InventoryItem[];
}