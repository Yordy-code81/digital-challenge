package com.challenge.customers.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Tasa de natalidad distribuida por mes del año")
public class MonthlyBirthRateDto {

    @Schema(description = "Número del mes (1 a 12)", example = "8")
    private int month;

    @Schema(description = "Nombre legible del mes en español", example = "Agosto")
    private String monthName;

    @Schema(description = "Cantidad total de clientes nacidos en este mes", example = "22")
    private long count;

    @Schema(description = "Porcentaje de natalidad respecto a la población total", example = "14.67")
    private double ratePercentage;
}
