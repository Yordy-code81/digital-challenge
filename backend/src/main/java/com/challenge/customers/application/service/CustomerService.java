package com.challenge.customers.application.service;

import com.challenge.customers.application.dto.request.CustomerCreateRequest;
import com.challenge.customers.application.dto.response.CustomerIndicatorsResponse;
import com.challenge.customers.application.dto.response.CustomerPageResponse;
import com.challenge.customers.application.dto.response.CustomerResponse;
import org.springframework.data.domain.Pageable;

public interface CustomerService {

    CustomerResponse createCustomer(CustomerCreateRequest request);

    CustomerPageResponse getCustomers(String dni, String email, Pageable pageable);

    CustomerIndicatorsResponse getIndicators();
}
