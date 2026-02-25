import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer from './slices/inventorySlice';
import activitiesReducer from './slices/activitiesSlice';
import budgetReducer from './slices/budgetSlice';
import logbookReducer from './slices/logbookSlice';
import tripReducer from './slices/tripSlice';
import { loadState, createPersistenceSubscriber } from './persistence';

const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    activities: activitiesReducer,
    budget: budgetReducer,
    logbook: logbookReducer,
    trip: tripReducer,
  },
});

// IndexedDB-Persistenz: State bei jeder Änderung speichern (debounced)
store.subscribe(createPersistenceSubscriber(store.getState));

// State beim Start laden und in den Store schreiben
export const hydrateStore = async () => {
  const persisted = await loadState();
  if (persisted) {
    if (persisted.inventory) store.dispatch({ type: 'inventory/setItems', payload: persisted.inventory.items });
    if (persisted.activities) store.dispatch({ type: 'activities/setActivities', payload: persisted.activities.activities });
    if (persisted.budget) {
      store.dispatch({ type: 'budget/setTotalBudget', payload: persisted.budget.totalBudget });
      store.dispatch({ type: 'budget/setCurrency', payload: persisted.budget.currency });
      persisted.budget.expenses.forEach(e => store.dispatch({ type: 'budget/addExpense', payload: e }));
    }
    if (persisted.logbook) store.dispatch({ type: 'logbook/setLogEntries', payload: persisted.logbook.entries });
    if (persisted.trip) {
      store.dispatch({ type: 'trip/updateSettings', payload: persisted.trip.settings });
      persisted.trip.trips.forEach(t => store.dispatch({ type: 'trip/addTrip', payload: t }));
    }
  }
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;