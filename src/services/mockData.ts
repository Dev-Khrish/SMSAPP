import { Program, Metric } from '../types';

export const mockPrograms: Program[] = [
  {
    name: "SMS-Program-1",
    country: "USA",
    operator: "AT&T",
    is_high_priority: true,
    is_active: true
  },
  {
    name: "SMS-Program-2",
    country: "UK",
    operator: "Vodafone",
    is_high_priority: false,
    is_active: false
  }
];

export const mockMetrics: Metric[] = [
  {
    country: "USA",
    sms_sent: 1500,
    success_rate: 0.98
  },
  {
    country: "UK",
    sms_sent: 1200,
    success_rate: 0.95
  }
];