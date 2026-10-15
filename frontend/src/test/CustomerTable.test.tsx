import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CustomerTable } from '../features/customers/components/CustomerTable';
import { Customer } from '../core/types/customer.types';

describe('CustomerTable Component', () => {
  const mockCustomers: Customer[] = [
    {
      id: 1,
      firstName: 'Carlos',
      lastName: 'Mendoza',
      email: 'carlos.mendoza@example.com',
      dni: '72458912',
      birthDate: '1994-08-15',
      createdAt: '2026-10-14T23:30:00Z',
    },
    {
      id: 2,
      firstName: 'Ana',
      lastName: 'Gómez',
      email: 'ana.gomez@example.com',
      dni: '45891234',
      birthDate: '1990-03-20',
      createdAt: '2026-10-14T23:31:00Z',
    },
  ];

  it('debe renderizar correctamente los datos de los clientes en la tabla', () => {
    render(
      <CustomerTable
        customers={mockCustomers}
        loading={false}
        page={0}
        totalPages={1}
        totalElements={2}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByText('Carlos Mendoza')).toBeInTheDocument();
    expect(screen.getByText('72458912')).toBeInTheDocument();
    expect(screen.getByText('carlos.mendoza@example.com')).toBeInTheDocument();

    expect(screen.getByText('Ana Gómez')).toBeInTheDocument();
    expect(screen.getByText('45891234')).toBeInTheDocument();
    expect(screen.getByText('ana.gomez@example.com')).toBeInTheDocument();
  });

  it('debe mostrar mensaje cuando la lista de clientes está vacía', () => {
    render(
      <CustomerTable
        customers={[]}
        loading={false}
        page={0}
        totalPages={0}
        totalElements={0}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByText('No se encontraron clientes')).toBeInTheDocument();
  });
});
