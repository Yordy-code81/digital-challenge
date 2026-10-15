import React from 'react';
import { Search, Mail, FileSpreadsheet, RotateCcw } from 'lucide-react';
import { Customer } from '../../../core/types/customer.types';

interface CustomerFiltersProps {
  dniFilter: string;
  setDniFilter: (val: string) => void;
  emailFilter: string;
  setEmailFilter: (val: string) => void;
  onRefresh: () => void;
  customers: Customer[];
}

export const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  dniFilter,
  setDniFilter,
  emailFilter,
  setEmailFilter,
  onRefresh,
  customers,
}) => {
  const handleExportCSV = () => {
    if (!customers || customers.length === 0) return;

    // Encabezados CSV
    const headers = ['ID', 'DNI', 'Nombre', 'Apellido', 'Email', 'Fecha de Nacimiento', 'Fecha Creacion'];
    const rows = customers.map((c) => [
      c.id,
      `"${c.dni}"`,
      `"${c.firstName}"`,
      `"${c.lastName}"`,
      `"${c.email}"`,
      c.birthDate,
      `"${c.createdAt}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `clientes_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasFilters = dniFilter.trim() !== '' || emailFilter.trim() !== '';

  const handleClear = () => {
    setDniFilter('');
    setEmailFilter('');
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs mb-6">
      <div className="flex flex-col md:flex-row gap-3.5 items-stretch md:items-center justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
          {/* DNI Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="filter-dni"
              type="text"
              value={dniFilter}
              onChange={(e) => setDniFilter(e.target.value)}
              placeholder="Filtrar por DNI..."
              maxLength={12}
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>

          {/* Email Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="filter-email"
              type="text"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              placeholder="Filtrar por correo electrónico..."
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5 self-end md:self-auto">
          {hasFilters && (
            <button
              onClick={handleClear}
              className="inline-flex items-center px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Limpiar filtros
            </button>
          )}

          <button
            onClick={onRefresh}
            title="Actualizar lista"
            className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportCSV}
            disabled={!customers || customers.length === 0}
            className="inline-flex items-center space-x-2 px-3.5 py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
