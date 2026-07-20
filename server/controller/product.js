// const fs = require('fs').promises;
// const path = require('path');

// // 📦 שליפת כל המוצרים
// async function getAllProducts(req, res) {
//   try {
//     const data = await fs.readFile("products.json", "utf-8");
//     const products = JSON.parse(data);
//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json({ message: "שגיאה בקריאת קובץ המוצרים" });
//   }
// }

// // 🔍 שליפת מוצר לפי מזהה
// async function getProductById(req, res) {
//   const id = req.params.id;
//   try {
//     const data = await fs.readFile("products.json", "utf-8");
//     const products = JSON.parse(data);
//     const product = products.find(p => p.id == id);
//     if (!product) {
//       return res.status(404).json({ message: `מוצר עם ID ${id} לא נמצא` });
//     }
//     res.status(200).json(product);
//   } catch (err) {
//     res.status(500).json({ message: "שגיאה בקריאת קובץ המוצרים" });
//   }
// }

// // ➕ הוספת מוצר חדש (כולל העלאת תמונה)
// async function addProduct(req, res) {
//   try {
//     const data = await fs.readFile("products.json", "utf-8");
//     const products = JSON.parse(data);

//     const newProduct = req.body;
//     const maxId = products.length ? Math.max(...products.map(p => p.id)) : 0;
//     newProduct.id = maxId + 1;

//     if (req.file) {
//       newProduct.imgUrl = `/images/${req.file.filename}`;
//     }

//     products.push(newProduct);
//     await fs.writeFile("products.json", JSON.stringify(products, null, 2));
//     res.status(201).json(newProduct);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "שגיאה בהוספת מוצר" });
//   }
// }

// // 📝 עדכון מוצר קיים (PUT)
// async function updateProduct(req, res) {
//   const id = req.params.id;
//   const updatedProduct = req.body;
//   try {
//     const data = await fs.readFile("products.json", "utf-8");
//     const products = JSON.parse(data);
//     const index = products.findIndex(p => p.id == id);
//     if (index === -1) {
//       return res.status(404).json({ message: `מוצר עם ID ${id} לא נמצא` });
//     }
//     products[index] = { ...products[index], ...updatedProduct, id: parseInt(id) };
//     await fs.writeFile("products.json", JSON.stringify(products, null, 2));
//     res.status(200).json(products[index]);
//   } catch (err) {
//     res.status(500).json({ message: "שגיאה בעדכון מוצר" });
//   }
// }

// //✏️ עדכון חלקי של מוצר (PATCH)
// async function patchProduct(req, res) {
//   const id = req.params.id;
//   const updates = req.body;

//   try {
//     const data = await fs.readFile("products.json", "utf-8");
//     const products = JSON.parse(data);

//     const index = products.findIndex(p => p.id === Number(id));
//     if (index === -1) {
//       return res.status(404).json({ message: `מוצר עם ID ${id} לא נמצא` });
//     }

//     // עדכון הכמות אם היא מגיעה בבקשה
//     if (updates.quantity !== undefined) {
//       const newQuantity = Number(updates.quantity);
//       products[index].quantity = newQuantity;

//       // עדכון מצב מלאי
//       products[index].isOutOfStock = newQuantity === 0;
//     }

//     // עדכון שדות נוספים אם יש
//     products[index] = { ...products[index], ...updates, id: Number(id) };

//     await fs.writeFile("products.json", JSON.stringify(products, null, 2));

//     res.status(200).json(products[index]);
//   } catch (err) {
//     res.status(500).json({ message: "שגיאה בעדכון חלקי של מוצר" });
//   }
// }

// // עדכון כמות פריט בסל הקניות

// // ❌ מחיקת מוצר
// async function deleteProduct(req, res) {
//   const id = req.params.id;
//   try {
//     const data = await fs.readFile("products.json", "utf-8");
//     const products = JSON.parse(data);
//     const index = products.findIndex(p => p.id == id);
//     if (index === -1) {
//       return res.status(404).json({ message: `מוצר עם ID ${id} לא נמצא` });
//     }
//     const deleted = products.splice(index, 1)[0];
//     await fs.writeFile("products.json", JSON.stringify(products, null, 2));
//     res.status(200).json(deleted);
//   } catch (err) {
//     res.status(500).json({ message: "שגיאה במחיקת מוצר" });
//   }
// }

// // 🔍 סינון לפי תת־קטגוריה
// async function getProductsBySubcategory(req, res) {
//   try {
//     const data = await fs.readFile("products.json", "utf-8");
//     const products = JSON.parse(data);
//     const subcategory = req.params.subcategory;
//     const filtered = products.filter(p => p.subcategory === subcategory);
//     res.status(200).json(filtered);
//   } catch (err) {
//     res.status(500).json({ message: "שגיאה בסינון לפי תת קטגוריה" });
//   }
// }

// // ❄️ סינון מוצרים מצוננים
// async function filterByCooling(req, res) {
//   try {
//     const data = await fs.readFile("products.json", "utf-8");
//     const products = JSON.parse(data);
//     const filtered = products.filter(p => p.isCooling === true || p.isCooling === 'true');
//     res.status(200).json(filtered);
//   } catch (err) {
//     res.status(500).json({ message: "שגיאה בסינון מוצרים מצוננים" });
//   }
// }

// // 🏢 סינון לפי חברה
// async function filterByCompany(req, res) {
//   try {
//     const data = await fs.readFile("products.json", "utf-8");
//     const products = JSON.parse(data);
//     const company = req.params.company;
//     const filtered = products.filter(p => p.company === company);
//     res.status(200).json(filtered);
//   } catch (err) {
//     res.status(500).json({ message: "שגיאה בסינון לפי חברה" });
//   }
// }

// // 💰 סינון לפי טווח מחיר
// async function filterByPriceRange(req, res) {
//   const { min, max } = req.query;
//   try {
//     const data = await fs.readFile("products.json", "utf-8");
//     const products = JSON.parse(data);
//     const filtered = products.filter(p => p.price >= Number(min) && p.price <= Number(max));
//     res.status(200).json(filtered);
//   } catch (err) {
//     res.status(500).json({ message: "שגיאה בסינון לפי טווח מחיר" });
//   }
// }

// // 📥 הוספת מוצרים בכמות גדולה
// async function bulkAddProducts(req, res) {
//   try {
//     const data = await fs.readFile("products.json", "utf-8");
//     const products = JSON.parse(data);
//     const newProducts = req.body;

//     const maxId = products.length ? Math.max(...products.map(p => p.id)) : 0;
//     newProducts.forEach((product, index) => {
//       product.id = maxId + index + 1;
//     });

//     const updated = [...products, ...newProducts];
//     await fs.writeFile("products.json", JSON.stringify(updated, null, 2));
//     res.status(201).json(newProducts);
//   } catch (err) {
//     res.status(500).json({ message: "שגיאה בהוספת מוצרים מרובים" });
//   }
// }

// // 🗂️ סימון מוצר כ"ארכיון" (מוסתר אך לא נמחק)
// async function archiveProduct(req, res) {
//   const id = req.params.id;
//   try {
//     const data = await fs.readFile("products.json", "utf-8");
//     const products = JSON.parse(data);
//     const product = products.find(p => p.id == id);
//     if (!product) return res.status(404).json({ message: "מוצר לא נמצא" });

//     product.isArchived = true;
//     await fs.writeFile("products.json", JSON.stringify(products, null, 2));
//     res.status(200).json({ message: "המוצר הועבר לארכיון" });
//   } catch (err) {
//     res.status(500).json({ message: "שגיאה בארכוב מוצר" });
//   }
// }

// // 🔁 הפעלת/כיבוי זמינות מוצר
// async function toggleAvailability(req, res) {
//   const id = req.params.id;
//   try {
//     const data = await fs.readFile("products.json", "utf-8");
//     const products = JSON.parse(data);
//     const product = products.find(p => p.id == id);
//     if (!product) return res.status(404).json({ message: "מוצר לא נמצא" });

//     product.available = !product.available;
//     await fs.writeFile("products.json", JSON.stringify(products, null, 2));
//     res.status(200).json({ message: `זמינות עודכנה ל: ${product.available}` });
//   } catch (err) {
//     res.status(500).json({ message: "שגיאה בשינוי זמינות" });
//   }
// }

// module.exports = {
//   getAllProducts,
//   getProductById,
//   addProduct,
//   updateProduct,
//   patchProduct,
//   deleteProduct,
//   getProductsBySubcategory,
//   filterByCooling,
//   filterByCompany,
//   filterByPriceRange,
//   bulkAddProducts,
//   archiveProduct,
//   toggleAvailability
// };

const fs = require('fs').promises;
const path = require('path');

// 📦 שליפת כל המוצרים
async function getAllProducts(req, res) {
  try {
    const data = await fs.readFile("products.json", "utf-8");
    const products = JSON.parse(data);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בקריאת קובץ המוצרים" });
  }
}
// 🔍 שליפת מוצר לפי מזהה
async function getProductById(req, res) {
  const id = req.params.id;
  try {
    const data = await fs.readFile("products.json", "utf-8");
    console.log('חיפשתי מוצר עם ID:', id);  // הדפסת ה-ID
    const products = JSON.parse(data);

    // חיפוש בכל קטגוריה
    let product = null;
    for (const category in products) {
      product = products[category].find(p => p.id == Number(id));  // המרה למספר
      if (product) break;  // אם מצאנו את המוצר, יוצאים מהלולאה
    }

    if (!product) {
      console.log('מוצר לא נמצא');
      return res.status(404).json({ message: `מוצר עם ID ${id} לא נמצא` });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error('שגיאה בקריאת קובץ המוצרים:', err.message); // הדפסת השגיאה בלוג
    res.status(500).json({ message: "שגיאה בקריאת קובץ המוצרים" });
  }
}


// ➕ הוספת מוצר חדש (כולל העלאת תמונה)
async function addProduct(req, res) {
  try {
    const data = await fs.readFile("products.json", "utf-8");
    const products = JSON.parse(data);

    const newProduct = req.body;
    const maxId = products.length ? Math.max(...products.map(p => p.id)) : 0;
    newProduct.id = maxId + 1;

    if (req.file) {
      newProduct.imgUrl = `/images/${req.file.filename}`;
    }

    products.push(newProduct);
    await fs.writeFile("products.json", JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "שגיאה בהוספת מוצר" });
  }
}

// 📝 עדכון מוצר קיים (PUT)
async function updateProduct(req, res) {
  const id = req.params.id;
  const updatedProduct = req.body;
  try {
    const data = await fs.readFile("products.json", "utf-8");
    const products = JSON.parse(data);
    const index = products.findIndex(p => p.id == id);
    if (index === -1) {
      return res.status(404).json({ message: `מוצר עם ID ${id} לא נמצא` });
    }
    products[index] = { ...products[index], ...updatedProduct, id: parseInt(id) };
    await fs.writeFile("products.json", JSON.stringify(products, null, 2));
    res.status(200).json(products[index]);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בעדכון מוצר" });
  }
}

//✏️ עדכון חלקי של מוצר (PATCH)
async function patchProduct(req, res) {
  const id = req.params.id;
  const updates = req.body;

  try {
    const data = await fs.readFile("products.json", "utf-8");
    const products = JSON.parse(data);

    const index = products.findIndex(p => p.id === Number(id));
    if (index === -1) {
      return res.status(404).json({ message: `מוצר עם ID ${id} לא נמצא` });
    }

    // עדכון הכמות אם היא מגיעה בבקשה
    if (updates.quantity !== undefined) {
      const newQuantity = Number(updates.quantity);
      products[index].quantity = newQuantity;

      // עדכון מצב מלאי
      products[index].isOutOfStock = newQuantity === 0;
    }

    // עדכון שדות נוספים אם יש
    products[index] = { ...products[index], ...updates, id: Number(id) };

    await fs.writeFile("products.json", JSON.stringify(products, null, 2));

    res.status(200).json(products[index]);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בעדכון חלקי של מוצר" });
  }
}

// ❌ מחיקת מוצר
async function deleteProduct(req, res) {
  const id = req.params.id;
  try {
    const data = await fs.readFile("products.json", "utf-8");
    const products = JSON.parse(data);
    const index = products.findIndex(p => p.id == id);
    if (index === -1) {
      return res.status(404).json({ message: `מוצר עם ID ${id} לא נמצא` });
    }
    const deleted = products.splice(index, 1)[0];
    await fs.writeFile("products.json", JSON.stringify(products, null, 2));
    res.status(200).json(deleted);
  } catch (err) {
    res.status(500).json({ message: "שגיאה במחיקת מוצר" });
  }
}

// 🔍 סינון לפי תת־קטגוריה
async function getProductsBySubcategory(req, res) {
  try {
    const data = await fs.readFile("products.json", "utf-8");
    const products = JSON.parse(data);
    const subcategory = req.params.subcategory;
    const filtered = products.filter(p => p.subcategory === subcategory);
    res.status(200).json(filtered);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בסינון לפי תת קטגוריה" });
  }
}

// ❄️ סינון מוצרים מצוננים
async function filterByCooling(req, res) {
  try {
    const data = await fs.readFile("products.json", "utf-8");
    const products = JSON.parse(data);
    const filtered = products.filter(p => p.isCooling === true || p.isCooling === 'true');
    res.status(200).json(filtered);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בסינון מוצרים מצוננים" });
  }
}

// 🏢 סינון לפי חברה
async function filterByCompany(req, res) {
  try {
    const data = await fs.readFile("products.json", "utf-8");
    const products = JSON.parse(data);
    const company = req.params.company;
    const filtered = products.filter(p => p.company === company);
    res.status(200).json(filtered);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בסינון לפי חברה" });
  }
}

// 💰 סינון לפי טווח מחיר
async function filterByPriceRange(req, res) {
  const { min, max } = req.query;
  try {
    const data = await fs.readFile("products.json", "utf-8");
    const products = JSON.parse(data);
    const filtered = products.filter(p => p.price >= Number(min) && p.price <= Number(max));
    res.status(200).json(filtered);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בסינון לפי טווח מחיר" });
  }
}

// 📥 הוספת מוצרים בכמות גדולה
async function bulkAddProducts(req, res) {
  try {
    const data = await fs.readFile("products.json", "utf-8");
    const products = JSON.parse(data);
    const newProducts = req.body;

    const maxId = products.length ? Math.max(...products.map(p => p.id)) : 0;
    newProducts.forEach((product, index) => {
      product.id = maxId + index + 1;
    });

    const updated = [...products, ...newProducts];
    await fs.writeFile("products.json", JSON.stringify(updated, null, 2));
    res.status(201).json(newProducts);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בהוספת מוצרים מרובים" });
  }
}

// 🗂️ סימון מוצר כ"ארכיון" (מוסתר אך לא נמחק)
async function archiveProduct(req, res) {
  const id = req.params.id;
  try {
    const data = await fs.readFile("products.json", "utf-8");
    const products = JSON.parse(data);
    const product = products.find(p => p.id == id);
    if (!product) return res.status(404).json({ message: "מוצר לא נמצא" });

    product.isArchived = true;
    await fs.writeFile("products.json", JSON.stringify(products, null, 2));
    res.status(200).json({ message: "המוצר הועבר לארכיון" });
  } catch (err) {
    res.status(500).json({ message: "שגיאה בארכוב מוצר" });
  }
}

// 🔁 הפעלת/כיבוי זמינות מוצר
async function toggleAvailability(req, res) {
  const id = req.params.id;
  try {
    const data = await fs.readFile("products.json", "utf-8");
    const products = JSON.parse(data);
    const product = products.find(p => p.id == id);
    if (!product) return res.status(404).json({ message: "מוצר לא נמצא" });

    product.available = !product.available;
    await fs.writeFile("products.json", JSON.stringify(products, null, 2));
    res.status(200).json({ message: `זמינות עודכנה ל: ${product.available}` });
  } catch (err) {
    res.status(500).json({ message: "שגיאה בשינוי זמינות" });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
  getProductsBySubcategory,
  filterByCooling,
  filterByCompany,
  filterByPriceRange,
  bulkAddProducts,
  archiveProduct,
  toggleAvailability
};
