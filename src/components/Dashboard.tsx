import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Play, Square, RefreshCw, Plus, Trash } from 'lucide-react';

interface Program {
  name: string;
  country: string;
  operator: string;
  is_high_priority: boolean;
  is_active: boolean;
}

interface Metric {
  country: string;
  sms_sent: number;
  success_rate: number;
}

interface DashboardProps {
  setIsAuthenticated: (value: boolean) => void;
}

function Dashboard({ setIsAuthenticated }: DashboardProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [newProgram, setNewProgram] = useState<Program>({
    name: '',
    country: '',
    operator: '',
    is_high_priority: false,
    is_active: false,
  });
  const history = useHistory();

  useEffect(() => {
    fetchPrograms();
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000); // Fetch metrics every minute
    return () => clearInterval(interval);
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('http://localhost:8000/programs', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.ok) {
        const data = await response.json();
        setPrograms(data);
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await fetch('http://localhost:8000/metrics', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    history.push('/login');
  };

  const handleProgramAction = async (name: string, action: 'start' | 'stop') => {
    try {
      const response = await fetch(`http://localhost:8000/programs/${name}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.ok) {
        fetchPrograms();
      }
    } catch (error) {
      console.error(`Error ${action}ing program:`, error);
    }
  };

  const handleAddProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newProgram),
      });
      if (response.ok) {
        fetchPrograms();
        setNewProgram({
          name: '',
          country: '',
          operator: '',
          is_high_priority: false,
          is_active: false,
        });
      }
    } catch (error) {
      console.error('Error adding program:', error);
    }
  };

  const handleDeleteProgram = async (name: string) => {
    try {
      const response = await fetch(`http://localhost:8000/programs/${name}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.ok) {
        fetchPrograms();
      }
    } catch (error) {
      console.error('Error deleting program:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">SMS Programs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {programs.map((program) => (
                <tr key={program.name}>
                  <td className="px-6 py-4 whitespace-nowrap">{program.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{program.country}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{program.operator}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {program.is_high_priority ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        High
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Normal
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {program.is_active ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleProgramAction(program.name, program.is_active ? 'stop' : 'start')}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      {program.is_active ? <Square className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={() => handleDeleteProgram(program.name)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Program</h2>
        <form onSubmit={handleAddProgram} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              value={newProgram.name}
              onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              id="country"
              value={newProgram.country}
              onChange={(e) => setNewProgram({ ...newProgram, country: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="operator" className="block text-sm font-medium text-gray-700">Operator</label>
            <input
              type="text"
              id="operator"
              value={newProgram.operator}
              onChange={(e) => setNewProgram({ ...newProgram, operator: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="is_high_priority" className="flex items-center">
              <input
                type="checkbox"
                id="is_high_priority"
                checked={newProgram.is_high_priority}
                onChange={(e) => setNewProgram({ ...newProgram, is_high_priority: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">High Priority</span>
            </label>
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Program
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">SMS Metrics</h2>
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
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={fetchMetrics}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Refresh Metrics
        </button>
        <button
          onClick={handleLogout}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;