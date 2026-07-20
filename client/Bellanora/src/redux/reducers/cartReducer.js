// src/redux/reducers/cartReducer.js


const initialState = {
  cartItems: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      // אם המוצר כבר קיים בעגלה - עדכן את הכמות
      const existingIndex = state.cartItems.findIndex(
        item => item.productId === action.payload.productId
      );

      if (existingIndex !== -1) {
        const updatedItems = [...state.cartItems];
        updatedItems[existingIndex].quantity += action.payload.quantity;
        return {
          ...state,
          cartItems: updatedItems,
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, action.payload],
        };
      }

    case 'REMOVE_FROM_CART':
     


  if (!action.payload || !action.payload.productId) {
    console.error("שגיאה: אין productId למחיקה");
    return state; // מחזיר את ה-state הקודם אם אין productId
  }
  return {
    ...state,
    cartItems: state.cartItems.filter(item => item.productId !== action.payload.productId),
  };

    case 'UPDATE_QUANTITY_PLUS':
  return {
    ...state,
    cartItems: state.cartItems.map(item =>
      item.productId === action.payload // ודא שאתה משתמש באותו מזהה
        ? { ...item, quantity: item.quantity + 1 } // מוסיף 1
        : item
    ),
  };

      case 'UPDATE_QUANTITY_LESS':
  return {
    ...state,
    cartItems: state.cartItems.map(item =>
      item.productId === action.payload // ודא שאתה משתמש באותו מזהה
        ? { ...item, quantity: Math.max(item.quantity - 1, 0) } // מוריד 1, לא פחות מ-0
        : item
    ),
  };


    case 'SET_CART':
      return {
        ...state,
        cartItems: action.payload,
      };

    default:
      return state;
  }
};

export default cartReducer;
