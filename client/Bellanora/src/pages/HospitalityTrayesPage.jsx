import { Link } from 'react-router-dom';

function HospitalityTrayesPage() {
  return (
    <div>
      <h2>מגשי אירוח</h2>
      <ul>
        <li><Link to="/hospitality-trayes/savory">מגשי אירוח מלוחים</Link></li>
        <li><Link to="/hospitality-trayes/sweet">מגשי אירוח מתוקים</Link></li>
      </ul>
    </div>
  );
}

export default HospitalityTrayesPage;
