const express = require('express');
const router = express.Router();

const controllerUser = require('../controller/user');
const controllerReset = require('../controller/resetController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');
// קבלת המשתמש המחובר לפי הטוקן שבקוקי
router.get('/me', authenticateToken, controllerUser.getUserFromToken);

// קריאות לכולם
router.get('/', controllerUser.getAll);
router.get('/:id', controllerUser.getById);
router.get('/email/:email', controllerUser.getByEmail);
router.get('/tz/:tz', controllerUser.getByTz);

// הוספה ורישום
router.post('/', authenticateToken, isAdmin, controllerUser.addUser);

router.post('/register', controllerUser.register);

// התחברות
router.post('/login', controllerUser.login);
// בקשה לשרת ב־login


// עדכון משתמש מלא וחלקי
router.put('/:id', controllerUser.update);
router.patch('/:id', controllerUser.patchUser);

// שינוי סיסמה
router.post('/change-password', controllerUser.changePassword);

// מחיקת משתמש - רק מנהל עם טוקן
router.delete('/:id', authenticateToken, isAdmin, controllerUser.deleteUser);

// ניתובים לאיפוס סיסמה (לא לשנות שום דבר פה, רק להוסיף)
router.post('/password-reset/request', controllerReset.requestPasswordReset);
router.post('/password-reset/get', controllerReset.getTemporaryPassword);



// התנתקות - שחרור הטוקן מהקוקי
router.post('/logout', (req, res) => {
  res.cookie('token', '', { maxAge: 0, httpOnly: true, sameSite: 'strict' });
  res.json({ message: 'התנתקת בהצלחה' });
});



module.exports = router;
