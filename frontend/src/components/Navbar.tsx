import React from 'react';
import { Users, BarChart3, UserPlus, Database } from 'lucide-react';

interface NavbarProps {
  activeTab: 'customers' | 'indicators';
  setActiveTab: (tab: 'customers' | 'indicators') => void;
  onOpenCreateModal: () => void;
  totalCustomers?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreateModal,
  totalCustomers,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">CustomerHub</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200/60">
                  <Database className="w-3 h-3 mr-1" /> Oracle 23ai
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Gestión & Analítica de Natalidad</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 sm:space-x-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('customers')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'customers'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-brand-600" />
              <span>Clientes</span>
              {totalCustomers !== undefined && (
                <span className="ml-1 px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full text-xs font-semibold">
                  {totalCustomers}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('indicators')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'indicators'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-brand-600" />
              <span>Indicadores</span>
            </button>
          </nav>

          {/* Action Button */}
          <div className="flex items-center space-x-3">
            <button
              id="btn-new-customer"
              onClick={onOpenCreateModal}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-xs text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              <span>Nuevo Cliente</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
