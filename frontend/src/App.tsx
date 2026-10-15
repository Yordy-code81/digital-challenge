import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Toast, ToastMessage } from './components/Toast';
import { CustomerFilters } from './features/customers/components/CustomerFilters';
import { CustomerTable } from './features/customers/components/CustomerTable';
import { CustomerCreateModal } from './features/customers/components/CustomerCreateModal';
import { KpiCards } from './features/indicators/components/KpiCards';
import { BirthRateChart } from './features/indicators/components/BirthRateChart';
import { MonthlySummaryTable } from './features/indicators/components/MonthlySummaryTable';
import { customerService } from './core/services/customerService';
import { Customer, CustomerIndicatorsResponse } from './core/types/customer.types';

export function App() {
  const [activeTab, setActiveTab] = useState<'customers' | 'indicators'>('customers');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Clientes State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [dniFilter, setDniFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Indicadores State
  const [indicators, setIndicators] = useState<CustomerIndicatorsResponse | null>(null);
  const [loadingIndicators, setLoadingIndicators] = useState(false);

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({
      id: Math.random().toString(),
      type,
      message,
    });
  }, []);

  // Fetch Clientes
  const fetchCustomers = useCallback(async () => {
    try {
      setLoadingCustomers(true);
      const data = await customerService.getCustomers({
        dni: dniFilter.trim() || undefined,
        email: emailFilter.trim() || undefined,
        page,
        size: 10,
        sortBy: 'createdAt',
        sortDir: 'desc',
      });
      setCustomers(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      showToast('error', 'Error al cargar clientes desde el microservicio');
    } finally {
      setLoadingCustomers(false);
    }
  }, [dniFilter, emailFilter, page, showToast]);

  // Fetch Indicadores
  const fetchIndicators = useCallback(async () => {
    try {
      setLoadingIndicators(true);
      const data = await customerService.getIndicators();
      setIndicators(data);
    } catch {
      showToast('error', 'Error al cargar indicadores de natalidad');
    } finally {
      setLoadingIndicators(false);
    }
  }, [showToast]);

  // Debounced filter effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0); // Reset a primera página al filtrar
      fetchCustomers();
    }, 350);
    return () => clearTimeout(timer);
  }, [dniFilter, emailFilter, fetchCustomers]);

  // Page change effect
  useEffect(() => {
    fetchCustomers();
  }, [page, fetchCustomers]);

  // Load indicators when tab changes to indicators or on initial load
  useEffect(() => {
    fetchIndicators();
  }, [fetchIndicators]);

  const handleCustomerCreated = () => {
    fetchCustomers();
    fetchIndicators();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navbar Superior */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => setIsModalOpen(true)}
        totalCustomers={indicators ? indicators.totalCustomers : totalElements}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'customers' ? (
          <div>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Directorio de Clientes</h1>
                <p className="text-sm text-slate-500">
                  Consulta, filtra por DNI o correo y administra el padrón de clientes.
                </p>
              </div>
            </div>

            {/* Barra de Filtros y Exportación */}
            <CustomerFilters
              dniFilter={dniFilter}
              setDniFilter={setDniFilter}
              emailFilter={emailFilter}
              setEmailFilter={setEmailFilter}
              onRefresh={fetchCustomers}
              customers={customers}
            />

            {/* Tabla Principal */}
            <CustomerTable
              customers={customers}
              loading={loadingCustomers}
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              onPageChange={setPage}
            />
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Indicadores y Demografía</h1>
              <p className="text-sm text-slate-500">
                Análisis temporal de natalidad, períodos de máxima y mínima concentración, y tasas mensuales.
              </p>
            </div>

            {/* Tarjetas KPI */}
            <KpiCards indicators={indicators} loading={loadingIndicators} />

            {/* Gráfico Analítico Recharts */}
            <BirthRateChart indicators={indicators} loading={loadingIndicators} />

            {/* Tabla Detallada por Mes */}
            <MonthlySummaryTable indicators={indicators} loading={loadingIndicators} />
          </div>
        )}
      </main>

      {/* Modal de Creación */}
      <CustomerCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCustomerCreated}
        showToast={showToast}
      />

      {/* Toast Notificación */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
