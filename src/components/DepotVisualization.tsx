import React, { useState } from 'react';
import { Bay, Train } from '../types/fleet';
import { Move, AlertCircle } from 'lucide-react';

interface DepotVisualizationProps {
  bays: Bay[];
  trains: Train[];
  onTrainMove: (trainId: string, newBayId: string) => void;
}

export const DepotVisualization: React.FC<DepotVisualizationProps> = ({
  bays,
  trains,
  onTrainMove
}) => {
  const [draggedTrain, setDraggedTrain] = useState<string | null>(null);
  const [hoveredBay, setHoveredBay] = useState<string | null>(null);

  const getBayColor = (bay: Bay) => {
    switch (bay.type) {
      case 'service':
        return 'bg-blue-100 border-blue-300';
      case 'standby':
        return 'bg-green-100 border-green-300';
      case 'IBL':
        return 'bg-yellow-100 border-yellow-300';
      case 'maintenance':
        return 'bg-red-100 border-red-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getTrainInfo = (trainId: string) => {
    return trains.find(t => t.id === trainId);
  };

  const handleDragStart = (e: React.DragEvent, trainId: string) => {
    setDraggedTrain(trainId);
    e.dataTransfer.setData('text/plain', trainId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, bayId: string) => {
    e.preventDefault();
    const trainId = e.dataTransfer.getData('text/plain');
    if (trainId && draggedTrain) {
      const bay = bays.find(b => b.id === bayId);
      if (bay && !bay.occupied) {
        onTrainMove(trainId, bayId);
      }
    }
    setDraggedTrain(null);
  };

  const maxX = Math.max(...bays.map(b => b.x));
  const maxY = Math.max(...bays.map(b => b.y));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Depot Layout</h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Service</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Standby</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span>IBL</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span>Maintenance</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div 
          className="grid gap-3 p-4 bg-gray-50 rounded-lg"
          style={{ 
            gridTemplateColumns: `repeat(${maxX + 1}, 1fr)`,
            gridTemplateRows: `repeat(${maxY + 1}, 1fr)`
          }}
        >
          {bays.map((bay) => {
            const train = bay.occupied ? getTrainInfo(bay.occupied) : null;
            const hasIssues = train?.jobCards.some(jc => jc.status === 'open' && (jc.priority === 'critical' || jc.priority === 'high'));
            
            return (
              <div
                key={bay.id}
                className={`
                  relative min-h-[100px] border-2 rounded-lg transition-all duration-200
                  ${getBayColor(bay)}
                  ${hoveredBay === bay.id && draggedTrain ? 'ring-2 ring-blue-400' : ''}
                  ${bay.occupied ? 'cursor-move' : 'cursor-default'}
                `}
                style={{ 
                  gridColumn: bay.x + 1,
                  gridRow: bay.y + 1
                }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, bay.id)}
                onDragEnter={() => setHoveredBay(bay.id)}
                onDragLeave={() => setHoveredBay(null)}
              >
                {/* Bay Label */}
                <div className="absolute top-1 left-1 text-xs font-medium text-gray-600">
                  {bay.id}
                </div>
                
                {/* Cleaning Capacity Indicator */}
                {bay.cleaningCapacity && (
                  <div className="absolute top-1 right-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" title="Cleaning capacity available"></div>
                  </div>
                )}

                {/* Train Information */}
                {train && (
                  <div
                    className="absolute inset-2 bg-white rounded border border-gray-200 p-2 shadow-sm"
                    draggable
                    onDragStart={(e) => handleDragStart(e, train.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-gray-900">{train.id}</div>
                      {hasIssues && <AlertCircle className="w-4 h-4 text-red-500" />}
                      <Move className="w-3 h-3 text-gray-400" />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {train.type}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round(train.currentMileage / 1000)}k km
                    </div>
                    {train.branding.advertiser && (
                      <div className="text-xs text-blue-600 mt-1 truncate">
                        {train.branding.advertiser}
                      </div>
                    )}
                  </div>
                )}

                {/* Empty Bay Placeholder */}
                {!train && (
                  <div className="absolute inset-2 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-400">Empty</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Drag Instructions */}
        {draggedTrain && (
          <div className="absolute top-0 right-0 bg-blue-100 border border-blue-300 rounded-lg p-3 text-sm">
            <div className="font-medium text-blue-800">Moving {draggedTrain}</div>
            <div className="text-blue-600">Drop on an empty bay to move</div>
          </div>
        )}
      </div>
    </div>
  );
};