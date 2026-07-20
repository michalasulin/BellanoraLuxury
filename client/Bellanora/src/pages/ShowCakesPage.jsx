import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // הוספת השימוש בקונטקסט

function ShowCakesPage() {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();  // קבלת נתוני המשתמש מתוך הקונטקסט

  useEffect(() => {
    if (!user) {
      setError('לא מחובר!');  // אם המשתמש לא מחובר, הצג שגיאה
      setLoading(false);
      return;
    }

    fetch('http://localhost:4000/api/products', {
      credentials: 'include'
    }) // שליחת בקשה עם ה-cookie
      .then(res => {
        if (!res.ok) throw new Error('שגיאה בטעינת העוגות');
        return res.json();
      })
      .then(data => {
        setCakes(data['Showcase Cakes'] || []); // או כל מפתח אחר ששרת מחזיר
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [user]);  // תלות במשתמש, כך שהקוד ירוץ שוב אם המשתמש ישתנה

  if (loading) return <p>טוען עוגות...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Showcase Cakes</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {cakes.map(cake => (
          <div key={cake.id} style={{ width: '300px', border: '1px solid #ccc', padding: '10px' }}>
            <Link to={`/cake/${cake.id}`}>
              <img
                src={`http://localhost:4000${cake.imgUrl}`}
                alt={cake.name}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
            </Link>
            <h3>{cake.name}</h3>
            <p><b>price:</b> ₪{cake.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowCakesPage;


