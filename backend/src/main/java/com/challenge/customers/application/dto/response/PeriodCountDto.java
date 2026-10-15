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
@Schema(description = "Detalle de período mes/año extremo (pico o valle)")
public class PeriodCountDto {

    @Schema(description = "Período en formato YYYY-MM", example = "1994-08")
    private String period;

    @Schema(description = "Año del período", example = "1994")
    private int year;

    @Schema(description = "Mes del período (1 a 12)", example = "8")
    private int month;

    @Schema(description = "Cantidad de clientes nacidos", example = "14")
    private long count;
}
