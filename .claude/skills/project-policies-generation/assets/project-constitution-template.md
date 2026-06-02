---
alwaysApply: false
type: constitution
slug: constitution
title: "Constitución del Proyecto"
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
---

# Constitución del Proyecto

> Este documento establece los principios técnicos inamovibles del proyecto. Es la fuente de verdad para todos los agentes IA y miembros del equipo. Todo lo que aquí se define debe respetarse en el diseño e implementación de cualquier historia.

---

## 🧱 Stack Tecnológico

<!-- Define el stack técnico del proyecto. Sé específico: lenguaje, versión, frameworks, runtime. -->

### Lenguaje principal

- **Lenguaje:** [ej. TypeScript 5.x / Python 3.12 / Go 1.22]
- **Runtime / Entorno:** [ej. Node.js 20 LTS / CPython / GVM]

### Frameworks y librerías core

- **[Nombre]:** [versión] — [propósito]
- **[Nombre]:** [versión] — [propósito]

### Infraestructura y despliegue

- **Base de datos:** [ej. PostgreSQL 16 / MongoDB 7 / SQLite]
- **Cloud / Hosting:** [ej. AWS / GCP / Vercel / self-hosted]
- **Contenedores:** [ej. Docker + docker-compose / Kubernetes]
- **CI/CD:** [ej. GitHub Actions / GitLab CI]

---

## 📐 Convenciones de Código

<!-- Define las reglas de estilo y formato que todo el código debe seguir. -->

### Estilo y formato

- **Formateador:** [ej. Prettier / Black / gofmt]
- **Linter:** [ej. ESLint / Ruff / golangci-lint]
- **Convención de nombres:** [ej. camelCase para variables, PascalCase para clases, kebab-case para archivos]
- **Longitud máxima de línea:** [ej. 100 caracteres]

### Organización del código

- **Estructura de directorios:** [describe la organización de módulos/paquetes]
- **Convención de imports:** [ej. imports agrupados: estándar → externos → internos]
- **Tamaño máximo de función:** [ej. 50 líneas / sin límite estricto]

### Control de versiones

- **Branch principal:** `main`
- **Estrategia de branching:** [ej. Conventional Branch: main → release/X → feat/X]
- **Formato de commits:** [ej. Conventional Commits: feat/fix/chore/docs/refactor]
- **Pull requests:** [ej. se requiere al menos 1 aprobación + CI verde]

---

## 📝 Estándares de Documentación

<!-- Define qué debe documentarse y cómo. -->

### Código

- **Comentarios:** [ej. solo cuando el WHY no es obvio; no comentar el QUÉ]
- **Docstrings / JSDoc:** [ej. obligatorio en funciones públicas / no requerido]
- **README:** [ej. actualizar con cada feature significativa]

### Decisiones técnicas

- **ADRs (Architecture Decision Records):** [ej. se registran en docs/adr/ para decisiones arquitectónicas relevantes]
- **Diseño de features:** [ej. usando design.md del workflow SDD antes de implementar]

---

## 🏗️ Metodologías de Diseño y Desarrollo

<!-- Define el proceso que el equipo sigue para diseñar e implementar. -->

### Proceso de desarrollo

- **Metodología:** [ej. SDD (Spec-Driven Development) con workflow story → design → tasks → implement]
- **Testing:** [ej. TDD — tests primero, código después; cobertura mínima 80%]
- **Code review:** [ej. pair review para cambios críticos; self-review para cambios menores]

### Patrones de arquitectura

- **Patrón principal:** [ej. Clean Architecture / Hexagonal / MVC / serverless]
- **Gestión de estado:** [ej. Redux / Zustand / Context API / ninguno]
- **Comunicación entre módulos:** [ej. eventos / llamadas directas / message bus]

### Restricciones de diseño

- [ej. No usar ORMs — queries SQL directas para mayor control]
- [ej. No dependencias circulares entre módulos]
- [ej. Toda operación de I/O debe ser asíncrona]

---

## ✅ Principios Técnicos Inamovibles

<!-- Lista los principios que NO pueden violarse bajo ninguna circunstancia. -->

1. **[Principio 1]:** [descripción y razón]
2. **[Principio 2]:** [descripción y razón]
3. **[Principio 3]:** [descripción y razón]

---

## 📎 Notas adicionales

<!-- Cualquier regla técnica que no encaja en las secciones anteriores. -->

[Por completar]
