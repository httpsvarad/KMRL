import React, { useState } from 'react';
import { OptimizationResult } from '../types/fleet';
import { FleetOptimizer } from '../utils/optimization';
import { CheckCircle, AlertTriangle, Info, Settings, RefreshCw } from 'lucide-react';

interface OptimizationResultsProps {
  trains: any[];
  onApplyOptimization: (results: OptimizationResult[]) => void;
}

export const OptimizationResults: React.FC<OptimizationResultsProps> = ({
  trains,
  onApplyOptimization
}) => {
  const [results, setResults] = useState<OptimizationResult[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const runOptimization = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      const optimizer = new FleetOptimizer(trains);
      const optimizationResults = optimizer.optimizeInduction();
      setResults(optimizationResults);
      setIsOptimizing(false);
    }, 1500); // Simulate processing time
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'service':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'standby':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'IBL':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Optimization Engine</h2>
        <button
          onClick={runOptimization}
          disabled={isOptimizing}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isOptimizing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Settings className="w-4 h-4" />
          )}
          <span>{isOptimizing ? 'Optimizing...' : 'Run Optimization'}</span>
        </button>
      </div>

      {isOptimizing && (
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Analyzing fleet constraints and optimizing induction plan...</p>
          <div className="mt-4 space-y-2 text-sm text-gray-500">
            <div>✓ Evaluating fitness certificates</div>
            <div>✓ Checking job card status</div>
            <div>✓ Analyzing system health</div>
            <div>⏳ Balancing mileage distribution</div>
            <div>⏳ Optimizing branding exposure</div>
          </div>
        </div>
      )}

      {results.length > 0 && !isOptimizing && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              Optimization complete - {results.length} trains evaluated
            </div>
            {/* <button
              onClick={() => onApplyOptimization(results)}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Apply Recommendations
            </button> */}
          </div>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={result.train.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-gray-900">{result.train.id}</span>
                    <span className={`px-2 py-1 text-xs font-medium border rounded-full ${getStatusColor(result.recommendedStatus)}`}>
                      {result.recommendedStatus.toUpperCase()}
                    </span>
                    <span className={`text-lg font-bold ${getScoreColor(result.score)}`}>
                      {result.score}/100
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    #{index + 1} Priority
                  </div>
                </div>

                {/* Conflicts */}
                {result.conflicts.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-red-700">Issues Found</span>
                    </div>
                    <div className="space-y-1">
                      {result.conflicts.map((conflict, idx) => (
                        <div key={idx} className="text-sm text-red-600 bg-red-50 rounded px-2 py-1">
                          • {conflict}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reasons */}
                <div className="mb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-700">Decision Factors</span>
                  </div>
                  <div className="space-y-1">
                    {result.reasons.map((reason, idx) => (
                      <div key={idx} className="text-sm text-gray-600 bg-gray-50 rounded px-2 py-1">
                        • {reason}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current vs Recommended Status */}
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Current:</span>
                    <span className={`px-2 py-1 text-xs border rounded ${getStatusColor(result.train.status)}`}>
                      {result.train.status.toUpperCase()}
                    </span>
                  </div>
                  {result.train.status !== result.recommendedStatus && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">→ Recommended:</span>
                      <span className={`px-2 py-1 text-xs border rounded ${getStatusColor(result.recommendedStatus)}`}>
                        {result.recommendedStatus.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {results.length === 0 && !isOptimizing && (
        <div className="text-center py-8 text-gray-500">
          <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Click "Run Optimization" to analyze current fleet status and generate recommendations</p>
        </div>
      )}
    </div>
  );
};