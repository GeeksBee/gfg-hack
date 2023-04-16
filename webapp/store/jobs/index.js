import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jobs: [],
};

const jobsSlice = createSlice({
  name: "jobsReducer",
  initialState,
  reducers: {
    storeJobs(state, { payload }) {
      state.jobs = payload;
    },
  },
});

export const { storeJobs } = jobsSlice.actions;

export default jobsSlice.reducer;
