package com.challenge.customers.application.mapper;

import com.challenge.customers.application.dto.request.CustomerCreateRequest;
import com.challenge.customers.application.dto.response.CustomerPageResponse;
import com.challenge.customers.application.dto.response.CustomerResponse;
import com.challenge.customers.domain.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CustomerMapper {

    public Customer toEntity(CustomerCreateRequest request) {
        if (request == null) {
            return null;
        }
        return Customer.builder()
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .dni(request.getDni().trim())
                .birthDate(request.getBirthDate())
                .build();
    }

    public CustomerResponse toResponse(Customer customer) {
        if (customer == null) {
            return null;
        }
        return CustomerResponse.builder()
                .id(customer.getId())
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .email(customer.getEmail())
                .dni(customer.getDni())
                .birthDate(customer.getBirthDate())
                .createdAt(customer.getCreatedAt())
                .build();
    }

    public List<CustomerResponse> toResponseList(List<Customer> customers) {
        if (customers == null) {
            return List.of();
        }
        return customers.stream()
                .map(this::toResponse)
                .toList();
    }

    public CustomerPageResponse toPageResponse(Page<Customer> page) {
        return CustomerPageResponse.builder()
                .content(toResponseList(page.getContent()))
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .isLast(page.isLast())
                .build();
    }
}
