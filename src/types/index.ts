export type BaseMetric = {
  fn_name: string;
  service_name: string;
  timestamp: string;
};

export type TimingValue = {
  duration: number;
} & BaseMetric;

export type AvailabilityValue = {
  availability: 0 | 1;
} & BaseMetric;
