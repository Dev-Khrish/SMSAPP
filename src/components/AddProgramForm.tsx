import React, { useState } from 'react';
import { Program } from '../types';
import { Plus } from 'lucide-react';

interface AddProgramFormProps {
  onAddProgram: (program: Program) => void;
}

function AddProgramForm({ onAddProgram }: AddProgramFormProps) {
  const [newProgram, setNewProgram] = useState<Program>({
    name: '',
    country: '',
    operator: '',
    is_high_priority: false,
    is_active: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProgram(newProgram);
    setNewProgram({
      name: '',
      country: '',
      operator: '',
      is_high_priority: false,
      is_active: false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
  );
}

export default AddProgramForm;