import { Tab } from '../types';

const STORAGE_KEY = 'quadwos-hub-data';

/**
 * A type for the entire stored state, mapping each tab to its data.
 * Example: { 'faq': { businessDescription: '...', faqs: [] }, 'email': { ... } }
 */
type AppState = {
    [key in Tab]?: any;
};

/**
 * Reads the entire state object from localStorage.
 * Includes error handling for cases where localStorage is unavailable or data is corrupted.
 * @returns The parsed state object from localStorage, or an empty object if an error occurs.
 */
const getFullState = (): AppState => {
    try {
        const rawData = localStorage.getItem(STORAGE_KEY);
        return rawData ? JSON.parse(rawData) : {};
    } catch (error) {
        console.error("Error reading from localStorage", error);
        return {};
    }
};

/**
 * Writes the entire state object to localStorage.
 * @param state The complete application state to be saved.
 */
const setFullState = (state: AppState) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error("Error writing to localStorage", error);
    }
};

/**
 * Loads the saved state for a specific tool/tab.
 * @param tab The enum identifier for the tab (e.g., Tab.FAQ).
 * @returns The saved state for that tab, or null if not found.
 */
export const loadStateForTab = <T,>(tab: Tab): T | null => {
    const state = getFullState();
    return state[tab] || null;
};

/**
 * Saves the state for a specific tool/tab. It merges the new data with the existing
 * state to ensure data from other tabs is not overwritten.
 * @param tab The enum identifier for the tab (e.g., Tab.FAQ).
 * @param data The new state data for that tab.
 */
export const saveStateForTab = (tab: Tab, data: any) => {
    const state = getFullState();
    // Update the state for the specific tab
    state[tab] = data;
    setFullState(state);
};