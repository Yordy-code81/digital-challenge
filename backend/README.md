# Microservicio Customers - Backend

Microservicio de gestión de clientes y análisis demográfico de natalidad construido con **Spring Boot 3.3.4 (Java 17 LTS)** y **Oracle Database 23ai**.

---

## 1. Características Técnicas

- **Clean Architecture / Layered DDD:** Separación estricta de responsabilidades entre `domain`, `application` e `infrastructure`.
- **Motor de Base de Datos:** Oracle Database 23ai Free con el driver oficial `com.oracle.database.jdbc:ojdbc11` y dialecto `org.hibernate.dialect.OracleDialect`.
- **Documentación de API Viva:** OpenAPI 3.0 / Swagger UI accesible en `/swagger-ui.html`.
- **Manejo Estándar de Errores:** Implementación de RFC 7807 (*Problem Details*) para respuestas uniformes de validación y negocio.
- **Auditoría Automática:** Marcas de tiempo de creación gestionadas automáticamente por `@CreationTimestamp`.
- **Cálculo Analítico de Natalidad:**
  - Nacimientos agrupados por período `YYYY-MM`.
  - Detección algorítmica de mes/año pico (máximo) y valle (mínimo).
  - Tasa de natalidad mensual porcentual sobre la población total, con protección ante división por cero.

---

## 2. Requisitos Previos

- **Java 17 LTS** (o superior)
- **Apache Maven 3.8+**
- **Docker & Docker Compose** (para ejecutar Oracle Database y el stack completo)

---

## 3. Endpoints de la API

| Método | Endpoint | Descripción | Status Codes |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/customers` | Registra un nuevo cliente con validaciones. | `201`, `400`, `409` |
| `GET` | `/api/v1/customers` | Consulta clientes con filtros opcionales (`dni`, `email`, paginación). | `200` |
| `GET` | `/api/v1/customers/indicators` | Calcula y entrega los indicadores de natalidad. | `200` |

### Documentación Interactiva (Swagger UI)
Una vez levantado el microservicio, ingresa a:
- **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

## 4. Pruebas Automatizadas

Para ejecutar la suite completa de pruebas unitarias y de integración de controladores:

```bash
mvn clean test
```

Resultados de las pruebas:
- `CustomerServiceTest`: Creación válida, validación de DNI duplicado, validación de Email duplicado, filtros y cálculo analítico de natalidad.
- `CustomerControllerTest`: MockMvc verificando códigos HTTP `201 Created`, `400 Bad Request`, `409 Conflict` y respuestas JSON.

---

## 5. Colección de Postman

Se incluye el archivo de exportación listo para importar:
- `customers-api.postman_collection.json` (incluye tests automáticos integrados para validar status codes y schemas).
