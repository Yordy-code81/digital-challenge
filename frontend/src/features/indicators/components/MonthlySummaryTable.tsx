import React from 'react';
import { CustomerIndicatorsResponse } from '../../../core/types/customer.types';
import { Calendar } from 'lucide-react';

interface MonthlySummaryTableProps {
  indicators: CustomerIndicatorsResponse | null;
  loading: boolean;
}

export const MonthlySummaryTable: React.FC<MonthlySummaryTableProps> = ({ indicators, loading }) => {
  if (loading || !indicators) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs animate-pulse">
        <div className="h-5 bg-slate-200 rounded w-44 mb-4"></div>
        <div className="h-40 bg-slate-100 rounded-xl"></div>
      </div>
    );
  }

  const monthlyRates = indicators.monthlyBirthRates || [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Desglose de Tasa de Natalidad Mensual</h3>
            <p className="text-xs text-slate-500">Distribución porcentual sobre el total de {indicators.totalCustomers} clientes registrados</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-5">Mes</th>
              <th className="py-3 px-4">Nacidos Registrados</th>
              <th className="py-3 px-4">Tasa de Natalidad</th>
              <th className="py-3 px-5">Proporción Visual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {monthlyRates.map((item) => (
              <tr key={item.month} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-5 font-medium text-slate-800">
                  <span className="inline-block w-6 text-xs text-slate-400 font-mono">
                    #{String(item.month).padStart(2, '0')}
                  </span>
                  {item.monthName}
                </td>
                <td className="py-3 px-4 font-semibold text-slate-700">
                  {item.count} clientes
                </td>
                <td className="py-3 px-4 font-bold text-brand-600">
                  {item.ratePercentage.toFixed(2)}%
                </td>
                <td className="py-3 px-5 w-1/3">
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-brand-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(item.ratePercentage * 3, 100)}%` }}
                      ></div>
                    </div>
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
