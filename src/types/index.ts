export interface Program {
  name: string;
  country: string;
  operator: string;
  is_high_priority: boolean;
  is_active: boolean;
}

export interface Metric {
  country: string;
  sms_sent: number;
  success_rate: number;
}