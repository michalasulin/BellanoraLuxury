// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authService';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    try {
const res = await login(email, password);

      setUser(res.user); // עדכון המשתמש בקונטקסט
      setMsg(res.message || 'התחברת בהצלחה');

      // אם זו סיסמה זמנית – נעבור לעדכון סיסמה
      if (res.user.isTemporary) {
        navigate('/change-password');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setMsg(err.response?.data?.message || 'שגיאה בהתחברות');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded shadow"
      style={{ marginTop: "100px" }}
    >
      <h2 className="text-xl font-bold mb-4 text-center">התחברות</h2>

      <input
        type="email"
        placeholder="אימייל"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full mb-3 p-2 border rounded"
        autoComplete="username" 
      />

      <input
        type="password"
        placeholder="סיסמה"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full mb-3 p-2 border rounded"
        autoComplete="current-password"
      />

      <button
        type="submit"
        className="w-full bg-gold text-white font-bold p-2 rounded hover:bg-yellow-600 transition"
        style={{ backgroundColor: '#FFD700' }}
      >
        התחבר
      </button>

      {msg && <p className="mt-4 text-center text-red-600">{msg}</p>}
    </form>
  );
}

export default LoginPage;
