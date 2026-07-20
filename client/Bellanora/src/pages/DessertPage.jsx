import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function DessertPage() {
  const [cakes, setCakes] = useState([]); // מאתחל במערך ריק
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/products', {
    credentials: 'include'
})
      .then(res => {
        if (!res.ok) throw new Error('שגיאה בטעינת הקינוחים');
        return res.json();
      })
      .then(data => {
        console.log("data שהגיע מהשרת:", data);
        setCakes(data["Desserts"] || []);  // מוודא שהמפתח קיים, אחרת מערך ריק
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>טוען קינוחים...</p>;
  if (error) return <p style={{ color: 'red' }}>שגיאה: {error}</p>;

  // מוודא שקינוחים זה מערך לפני שמנסים למפות
  if (!Array.isArray(cakes)) return <p>אין קינוחים להצגה</p>;

  return (
    <div>
      <h2>Desserts</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {cakes.map(dess => (
          <div key={dess.id} style={{ width: '300px', border: '1px solid #ccc', padding: '10px' }}>
            <Link to={`/dess/${dess.id}`}>

            <img 
              src={`http://localhost:4000${dess.imgUrl}`}  // כתובת מלאה לתמונה
              alt={dess.name} 
              style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
            />
            </Link>
            <h3>{dess.name}</h3>
            <p><b>price:</b> ₪{dess.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DessertPage;
