package com.challenge.customers.infrastructure.controller;

import com.challenge.customers.application.dto.request.CustomerCreateRequest;
import com.challenge.customers.application.dto.response.CustomerIndicatorsResponse;
import com.challenge.customers.application.dto.response.CustomerPageResponse;
import com.challenge.customers.application.dto.response.CustomerResponse;
import com.challenge.customers.application.service.CustomerService;
import com.challenge.customers.infrastructure.exception.ApiErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
@Tag(name = "Customers", description = "Endpoints para la administración de clientes y consulta de indicadores de natalidad")
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    @Operation(summary = "Crear un nuevo cliente", description = "Registra un nuevo cliente validando unicidad de DNI y Email, así como fecha de nacimiento en el pasado.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Cliente creado exitosamente",
                    content = @Content(schema = @Schema(implementation = CustomerResponse.class))),
            @ApiResponse(responseCode = "400", description = "Error de validación en los campos enviados",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Conflicto: DNI o Email ya se encuentran registrados",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<CustomerResponse> createCustomer(
            @Valid @RequestBody CustomerCreateRequest request) {
        CustomerResponse created = customerService.createCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    @Operation(summary = "Consultar clientes", description = "Obtiene clientes con filtros opcionales por DNI, por correo electrónico, o sin filtros con paginación.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista paginada de clientes obtenida exitosamente",
                    content = @Content(schema = @Schema(implementation = CustomerPageResponse.class)))
    })
    public ResponseEntity<CustomerPageResponse> getCustomers(
            @Parameter(description = "Filtro exacto por DNI (opcional)")
            @RequestParam(required = false) String dni,
            @Parameter(description = "Filtro parcial o exacto por correo electrónico (opcional)")
            @RequestParam(required = false) String email,
            @Parameter(description = "Número de página (inicia en 0)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de página")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Campo por el cual ordenar")
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Dirección de ordenamiento (asc o desc)")
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        CustomerPageResponse response = customerService.getCustomers(dni, email, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/indicators")
    @Operation(summary = "Consultar indicadores de natalidad", description = "Calcula métricas demográficas: nacidos por mes/año, período pico, período valle y tasa de natalidad mensual.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Indicadores calculados exitosamente",
                    content = @Content(schema = @Schema(implementation = CustomerIndicatorsResponse.class)))
    })
    public ResponseEntity<CustomerIndicatorsResponse> getIndicators() {
        CustomerIndicatorsResponse response = customerService.getIndicators();
        return ResponseEntity.ok(response);
    }
}
