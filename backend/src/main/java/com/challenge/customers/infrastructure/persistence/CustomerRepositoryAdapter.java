package com.challenge.customers.infrastructure.persistence;

import com.challenge.customers.domain.model.Customer;
import com.challenge.customers.domain.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CustomerRepositoryAdapter implements CustomerRepository {

    private final SpringDataCustomerRepository springDataCustomerRepository;

    @Override
    public Customer save(Customer customer) {
        return springDataCustomerRepository.save(customer);
    }

    @Override
    public Optional<Customer> findById(Long id) {
        return springDataCustomerRepository.findById(id);
    }

    @Override
    public Optional<Customer> findByDni(String dni) {
        return springDataCustomerRepository.findByDni(dni);
    }

    @Override
    public Optional<Customer> findByEmail(String email) {
        return springDataCustomerRepository.findByEmail(email);
    }

    @Override
    public boolean existsByDni(String dni) {
        return springDataCustomerRepository.existsByDni(dni);
    }

    @Override
    public boolean existsByEmail(String email) {
        return springDataCustomerRepository.existsByEmail(email);
    }

    @Override
    public Page<Customer> findFiltered(String dni, String email, Pageable pageable) {
        return springDataCustomerRepository.findByFilters(dni, email, pageable);
    }

    @Override
    public List<Customer> findAll() {
        return springDataCustomerRepository.findAll();
    }
}
