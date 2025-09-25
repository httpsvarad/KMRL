import { Train, OptimizationResult } from '../types/fleet';

export class FleetOptimizer {
  private trains: Train[];

  constructor(trains: Train[]) {
    this.trains = trains;
  }

  optimizeInduction(): OptimizationResult[] {
    return this.trains.map(train => this.evaluateTrain(train))
      .sort((a, b) => b.score - a.score);
  }

  private evaluateTrain(train: Train): OptimizationResult {
    const reasons: string[] = [];
    const conflicts: string[] = [];
    let score = 0;

    // 1. Fitness Certificate Check (Critical - 40 points)
    const fitnessScore = this.evaluateFitness(train, reasons, conflicts);
    score += fitnessScore;

    // 2. Job Cards Status (High Priority - 25 points)
    const jobCardScore = this.evaluateJobCards(train, reasons, conflicts);
    score += jobCardScore;

    // 3. System Health & Mileage (Medium Priority - 20 points)
    const healthScore = this.evaluateSystemHealth(train, reasons, conflicts);
    score += healthScore;

    // 4. Branding Priority (Medium Priority - 10 points)
    const brandingScore = this.evaluateBranding(train, reasons, conflicts);
    score += brandingScore;

    // 5. Cleaning Status (Low Priority - 5 points)
    const cleaningScore = this.evaluateCleaning(train, reasons, conflicts);
    score += cleaningScore;

    const recommendedStatus = this.determineRecommendedStatus(train, score, conflicts);

    return {
      train,
      recommendedStatus,
      score,
      reasons,
      conflicts
    };
  }

  private evaluateFitness(train: Train, reasons: string[], conflicts: string[]): number {
    const now = new Date();
    const rollingStockExpiry = new Date(train.fitnessExpiry.rollingStock);
    const signalTelecomExpiry = new Date(train.fitnessExpiry.signalTelecom);

    const rollingStockDays = Math.ceil((rollingStockExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const signalTelecomDays = Math.ceil((signalTelecomExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (rollingStockDays < 0 || signalTelecomDays < 0) {
      conflicts.push('Fitness certificate expired');
      return 0;
    }

    if (rollingStockDays <= 7 || signalTelecomDays <= 7) {
      conflicts.push(`Fitness certificate expiring within 7 days`);
      reasons.push(`Fitness expiry: RS(${rollingStockDays}d), S&T(${signalTelecomDays}d)`);
      return 10;
    }

    reasons.push('Valid fitness certificates');
    return 40;
  }

  private evaluateJobCards(train: Train, reasons: string[], conflicts: string[]): number {
    const openCritical = train.jobCards.filter(jc => jc.status === 'open' && jc.priority === 'critical').length;
    const openHigh = train.jobCards.filter(jc => jc.status === 'open' && jc.priority === 'high').length;
    const openMedium = train.jobCards.filter(jc => jc.status === 'open' && jc.priority === 'medium').length;

    if (openCritical > 0) {
      conflicts.push(`${openCritical} critical job cards open`);
      return 0;
    }

    if (openHigh > 0) {
      conflicts.push(`${openHigh} high priority job cards open`);
      reasons.push('High priority maintenance pending');
      return 10;
    }

    if (openMedium > 0) {
      reasons.push(`${openMedium} medium priority job cards open`);
      return 20;
    }

    reasons.push('All job cards closed');
    return 25;
  }

  private evaluateSystemHealth(train: Train, reasons: string[], conflicts: string[]): number {
    const { bogie, hvac, brakes } = train.systemHealth;
    let score = 20;
    const issues: string[] = [];

    // Check if any system is overdue for service
    if (bogie.mileage >= bogie.nextService) {
      conflicts.push('Bogie service overdue');
      score -= 10;
    } else if (bogie.mileage / bogie.nextService > 0.9) {
      issues.push('bogie service due soon');
      score -= 2;
    }

    if (hvac.mileage >= hvac.nextService) {
      conflicts.push('HVAC service overdue');
      score -= 10;
    } else if (hvac.mileage / hvac.nextService > 0.9) {
      issues.push('HVAC service due soon');
      score -= 2;
    }

    if (brakes.mileage >= brakes.nextService) {
      conflicts.push('Brake service overdue');
      score -= 15; // Brakes are more critical
    } else if (brakes.mileage / brakes.nextService > 0.9) {
      issues.push('brake service due soon');
      score -= 3;
    }

    if (issues.length === 0 && score === 20) {
      reasons.push('All systems healthy');
    } else if (issues.length > 0) {
      reasons.push(`Moderate wear: ${issues.join(', ')}`);
    }

    return Math.max(0, score);
  }

  private evaluateBranding(train: Train, reasons: string[], conflicts: string[]): number {
    const { targetHours, currentHours, priority } = train.branding;
    const completion = currentHours / targetHours;

    let score = 10;

    if (completion >= 1.0) {
      reasons.push('Branding target achieved');
      return score;
    }

    const shortfall = targetHours - currentHours;

    if (priority === 'high' && completion < 0.8) {
      reasons.push(`High priority branding: ${shortfall}h remaining`);
      score += 5; // Bonus for high priority branding
    } else if (priority === 'medium' && completion < 0.9) {
      reasons.push(`Medium priority branding: ${shortfall}h remaining`);
      score += 2;
    } else {
      reasons.push(`Branding target: ${Math.round(completion * 100)}% complete`);
    }

    return score;
  }

  private evaluateCleaning(train: Train, reasons: string[], conflicts: string[]): number {
    const lastCleaned = new Date(train.lastCleaned);
    const hoursAgo = (Date.now() - lastCleaned.getTime()) / (1000 * 60 * 60);

    if (hoursAgo > 24) {
      reasons.push(`Cleaned ${Math.round(hoursAgo)}h ago - due for cleaning`);
      return 5; // Higher score for trains needing cleaning
    } else {
      reasons.push('Recently cleaned');
      return 2;
    }
  }

  private determineRecommendedStatus(train: Train, score: number, conflicts: string[]): 'service' | 'standby' | 'IBL' {
    // Trains with critical conflicts go to IBL
    if (conflicts.some(c => c.includes('expired') || c.includes('critical') || c.includes('overdue'))) {
      return 'IBL';
    }

    // High scoring trains with minor issues go to service
    if (score >= 70) {
      return 'service';
    }

    // Medium scoring trains go to standby
    if (score >= 40) {
      return 'standby';
    }

    // Low scoring trains go to IBL for maintenance
    return 'IBL';
  }
}