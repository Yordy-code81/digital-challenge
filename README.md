# Challenge Técnico Full Stack: Microservicio y Aplicación Web "Customers"

Solución técnica integral de nivel **Senior Full Stack** para la gestión de clientes y análisis demográfico de natalidad con **Spring Boot 3.3 (Java 17 LTS)**, **Oracle Database 23ai** y **React 18 + TypeScript + Vite + Tailwind CSS**.

---

## 1. Arquitectura de la Solución

```
                               ┌──────────────────────────────────────────────────────────┐
                               │                    USUARIO / NAVEGADOR                   │
                               └──────────────────────────────────────────────────────────┘
                                                            │
                                                            │ HTTP / Puerto 3000
                                                            ▼
                               ┌──────────────────────────────────────────────────────────┐
                               │             FRONTEND WEB APP (React 18 + TS)             │
                               │  - Directorio con filtros reactivos (DNI / Email)        │
                               │  - Exportación de clientes a CSV                         │
                               │  - Modal de registro con validaciones en caliente        │
                               │  - Dashboard de Indicadores de Natalidad con Recharts    │
                               │  - Servidor Web Nginx Alpine (Reverse Proxy /api/)       │
                               └──────────────────────────────────────────────────────────┘
                                                            │
                                                            │ REST JSON / Puerto 8080
                                                            ▼
                               ┌──────────────────────────────────────────────────────────┐
                               │          BACKEND MICROSERVICE (Spring Boot 3.3)          │
                               │  - Clean Architecture / Hexagonal / DDD                  │
                               │  - Validaciones Jakarta & RFC 7807 (Problem Details)     │
                               │  - Algoritmo de cálculo de natalidad y períodos pico/valle│
                               │  - Documentación interactiva Swagger UI / OpenAPI 3.0    │
                               └──────────────────────────────────────────────────────────┘
                                                            │
                                                            │ JDBC Oracle Net / Puerto 1521
                                                            ▼
                               ┌──────────────────────────────────────────────────────────┐
                               │             ORACLE DATABASE 23ai FREE                    │
                               │  - Imagen oficial gvenzl/oracle-free:slim                │
                               │  - Tipos nativos (NUMBER, VARCHAR2, DATE, TIMESTAMP)     │
                               │  - Índices B-Tree en DNI, Email y Fecha de Nacimiento    │
                               └──────────────────────────────────────────────────────────┘
```

---

## 2. Tecnologías y Herramientas

| Componente | Tecnologías Utilizadas |
| :--- | :--- |
| **Backend** | Java 17 LTS, Spring Boot 3.3.4, Spring Data JPA, Jakarta Validation, Springdoc OpenAPI 2.6.0, Lombok, Maven 3.8+ |
| **Base de Datos** | Oracle Database 23ai Free, Driver oficial `com.oracle.database.jdbc:ojdbc11`, Dialecto `OracleDialect` |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide React, Axios, Vitest, React Testing Library |
| **DevOps / Despliegue** | Docker, Docker Compose, Nginx Alpine, Multi-stage builds |

---

## 3. Despliegue Automatizado con Docker Compose (Recomendado)

El archivo `docker-compose.yml` orquesta la base de datos Oracle, el backend y el frontend con sincronización de arranque mediante *healthchecks*.

```bash
docker compose up --build
```

Una vez desplegado:
- **Frontend Web App:** [http://localhost:3000](http://localhost:3000)
- **Backend API & Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **Oracle Database Port:** `localhost:1521` (Servicio: `FREEPDB1`, Usuario: `customers_user`)

---

## 4. Ejecución en Entorno Local (Desarrollo)

### 4.1 Backend (Spring Boot)
Requiere una instancia de Oracle Database corriendo (por ejemplo, mediante `docker run -d -p 1521:1521 -e ORACLE_PASSWORD=customers_password -e APP_USER=customers_user -e APP_USER_PASSWORD=customers_password gvenzl/oracle-free:slim`):

```bash
cd backend
mvn clean test
mvn spring-boot:run
```

### 4.2 Frontend (React + Vite)
```bash
cd frontend
npm install
npm run test
npm run dev
```

La aplicación abrirá en [http://localhost:3000](http://localhost:3000).

---

## 5. Endpoints de la API REST

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/api/v1/customers` | Crea un nuevo cliente con validación de DNI (8 dígitos), correo único y fecha pasada. |
| `GET` | `/api/v1/customers` | Consulta clientes con filtros opcionales (`dni`, `email`) y soporte de paginación. |
| `GET` | `/api/v1/customers/indicators` | Calcula indicadores: nacidos por mes/año, período pico, período valle y tasa mensual. |

---

## 6. Pruebas Automatizadas

El proyecto cuenta con una suite completa de pruebas unitarias tanto en backend como en frontend:

- **Backend (JUnit 5 + Mockito + MockMvc):**
  ```bash
  cd backend
  mvn test
  ```
  *(11 pruebas unitarias: validaciones de unicidad, reglas de negocio, cálculo de indicadores y controladores REST).*

- **Frontend (Vitest + React Testing Library):**
  ```bash
  cd frontend
  npm run test
  ```
  *(4 pruebas unitarias: renderizado de tabla, filtros, cálculo dinámico de edad y validaciones de formulario modal).*

---

## 7. Entregables Incluidos

- [x] Código fuente completo del microservicio Backend en Java 17 y Spring Boot.
- [x] Código fuente completo de la aplicación Frontend en React 18, TypeScript y Tailwind CSS.
- [x] Colección de Postman: `backend/customers-api.postman_collection.json`.
- [x] Documentación de la propuesta arquitectónica: `MySolution.md`.
- [x] Script DDL para Oracle: `backend/src/main/resources/schema-oracle.sql`.
- [x] Archivos `README.md` detallados en raíz, backend y frontend.
- [x] Orquestación contenerizada en `docker-compose.yml`.
