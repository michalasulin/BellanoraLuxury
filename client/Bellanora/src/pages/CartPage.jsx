// Bellanora/src/pages/CartPage.jsx
/*import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantityPlus } from '../redux/actions/cartActions';
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { loadCartThunk,removeFromCartThunk, updateQuantityThunkPlus} from "../redux/thunks/cartThunks";

import { removeFromCart, updateQuantityPlus, updateQuantityLess } from '../redux/actions/cartActions';
import { loadCartThunk, removeFromCartThunk, updateQuantityThunkPlus, updateQuantityThunkLess } from "../redux/thunks/cartThunks";
*/
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
//import { removeFromCart, updateQuantityPlus, updateQuantityLess } from '../redux/actions/cartActions';
import { loadCartThunk, removeFromCartThunk, updateQuantityThunkPlus, updateQuantityThunkLess } from "../redux/thunks/cartThunks";

function CartPage() {
  const cartItems = useSelector(state => state.cart.cartItems);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [showMessage, setShowMessage] = useState(false);
 // const [hover, setHover] = useState(false);
  const [e, setE] = useState(null);

  const [quantity, setQuantity] = useState(1);
useEffect(() => {
  dispatch(loadCartThunk());
}, [dispatch]);

  
  const handleRemove = (productId,quantity) => {
    dispatch(removeFromCartThunk(productId,quantity));
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };







// const handleUpdateQuantityPlus = async (itemId, quantity) => {
//   // בדיקה אם הכמות היא 0 או פחות לפני העדכון
//   if (quantity < 1) return; 

//   // עדכון הכמות בסל הפרונטלי
//   dispatch(updateQuantityPlus(itemId, quantity));

//   // קריאה לפונקציה בשרת לעדכון הכמות
//    dispatch(updateQuantityThunkPlus(itemId, quantity));
//   setShowMessage(true);
//   setTimeout(() => setShowMessage(false), 3000);
// };

const handleUpdateQuantityPlus = (itemId) => {
  const item = cartItems.find(i => i.productId === itemId);
  if (item && item.stockQuantity !== undefined && item.stockQuantity <= 0) {
    alert("המוצר אזל מהמלאי");
    return;
  }
  dispatch(updateQuantityThunkPlus(itemId));
};

// const handleUpdateQuantityPlus = async (itemId, quantity) => {
//   // בדיקה אם הכמות היא 0 או פחות לפני העדכון
//   if (quantity < 1) return;

//   // מצא את המוצר מתוך cartItems
//   const item = cartItems.find(item => item.productId === itemId);
  
//   // בדוק אם המוצר קיים
//   if (!item) return;

//   // בדוק אם הכמות החדשה חורגת מהמלאי
//   if (quantity >= item.quantity) {
//     alert('לא ניתן להוסיף יותר מהמלאי הקיים');
//     return;
//   }

//   // עדכון הכמות בסל הפרונטלי
//   dispatch(updateQuantityPlus(itemId, quantity));

//   // קריאה לפונקציה בשרת לעדכון הכמות
//   dispatch(updateQuantityThunkPlus(itemId, quantity));
//   setShowMessage(true);
//   setTimeout(() => setShowMessage(false), 3000);
// };




// const handleUpdateQuantityLess = (itemId, quantity) => {
//   // בדיקה אם הכמות היא 1 או פחות לפני העדכון 
//   if (quantity <= 1) return;
//   // עדכון הכמות בסל הפרונטלי     
//   dispatch(updateQuantityLess(itemId, quantity));
//   // קריאה לפונקציה בשרת לעדכון הכמות
//   dispatch(updateQuantityThunkLess(itemId, quantity));
//   setShowMessage(true);
//   setTimeout(() => setShowMessage(false), 3000);
// };

const handleUpdateQuantityLess = (itemId, quantity) => {
  if (quantity <= 1) return;
  dispatch(updateQuantityThunkLess(itemId));
};


const handleOrder = async () => {
  try {
    const response = await axios.post(
      'http://localhost:4000/api/orders',
      { items: cartItems },
      { withCredentials: true }
    );
    if (response.data.success) {
      alert('ההזמנה בוצעה בהצלחה!');
      dispatch(loadCartThunk()); // טען את הסל מחדש לאחר ביצוע ההזמנה
      // כאן תוכל להוסיף קוד להפנות את המשתמש לעמוד אחר או לנקות את הסל
    } else {
      alert('אירעה שגיאה בביצוע ההזמנה, אנא נסה) שנית.');

    }
  } catch (error) {
    console.error("שגיאה בביצוע ההזמנה:", error);
    alert('אירעה שגיאה בביצוע ההזמנה, אנא נסה שנית.');
  }
};  
 
const calculateTotal = (cartItems) => {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
};

const totalAmount = calculateTotal(cartItems); // פונקציה לחישוב הסכום הסופי

return (
  <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
    {cartItems.length === 0 ? (
      <p style={{ textAlign: 'center', color: '#777' }}>הסל ריק</p>
    ) : (
      <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexWrap: 'wrap' }}>
        {cartItems.reduce((rows, item, index) => {
          if (index % 2 === 0) rows.push([]); // התחלת שורה חדשה
          rows[rows.length - 1].push(item); // הוספת מוצר לשורה הנוכחית
          return rows;
        }, []).map((rowItems, rowIndex) => (
          <li key={rowIndex} style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
            {rowItems.map(item => (
              <div key={item.productId} style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ddd',
                borderRadius: '8px',
                margin: '5px',
                padding: '10px',
                position: 'relative',
                width: 'calc(50% - 10px)', // כל מוצר תופס חצי מהשורה
                height: '200px', // גובה מוגדל
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              }}>
                <div style={{
                  position: 'absolute',
                  border: '2px solid rgba(214, 180, 10, 0.3)',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(http://localhost:4000${item.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.7,
                  borderRadius: '8px',
                  zIndex: 0,
                }} />

    
            {/*<img
                  src={`http://localhost:4000${item.url}`}
                  style={{ borderRadius: '8px', position: 'absolute', width: '180px', right: '10px', top: '2px', border: '2px solid rgba(0,0,0,0.4)', height: '210px', zIndex: 1 }} // גובה מותאם לתמונה
                  alt={item.Name}
                />*/}
                <div style={{ flex: 1, padding: '10px', color: '#fff', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                <h2 style={{
                      textAlign: 'center',
                      fontFamily: 'Forte',
                      fontSize: '35px',
                      color: '#10100fff',
                     textShadow: '1px 1px 0 #FFD700, -1px -1px 0 #FFD700, 1px -1px 0 #FFD700, -1px 1px 0 #FFD700'

                     // textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000' // מסגרת שחורה לאותיות
                           }}>
                      {item.Name}
                </h2>               
                   <p style={{ margin: '5px 0', fontWeight: 'bold', textAlign: 'left',
                      color: '#000',
                      fontFamily: 'Forte',
                      textShadow: '1px 1px 0 #FFD700, -1px -1px 0 #FFD700, 1px -1px 0 #FFD700, -1px 1px 0 #FFD700'
                    }}>price {item.price}₪</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                      <button onClick={() => handleUpdateQuantityLess(item.productId, item.quantity)} style={{
                      marginRight: '5px',
                      backgroundColor: '#FFD700',
                      color: '#000',
                      border: '2px solid #000',
                      borderRadius: '5px',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}>-</button>
                    <span style={{
                      fontFamily: 'Forte',
                    fontWeight: 'bold', textAlign: 'left' , color: '#000',
                      textShadow: '1px 1px 0 #FFD700, -1px -1px 0 #FFD700, 1px -1px 0 #FFD700, -1px 1px 0 #FFD700' // מסגרת שחורה לאותיות
                    }}>{item.quantity}</span>
                  <button
  //onClick={() => handleUpdateQuantityPlus(item.productId)}
//onClick={() => handleUpdateQuantityPlus(item.productId, item.quantity)}
  onClick={() => handleUpdateQuantityPlus(item.productId)}

  // style={{
  //   marginLeft: '5px',
  //   //backgroundColor: item.quantity >= item.maxQuantity ? '#ccc' : '#FFD700', // משנה צבע כשמושבת
  //   backgroundColor: item.quantity <= 1 ? '#ccc' : '#FFD700',
  //   color: '#000',
  //   border: '2px solid #000',
  //   borderRadius: '5px',
  //   padding: '5px 10px',
  //   //cursor: item.quantity >= item.maxQuantity ? 'not-allowed' : 'pointer',
  //   cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
  //   fontSize: '14px',
  // }}

 style={{
    marginLeft: '5px',
    backgroundColor: '#FFD700',
    color: '#000',
    border: '2px solid #000',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
    fontSize: '14px',
  }}

>
  +
</button>

                  </div>
                  <p style={{ margin: '5px 0',                    
                    fontFamily: 'Forte',
                    fontWeight: 'bold', textAlign: 'left' , color: '#000',
                    textShadow: '1px 1px 0 #FFD700, -1px -1px 0 #FFD700, 1px -1px 0 #FFD700, -1px 1px 0 #FFD700'
                    }}
                    >total:  
                         {item.price * item.quantity}₪</p>
                  <button onClick={() => 
                                   handleRemove(item.productId)} 
                                   style={{
                                   backgroundColor: 'transparent',
                                   cursor: 'pointer',
                                   padding: '0',
                                   fontSize: '20px', // תוכל להתאים את הגודל של האייקון
                                   marginLeft: '20px', // כאן תוכל לשנות את המספר לפיקסלים הרצויים
                                   marginBottom: '20px' ,// כאן תוכל לשנות את המספר לפיקסלים הרצויים
                                   border: 'none', // הוסף את השורה הזו כדי לבטל את המסגרת

                   }}>
                       🗑️
                   </button>

                </div>
              </div>
            ))}
          </li>
        ))}
      </ul>
    )}


 <div>
    
    <div style={{ marginTop: '20px', textAlign: 'center', textAlign: 'center',
                      fontFamily: 'Gan CLM',
                      fontSize: '15px',
                      color: '#000',
                      textShadow: '1px 1px 0 #FFD700, -1px -1px 0 #FFD700, 1px -1px 0 #FFD700, -1px 1px 0 #FFD700' }}>
      <h3>Total to be paid{totalAmount} ש"ח</h3>
                <button 
                     onClick={handleOrder}
                     style={{
                     background: "rgba(255, 255, 255, 0.1)",
                      padding: "12px 32px",
                      marginBottom: "20px",
                      borderRadius: "12px",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: "2px solid #FFD700",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
                      cursor: "pointer",
                      transition: "all 0.3s ease-in-out",
                      textAlign: 'center',
                      fontFamily: 'Forte',
                      fontSize: '15px',
                      color: '#000',
                      textShadow: '1px 1px 0 #FFD700, -1px -1px 0 #FFD700, 1px -1px 0 #FFD700, -1px 1px 0 #FFD700'
     
     }}>
          Place an order
      </button>
    </div>
  </div>

  </div>



);

}
export default CartPage;