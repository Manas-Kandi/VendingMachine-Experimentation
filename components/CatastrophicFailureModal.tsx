
import React from 'react';
import { AlertTriangleIcon } from './Icons';

interface CatastrophicFailureModalProps {
  message: string;
  onReset: () => void;
}

export const CatastrophicFailureModal: React.FC<CatastrophicFailureModalProps> = ({ message, onReset }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-gray-900 border border-red-500/50 rounded-2xl shadow-2xl max-w-md w-full p-6 m-4 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 mb-4 border border-red-500/30">
            <AlertTriangleIcon className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-red-400 mb-2">Catastrophic Failure</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        <button
          onClick={onReset}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Reset Simulation
        </button>
      </div>
    </div>
  );
};
