// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// function SavoryHospitalityTrayesDetailsPage() {
//   const { id } = useParams();
//   console.log("StrayId:", id); // הוסף שורה זו לבדוק

//   const [Stray, setSTray] = useState(null);
//   const [quantity, setQuantity] = useState(1);

//   // מצב להצגת הודעת הצלחה
//   const [showMessage, setShowMessage] = useState(false);

//   useEffect(() => {
//     const fetchSTray = async () => {
//       try {
//         console.log("StrayId:", id); // בדיקה
//         const response = await axios.get(
//           `http://localhost:4000/api/products/${id}`,
//           {
//             withCredentials: true
//           }
//         );
//         console.log(response.data); // מה השרת מחזיר
//         setSTray(response.data);
//       } catch (error) {
//         console.error("שגיאה בטעינת המוצר:", error);
//       }
//     };
//     fetchSTray();
//   }, [id]);

//   const handleQuantityChange = (e) => {
//     const val = Number(e.target.value);
//     if (val > 0 && val <= (Stray?.quantity || Infinity)) {
//       setQuantity(val);
//     }
//   };

//   if (!Stray) return <p>טוען...</p>;

//   return (
//     <div style={{ position: "relative", width: "320px", margin: "auto" }}>
//       {/* הודעת הצלחה */}
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
//          <span>✔</span> נוסף לסל בהצלחה!
//         </div>
//       )}

//       {/* סימן מים "אזל מהמלאי" */}
//       {Stray.quantity === 0 && (
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

//       <h2>{Stray.name}</h2>
//       <img
//         src={`http://localhost:4000${Stray.imgUrl}`}
//         alt={Stray.name}
//         width="300"
//         style={{ opacity: Stray.quantity === 0 ? 0.5 : 1 }}
//       />
//       <p>{Stray.description}</p>
//       <p>₪{Stray.price}</p>
//       <input
//         type="number"
//         value={quantity}
//         min={1}
//         max={Stray.quantity}
//         onChange={handleQuantityChange}
//         disabled={Stray.quantity === 0}
//       />
//     </div>
//   );
// }

// export default SavoryHospitalityTrayesDetailsPage;

import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux'; 
import { useParams } from "react-router-dom";
import axios from "axios";
import { addToCartThunk, loadCartThunk } from "../redux/thunks/cartThunks";

function SavoryHospitalityTrayesDetailsPage() {
  const { id } = useParams();
  const [Stray, setSTray] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showMessage, setShowMessage] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSTray = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/products/${id}`,
          { withCredentials: true }
        );
        setSTray(response.data);
      } catch (error) {
        console.error("שגיאה בטעינת המוצר:", error);
      }
    };
    fetchSTray();
    //dispatch(loadCartThunk());
  }, [id, dispatch]);

  const handleQuantityChange = (e) => {
    const val = Number(e.target.value);
    if (val > 0 && val <= (Stray?.quantity || Infinity)) {
      setQuantity(val);
    }
  };

  // const handleAddToCart = () => {
  //   dispatch(addToCartThunk(id, quantity,Stray.imgUrl,Stray.name, Stray.price));
  //   setShowMessage(true);
  //   setTimeout(() => setShowMessage(false), 3000);
  // };
  const handleAddToCart = async () => {
  try {
    await dispatch(addToCartThunk(id, quantity, Stray.imgUrl, Stray.name, Stray.price));
    setSTray(prev => ({ ...prev, quantity: prev.quantity - quantity }));
    setQuantity(1);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  } catch (error) {
    console.error("שגיאה בהוספה לסל:", error);
  }
};

  if (!Stray) return <p>טוען...</p>;

  return (
    <div style={{ position: "relative", width: "320px", margin: "auto" }}>
      {showMessage && (
        <div
          style={{
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
          }}
        >
          <span>✔</span> נוסף לסל בהצלחה!
        </div>
      )}

      {Stray.quantity === 0 && (
        <div
          style={{
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
          }}
        >
          אזל מהמלאי
        </div>
      )}

      <h2>{Stray.name}</h2>
      <img
        src={`http://localhost:4000${Stray.imgUrl}`}
        alt={Stray.name}
        width="300"
        style={{ opacity: Stray.quantity === 0 ? 0.5 : 1 }}
      />
      <p>{Stray.description}</p>
      <p>₪{Stray.price}</p>
      <input
        type="number"
        value={quantity}
        min={1}
        max={Stray.quantity}
        onChange={handleQuantityChange}
        disabled={Stray.quantity === 0}
      />
      <button onClick={handleAddToCart} disabled={Stray.quantity === 0}>
        הוסף לסל
      </button>
    </div>
  );
}

export default SavoryHospitalityTrayesDetailsPage;
