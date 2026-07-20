
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';  // גישה ל-Dispatch של Redux
import axios from 'axios';
import { addToCartThunk } from '../redux/thunks/cartThunks';  // עכשיו thunk במקום action רגיל

function SweetHospitalityTrayesDetailsPage() {
  const { id } = useParams();  // קבלת מזהה המוצר מה-URL
  const [tray, setTray] = useState(null);  // מצב למוצר
  const [quantity, setQuantity] = useState(1);  // מצב לכמות המוצר
  const [showMessage, setShowMessage] = useState(false);  // מצב להודעת הצלחה
  const dispatch = useDispatch();  // גישה ל-dispatch של Redux

  // חיבור ל-API כדי להוריד את פרטי המוצר
  useEffect(() => {
    const fetchTray = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/products/${id}`,
          { withCredentials: true }
        );
        setTray(response.data);
      } catch (error) {
        console.error('שגיאה בטעינת המוצר:', error);
      }
    };
    fetchTray();
  }, [id]);

  // עדכון כמות המוצר
  const handleQuantityChange = (e) => {
    const val = Number(e.target.value);
    if (val > 0 && val <= (tray?.quantity || Infinity)) {
      setQuantity(val);
    }
  };

  // הוספת המוצר לסל באמצעות Redux thunk
  // const handleAddToCart = () => {
  //   dispatch(addToCartThunk(id, quantity,tray.imgUrl,tray.name, tray.price));  // כאן העברנו ל-thunk את המזהה והכמות
  //   setShowMessage(true);  // הצגת הודעת הצלחה
  //   setTimeout(() => setShowMessage(false), 3000);  // הסתרת ההודעה אחרי 3 שניות
  // };
  const handleAddToCart = async () => {
  try {
    await dispatch(addToCartThunk(id, quantity, tray.imgUrl, tray.name, tray.price));
    setTray(prev => ({ ...prev, quantity: prev.quantity - quantity }));
    setQuantity(1);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  } catch (error) {
    console.error("שגיאה בהוספה לסל:", error);
  }
};

  // אם המוצר לא נטען עדיין
  if (!tray) return <p>טוען...</p>;

  return (
    <div style={{ position: 'relative', width: '320px', margin: 'auto' }}>
      {/* הודעת הצלחה */}
      {showMessage && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#4BB543',
            color: 'white',
            padding: '10px',
            borderRadius: '5px 5px 0 0',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            zIndex: 1000
          }}
        >
          <span>✔</span> נוסף לסל בהצלחה!
        </div>
      )}

      {/* סימן מים "אזל מהמלאי" */}
      {tray.quantity === 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
            pointerEvents: 'none'
          }}
        >
          אזל מהמלאי
        </div>
      )}

      <h2>{tray.name}</h2>
      <img
        src={`http://localhost:4000${tray.imgUrl}`}
        alt={tray.name}
        width="300"
        style={{ opacity: tray.quantity === 0 ? 0.5 : 1 }}
      />
      <p>{tray.description}</p>
      <p>₪{tray.price}</p>
      <input
        type="number"
        value={quantity}
        min={1}
        max={tray.quantity}
        onChange={handleQuantityChange}
        disabled={tray.quantity === 0}
      />
      <button onClick={handleAddToCart} disabled={tray.quantity === 0}>
        הוסף לסל
      </button> {/* כפתור ההוספה */}
    </div>
  );
}

export default SweetHospitalityTrayesDetailsPage;
