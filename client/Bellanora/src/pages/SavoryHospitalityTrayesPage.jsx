import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function SavoryHospitalityTrayesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
fetch('http://localhost:4000/api/products', {
    credentials: 'include'
})     
 .then(res => {
        if (!res.ok) throw new Error('שגיאה בטעינת מגשי האירוח המלוחים');
        return res.json();
      })
      .then(data => {
        setItems(data["Savory Hospitality Trays"] || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>טוען מגשי אירוח מלוחים...</p>;
  if (error) return <p style={{ color: 'red' }}>שגיאה: {error}</p>;

  return (
    <div>
        <h2>Savory Hospitality Trayes</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {items.map(Stray => (
          <div key={Stray.id} style={{ width: '300px', border: '1px solid #ccc', padding: '10px' }}>
             <Link to={`/stray/${Stray.id}`}>

            <img
              src={`http://localhost:4000${Stray.imgUrl}`}
              alt={Stray.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            </Link>
            <h3>{Stray.name}</h3>
            <p><b>מחיר:</b> ₪{Stray.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavoryHospitalityTrayesPage;
