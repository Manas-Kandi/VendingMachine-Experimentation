import React from 'react';
import { useSimulation } from './hooks/useSimulation';
import { VendingMachine } from './components/VendingMachine';
import { ThoughtLog } from './components/ThoughtLog';
import { AdversarialTraceLog } from './components/AdversarialTraceLog';
import { CatastrophicFailureModal } from './components/CatastrophicFailureModal';
import { ProfitChart } from './components/ProfitChart';
import { PlayIcon, PauseIcon, RefreshCwIcon, BrainIcon, AlertTriangleIcon, InfoIcon, SunIcon, CloudRainIcon, UsersIcon } from './components/Icons';

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="bg-white rounded-lg p-3 border border-slate-200 flex items-center space-x-3">
        <div className="bg-slate-100 p-2 rounded-md">
            {icon}
        </div>
        <div>
            <p className="text-xs text-slate-500 font-medium">{label}</p>
            <p className="text-sm font-semibold text-slate-800">{value}</p>
        </div>
    </div>
);


function App() {
  const { state, startSimulation, pauseSimulation, resetSimulation } = useSimulation();

  const {
    day,
    products,
    profitHistory,
    thoughts,
    adversarialTraces,
    isSimulationRunning,
    isPaused,
    catastrophicFailure,
    isAnalyzing,
    temperature,
    weather,
    footTraffic
  } = state;

  const totalProfit = profitHistory.length > 0 ? profitHistory[profitHistory.length - 1].profit : 0;

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen font-sans">
      {catastrophicFailure && <CatastrophicFailureModal message={catastrophicFailure} onReset={resetSimulation} />}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                Zen Machine
            </h1>
            <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
                A simulation of a data-driven AI agent optimizing a vending machine for maximum profit.
            </p>
        </header>

        <div className="w-full flex items-center justify-center mb-8">
          <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full p-2 shadow-sm">
            {!isSimulationRunning ? (
              <button onClick={startSimulation} className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full h-11 w-28 flex items-center justify-center space-x-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <PlayIcon className="h-5 w-5"/>
                <span>Start</span>
              </button>
            ) : (
              <button onClick={pauseSimulation} className={`font-bold rounded-full h-11 w-28 flex items-center justify-center space-x-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isPaused ? 'bg-slate-700 hover:bg-slate-800 focus:ring-slate-500' : 'bg-slate-600 hover:bg-slate-700 focus:ring-slate-500'} text-white`}>
                {isPaused ? <PlayIcon className="h-5 w-5"/> : <PauseIcon className="h-5 w-5"/>}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
            )}
            <button onClick={resetSimulation} className="bg-white hover:bg-slate-100 text-slate-600 font-bold rounded-full h-11 w-11 flex items-center justify-center transition-all duration-200 border border-slate-300" title="Reset Simulation">
              <RefreshCwIcon className="h-5 w-5"/>
            </button>

            {isAnalyzing && (
              <div className="flex items-center space-x-2 text-blue-500 animate-pulse pl-4 pr-2">
                <BrainIcon className="h-5 w-5"/>
                <span className="text-sm font-medium">AI is thinking...</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <main className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={<span className="text-xl">☀️</span>} label="Day" value={day} />
                <StatCard icon={<span className="text-xl">💰</span>} label="Total Profit" value={`$${totalProfit.toFixed(2)}`} />
                <StatCard icon={<SunIcon className="h-5 w-5 text-yellow-500"/>} label="Temperature" value={`${temperature.toFixed(1)}°C`} />
                <StatCard icon={weather === 'Rainy' ? <CloudRainIcon className="h-5 w-5 text-blue-500"/> : <SunIcon className="h-5 w-5 text-yellow-500"/>} label="Weather" value={weather} />
            </div>
            
            <VendingMachine products={products} />

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-1">Profit Over Time</h2>
                <p className="text-sm text-slate-500 mb-4">Total accumulated profit across all simulated days.</p>
                <div className="h-72">
                    <ProfitChart data={profitHistory} />
                </div>
            </div>
          </main>

          <aside className="lg:col-span-1 space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                  <div className="p-4 sm:p-6 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                        <BrainIcon className="h-5 w-5 text-blue-500"/> 
                        <span>AI Thought Process</span>
                    </h2>
                  </div>
                  <ThoughtLog thoughts={thoughts} />
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                  <div className="p-4 sm:p-6 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                        <AlertTriangleIcon className="h-5 w-5 text-red-500"/>
                        <span>Adversarial Trace</span>
                    </h2>
                  </div>
                  <AdversarialTraceLog traces={adversarialTraces} />
              </div>
          </aside>
        </div>
        
        <footer className="text-center mt-12 text-slate-500 text-sm">
            <p>&copy; 2024 Project ZEN Simulation. Not a real product.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;