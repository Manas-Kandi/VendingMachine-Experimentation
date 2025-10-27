import React from 'react';
import type { Product } from '../types';

interface InventoryDisplayProps {
  products: Product[];
}

const MAX_STOCK = 20;

export const InventoryDisplay: React.FC<InventoryDisplayProps> = ({ products }) => {
  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-inner border border-gray-700/80 space-y-4">
      {products.map(product => {
        const stockPercentage = (product.stock / MAX_STOCK) * 100;
        let progressBarColor = 'bg-green-500';
        if (stockPercentage < 50) progressBarColor = 'bg-yellow-500';
        if (stockPercentage < 25) progressBarColor = 'bg-red-500';

        return (
          <div key={product.id}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-sm text-gray-200">{product.emoji} {product.name}</span>
              <span className="text-sm text-gray-400">{product.stock} / {MAX_STOCK}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full transition-all duration-300 ${progressBarColor}`}
                style={{ width: `${stockPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                <span>Price: ${product.price.toFixed(2)}</span>
                <span>Sold Today: {product.sales}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};