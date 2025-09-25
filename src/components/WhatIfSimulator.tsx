import React, { useState } from 'react';
import { Sliders, Play, RotateCcw } from 'lucide-react';

interface SimulationParameters {
  cleaningSlots: number;
  brandingWeight: number;
  mileageWeight: number;
  maintenanceBuffer: number;
  fitnessBuffer: number;
}

interface WhatIfSimulatorProps {
  onSimulate: (params: SimulationParameters) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ onSimulate }) => {
  const [params, setParams] = useState<SimulationParameters>({
    cleaningSlots: 3,
    brandingWeight: 10,
    mileageWeight: 20,
    maintenanceBuffer: 7,
    fitnessBuffer: 7
  });

  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      onSimulate(params);
      setIsSimulating(false);
    }, 1000);
  };

  const resetToDefaults = () => {
    setParams({
      cleaningSlots: 3,
      brandingWeight: 10,
      mileageWeight: 20,
      maintenanceBuffer: 7,
      fitnessBuffer: 7
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">What-If Simulator</h2>
        <div className="flex space-x-2">
          {/* <button
            onClick={resetToDefaults}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button> */}
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>{isSimulating ? 'Simulating...' : 'Run Simulation'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resource Constraints */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
            <Sliders className="w-4 h-4" />
            <span>Resource Constraints</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Cleaning Slots: {params.cleaningSlots}
              </label>
              <input
                type="range"
                min="1"
                max="6"
                value={params.cleaningSlots}
                onChange={(e) => setParams(prev => ({ ...prev, cleaningSlots: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>6 (Max)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maintenance Buffer Days: {params.maintenanceBuffer}
              </label>
              <input
                type="range"
                min="1"
                max="14"
                value={params.maintenanceBuffer}
                onChange={(e) => setParams(prev => ({ ...prev, maintenanceBuffer: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 day</span>
                <span>14 days</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fitness Certificate Buffer Days: {params.fitnessBuffer}
              </label>
              <input
                type="range"
                min="1"
                max="21"
                value={params.fitnessBuffer}
                onChange={(e) => setParams(prev => ({ ...prev, fitnessBuffer: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 day</span>
                <span>21 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Optimization Weights */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Optimization Weights</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branding Priority Weight: {params.brandingWeight}
              </label>
              <input
                type="range"
                min="0"
                max="30"
                value={params.brandingWeight}
                onChange={(e) => setParams(prev => ({ ...prev, brandingWeight: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0 (Ignore)</span>
                <span>30 (High Priority)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mileage Balance Weight: {params.mileageWeight}
              </label>
              <input
                type="range"
                min="5"
                max="40"
                value={params.mileageWeight}
                onChange={(e) => setParams(prev => ({ ...prev, mileageWeight: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 (Low)</span>
                <span>40 (Critical)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Results Preview */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">Current Configuration Impact</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Cleaning Capacity:</span>
            <span className={`ml-2 font-medium ${params.cleaningSlots >= 4 ? 'text-green-600' : 'text-yellow-600'}`}>
              {params.cleaningSlots >= 4 ? 'High' : 'Limited'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Branding Focus:</span>
            <span className={`ml-2 font-medium ${params.brandingWeight >= 20 ? 'text-blue-600' : 'text-gray-600'}`}>
              {params.brandingWeight >= 20 ? 'High' : 'Standard'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Maintenance Buffer:</span>
            <span className={`ml-2 font-medium ${params.maintenanceBuffer >= 10 ? 'text-green-600' : 'text-yellow-600'}`}>
              {params.maintenanceBuffer >= 10 ? 'Conservative' : 'Aggressive'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Risk Level:</span>
            <span className={`ml-2 font-medium ${params.fitnessBuffer <= 5 ? 'text-red-600' : 'text-green-600'}`}>
              {params.fitnessBuffer <= 5 ? 'High' : 'Low'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};