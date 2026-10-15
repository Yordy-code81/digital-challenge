package com.challenge.customers.domain.repository;

import com.challenge.customers.domain.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Puerto del repositorio de Dominio para la entidad Customer.
 * Abstrae la persistencia física de la lógica de negocio.
 */
public interface CustomerRepository {

    Customer save(Customer customer);

    Optional<Customer> findById(Long id);

    Optional<Customer> findByDni(String dni);

    Optional<Customer> findByEmail(String email);

    boolean existsByDni(String dni);

    boolean existsByEmail(String email);

    Page<Customer> findFiltered(String dni, String email, Pageable pageable);

    List<Customer> findAll();
}
