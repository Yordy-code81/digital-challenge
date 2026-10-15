package com.challenge.customers.infrastructure.exception;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Estructura estándar de respuesta para errores de la API (RFC 7807 Problem Details)")
public class ApiErrorResponse {

    @Schema(description = "Código de estado HTTP", example = "400")
    private int status;

    @Schema(description = "Título descriptivo del error", example = "Bad Request")
    private String title;

    @Schema(description = "Mensaje detallado del error", example = "Los parámetros enviados contienen errores de validación")
    private String detail;

    @Schema(description = "URI del path que originó el error", example = "/api/v1/customers")
    private String path;

    @Schema(description = "Marca de tiempo UTC", example = "2026-10-14T23:30:00Z")
    private Instant timestamp;

    @Schema(description = "Mapa de errores de validación por campo (si aplica)")
    private Map<String, String> errors;
}
