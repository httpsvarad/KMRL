import React, { useState, useEffect } from 'react';
import { useFleetData } from './hooks/useFleetData';
import { Dashboard } from './components/Dashboard';
import { DepotVisualization } from './components/DepotVisualization';
import { OptimizationResults } from './components/OptimizationResults';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { LearningPanel } from './components/LearningPanel';
import { OptimizationResult, PerformanceMetrics } from './types/fleet';
import { Train, Settings, Activity, Brain } from 'lucide-react';

function App() {
  const { trains, depot, historical, loading, updateTrainBay, setTrains } = useFleetData();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [performanceMetrics] = useState<PerformanceMetrics>({
    punctuality: 94.2,
    mileageBalance: 87.5,
    brandingCompliance: 91.3,
    shuntingMoves: 12
  });

  const handleApplyOptimization = (results: OptimizationResult[]) => {
    const updatedTrains = trains.map(train => {
      const result = results.find(r => r.train.id === train.id);
      if (result && result.recommendedStatus !== train.status) {
        return { ...train, status: result.recommendedStatus };
      }
      return train;
    });
    setTrains(updatedTrains);
  };

  const handleSimulation = (params: any) => {
    console.log('Running simulation with params:', params);
    // In a real application, this would trigger a new optimization with the given parameters
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'depot', label: 'Depot Layout', icon: Train },
    { id: 'optimization', label: 'Optimization', icon: Settings },
    { id: 'learning', label: 'AI Learning', icon: Brain }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading fleet management system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center">
                  {/* <Train className="w-5 h-5 text-white" /> */}
                  <img src="./assests/logo.png" alt="logo" className='h-8 mt-2 w-auto' />
                </div>
                {/* <div>
                  
                  <p className="text-sm text-gray-500">Nightly Induction Planning System</p>
                </div> */}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <div className='hidden sm:block'>
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <Dashboard trains={trains} performanceMetrics={performanceMetrics} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <WhatIfSimulator onSimulate={handleSimulation} />
              <LearningPanel historicalData={historical} />
            </div>
          </div>
        )}

        {activeTab === 'depot' && depot && (
          <DepotVisualization 
            bays={depot.bays} 
            trains={trains} 
            onTrainMove={updateTrainBay}
          />
        )}

        {activeTab === 'optimization' && (
          <OptimizationResults 
            trains={trains}
            onApplyOptimization={handleApplyOptimization}
          />
        )}

        {activeTab === 'learning' && (
          <LearningPanel historicalData={historical} />
        )}
      </main>
    </div>
  );
}

export default App;