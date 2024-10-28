import React from 'react';
import { Program } from '../types';
import { Play, Square, Trash } from 'lucide-react';

interface ProgramTableProps {
  programs: Program[];
  onProgramAction: (name: string, action: 'start' | 'stop') => void;
  onDeleteProgram: (name: string) => void;
}

function ProgramTable({ programs, onProgramAction, onDeleteProgram }: ProgramTableProps) {
  return (
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
                  onClick={() => onProgramAction(program.name, program.is_active ? 'stop' : 'start')}
                  className="text-indigo-600 hover:text-indigo-900 mr-2"
                >
                  {program.is_active ? <Square className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => onDeleteProgram(program.name)}
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
  );
}

export default ProgramTable;