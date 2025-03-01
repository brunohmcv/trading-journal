import React, { useState } from 'react';
import { TrendingUp, Percent, Target, DollarSign, BarChart, ChevronDown, ChevronUp } from 'lucide-react';
import { Trade } from '../types';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
} from 'chart.js';
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
);

interface TradingStatsProps {
  trades: Trade[];
}

function TradingStats({ trades }: TradingStatsProps) {
  const [showCharts, setShowCharts] = useState(false);

  const winningTrades = trades.filter(trade => trade.isWin).length;
  const losingTrades = trades.filter(trade => trade.isLoss).length;
  const totalTrades = trades.length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  
  const totalPnL = trades.reduce((sum, trade) => {
    const pnl = parseFloat(trade.pnl) || 0;
    return sum + pnl;
  }, 0);

  const averageRisk = trades.reduce((sum, trade) => {
    const risk = parseFloat(trade.riskPercentage) || 0;
    return sum + risk;
  }, 0) / (totalTrades || 1);

  const profitFactor = (() => {
    const wins = trades
      .filter(t => parseFloat(t.pnl) > 0)
      .reduce((sum, t) => sum + (parseFloat(t.pnl) || 0), 0);
    const losses = Math.abs(trades
      .filter(t => parseFloat(t.pnl) < 0)
      .reduce((sum, t) => sum + (parseFloat(t.pnl) || 0), 0));
    return losses === 0 ? Infinity : (wins / losses);
  })();

  // Prepare data for charts
  const winLossData = {
    labels: ['Wins', 'Losses'],
    datasets: [
      {
        label: 'Trade Outcomes',
        data: [winningTrades, losingTrades],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // PnL by trade
  const pnlData = {
    labels: trades.map((_, index) => `Trade ${index + 1}`),
    datasets: [
      {
        label: 'P&L %',
        data: trades.map(trade => parseFloat(trade.pnl) || 0),
        backgroundColor: trades.map(trade => 
          parseFloat(trade.pnl) >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'
        ),
        borderColor: trades.map(trade => 
          parseFloat(trade.pnl) >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
        ),
        borderWidth: 1,
      },
    ],
  };

  // Risk by trade
  const riskData = {
    labels: trades.map((_, index) => `Trade ${index + 1}`),
    datasets: [
      {
        label: 'Risk %',
        data: trades.map(trade => parseFloat(trade.riskPercentage) || 0),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Cumulative P&L
  const cumulativePnL = trades.reduce((acc, trade, index) => {
    const pnl = parseFloat(trade.pnl) || 0;
    const prevValue = index > 0 ? acc[index - 1] : 0;
    acc.push(prevValue + pnl);
    return acc;
  }, [] as number[]);

  const cumulativePnLData = {
    labels: trades.map((_, index) => `Trade ${index + 1}`),
    datasets: [
      {
        label: 'Cumulative P&L %',
        data: cumulativePnL,
        fill: false,
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.1,
        pointBackgroundColor: cumulativePnL.map(value => 
          value >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
        ),
      },
    ],
  };

  // Trading performance radar
  const performanceData = {
    labels: ['Win Rate', 'Profit Factor', 'Avg Risk', 'Total P&L'],
    datasets: [
      {
        label: 'Performance Metrics',
        data: [
          winRate / 100, // Normalize to 0-1 scale
          Math.min(profitFactor / 3, 1), // Cap at 1 for visualization
          1 - Math.min(averageRisk / 5, 1), // Invert so lower risk is better
          Math.min(Math.max((totalPnL + 10) / 20, 0), 1), // Normalize to 0-1 scale
        ],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Today's Trading Statistics</h2>
        <button 
          onClick={() => setShowCharts(!showCharts)}
          className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <BarChart className="h-4 w-4 mr-1" />
          {showCharts ? 'Hide Charts' : 'Show Charts'}
          {showCharts ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600">Win Rate</p>
              <p className="text-2xl font-bold text-indigo-900">{winRate.toFixed(1)}%</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-indigo-600">
            {winningTrades} wins / {losingTrades} losses
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total P&L</p>
              <p className="text-2xl font-bold text-green-900">
                {totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(2)}%
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-green-600">
            {totalTrades} total trades
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Average Risk</p>
              <p className="text-2xl font-bold text-blue-900">{averageRisk.toFixed(2)}%</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Percent className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-blue-600">
            Per trade risk
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Profit Factor</p>
              <p className="text-2xl font-bold text-purple-900">
                {profitFactor === Infinity ? '∞' : profitFactor.toFixed(2)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-purple-600">
            Wins / Losses ratio
          </p>
        </div>
      </div>

      {showCharts && trades.length > 0 && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-md font-medium text-gray-700 mb-4">Win/Loss Distribution</h3>
              <div className="h-64">
                <Doughnut 
                  data={winLossData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-md font-medium text-gray-700 mb-4">P&L by Trade</h3>
              <div className="h-64">
                <Bar 
                  data={pnlData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: false,
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-md font-medium text-gray-700 mb-4">Risk by Trade</h3>
              <div className="h-64">
                <Bar 
                  data={riskData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-md font-medium text-gray-700 mb-4">Cumulative P&L</h3>
              <div className="h-64">
                <Line 
                  data={cumulativePnLData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: false,
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 max-w-md mx-auto">
            <h3 className="text-md font-medium text-gray-700 mb-4 text-center">Performance Overview</h3>
            <div className="h-64">
              <Radar 
                data={performanceData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 1,
                      ticks: {
                        display: false,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}

      {showCharts && trades.length === 0 && (
        <div className="mt-6 p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No trades recorded today. Add trades to see charts.</p>
        </div>
      )}
    </div>
  );
}

export default TradingStats;