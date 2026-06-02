# Constitution – [Nombre del Proyecto]
<!--
  ⚠️ Este archivo es la CONSTITUCIÓN del proyecto.
  Contiene principios no negociables, stack tecnológico y reglas de gobernanza.
  Debe ser completado por el agente SDDF durante la fase inicial del proyecto.
  Los placeholders entre corchetes [ ] deben ser reemplazados.
  Los comentarios <!-- --> contienen instrucciones para el agente o explicaciones.
-->

## 📜 Purpose

Este documento sirve como fuente de la verdad (**single source of truth (SSOT)**) tanto para **agentes de IA** como para **desarrolladores humanos** que trabajan en este proyecto.

## 1. Principios Fundamentales (NON‑NEGOTIABLE)

<!-- Define los valores inquebrantables que guían cada decisión técnica. -->

- **Idioma:** Español para nosotros, inglés para el mundo.
- **Seguridad primero:** Nunca comprometer datos del usuario. Cualquier cambio que introduzca una vulnerabilidad conocida será rechazado.
- **Pruebas como contrato:** Cada funcionalidad debe tener pruebas automáticas (unitarias o de integración) antes de fusionarse a `main`.
- **Diseño robusto:** Diseñe software con alta cohesión y bajo acoplamiento.
- **Principio DRY:** Evitar repetir código sin motivo.
- **Principio KISS:** Mantener el código lo más sencillo posible y preferir soluciones simples y rápidas ante alternativas rebuscadas.
- **Principio YAGNI:** Eliminar lo innecesario.
- **Legibilidad:** Escriba código "legible" para humanos, fácil de entender y modificar, antes que conciso o complicado.
- **AI-Friendly Codebase:** Escribir código que sea fácil de entender y modificar por agentes de IA, evitando complejidades innecesarias y siguiendo convenciones claras.
- **Evitar Hard-Coded:** Utilizar constantes (o variables) con nombre en lugar de valores predefinidos.
- **Nombres significativos:** Utilice nombres significativos y descriptivos.
- **Comentarios significativos:** Utilice comentarios con moderación y, cuando lo haga, que sean significativos.
- **Funciones cortas:** Escriba funciones cortas que solo hagan una cosa (alta cohesión).
- **Encapsulamiento de condicionales:** Encapsular condicionales anidados en funciones.
- **Refactorización continua:** Refactorizar continuamente para la mejora de código continua.
- **Fail Fast:** Aplicar el principio Fail Fast (o "Fallar Rápido") usando Guard Clauses (Cláusulas de Guarda) en secuencias de if.
- **Test Obligatorio:** Todas las funcionalidades deben tener pruebas automáticas antes de ser consideradas completas.

<!-- Puedes añadir o modificar principios según la naturaleza del proyecto. -->

---

## 2. Stack Tecnológico

### 2.1 Obligatorio (NON‑NEGOTIABLE)
<!-- Estas tecnologías NO pueden ser cambiadas sin modificar la constitución. -->
- **Framework:** [Next.js 15 con App Router] <!-- El agente debe preguntar el framework preferido y sugerir según el proyecto existente. -->
- **Lenguaje:** [TypeScript 5 con modo estricto activado] <!-- Ejemplo: TypeScript, Python 3.11, Go 1.22, etc. -->

### 2.2 Estándar (si el usuario no especifica preferencia)
<!-- El agente debe preguntar al usuario y/o autocompletar según el proyecto existente. -->
- **Estilos:** [CSS plano + Zero-Runtime Styling/Tailwind CSS 4 con shadcn/ui (estilo New York)].
- **Base de datos:** [Prisma ORM con SQLite (solo desarrollo local). Para producción se usará PostgreSQL].
- **Autenticación:** [NextAuth.js v4].
- **Manejo de estado:** [Zustand (cliente) + TanStack Query (servidor)].

### 2.3 Test Obligatorio (NON‑NEGOTIABLE)
- **Unit Testing:** [Vitest para pruebas unitarias y de integración].
- **End-to-End Testing:** [Playwright/Cypress para pruebas end-to-end].


> Cualquier paquete adicional debe justificarse en `docs/decisions/adr-XXX.md`.

<!-- El agente puede añadir más categorías: logging, etc. -->

---

## 3. Estándares de Código

<!-- El código debe seguir estándares de código. Reglas de estilo, nomenclatura, formato y manejo de errores. -->

- **Formato:** [Prettier con configuración por defecto].
- **Nombres:** [`camelCase` para variables/funciones, `PascalCase` para componentes/clases].
- **Comentarios:** [Solo para lógica compleja o decisiones no obvias. No comentar código evidente].
- **Manejo de errores:** [Usar `try/catch` con logs estructurados; nunca mostrar detalles internos al usuario].
- **Testing IDs como API pública:** [Si se exponen IDs de elementos para testing ("data-testid"), tratarlos como parte de la API pública y mantenerlos estables].

<!-- Puedes añadir reglas específicas de linting, complejidad ciclomática, etc. -->

---

## 4. Gestión de Datos y Persistencia

- **Modelado:** [Siempre definir esquemas en Prisma/ANCII/PantUML antes de escribir código que los use].
- **Migraciones:** [Generar y aplicar migraciones locales; en producción solo mediante CI].
- **Caché:** [No implementar caché propia a menos que se mida una mejora real de rendimiento].

<!-- Adaptar si no se usa Prisma o se emplea otra base de datos. -->

---

## 5. Seguridad y Privacidad (NON‑NEGOTIABLE)

- **Secretos:** [Usar variables de entorno; nunca commitear `.env`, claves o tokens].
- **Logs:** [No registrar información sensible (contraseñas, tokens, datos personales)].
- **Dependencias:** [Mantener actualizadas las librerías; ejecutar `npm audit` semanalmente].

<!-- Cumplimiento normativo: si aplica GDPR, HIPAA, etc., añadir sección específica. -->

---

## 6. Control de Versiones (Git)

- **Ramas (modo `batch`):** `main` (producción), `release/*` (pre‑producción), `feat/*` (nuevas características).
- **Ramas (modo `continuous`):** `main` (producción), `feat/*` (nuevas características).
- **Conventional Commits:** Usar `feat:`, `fix:`, `docs:`, `chore:`, etc.
- **PRs:** [Requerir al menos un revisor y que pasen todas las pruebas].
- **Versionado:** Incrementar la versión según SemVer (major = cambio incompatible, minor = nueva sección, patch = corrección tipográfica).

<!-- La estrategia de branching puede variar según el modelo de entrega (continuous vs batch). -->

---

## 7. UI/UX Estándar (para proyectos con interfaz)

- **Accesibilidad:** [Cumplir WCAG 2.1 nivel AA].
- **Componentes:** [Preferir shadcn/ui; no reinventar rueda].
- **Diseño responsive:** [Todas las pantallas deben funcionar desde 320px hasta 1920px].

<!-- Si el proyecto no tiene interfaz gráfica, esta sección puede eliminarse. -->

---

## 8. Gobernanza de esta Constitución

- **Modificaciones:** [Cualquier cambio debe ser aprobado por al menos dos miembros del equipo (incluyendo un líder técnico)].
- **Historial:** [Guardar versiones anteriores en `docs/constitution/vX.Y.Z.md` si es necesario].

---

**Este documento es la base de todas las decisiones técnicas. Si hay conflicto entre esta constitución y cualquier otra guía, prevalece esta.**
