---
alwaysApply: false
type: constitution
slug: constitution
title: "Constitución del Proyecto"
created: 2026-05-06
updated: 2026-05-06
---

# Constitución del Proyecto

> Este documento establece los principios técnicos inamovibles del proyecto. Es la fuente de verdad para todos los agentes IA y miembros del equipo. Todo lo que aquí se define debe respetarse en el diseño e implementación de cualquier historia.

---

## 🧱 Stack Tecnológico

### Lenguaje principal

- **Lenguaje:** TypeScript 5.x
- **Runtime / Entorno:** Node.js 20 LTS

### Frameworks y librerías core

- **Next.js:** 14.x — framework full-stack (App Router)
- **Prisma:** 5.x — ORM para acceso a base de datos
- **Zod:** 3.x — validación de esquemas en runtime
- **Tailwind CSS:** 3.x — estilos utilitarios

### Infraestructura y despliegue

- **Base de datos:** PostgreSQL 16
- **Cloud / Hosting:** Vercel (frontend + API routes)
- **Contenedores:** Docker + docker-compose para entorno local
- **CI/CD:** GitHub Actions

---

## 📐 Convenciones de Código

### Estilo y formato

- **Formateador:** Prettier (configuración en `.prettierrc`)
- **Linter:** ESLint con `@typescript-eslint`
- **Convención de nombres:** camelCase para variables/funciones, PascalCase para componentes y tipos, kebab-case para archivos
- **Longitud máxima de línea:** 100 caracteres

### Organización del código

- **Estructura de directorios:**
  ```
  src/
    app/         # rutas Next.js (App Router)
    components/  # componentes React reutilizables
    lib/         # utilidades y lógica de negocio
    server/      # lógica server-side (acciones, queries)
    types/       # tipos TypeScript compartidos
  ```
- **Convención de imports:** agrupados: Node.js → externos → internos (`@/`)
- **Tamaño máximo de función:** 40 líneas; extraer si se supera

### Control de versiones

- **Branch principal:** `main`
- **Estrategia de branching:** Conventional Branch: `main → release/X → feat/X`
- **Formato de commits:** Conventional Commits: `feat/fix/chore/docs/refactor/test`
- **Pull requests:** se requiere al menos 1 aprobación + CI verde (build + tests + lint)

---

## 📝 Estándares de Documentación

### Código

- **Comentarios:** solo cuando el WHY no es obvio; jamás comentar el QUÉ
- **JSDoc:** obligatorio en funciones públicas de `lib/` y `server/`; no requerido en componentes
- **README:** actualizar la sección "Instalación" y "Variables de entorno" con cada feature que las modifique

### Decisiones técnicas

- **ADRs:** se registran en `docs/adr/` para decisiones arquitectónicas que afecten múltiples módulos
- **Diseño de features:** usando `design.md` del workflow SDD antes de implementar cualquier historia > 4 horas estimadas

---

## 🏗️ Metodologías de Diseño y Desarrollo

### Proceso de desarrollo

- **Metodología:** SDD (Spec-Driven Development) — flujo `story → design → tasks → implement`
- **Testing:** TDD — los tests se escriben antes del código de producción; cobertura mínima 80% en `lib/` y `server/`
- **Code review:** self-review para cambios < 100 líneas; peer review para cambios mayores o que afecten APIs públicas

### Patrones de arquitectura

- **Patrón principal:** Feature-based architecture (módulos por dominio en `src/`)
- **Gestión de estado:** React Query para estado del servidor; Zustand para estado UI global mínimo
- **Comunicación entre módulos:** a través de Server Actions de Next.js para mutaciones; no llamadas directas entre módulos de dominio

### Restricciones de diseño

- No duplicar lógica de validación: Zod es la única fuente de verdad para schemas
- No usar `any` en TypeScript excepto en adaptadores de terceros con tipos incorrectos
- Toda operación de base de datos pasa por `server/` — los componentes nunca acceden a Prisma directamente

---

## ✅ Principios Técnicos Inamovibles

1. **Type safety end-to-end:** el sistema usa TypeScript estricto (`strict: true`) en toda la codebase; no se aceptan castings inseguros ni `@ts-ignore` sin justificación documentada.
2. **Server-first:** la lógica de negocio vive en el servidor; el cliente solo renderiza y captura input.
3. **Seguridad por defecto:** toda entrada de usuario se valida con Zod antes de procesarse; toda query parametrizada vía Prisma (sin SQL raw salvo que sea necesario y revisado).

---

## 📎 Notas adicionales

- Las variables de entorno se documentan en `.env.example` — nunca exponer valores reales en el repositorio.
- En producción usar solo `npm ci` (no `npm install`) para reproducibilidad garantizada.
