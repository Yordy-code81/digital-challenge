package com.challenge.customers.application.service;

import com.challenge.customers.application.dto.request.CustomerCreateRequest;
import com.challenge.customers.application.dto.response.CustomerIndicatorsResponse;
import com.challenge.customers.application.dto.response.CustomerPageResponse;
import com.challenge.customers.application.dto.response.CustomerResponse;
import com.challenge.customers.application.mapper.CustomerMapper;
import com.challenge.customers.domain.exception.DuplicateCustomerException;
import com.challenge.customers.domain.model.Customer;
import com.challenge.customers.domain.repository.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Spy
    private CustomerMapper customerMapper;

    @InjectMocks
    private CustomerServiceImpl customerService;

    private Customer sampleCustomer;
    private CustomerCreateRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleRequest = CustomerCreateRequest.builder()
                .firstName("Carlos")
                .lastName("Mendoza")
                .email("carlos.mendoza@example.com")
                .dni("72458912")
                .birthDate(LocalDate.of(1994, 8, 15))
                .build();

        sampleCustomer = Customer.builder()
                .id(1L)
                .firstName("Carlos")
                .lastName("Mendoza")
                .email("carlos.mendoza@example.com")
                .dni("72458912")
                .birthDate(LocalDate.of(1994, 8, 15))
                .createdAt(Instant.now())
                .build();
    }

    @Test
    @DisplayName("Debe registrar un nuevo cliente exitosamente cuando los datos son válidos y únicos")
    void shouldCreateCustomerSuccessfully() {
        when(customerRepository.existsByDni("72458912")).thenReturn(false);
        when(customerRepository.existsByEmail("carlos.mendoza@example.com")).thenReturn(false);
        when(customerRepository.save(any(Customer.class))).thenReturn(sampleCustomer);

        CustomerResponse response = customerService.createCustomer(sampleRequest);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getDni()).isEqualTo("72458912");
        assertThat(response.getEmail()).isEqualTo("carlos.mendoza@example.com");
        verify(customerRepository).save(any(Customer.class));
    }

    @Test
    @DisplayName("Debe lanzar DuplicateCustomerException cuando el DNI ya existe")
    void shouldThrowExceptionWhenDniAlreadyExists() {
        when(customerRepository.existsByDni("72458912")).thenReturn(true);

        assertThatThrownBy(() -> customerService.createCustomer(sampleRequest))
                .isInstanceOf(DuplicateCustomerException.class)
                .hasMessageContaining("72458912");

        verify(customerRepository, never()).save(any(Customer.class));
    }

    @Test
    @DisplayName("Debe lanzar DuplicateCustomerException cuando el Email ya existe")
    void shouldThrowExceptionWhenEmailAlreadyExists() {
        when(customerRepository.existsByDni("72458912")).thenReturn(false);
        when(customerRepository.existsByEmail("carlos.mendoza@example.com")).thenReturn(true);

        assertThatThrownBy(() -> customerService.createCustomer(sampleRequest))
                .isInstanceOf(DuplicateCustomerException.class)
                .hasMessageContaining("carlos.mendoza@example.com");

        verify(customerRepository, never()).save(any(Customer.class));
    }

    @Test
    @DisplayName("Debe consultar clientes paginados con filtros")
    void shouldGetCustomersWithFilters() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Customer> customerPage = new PageImpl<>(List.of(sampleCustomer), pageable, 1);

        when(customerRepository.findFiltered("72458912", null, pageable))
                .thenReturn(customerPage);

        CustomerPageResponse response = customerService.getCustomers("72458912", null, pageable);

        assertThat(response).isNotNull();
        assertThat(response.getTotalElements()).isEqualTo(1);
        assertThat(response.getContent()).hasSize(1);
        assertThat(response.getContent().get(0).getDni()).isEqualTo("72458912");
    }

    @Test
    @DisplayName("Debe retornar indicadores con valores en cero y sin error de división cuando la BD está vacía")
    void shouldHandleEmptyDatabaseWhenCalculatingIndicators() {
        when(customerRepository.findAll()).thenReturn(List.of());

        CustomerIndicatorsResponse response = customerService.getIndicators();

        assertThat(response).isNotNull();
        assertThat(response.getTotalCustomers()).isZero();
        assertThat(response.getBirthsByPeriod()).isEmpty();
        assertThat(response.getPeakPeriod()).isNull();
        assertThat(response.getLowestPeriod()).isNull();
        assertThat(response.getMonthlyBirthRates()).hasSize(12);
        assertThat(response.getMonthlyBirthRates().get(0).getRatePercentage()).isEqualTo(0.0);
    }

    @Test
    @DisplayName("Debe calcular correctamente el período pico, período valle y tasas de natalidad")
    void shouldCalculateIndicatorsCorrectly() {
        Customer c1 = Customer.builder().id(1L).birthDate(LocalDate.of(1994, 8, 1)).build();
        Customer c2 = Customer.builder().id(2L).birthDate(LocalDate.of(1994, 8, 20)).build();
        Customer c3 = Customer.builder().id(3L).birthDate(LocalDate.of(1994, 8, 25)).build();
        Customer c4 = Customer.builder().id(4L).birthDate(LocalDate.of(1990, 3, 10)).build();

        when(customerRepository.findAll()).thenReturn(List.of(c1, c2, c3, c4));

        CustomerIndicatorsResponse response = customerService.getIndicators();

        assertThat(response).isNotNull();
        assertThat(response.getTotalCustomers()).isEqualTo(4);

        // Período pico debe ser 1994-08 con 3 nacimientos
        assertThat(response.getPeakPeriod()).isNotNull();
        assertThat(response.getPeakPeriod().getPeriod()).isEqualTo("1994-08");
        assertThat(response.getPeakPeriod().getCount()).isEqualTo(3);

        // Período valle debe ser 1990-03 con 1 nacimiento
        assertThat(response.getLowestPeriod()).isNotNull();
        assertThat(response.getLowestPeriod().getPeriod()).isEqualTo("1990-03");
        assertThat(response.getLowestPeriod().getCount()).isEqualTo(1);

        // Tasa de natalidad para Agosto (mes 8): 3 de 4 = 75.0%
        var augustRate = response.getMonthlyBirthRates().stream()
                .filter(m -> m.getMonth() == 8)
                .findFirst()
                .orElseThrow();
        assertThat(augustRate.getCount()).isEqualTo(3);
        assertThat(augustRate.getRatePercentage()).isEqualTo(75.0);

        // Tasa de natalidad para Marzo (mes 3): 1 de 4 = 25.0%
        var marchRate = response.getMonthlyBirthRates().stream()
                .filter(m -> m.getMonth() == 3)
                .findFirst()
                .orElseThrow();
        assertThat(marchRate.getCount()).isEqualTo(1);
        assertThat(marchRate.getRatePercentage()).isEqualTo(25.0);
    }
}
