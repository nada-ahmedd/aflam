import { createSlice } from '@reduxjs/toolkit';

const seriesSlice = createSlice({
  name: 'series',
  initialState: {
    data: [],
    topSeries: [],
    details: {},
    credits: {},
    videos: [],
    reviews: [],
    recommendations: [],
    images: {},
    keywords: [],
    externalIds: {},
    contentRatings: [],
    similar: [],
    seasons: {},
    episodes: {},
  },
  reducers: {
    setSeries: (state, action) => { state.data = action.payload; },
    setTopSeries: (state, action) => { state.topSeries = action.payload; },
    setSeriesDetails: (state, action) => { state.details = action.payload; },
    setSeriesCredits: (state, action) => { state.credits = action.payload; },
    setSeriesVideos: (state, action) => { state.videos = action.payload; },
    setSeriesReviews: (state, action) => { state.reviews = action.payload; },
    setSeriesRecommendations: (state, action) => { state.recommendations = action.payload; },
    setSeriesImages: (state, action) => { state.images = action.payload; },
    setSeriesKeywords: (state, action) => { state.keywords = action.payload; },
    setSeriesExternalIds: (state, action) => { state.externalIds = action.payload; },
    setSeriesContentRatings: (state, action) => { state.contentRatings = action.payload; },
    setSimilarSeries: (state, action) => { state.similar = action.payload; },
    setSeasonDetails: (state, action) => { state.seasons[action.payload.season_number] = action.payload; },
    setEpisodeDetails: (state, action) => {
      const { season_number, episode_number } = action.payload;
      if (!state.episodes[season_number]) state.episodes[season_number] = {};
      state.episodes[season_number][episode_number] = action.payload;
    },
  },
});

export const {
  setSeries, setTopSeries, setSeriesDetails, setSeriesCredits, setSeriesVideos, setSeriesReviews,
  setSeriesRecommendations, setSeriesImages, setSeriesKeywords, setSeriesExternalIds,
  setSeriesContentRatings, setSimilarSeries, setSeasonDetails, setEpisodeDetails,
} = seriesSlice.actions;
export default seriesSlice.reducer;