const express = require('express');
const router = express.Router();

const controllerOrder = require('../controller/order');
const { authenticateToken } = require('../middlewares/auth');

// כל הנתיבים מחייבים אימות טוקן
router.use(authenticateToken);

router.get("/", controllerOrder.getAllOrders);
router.get("/:id", controllerOrder.getOrderById);
router.post("/", controllerOrder.addOrder);
router.put("/:id", controllerOrder.updateOrder);
router.delete("/:id", controllerOrder.deleteOrder);

module.exports = router;
