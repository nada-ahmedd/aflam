import { createSlice } from '@reduxjs/toolkit';

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    data: [],
    topMovies: [],
    details: {},
    credits: {},
    videos: [],
    reviews: [],
    recommendations: [],
    images: {},
    keywords: [],
    externalIds: {},
    releaseDates: [],
    similar: [],
    searchResults: [],
  },
  reducers: {
    setMovies: (state, action) => { state.data = action.payload; },
    setTopMovies: (state, action) => { state.topMovies = action.payload; },
    setMovieDetails: (state, action) => { state.details = action.payload; },
    setMovieCredits: (state, action) => { state.credits = action.payload; },
    setMovieVideos: (state, action) => { state.videos = action.payload; },
    setMovieReviews: (state, action) => { state.reviews = action.payload; },
    setMovieRecommendations: (state, action) => { state.recommendations = action.payload; },
    setMovieImages: (state, action) => { state.images = action.payload; },
    setMovieKeywords: (state, action) => { state.keywords = action.payload; },
    setMovieExternalIds: (state, action) => { state.externalIds = action.payload; },
    setMovieReleaseDates: (state, action) => { state.releaseDates = action.payload; },
    setSimilarMovies: (state, action) => { state.similar = action.payload; },
    setSearchResults: (state, action) => { state.searchResults = action.payload; },
  },
});

export const {
  setMovies, setTopMovies, setMovieDetails, setMovieCredits, setMovieVideos, setMovieReviews,
  setMovieRecommendations, setMovieImages, setMovieKeywords, setMovieExternalIds,
  setMovieReleaseDates, setSimilarMovies, setSearchResults,
} = moviesSlice.actions;
export default moviesSlice.reducer;