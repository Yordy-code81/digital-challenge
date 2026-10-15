import React, { useState } from 'react';
import { X, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { CustomerCreateRequest } from '../../../core/types/customer.types';
import { customerService } from '../../../core/services/customerService';
import axios from 'axios';

interface CustomerCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  showToast: (type: 'success' | 'error', message: string) => void;
}

export const CustomerCreateModal: React.FC<CustomerCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  showToast,
}) => {
  const [formData, setFormData] = useState<CustomerCreateRequest>({
    firstName: '',
    lastName: '',
    email: '',
    dni: '',
    birthDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es obligatorio';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es obligatorio';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Formato de correo no válido';
    }

    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es obligatorio';
    } else if (!/^\d{8}$/.test(formData.dni.trim())) {
      newErrors.dni = 'El DNI debe contener exactamente 8 dígitos numéricos';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'La fecha de nacimiento es obligatoria';
    } else {
      const selected = new Date(formData.birthDate);
      const today = new Date();
      if (selected >= today) {
        newErrors.birthDate = 'La fecha de nacimiento debe ser en el pasado';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    try {
      setSubmitting(true);
      await customerService.createCustomer({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        dni: formData.dni.trim(),
        birthDate: formData.birthDate,
      });

      showToast('success', 'Cliente registrado exitosamente en Oracle Database');
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        dni: '',
        birthDate: '',
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const data = err.response.data;
        if (data.status === 409) {
          setServerError(data.detail || 'El DNI o Correo ya se encuentra registrado');
        } else if (data.status === 400 && data.errors) {
          setErrors(data.errors);
          setServerError('Por favor corrige los errores del formulario');
        } else {
          setServerError(data.detail || 'Ocurrió un error al registrar el cliente');
        }
      } else {
        setServerError('No se pudo conectar con el microservicio');
      }
      showToast('error', 'Error al registrar cliente');
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Registrar Nuevo Cliente</h2>
              <p className="text-xs text-slate-500">Completa los campos para persistir en Oracle DB</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Server Error Alert */}
        {serverError && (
          <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2.5 text-rose-800 text-sm">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Carlos"
                className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:bg-white transition-all ${
                  errors.firstName
                    ? 'border-rose-300 focus:ring-rose-500'
                    : 'border-slate-200 focus:ring-brand-500'
                }`}
              />
              {errors.firstName && (
                <p className="text-xs text-rose-500 mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Apellido <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Mendoza"
                className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:bg-white transition-all ${
                  errors.lastName
                    ? 'border-rose-300 focus:ring-rose-500'
                    : 'border-slate-200 focus:ring-brand-500'
                }`}
              />
              {errors.lastName && (
                <p className="text-xs text-rose-500 mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* DNI */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              DNI (Documento de Identidad) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              maxLength={8}
              value={formData.dni}
              onChange={(e) => setFormData({ ...formData, dni: e.target.value.replace(/\D/g, '') })}
              placeholder="72458912"
              className={`w-full px-3.5 py-2.5 text-sm font-mono bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:bg-white transition-all ${
                errors.dni
                  ? 'border-rose-300 focus:ring-rose-500'
                  : 'border-slate-200 focus:ring-brand-500'
              }`}
            />
            {errors.dni && (
              <p className="text-xs text-rose-500 mt-1">{errors.dni}</p>
            )}
            <p className="text-xs text-slate-400 mt-0.5">Debe contener exactamente 8 números</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Correo Electrónico <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="carlos.mendoza@example.com"
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:bg-white transition-all ${
                errors.email
                  ? 'border-rose-300 focus:ring-rose-500'
                  : 'border-slate-200 focus:ring-brand-500'
              }`}
            />
            {errors.email && (
              <p className="text-xs text-rose-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Fecha de Nacimiento */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Fecha de Nacimiento <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              max={todayStr}
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:bg-white transition-all ${
                errors.birthDate
                  ? 'border-rose-300 focus:ring-rose-500'
                  : 'border-slate-200 focus:ring-brand-500'
              }`}
            />
            {errors.birthDate && (
              <p className="text-xs text-rose-500 mt-1">{errors.birthDate}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              id="btn-submit-customer"
              type="submit"
              disabled={submitting}
              className="inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Guardar Cliente</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
