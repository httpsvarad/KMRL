import { useState, useEffect } from 'react';
import { Train, DepotLayout } from '../types/fleet';
import trainsData from '../data/trains.json';
import depotData from '../data/depot.json';
import historicalData from '../data/historical.json';

export const useFleetData = () => {
  const [trains, setTrains] = useState<Train[]>([]);
  const [depot, setDepot] = useState<DepotLayout | null>(null);
  const [historical, setHistorical] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async data loading
    const loadData = async () => {
      try {
        setTrains(trainsData as Train[]);
        setDepot(depotData as DepotLayout);
        setHistorical(historicalData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load fleet data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const updateTrainBay = (trainId: string, newBayId: string) => {
    setTrains(prev => prev.map(train => 
      train.id === trainId 
        ? { ...train, currentBay: newBayId }
        : train
    ));

    if (depot) {
      setDepot(prev => ({
        ...prev!,
        bays: prev!.bays.map(bay => {
          if (bay.occupied === trainId) {
            return { ...bay, occupied: null };
          }
          if (bay.id === newBayId) {
            return { ...bay, occupied: trainId };
          }
          return bay;
        })
      }));
    }
  };

  return {
    trains,
    depot,
    historical,
    loading,
    updateTrainBay,
    setTrains
  };
};