
// src/api/authService.js
import axios from 'axios';
import Cookies from 'js-cookie';

// יצירת axios instance עם interceptor
const API = axios.create({
  baseURL: 'http://localhost:4000/api',
  //credentials: 'include',  // מאוד חשוב כדי לשלוח את הקוקי עם הבקשה
  withCredentials: true, // ✅ שדה תקין ששולח גם קוקיז

});

// מוסיף את הטוקן אוטומטית לפני כל בקשה
API.interceptors.request.use((config) => {
  //const token = localStorage.getItem('token');
    console.log('✅ Interceptor ran');

  const token = Cookies.get('token'); // יחזיר את הטוקן אם קיים בקוקי

    console.log('📦 Token from Cookie:', token); // לוג נוסף כדי לראות אם הטוקן נמצא ב־localStorage

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// פונקציית התחברות
export async function login(email, password) {
  const res = await API.post('/users/login', { email, password });
  const token = res.data.token;

   Cookies.set('token', token, { expires: 2 / 24, secure: false, sameSite: 'strict' });

    console.log('✅ טוקן נשמר:', token); // הוסיפי לוג כאן

  return res.data;
}

// מביא את המשתמש המחובר
export async function getUserFromToken() {
  const res = await API.get('/users/me');
  
  return res.data;
}

// התנתקות – מוחקת את הטוקן
export async function logout() {
  const res = await API.get('/users/logout');
  Cookies.remove('token');
  return res.data;
}
export async function register(userData) {
  const res = await API.post('/users/register', userData);
  return res.data;
}
export async function requestPasswordReset(formData) {
  const res = await API.post('/users/password-reset/request', formData);
  return res.data;
}
export async function changePassword(data) {// שינוי סיסמא  
  // data יכול להכיל { oldPassword, newPassword }
  const res = await API.post('/users/change-password', data);
  return res.data;
}

export async function getCart() {
  const res = await API.get('/cart'); // הנתיב תלוי בשרת שלך
  return res.data;
}

// authService.js

export async function addToCart(productId, quantity, url, Name, price) {
  const res = await API.post('/cart/add', { productId, quantity ,url ,Name , price}); // ודאי שזה הנתיב שלך בשרת
  return res.data;
}
export async function  removeFromCart(productId) {
  const res = await API.delete(`/cart/remove`,{data:{productId}}); // ודאי שזה הנתיב שלך בשרת
  return res.data;
}

export async function updateQuantityPlus(itemId) {
    const res = await API.put(`/cart/plus`, { itemId });
  return res.data;  
}
export async function updateQuantityLess(itemId) {
    const res = await API.put(`/cart/less`, { itemId });
  return res.data;  
}

// ========== גישה כללית ==========
const api = {
  get: (url, config = {}) => API.get(url, config),
  post: (url, data, config = {}) => API.post(url, data, config),
  put: (url, data, config = {}) => API.put(url, data, config),
  patch: (url, data, config = {}) => API.patch(url, data, config),
  delete: (url, config = {}) => API.delete(url, config),
};

export default api;
