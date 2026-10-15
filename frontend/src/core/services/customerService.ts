import { apiClient } from '../api/apiClient';
import {
  Customer,
  CustomerCreateRequest,
  CustomerIndicatorsResponse,
  CustomerPageResponse,
} from '../types/customer.types';

export interface GetCustomersParams {
  dni?: string;
  email?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export const customerService = {
  async getCustomers(params: GetCustomersParams = {}): Promise<CustomerPageResponse> {
    const response = await apiClient.get<CustomerPageResponse>('/v1/customers', {
      params,
    });
    return response.data;
  },

  async createCustomer(data: CustomerCreateRequest): Promise<Customer> {
    const response = await apiClient.post<Customer>('/v1/customers', data);
    return response.data;
  },

  async getIndicators(): Promise<CustomerIndicatorsResponse> {
    const response = await apiClient.get<CustomerIndicatorsResponse>('/v1/customers/indicators');
    return response.data;
  },
};
