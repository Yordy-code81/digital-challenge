package com.challenge.customers.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Respuesta paginada para la consulta de clientes")
public class CustomerPageResponse {

    @Schema(description = "Lista de clientes en la página actual")
    private List<CustomerResponse> content;

    @Schema(description = "Número de página actual (base 0)", example = "0")
    private int pageNumber;

    @Schema(description = "Cantidad de elementos por página", example = "10")
    private int pageSize;

    @Schema(description = "Total de registros encontrados", example = "45")
    private long totalElements;

    @Schema(description = "Total de páginas disponibles", example = "5")
    private int totalPages;

    @Schema(description = "Indica si es la última página", example = "false")
    private boolean isLast;
}
