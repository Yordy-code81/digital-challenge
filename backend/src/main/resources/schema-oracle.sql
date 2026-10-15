-- =============================================================================
-- ESQUEMA DDL CORPORATIVO PARA ORACLE DATABASE 23ai / 19c / 21c
-- Microservicio: Customers Management & Indicators
-- =============================================================================

-- Tabla principal de clientes
CREATE TABLE customers (
    id NUMBER(19) GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    dni VARCHAR2(20) NOT NULL,
    first_name VARCHAR2(100) NOT NULL,
    last_name VARCHAR2(100) NOT NULL,
    email VARCHAR2(150) NOT NULL,
    birth_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_customers_dni UNIQUE (dni),
    CONSTRAINT uq_customers_email UNIQUE (email)
);

-- Índices B-Tree para optimización de queries y cálculos analíticos
CREATE INDEX idx_customers_dni ON customers (dni);
CREATE INDEX idx_customers_email ON customers (email);
CREATE INDEX idx_customers_birth_date ON customers (birth_date);
