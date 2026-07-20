// src/redux/store.js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import {thunk} from 'redux-thunk';
import cartReducer from './reducers/cartReducer';

const rootReducer = combineReducers({
  cart: cartReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
