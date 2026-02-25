import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Trip, Settings, TripState } from '../../types/trip';

const initialState: TripState = {
  trips: [],
  selectedTripId: null,
  settings: {
    currency: 'EUR',
    language: 'de',
    theme: 'light',
  },
};

const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    addTrip(state, action: PayloadAction<Trip>) {
      state.trips.push(action.payload);
    },
    removeTrip(state, action: PayloadAction<string>) {
      state.trips = state.trips.filter(trip => trip.id !== action.payload);
    },
    selectTrip(state, action: PayloadAction<string>) {
      state.selectedTripId = action.payload;
    },
    deselectTrip(state) {
      state.selectedTripId = null;
    },
    updateTrip(state, action: PayloadAction<Trip>) {
      const index = state.trips.findIndex(trip => trip.id === action.payload.id);
      if (index !== -1) {
        state.trips[index] = action.payload;
      }
    },
    updateSettings(state, action: PayloadAction<Partial<Settings>>) {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
});

export const { addTrip, removeTrip, selectTrip, deselectTrip, updateTrip, updateSettings } = tripSlice.actions;

export default tripSlice.reducer;