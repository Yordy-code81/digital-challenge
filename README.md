# Challenge Técnico Full Stack: Microservicio y Aplicación Web "Customers"

Solución técnica integral para la gestión de clientes y análisis demográfico de natalidad con **Spring Boot 3.3 (Java 17 LTS)**, **Oracle Database 23ai** y **React 18 + TypeScript + Vite + Tailwind CSS**.

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
                               │  - Exportación de clientes a formato CSV                 │
                               │  - Formulario modal con validaciones en caliente         │
                               │  - Dashboard de Indicadores de Natalidad con Recharts    │
                               │  - Servidor Web Nginx Alpine (Reverse Proxy /api/)       │
                               └──────────────────────────────────────────────────────────┘
                                                            │
                                                            │ REST JSON / Puerto 8080
                                                            ▼
                               ┌──────────────────────────────────────────────────────────┐
                               │          BACKEND MICROSERVICE (Spring Boot 3.3)          │
                               │  - Clean Architecture / Hexagonal / Layered DDD          │
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
                               │  - Pluggable Database (PDB): FREEPDB1                    │
                               └──────────────────────────────────────────────────────────┘
```

---

## 2. Tecnologías y Herramientas

| Componente | Tecnologías Utilizadas |
| :--- | :--- |
| **Backend** | Java 17 LTS, Spring Boot 3.3.4, Spring Data JPA, Jakarta Validation, Springdoc OpenAPI 2.6.0, Lombok, Maven 3.8+ |
| **Base de Datos** | Oracle Database 23ai Free, Driver oficial `com.oracle.database.jdbc:ojdbc11`, Dialecto `OracleDialect` |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide React, Axios, Vitest, React Testing Library |
| **DevOps / Despliegue** | Docker, Docker Compose, Nginx Alpine, Multi-stage builds con ejecución previa de pruebas unitarias |

---

## 3. Despliegue Automatizado con Docker Compose (Opción Recomendada)

> [!TIP]
> **Recomendación Principal:** Para evaluar o levantar todo el entorno completo de forma inmediata, se **recomienda utilizar esta opción (Punto 3)**. Únicamente vas a necesitar tener **Docker** instalado en tu equipo; no requerirás instalar manualmente Java, Maven, Node.js ni configurar Oracle Database por separado.

### 3.1 Especificaciones y Requisitos para el Despliegue con Docker
- **Software:** Docker Desktop (Windows/macOS) o Docker Engine con el plugin Compose (Linux).
- **Memoria RAM:** Mínimo **4 GB de RAM disponibles** en el sistema (el motor de Oracle Database 23ai requiere ~1.5 GB a 2 GB dedicados para su contenedor).
- **Espacio en Disco:** Mínimo **8 GB a 10 GB libres** (para la descarga de la imagen base de Oracle Free y las capas de compilación).
- **Puertos de Red Requeridos y Libres:**
  - `1521`: Puerto de escucha de Oracle Database (`FREEPDB1`).
  - `8080`: Puerto del microservicio Backend Spring Boot.
  - `3000`: Puerto de la aplicación web Frontend Nginx.

### 3.2 Comando de Despliegue
En la raíz del proyecto, ejecuta:

```bash
docker compose up --build
```

> **Garantía de Calidad en Dockerfiles:** Durante el proceso de construcción de las imágenes de Docker, se ejecutan automáticamente las suites de pruebas unitarias de Backend (`mvn test`) y Frontend (`npm run test`). La imagen solo se empaqueta y despliega si todas las pruebas pasan exitosamente.

### 3.3 URLs de Acceso
Una vez sincronizados los contenedores mediante sus *healthchecks*:
- **Frontend Web App:** [http://localhost:3000](http://localhost:3000)
- **Backend API & Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **Especificación OpenAPI (JSON):** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)
- **Oracle Database Connection:** `localhost:1521/FREEPDB1` (Usuario: `customers_user`, Contraseña: `customers_password`)

---

## 4. Ejecución en Entorno Local (Desarrollo sin Docker Compose)

Si prefieres compilar y ejecutar los componentes directamente en tu sistema operativo:

### 4.1 Especificaciones y Requisitos para el Entorno Local
- **Java Development Kit (JDK):** Versión **17 LTS** (o superior) debidamente configurada en la variable de entorno `JAVA_HOME` y accesible en el `PATH` (`java -version`).
- **Apache Maven:** Versión **3.8** o superior (`mvn -version`).
- **Node.js:** Versión **18 LTS** o superior (probado en Node v24.11) con su gestor de paquetes `npm` versión 9+ (`node -v` y `npm -v`).
- **Base de Datos Oracle:** Debes contar con una instancia activa de Oracle Database accesible en `localhost:1521/FREEPDB1` con usuario `customers_user` y contraseña `customers_password` (puedes levantar solo la BD mediante `docker run -d -p 1521:1521 -e ORACLE_PASSWORD=customers_password -e APP_USER=customers_user -e APP_USER_PASSWORD=customers_password gvenzl/oracle-free:slim`).
- **Puertos Libres:** `8080` (Backend) y `3000` (Frontend).

### 4.2 Paso 1: Ejecutar el Microservicio Backend (Spring Boot)
```bash
cd backend

# Ejecutar pruebas unitarias
mvn clean test

# Iniciar el microservicio
mvn spring-boot:run
```
El microservicio estará disponible en `http://localhost:8080` (Swagger UI en `/swagger-ui.html`).

### 4.3 Paso 2: Ejecutar la Aplicación Frontend (React + Vite)
En una nueva terminal:
```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar pruebas unitarias
npm run test

# Iniciar servidor de desarrollo
npm run dev
```
La aplicación web abrirá en `http://localhost:3000` y enviará las peticiones `/api/*` al backend mediante su proxy de desarrollo.

---

## 5. Endpoints de la API REST

| Método | Endpoint | Parámetros / Body | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/customers` | JSON con `firstName`, `lastName`, `email`, `dni`, `birthDate` | Registra un nuevo cliente con validación de DNI (8 dígitos), correo único y fecha de nacimiento en el pasado. |
| `GET` | `/api/v1/customers` | Query params: `dni`, `email`, `page`, `size`, `sortBy`, `sortDir` | Consulta clientes con filtros opcionales de búsqueda y paginación. |
| `GET` | `/api/v1/customers/indicators` | Ninguno | Calcula los indicadores de natalidad: nacidos por mes/año, período pico, período valle y distribución mensual porcentual. |

---

## 6. Pruebas Automatizadas

El proyecto incluye suites completas de pruebas automatizadas:

- **Backend (JUnit 5 + Mockito + MockMvc):**
  - Ubicación: `backend/src/test/java/com/challenge/customers/`
  - Ejecución: `mvn test`
  - Cobertura: Validaciones de campos obligatorios, detección de duplicados (DNI y Email), cálculo de mes pico y valle, tasa de natalidad y respuestas REST.
- **Frontend (Vitest + React Testing Library):**
  - Ubicación: `frontend/src/test/`
  - Ejecución: `npm run test`
  - Cobertura: Renderizado de la tabla de clientes, cálculo de edad, estados vacíos y validación de formulario de creación.

---

## 7. Entregables del Repositorio

- [x] Código fuente del microservicio Backend en Java 17 y Spring Boot.
- [x] Código fuente de la aplicación Frontend en React 18, TypeScript y Tailwind CSS.
- [x] Colección de Postman: `backend/customers-api.postman_collection.json`.
- [x] Script DDL para Oracle Database: `backend/src/main/resources/schema-oracle.sql`.
- [x] Archivos `README.md` detallados en la raíz, en `backend/` y en `frontend/`.
- [x] Dockerfiles multi-stage con ejecución de tests obligatorios antes del empaquetado.
- [x] Orquestación contenerizada completa en `docker-compose.yml`.
