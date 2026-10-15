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
@Schema(description = "Respuesta consolidada con todos los indicadores de clientes y natalidad")
public class CustomerIndicatorsResponse {

    @Schema(description = "Total de clientes registrados en el sistema", example = "150")
    private long totalCustomers;

    @Schema(description = "Distribución de cantidad de clientes nacidos por mes/año")
    private List<BirthsByPeriodDto> birthsByPeriod;

    @Schema(description = "Mes/año con mayor cantidad de clientes nacidos")
    private PeriodCountDto peakPeriod;

    @Schema(description = "Mes/año con menor cantidad de clientes nacidos")
    private PeriodCountDto lowestPeriod;

    @Schema(description = "Tasa de natalidad para cada uno de los 12 meses del año")
    private List<MonthlyBirthRateDto> monthlyBirthRates;
}
