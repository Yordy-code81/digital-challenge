package com.challenge.customers.infrastructure.controller;

import com.challenge.customers.application.dto.request.CustomerCreateRequest;
import com.challenge.customers.application.dto.response.BirthsByPeriodDto;
import com.challenge.customers.application.dto.response.CustomerIndicatorsResponse;
import com.challenge.customers.application.dto.response.CustomerPageResponse;
import com.challenge.customers.application.dto.response.CustomerResponse;
import com.challenge.customers.application.dto.response.MonthlyBirthRateDto;
import com.challenge.customers.application.dto.response.PeriodCountDto;
import com.challenge.customers.application.service.CustomerService;
import com.challenge.customers.domain.exception.DuplicateCustomerException;
import com.challenge.customers.infrastructure.exception.GlobalExceptionHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class CustomerControllerTest {

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @Mock
    private CustomerService customerService;

    @InjectMocks
    private CustomerController customerController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(customerController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    @DisplayName("POST /api/v1/customers - Debe retornar 201 Created al registrar un cliente válido")
    void shouldReturn201WhenCreatingValidCustomer() throws Exception {
        CustomerCreateRequest request = CustomerCreateRequest.builder()
                .firstName("Carlos")
                .lastName("Mendoza")
                .email("carlos.mendoza@example.com")
                .dni("72458912")
                .birthDate(LocalDate.of(1994, 8, 15))
                .build();

        CustomerResponse response = CustomerResponse.builder()
                .id(1L)
                .firstName("Carlos")
                .lastName("Mendoza")
                .email("carlos.mendoza@example.com")
                .dni("72458912")
                .birthDate(LocalDate.of(1994, 8, 15))
                .createdAt(Instant.now())
                .build();

        when(customerService.createCustomer(any(CustomerCreateRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.dni").value("72458912"))
                .andExpect(jsonPath("$.email").value("carlos.mendoza@example.com"));
    }

    @Test
    @DisplayName("POST /api/v1/customers - Debe retornar 400 Bad Request cuando el DNI no tiene 8 dígitos")
    void shouldReturn400WhenDniIsInvalid() throws Exception {
        CustomerCreateRequest request = CustomerCreateRequest.builder()
                .firstName("Carlos")
                .lastName("Mendoza")
                .email("carlos.mendoza@example.com")
                .dni("123") // DNI Inválido
                .birthDate(LocalDate.of(1994, 8, 15))
                .build();

        mockMvc.perform(post("/api/v1/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Validation Error"))
                .andExpect(jsonPath("$.errors.dni").exists());
    }

    @Test
    @DisplayName("POST /api/v1/customers - Debe retornar 409 Conflict cuando el DNI o Email ya existen")
    void shouldReturn409WhenCustomerAlreadyExists() throws Exception {
        CustomerCreateRequest request = CustomerCreateRequest.builder()
                .firstName("Carlos")
                .lastName("Mendoza")
                .email("carlos.mendoza@example.com")
                .dni("72458912")
                .birthDate(LocalDate.of(1994, 8, 15))
                .build();

        when(customerService.createCustomer(any(CustomerCreateRequest.class)))
                .thenThrow(new DuplicateCustomerException("Ya existe un cliente con el DNI: 72458912"));

        mockMvc.perform(post("/api/v1/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.title").value("Resource Already Exists"))
                .andExpect(jsonPath("$.detail").value("Ya existe un cliente con el DNI: 72458912"));
    }

    @Test
    @DisplayName("GET /api/v1/customers - Debe retornar 200 OK con la página de clientes")
    void shouldReturn200WhenGettingCustomers() throws Exception {
        CustomerResponse customer = CustomerResponse.builder()
                .id(1L)
                .firstName("Carlos")
                .lastName("Mendoza")
                .email("carlos.mendoza@example.com")
                .dni("72458912")
                .birthDate(LocalDate.of(1994, 8, 15))
                .createdAt(Instant.now())
                .build();

        CustomerPageResponse pageResponse = CustomerPageResponse.builder()
                .content(List.of(customer))
                .pageNumber(0)
                .pageSize(10)
                .totalElements(1)
                .totalPages(1)
                .isLast(true)
                .build();

        when(customerService.getCustomers(any(), any(), any())).thenReturn(pageResponse);

        mockMvc.perform(get("/api/v1/customers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.content[0].dni").value("72458912"));
    }

    @Test
    @DisplayName("GET /api/v1/customers/indicators - Debe retornar 200 OK con el resumen de natalidad")
    void shouldReturn200WhenGettingIndicators() throws Exception {
        CustomerIndicatorsResponse indicatorsResponse = CustomerIndicatorsResponse.builder()
                .totalCustomers(10L)
                .birthsByPeriod(List.of(
                        BirthsByPeriodDto.builder().period("1994-08").year(1994).month(8).count(3).build()
                ))
                .peakPeriod(PeriodCountDto.builder().period("1994-08").year(1994).month(8).count(3).build())
                .lowestPeriod(PeriodCountDto.builder().period("1990-03").year(1990).month(3).count(1).build())
                .monthlyBirthRates(List.of(
                        MonthlyBirthRateDto.builder().month(8).monthName("Agosto").count(3).ratePercentage(30.0).build()
                ))
                .build();

        when(customerService.getIndicators()).thenReturn(indicatorsResponse);

        mockMvc.perform(get("/api/v1/customers/indicators"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCustomers").value(10))
                .andExpect(jsonPath("$.peakPeriod.period").value("1994-08"))
                .andExpect(jsonPath("$.peakPeriod.count").value(3));
    }
}
