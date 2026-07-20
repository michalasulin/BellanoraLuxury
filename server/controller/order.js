const fs = require('fs').promises;

async function getAllOrders(req, res) {
  try {
    const data = await fs.readFile("orders.json", "utf-8");
    const orders = JSON.parse(data);

    if (req.user.role === 'admin') {
      // מנהל רואה הכל
      return res.status(200).json(orders);
    } else {
      // משתמש רגיל רואה רק את ההזמנות שלו
      const userOrders = orders.filter(o => o.userId === req.user.id);
      return res.status(200).json(userOrders);
    }
  } catch (err) {
    res.status(500).json({ message: "שגיאה בקריאת קובץ ההזמנות" });
  }
}

async function getOrderById(req, res) {
  const id = req.params.id;
  try {
    const data = await fs.readFile("orders.json", "utf-8");
    const orders = JSON.parse(data);
    const order = orders.find(o => o.id == id);
    if (!order) return res.status(404).json({ message: `הזמנה עם ID ${id} לא נמצאה` });

    if (req.user.role === 'admin' || order.userId === req.user.id) {
      return res.status(200).json(order);
    } else {
      return res.status(403).json({ message: 'אין לך הרשאה לצפות בהזמנה זו' });
    }
  } catch (err) {
    res.status(500).json({ message: "שגיאה בקריאת קובץ ההזמנות" });
  }
}

async function addOrder(req, res) {
  try {
    const newOrder = req.body;
    newOrder.userId = req.user.id; // חובה לקשר להזמנה את המשתמש

    const data = await fs.readFile("orders.json", "utf-8");
    const orders = JSON.parse(data);

    const maxId = orders.length ? Math.max(...orders.map(o => o.id)) : 0;
    newOrder.id = maxId + 1;

    orders.push(newOrder);
    await fs.writeFile("orders.json", JSON.stringify(orders, null, 2));
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: "שגיאה ביצירת הזמנה" });
  }
}

async function updateOrder(req, res) {
  const id = req.params.id;
  const updatedOrder = req.body;

  try {
    const data = await fs.readFile("orders.json", "utf-8");
    const orders = JSON.parse(data);
    const index = orders.findIndex(o => o.id == id);
    if (index === -1) return res.status(404).json({ message: `הזמנה עם ID ${id} לא נמצאה` });

    const order = orders[index];

    // רק מנהל או בעל ההזמנה יכול לעדכן
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'אין לך הרשאה לעדכן הזמנה זו' });
    }

    orders[index] = { ...order, ...updatedOrder, id: parseInt(id), userId: order.userId };
    await fs.writeFile("orders.json", JSON.stringify(orders, null, 2));
    res.status(200).json(orders[index]);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בעדכון הזמנה" });
  }
}

async function deleteOrder(req, res) {
  const id = req.params.id;

  try {
    const data = await fs.readFile("orders.json", "utf-8");
    const orders = JSON.parse(data);
    const index = orders.findIndex(o => o.id == id);
    if (index === -1) return res.status(404).json({ message: `הזמנה עם ID ${id} לא נמצאה` });

    const order = orders[index];

    // מנהל או משתמש יכול למחוק רק את ההזמנה שלו
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'אין לך הרשאה למחוק הזמנה זו' });
    }

    const deletedOrder = orders.splice(index, 1)[0];
    await fs.writeFile("orders.json", JSON.stringify(orders, null, 2));
    res.status(200).json(deletedOrder);
  } catch (err) {
    res.status(500).json({ message: "שגיאה במחיקת הזמנה" });
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  addOrder,
  updateOrder,
  deleteOrder,
};
