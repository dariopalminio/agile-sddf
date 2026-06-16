---
type: plan
id: plan-06
slug: plan-06-isolate-workspace-by-story
title: "Aislar espacio de trabajo por historia"
status: COMPLETED
substatus: DONE
parent: EPIC-18
created: 2026-06-13
updated: 2026-06-13
related:
  - EPIC-18-complete-flow
---

# Plan: Aislar espacio de trabajo por historia

## Plan: Aislar espacio de trabajo por historia en story-implement

### Contexto

El skill `story-implement` escribe todos sus archivos intermedios bajo `.tmp/story-implement/` sin incluir el `{story_id}` en la ruta. Si dos agentes ejecutan el skill simultáneamente sobre historias distintas (FEAT-059 y FEAT-060, por ejemplo), sobreescriben los mismos archivos:

- `red-phase-status.json` — precondición crítica que desencadena la Fase GREEN
- `cycle-status.json` — estado final del ciclo TDD
- `{tipo}/results.json` — output de cada subagente de la Fase RED
- `green/{layer}/results.json` — output de cada subagente de la Fase GREEN
- `refactor/{layer}/results.json` — output de cada subagente de la Fase REFACTOR

La solución es insertar `{story_id}` en todas esas rutas, tal como ya se hace con los artefactos permanentes en `$SPECS_BASE/specs/stories/<FEAT-NNN>/`. El cambio es puramente estructural: no afecta la lógica del pipeline, solo la ruta donde cada ejecución escribe su estado.

### Archivo a modificar

`.claude/skills/story-implement/SKILL.md`

### Cambios requeridos (12 ocurrencias)

Reemplazar **`Story-implement/`** → **`.tmp/story-implement/{story_id}/`** en los siguientes fragmentos:

| Línea | Ruta actual | Ruta nueva |
|-------|-------------|------------|
| 268 | `.tmp/story-implement/{tipo}/results.json` | `.tmp/story-implement/{story_id}/{tipo}/results.json` |
| 301 | `.tmp/story-implement/red-phase-status.json` (título del bloque Paso 6) | `.tmp/story-implement/{story_id}/red-phase-status.json` |
| 364 | `.tmp/story-implement/red-phase-status.json` (Paso 7 lectura) | `.tmp/story-implement/{story_id}/red-phase-status.json` |
| 368 | `.tmp/story-implement/red-phase-status.json` (mensaje error) | `.tmp/story-implement/{story_id}/red-phase-status.json` |
| 478 | `.tmp/story-implement/green/{layer}/results.json` | `.tmp/story-implement/{story_id}/green/{layer}/results.json` |
| 596 | `.tmp/story-implement/refactor/{layer}/results.json` | `.tmp/story-implement/{story_id}/refactor/{layer}/results.json` |
| 720 | `.tmp/story-implement/cycle-status.json` (título bloque Paso 11e) | `.tmp/story-implement/{story_id}/cycle-status.json` |
| 745 | `.tmp/story-implement/cycle-status.json` (resumen --auto) | `.tmp/story-implement/{story_id}/cycle-status.json` |
| 761 | `.tmp/story-implement/cycle-status.json` (resumen interactive) | `.tmp/story-implement/{story_id}/cycle-status.json` |
| 787 | `.tmp/story-implement/red-phase-status.json` (tabla errores) | `.tmp/story-implement/{story_id}/red-phase-status.json` |
| 821 | `.tmp/story-implement/{tipo}/results.json` (sección arquitectura) | `.tmp/story-implement/{story_id}/{tipo}/results.json` |
| 822 | `.tmp/story-implement/{phase}/{layer}/results.json` (sección arquitectura) | `.tmp/story-implement/{story_id}/{phase}/{layer}/results.json` |
| 838 | `.tmp/story-implement/red-phase-status.json` (tabla salida) | `.tmp/story-implement/{story_id}/red-phase-status.json` |
| 839 | `.tmp/story-implement/cycle-status.json` (tabla salida) | `.tmp/story-implement/{story_id}/cycle-status.json` |
| 840 | `.tmp/story-implement/{tipo o fase/capa}/results.json` (tabla salida) | `.tmp/story-implement/{story_id}/{tipo o fase/capa}/results.json` |

> **Estrategia de edición:** usar `replace_all: true` con el patrón `.tmp/story-implement/` → `.tmp/story-implement/{story_id}/` cubre todas las ocurrencias en un solo Edit, ya que el segmento es único y consistente en todo el archivo.

### Verificación

Después del cambio, ejecutar:

```
grep -n "\.tmp/story-implement/" .claude/skills/story-implement/SKILL.md
```

Todas las líneas devueltas deben contener `{story_id}` inmediatamente después de `story-implement/`. No debe quedar ninguna ruta sin el identificador.


## Plan: Aislar espacio de trabajo por historia en story-code-review

### Contexto

El skill `story-code-review` escribe los informes intermedios de sus tres subagentes bajo `.tmp/story-code-review/` sin incluir `{story_id}` en la ruta. Si dos ejecuciones del skill corren simultáneamente sobre historias distintas, los reportes parciales de un agente sobreescriben los del otro:

- `.tmp/story-code-review/tech-lead-report.md`
- `.tmp/story-code-review/product-owner-report.md`
- `.tmp/story-code-review/integration-report.md`

Además, el Paso 3a limpia **todo** `.tmp/story-code-review/` al inicio de cada ejecución. Sin `{story_id}`, esa limpieza destruiría el workspace de una historia concurrente.

La solución es insertar `{story_id}` después de `story-code-review/` en todas las rutas, igual que la corrección ya aplicada a `story-implement`.

### Archivo a modificar

`.claude/skills/story-code-review/SKILL.md`

## Cambios requeridos (10 ocurrencias)

Aplicar `replace_all: true` con:
- **old:** `.tmp/story-code-review/`
- **new:** `.tmp/story-code-review/{story_id}/`

| Línea | Contexto |
|-------|----------|
| 26 | Bullet "Limpia `.tmp/story-code-review/`..." |
| 117 | Regla de idempotencia |
| 287 | Paso 3a — eliminar y recrear directorio temporal |
| 306 | Output del Tech-Lead-Reviewer |
| 310 | Output del Product-Owner-Reviewer |
| 314 | Output del Integration-Reviewer |
| 338 | Paso 4a — leer archivos de `.tmp/story-code-review/` |
| 636 | Tabla de salida — tech-lead-report.md |
| 637 | Tabla de salida — product-owner-report.md |
| 638 | Tabla de salida — integration-report.md |

> `.tmp/security-audit/audit-report.md` (línea 319 y 639) **no** se modifica — pertenece al skill `security-audit` y está fuera del alcance de este cambio.

### Verificación

Después del cambio:

```
grep -n "\.tmp/story-code-review/" .claude/skills/story-code-review/SKILL.md
```

Todas las líneas devueltas deben contener `{story_id}` inmediatamente después de `story-code-review/`.

## Plan: Auditoría de aislamiento `.tmp/` por historia en todos los skills

### Contexto

Tras aplicar `{story_id}` en `story-implement` y `story-code-review`, el usuario pregunta si existen otros skills con el mismo problema. Se realizó un grep de `.tmp/` en todos los SKILL.md para identificar qué skills escriben en rutas compartidas.


### ❌ Necesitan corrección

#### 1. `story-verify` (5 ocurrencias)

Skill de nivel historia que escribe `.tmp/story-verify/` sin incluir `{story_id}`.

Rutas afectadas:
- `.tmp/story-verify/qa-input.json`
- `.tmp/story-verify/qa-output.json`
- Directorio base `.tmp/story-verify/` (creación y error)

**Fix:** `replace_all` de `.tmp/story-verify/` → `.tmp/story-verify/{story_id}/`

**Archivo:** `.claude/skills/story-verify/SKILL.md`

---

#### 2. `security-audit` (múltiples ocurrencias — complejidad media)

Skill invocado **standalone** (`security-audit --repo $SDDF_ROOT`) y desde `story-code-review` (`security-audit --repo $SDDF_ROOT --story $STORY_DIR`). Escribe en `.tmp/security-audit/` sin aislamiento:

- `.tmp/security-audit/project-context.json`
- `.tmp/security-audit/active-rules.json`
- `.tmp/security-audit/rule-results.json`
- `.tmp/security-audit/audit-report.md` / `audit-report.json`

El colisión real ocurre cuando `story-code-review` invoca `security-audit` para FEAT-059 y FEAT-060 en paralelo: ambas ejecuciones de `security-audit` sobreescriben los mismos archivos.

**Fix:** usar `{story_id}` cuando el skill es invocado con `--story`, y mantener `.tmp/security-audit/` para invocaciones standalone. 

Esto requiere que `security-audit` detecte si recibió `--story` y construya la ruta como:
- Con `--story`: `.tmp/security-audit/{story_id}/`  
- Sin `--story` (standalone): `.tmp/security-audit/` (sin cambio)

El `{story_id}` se extrae del basename del path en `--story $STORY_DIR` (ej. `FEAT-059-login-flow` → prefijo `FEAT-059`).

**Archivo:** `.claude/skills/security-audit/SKILL.md`

---

### ℹ️ Diferente tipo de concurrencia (fuera de alcance "por historia")

| Skill | Rutas `.tmp/` | Observación |
|-------|---------------|-------------|
| `reverse-engineering` | `.tmp/rfc-*.md` | Skill de nivel proyecto. No trabaja por historia; la clave de aislamiento sería el proyecto, no `{story_id}`. Colisión solo si dos reverse-engineering del mismo repo se lanzan en paralelo — escenario improbable. |

---

### Orden recomendado de implementación

1. **`story-verify`** — corrección simple, mismo patrón que `story-implement`
2. **`security-audit`** — requiere lógica condicional según si recibe `--story` o no

### Verificación

Después de ambas correcciones:

```
grep -n "\.tmp/story-verify/" .claude/skills/story-verify/SKILL.md
grep -n "\.tmp/security-audit/" .claude/skills/security-audit/SKILL.md
```

Para `story-verify`: todas las líneas deben tener `{story_id}`.
Para `security-audit`: las líneas del flujo condicional deben mostrar `{story_id}` cuando `--story` está presente; la ruta base sin `{story_id}` solo en el bloque standalone.
