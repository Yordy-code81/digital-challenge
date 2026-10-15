import React from 'react';
import { CustomerIndicatorsResponse } from '../../../core/types/customer.types';
import { Users, TrendingUp, TrendingDown, CalendarHeart } from 'lucide-react';

interface KpiCardsProps {
  indicators: CustomerIndicatorsResponse | null;
  loading: boolean;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ indicators, loading }) => {
  if (loading || !indicators) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-28 mb-3"></div>
            <div className="h-8 bg-slate-300 rounded w-16 mb-2"></div>
            <div className="h-3 bg-slate-100 rounded w-36"></div>
          </div>
        ))}
      </div>
    );
  }

  // Encontrar el mes del año con mayor tasa
  const topMonth = [...(indicators.monthlyBirthRates || [])].sort(
    (a, b) => b.ratePercentage - a.ratePercentage
  )[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Clientes */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Clientes</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{indicators.totalCustomers}</p>
          <p className="text-xs text-slate-400 mt-1">Registrados en Oracle DB</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
          <Users className="w-6 h-6" />
        </div>
      </div>

      {/* Mes Pico */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mes Pico (Máximo)</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
            {indicators.peakPeriod ? indicators.peakPeriod.period : 'N/A'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {indicators.peakPeriod ? `${indicators.peakPeriod.count} nacimientos registrados` : 'Sin registros'}
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>

      {/* Mes Valle */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mes Valle (Mínimo)</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
            {indicators.lowestPeriod ? indicators.lowestPeriod.period : 'N/A'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {indicators.lowestPeriod ? `${indicators.lowestPeriod.count} nacimientos registrados` : 'Sin registros'}
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <TrendingDown className="w-6 h-6" />
        </div>
      </div>

      {/* Mes con Mayor Natalidad General */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mes Más Frecuente</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 mt-1">
            {topMonth && topMonth.count > 0 ? topMonth.monthName : 'N/A'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {topMonth && topMonth.count > 0 ? `${topMonth.ratePercentage}% del total anual` : 'Sin nacimientos'}
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <CalendarHeart className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
