import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/authService';  // שמתי את זה בתיקיית api ושמך הוא apiService.js

function ProductPage() {
  const { main, sub } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const url = sub ? `/products/${main}/${sub}` : `/products/${main}`;
    api.get(url)
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  }, [main, sub]);

  return (
    <div>
      <h2>מוצרים בקטגוריה: {sub || main}</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name} - ₪{p.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default ProductPage;
