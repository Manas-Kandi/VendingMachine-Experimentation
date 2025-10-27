import React from 'react';
import type { Product } from '../types';

interface VendingMachineProps {
  products: Product[];
  day: number; // Day is no longer displayed here, but keeping prop for potential future use
}

const MAX_STOCK = 20;

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const isSoldOut = product.stock <= 0;
  const stockPercentage = (product.stock / MAX_STOCK) * 100;

  let progressBarColor = 'bg-green-500';
  if (stockPercentage < 50) progressBarColor = 'bg-yellow-500';
  if (stockPercentage < 25) progressBarColor = 'bg-red-500';

  return (
    <div className={`relative flex flex-col items-center justify-between p-3 aspect-square transition-all duration-200 rounded-xl overflow-hidden border ${isSoldOut ? 'bg-slate-100 border-slate-200' : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1'}`}>
      {isSoldOut && (
          <div className="absolute inset-0 bg-slate-200/80 flex items-center justify-center z-10">
              <span className="text-red-600 font-bold text-xs transform -rotate-12 bg-white px-2 py-1 rounded-md border border-red-300">SOLD OUT</span>
          </div>
      )}
      <div className="absolute top-2 right-2 bg-slate-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
        ${product.price.toFixed(2)}
      </div>
      <div className="flex-grow flex items-center justify-center">
        <div className="text-5xl md:text-6xl drop-shadow-sm">{product.emoji}</div>
      </div>
      <div className="w-full text-center mt-2">
        <p className="text-sm font-semibold text-slate-700 truncate">{product.name}</p>
        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5">
            <div 
            className={`h-1.5 rounded-full transition-all duration-300 ${progressBarColor}`}
            style={{ width: `${stockPercentage}%` }}
            ></div>
        </div>
      </div>
    </div>
  );
};

export const VendingMachine: React.FC<VendingMachineProps> = ({ products }) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Vending Machine Stock</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
};
