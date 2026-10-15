package com.challenge.customers.infrastructure.config;

import com.challenge.customers.domain.model.Customer;
import com.challenge.customers.infrastructure.persistence.SpringDataCustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final SpringDataCustomerRepository repository;

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            log.info("La base de datos ya contiene registros. Omitiendo precarga de datos.");
            return;
        }

        log.info("Iniciando precarga de datos iniciales en Oracle Database...");

        List<Customer> initialCustomers = List.of(
                Customer.builder()
                        .firstName("Carlos")
                        .lastName("Mendoza")
                        .email("carlos.mendoza@example.com")
                        .dni("72458912")
                        .birthDate(LocalDate.of(1994, 8, 15))
                        .build(),
                Customer.builder()
                        .firstName("Ana")
                        .lastName("Gómez")
                        .email("ana.gomez@example.com")
                        .dni("45891234")
                        .birthDate(LocalDate.of(1994, 8, 28))
                        .build(),
                Customer.builder()
                        .firstName("Luis")
                        .lastName("Torres")
                        .email("luis.torres@example.com")
                        .dni("81234567")
                        .birthDate(LocalDate.of(1994, 8, 5))
                        .build(),
                Customer.builder()
                        .firstName("María")
                        .lastName("Rojas")
                        .email("maria.rojas@example.com")
                        .dni("70123456")
                        .birthDate(LocalDate.of(1990, 3, 12))
                        .build(),
                Customer.builder()
                        .firstName("Jorge")
                        .lastName("Paredes")
                        .email("jorge.paredes@example.com")
                        .dni("73456789")
                        .birthDate(LocalDate.of(1990, 3, 24))
                        .build(),
                Customer.builder()
                        .firstName("Lucía")
                        .lastName("Vargas")
                        .email("lucia.vargas@example.com")
                        .dni("76543210")
                        .birthDate(LocalDate.of(1998, 11, 10))
                        .build(),
                Customer.builder()
                        .firstName("Pedro")
                        .lastName("Castillo")
                        .email("pedro.castillo@example.com")
                        .dni("44123890")
                        .birthDate(LocalDate.of(1992, 5, 20))
                        .build(),
                Customer.builder()
                        .firstName("Sofía")
                        .lastName("Castro")
                        .email("sofia.castro@example.com")
                        .dni("75319024")
                        .birthDate(LocalDate.of(1995, 1, 18))
                        .build(),
                Customer.builder()
                        .firstName("Diego")
                        .lastName("Flores")
                        .email("diego.flores@example.com")
                        .dni("78901234")
                        .birthDate(LocalDate.of(1997, 10, 30))
                        .build(),
                Customer.builder()
                        .firstName("Elena")
                        .lastName("Navarro")
                        .email("elena.navarro@example.com")
                        .dni("71239845")
                        .birthDate(LocalDate.of(1993, 7, 14))
                        .build()
        );

        repository.saveAll(initialCustomers);
        log.info("Precarga exitosa de {} clientes iniciales para analítica y pruebas.", initialCustomers.size());
    }
}
