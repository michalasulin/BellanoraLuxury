import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function SweetHospitalityTrayesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
     fetch('http://localhost:4000/api/products', {
     credentials: 'include'
})      
.then(res => {
        if (!res.ok) throw new Error('שגיאה בטעינת מגשי האירוח המתוקים');
        return res.json();
      })
      .then(data => {
        setItems(data['Sweet Hospitality Trays'] || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>טוען מגשי אירוח מתוקים...</p>;
  if (error) return <p style={{ color: 'red' }}>שגיאה: {error}</p>;

  return (
    <div>
      <h2>Sweet Hospitality Trayes</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {items.map(tray => (
          <div key={tray.id} style={{ width: '300px', border: '1px solid #ccc', padding: '10px' }}>
            <Link to={`/tray/${tray.id}`}>
            <img
              src={`http://localhost:4000${tray.imgUrl}`}
              alt={tray.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            </Link>
            <h3>{tray.name}</h3>
            <p><b>price:</b> ₪{tray.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SweetHospitalityTrayesPage;
