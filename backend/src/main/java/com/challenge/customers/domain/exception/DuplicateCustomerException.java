package com.challenge.customers.domain.exception;

/**
 * Excepción lanzada cuando se intenta registrar un cliente con un DNI o Email ya existente.
 */
public class DuplicateCustomerException extends RuntimeException {
    public DuplicateCustomerException(String message) {
        super(message);
    }
}
