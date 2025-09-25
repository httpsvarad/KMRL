import React from 'react';
import { Train, PerformanceMetrics } from '../types/fleet';
import { AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface DashboardProps {
  trains: Train[];
  performanceMetrics: PerformanceMetrics;
}

export const Dashboard: React.FC<DashboardProps> = ({ trains, performanceMetrics }) => {
  const totalTrains = trains.length;
  const serviceReady = trains.filter(t => 
    !t.jobCards.some(jc => jc.status === 'open' && (jc.priority === 'critical' || jc.priority === 'high'))
  ).length;
  
  const criticalIssues = trains.filter(t =>
    t.jobCards.some(jc => jc.status === 'open' && jc.priority === 'critical') ||
    new Date(t.fitnessExpiry.rollingStock) < new Date() ||
    new Date(t.fitnessExpiry.signalTelecom) < new Date()
  ).length;

  const brandingCompliance = trains.filter(t => 
    (t.branding.currentHours / t.branding.targetHours) >= 0.9
  ).length;

  const kpis = [
    {
      title: 'Fleet Readiness',
      value: `${Math.round((serviceReady / totalTrains) * 100)}%`,
      subtitle: `${serviceReady}/${totalTrains} trains`,
      icon: CheckCircle,
      color: serviceReady === totalTrains ? 'text-green-600' : 'text-yellow-600',
      bgColor: serviceReady === totalTrains ? 'bg-green-50' : 'bg-yellow-50'
    },
    {
      title: 'Critical Issues',
      value: criticalIssues.toString(),
      subtitle: 'Require immediate attention',
      icon: AlertTriangle,
      color: criticalIssues === 0 ? 'text-green-600' : 'text-red-600',
      bgColor: criticalIssues === 0 ? 'bg-green-50' : 'bg-red-50'
    },
    {
      title: 'Punctuality Score',
      value: `${performanceMetrics.punctuality.toFixed(1)}%`,
      subtitle: 'Last 30 days average',
      icon: Clock,
      color: performanceMetrics.punctuality >= 95 ? 'text-green-600' : 'text-yellow-600',
      bgColor: performanceMetrics.punctuality >= 95 ? 'bg-green-50' : 'bg-yellow-50'
    },
    {
      title: 'Branding Compliance',
      value: `${Math.round((brandingCompliance / totalTrains) * 100)}%`,
      subtitle: `${brandingCompliance}/${totalTrains} on target`,
      icon: TrendingUp,
      color: brandingCompliance >= totalTrains * 0.9 ? 'text-green-600' : 'text-yellow-600',
      bgColor: brandingCompliance >= totalTrains * 0.9 ? 'bg-green-50' : 'bg-yellow-50'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Fleet Operations Dashboard</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className={`${kpi.bgColor} rounded-lg p-4 border border-gray-100`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                  <p className={`text-2xl font-bold ${kpi.color} mb-1`}>{kpi.value}</p>
                  <p className="text-xs text-gray-500">{kpi.subtitle}</p>
                </div>
                <Icon className={`w-8 h-8 ${kpi.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Alerts */}
      <div className="mt-6 space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Alerts</h3>
        {trains
          .filter(train => {
            const rsExpiry = new Date(train.fitnessExpiry.rollingStock);
            const stExpiry = new Date(train.fitnessExpiry.signalTelecom);
            const daysToRS = Math.ceil((rsExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            const daysToST = Math.ceil((stExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            return daysToRS <= 7 || daysToST <= 7 || train.jobCards.some(jc => jc.status === 'open' && jc.priority === 'critical');
          })
          .slice(0, 3)
          .map((train, index) => {
            const rsExpiry = new Date(train.fitnessExpiry.rollingStock);
            const stExpiry = new Date(train.fitnessExpiry.signalTelecom);
            const daysToRS = Math.ceil((rsExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            const daysToST = Math.ceil((stExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            
            let alertMessage = '';
            let alertColor = 'bg-yellow-50 border-yellow-200 text-yellow-800';
            
            if (train.jobCards.some(jc => jc.status === 'open' && jc.priority === 'critical')) {
              alertMessage = `Critical maintenance required`;
              alertColor = 'bg-red-50 border-red-200 text-red-800';
            } else if (daysToRS <= 7) {
              alertMessage = `Rolling stock fitness expires in ${daysToRS} days`;
            } else if (daysToST <= 7) {
              alertMessage = `S&T fitness expires in ${daysToST} days`;
            }

            return (
              <div key={index} className={`${alertColor} border rounded-lg p-3 text-sm`}>
                <span className="font-medium">{train.id}:</span> {alertMessage}
              </div>
            );
          })}
        {trains.filter(train => {
          const rsExpiry = new Date(train.fitnessExpiry.rollingStock);
          const stExpiry = new Date(train.fitnessExpiry.signalTelecom);
          const daysToRS = Math.ceil((rsExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          const daysToST = Math.ceil((stExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          return daysToRS <= 7 || daysToST <= 7 || train.jobCards.some(jc => jc.status === 'open' && jc.priority === 'critical');
        }).length === 0 && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 text-sm">
            No critical alerts at this time. All systems operating normally.
          </div>
        )}
      </div>
    </div>
  );
};