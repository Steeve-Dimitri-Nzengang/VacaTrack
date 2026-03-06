import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BudgetState, Expense } from '../../types/budget';

const initialState: BudgetState = {
  totalBudget: 0,
  currency: 'EUR',
  expenses: [],
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    setTotalBudget(state, action: PayloadAction<number>) {
      state.totalBudget = action.payload;
    },
    setCurrency(state, action: PayloadAction<string>) {
      state.currency = action.payload;
    },
    addExpense(state, action: PayloadAction<Expense>) {
      state.expenses.push(action.payload);
    },
    removeExpense(state, action: PayloadAction<string>) {
      state.expenses = state.expenses.filter(e => e.id !== action.payload);
    },
    updateExpense(state, action: PayloadAction<Expense>) {
      const index = state.expenses.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },
    clearExpenses(state) {
      state.expenses = [];
    },
    setExpenses(state, action: PayloadAction<Expense[]>) {
      state.expenses = action.payload;
    },
  },
});

export const { setTotalBudget, setCurrency, addExpense, removeExpense, updateExpense, clearExpenses, setExpenses } = budgetSlice.actions;

export default budgetSlice.reducer;