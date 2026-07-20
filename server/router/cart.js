const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');
const auth = require('../middlewares/auth')

// 🚀 הוספת פריט לסל
router.post('/add', auth.authenticateToken, cartController.addToCart);

// 🚀 קבלת הסל של המשתמש
router.get('/', auth.authenticateToken, cartController.getCart);

// 🚀 מחיקת מוצר מהסל
router.delete('/remove', auth.authenticateToken, cartController.removeFromCart);
// 🚀 עדכון כמות פריט בסל
// הוספת ניתוב לעדכון כמות המוצר בסל
//router.post('/update-quantity', auth.authenticateToken, cartController.updateProductQuantity);
router.put('/plus', auth.authenticateToken, cartController.updateQuantityPlus);

router.put('/less', auth.authenticateToken, cartController.updateQuantityLess);



module.exports = router;
