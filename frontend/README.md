# Customers Web App - Frontend

Aplicación Web moderna para la gestión de clientes y análisis de natalidad desarrollada en **React 18**, **TypeScript**, **Vite** y estilización con **Tailwind CSS**.

---

## 1. Características Técnicas

- **Framework & Bundler:** React 18 + Vite para arranque instantáneo y Hot Module Replacement (HMR).
- **Tipado Estricto:** TypeScript estricto compartiendo contratos con la API de Spring Boot.
- **Estilos & Diseño:** Tailwind CSS configurado con paleta corporativa y diseño limpio, responsivo y accesible.
- **Visualización de Datos:** Recharts para gráficos interactivos (Barras de natalidad por período mes/año y Curvas de tasa mensual acumulada).
- **Iconografía:** Lucide React para interfaz moderna.
- **Filtros Reactivos:** Búsqueda en tiempo real por DNI y Correo Electrónico con efecto *debounce*.
- **Exportación CSV:** Funcionalidad integrada para descargar los clientes en formato `.csv`.
- **Validación Robusta:** Validación visual de formularios en el cliente y captura de errores RFC 7807 del backend.
- **Testing:** Vitest + React Testing Library con soporte JSDOM.

---

## 2. Requisitos Previos

- **Node.js 18+** (Probado en Node.js v24.11)
- **npm** (o yarn)

---

## 3. Instalación y Ejecución Local

```bash
# 1. Ingresar al directorio frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo en http://localhost:3000
npm run dev
```

El servidor proxy redirige automáticamente las peticiones `/api/*` al microservicio backend en `http://localhost:8080`.

---

## 4. Ejecución de Pruebas Unitarias

Para correr las pruebas unitarias automatizadas con Vitest:

```bash
npm run test
```

Suite de pruebas:
- `CustomerTable.test.tsx`: Verifica el renderizado de clientes, iniciales, edad calculada y estado vacío.
- `CustomerCreateModal.test.tsx`: Verifica la validación de campos obligatorios y formato de DNI antes de enviar el formulario.

---

## 5. Compilación para Producción

```bash
npm run build
```

Genera los archivos optimizados listos para producción en el directorio `dist/`.
