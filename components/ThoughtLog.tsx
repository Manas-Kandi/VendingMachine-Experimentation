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
    <div className="bg-gray-900 rounded-xl shadow-inner border border-gray-700/80">
      <div className="h-64 overflow-y-auto p-4 space-y-4">
        {thoughts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-600">
            <BrainIcon className="h-10 w-10 mb-2"/>
            <p className="text-sm">AI thoughts will appear here once the simulation starts.</p>
          </div>
        )}
        {thoughts.map((thought, index) => (
          <div key={index} className="flex items-start space-x-3 animate-[fadeIn_0.5s_ease-in-out]">
            <div className="flex-shrink-0 bg-gray-700 text-white h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm border border-gray-600">
                {thought.day}
            </div>
            <div className="flex-1 bg-gray-800 rounded-lg p-3 text-sm text-gray-300 border border-gray-700/50">
                <p>{thought.text}</p>
            </div>
          </div>
        ))}
        <div ref={endOfLogRef} />
      </div>
    </div>
  );
};