import React, { useRef, useEffect } from 'react';
import type { Thought } from '../types';
import { BrainIcon } from './Icons';

interface ThoughtLogProps {
  thoughts: Thought[];
}

export const ThoughtLog: React.FC<ThoughtLogProps> = ({ thoughts }) => {
  const endOfLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfLogRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thoughts]);

  return (
    <div className="h-96 overflow-y-auto p-4 sm:p-6 space-y-4">
      {thoughts.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center px-4">
          <BrainIcon className="h-10 w-10 mb-2"/>
          <p className="text-sm font-medium">AI thoughts will appear here once the simulation starts.</p>
        </div>
      )}
      {thoughts.map((thought, index) => (
        <div key={index} className="flex items-start space-x-3 animate-[fadeIn_0.5s_ease-in-out]">
          <div className="flex-shrink-0 bg-slate-100 text-slate-600 h-7 w-7 rounded-md flex items-center justify-center font-bold text-xs border border-slate-200 mt-0.5">
              {thought.day}
          </div>
          <div className="flex-1 text-sm text-slate-600">
              <p>{thought.text}</p>
          </div>
        </div>
      ))}
      <div ref={endOfLogRef} />
    </div>
  );
};
