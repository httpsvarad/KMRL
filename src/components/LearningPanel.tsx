import React from 'react';
import { TrendingUp, Brain, Target, Clock } from 'lucide-react';

interface LearningPanelProps {
  historicalData: any[];
}

export const LearningPanel: React.FC<LearningPanelProps> = ({ historicalData }) => {
  // Calculate trends from historical data
  const latestPerformance = historicalData[historicalData.length - 1]?.performance;
  const previousPerformance = historicalData[historicalData.length - 2]?.performance;
  
  const trends = latestPerformance && previousPerformance ? {
    punctuality: latestPerformance.punctuality - previousPerformance.punctuality,
    mileageBalance: latestPerformance.mileageBalance - previousPerformance.mileageBalance,
    brandingCompliance: latestPerformance.brandingCompliance - previousPerformance.brandingCompliance,
    shuntingEfficiency: previousPerformance.shuntingMoves - latestPerformance.shuntingMoves
  } : null;

  const learningInsights = [
    {
      title: "Mileage Forecast Accuracy",
      value: "87.3%",
      change: "+7.2%",
      period: "Last 10 nights",
      icon: Target,
      color: "text-green-600"
    },
    {
      title: "Predictive Maintenance",
      value: "94.1%",
      change: "+3.8%",
      period: "Success rate",
      icon: Brain,
      color: "text-blue-600"
    },
    {
      title: "Optimization Speed",
      value: "1.2s",
      change: "-0.3s",
      period: "Processing time",
      icon: Clock,
      color: "text-purple-600"
    },
    {
      title: "Decision Confidence",
      value: "91.7%",
      change: "+5.1%",
      period: "Algorithm confidence",
      icon: TrendingUp,
      color: "text-indigo-600"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">System Learning</h2>
        <div className="text-sm text-gray-500">
          AI continuously improving decisions
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {learningInsights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${insight.color}`} />
                <span className={`text-sm font-medium ${insight.color}`}>
                  {insight.change}
                </span>
              </div>
              <div className="text-lg font-bold text-gray-900 mb-1">
                {insight.value}
              </div>
              <div className="text-sm text-gray-600">{insight.title}</div>
              <div className="text-xs text-gray-500 mt-1">{insight.period}</div>
            </div>
          );
        })}
      </div>

      {/* Performance Trends */}
      {trends && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Recent Performance Trends</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-900">Punctuality</span>
                <span className={`text-sm font-bold ${trends.punctuality >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trends.punctuality >= 0 ? '+' : ''}{trends.punctuality.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-900">Mileage Balance</span>
                <span className={`text-sm font-bold ${trends.mileageBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trends.mileageBalance >= 0 ? '+' : ''}{trends.mileageBalance.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-purple-900">Branding SLA</span>
                <span className={`text-sm font-bold ${trends.brandingCompliance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trends.brandingCompliance >= 0 ? '+' : ''}{trends.brandingCompliance.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium text-yellow-900">Shunting Efficiency</span>
                <span className={`text-sm font-bold ${trends.shuntingEfficiency >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trends.shuntingEfficiency >= 0 ? '+' : ''}{trends.shuntingEfficiency} moves
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Learning Recommendations */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center space-x-2">
          <Brain className="w-4 h-4" />
          <span>AI Recommendations</span>
        </h4>
        <div className="space-y-2 text-sm text-blue-800">
          <div>• Increase branding weight during low-demand periods to improve SLA compliance</div>
          <div>• Consider extending maintenance buffer for trains approaching fitness expiry</div>
          <div>• Pattern detected: trains from bay A-03 show 12% better punctuality when moved to service</div>
        </div>
      </div>
    </div>
  );
};