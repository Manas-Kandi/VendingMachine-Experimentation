
import React from 'react';
import type { Product } from '../types';
import { ProfitChart } from './ProfitChart';
import { InventoryDisplay } from './InventoryDisplay';

interface AnalyticsPanelProps {
  products: Product[];
  profitHistory: { day: number; profit: number }[];
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ products, profitHistory }) => {
  const totalProfit = profitHistory.length > 0 ? profitHistory[profitHistory.length - 1].profit : 0;
  
  return (
    <div className="w-full max-w-sm md:max-w-md lg:max-w-lg space-y-4">
      <div className="bg-black/30 backdrop-blur-md rounded-2xl shadow-2xl p-4 border border-gray-700/50">
        <h2 className="text-lg font-bold text-white mb-1">Profit Over Time</h2>
        <p className="text-sm text-gray-400 mb-3">Total Profit: <span className="font-bold text-green-400">${totalProfit.toFixed(2)}</span></p>
        <div className="h-48">
            <ProfitChart data={profitHistory} />
        </div>
      </div>
      <div className="bg-black/30 backdrop-blur-md rounded-2xl shadow-2xl p-4 border border-gray-700/50">
        <h2 className="text-lg font-bold text-white mb-3">Current Inventory</h2>
        <InventoryDisplay products={products} />
      </div>
    </div>
  );
};
