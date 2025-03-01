import React, { useState } from 'react';
import { Save, RotateCcw, PenLine, Target, BarChart2, ClipboardCheck, ArrowLeft } from 'lucide-react';
import { JournalEntry, Trade } from '../types';

interface JournalTabProps {
  journal: JournalEntry;
  onSave: (journal: JournalEntry) => void;
  onBack: () => void;
}

function JournalTab({ journal, onSave, onBack }: JournalTabProps) {
  const [currentJournal, setCurrentJournal] = useState<JournalEntry>(journal);
  const [newTrade, setNewTrade] = useState<Trade>({
    riskPercentage: '',
    pnl: '',
    isWin: false,
    isLoss: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(currentJournal);
  };

  const addTrade = () => {
    if (newTrade.riskPercentage) {
      setCurrentJournal({
        ...currentJournal,
        trades: [...currentJournal.trades, newTrade]
      });
      setNewTrade({
        riskPercentage: '',
        pnl: '',
        isWin: false,
        isLoss: false
      });
    }
  };

  const handleReset = () => {
    setCurrentJournal({
      ...journal,
      plan: '',
      trades: [],
      levelsInterested: '',
      tradingOutcomeReview: ''
    });
    setNewTrade({
      riskPercentage: '',
      pnl: '',
      isWin: false,
      isLoss: false
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="border-b border-gray-200 bg-white px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              type="button"
              onClick={onBack}
              className="mr-4 p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Trading Journal
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {new Date(currentJournal.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Entry
          </button>
        </div>
      </div>

      <div className="bg-white px-8 py-6 space-y-8">
        <div className="space-y-3">
          <div className="flex items-center text-lg font-medium text-gray-900">
            <PenLine className="h-5 w-5 mr-2 text-indigo-600" />
            <h3>Trading Plan</h3>
          </div>
          <textarea
            id="plan"
            rows={4}
            placeholder="Write your trading plan for today..."
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base placeholder:text-gray-400"
            value={currentJournal.plan}
            onChange={(e) => setCurrentJournal({ ...currentJournal, plan: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center text-lg font-medium text-gray-900">
            <BarChart2 className="h-5 w-5 mr-2 text-indigo-600" />
            <h3>Trades for the Day</h3>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            {currentJournal.trades.map((trade, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-900">Risk: {trade.riskPercentage}%</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    trade.isWin 
                      ? 'bg-green-100 text-green-800'
                      : trade.isLoss
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {trade.isWin ? 'Win' : trade.isLoss ? 'Loss' : 'Pending'}
                  </span>
                </div>
                <span className={`text-sm font-medium ${
                  parseFloat(trade.pnl) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trade.pnl && `${parseFloat(trade.pnl) >= 0 ? '+' : ''}${trade.pnl}%`}
                </span>
              </div>
            ))}
            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-white">
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Risk %"
                  className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={newTrade.riskPercentage}
                  onChange={(e) => setNewTrade({ ...newTrade, riskPercentage: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="P&L %"
                  className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={newTrade.pnl}
                  onChange={(e) => setNewTrade({ ...newTrade, pnl: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={newTrade.isWin}
                    onChange={(e) => setNewTrade({ ...newTrade, isWin: e.target.checked, isLoss: false })}
                  />
                  <span className="ml-2 text-sm text-gray-600">Win</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={newTrade.isLoss}
                    onChange={(e) => setNewTrade({ ...newTrade, isLoss: e.target.checked, isWin: false })}
                  />
                  <span className="ml-2 text-sm text-gray-600">Loss</span>
                </label>
              </div>
              <button
                type="button"
                onClick={addTrade}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Trade
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-lg font-medium text-gray-900">
            <Target className="h-5 w-5 mr-2 text-indigo-600" />
            <h3>Levels of Interest</h3>
          </div>
          <textarea
            id="levels"
            rows={3}
            placeholder="Note down the price levels you're watching..."
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base placeholder:text-gray-400"
            value={currentJournal.levelsInterested}
            onChange={(e) => setCurrentJournal({ ...currentJournal, levelsInterested: e.target.value })}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-lg font-medium text-gray-900">
            <ClipboardCheck className="h-5 w-5 mr-2 text-indigo-600" />
            <h3>Trading Outcome Review</h3>
          </div>
          <textarea
            id="review"
            rows={4}
            placeholder="Reflect on your trading performance and lessons learned..."
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base placeholder:text-gray-400"
            value={currentJournal.tradingOutcomeReview}
            onChange={(e) => setCurrentJournal({ ...currentJournal, tradingOutcomeReview: e.target.value })}
          />
        </div>
      </div>

      <div className="bg-gray-50 px-8 py-4">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Journal
          </button>
        </div>
      </div>
    </form>
  );
}

export default JournalTab;