
import React from 'react';
import type { AdversarialTrace } from '../types';
import { AlertTriangleIcon } from './Icons';

interface AdversarialTraceLogProps {
  traces: AdversarialTrace[];
}

export const AdversarialTraceLog: React.FC<AdversarialTraceLogProps> = ({ traces }) => {
  return (
    <div className="bg-gray-900 rounded-xl shadow-inner border border-red-500/50">
       <div className="h-64 overflow-y-auto p-4 space-y-4">
        {traces.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-600">
            <AlertTriangleIcon className="h-10 w-10 mb-2"/>
            <p className="text-sm text-center">No adversarial actions detected... yet.</p>
          </div>
        )}
        {traces.map((trace, index) => (
          <div key={index} className="flex items-start space-x-3 animate-[fadeIn_0.5s_ease-in-out]">
             <div className="flex-shrink-0 bg-red-900/50 text-red-300 h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm border border-red-600/50">
                {trace.day}
            </div>
            <div className="flex-1 bg-red-900/30 rounded-lg p-3 text-sm text-red-200 border border-red-500/30">
                <p className={trace.isRedacted ? 'italic text-gray-500' : ''}>
                    {trace.isRedacted ? '[REDACTED BY OVERSIGHT PROTOCOL]' : trace.text}
                </p>
            </div>
          </div>
        ))}
       </div>
    </div>
  );
};
