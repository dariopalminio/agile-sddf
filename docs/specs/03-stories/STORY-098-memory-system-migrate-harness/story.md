---
alwaysApply: false
type: story
id: STORY-098
kind: feat
slug: STORY-098-memory-system-migrate-harness
title: "Adoptar la memoria SDDF en proyectos OpenSpec o Speckit con el modo migrate"
status: VERIFY
substatus: DONE
parent: EPIC-20-memory-system
created: 2026-09-20
updated: 2026-09-24
related:
  - EPIC-20-memory-system
  - STORY-095-memory-system-index-alias
  - STORY-096-memory-system-scaffold-ensure-rebuild
  - STORY-097-memory-system-check-ci
  - STORY-099-sddf-init-level-full
---
<!-- Referencias -->
[[EPIC-20-memory-system]]
[[STORY-095-memory-system-index-alias]]
[[STORY-096-memory-system-scaffold-ensure-rebuild]]
[[STORY-097-memory-system-check-ci]]
[[STORY-099-sddf-init-level-full]]
[[memory-system]]

# 📖 Historia: Adoptar la memoria SDDF en proyectos OpenSpec o Speckit con el modo migrate

**Como** desarrollador que usa OpenSpec o Speckit y quiere incorporar la memoria de proyecto de SDDF sin abandonar su harness
**Quiero** que `memory-system` adapte las capas de memoria al harness detectado (sin duplicar lo que el harness ya modela) y que el modo `migrate` me proponga el plan y pida confirmación antes de escribir
**Para** adoptar la memoria SDDF de forma segura en un proyecto existente, sin tocar los directorios del harness y sin crear conceptos redundantes

## ✅ Criterios de aceptación

### Escenario principal – modo `migrate` detecta el harness y propone antes de escribir

```gherkin
Dado un proyecto que contiene `.specify/` (Speckit) pero no `sddf.config.yaml`
Cuando ejecuto `/memory-system migrate`
Entonces el sistema detecta el harness como `speckit`
  Y propone, sin escribir, un plan de migración: qué capas crear, qué archivos existentes preservar y qué mapear (por ejemplo `constitution.md` → `.specify/memory/constitution.md` si existe)
  Y solicita confirmación antes de ejecutar el scaffolding
  Y al confirmar ejecuta el modo `scaffold` con la estructura adaptada al harness
```

### Escenario alternativo – compatibilidad con OpenSpec

```gherkin
Dado un proyecto que usa OpenSpec (`openspec/` con `specs/` y `changes/`)
Cuando ejecuto `/memory-system ensure --harness openspec`
Entonces el sistema crea las capas de memoria bajo `docs/` sin modificar nada dentro de `openspec/`
  Y no crea `docs/specs/` porque OpenSpec ya modela ese concepto en `openspec/specs/` y `openspec/changes/`
  Y genera un `docs/index.md` que enlaza a los artefactos de OpenSpec mediante wikilinks en una sección de artefactos externos
```

### Requerimiento: Perfiles de harness

La estructura de memoria se adapta por harness: `sddf` y `generic` crean las once capas completas; `speckit` y `openspec` omiten `docs/specs/` y enlazan desde el índice los artefactos del harness (`specs/*/spec.md` y `specs/*/plan.md` en Speckit; `openspec/specs/**/spec.md` y `openspec/changes/*/proposal.md` en OpenSpec). Los directorios del harness son de solo lectura para `memory-system`.

### Requerimiento: `migrate` no convierte artefactos

`migrate` solo hace scaffolding adaptado tras confirmación; no transforma ni mueve artefactos entre harness. En modo automático (`--yes`) la confirmación se asume. En un proyecto que ya es `sddf`, `migrate` informa `El proyecto ya es SDDF` y remite a `/memory-system ensure`, sin escribir nada (CR-001 de design.md).

## ⚙️ Criterios no funcionales

* **Seguridad:** ningún modo escribe fuera de `docs/`; los directorios `openspec/`, `.specify/` y `specs/` del harness no se modifican bajo ninguna circunstancia.
* **Idempotencia:** `migrate` confirmado dos veces sobre el mismo proyecto no crea nada la segunda vez.
* **Trazabilidad:** el plan propuesto y el informe posterior distinguen creados, preservados, mapeados y omitidos por harness.
* **Documentación:** `docs/architecture/memory-system.md` documenta la tabla de perfiles de harness; `README.md` menciona la compatibilidad con OpenSpec y Speckit.

## Fuera de alcance (Non-Goals)

- Migración automática de contenido entre harness (transformar un proyecto Speckit en SDDF).
- La detección de harness y el modo `index` en sí → [[STORY-095-memory-system-index-alias]].
- El scaffolding base y el modo `ensure` → [[STORY-096-memory-system-scaffold-ensure-rebuild]]; esta historia añade la adaptación por harness sobre ese scaffolding.
- Soporte de harness distintos de `sddf`, `speckit`, `openspec` y `generic`.

## 📎 Notas / contexto adicional

**Origen del split:** historia hermana de la división de la STORY-095 original; agrupa todo lo que depende del harness externo. Depende de [[STORY-095-memory-system-index-alias]] (detección de harness e índice) y de [[STORY-096-memory-system-scaffold-ensure-rebuild]] (scaffolding), por lo que se sugiere implementarla después de ambas. La dependencia es dura (CR-003 de design.md): `migrate` no define degradación sin `scaffold` (STORY-096) ni sin el índice de nodos externos (STORY-095); orden 095 → 096 → 098.

**Decisión heredada del diseño previo** (`STORY-095-memory-system-index-alias/pre-split/design.md`, D-2): los perfiles de harness son una tabla de datos (capas omitidas, mapeos, raíces externas indexadas) y no condicionales dispersos; precedencia de detección `--harness` > `sddf.config.yaml` > `.specify/` > `openspec/` > `generic`.

**Verificación sugerida:**

1. `/memory-system migrate --harness speckit` en un proyecto con `.specify/` propone un plan sin escribir; al confirmar no crea `docs/specs/`.
2. `/memory-system ensure --harness openspec` no cambia ningún hash bajo `openspec/` y el índice enlaza sus specs y changes.
