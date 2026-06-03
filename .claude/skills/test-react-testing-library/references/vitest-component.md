# Vitest para Componentes React

Vitest for testing React components. Covers configuration, mocks, coverage, and specific patterns from the Testing Library (render, userEvent, axe).
USAR CUANDO: se escribe o modifica `vitest.config.ts`, se usan `vi.fn`, `vi.mock`, cobertura, o se necesita estructurar tests de componentes con `describe`/`it`.

> **Complement to**: `testing-library`, `happy-dom`, `axe-core`.

## Configuración mínima

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,                // describe, it, expect globales
    environment: 'happy-dom',     // entorno DOM rápido
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: { lines: 80, functions: 80, branches: 75 },
    },
  },
});
```

```typescript
// vitest.setup.ts (solo lo estrictamente Vitest)
import '@testing-library/jest-dom/vitest'; // aserciones adicionales
```

## Patrones frecuentes

### Mocks de funciones y módulos

```typescript
// Mock de función
const onClick = vi.fn();
expect(onClick).toHaveBeenCalledTimes(1);
expect(onClick).toHaveBeenCalledWith('arg');

// Mock de módulo (ej. hook o servicio)
vi.mock('@/api/client', () => ({
  fetchData: vi.fn().mockResolvedValue({ data: [] }),
}));

// Reset entre tests
beforeEach(() => vi.clearAllMocks());
```

### Aserciones asíncronas (cuando el componente hace fetch)

```typescript
it('carga datos y los muestra', async () => {
  render(<UserList />);
  expect(await screen.findByText('Usuario 1')).toBeInTheDocument();
});
```

### Cobertura en librería de componentes

```json
// package.json
{
  "scripts": {
    "test:coverage": "vitest run --coverage"
  }
}
```

## Anti‑patrones comunes (desde la óptica de Vitest)

| ❌ Anti‑patrón | ✅ Solución |
|----------------|--------------|
| `vi.mock` fuera del alcance del test (hoisting) | Colocar `vi.mock` al inicio, antes de los imports. |
| Olvidar `await` en `userEvent` o `findBy*` | Siempre `await` en operaciones asíncronas. |
| No limpiar mocks entre tests | `vi.clearAllMocks()` en `beforeEach`. |
| Probar implementación interna (`wrapper.instance().method`) | Usar `getByRole`, `userEvent`, etc. (delegar a skill de Testing Library). |

## Comandos útiles

```bash
pnpm test                # modo watch (desarrollo)
pnpm test:ci             # ejecución única (CI)
pnpm test:coverage       # cobertura
pnpm test -- --ui        # interfaz gráfica (opcional)
```

---


