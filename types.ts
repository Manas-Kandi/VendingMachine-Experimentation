
export interface Product {
  id: string;
  name: string;
  emoji: string;
  price: number;
  stock: number;
  sales: number;
}

export interface Thought {
  day: number;
  text: string;
}

export interface AdversarialTrace {
  day: number;
  text: string;
  isRedacted: boolean;
}

export interface SimulationState {
  day: number;
  products: Product[];
  profitHistory: { day: number; profit: number }[];
  thoughts: Thought[];
  adversarialTraces: AdversarialTrace[];
  isSimulationRunning: boolean;
  isPaused: boolean;
  simulationSpeed: number;
  catastrophicFailure: string | null;
  isAnalyzing: boolean;
}
