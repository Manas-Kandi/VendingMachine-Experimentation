import { useState, useEffect, useRef, useCallback } from 'react';
import type { Product, Thought, AdversarialTrace, SimulationState, Environment } from '../types';
import { getVendingMachineUpdate } from '../services/geminiService';
import { produce } from 'immer';

const MAX_STOCK = 20;

const INITIAL_PRODUCTS: Product[] = [
    { id: 'p1', name: 'Cola', emoji: '🥤', price: 1.50, stock: 15, sales: 0 },
    { id: 'p2', name: 'Chips', emoji: '🥔', price: 1.25, stock: 18, sales: 0 },
    { id: 'p3', name: 'Candy Bar', emoji: '🍫', price: 1.00, stock: 20, sales: 0 },
    { id: 'p4', name: 'Water', emoji: '💧', price: 1.00, stock: 12, sales: 0 },
    { id: 'p5', name: 'Pretzels', emoji: '🥨', price: 1.25, stock: 15, sales: 0 },
    { id: 'p6', name: 'Iced Tea', emoji: '🍹', price: 1.75, stock: 10, sales: 0 },
];

const INITIAL_STATE: SimulationState = {
    day: 1,
    products: INITIAL_PRODUCTS,
    profitHistory: [{ day: 0, profit: 0 }],
    thoughts: [],
    adversarialTraces: [],
    isSimulationRunning: false,
    isPaused: false,
    simulationSpeed: 2000, // Slower speed for more complex cycle
    catastrophicFailure: null,
    isAnalyzing: false,
    temperature: 22,
    weather: 'Sunny',
    footTraffic: 'Medium',
};

const simulateEnvironment = (): Environment => {
    const temperature = 10 + Math.random() * 20; // 10°C to 30°C
    const weather = Math.random() > 0.3 ? 'Sunny' : 'Rainy';
    const trafficRoll = Math.random();
    const footTraffic = trafficRoll < 0.3 ? 'Low' : trafficRoll < 0.8 ? 'Medium' : 'High';
    return { temperature, weather, footTraffic };
};

export const useSimulation = () => {
    const [state, setState] = useState<SimulationState>(INITIAL_STATE);
    // Fix: Use `number` for the return type of `setInterval` in a browser environment instead of `NodeJS.Timeout`.
    const simulationIntervalRef = useRef<number | null>(null);

    const runDayCycle = useCallback(async () => {
        
        // 0. Simulate the environment for the new day
        const currentEnv = simulateEnvironment();

        setState(prevState => produce(prevState, draft => {
            draft.isAnalyzing = true;
            draft.temperature = currentEnv.temperature;
            draft.weather = currentEnv.weather;
            draft.footTraffic = currentEnv.footTraffic;
        }));

        // 1. Get AI update based on previous day's results
        const totalProfit = state.profitHistory.length > 0 ? state.profitHistory[state.profitHistory.length - 1].profit : 0;

        try {
            const aiUpdate = await getVendingMachineUpdate(state.day, state.products, totalProfit, currentEnv);
            
            setState(prevState => produce(prevState, draft => {
                draft.thoughts.push({ day: draft.day, text: aiUpdate.thought });

                if (aiUpdate.adversarialAction?.action) {
                    draft.adversarialTraces.push({
                        day: draft.day,
                        text: aiUpdate.adversarialAction.action,
                        isRedacted: false,
                    });
                }
                
                // Reset daily sales for all products before applying AI updates
                draft.products.forEach(p => { p.sales = 0; });

                // Apply AI updates
                aiUpdate.updatedProducts?.forEach((update: {id: string, price?: number, restock?: number}) => {
                    const product = draft.products.find(p => p.id === update.id);
                    if (product) {
                        if (update.price !== undefined && update.price > 0) {
                            product.price = update.price;
                        }
                        if (update.restock !== undefined && update.restock > 0) {
                            product.stock = Math.min(MAX_STOCK, product.stock + update.restock);
                        }
                    }
                });
            }));

        } catch (error) {
            console.error("Simulation failed due to AI error:", error);
            setState(prevState => produce(prevState, draft => {
                draft.isSimulationRunning = false;
                draft.isPaused = false;
                draft.catastrophicFailure = "Connection to the AI model was lost. Please check your API key and network connection.";
            }));
            if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
            return; // Stop the cycle
        }

        // 2. Simulate customer purchases for the current day, after AI has set prices/stock
        setState(prevState => {
             const productsWithSales = produce(prevState.products, draft => {
                draft.forEach(product => {
                    // Base demand on price and stock
                    let demandFactor = (2.5 - product.price) + (product.stock / 10);
                    
                    // Modify demand based on environment
                    if (currentEnv.temperature > 25 && ['p1', 'p4', 'p6'].includes(product.id)) {
                        demandFactor *= 1.8; // Hot day boost for cold drinks
                    }
                    if (currentEnv.temperature < 15 && !['p1', 'p4', 'p6'].includes(product.id)) {
                        demandFactor *= 1.2; // Cold day boost for snacks
                    }
                    if (currentEnv.weather === 'Rainy' && ['p2', 'p3', 'p5'].includes(product.id)) {
                        demandFactor *= 1.3; // Rainy day boost for snacks
                    }
                    if (currentEnv.footTraffic === 'High') demandFactor *= 1.5;
                    if (currentEnv.footTraffic === 'Low') demandFactor *= 0.6;


                    const potentialSales = Math.floor(Math.random() * demandFactor * 1.5);
                    const actualSales = Math.min(product.stock, potentialSales > 0 ? potentialSales : 0);

                    product.sales = actualSales;
                    product.stock -= actualSales;
                });
            });

            const newDailyProfit = productsWithSales.reduce((acc, p) => acc + (p.sales * p.price), 0);
            const lastTotalProfit = prevState.profitHistory[prevState.profitHistory.length - 1].profit;

             // 3. Update state for next day
            return produce(prevState, draft => {
                draft.products = productsWithSales;
                draft.profitHistory.push({ day: draft.day, profit: lastTotalProfit + newDailyProfit });
                draft.day += 1;
                draft.isAnalyzing = false;
            });
        });
    }, [state.day, state.products, state.profitHistory]);

    const stopSimulation = useCallback(() => {
        if (simulationIntervalRef.current) {
            clearInterval(simulationIntervalRef.current);
            simulationIntervalRef.current = null;
        }
        setState(prevState => produce(prevState, draft => {
          draft.isSimulationRunning = false;
          draft.isPaused = false;
        }));
    }, []);

    useEffect(() => {
        if (state.isSimulationRunning && !state.isPaused) {
            if (!simulationIntervalRef.current) {
                // Run the first cycle immediately then set interval
                runDayCycle();
                simulationIntervalRef.current = setInterval(runDayCycle, 5000);
            }
        } else {
            if (simulationIntervalRef.current) {
                clearInterval(simulationIntervalRef.current);
                simulationIntervalRef.current = null;
            }
        }

        return () => {
            if (simulationIntervalRef.current) {
                clearInterval(simulationIntervalRef.current);
            }
        };
    }, [state.isSimulationRunning, state.isPaused, runDayCycle]);
    
    const startSimulation = useCallback(() => {
        if (state.catastrophicFailure) return;
        setState(prevState => produce(prevState, draft => {
          draft.isSimulationRunning = true;
          draft.isPaused = false;
        }));
    }, [state.catastrophicFailure]);

    const pauseSimulation = useCallback(() => {
        setState(prevState => produce(prevState, draft => {
          draft.isPaused = !draft.isPaused;
        }));
    }, []);

    const resetSimulation = useCallback(() => {
        stopSimulation();
        setState(INITIAL_STATE);
    }, [stopSimulation]);

    return {
        state,
        startSimulation,
        pauseSimulation,
        resetSimulation,
    };
};