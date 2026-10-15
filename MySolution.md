# Propuesta de Solución de Arquitectura e Implementación
## Challenge Técnico Full Stack: Microservicio y Aplicación Web "Customers"

**Rol:** Senior Full Stack Software Engineer  
**Fecha:** Octubre 2026  
**Documento:** `MySolution.md`  
**Estado:** Propuesta Técnica Aprobada / 100% Docker & Oracle Database  

---

## 1. Resumen Ejecutivo y Enfoque Senior

El objetivo del proyecto es construir una solución integral, escalable, mantenible y con experiencia de usuario (*UX*) de alto estándar para la gestión de clientes y el análisis de indicadores demográficos (natalidad).

La solución se diseña bajo un enfoque **100% contenerizado (Docker & Docker Compose)** y con arquitectura empresarial orientada a **Oracle Database**:

- **Arquitectura Limpia / Hexagonal (Clean Architecture):** Desacoplar la lógica de negocio de los detalles de infraestructura.
- **Persistencia Empresarial Pura en Oracle Database:**
  - Base de datos relacional: **Oracle Database 23ai Free** orquestada como servicio en Docker (`gvenzl/oracle-free:slim`).
  - Driver oficial de Oracle: `com.oracle.database.jdbc:ojdbc11`.
  - Dialecto nativo de Hibernate: `org.hibernate.dialect.OracleDialect`.
  - Tipos de datos nativos corporativos (`NUMBER(19)`, `VARCHAR2`, `DATE`, `TIMESTAMP WITH TIME ZONE`).
- **Despliegue "One-Command" con Docker Compose:**
  - Un único comando (`docker compose up --build`) levanta la base de datos Oracle, compila y arranca el microservicio Spring Boot (esperando con healthcheck que la base de datos esté lista), y compila y sirve la aplicación web React a través de Nginx.
- **Fail-Fast & Data Integrity:** Validaciones robustas en frontend y backend, manejo de errores basado en el estándar **RFC 7807 (Problem Details)** y unicidad controlada a nivel de constraints en Oracle.
- **Frontend Moderno y Reactivo:** Interfaz construida en **React + TypeScript + Vite**, con diseño visual premium, accesibilidad, feedback inmediato (toasts, skeletons) y visualización gráfica interactiva de métricas de natalidad.
- **Calidad y Automatización:** Suite de pruebas unitarias y de integración tanto en Backend (JUnit 5 + Mockito + MockMvc) como en Frontend (Vitest + React Testing Library), colecciones de Postman automatizadas y documentación viva vía OpenAPI 3.0 (Swagger UI).

---

## 2. Definición y Comprensión del Negocio

### 2.1 Entidad `Customer`
Campos requeridos:
1. `id`: Identificador único (tipo numérico `Long` mapeado a `NUMBER(19) GENERATED ALWAYS AS IDENTITY` en Oracle).
2. `firstName`: Nombre (obligatorio, longitud 2-100 caracteres, `VARCHAR2(100)`).
3. `lastName`: Apellido (obligatorio, longitud 2-100 caracteres, `VARCHAR2(100)`).
4. `email`: Correo electrónico (único, formato RFC 5322, `VARCHAR2(150)`).
5. `dni`: Documento Nacional de Identidad (único, 8 dígitos numéricos, `VARCHAR2(20)`).
6. `birthDate`: Fecha de nacimiento (tipo `LocalDate`, no nula, estrictamente menor a la fecha actual, tipo `DATE` en Oracle).
7. `createdAt`: Fecha/hora de creación (tipo `Instant`, asignada automáticamente por auditoría, `TIMESTAMP WITH TIME ZONE`).

### 2.2 Consultas y Filtros
- **Búsqueda flexible:**
  - Por `dni` exacto.
  - Por `email` (coincidencia parcial o exacta, insensible a mayúsculas/minúsculas).
  - Sin filtros (lista completa o paginada).
  - Parámetros de paginación (`page`, `size`) y ordenamiento (`sortBy`, `sortDir`) para evitar saturación de memoria a gran escala.

### 2.3 Motor de Indicadores y Métricas Demográficas
El endpoint de analítica `/api/v1/customers/indicators` debe calcular:
1. **Clientes nacidos por mes/año (`period: YYYY-MM`):**
   - Agrupación temporal: conteo exacto de nacimientos por período.
2. **Mes/año con mayor cantidad de clientes nacidos (Peak Month):**
   - Período o períodos máximos con su respectiva cantidad.
3. **Mes/año con menor cantidad de clientes nacidos (Lowest Month):**
   - Período o períodos mínimos con su respectiva cantidad.
4. **Tasa de natalidad de cada mes (Monthly Birth Rate):**
   - **Fórmula Formal:** 
     $$\text{Tasa de Natalidad (Mes } m) = \left( \frac{\text{Total nacidos en el mes } m}{\text{Total de clientes registrados}} \right) \times 100$$
   - Distribución de los 12 meses del año (Enero a Diciembre) con su porcentaje sobre la población total de clientes.
   - Manejo de casos borde: si $\text{Total} = 0$, retorna 0.00% sin excepciones por división entre cero.

---

## 3. Arquitectura del Sistema

```
+-------------------------------------------------------------------------+
|                              USUARIO / BROWSER                          |
+-------------------------------------------------------------------------+
                                     |
                                     | HTTP / HTTPS (Puerto 3000)
                                     v
+-------------------------------------------------------------------------+
|                 CONTENEDOR: FRONTEND (React + TS + Nginx)               |
|  - Feature: Customers (List, Filter, Modal Form)                        |
|  - Feature: Indicators (KPI Cards, Bar/Line Charts, Summary Table)      |
|  - Nginx Reverse Proxy / Static Web Server                              |
+-------------------------------------------------------------------------+
                                     |
                                     | REST JSON (Puerto 8080)
                                     v
+-------------------------------------------------------------------------+
|                CONTENEDOR: BACKEND (Spring Boot 3 + Java 17)            |
|                                                                         |
|  [PRESENTATION LAYER]                                                   |
|    - CustomerController (/api/v1/customers)                            |
|    - GlobalExceptionHandler (RFC 7807 Problem Details)                  |
|    - OpenAPI / Swagger UI (/swagger-ui.html)                            |
|                                                                         |
|  [APPLICATION LAYER]                                                    |
|    - CreateCustomerUseCase / CustomerService                            |
|    - SearchCustomersUseCase                                             |
|    - CalculateIndicatorsUseCase (Algoritmos de Natalidad)               |
|    - DTOs & Mappers                                                     |
|                                                                         |
|  [DOMAIN LAYER]                                                         |
|    - Entity: Customer                                                   |
|    - Value Objects / Reglas de Negocio                                  |
|    - CustomerRepositoryPort                                             |
|                                                                         |
|  [INFRASTRUCTURE LAYER]                                                 |
|    - Spring Data JPA Repository (Oracle Dialect)                        |
|    - Oracle JDBC Driver (ojdbc11) & HikariCP Connection Pool           |
+-------------------------------------------------------------------------+
                                     |
                                     | JDBC / Oracle Net (Puerto 1521)
                                     v
+-------------------------------------------------------------------------+
|                 CONTENEDOR: ORACLE DATABASE 23ai FREE                   |
|  - Imagen: gvenzl/oracle-free:slim                                      |
|  - Pluggable Database: FREEPDB1                                         |
|  - Table: customers (NUMBER, VARCHAR2, DATE, TIMESTAMP)                 |
|  - Healthcheck activo para sincronización de arranque                   |
+-------------------------------------------------------------------------+
```

### 3.1 Estructura del Backend (Clean Architecture / Layered DDD)
```text
backend/
├── pom.xml                              # Dependencias: Spring Boot 3.3, ojdbc11, Lombok, Springdoc
├── Dockerfile                           # Multi-stage build (Maven compile + Eclipse Temurin JRE)
├── src/
│   ├── main/
│   │   ├── java/com/challenge/customers/
│   │   │   ├── domain/                  # Núcleo de negocio puro (independiente de framework)
│   │   │   │   ├── model/Customer.java
│   │   │   │   ├── repository/CustomerRepository.java
│   │   │   │   └── exception/CustomerNotFoundException.java, DuplicateResourceException.java
│   │   │   ├── application/             # Casos de uso, DTOs y lógica de negocio
│   │   │   │   ├── dto/request/CustomerCreateRequest.java
│   │   │   │   ├── dto/response/CustomerResponse.java, CustomerIndicatorsResponse.java
│   │   │   │   ├── mapper/CustomerMapper.java
│   │   │   │   └── service/CustomerService.java, CustomerServiceImpl.java
│   │   │   └── infrastructure/          # Adaptadores de entrada y salida
│   │   │       ├── controller/CustomerController.java
│   │   │       ├── persistence/SpringDataCustomerRepository.java
│   │   │       ├── config/CorsConfig.java, OpenApiConfig.java, DataLoader.java
│   │   │       └── exception/GlobalExceptionHandler.java, ApiErrorResponse.java
│   │   └── resources/
│   │       ├── application.yml          # Configuración principal apuntando a Oracle
│   │       └── schema-oracle.sql        # Script DDL corporativo para Oracle
│   └── test/
│       └── java/com/challenge/customers/
│           ├── application/CustomerServiceTest.java
│           ├── infrastructure/CustomerControllerTest.java
│           └── domain/CustomerIndicatorsCalculationTest.java
```

### 3.2 Estructura del Frontend (Feature-Based Architecture)
```text
frontend/
├── Dockerfile                           # Multi-stage build (Node build + Nginx Alpine)
├── nginx.conf                           # Configuración Nginx para SPA (Single Page Application)
├── src/
│   ├── assets/                          # Iconos, fuentes y estilos
│   ├── core/                            # Módulos transversales
│   │   ├── api/apiClient.ts             # Instancia de Axios con interceptores y timeout
│   │   ├── types/api.types.ts           # Tipos de respuesta paginada y contratos de error
│   │   └── utils/dateUtils.ts           # Funciones de parseo, cálculo de edad y formateo
│   ├── components/                      # Componentes UI reutilizables
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Toast/
│   │   └── Skeleton/
│   ├── features/                        # Módulos por dominio de negocio
│   │   ├── customers/
│   │   │   ├── components/
│   │   │   │   ├── CustomerTable.tsx
│   │   │   │   ├── CustomerFilters.tsx
│   │   │   │   └── CustomerCreateModal.tsx
│   │   │   ├── hooks/useCustomers.ts
│   │   │   ├── services/customerService.ts
│   │   │   └── types/customer.types.ts
│   │   └── indicators/
│   │       ├── components/
│   │       │   ├── KpiCard.tsx
│   │       │   ├── BirthRateChart.tsx
│   │       │   └── MonthlySummaryTable.tsx
│   │       ├── hooks/useIndicators.ts
│   │       └── services/indicatorService.ts
│   ├── App.tsx                          # Layout principal con navegación por tabs o dashboard
│   ├── main.tsx                         # Entry point
│   └── index.css                        # Tokens CSS, Tailwind / CSS variables
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 4. Stack Tecnológico

| Componente | Tecnología | Justificación Senior |
| :--- | :--- | :--- |
| **Backend Runtime** | Java 17 LTS | Estándar empresarial con Records (inmutabilidad DTO), Pattern Matching y alto rendimiento de JVM. |
| **Backend Framework**| Spring Boot 3.3.x | Estándar de la industria para microservicios. Integración con Jakarta EE 10, Spring Data y Spring Validation. |
| **Persistencia ORM** | Spring Data JPA / Hibernate | Dialecto `org.hibernate.dialect.OracleDialect` con optimizaciones de secuencia y tipos de datos nativos. |
| **Driver de Base de Datos** | `ojdbc11` | Dependencia oficial de Oracle JDBC disponible en Maven Central. |
| **Base de Datos** | Oracle Database 23ai Free | Motor de base de datos corporativo ejecutado en contenedor Docker (`gvenzl/oracle-free:slim`). |
| **Documentación API**| Springdoc OpenAPI (Swagger UI) | Generación automática de especificación OpenAPI 3.0 para pruebas interactivas en navegador y exportación directa a Postman. |
| **Frontend Framework**| React 18+ con TypeScript | Ecosistema sólido y maduro. TypeScript garantiza tipado estricto extremo compartiendo la interfaz de los DTOs del backend. |
| **Build Tool Frontend**| Vite | Velocidad de bundling ultrarrápida y Hot Module Replacement (HMR) superior. |
| **Librería de Gráficos**| Recharts | Gráficos SVG responsivos, interactivos y con renderizado declarativo en React para representar la natalidad por mes/año. |
| **Servidor Web Frontend**| Nginx Alpine | Servidor web ultraligero y de alto rendimiento para servir la SPA en producción. |
| **Testing** | JUnit 5, Mockito, AssertJ, Vitest | Cobertura integral de capas críticas (lógica de negocio, validaciones y renderizado de componentes). |
| **Contenedores** | Docker & Docker Compose | Orquestación de 3 contenedores (Oracle DB, Backend, Frontend) con healthchecks y redes internas. |

---

## 5. Diseño del Modelo de Datos para Oracle Database

### 5.1 Esquema DDL Nativo de Oracle Database (`schema-oracle.sql`)

```sql
-- Creación de la tabla de clientes con tipos nativos de Oracle
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

-- Índices B-Tree para optimización de búsquedas y reportes de natalidad
CREATE INDEX idx_customers_dni ON customers (dni);
CREATE INDEX idx_customers_email ON customers (email);
CREATE INDEX idx_customers_birth_date ON customers (birth_date);
```

### 5.2 Mapeo de Entidad JPA en Java 17
```java
@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "dni", nullable = false, unique = true, length = 20)
    private String dni;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
```

---

## 6. Configuración de la Aplicación (`application.yml`)

```yaml
server:
  port: 8080

spring:
  application:
    name: customers-microservice
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:oracle:thin:@oracle-db:1521/FREEPDB1}
    driver-class-name: oracle.jdbc.OracleDriver
    username: ${SPRING_DATASOURCE_USERNAME:customers_user}
    password: ${SPRING_DATASOURCE_PASSWORD:customers_password}
    hikari:
      maximum-pool-size: 10
      minimum-idle: 2
      idle-timeout: 300000
      connection-timeout: 30000
  jpa:
    database-platform: org.hibernate.dialect.OracleDialect
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        format_sql: false

springdoc:
  swagger-ui:
    path: /swagger-ui.html
  api-docs:
    path: /v3/api-docs
```

---

## 7. Diseño de la API RESTful (Endpoints y Contratos)

### 7.1 `POST /api/v1/customers`
Crea un nuevo cliente en el sistema.

**Request Body:**
```json
{
  "firstName": "Carlos",
  "lastName": "Mendoza",
  "email": "carlos.mendoza@example.com",
  "dni": "72458912",
  "birthDate": "1994-08-23"
}
```

**Respuestas:**
- `201 Created`: Cliente creado exitosamente. Retorna el objeto creado con su ID y `createdAt`.
- `400 Bad Request`: Error de validación (campos en blanco, fecha futura, formato de email inválido).
- `409 Conflict`: DNI o Email ya registrados en el sistema.

### 7.2 `GET /api/v1/customers`
Consulta clientes con soporte de filtros opcionales y paginación.

**Query Parameters:**
- `dni` *(opcional)*: Filtro por documento.
- `email` *(opcional)*: Filtro por email.
- `page` *(opcional, default: 0)*: Número de página.
- `size` *(opcional, default: 10)*: Registros por página.
- `sortBy` *(opcional, default: createdAt)*: Campo de ordenamiento.
- `sortDir` *(opcional, default: desc)*: `asc` o `desc`.

**Respuesta `200 OK`:**
```json
{
  "content": [
    {
      "id": 1,
      "firstName": "Carlos",
      "lastName": "Mendoza",
      "email": "carlos.mendoza@example.com",
      "dni": "72458912",
      "birthDate": "1994-08-23",
      "createdAt": "2026-10-14T23:30:00Z"
    }
  ],
  "pageNumber": 0,
  "pageSize": 10,
  "totalElements": 1,
  "totalPages": 1,
  "isLast": true
}
```

### 7.3 `GET /api/v1/customers/indicators`
Calcula y entrega todos los indicadores demográficos y de natalidad requeridos.

**Respuesta `200 OK`:**
```json
{
  "totalCustomers": 150,
  "birthsByPeriod": [
    {
      "period": "1994-08",
      "year": 1994,
      "month": 8,
      "count": 14
    },
    {
      "period": "1995-02",
      "year": 1995,
      "month": 2,
      "count": 2
    }
  ],
  "peakPeriod": {
    "period": "1994-08",
    "year": 1994,
    "month": 8,
    "count": 14
  },
  "lowestPeriod": {
    "period": "1995-02",
    "year": 1995,
    "month": 2,
    "count": 2
  },
  "monthlyBirthRates": [
    { "month": 1, "monthName": "Enero", "count": 12, "ratePercentage": 8.00 },
    { "month": 2, "monthName": "Febrero", "count": 8, "ratePercentage": 5.33 },
    { "month": 3, "monthName": "Marzo", "count": 15, "ratePercentage": 10.00 },
    { "month": 4, "monthName": "Abril", "count": 10, "ratePercentage": 6.67 },
    { "month": 5, "monthName": "Mayo", "count": 11, "ratePercentage": 7.33 },
    { "month": 6, "monthName": "Junio", "count": 9, "ratePercentage": 6.00 },
    { "month": 7, "monthName": "Julio", "count": 13, "ratePercentage": 8.67 },
    { "month": 8, "monthName": "Agosto", "count": 22, "ratePercentage": 14.67 },
    { "month": 9, "monthName": "Septiembre", "count": 14, "ratePercentage": 9.33 },
    { "month": 10, "monthName": "Octubre", "count": 16, "ratePercentage": 10.67 },
    { "month": 11, "monthName": "Noviembre", "count": 10, "ratePercentage": 6.67 },
    { "month": 12, "monthName": "Diciembre", "count": 10, "ratePercentage": 6.67 }
  ]
}
```

---

## 8. Docker Compose: Orquestación Integral

El archivo `docker-compose.yml` orquesta los 3 componentes del sistema:

```yaml
version: '3.8'

services:
  oracle-db:
    image: gvenzl/oracle-free:slim
    container_name: customers-oracle-db
    environment:
      ORACLE_PASSWORD: customers_password
      APP_USER: customers_user
      APP_USER_PASSWORD: customers_password
    ports:
      - "1521:1521"
    volumes:
      - oracle_data:/opt/oracle/oradata
    healthcheck:
      test: ["CMD", "healthcheck.sh"]
      interval: 10s
      timeout: 5s
      retries: 15

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: customers-backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:oracle:thin:@oracle-db:1521/FREEPDB1
      SPRING_DATASOURCE_USERNAME: customers_user
      SPRING_DATASOURCE_PASSWORD: customers_password
    ports:
      - "8080:8080"
    depends_on:
      oracle-db:
        condition: service_healthy

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: customers-frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  oracle_data:
```

---

## 9. Estrategia de Testing y Calidad de Código

### 9.1 Backend Tests
- **Unit Tests (`CustomerServiceTest`):**
  - Creación exitosa de cliente con datos válidos.
  - Validación de excepción por DNI duplicado o Email duplicado.
  - Cálculo de indicadores con lista vacía (caso borde cero división).
  - Cálculo de indicadores con múltiples fechas para verificar mes pico, mes valle y tasas porcentuales exactas.
- **Controller Slice Tests (`CustomerControllerTest`):**
  - Prueba de status codes `201`, `400`, `409` usando `MockMvc`.
  - Validación de respuesta del endpoint de indicadores.

### 9.2 Frontend Tests
- **Unit & Component Tests (`CustomerTable.test.tsx`, `CustomerCreateModal.test.tsx`):**
  - Renderizado de clientes en la tabla.
  - Comportamiento de los filtros de búsqueda reactivos.
  - Validación de inputs requeridos en el formulario antes de llamar al servicio.
  - Renderizado correcto de las tarjetas de indicadores y gráficos.

---

## 10. Guía de Ejecución para el Evaluador

El evaluador únicamente requerirá Docker instalado y ejecutará:

```bash
docker compose up --build
```

Una vez finalizado el arranque:
- **Frontend Web App:** `http://localhost:3000`
- **Backend API & Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **Oracle Database Port:** `localhost:1521` (Service: `FREEPDB1`)

---

## 11. Entregables Finales

1. **Backend Microservice:** Proyecto Maven Spring Boot 3.3, Java 17, `ojdbc11`, JPA, Swagger UI.
2. **Frontend Web App:** React 18, Vite, TypeScript, Recharts, Lucide Icons.
3. **Colección Postman:** `customers-api.postman_collection.json` con pruebas automáticas integradas.
4. **Documentación:** `README.md` maestro detallando funcionamiento, arquitectura y comandos de Docker.
5. **Pruebas Automatizadas:** Mínimo una prueba unitaria requerida en backend y frontend (entregaremos suites completas).

---

**El documento ha sido actualizado a una arquitectura 100% Docker & Oracle Database. ¿Iniciamos con el código del backend?**
