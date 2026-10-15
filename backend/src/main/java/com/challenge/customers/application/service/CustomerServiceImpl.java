package com.challenge.customers.application.service;

import com.challenge.customers.application.dto.request.CustomerCreateRequest;
import com.challenge.customers.application.dto.response.BirthsByPeriodDto;
import com.challenge.customers.application.dto.response.CustomerIndicatorsResponse;
import com.challenge.customers.application.dto.response.CustomerPageResponse;
import com.challenge.customers.application.dto.response.CustomerResponse;
import com.challenge.customers.application.dto.response.MonthlyBirthRateDto;
import com.challenge.customers.application.dto.response.PeriodCountDto;
import com.challenge.customers.application.mapper.CustomerMapper;
import com.challenge.customers.domain.exception.DuplicateCustomerException;
import com.challenge.customers.domain.model.Customer;
import com.challenge.customers.domain.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    private static final String[] MONTH_NAMES = {
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    };

    private static final DateTimeFormatter PERIOD_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM");

    @Override
    @Transactional
    public CustomerResponse createCustomer(CustomerCreateRequest request) {
        String cleanDni = request.getDni().trim();
        String cleanEmail = request.getEmail().trim().toLowerCase();

        if (customerRepository.existsByDni(cleanDni)) {
            throw new DuplicateCustomerException("Ya existe un cliente registrado con el DNI: " + cleanDni);
        }

        if (customerRepository.existsByEmail(cleanEmail)) {
            throw new DuplicateCustomerException("Ya existe un cliente registrado con el correo: " + cleanEmail);
        }

        Customer entity = customerMapper.toEntity(request);
        Customer saved = customerRepository.save(entity);
        return customerMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerPageResponse getCustomers(String dni, String email, Pageable pageable) {
        String cleanDni = (dni != null && !dni.trim().isBlank()) ? dni.trim() : null;
        String cleanEmail = (email != null && !email.trim().isBlank()) ? email.trim().toLowerCase() : null;

        Page<Customer> page = customerRepository.findFiltered(cleanDni, cleanEmail, pageable);
        return customerMapper.toPageResponse(page);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerIndicatorsResponse getIndicators() {
        List<Customer> allCustomers = customerRepository.findAll();
        long totalCustomers = allCustomers.size();

        if (totalCustomers == 0) {
            return buildEmptyIndicators();
        }

        // 1. Agrupación por período (YYYY-MM)
        Map<String, Long> countByPeriod = allCustomers.stream()
                .collect(Collectors.groupingBy(
                        c -> c.getBirthDate().format(PERIOD_FORMATTER),
                        TreeMap::new,
                        Collectors.counting()
                ));

        List<BirthsByPeriodDto> birthsByPeriod = countByPeriod.entrySet().stream()
                .map(entry -> {
                    String[] parts = entry.getKey().split("-");
                    int year = Integer.parseInt(parts[0]);
                    int month = Integer.parseInt(parts[1]);
                    return BirthsByPeriodDto.builder()
                            .period(entry.getKey())
                            .year(year)
                            .month(month)
                            .count(entry.getValue())
                            .build();
                })
                .sorted(Comparator.comparing(BirthsByPeriodDto::getPeriod))
                .toList();

        // 2. Mes/año con mayor cantidad de clientes nacidos (Peak)
        BirthsByPeriodDto peak = birthsByPeriod.stream()
                .max(Comparator.comparingLong(BirthsByPeriodDto::getCount))
                .orElse(null);

        PeriodCountDto peakPeriod = peak != null ? PeriodCountDto.builder()
                .period(peak.getPeriod())
                .year(peak.getYear())
                .month(peak.getMonth())
                .count(peak.getCount())
                .build() : null;

        // 3. Mes/año con menor cantidad de clientes nacidos (Lowest)
        BirthsByPeriodDto lowest = birthsByPeriod.stream()
                .min(Comparator.comparingLong(BirthsByPeriodDto::getCount))
                .orElse(null);

        PeriodCountDto lowestPeriod = lowest != null ? PeriodCountDto.builder()
                .period(lowest.getPeriod())
                .year(lowest.getYear())
                .month(lowest.getMonth())
                .count(lowest.getCount())
                .build() : null;

        // 4. Tasa de natalidad para cada uno de los 12 meses
        Map<Integer, Long> countByMonth = allCustomers.stream()
                .collect(Collectors.groupingBy(
                        c -> c.getBirthDate().getMonthValue(),
                        Collectors.counting()
                ));

        List<MonthlyBirthRateDto> monthlyBirthRates = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            long count = countByMonth.getOrDefault(m, 0L);
            double rate = calculatePercentage(count, totalCustomers);

            monthlyBirthRates.add(MonthlyBirthRateDto.builder()
                    .month(m)
                    .monthName(MONTH_NAMES[m - 1])
                    .count(count)
                    .ratePercentage(rate)
                    .build());
        }

        return CustomerIndicatorsResponse.builder()
                .totalCustomers(totalCustomers)
                .birthsByPeriod(birthsByPeriod)
                .peakPeriod(peakPeriod)
                .lowestPeriod(lowestPeriod)
                .monthlyBirthRates(monthlyBirthRates)
                .build();
    }

    private double calculatePercentage(long count, long total) {
        if (total == 0) {
            return 0.0;
        }
        return BigDecimal.valueOf((double) count * 100.0 / total)
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();
    }

    private CustomerIndicatorsResponse buildEmptyIndicators() {
        List<MonthlyBirthRateDto> emptyMonthly = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            emptyMonthly.add(MonthlyBirthRateDto.builder()
                    .month(m)
                    .monthName(MONTH_NAMES[m - 1])
                    .count(0L)
                    .ratePercentage(0.0)
                    .build());
        }

        return CustomerIndicatorsResponse.builder()
                .totalCustomers(0L)
                .birthsByPeriod(List.of())
                .peakPeriod(null)
                .lowestPeriod(null)
                .monthlyBirthRates(emptyMonthly)
                .build();
    }
}
