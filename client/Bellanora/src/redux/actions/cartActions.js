//src/redux/actions/cartActions.js
// This file contains action creators for managing the shopping cart in a Redux store.
export const addToCart = (product) => ({
  type: 'ADD_TO_CART',
  payload: product,
});

export const removeFromCart = (product) => ({
  type: 'REMOVE_FROM_CART',
  payload: product,
});

export const UPDATE_QUANTITY = 'UPDATE_QUANTITY';

export const updateQuantityPlus = (itemId) => ({
  type: 'UPDATE_QUANTITY_PLUS',
  payload: itemId,
});
export const updateQuantityLess = (itemId) => ({
  type: 'UPDATE_QUANTITY_LESS',
  payload: itemId,
})


export const setCart = (items) => ({
  type: 'SET_CART',
  payload: items,
});
