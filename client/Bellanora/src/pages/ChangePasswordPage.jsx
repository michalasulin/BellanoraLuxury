//ChangePasswordPage.jsx – שינוי סיסמה אחרי התחברות

// src/pages/ChangePasswordPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../api/authService';
import { useAuth } from '../context/AuthContext';

function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user || !user.email) {
      setError('לא ניתן לשנות סיסמה – אין משתמש מחובר');
      return;
    }

    try {
      const res = await changePassword({ email: user.email, newPassword });
      setSuccess(res.message || 'הסיסמה שונתה בהצלחה');
      setTimeout(() => navigate('/home'), 2000); // חזרה הביתה
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה בעת שינוי הסיסמה');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>שינוי סיסמה</h2>
      <form onSubmit={handleSubmit}>
        <label>סיסמה חדשה:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">שנה סיסמה</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default ChangePasswordPage;
