// import { useState, useEffect } from "react";
// import { useCart } from "../context/CartContext"; // ודא שאתה משתמש ב-Context
// import { useParams } from 'react-router-dom'; // הוספת ה-import הזה
// import axios from 'axios'; // ייבוא axios

// function SpecialEventsDetailsPage() {
//   const { id } = useParams();
//   const [event, setEvent] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [showMessage, setShowMessage] = useState(false);

//   const { addToCart } = useCart(); // גישה לפונקציה addToCart מתוך ה-Context

//   useEffect(() => {
//     const fetchEvent = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:4000/api/products/${id}`,
//           { withCredentials: true }
//         );
//         setEvent(response.data);
//       } catch (error) {
//         console.error("שגיאה בטעינת המוצר:", error);
//       }
//     };
//     fetchEvent();
//   }, [id]);

//   const handleQuantityChange = (e) => {
//     const val = Number(e.target.value);
//     if (val > 0 && val <= (event?.quantity || Infinity)) {
//       setQuantity(val);
//     }
//   };

//   const handleAddToCart = () => {
//     addToCart(event.id, quantity); // הוספת המוצר לסל
//     setShowMessage(true);
//     setTimeout(() => setShowMessage(false), 3000); // הסתרת ההודעה אחרי 3 שניות
//   };

//   if (!event) return <p>טוען...</p>;

//   return (
//     <div style={{ position: "relative", width: "320px", margin: "auto" }}>
//       {showMessage && (
//         <div style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           backgroundColor: "#4BB543",
//           color: "white",
//           padding: "10px",
//           borderRadius: "5px 5px 0 0",
//           fontWeight: "bold",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           gap: "8px",
//           zIndex: 1000
//         }}>
//           <span>✔</span> נוסף לסל בהצלחה!
//         </div>
//       )}

//       {event.quantity === 0 && (
//         <div style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: "rgba(0,0,0,0.5)",
//           color: "white",
//           fontSize: "24px",
//           fontWeight: "bold",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           zIndex: 999,
//           pointerEvents: "none"
//         }}>
//           אזל מהמלאי
//         </div>
//       )}

//       <h2>{event.name}</h2>
//       <img
//         src={`http://localhost:4000${event.imgUrl}`}
//         alt={event.name}
//         width="300"
//         style={{ opacity: event.quantity === 0 ? 0.5 : 1 }}
//       />
//       <p>{event.description}</p>
//       <p>₪{event.price}</p>
//       <input
//         type="number"
//         value={quantity}
//         min={1}
//         max={event.quantity}
//         onChange={handleQuantityChange}
//         disabled={event.quantity === 0}
//       />
//       <button onClick={handleAddToCart} disabled={event.quantity === 0}>
//         הוסף לסל
//       </button>
//     </div>
//   );
// }

// export default SpecialEventsDetailsPage;



import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { addToCartThunk, loadCartThunk } from '../redux/thunks/cartThunks';

function SpecialEventsDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showMessage, setShowMessage] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/products/${id}`,
          { withCredentials: true }
        );
        setEvent(response.data);
      } catch (error) {
        console.error("שגיאה בטעינת המוצר:", error);
      }
    };
    fetchEvent();
   // dispatch(loadCartThunk());
  }, [id, dispatch]);

  const handleQuantityChange = (e) => {
    const val = Number(e.target.value);
    if (val > 0 && val <= (event?.quantity || Infinity)) {
      setQuantity(val);
    }
  };

  // const handleAddToCart = () => {
  //   dispatch(addToCartThunk(id, quantity,event.imgUrl,event.name, event.price));
  //   setShowMessage(true);
  //   setTimeout(() => setShowMessage(false), 3000);
  // };
  const handleAddToCart = async () => {
  try {
    await dispatch(addToCartThunk(id, quantity, event.imgUrl, event.name, event.price));
    setEvent(prev => ({ ...prev, quantity: prev.quantity - quantity }));
    setQuantity(1);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  } catch (error) {
    console.error("שגיאה בהוספה לסל:", error);
  }
};

  if (!event) return <p>טוען...</p>;

  return (
    <div style={{ position: "relative", width: "320px", margin: "auto" }}>
      {showMessage && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "#4BB543",
          color: "white",
          padding: "10px",
          borderRadius: "5px 5px 0 0",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          zIndex: 1000
        }}>
          <span>✔</span> נוסף לסל בהצלחה!
        </div>
      )}

      {event.quantity === 0 && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          color: "white",
          fontSize: "24px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999,
          pointerEvents: "none"
        }}>
          אזל מהמלאי
        </div>
      )}

      <h2>{event.name}</h2>
      <img
        src={`http://localhost:4000${event.imgUrl}`}
        alt={event.name}
        width="300"
        style={{ opacity: event.quantity === 0 ? 0.5 : 1 }}
      />
      <p>{event.description}</p>
      <p>₪{event.price}</p>
      <input
        type="number"
        value={quantity}
        min={1}
        max={event.quantity}
        onChange={handleQuantityChange}
        disabled={event.quantity === 0}
      />
      <button onClick={handleAddToCart} disabled={event.quantity === 0}>
        הוסף לסל
      </button>
    </div>
  );
}

export default SpecialEventsDetailsPage;
