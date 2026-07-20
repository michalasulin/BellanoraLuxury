import { useState } from 'react';
import { requestPasswordReset } from '../api/authService'; // תוסיף את הפונקציה הזו בפרונט

export default function ForgetPasswordPage() {
  const [formData, setFormData] = useState({ tz: '', email: '', telephone: '' });
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await requestPasswordReset(formData);
      setMsg(`נשלחה סיסמה זמנית: ${res.temporaryPassword} תקפה עד: ${res.validUntil}`);
    } catch (err) {
      setMsg(err.response?.data?.message || 'שגיאה בבקשת איפוס הסיסמה');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow" style={{ marginTop: '100px' }}>
      <h2 className="text-xl font-bold mb-4 text-center">איפוס סיסמה</h2>

      <input type="text" name="tz" placeholder="תעודת זהות" value={formData.tz} onChange={handleChange} required className="w-full mb-3 p-2 border rounded" />
      <input type="email" name="email" placeholder="אימייל" value={formData.email} onChange={handleChange} required className="w-full mb-3 p-2 border rounded" />
      <input type="tel" name="telephone" placeholder="טלפון" value={formData.telephone} onChange={handleChange} required className="w-full mb-3 p-2 border rounded" />

      <button type="submit" className="w-full bg-yellow-500 text-white font-bold p-2 rounded hover:bg-yellow-600 transition">שלח</button>

      {msg && <p className="mt-4 text-center text-red-600">{msg}</p>}
    </form>
  );
}
