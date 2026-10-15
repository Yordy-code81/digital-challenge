export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  birthDate: string;
  createdAt: string;
}

export interface CustomerCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  birthDate: string;
}

export interface CustomerPageResponse {
  content: Customer[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

export interface BirthsByPeriodDto {
  period: string;
  year: number;
  month: number;
  count: number;
}

export interface PeriodCountDto {
  period: string;
  year: number;
  month: number;
  count: number;
}

export interface MonthlyBirthRateDto {
  month: number;
  monthName: string;
  count: number;
  ratePercentage: number;
}

export interface CustomerIndicatorsResponse {
  totalCustomers: number;
  birthsByPeriod: BirthsByPeriodDto[];
  peakPeriod: PeriodCountDto | null;
  lowestPeriod: PeriodCountDto | null;
  monthlyBirthRates: MonthlyBirthRateDto[];
}

export interface ApiErrorResponse {
  status: number;
  title: string;
  detail: string;
  errors?: Record<string, string>;
}
