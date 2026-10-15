import React, { useState } from 'react';
import { CustomerIndicatorsResponse } from '../../../core/types/customer.types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { BarChart3, LineChart as LineIcon } from 'lucide-react';

interface BirthRateChartProps {
  indicators: CustomerIndicatorsResponse | null;
  loading: boolean;
}

export const BirthRateChart: React.FC<BirthRateChartProps> = ({ indicators, loading }) => {
  const [chartType, setChartType] = useState<'period' | 'monthly'>('period');

  if (loading || !indicators) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs mb-8 h-80 flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full">
          <div className="h-4 bg-slate-200 rounded w-48"></div>
          <div className="h-60 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const periodData = indicators.birthsByPeriod || [];
  const monthlyData = indicators.monthlyBirthRates || [];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs mb-8">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            {chartType === 'period'
              ? 'Cantidad de Clientes Nacidos por Período (Mes/Año)'
              : 'Tasa de Natalidad Acumulada por Mes (%)'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {chartType === 'period'
              ? 'Distribución cronológica de fechas de nacimiento registradas'
              : 'Porcentaje de nacimientos por cada uno de los 12 meses del año'}
          </p>
        </div>

        {/* Toggle Button */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setChartType('period')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartType === 'period'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-brand-600" />
            <span>Por Mes/Año</span>
          </button>
          <button
            onClick={() => setChartType('monthly')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartType === 'monthly'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LineIcon className="w-3.5 h-3.5 text-brand-600" />
            <span>Tasa Mensual (%)</span>
          </button>
        </div>
      </div>

      {/* Chart Body */}
      <div className="h-72 mt-5">
        {chartType === 'period' ? (
          periodData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-slate-400">
              Sin datos de nacimientos registrados
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={periodData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(val: number) => [`${val} clientes`, 'Nacidos']}
                  labelFormatter={(label) => `Período: ${label}`}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          )
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="birthRateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="monthName"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                unit="%"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(val: number) => [`${val}%`, 'Tasa de Natalidad']}
                labelFormatter={(label) => `Mes: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="ratePercentage"
                stroke="#4f46e5"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#birthRateGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
