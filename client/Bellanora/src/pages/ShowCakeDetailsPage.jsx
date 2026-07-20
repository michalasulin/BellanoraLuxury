//Bellanora/src/pages/ShowCakeDetailsPage
import { useState, useEffect } from "react";
import { useDispatch ,useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import axios from "axios";
import { addToCartThunk, loadCartThunk } from "../redux/thunks/cartThunks";

function ShowCakeDetailsPage() {
  const { id } = useParams();
  const [cake, setCake] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showMessage, setShowMessage] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.cartItems);

  useEffect(() => {
    const fetchCake = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/products/${id}`,
          { withCredentials: true }
        );
        setCake(response.data);
      } catch (error) {
        console.error("שגיאה בטעינת המוצר:", error);
      }
    };
    fetchCake();
     //dispatch(loadCartThunk());
  }, [id, dispatch]);


  const handleQuantityChange = (e) => {
    const val = Number(e.target.value);
    if (val > 0 && val <= (cake?.quantity || Infinity)) {
      setQuantity(val);
    }
  };

  // const handleAddToCart = () => {
 
  //   dispatch(addToCartThunk(id, quantity, cake.imgUrl, cake.name, cake.price));
  //   setShowMessage(true);
  //   setTimeout(() => setShowMessage(false), 3000);
  // };
const handleAddToCart = async () => {
  try {
    await dispatch(addToCartThunk(id, quantity, cake.imgUrl, cake.name, cake.price));
    setCake(prev => ({ ...prev, quantity: prev.quantity - quantity }));
    setQuantity(1);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  } catch (error) {
    console.error("שגיאה בהוספה לסל:", error);
  }
};



  if (!cake) return <p>טוען...</p>;

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

      {cake.quantity === 0 && (
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

      <h2>{cake.name}</h2>
      <img
        src={`http://localhost:4000${cake.imgUrl}`}
        alt={cake.name}
        width="300"
        style={{ opacity: cake.quantity === 0 ? 0.5 : 1 }}
      />
      <p>{cake.description}</p>
      <p>₪{cake.price}</p>
      <input
        type="number"
        value={quantity}
        min={1}
        max={cake.quantity}
        onChange={handleQuantityChange}
        disabled={cake.quantity === 0}
      />
      <button onClick={handleAddToCart} disabled={cake.quantity === 0}>
        הוסף לסל
      </button>
    </div>
  );
}

export default ShowCakeDetailsPage;
