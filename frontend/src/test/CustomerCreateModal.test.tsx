import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomerCreateModal } from '../features/customers/components/CustomerCreateModal';

describe('CustomerCreateModal Component', () => {
  it('no debe renderizarse cuando isOpen es false', () => {
    const { container } = render(
      <CustomerCreateModal
        isOpen={false}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
        showToast={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('debe mostrar los campos requeridos y validar errores al enviar vacío', async () => {
    render(
      <CustomerCreateModal
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
        showToast={vi.fn()}
      />
    );

    expect(screen.getByText('Registrar Nuevo Cliente')).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /Guardar Cliente/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('El nombre es obligatorio')).toBeInTheDocument();
    expect(await screen.findByText('El apellido es obligatorio')).toBeInTheDocument();
    expect(await screen.findByText('El correo electrónico es obligatorio')).toBeInTheDocument();
    expect(await screen.findByText('El DNI es obligatorio')).toBeInTheDocument();
    expect(await screen.findByText('La fecha de nacimiento es obligatoria')).toBeInTheDocument();
  });
});
