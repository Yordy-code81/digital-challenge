import '@testing-library/jest-dom';

// Mock de ResizeObserver para componentes gráficos como Recharts
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
