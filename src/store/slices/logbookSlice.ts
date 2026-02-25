import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LogEntry } from '../../types/logbook';
import { RootState } from '../index';

interface LogbookState {
  entries: LogEntry[];
}

const initialState: LogbookState = {
  entries: [],
};

const logbookSlice = createSlice({
  name: 'logbook',
  initialState,
  reducers: {
    addLogEntry(state, action: PayloadAction<LogEntry>) {
      state.entries.push(action.payload);
    },
    removeLogEntry(state, action: PayloadAction<string>) {
      state.entries = state.entries.filter(entry => entry.id !== action.payload);
    },
    updateLogEntry(state, action: PayloadAction<LogEntry>) {
      const index = state.entries.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.entries[index] = action.payload;
      }
    },
    setLogEntries(state, action: PayloadAction<LogEntry[]>) {
      state.entries = action.payload;
    },
  },
});

export const { addLogEntry, removeLogEntry, updateLogEntry, setLogEntries } = logbookSlice.actions;

export const selectLogEntries = (state: RootState) => state.logbook.entries;

export default logbookSlice.reducer;