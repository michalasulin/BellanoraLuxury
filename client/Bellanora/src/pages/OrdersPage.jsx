import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/orders', {
          withCredentials: true,
        });
        setOrders(res.data);
      } catch (err) {
        console.error('שגיאה בשליפת ההזמנות:', err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>ההזמנות שלי</h2>
      {orders.length === 0 ? (
        <p>לא נמצאו הזמנות</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={{ border: '1px solid #ccc', margin: '20px', padding: '15px' }}>
            <h3>הזמנה #{order.id}</h3>
            <p><strong>תאריך הזמנה:</strong> {order.orderDate}</p>
            <p><strong>תאריך אספקה:</strong> {order.dueDate}</p>

            <h4>מוצרים בהזמנה:</h4>
            <ul>
              {order.cart.map((item, index) => (
                <li key={index}>
                  {item.name} – כמות: {item.quantity} – מחיר ליחידה: {item.price} ₪
                </li>
              ))}
            </ul>

            <p>
              <strong>סה"כ:</strong>{' '}
              {order.cart.reduce((sum, item) => sum + item.quantity * item.price, 0)} ₪
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default OrdersPage;
