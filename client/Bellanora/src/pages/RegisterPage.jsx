import { useState } from 'react';
import { register } from '../api/authService';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    tz: '',
    email: '',
    telephone: '',
    password: ''
  });

  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      setMsg('נרשמת בהצלחה! מעבירים להתחברות...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.log('❌ שגיאה מהשרת בהרשמה:', err); // ✅ חשוב לזיהוי תקלות
      setMsg(err.response?.data?.message || 'שגיאה בהרשמה');
    }
  };
  

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded shadow"
      style={{ marginTop: "100px" }}
    >
      <h2 className="text-xl font-bold mb-4 text-center">הרשמה</h2>

      <input
        type="text"
        name="username"
        placeholder="שם משתמש"
        value={formData.username}
        onChange={handleChange}
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="text"
        name="tz"
        placeholder="תעודת זהות"
        value={formData.tz}
        onChange={handleChange}
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="email"
        name="email"
        placeholder="אימייל"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="tel"
        name="telephone"
        placeholder="טלפון"
        value={formData.telephone}
        onChange={handleChange}
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="password"
        name="password"
        placeholder="סיסמה"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <button
        type="submit"
        className="w-full bg-gold text-white font-bold p-2 rounded hover:bg-yellow-600 transition"
        style={{ backgroundColor: '#FFD700' }}
      >
        הרשם
      </button>

      {msg && <p className="mt-4 text-center text-red-600">{msg}</p>}
    </form>
  );
}
