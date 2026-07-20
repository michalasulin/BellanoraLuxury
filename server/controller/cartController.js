const fs = require('fs').promises;
const path = require('path');


// 📦 הוספת פריט לסל עם בדיקת מלאי תואמת למבנה מקונן
async function addToCart(req, res) {
  const { productId, quantity ,url, Name, price} = req.body;
  const userId = req.user.id;

  try {
    // שלב 1: קריאת המוצרים מהקובץ (מבנה מקונן לפי קטגוריות)
    const productsData = await fs.readFile(path.join(__dirname, '../products.json'), 'utf-8');
    const productsByCategory = JSON.parse(productsData);

    // המרת כל המוצרים מכל הקטגוריות למערך אחד
    const allProducts = Object.values(productsByCategory).flat();
    const product = allProducts.find(p => p.id == productId);

    if (!product) {
      return res.status(404).json({ message: "המוצר לא קיים במאגר" });
    }

    if (typeof product.quantity !== 'number') {
      return res.status(400).json({ message: "כמות לא תקינה במוצר במאגר" });
    }

    // שלב 2: קריאת הסלים
    const data = await fs.readFile(path.join(__dirname, '../cart.json'), 'utf-8');
    const carts = JSON.parse(data);

    let cart = carts.find(c => c.userId === userId);
    if (!cart) {
      cart = { userId, items: [] };
      carts.push(cart);
    }

    const itemIndex = cart.items.findIndex(item => item.productId == productId);
    const currentQuantity = itemIndex !== -1 ? cart.items[itemIndex].quantity : 0;//
    const totalRequested = currentQuantity + quantity;

    // שלב 3: בדיקת מלאי
    if (totalRequested > product.quantity) {
      return res.status(400).json({
        message: `אין מספיק מלאי. זמינות נוכחית: ${product.quantity - currentQuantity}`
      });
    }

    // שלב 4: עדכון הסל
    if (itemIndex !== -1) {
      cart.items[itemIndex].quantity = totalRequested;
    } else {
      cart.items.push({ productId, quantity , url, Name, price });
    }
    // עדכון הכמות במוצר
     product.quantity -= quantity; // הפחתת הכמות מהמוצר
    // שמירת עדכון המוצרים
     await fs.writeFile(path.join(__dirname, '../products.json'), JSON.stringify(productsByCategory, null, 2));

    console.log("✅ המוצר נוסף לסל בהצלחה:", { productId, quantity, url, Name, price });
    console.log("🛒 סל לאחר העדכון:", cart);


    // שלב 5: שמירה
    await fs.writeFile(path.join(__dirname, '../cart.json'), JSON.stringify(carts, null, 2));
    res.status(200).json({ message: "המוצר נוסף לסל בהצלחה", cart });

  } catch (err) {
    console.error("❌ שגיאה ב-addToCart:", err);
    res.status(500).json({ message: "שגיאה בהוספת המוצר לסל" });
  }
}
// 🛒 קבלת סל של משתמש
async function getCart(req, res) {
  try {
    // בדיקת אימות
    if (!req.user || !req.user.id) {
      console.log("⛔ req.user או req.user.id חסר");
      return res.status(401).json({ message: "משתמש לא מזוהה" });
    }

    const userId = req.user.id.toString(); // המרה למחרוזת ליתר ביטחון
    console.log("📌 userId מהטוקן:", userId);

    // קריאת קובץ הסלים
    const data = await fs.readFile(path.join(__dirname, '../cart.json'), 'utf-8');
    let carts;

    try {
      carts = JSON.parse(data);
    } catch (parseErr) {
      console.error("❌ שגיאה בפירסום הקובץ cart.json:", parseErr);
      return res.status(500).json({ message: "הפורמט של cart.json שגוי" });
    }

    // לוודא שהקובץ הוא מערך ולא אובייקט
    if (!Array.isArray(carts)) {
      console.log("⚠️ cart.json אינו מערך – ייתכן שהפורמט שגוי");
      return res.status(500).json({ message: "מבנה הנתונים בקובץ cart.json אינו תקין" });
    }

    const cart = carts.find(c => c.userId == userId); // השוואה גמישה
    if (!cart) {
      console.log("ℹ️ לא נמצא סל עבור המשתמש");
      return res.status(404).json({ message: "הסל ריק או לא קיים" });
    }

    //console.log("✅ סל נמצא:", cart);
    //return res.status(200).json(cart);
    console.log("✅ סל נמצא:", cart);

    const productsData = await fs.readFile(path.join(__dirname, '../products.json'), 'utf-8');
    const allProducts = Object.values(JSON.parse(productsData)).flat();
    const enrichedItems = cart.items.map(item => {
      const product = allProducts.find(p => p.id == item.productId);
      return { ...item, stockQuantity: product ? product.quantity : undefined };
    });

    return res.status(200).json({ ...cart, items: enrichedItems });

  } catch (err) {
    console.error("🔥 שגיאה כללית ב-getCart:", err);
    return res.status(500).json({ message: "שגיאה בקריאת הסל" });
  }
}


async function removeFromCart(req, res) {
  const { productId } = req.body;
  const userId = req.user.id;

  console.log('--- removeFromCart התחיל ---');
  console.log('מזהה משתמש (userId):', userId);
  console.log('productId מבוקש להסרה:', productId);

  try {
    // שלב 1: קריאת קובץ הסלים
    const data = await fs.readFile(path.join(__dirname, '../cart.json'), 'utf-8');
    const carts = JSON.parse(data);
    
    // שלב 2: חיפוש סל המשתמש
    const cart = carts.find(cart => cart.userId === userId);
    if (!cart) {
      return res.status(404).json({ message: "הסל לא נמצא" });
    }

    // שלב 3: חיפוש המוצר בסל
    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "המוצר לא נמצא בסל" });
    }

    // קבלת הכמות הנוכחית של המוצר
    const quantityToRemove = cart.items[itemIndex].quantity;

    // הסרת המוצר מהסל
    cart.items.splice(itemIndex, 1);

    // שלב 4: עדכון כמות המוצר במלאי
    const productsData = await fs.readFile(path.join(__dirname, '../products.json'), 'utf-8');
    const productsByCategory = JSON.parse(productsData);
    const allProducts = Object.values(productsByCategory).flat();
    const product = allProducts.find(p => p.id == productId);

    if (product) {
      product.quantity += quantityToRemove; // עדכון הכמות במלאי
    }

    // שמירת עדכון המוצרים
    await fs.writeFile(path.join(__dirname, '../products.json'), JSON.stringify(productsByCategory, null, 2));
    
    // שמירת הסל
    await fs.writeFile(path.join(__dirname, '../cart.json'), JSON.stringify(carts, null, 2));
    res.status(200).json({ message: "המוצר הוסר מהסל בהצלחה", cart });

  } catch (err) {
    console.error('שגיאה בתוך removeFromCart:', err);
    res.status(500).json({ message: "שגיאה בהסרת המוצר מהסל" });
  }
}



// // הגדרת הנתיבים לקבצים
// const cartFilePath = path.join(__dirname, '../cart.json');
// const productsFilePath = path.join(__dirname, '../products.json');


// async function updateQuantityPlus(req, res) {
//     const { itemId } = req.body; 
//     const userId = req.user.id;
// console.log("BODY:", req.body);
// console.log("USER:", req.user);

//     try {
//         const cartF = await fs.readFile(cartFilePath);
//         const cartData = JSON.parse(cartF);
//         const productsF = await fs.readFile(productsFilePath);
//         const products = JSON.parse(productsF);

//         const productList = Object.values(products).flat();
//         const product = productList.find(pr => pr.id == itemId);
//         const cartI = cartData.find(c => c.userId === userId);

//         if (!cartI || !product) {
//             return res.status(404).json({ message: "פריט סל או מוצר לא נמצא" });
//         }

//         const cartItem = cartI.items.find(item => item.productId == itemId); // קבלת הפריט

//         if (!cartItem) {
//             return res.status(404).json({ message: "פריט סל לא נמצא" });
//         }

//         // בדוק אם הכמות של המוצר היא 0
//         if (product.quantity <= 0) {
//             return res.status(400).json({ message: "המוצר אזל מהמלאי" });
//         }

//         cartItem.quantity += 1; // הוספת כמות לסל
//         product.quantity -= 1; // הפחתת כמות מהמלאי

//         await fs.writeFile(cartFilePath, JSON.stringify(cartData, null, 2));
//         await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));

//         return res.json({ cartItem, product }); // החזרת התגובה

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "שגיאה בעדכון הכמות" }); // החזרת שגיאה ללקוח
//     }
// }


//const path = require('path');
//const fs = require('fs/promises');

const cartFilePath = path.join(__dirname, '../cart.json');
const productsFilePath = path.join(__dirname, '../products.json');

async function updateQuantityPlus(req, res) {
  const { itemId } = req.body;
  const userId = req.user.id;

  console.log("📦 BODY:", req.body);
  console.log("👤 USER:", req.user);

  try {
    const cartF = await fs.readFile(cartFilePath);
    const cartData = JSON.parse(cartF);

    const productsF = await fs.readFile(productsFilePath);
    const products = JSON.parse(productsF);

    const productList = Object.values(products).flat();
    const product = productList.find(pr => pr.id == itemId);
    const cartI = cartData.find(c => c.userId === userId);

    if (!cartI || !product) {
      return res.status(404).json({ message: "פריט סל או מוצר לא נמצא" });
    }

    const cartItem = cartI.items.find(item => item.productId == itemId);

    if (!cartItem) {
      return res.status(404).json({ message: "פריט סל לא נמצא" });
    }

    if (product.quantity <= 0) {
      return res.status(400).json({ message: "המוצר אזל מהמלאי" });
    }

    // עדכון כמויות
    cartItem.quantity += 1;
    product.quantity -= 1;

    await fs.writeFile(cartFilePath, JSON.stringify(cartData, null, 2));
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));

    // ✅ תשובה מסודרת ללקוח
    return res.status(200).json({
      message: "עודכן בהצלחה",
      cart: cartI,
      updatedItem: cartItem,
      product
    });

  } catch (error) {
    console.error("❌ Error in updateQuantityPlus:", error);
    return res.status(500).json({ message: "שגיאה בעדכון הכמות" });
  }
}

//async function updateQuantityLess(req, res) {
//}

async function updateQuantityLess(req, res) {
  const { itemId } = req.body;
  const userId = req.user.id;

  try {
    const cartF = await fs.readFile(cartFilePath);
    const cartData = JSON.parse(cartF);
    const productsF = await fs.readFile(productsFilePath);
    const products = JSON.parse(productsF);

    const productList = Object.values(products).flat();
    const product = productList.find(pr => pr.id == itemId);
    const cartI = cartData.find(c => c.userId === userId);

    if (!cartI || !product) {
      return res.status(404).json({ message: "פריט סל או מוצר לא נמצא" });
    }

    const cartItem = cartI.items.find(item => item.productId == itemId);
    if (!cartItem) {
      return res.status(404).json({ message: "פריט סל לא נמצא" });
    }

    if (cartItem.quantity <= 1) {
      return res.status(400).json({ message: "כמות מינימלית היא 1" });
    }

    cartItem.quantity -= 1;
    product.quantity += 1;

    await fs.writeFile(cartFilePath, JSON.stringify(cartData, null, 2));
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));

    return res.status(200).json({ message: "עודכן בהצלחה", cart: cartI, updatedItem: cartItem, product });

  } catch (error) {
    console.error("❌ Error in updateQuantityLess:", error);
    return res.status(500).json({ message: "שגיאה בעדכון הכמות" });
  }
}


module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantityPlus,
  updateQuantityLess
};
