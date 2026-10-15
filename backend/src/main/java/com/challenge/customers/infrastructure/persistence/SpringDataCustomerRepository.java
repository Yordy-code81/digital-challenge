package com.challenge.customers.infrastructure.persistence;

import com.challenge.customers.domain.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SpringDataCustomerRepository extends JpaRepository<Customer, Long> {

    boolean existsByDni(String dni);

    boolean existsByEmail(String email);

    Optional<Customer> findByDni(String dni);

    Optional<Customer> findByEmail(String email);

    @Query("SELECT c FROM Customer c WHERE " +
           "(:dni IS NULL OR c.dni = :dni) AND " +
           "(:email IS NULL OR LOWER(c.email) LIKE LOWER(CONCAT('%', :email, '%')))")
    Page<Customer> findByFilters(@Param("dni") String dni,
                                 @Param("email") String email,
                                 Pageable pageable);
}
