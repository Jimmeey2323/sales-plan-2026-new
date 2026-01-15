import React from 'react';
import { FinancialTarget } from '../types';
import { IndianRupee, Target } from 'lucide-react';

interface FinancialTableProps {
  targets: FinancialTarget[];
  totalRevenue: string;
}

export const FinancialTable: React.FC<FinancialTableProps> = ({ targets, totalRevenue }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
        <h3 className="font-serif font-semibold text-lg text-gray-800 flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-gray-400" />
          Financial Targets
        </h3>
        <div className="text-right">
          <span className="text-xs text-gray-500 uppercase tracking-widest block">Total Goal</span>
          <span className="text-xl font-bold text-brand-700">{totalRevenue}</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4 text-center">Units</th>
              <th className="px-6 py-4">Ticket Size</th>
              <th className="px-6 py-4 text-right">Revenue</th>
              <th className="px-6 py-4">Strategy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {targets.map((target, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{target.location}</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {target.targetUnits}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{target.estTicketSize}</td>
                <td className="px-6 py-4 text-right font-semibold text-gray-900">{target.revenueTarget}</td>
                <td className="px-6 py-4 text-gray-500 max-w-xs truncate" title={target.logic}>
                  <div className="flex items-center gap-1.5">
                    <Target className="w-3 h-3 text-gray-400" />
                    {target.logic}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
