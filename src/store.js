import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './slices/moviesSlice';
import seriesReducer from './slices/seriesSlice';
import searchReducer from './slices/searchSlice';
import personReducer from './slices/personSlice'; 
const store = configureStore({
  reducer: {
    movies: moviesReducer,
    series: seriesReducer,
        search: searchReducer,
    person: personReducer,
  },
});

export default store;