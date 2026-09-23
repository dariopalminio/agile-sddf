---
type: story
id: STORY-101
slug: STORY-101-dod-story-por-etapa
title: "Dividir el DoD de Story en un guardrail por etapa, referenciado explícitamente por cada skill"
status: SPECIFY
substatus: IN-PROGRESS
kind: feat
parent: EPIC-20-memory-system
created: 2026-09-23
updated: 2026-09-23
related: none
---

# STORY-101: Dividir el DoD de Story en un guardrail por etapa, referenciado explícitamente por cada skill

---

## 📖 Historia

**Como** mantenedor del framework SDDF que quiere un DoD eficiente y mantenible,  
**Quiero** dividir `dod-story-checklist.md` en un archivo `dod-story-<stage>.md` por etapa, con **referencia explícita desde el SKILL.md de cada skill** (Opción A) y un **mapeo opcional en `sddf.config.yaml`** que permita overrides por proyecto (Opción C),  
**Para** reducir el consumo de tokens, aislar el mantenimiento por etapa, permitir `enforcement` granular, corregir el orden del pipeline y alinear el DoD con el patrón `guardrails/` (un guardrail por archivo, per ADR-0001/0007).

---

## ✅ Criterios de aceptación

### Escenario principal – División en un archivo por etapa

```gherkin
Dado el archivo monolítico `docs/guardrails/dod-story-checklist.md`
Cuando se ejecuta la migración
Entonces existen los siguientes archivos en `docs/guardrails/`:
  · dod-story-specify.md
  · dod-story-plan.md
  · dod-story-implement.md
  · dod-story-code-review.md
  · dod-story-verify.md
  · dod-story-acceptance.md
  · dod-story-release.md
 Y cada archivo declara en su frontmatter:
  · type: guardrail
  · kind: transition
  · enforcement: error | warn (según la etapa)
  · from: <estado origen>
  · to: <estado destino>
  · applies-to: story
 Y cada archivo es autocontenido: un solo criterio de transición, sin mezclar etapas
```

### Escenario principal – Cada skill referencia explícitamente su DoD (Opción A)

```gherkin
Dado el skill `story-implement`
Cuando se inspecciona su `SKILL.md`
Entonces contiene una sección "## DoD aplicable" con la ruta explícita:
  `docs/guardrails/dod-story-implement.md`
 Y esa misma sección existe en cada uno de los 7 skills de Story:
  · story-specify      → dod-story-specify.md
  · story-plan         → dod-story-plan.md
  · story-implement    → dod-story-implement.md
  · story-code-review  → dod-story-code-review.md
  · story-verify       → dod-story-verify.md
  · story-acceptance   → dod-story-acceptance.md
  · story-release      → dod-story-release.md
 Y ningún SKILL.md referencia el archivo monolítico `dod-story-checklist.md`
```

### Escenario principal – Mapeo centralizado en `sddf.config.yaml` (Opción C)

```gherkin
Dado el archivo `sddf.config.yaml`
Cuando se inspecciona su sección `guardrails`
Entonces contiene el mapeo completo:
  guardrails:
    dod:
      story:
        specify:      dod-story-specify
        plan:         dod-story-plan
        implement:    dod-story-implement
        code-review:  dod-story-code-review
        verify:       dod-story-verify
        acceptance:   dod-story-acceptance
        release:      dod-story-release
 Y cada skill lee la ruta desde `sddf.config.yaml` con fallback a la convención por nombre
 Y un proyecto consumidor puede sobrescribir el mapeo sin tocar los skills
```

### Escenario principal – Orden del pipeline corregido

```gherkin
Dado el contenido de la sección VERIFY del archivo monolítico original
Cuando se migra a `dod-story-verify.md`
Entonces el archivo declara `from: CODE-REVIEW` y `to: VERIFY`
 Y el archivo `dod-story-code-review.md` declara `from: IMPLEMENT` y `to: CODE-REVIEW`
 Y el orden canónico resultante es:
  SPECIFY → PLAN → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → RELEASE
 Y no queda ninguna sección que invierta CODE-REVIEW y VERIFY
```

### Escenario alternativo – Checklist de release movido a su propio archivo

```gherkin
Dado el bloque "🚀 Criterios de Despliegue en Producción" del archivo monolítico
Cuando se migra
Entonces se convierte en `docs/guardrails/dod-story-release.md`
 Y ese archivo declara `applies-to: release` (no `story`) y `kind: content`
 Y ningún archivo `dod-story-<stage>.md` contiene criterios de release
```

### Escenario alternativo – Referencias cruzadas a guardrails convertidas en wikilinks

```gherkin
Dado el criterio:
  "[ ] Se cumple el [Checklist de Seguridad de IA](../guardrails/gr-ai-security-checklist.md)"
Cuando se migra a `dod-story-implement.md`
Entonces la referencia se convierte en un wikilink:
  "- [ ] Se cumple [[gr-ai-security-checklist]]"
 Y se aplica la misma conversión a los otros dos checklists referenciados
```

### Escenario alternativo – Compatibilidad temporal durante una versión

```gherkin
Dado un proyecto que ya usa `dod-story-checklist.md`
Cuando se actualiza el framework a la versión que introduce la división
Entonces el archivo monolítico sigue existiendo durante una versión minor
 Y su contenido se reemplaza por un índice temporal:
  "# DoD Story (deprecado) — ver [[dod-story-specify]], [[dod-story-plan]], ..."
 Y el CHANGELOG documenta la deprecación y la fecha de eliminación (siguiente major)
```

### Escenario – Idempotencia de la migración

```gherkin
Dado que la migración ya se ejecutó una vez
Cuando se vuelve a ejecutar el skill `memory-system migrate --from=dod-monolithic`
Entonces los archivos existentes no se sobrescriben sin `--force`
 Y el comando reporta "0 archivos creados, N archivos preservados"
 Y no duplica contenido entre archivos
```

---

## 📋 Requerimientos

### Requerimientos funcionales

- **CF-01 — División:** `dod-story-checklist.md` se divide en 7 archivos `dod-story-<stage>.md` + 1 archivo `dod-story-release.md` (checklist de release). El monolítico se conserva como índice deprecado durante una versión.

- **CF-02 — Frontmatter enriquecido:** cada archivo por etapa declara `from`, `to`, `applies-to`, `enforcement` y `kind: transition`. El archivo de release declara `kind: content` y `applies-to: release`.

- **CF-03 — Referencia explícita (Opción A):** cada SKILL.md de Story incluye una sección "## DoD aplicable" con la ruta explícita al archivo de su etapa. Ningún SKILL.md referencia el monolítico.

- **CF-04 — Mapeo centralizado (Opción C):** `sddf.config.yaml` incluye la sección `guardrails.dod.story` con el mapeo etapa → slug. Los skills leen la ruta con la precedencia: `sddf.config.yaml` → convención por nombre (`dod-story-<skill-name-suffix>.md`) → error accionable.

- **CF-05 — Orden corregido:** el orden canónico es `SPECIFY → PLAN → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → RELEASE`. Ningún archivo invierte `CODE-REVIEW` y `VERIFY`.

- **CF-06 — Conversión a wikilinks:** las referencias a `../guardrails/gr-*.md` se convierten en wikilinks `[[gr-*]]` en los archivos migrados.

- **CF-07 — Modo de migración en `memory-system`:** el skill `memory-system` acepta un modo `migrate --from=dod-monolithic` que realiza la división de forma idempotente y reporta creados/preservados.

- **CF-08 — Validación en `memory-system check`:** el modo `check` verifica que:
  - Cada skill de Story referencia un archivo `dod-story-<stage>.md` existente.
  - Cada archivo `dod-story-<stage>.md` declara `from`, `to` y `enforcement`.
  - El mapeo en `sddf.config.yaml` apunta a archivos existentes.
  - No hay referencias al monolítico `dod-story-checklist.md` (excepto en el índice deprecado).

### Criterios no funcionales

- **CNF-01 — Tokens:** cada skill de Story carga ≤ 40 líneas de DoD (vs. ~140 líneas del monolítico).
- **CNF-02 — Idempotencia:** `memory-system migrate --from=dod-monolithic` puede ejecutarse N veces sin efectos adversos.
- **CNF-03 — Trazabilidad:** el CHANGELOG documenta la división como `Changed` y el monolítico como `Deprecated`.
- **CNF-04 — Compatibilidad:** la división se introduce en una versión minor; el monolítico se elimina en la siguiente major.
- **CNF-05 — Documentación:** actualizar `docs/architecture/memory-system.md`, `docs/guides/sddf-commands-pipeline.md` y `README.md` con la nueva estructura.
- **CNF-06 — Convención de guion:** ASCII U+002D `-` en todos los slugs.
- **CNF-07 — Sin dependencias nuevas:** la migración usa `fs-extra` (ya presente) y `node --test`.

---

## 🚫 Fuera de alcance

- Cambios en los guardrails `gr-*-checklist.md` (AI security, code security, skill creation). Solo se referencian, no se modifican.
- División de DoD de Epic o Project. Se abordará en historias posteriores si aplica.
- Traducción a otros idiomas.
- Interfaz de UI para navegar los DoD.
- Cambios en el motor de estados (`domain-state-management`, `domain-story-lifecycle`). El DoD es un guardrail de transición; no cambia la máquina de estados.

---

## Notas / contexto adicional

### Contexto

El DoD de Story vive actualmente en un único archivo monolítico `docs/guardrails/dod-story-checklist.md` (~140 líneas) que contiene las siete etapas del pipeline en secciones. Cada skill de Story lo carga completo para leer solo su sección.

Problemas identificados:

- **Ineficiencia de tokens:** cada skill carga las 7 etapas para usar 1.
- **Violación de SRP:** un artefacto con 7 responsabilidades.
- **Conflictos de merge** entre colaboradores que editan etapas distintas.
- **`enforcement: error` a nivel archivo** cuando cada etapa podría tener uno distinto.
- **Orden inconsistente:** `VERIFY` y `ACCEPTANCE` aparecen antes de `CODE-REVIEW`, contradiciendo el pipeline canónico.
- **Mezcla de tipos:** el checklist de release (despliegue a producción) convive con el DoD de transiciones del pipeline.

Origen: discusión de arquitectura del sistema de memoria y revisión del modelo de guardrails.

### Notas / mapa de implementación

| Archivo | Cambio |
|---------|--------|
| `docs/guardrails/dod-story-specify.md` | Nuevo (migrado de la sección SPECIFY). |
| `docs/guardrails/dod-story-plan.md` | Nuevo (migrado de PLAN). |
| `docs/guardrails/dod-story-implement.md` | Nuevo (migrado de IMPLEMENT). |
| `docs/guardrails/dod-story-code-review.md` | Nuevo (migrado de CODE-REVIEW). |
| `docs/guardrails/dod-story-verify.md` | Nuevo (migrado de VERIFY). |
| `docs/guardrails/dod-story-acceptance.md` | Nuevo (migrado de ACCEPTANCE). |
| `docs/guardrails/dod-story-release.md` | Nuevo (migrado de "Criterios de Despliegue en Producción"). |
| `docs/guardrails/dod-story-checklist.md` | Reemplazar contenido por índice deprecado. |
| `sddf.config.yaml` | Añadir sección `guardrails.dod.story`. |
| `.claude/skills/story-specify/SKILL.md` | Añadir sección "## DoD aplicable" con ruta explícita. |
| `.claude/skills/story-plan/SKILL.md` | Ídem. |
| `.claude/skills/story-implement/SKILL.md` | Ídem. |
| `.claude/skills/story-code-review/SKILL.md` | Ídem. |
| `.claude/skills/story-verify/SKILL.md` | Ídem. |
| `.claude/skills/story-acceptance/SKILL.md` | Ídem. |
| `.claude/skills/story-release/SKILL.md` | Ídem (o el skill equivalente de release). |
| `.claude/skills/memory-system/SKILL.md` | Añadir modo `migrate --from=dod-monolithic`; extender `check`. |
| `docs/architecture/memory-system.md` | Actualizar la tabla de guardrails con la nueva estructura. |
| `docs/guides/sddf-commands-pipeline.md` | Documentar la referencia por skill y el mapeo en config. |
| `README.md` | Mencionar DoD por etapa. |
| `CHANGELOG.md` | Entrada `[Unreleased]` → `Changed` (dividido) y `Deprecated` (monolítico). |

---

## ✔️ Verificación

1. Existen los 8 archivos `dod-story-*.md` en `docs/guardrails/`, cada uno con frontmatter válido (`type`, `kind`, `enforcement`, `from`, `to`, `applies-to`).
2. `grep -rn "dod-story-checklist" .claude/skills/` devuelve solo el índice deprecado, ninguna referencia activa.
3. `grep -rn "dod-story" .claude/skills/story-*/SKILL.md` devuelve 7 referencias (una por skill), cada una a su archivo correspondiente.
4. `sddf.config.yaml` contiene la sección `guardrails.dod.story` con las 7 entradas.
5. `memory-system check` devuelve exit code 0 en el repo del framework.
6. `memory-system migrate --from=dod-monolithic --dry-run` reporta "0 cambios pendientes" tras la migración.
7. Ejecutar `/story-implement` en un cambio de prueba carga solo `dod-story-implement.md` (verificable por logs de contexto).
8. Un proyecto consumidor puede sobrescribir el mapeo en su `sddf.config.yaml` sin tocar los skills.
9. El orden `CODE-REVIEW → VERIFY` se respeta en el pipeline resultante (verificar con `/story-*` en secuencia).
10. `CHANGELOG.md` documenta la división y la deprecación con fecha de eliminación.


