import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductGrid = ({ products }) => {
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 w-full">
      {products.map((product) => (
        <div
          key={product.id}
          className="border p-4 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition"
          onClick={() => handleProductClick(product)}
        >
          <img
            src={product.images[0].url}
            alt={product.images[0].altText}
            className="w-full h-48 object-cover rounded-lg"
          />
          <h3 className="mt-2 font-bold text-lg">{product.name}</h3>
          <p className="text-gray-600">${product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
