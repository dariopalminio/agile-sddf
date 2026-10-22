---
alwaysApply: false
type: story
id: STORY-154
kind: chore
slug: STORY-154-documentar-el-nuevo-layout
title: "Documentar el nuevo layout"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
created: 2026-10-21
updated: 2026-10-21
related:
  - EPIC-26-layout-y-flow-forward-mejorado
---
[[EPIC-26-layout-y-flow-forward-mejorado]]

# 📖 Historia: Documentar el nuevo layout

**Como** practitioner con un proyecto que usa `root: docs` o `docs/specs/`
**Quiero** que `AGENTS.md`, la arquitectura, el índice, las guías y el CHANGELOG describan el layout fijo, y una sección de migración en `docs/guides/artifact-directory-migration.md`
**Para** entender el cambio incompatible y migrar mi proyecto a `specs/flow/` sin adivinar los pasos

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – documentación del layout fijo
```gherkin
Dado el layout fijo aceptado en el ADR de STORY-147
Cuando se actualiza la documentación
Entonces "AGENTS.md" documenta las raíces "docs/", "specs/" y "workflow/" y la convención "<YYYY-MM-DD>-STORY-NNN-<slug>/" de "specs/flow/archive/"
  Y "AGENTS.md" indica que "docs/requirements/" migrará a "specs/living/" en la épica de Living Spec
  Y "docs/architecture/sddf-architecture.md" y "docs/index.md" reflejan el layout fijo
  Y ya no describen "SDDF_ROOT", la clave "root" ni "SPECS_BASE" como mecanismo vigente
```

### AC-2 — Escenario principal – guía de migración y CHANGELOG
```gherkin
Dado un proyecto que usa "root: docs" o "docs/specs/"
Cuando el usuario lee "docs/guides/artifact-directory-migration.md"
Entonces encuentra una sección que explica el paso de "docs/specs/" a "specs/flow/" y el retiro de "root"
  Y el CHANGELOG registra el cambio como incompatible (versión mayor) y enlaza esa sección
```

### AC-3 — Escenario alternativo / error – enlaces rotos
```gherkin
Dado la documentación actualizada
Cuando se ejecuta "npm run verify:repository"
Entonces el chequeo de enlaces termina sin errores
  Pero si una guía referencia una ruta de "docs/specs/" que ya no existe, el gate falla nombrando el archivo
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Veracidad:** cada ruta y capacidad documentada se verifica en el filesystem antes de escribirla (`AGENTS.md`).
- **CNF-2 — Idioma:** la documentación se redacta en español.

## Fuera de alcance (Non-Goals)

- Documentar el archivado, el workflow o la Living Spec más allá de mencionar su destino.

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: `EPIC-26-layout-y-flow-forward-mejorado/epic.md`
Feature origen: STORY-154 — Documentar el nuevo layout
Cubre CS-9, CS-14 y parte de CS-12. La guía de migración es el destino al que remiten `/sddf-init` (STORY-149) y `skill-preflight` (STORY-152).
