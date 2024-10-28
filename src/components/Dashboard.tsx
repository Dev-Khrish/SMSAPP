import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import ProgramTable from './ProgramTable';
import MetricsChart from './MetricsChart';
import AddProgramForm from './AddProgramForm';
import { Program, Metric } from '../types';
import { mockPrograms, mockMetrics } from '../services/mockData';

function Dashboard() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    fetchPrograms();
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchPrograms = () => {
    setPrograms(mockPrograms);
  };

  const fetchMetrics = () => {
    setMetrics(mockMetrics);
  };

  const handleProgramAction = (name: string, action: 'start' | 'stop') => {
    setPrograms(programs.map(program => 
      program.name === name 
        ? { ...program, is_active: action === 'start' }
        : program
    ));
  };

  const handleAddProgram = (newProgram: Program) => {
    setPrograms([...programs, { ...newProgram, is_active: false }]);
  };

  const handleDeleteProgram = (name: string) => {
    setPrograms(programs.filter(program => program.name !== name));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">SMS Programs</h2>
        <ProgramTable
          programs={programs}
          onProgramAction={handleProgramAction}
          onDeleteProgram={handleDeleteProgram}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Program</h2>
        <AddProgramForm onAddProgram={handleAddProgram} />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">SMS Metrics</h2>
        <MetricsChart metrics={metrics} />
      </div>

      <div className="flex justify-end">
        <button
          onClick={fetchMetrics}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Refresh Metrics
        </button>
      </div>
    </div>
  );
}

export default Dashboard;