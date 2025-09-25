export interface Train {
  id: string;
  type: string;
  currentMileage: number;
  fitnessExpiry: {
    rollingStock: string;
    signalTelecom: string;
  };
  jobCards: JobCard[];
  branding: {
    advertiser: string;
    targetHours: number;
    currentHours: number;
    priority: 'low' | 'medium' | 'high';
  };
  systemHealth: {
    bogie: SystemComponent;
    hvac: SystemComponent;
    brakes: SystemComponent;
  };
  lastCleaned: string;
  currentBay: string;
  status: 'service' | 'standby' | 'IBL';
}

export interface JobCard {
  id: string;
  type: string;
  status: 'open' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface SystemComponent {
  mileage: number;
  nextService: number;
}

export interface Bay {
  id: string;
  x: number;
  y: number;
  type: 'service' | 'standby' | 'IBL' | 'maintenance';
  capacity: number;
  cleaningCapacity: boolean;
  occupied: string | null;
}

export interface DepotLayout {
  layout: {
    rows: number;
    columns: number;
    bayPrefix: string[];
  };
  bays: Bay[];
  cleaningSlots: {
    available: number;
    total: number;
    manpower: {
      shift1: number;
      shift2: number;
    };
  };
}

export interface OptimizationResult {
  train: Train;
  recommendedStatus: 'service' | 'standby' | 'IBL';
  score: number;
  reasons: string[];
  conflicts: string[];
}

export interface PerformanceMetrics {
  punctuality: number;
  mileageBalance: number;
  brandingCompliance: number;
  shuntingMoves: number;
}