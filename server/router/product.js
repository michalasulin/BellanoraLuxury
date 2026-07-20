// const express = require('express');
// const router = express.Router();

// const productController = require('../controller/product');
// const upload = require('../middlewares/upload');
// const { authenticateToken } = require('../middlewares/auth');
// const forbidRole = require('../middlewares/forbidRole');
// const forbidRoleField = require('../middlewares/forbidRoleField');

// // קבלת כל המוצרים
// router.get('/', productController.getAllProducts);

// // מוצר לפי מזהה
// router.get('/:id', productController.getProductById);

// // הוספת מוצר חדש - רק למנהל, בלי שליחת role בטעות
// router.post(
//   '/',
//   authenticateToken,
//   forbidRole(['admin']),
//   forbidRoleField,
//   upload.single('image'),
//   productController.addProduct
// );

// // עדכון מלא
// router.put(
//   '/:id',
//   authenticateToken,
//   forbidRole(['admin']),
//   productController.updateProduct
// );

// // עדכון חלקי
// router.patch(
//   '/:id',
//   authenticateToken,
//   forbidRole(['admin']),
//   productController.patchProduct
// );

// // מחיקה
// router.delete(
//   '/:id',
//   authenticateToken,
//   forbidRole(['admin']),
//   productController.deleteProduct
// );

// module.exports = router;
const express = require('express');
const router = express.Router();

const productController = require('../controller/product');
const upload = require('../middlewares/upload');
const { authenticateToken } = require('../middlewares/auth');
const forbidRole = require('../middlewares/forbidRole');
const forbidRoleField = require('../middlewares/forbidRoleField');

// קבלת כל המוצרים
router.get('/', productController.getAllProducts);

// מוצר לפי מזהה
router.get('/:id', productController.getProductById);

// הוספת מוצר חדש - רק למנהל, בלי שליחת role בטעות
router.post(
  '/',
  authenticateToken,
  forbidRole(['admin']),
  forbidRoleField,
  upload.single('image'),
  productController.addProduct
);

// עדכון מלא
router.put(
  '/:id',
  authenticateToken,
  forbidRole(['admin']),
  productController.updateProduct
);

// עדכון חלקי
router.patch(
  '/:id',
  authenticateToken,
  forbidRole(['admin']),
  productController.patchProduct
);

// מחיקה
router.delete(
  '/:id',
  authenticateToken,
  forbidRole(['admin']),
  productController.deleteProduct
);

module.exports = router;
