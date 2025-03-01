import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import JournalTab from './components/JournalTab';
import TradingStats from './components/TradingStats';
import { JournalEntry } from './types';

function App() {
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const addNewJournal = () => {
    const today = new Date().toISOString().split('T')[0];
    const newJournal: JournalEntry = {
      date: today,
      plan: '',
      trades: [],
      levelsInterested: '',
      tradingOutcomeReview: ''
    };
    setJournals([...journals, newJournal]);
    setActiveTab(today);
  };

  const saveJournal = (updatedJournal: JournalEntry) => {
    setJournals(journals.map(journal => 
      journal.date === updatedJournal.date ? updatedJournal : journal
    ));
    setActiveTab(null); // Return to calendar view after saving
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + increment));
    setCurrentDate(newDate);
  };

  const getTodaysTrades = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysJournal = journals.find(journal => journal.date === today);
    return todaysJournal?.trades || [];
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50 border border-gray-200"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
      const hasJournal = journals.some(journal => journal.date === date);
      
      days.push(
        <div
          key={day}
          onClick={() => hasJournal && setActiveTab(date)}
          className={`h-24 p-2 border border-gray-200 ${
            hasJournal ? 'bg-white cursor-pointer hover:bg-gray-50' : 'bg-gray-50'
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-900">{day}</span>
            {hasJournal && (
              <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
            )}
          </div>
          {hasJournal && (
            <div className="mt-2">
              <span className="text-xs text-gray-500">
                {journals.find(j => j.date === date)?.trades.length || 0} trades
              </span>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-indigo-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Trading Journal</h1>
            </div>
            <button
              onClick={addNewJournal}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Entry
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab ? (
          <div className="bg-white shadow rounded-lg">
            <JournalTab
              journal={journals.find(j => j.date === activeTab)!}
              onSave={saveJournal}
              onBack={() => setActiveTab(null)}
            />
          </div>
        ) : (
          <>
            <TradingStats trades={getTodaysTrades()} />
            <div className="bg-white shadow rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => changeMonth(-1)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => changeMonth(1)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-px mt-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-sm font-medium text-gray-900 text-center py-2">
                      {day}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-7 gap-px bg-gray-200 p-px">
                {renderCalendar()}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;