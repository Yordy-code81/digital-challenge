# ==============================================================================
# Multi-stage Dockerfile para el Microservicio Customers (Spring Boot 3 + Java 17)
# ==============================================================================

# Etapa 1: Compilación y empaquetado con Maven
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copiar descriptor de dependencias para aprovechar la cache de capas Docker
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar código fuente y compilar artefacto JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Imagen ligera de ejecución basada en JRE Alpine
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Crear usuario sin privilegios root por seguridad (Hardening)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copiar el jar empaquetado desde la etapa de compilación
COPY --from=builder /app/target/customers-microservice-*.jar app.jar

# Variables de entorno y puerto de exposición
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
