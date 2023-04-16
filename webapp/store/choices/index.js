import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showSidebar: false,
};

const choicesSlice = createSlice({
  name: "choicesReducer",
  initialState,
  reducers: {
    setShowSidebar(state, { payload }) {
      state.showSidebar = payload;
    },
  },
});

export const { setShowSidebar } = choicesSlice.actions;

export default choicesSlice.reducer;
