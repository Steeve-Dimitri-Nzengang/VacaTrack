import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryItem } from '../../types/inventory';

interface InventoryState {
  items: InventoryItem[];
}

const initialState: InventoryState = {
  items: [],
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<InventoryItem>) {
      state.items.push(action.payload);
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateItem(state, action: PayloadAction<InventoryItem>) {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    togglePacked(state, action: PayloadAction<string>) {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.packed = !item.packed;
      }
    },
    setItems(state, action: PayloadAction<InventoryItem[]>) {
      state.items = action.payload;
    },
  },
});

export const { addItem, removeItem, updateItem, togglePacked, setItems } = inventorySlice.actions;

export default inventorySlice.reducer;