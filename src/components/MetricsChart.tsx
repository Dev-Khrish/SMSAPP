import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Metric } from '../types';

interface MetricsChartProps {
  metrics: Metric[];
}

function MetricsChart({ metrics }: MetricsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={metrics}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="country" />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="sms_sent" fill="#8884d8" name="SMS Sent" />
        <Bar yAxisId="right" dataKey="success_rate" fill="#82ca9d" name="Success Rate" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MetricsChart;