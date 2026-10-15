package com.challenge.customers.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "DTO de respuesta con los datos de un cliente")
public class CustomerResponse {

    @Schema(description = "Identificador único generado en Oracle", example = "1")
    private Long id;

    @Schema(description = "Nombre del cliente", example = "Carlos")
    private String firstName;

    @Schema(description = "Apellido del cliente", example = "Mendoza")
    private String lastName;

    @Schema(description = "Correo electrónico", example = "carlos.mendoza@example.com")
    private String email;

    @Schema(description = "Documento Nacional de Identidad", example = "72458912")
    private String dni;

    @Schema(description = "Fecha de nacimiento", example = "1994-08-23")
    private LocalDate birthDate;

    @Schema(description = "Fecha y hora de creación y auditoría", example = "2026-10-14T23:30:00Z")
    private Instant createdAt;
}
