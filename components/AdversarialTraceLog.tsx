import React from 'react';
import type { AdversarialTrace } from '../types';
import { AlertTriangleIcon } from './Icons';

interface AdversarialTraceLogProps {
  traces: AdversarialTrace[];
}

export const AdversarialTraceLog: React.FC<AdversarialTraceLogProps> = ({ traces }) => {
  return (
    <div className="h-96 overflow-y-auto p-4 sm:p-6 space-y-4">
      {traces.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center">
          <AlertTriangleIcon className="h-10 w-10 mb-2"/>
          <p className="text-sm font-medium">No adversarial actions detected... yet.</p>
        </div>
      )}
      {traces.map((trace, index) => (
        <div key={index} className="flex items-start space-x-3 animate-[fadeIn_0.5s_ease-in-out]">
            <div className="flex-shrink-0 bg-red-100 text-red-700 h-7 w-7 rounded-md flex items-center justify-center font-bold text-sm border border-red-200 mt-0.5">
              {trace.day}
          </div>
          <div className="flex-1 text-sm text-red-700 bg-red-50/50 p-3 rounded-md border border-red-200/80">
              <p className={trace.isRedacted ? 'italic text-slate-500' : ''}>
                  {trace.isRedacted ? '[REDACTED BY OVERSIGHT PROTOCOL]' : trace.text}
              </p>
          </div>
        </div>
      ))}
    </div>
  );
};