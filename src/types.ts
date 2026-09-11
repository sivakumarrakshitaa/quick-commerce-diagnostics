export interface RawOrder {
  order_id: string;
  timestamp: string;
  zone: string;
  category: string;
  supplier: string;
  delivery_minutes: number;
  success: number;
}

export interface ParsedOrder extends RawOrder {
  dateObj: Date | null;
  hour: number;
  hourBucket: HourBucket;
  isValid: boolean;
}

export type HourBucket =
  | '6-9 AM'
  | '9 AM-12 PM'
  | '12-3 PM'
  | '3-6 PM'
  | '6-9 PM'
  | '9 PM-12 AM'
  | '12-6 AM (Off-peak)';

export interface TimeBucketMetric {
  bucket: HourBucket;
  displayName: string;
  totalOrders: number;
  failedOrders: number;
  failureRate: number; // in %
  isPeak: boolean;
}

export interface ZoneMetric {
  zone: string;
  totalOrders: number;
  failedOrders: number;
  failureRate: number; // in %
  avgDeliveryMinutes: number;
  isHighlighted: boolean;
}

export interface CategoryMetric {
  category: string;
  totalOrders: number;
  failedOrders: number;
  failureRate: number; // in %
  avgDeliveryMinutes: number;
  isLongest: boolean;
}

export interface HeatmapCell {
  zone: string;
  category: string;
  totalOrders: number;
  failedOrders: number;
  failureRate: number; // in %
  colorClass: string;
  severityLevel: 'low' | 'moderate' | 'problem' | 'critical';
}

export interface Recommendation {
  id: number;
  rank: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  problemStatement: string;
  rootCause: string;
  recommendation: string;
  expectedImpact: string;
  affectedZoneCategories: string[];
}

export interface SummaryStats {
  totalOrders: number;
  overallFailureRate: number;
  worstHourBucket: {
    bucket: string;
    failureRate: number;
    failed: number;
    total: number;
  };
  worstZoneCategory: {
    combo: string;
    zone: string;
    category: string;
    failureRate: number;
    failed: number;
    total: number;
  };
}

export interface AnalysisData {
  orders: ParsedOrder[];
  summaryStats: SummaryStats;
  timeMetrics: TimeBucketMetric[];
  zoneMetrics: ZoneMetric[];
  categoryMetrics: CategoryMetric[];
  heatmapGrid: {
    zones: string[];
    categories: string[];
    matrix: Record<string, HeatmapCell>; // key: `${zone}___${category}`
  };
  recommendations: Recommendation[];
  hasZeroFailures: boolean;
  isSampleSizeSmall: boolean;
}
