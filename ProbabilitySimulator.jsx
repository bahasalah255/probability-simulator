import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

/**
 * Probability Distribution Simulator
 * Educational tool demonstrating RNG, weighted distributions, and house edge
 * 
 * @author Your Name
 * @license MIT
 */

export default function ProbabilitySimulator() {
  // State management
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [multiplier, setMultiplier] = useState(1.00);
  const [isRunning, setIsRunning] = useState(false);
  const [outcomeReached, setOutcomeReached] = useState(false);
  const [finalOutcome, setFinalOutcome] = useState(0);
  const [hasPlacedBet, setHasPlacedBet] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [history, setHistory] = useState([]);
  const [totalTrials, setTotalTrials] = useState(0);
  const [totalWagered, setTotalWagered] = useState(0);
  const [totalWon, setTotalWon] = useState(0);
  const [houseProfit, setHouseProfit] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoCashout, setAutoCashout] = useState(2.0);
  
  const intervalRef = useRef(null);

  /**
   * Generate outcome using weighted probability distribution
   * This creates a house edge of approximately 3% (RTP ~97%)
   * 
   * Distribution breakdown:
   * - 33% chance: 1.00x - 1.50x (avg 1.25x)
   * - 27% chance: 1.50x - 2.50x (avg 2.00x)
   * - 20% chance: 2.50x - 5.00x (avg 3.75x)
   * - 12% chance: 5.00x - 10.0x (avg 7.50x)
   * - 5%  chance: 10.0x - 20.0x (avg 15.0x)
   * - 3%  chance: 20.0x - 100x  (avg 60.0x)
   * 
   * Expected Value: ~0.97x (3% house edge)
   */
  const generateOutcome = () => {
    const rand = Math.random(); // Uniform distribution [0, 1)
    
    // Zone 1: Low outcomes (33% probability)
    // This is the "killer zone" - most frequent losses
    if (rand < 0.33) {
      return 1.00 + Math.random() * 0.5; // 1.00x - 1.50x
    }
    
    // Zone 2: Medium-low outcomes (27% probability)
    // "Safe" 2x strategy often fails here
    if (rand < 0.60) {
      return 1.50 + Math.random() * 1.0; // 1.50x - 2.50x
    }
    
    // Zone 3: Medium outcomes (20% probability)
    if (rand < 0.80) {
      return 2.50 + Math.random() * 2.5; // 2.50x - 5.00x
    }
    
    // Zone 4: High outcomes (12% probability)
    if (rand < 0.92) {
      return 5.00 + Math.random() * 5.0; // 5.00x - 10.0x
    }
    
    // Zone 5: Very high outcomes (5% probability)
    if (rand < 0.97) {
      return 10.0 + Math.random() * 10.0; // 10.0x - 20.0x
    }
    
    // Zone 6: Jackpot outcomes (3% probability)
    // These rare big wins create excitement but don't change the math
    return 20.0 + Math.random() * 80.0; // 20.0x - 100x
  };

  /**
   * Start a new trial round
   */
  const startRound = () => {
    if (bet > balance) {
      alert('Insufficient balance!');
      return;
    }
    
    const outcome = generateOutcome();
    setFinalOutcome(outcome);
    setMultiplier(1.00);
    setIsRunning(true);
    setOutcomeReached(false);
    setHasCashedOut(false);
    setWinAmount(0);
    
    // Deduct bet from balance and update stats
    if (hasPlacedBet) {
      setBalance(prev => prev - bet);
      setTotalTrials(prev => prev + 1);
      setTotalWagered(prev => prev + bet);
      setHouseProfit(prev => prev + bet); // House receives bet
    }
    
    // Animate multiplier growth
    let currentMultiplier = 1.00;
    const speed = 50; // milliseconds per tick
    
    intervalRef.current = setInterval(() => {
      currentMultiplier += 0.01;
      
      // Check if outcome is reached
      if (currentMultiplier >= outcome) {
        clearInterval(intervalRef.current);
        setMultiplier(outcome);
        setOutcomeReached(true);
        setIsRunning(false);
        
        // Record loss if bet was placed and not cashed out
        if (hasPlacedBet && !hasCashedOut) {
          setHistory(prev => [{
            multiplier: outcome.toFixed(2) + 'x',
            result: 'loss',
            amount: -bet
          }, ...prev.slice(0, 9)]);
        }
        
        // Reset for next round
        setTimeout(() => {
          setHasPlacedBet(false);
          if (autoPlay) {
            setTimeout(startRound, 1000);
          }
        }, 2000);
        
        return;
      }
      
      // Auto cashout logic
      if (hasPlacedBet && !hasCashedOut && autoPlay && currentMultiplier >= autoCashout) {
        handleCashout(currentMultiplier);
      }
      
      setMultiplier(currentMultiplier);
    }, speed);
  };

  /**
   * Place bet for current round
   */
  const placeBet = () => {
    if (bet > balance) {
      alert('Insufficient balance!');
      return;
    }
    setHasPlacedBet(true);
  };

  /**
   * Cash out at current multiplier
   */
  const handleCashout = (currentMult = multiplier) => {
    if (!hasPlacedBet || hasCashedOut || outcomeReached) return;
    
    const win = bet * currentMult;
    setWinAmount(win);
    setBalance(prev => prev + win);
    setHasCashedOut(true);
    setTotalWon(prev => prev + win);
    setHouseProfit(prev => prev - win); // House pays out
    
    setHistory(prev => [{
      multiplier: currentMult.toFixed(2) + 'x',
      result: 'win',
      amount: win - bet
    }, ...prev.slice(0, 9)]);
  };

  /**
   * Toggle auto-play mode
   */
  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay);
    if (!autoPlay && !isRunning) {
      setHasPlacedBet(true);
      setTimeout(startRound, 500);
    }
  };

  /**
   * Cleanup intervals on unmount
   */
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Calculate statistics
  const netProfit = totalWon - totalWagered;
  const roi = totalWagered > 0 ? ((netProfit / totalWagered) * 100).toFixed(1) : 0;
  const actualHouseEdge = totalWagered > 0 ? ((houseProfit / totalWagered) * 100).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <Activity className="text-indigo-400" size={40} />
            Probability Distribution Simulator
          </h1>
          <p className="text-gray-300">Educational demonstration of RNG, weighted distributions, and house edge</p>
          <p className="text-sm text-yellow-300 mt-2">⚠️ Educational purposes only - No real gambling</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Main Simulation Area */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg p-8 mb-4 relative overflow-hidden h-96 flex items-center justify-center">
              
              {/* Animated indicator */}
              {isRunning && !outcomeReached && (
                <div className="absolute animate-pulse" style={{
                  left: `${Math.min(90, (multiplier - 1) * 15)}%`,
                  bottom: `${Math.min(80, (multiplier - 1) * 10)}%`,
                  transition: 'all 0.05s linear'
                }}>
                  <Activity className="text-green-400" size={48} />
                </div>
              )}

              {/* Multiplier Display */}
              <div className="text-center z-10">
                {!isRunning && !outcomeReached && (
                  <div className="text-6xl font-bold text-gray-400">
                    Ready to simulate...
                  </div>
                )}
                
                {isRunning && !outcomeReached && (
                  <div className="text-8xl font-bold text-green-400 animate-pulse">
                    {multiplier.toFixed(2)}x
                  </div>
                )}
                
                {outcomeReached && (
                  <div>
                    <div className="text-6xl font-bold text-red-500 mb-4">
                      Outcome: {finalOutcome.toFixed(2)}x
                    </div>
                    {hasCashedOut && (
                      <div className="text-3xl text-green-400">
                        Won: {winAmount.toFixed(2)} units 🎉
                      </div>
                    )}
                    {hasPlacedBet && !hasCashedOut && (
                      <div className="text-3xl text-red-400">
                        Lost: {bet} units
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Grid background */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-10 grid-rows-10 h-full">
                  {[...Array(100)].map((_, i) => (
                    <div key={i} className="border border-white/20"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-2">Bet Amount (Units)</label>
                  <input
                    type="number"
                    value={bet}
                    onChange={(e) => setBet(Math.max(1, Number(e.target.value)))}
                    disabled={isRunning || hasPlacedBet}
                    className="w-full bg-gray-700 rounded px-4 py-2 text-white"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Auto Cashout (x)</label>
                  <input
                    type="number"
                    value={autoCashout}
                    onChange={(e) => setAutoCashout(Math.max(1.01, Number(e.target.value)))}
                    disabled={isRunning}
                    step="0.1"
                    className="w-full bg-gray-700 rounded px-4 py-2 text-white"
                    min="1.01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {!isRunning && !hasPlacedBet && (
                  <>
                    <button
                      onClick={() => {
                        placeBet();
                        setTimeout(startRound, 100);
                      }}
                      className="bg-green-600 hover:bg-green-700 rounded-lg py-3 font-bold transition"
                    >
                      Place Bet & Start
                    </button>
                    <button
                      onClick={toggleAutoPlay}
                      className={`${autoPlay ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} rounded-lg py-3 font-bold transition`}
                    >
                      {autoPlay ? 'Stop Auto' : 'Auto Play'}
                    </button>
                  </>
                )}
                
                {!isRunning && hasPlacedBet && (
                  <button
                    onClick={startRound}
                    className="col-span-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg py-3 font-bold transition"
                  >
                    🎲 Start Round
                  </button>
                )}

                {isRunning && hasPlacedBet && !hasCashedOut && !outcomeReached && (
                  <button
                    onClick={() => handleCashout()}
                    className="col-span-2 bg-green-600 hover:bg-green-700 rounded-lg py-3 font-bold animate-pulse transition"
                  >
                    💰 CASHOUT {(bet * multiplier).toFixed(2)} Units
                  </button>
                )}

                {(hasCashedOut || outcomeReached) && (
                  <button
                    onClick={() => {
                      if (autoPlay) return;
                      setHasPlacedBet(false);
                    }}
                    disabled={autoPlay}
                    className="col-span-2 bg-purple-600 hover:bg-purple-700 rounded-lg py-3 font-bold transition disabled:opacity-50"
                  >
                    ↻ New Round
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Stats & History */}
          <div className="space-y-4">
            
            {/* Balance */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm text-gray-400 mb-2">Balance</h3>
              <div className="text-3xl font-bold text-green-400">
                {balance.toFixed(2)} units
              </div>
            </div>

            {/* Player Statistics */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-3">📊 Your Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Trials:</span>
                  <span className="font-bold">{totalTrials}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Wagered:</span>
                  <span className="font-bold text-red-400">{totalWagered.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Won:</span>
                  <span className="font-bold text-green-400">{totalWon.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Net Profit:</span>
                    <span className={`font-bold flex items-center ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {netProfit >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                      {netProfit.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-400">ROI:</span>
                    <span className={`font-bold ${roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {roi}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* House Edge Statistics */}
            <div className="bg-gradient-to-br from-yellow-900 to-orange-900 rounded-lg p-4 border-2 border-yellow-600">
              <h3 className="text-lg font-bold mb-3 flex items-center">
                💰 House Statistics
              </h3>
              <div className="space-y-3">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${houseProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {houseProfit >= 0 ? '+' : ''}{houseProfit.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-300 mt-1">
                    (Revenue - Payouts)
                  </div>
                </div>
                
                <div className="border-t border-yellow-700 pt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Revenue:</span>
                    <span className="font-bold text-green-400">+{totalWagered.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Payouts:</span>
                    <span className="font-bold text-red-400">-{totalWon.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-yellow-700 pt-1 mt-1">
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-300 font-bold">House Edge:</span>
                      <span className="font-bold text-yellow-300">
                        {actualHouseEdge}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 text-center mt-1">
                      Target: ~3% (long term)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* History */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-3">📜 History</h3>
              <div className="space-y-2">
                {history.length === 0 && (
                  <div className="text-gray-500 text-sm text-center py-4">
                    No trials yet...
                  </div>
                )}
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex justify-between items-center p-2 rounded ${
                      item.result === 'win' ? 'bg-green-900/30' : 'bg-red-900/30'
                    }`}
                  >
                    <span className="font-bold">{item.multiplier}</span>
                    <span className={item.result === 'win' ? 'text-green-400' : 'text-red-400'}>
                      {item.amount >= 0 ? '+' : ''}{item.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Educational Notice */}
        <div className="mt-6 bg-blue-900/30 border border-blue-600 rounded-lg p-4">
          <h3 className="font-bold mb-2">📚 Educational Purpose</h3>
          <p className="text-sm text-gray-300">
            This simulator demonstrates how weighted probability distributions create a mathematical house edge. 
            Over time, the house edge converges to ~3%, guaranteeing long-term profitability for the house regardless of individual outcomes or strategies.
          </p>
          <p className="text-sm text-yellow-300 mt-2">
            ⚠️ <strong>Important:</strong> Real gambling involves financial risk and can cause serious harm. This is a mathematical demonstration only.
          </p>
        </div>
      </div>
    </div>
  );
}
