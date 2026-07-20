const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'fallback_secret_key';

// מאמת טוקן ומכניס את המשתמש לתוך req.user
function authenticateToken(req, res, next) {
  const tokenFromCookie = req.cookies?.token;
  const tokenFromHeader = req.headers.authorization?.split(' ')[1];

  const token = tokenFromCookie || tokenFromHeader;
  console.log('📦 Token received:', token); 

  if (!token) return res.status(401).json({ message: 'אין טוקן' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'טוקן לא תקין' });
    req.user = user; // חשוב! נשתמש בזה במידלווארים אחרים
    next();
  });
}

// לא חובה אם כבר יש forbidRole אבל תשאירי אם את משתמשת בו
function isAdmin(req, res, next) {
  if (req.user?.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'גישה נדחתה – רק מנהלים יכולים לבצע את הפעולה הזו' });
  }
}

module.exports = {
  authenticateToken,
  isAdmin
};
