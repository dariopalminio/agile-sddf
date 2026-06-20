# Test Case 01 — Release mínimo (modo --quick)

**Descripción:** El usuario invoca el skill con `--quick`. Solo se completan las secciones obligatorias. Las secciones opcionales se omiten sin preguntar.

---

## Input del usuario

```
/release-creation --quick
```

---

## Flujo esperado

### Fase 0 — Modo de ejecución
- Se detecta `--quick` → `QUICK_MODE=true`
- Prompt: "¿Cómo se llama el release o épica?"
- Usuario responde: `"Autenticación básica"`
- Slug derivado: `autenticacion-basica`
- Prompt: "¿Identificador de épica?" (se sugiere `EPIC-01` si no hay releases previos)
- Usuario acepta: `EPIC-01`
- Ruta de salida: `$SPECS_BASE/specs/releases/EPIC-01-autenticacion-basica/release.md`
- El directorio no existe → continuar

### Fase 1 — Leer template
- Se lee `$SPECS_BASE/specs/templates/release-spec-template.md`
- Secciones obligatorias extraídas: `Descripción`, `Features`, `Flujos Críticos / Smoke Tests`
- Secciones opcionales extraídas: `Requerimiento`, `Impacto en Procesos Claves`, `Dependencias Críticas`, `Riesgos`, `Criterios de éxito`, `Notas adicionales`

### Fase 2 — Frontmatter
| Campo | Valor ingresado |
|---|---|
| title | "Autenticación básica" (aceptado) |
| date | 2026-05-01 (fecha de hoy, aceptada) |
| status | BACKLOG (default aceptado) |
| substatus | IN‑PROGRESS (default aceptado) |
| slug | `autenticacion-basica` (confirmado) |

### Fase 3 — Secciones obligatorias
- **Descripción:** "Implementa el sistema de login y registro de usuarios con email y contraseña. Resuelve la necesidad de autenticación segura como base del sistema."
- **Features:**
  - `FEAT-001 - Registro de usuario: Permite crear cuenta con email y contraseña`
  - `FEAT-002 - Login: Permite iniciar sesión con credenciales válidas`
  - `FEAT-003 - Logout: Permite cerrar sesión activa`
- **Flujos Críticos / Smoke Tests:**
  - Escenario 1: Login exitoso — DADO usuario registrado / CUANDO intenta hacer login con credenciales correctas / ENTONCES accede al sistema

### Fase 4 — Secciones opcionales
- **OMITIDAS** (QUICK_MODE=true) — no se formulan preguntas

### Fase 5 — Archivo generado
```
docs/specs/releases/EPIC-01-autenticacion-basica/release.md
```

### Fase 6 — Validación
- `release-format-validation` retorna **APROBADO**

---

## Output esperado del archivo

```markdown
---
alwaysApply: false
type: spec
slug: autenticacion-basica
title: "Autenticación básica"
date: 2026-05-01
status: BACKLOG
substatus: IN‑PROGRESS
parent: null
---

# Release/Epic: Autenticación básica

## Descripción
Implementa el sistema de login y registro de usuarios con email y contraseña. Resuelve la necesidad de autenticación segura como base del sistema.

## Features
- [ ] FEAT-001 - **Registro de usuario:** Permite crear cuenta con email y contraseña
- [ ] FEAT-002 - **Login:** Permite iniciar sesión con credenciales válidas
- [ ] FEAT-003 - **Logout:** Permite cerrar sesión activa

## Flujos Críticos / Smoke Tests
*Si alguno de estos falla, se debe detener el despliegue (o se debe hacer rollback automático).*

### Escenario 1: Login exitoso
**DADO** usuario registrado  
**CUANDO** intenta hacer login con credenciales correctas  
**ENTONCES** accede al sistema
```

---

## Criterios de éxito del test

- [ ] El skill no formuló preguntas sobre secciones opcionales
- [ ] El archivo generado contiene frontmatter completo
- [ ] El archivo contiene las 3 secciones obligatorias con contenido
- [ ] `release-format-validation` retorna APROBADO sin refinamiento
