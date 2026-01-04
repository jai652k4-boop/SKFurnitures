import { createSlice } from '@reduxjs/toolkit';

const loadFavoritesFromStorage = () => {
    try {
        const favorites = localStorage.getItem('favorites');
        return favorites ? JSON.parse(favorites) : [];
    } catch { return []; }
};

const saveFavoritesToStorage = (items) => {
    localStorage.setItem('favorites', JSON.stringify(items));
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: {
        items: loadFavoritesFromStorage()
    },
    reducers: {
        addToFavorites: (state, action) => {
            const product = action.payload;
            const exists = state.items.find(item => item._id === product._id);

            if (!exists) {
                state.items.push(product);
                saveFavoritesToStorage(state.items);
            }
        },
        removeFromFavorites: (state, action) => {
            state.items = state.items.filter(item => item._id !== action.payload);
            saveFavoritesToStorage(state.items);
        },
        toggleFavorite: (state, action) => {
            const product = action.payload;
            const exists = state.items.find(item => item._id === product._id);

            if (exists) {
                state.items = state.items.filter(item => item._id !== product._id);
            } else {
                state.items.push(product);
            }
            saveFavoritesToStorage(state.items);
        },
        clearFavorites: (state) => {
            state.items = [];
            localStorage.removeItem('favorites');
        },
        syncFavoritesFromServer: (state, action) => {
            state.items = action.payload;
            saveFavoritesToStorage(state.items);
        }
    }
});

export const { addToFavorites, removeFromFavorites, toggleFavorite, clearFavorites, syncFavoritesFromServer } = favoritesSlice.actions;
export default favoritesSlice.reducer;
