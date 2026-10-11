# Test Case 01 — Épica mínima (modo --quick)

**Descripción:** El usuario invoca el skill con `--quick`. Se completan las cinco secciones obligatorias del template v2; la sección de clave `notas` es opcional en contenido y el usuario responde "ninguna".

---

## Input del usuario

```
/epic-creation --quick
```

---

## Flujo esperado

### Fase 0 — Modo de ejecución
- Se detecta `--quick` → `QUICK_MODE=true`
- Prompt: "¿Cómo se llama la épica?"
- Usuario responde: `"Autenticación básica"`
- Slug derivado: `autenticacion-basica`
- Se sugiere `EPIC-01` (no hay épicas previas); el usuario acepta
- Ruta de salida: `$SPECS_BASE/specs/epics/EPIC-01-autenticacion-basica/epic.md`
- El directorio no existe → continuar

### Fase 1 — Leer template
- Se lee `$SPECS_BASE/templates/epic-template.md`
- Contrato extraído (título · clave), todas obligatorias: `Alcance · alcance`, `Historias · historias`, `Criterios de salida · criterios-salida`, `Smoke tests · smoke-tests`, `Notas · notas` (contenido opcional)
- Secciones opcionales: ninguna

### Fase 2 — Frontmatter
| Campo | Valor ingresado |
|---|---|
| type | `epic` (fijo) |
| id | `EPIC-01` (del Paso 1) |
| title | "Autenticación básica" (aceptado) |
| status | `DEFINE` (default aceptado) |
| substatus | `TODO` (default aceptado) |
| created | 2026-05-01 (fecha de hoy, aceptada) |
| updated | 2026-05-01 (igual a `created` en la creación inicial) |
| slug | `EPIC-01-autenticacion-basica` (confirmado) |

### Fase 3 — Secciones obligatorias (una pregunta por sección con su título y su guía)
- **Alcance:** "Login y registro de usuarios con email y contraseña."
- **Historias** (clave `historias`, se escriben en F1, sin IDs):
  - `Registro de usuario: permite crear cuenta con email y contraseña`
  - `Login: permite iniciar sesión con credenciales válidas`
  - `Logout: permite cerrar la sesión activa`
- **Criterios de salida:** "Los tres flujos tienen tests automatizados en verde"
- **Smoke tests** (clave `smoke-tests`): `Login exitoso` — Dado un usuario registrado / Cuando inicia sesión con credenciales correctas / Entonces accede al sistema
- **Notas:** "ninguna" → queda solo el encabezado

### Fase 4 — Archivo generado
```
docs/specs/epics/EPIC-01-autenticacion-basica/epic.md
```

### Fase 5 — Validación
- `epic-format-validation` retorna **APROBADO**

---

## Output esperado del archivo

````markdown
---
type: epic
id: EPIC-01
slug: EPIC-01-autenticacion-basica
title: "Autenticación básica"
status: DEFINE
substatus: TODO
parent: null
created: 2026-05-01
updated: 2026-05-01
related: []
---

# Épica: Autenticación básica

## Alcance
Login y registro de usuarios con email y contraseña.

## Historias
- Registro de usuario: permite crear cuenta con email y contraseña
- Login: permite iniciar sesión con credenciales válidas
- Logout: permite cerrar la sesión activa

## Criterios de salida
- [ ] Los tres flujos tienen tests automatizados en verde

## Smoke tests
### SMOKE-1 — Login exitoso
```gherkin
Escenario: Login exitoso
  Dado un usuario registrado
  Cuando inicia sesión con credenciales correctas
  Entonces accede al sistema
```

## Notas
````

---

## Criterios de éxito del test

- [ ] El skill no pidió IDs de historia y escribió las historias en F1 (sin checkbox ni `STORY-NNN`)
- [ ] El smoke test quedó como `### SMOKE-1 — …` con bloque `gherkin`
- [ ] Los encabezados no llevan los comentarios `<!-- sección … -->` del template
- [ ] `epic-format-validation` retorna APROBADO sin refinamiento
