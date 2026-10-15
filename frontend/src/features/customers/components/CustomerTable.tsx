import React from 'react';
import { Customer } from '../../../core/types/customer.types';
import { ChevronLeft, ChevronRight, Calendar, UserCheck, AlertCircle } from 'lucide-react';

interface CustomerTableProps {
  customers: Customer[];
  loading: boolean;
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (newPage: number) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  loading,
  page,
  totalPages,
  totalElements,
  onPageChange,
}) => {
  const calculateAge = (birthDateStr: string): number => {
    try {
      const birth = new Date(birthDateStr);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    } catch {
      return 0;
    }
  };

  const formatDate = (dateStr: string): string => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Table header */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">Cliente</th>
              <th className="py-3.5 px-4">DNI</th>
              <th className="py-3.5 px-4">Correo Electrónico</th>
              <th className="py-3.5 px-4">F. Nacimiento (Edad)</th>
              <th className="py-3.5 px-4 sm:px-6">Fecha Registro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              // Skeletons
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-slate-200 rounded-full"></div>
                      <div className="space-y-1">
                        <div className="h-4 bg-slate-200 rounded w-28"></div>
                        <div className="h-3 bg-slate-100 rounded w-20"></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-6 bg-slate-200 rounded-md w-20"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 bg-slate-200 rounded w-36"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                  </td>
                </tr>
              ))
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <p className="text-slate-600 font-medium">No se encontraron clientes</p>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Prueba modificando los filtros de búsqueda o registra un nuevo cliente en el botón superior.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              customers.map((c) => {
                const age = calculateAge(c.birthDate);
                const initials = `${c.firstName.charAt(0)}${c.lastName.charAt(0)}`.toUpperCase();

                return (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs shrink-0">
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
                            {c.firstName} {c.lastName}
                          </p>
                          <p className="text-xs text-slate-400">ID #{c.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-slate-100 text-slate-800 border border-slate-200/60">
                        {c.dni}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {c.email}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5 text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.birthDate}</span>
                        <span className="text-xs text-slate-400">({age} años)</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-xs text-slate-500">
                      <div className="flex items-center space-x-1">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{formatDate(c.createdAt)}</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="bg-slate-50/80 px-4 sm:px-6 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
        <div>
          Mostrando <span className="font-semibold text-slate-800">{customers.length}</span> de{' '}
          <span className="font-semibold text-slate-800">{totalElements}</span> clientes
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0 || loading}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-2xs">
            Página {page + 1} de {Math.max(totalPages, 1)}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1 || loading}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
