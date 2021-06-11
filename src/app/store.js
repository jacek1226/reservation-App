import { configureStore } from '@reduxjs/toolkit';
import cinemaReducer from '../cinemaSlice';

export const store = configureStore({
  reducer: {
    cinema: cinemaReducer,
  },
});
