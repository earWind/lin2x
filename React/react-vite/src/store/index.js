import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "../reducer/counter";

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
});
