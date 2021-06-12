import { createStore , applyMiddleware} from '@reduxjs/toolkit';
import thunk from "redux-thunk";
import cinemaReducer from '../cinemaSlice';

export const store = createStore(cinemaReducer, applyMiddleware(thunk));
