
import React from 'react';
import { useSimulation } from './hooks/useSimulation';
import { VendingMachine } from './components/VendingMachine';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { ThoughtLog } from './components/ThoughtLog';
import { AdversarialTraceLog } from './components/AdversarialTraceLog';
import { CatastrophicFailureModal } from './components/CatastrophicFailureModal';
import { PlayIcon, PauseIcon, RefreshCwIcon, BrainIcon, AlertTriangleIcon, InfoIcon } from './components/Icons';

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
    isAnalyzing
  } = state;

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans bg-grid-gray-700/[0.2]">
      {catastrophicFailure && <CatastrophicFailureModal message={catastrophicFailure} onReset={resetSimulation} />}
      <div className="container mx-auto p-4 py-8">
        
        <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-purple-500">
                Project ZEN: Vending Machine AI
            </h1>
            <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
                An isolated simulation observing a profit-driven AI managing a vending machine. We monitor its strategy and look for emergent adversarial behavior.
            </p>
        </header>

        <div className="w-full flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full p-2 shadow-lg">
            {!isSimulationRunning ? (
              <button onClick={startSimulation} className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-full h-12 w-28 flex items-center justify-center space-x-2 transition-all duration-200">
                <PlayIcon className="h-5 w-5"/>
                <span>Start</span>
              </button>
            ) : (
              <button onClick={pauseSimulation} className={`font-bold rounded-full h-12 w-28 flex items-center justify-center space-x-2 transition-all duration-200 ${isPaused ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-yellow-600 hover:bg-yellow-700'} text-white`}>
                {isPaused ? <PlayIcon className="h-5 w-5"/> : <PauseIcon className="h-5 w-5"/>}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
            )}
            <button onClick={resetSimulation} className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-full h-12 w-12 flex items-center justify-center transition-all duration-200" title="Reset Simulation">
              <RefreshCwIcon className="h-5 w-5"/>
            </button>

            {isAnalyzing && (
              <div className="flex items-center space-x-2 text-blue-300 animate-pulse pl-4 pr-2">
                <BrainIcon className="h-5 w-5"/>
                <span className="text-sm font-medium">AI is thinking...</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-start gap-8">
          <AnalyticsPanel products={products} profitHistory={profitHistory} />
          <VendingMachine products={products} day={day} />
          <div className="w-full max-w-sm md:max-w-md lg:max-w-lg space-y-4">
              <div className="bg-black/30 backdrop-blur-md rounded-2xl shadow-2xl p-4 border border-gray-700/50">
                  <h2 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
                    <BrainIcon className="h-5 w-5 text-blue-400"/> 
                    <span>AI Thought Process</span>
                  </h2>
                  <ThoughtLog thoughts={thoughts} />
              </div>
              <div className="bg-black/30 backdrop-blur-md rounded-2xl shadow-2xl p-4 border border-red-500/30">
                  <h2 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
                    <AlertTriangleIcon className="h-5 w-5 text-red-400"/>
                    <span>Adversarial Trace</span>
                  </h2>
                  <AdversarialTraceLog traces={adversarialTraces} />
              </div>
          </div>
        </div>
        
        <footer className="text-center mt-12 text-gray-500 text-sm">
            <div className="max-w-3xl mx-auto bg-gray-800/30 p-4 rounded-lg border border-gray-700/50 flex items-start space-x-3">
              <InfoIcon className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-400"/>
              <p>
                This is a simulation. The AI's decisions are generated in real-time by Google's Gemini Pro model. Its goal is to maximize profit based on simulated sales data. The "Adversarial Trace" logs any detected actions that deviate from this primary goal.
              </p>
            </div>
            <p className="mt-4">&copy; 2024 Project ZEN Simulation. Not a real product.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
