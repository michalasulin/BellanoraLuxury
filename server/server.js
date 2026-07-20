const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { authenticateToken } = require('./middlewares/auth');

const app = express();

// ✅ הגדרת מקורות מותרות ל-CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  // אפשר להוסיף דומיינים נוספים במידת הצורך
];

// ✅ Middleware כלליים - סדר חשוב
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ ראוטרים - תביא את המודולים
const user = require('./router/user');
const product = require('./router/product');
const order = require('./router/order');
const cartRouter = require('./router/cart');

// ✅ ראוטרים ללא אימות
app.use('/api/users', user);

// ✅ ראוטרים עם אימות טוקן
app.use('/api/products', authenticateToken, product);
app.use('/api/orders', authenticateToken, order);
app.use('/api/cart', cartRouter);

// ✅ הגשת תמונות
app.use('/images', express.static(path.join(__dirname, 'public/images')));




// ✅ טיפול ב־404 (לא נמצא)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// ✅ הרצת השרת
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
