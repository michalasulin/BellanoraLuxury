// src/redux/thunks/cartThunks.js
import axios from 'axios';
import * as authService from '../../api/authService';
import { addToCart as addToCartAction, setCart as setCartAction } from '../actions/cartActions';

// פעולה לטעינת סל מהשרת והעדכון ברידוסר
export const loadCartThunk = () => async (dispatch) => {
  try {
    const data = await authService.getCart(); // ← עכשיו זה יעבוד
    dispatch(setCartAction(data.items)); // לפי הפורמט ששרת מחזיר
  } catch (error) {
    console.error("שגיאה בטעינת הסל:", error);
  }
};


// פעולה להוספת פריט לסל עם עדכון מהשרת
export const addToCartThunk = (productId, quantity,url, Name , price) => async (dispatch) => {
  try {
    const data = await authService.addToCart(productId, quantity, url, Name, price); // שלח את הבקשה להוספת המוצר

     console.log("📦 תגובה מהשרת אחרי הוספת מוצר:", data);
    // אם השרת מחזיר את הסל המעודכן, עדכן את הסל
      // כאן dispatch את כל סל מעודכן ששרת מחזיר
    if (data.cart && data.cart.items) {
      dispatch(setCartAction(data.cart.items)); 
    }
  } catch (error) {
    console.error("שגיאה בהוספת מוצר לסל:", error);
  }
};

// פעולה למחיקת פריט מהסל
export const removeFromCartThunk = (productId) => async (dispatch) => {
  try {
    console.log("מנסה למחוק מוצר עם ID:", productId); // לוג לפני הבקשה
    const data = await authService.removeFromCart(productId); // שלח את הבקשה למחוק את המוצר
    console.log("🗑️ תגובה מהשרת אחרי מחיקת מוצר:", data);

    //await authService.updateProductQuantity(productId, quantityToRestore);
    // אם השרת מחזיר את הסל המעודכן, עדכן את הסל
    if (data.cart && data.cart.items) {
      dispatch(setCartAction(data.cart.items)); // עדכן את הסל עם הפריטים המעודכנים
    } else {
      console.error("התגובה מהשרת לא מכילה את הסל המעודכן:", data);
    }
  } catch (error) {
    console.error("שגיאה במחיקת מוצר מהסל:", error);
  }
};



// export const updateQuantityThunkPlus = (itemId) => async (dispatch) => {
//     try {
//       // קריאה ל-API לעדכון הכמות בשרת
//       const res = await authService.updateQuantityPlus(itemId); // הנח שיש לך פונקציה כזו ב-API{
//       console.log("🔄 תגובה מהשרת אחרי עדכון כמות:", res);

//       if (res.cart && res.cart.items) {
//         dispatch(setCartAction(res.cart.items)); // עדכן את הסל עם הפריטים המעודכנים
//       }else {
//         console.error("התגובה מהשרת לא מכילה את הסל המעודכן:", res);
//       }

      
//     } catch (error) {
//       console.error('Error updating quantity:', error);
//     }
//   };
export const updateQuantityThunkPlus = (itemId) => async (dispatch) => {
  try {
    const res = await authService.updateQuantityPlus(itemId);
    if (res.cart && res.cart.items) {
      // הוסף stockQuantity לפריט הרלוונטי
      const itemsWithStock = res.cart.items.map(item =>
        item.productId == itemId
          ? { ...item, stockQuantity: res.product.quantity }
          : item
      );
      dispatch(setCartAction(itemsWithStock));
    }
  } catch (error) {
    if (error.response?.status === 400) {
      alert("המוצר אזל מהמלאי");
    }
    console.error('Error updating quantity:', error);
  }
};

// export const updateQuantityThunkPlus = (itemId) => async (dispatch) => {
//   try {
//     const res = await authService.updateQuantityPlus(itemId);
//     if (res.cart && res.cart.items) {
//       dispatch(setCartAction(res.cart.items));
//     }
//   } catch (error) {
//     if (error.response?.status === 400) {
//       alert(error.response.data.message); // "המוצר אזל מהמלאי"
//     }
//     console.error('Error updating quantity:', error);
//   }
// };


// export const updateQuantityThunkPlus = (itemId) => async (dispatch, getState) => {
//   try {
//     const state = getState();
//     const item = state.cart.cartItems.find(i => i.productId === itemId);
//     if (!item) return;

//     // קח את הערך המעודכן מהשרת או maxQuantity מה־item
//     const maxQuantity = item.maxQuantity || 10; // ברירת מחדל אם אין
//     if (item.quantity >= maxQuantity) {
//       alert("כמות המוצר הגיעה למקסימום האפשרי");
//       return; // מחזיר בלי לקרוא לשרת
//     }

//     const res = await authService.updateQuantityPlus(itemId);

//     // עדכון הסל מהשרת
//     dispatch(setCartAction(res.cart?.items || state.cart.cartItems));

//   } catch (error) {
//     console.error('Error updating quantity:', error);
//   }
// };


  export const updateQuantityThunkLess = (itemId) => async (dispatch) => {
  
    try {
      // קריאה ל-API לעדכון הכמות בשרת
      const res = await authService.updateQuantityLess(itemId); // הנח שיש לך פונקציה כזו ב-API{
      console.log("🔄 תגובה מהשרת אחרי עדכון כמות:", res);

      if (res.cart && res.cart.items) {
        dispatch(setCartAction(res.cart.items)); // עדכן את הסל עם הפריטים המעודכנים
      }else {
        console.error("התגובה מהשרת לא מכילה את הסל המעודכן:", res);
      }

      
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };
