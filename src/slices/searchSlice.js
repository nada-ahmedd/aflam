import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    results: [],
  },
  reducers: {
    setSearchResults: (state, action) => {
      state.results = action.payload;
    },
  },
});

export const { setSearchResults } = searchSlice.actions;
export default searchSlice.reducer;