import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Activity } from '../../types/activity';

interface ActivitiesState {
    activities: Activity[];
}

const initialState: ActivitiesState = {
    activities: [],
};

const activitiesSlice = createSlice({
    name: 'activities',
    initialState,
    reducers: {
        addActivity(state, action: PayloadAction<Activity>) {
            state.activities.push(action.payload);
        },
        removeActivity(state, action: PayloadAction<string>) {
            state.activities = state.activities.filter(a => a.id !== action.payload);
        },
        updateActivity(state, action: PayloadAction<Activity>) {
            const index = state.activities.findIndex(a => a.id === action.payload.id);
            if (index !== -1) {
                state.activities[index] = action.payload;
            }
        },
        toggleActivity(state, action: PayloadAction<string>) {
            const activity = state.activities.find(a => a.id === action.payload);
            if (activity) {
                activity.completed = !activity.completed;
            }
        },
        setActivities(state, action: PayloadAction<Activity[]>) {
            state.activities = action.payload;
        },
    },
});

export const { addActivity, removeActivity, updateActivity, toggleActivity, setActivities } = activitiesSlice.actions;

export default activitiesSlice.reducer;