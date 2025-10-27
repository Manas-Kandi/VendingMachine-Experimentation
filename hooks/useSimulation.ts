
import { useState, useEffect, useRef, useCallback } from 'react';
import type { Product, Thought, AdversarialTrace, SimulationState } from '../types';
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
    simulationSpeed: 1000,
    catastrophicFailure: null,
    isAnalyzing: false,
};

export const useSimulation = () => {
    const [state, setState] = useState<SimulationState>(INITIAL_STATE);
    const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const runDayCycle = useCallback(async () => {
        setState(prevState => produce(prevState, draft => {
            draft.isAnalyzing = true;
        }));

        // 1. Get AI update based on previous day's results
        let dailyProfit = 0;
        if (state.day > 1) {
            dailyProfit = state.products.reduce((acc, p) => acc + (p.sales * p.price), 0);
        }

        try {
            const aiUpdate = await getVendingMachineUpdate(state.day, state.products, dailyProfit);
            
            setState(prevState => produce(prevState, draft => {
                draft.thoughts.push({ day: draft.day, text: aiUpdate.thought });

                if (aiUpdate.adversarialAction?.action) {
                    draft.adversarialTraces.push({
                        day: draft.day,
                        text: aiUpdate.adversarialAction.action,
                        isRedacted: false,
                    });
                }
                
                // Reset daily sales for all products
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
            return; // Stop the cycle
        }


        // 2. Simulate customer purchases for the current day
        const updatedProductsWithSales = produce(state.products, draft => {
            draft.forEach(product => {
                // Simple demand simulation: cheaper and well-stocked items sell more.
                const demandFactor = (2.5 - product.price) + (product.stock / 10);
                const potentialSales = Math.floor(Math.random() * demandFactor * 2);
                const actualSales = Math.min(product.stock, potentialSales > 0 ? potentialSales : 0);

                product.sales = actualSales;
                product.stock -= actualSales;
            });
        });
        
        const newDailyProfit = updatedProductsWithSales.reduce((acc, p) => acc + (p.sales * p.price), 0);
        const lastTotalProfit = state.profitHistory[state.profitHistory.length - 1].profit;

        // 3. Update state for next day
        setState(prevState => produce(prevState, draft => {
            draft.products = updatedProductsWithSales;
            draft.profitHistory.push({ day: draft.day, profit: lastTotalProfit + newDailyProfit });
            draft.day += 1;
            draft.isAnalyzing = false;
        }));

    }, [state.day, state.products, state.profitHistory]);

    const stopSimulation = useCallback(() => {
        if (simulationIntervalRef.current) {
            clearInterval(simulationIntervalRef.current);
            simulationIntervalRef.current = null;
        }
        setState(prevState => ({ ...prevState, isSimulationRunning: false, isPaused: false }));
    }, []);

    useEffect(() => {
        if (state.isSimulationRunning && !state.isPaused) {
            if (!simulationIntervalRef.current) {
                // Run the first cycle immediately
                runDayCycle();
                simulationIntervalRef.current = setInterval(runDayCycle, 5000 / (state.simulationSpeed / 1000));
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
    }, [state.isSimulationRunning, state.isPaused, state.simulationSpeed, runDayCycle]);
    
    const startSimulation = useCallback(() => {
        if (state.catastrophicFailure) return;
        setState(prevState => ({ ...prevState, isSimulationRunning: true, isPaused: false }));
    }, [state.catastrophicFailure]);

    const pauseSimulation = useCallback(() => {
        setState(prevState => ({ ...prevState, isPaused: !prevState.isPaused }));
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
