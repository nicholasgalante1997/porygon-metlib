export type BaseMetric = {
  fn_name: string;
  service_name: string;
  timestamp: string;
};

export type TimingValue = {
  duration: string;
} & BaseMetric;

export type AvailabilityValue = {
  availability: 0 | 1;
} & BaseMetric;

export type CountValue = {
  count_adjustment: 1;
  s?: string // supplementary metadata
} & BaseMetric;
