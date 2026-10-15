package com.challenge.customers.domain.exception;

/**
 * Excepción lanzada cuando no se encuentra un cliente por su identificador.
 */
public class CustomerNotFoundException extends RuntimeException {
    public CustomerNotFoundException(String message) {
        super(message);
    }
}
