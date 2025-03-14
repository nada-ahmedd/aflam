import { createSlice } from '@reduxjs/toolkit';

const personSlice = createSlice({
  name: 'person',
  initialState: {
    details: {},
    combinedCredits: {},
    images: {},
    externalIds: {},
    movieCredits: {},
    tvCredits: {},
  },
  reducers: {
    setPersonDetails: (state, action) => { state.details = action.payload; },
    setPersonCombinedCredits: (state, action) => { state.combinedCredits = action.payload; },
    setPersonImages: (state, action) => { state.images = action.payload; },
    setPersonExternalIds: (state, action) => { state.externalIds = action.payload; },
    setPersonMovieCredits: (state, action) => { state.movieCredits = action.payload; },
    setPersonTVCredits: (state, action) => { state.tvCredits = action.payload; },
  },
});

export const {
  setPersonDetails, setPersonCombinedCredits, setPersonImages, setPersonExternalIds,
  setPersonMovieCredits, setPersonTVCredits,
} = personSlice.actions;
export default personSlice.reducer;