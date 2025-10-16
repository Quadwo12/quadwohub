import { Tab } from '../types';

const STORAGE_KEY = 'quadwos-hub-data';

// A type for the entire stored state, mapping each tab to its data.
type AppState = {
    [key in Tab]?: any;
};

// Reads the entire state object from localStorage.
const getFullState = (): AppState => {
    try {
        const rawData = localStorage.getItem(STORAGE_KEY);
        return rawData ? JSON.parse(rawData) : {};
    } catch (error) {
        console.error("Error reading from localStorage", error);
        return {};
    }
};

// Writes the entire state object to localStorage.
const setFullState = (state: AppState) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error("Error writing to localStorage", error);
    }
};

// Loads the saved state for a specific tool/tab.
export const loadStateForTab = <T,>(tab: Tab): T | null => {
    const state = getFullState();
    return state[tab] || null;
};

// Saves the state for a specific tool/tab.
export const saveStateForTab = (tab: Tab, data: any) => {
    const state = getFullState();
    // Update the state for the specific tab
    state[tab] = data;
    setFullState(state);
};