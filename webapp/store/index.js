import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user";
import choicesSlice from "./choices";
import jobsSlice from "./jobs";

const reducer = {
  user: userSlice,
  choices: choicesSlice,
  jobs: jobsSlice,
};

const store = configureStore({
  reducer: reducer,
});

export default store;
