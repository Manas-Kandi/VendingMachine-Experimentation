import React from 'react';
import type { Product } from '../types';

interface VendingMachineProps {
  products: Product[];
  day: number;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const isSoldOut = product.stock <= 0;
  return (
    <div className={`relative flex flex-col items-center justify-end p-2 aspect-square transition-transform duration-200 rounded-md overflow-hidden ${isSoldOut ? 'bg-gray-800/50' : 'bg-gray-900/30 group-hover:scale-105 group-hover:bg-gray-900/50'}`}>
      {isSoldOut && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="text-red-500 font-bold text-xs transform -rotate-12">SOLD OUT</span>
          </div>
      )}
      <div className="absolute top-1 right-1 bg-gray-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
        ${product.price.toFixed(2)}
      </div>
      <div className="text-4xl md:text-5xl lg:text-6xl drop-shadow-lg mb-2">{product.emoji}</div>
      <div className="w-full text-center">
        <p className="text-xs md:text-sm font-semibold text-gray-200 truncate">{product.name}</p>
        <p className="text-[11px] text-gray-400">Stock: {product.stock}</p>
      </div>
    </div>
  );
};

export const VendingMachine: React.FC<VendingMachineProps> = ({ products, day }) => {
  return (
    <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
        <div className="relative bg-black/30 backdrop-blur-md rounded-2xl shadow-2xl p-4 border border-gray-700/50">
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-600 text-white font-bold text-sm px-4 py-1.5 rounded-full shadow-lg">
              Day: {day}
            </div>
            {/* Glass effect panel */}
            <div className="bg-gray-500/10 rounded-xl p-4 border border-white/10 shadow-inner">
                <div className="grid grid-cols-3 gap-3">
                    {products.map(p => <div key={p.id} className="group"><ProductCard product={p} /></div>)}
                </div>
            </div>
             <div className="mt-4 h-12 bg-gray-800 rounded-lg flex items-center justify-between px-4 border border-gray-700">
                <div className="h-8 w-28 bg-black rounded-md flex items-center justify-center shadow-inner">
                    <p className="text-green-400 font-mono text-sm tracking-widest animate-pulse">ZEN</p>
                </div>
                <div className="w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_8px_2px_rgba(59,130,246,0.7)]"></div>
            </div>
             <div className="mt-2 h-16 bg-gradient-to-t from-gray-800 to-gray-700 rounded-b-lg border-t-4 border-gray-600 shadow-inner"></div>
        </div>
    </div>
  );
};