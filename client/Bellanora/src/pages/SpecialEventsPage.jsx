import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function SpecialEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/products', {
    credentials: 'include'
})
      .then(res => {
        if (!res.ok) throw new Error('שגיאה בטעינת האירועים המיוחדים');
        return res.json();
      })
      .then(data => {
        console.log("data שהגיע מהשרת:", data);
        setEvents(data["Special Events"] || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>טוען אירועים מיוחדים...</p>;
  if (error) return <p style={{ color: 'red' }}>שגיאה: {error}</p>;
  if (!Array.isArray(events) || events.length === 0) return <p>אין אירועים להצגה</p>;

  return (
    <div>
      <h2>Special Events</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {events.map(event => (
          
        <div key={event.id} style={{ width: '300px', border: '1px solid #ccc', padding: '10px' }}>
          <Link to={`/event/${event.id}`}>

            <img 
              src={`http://localhost:4000${event.imgUrl}`} 
              alt={event.name} 
              style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
            />
            </Link>
            <h3>{event.name}</h3>
            <p>{event.description}</p>
            <p><b>מחיר:</b> ₪{event.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpecialEventsPage;
