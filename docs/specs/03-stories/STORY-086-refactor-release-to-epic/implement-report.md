---
alwaysApply: false
type: implement-report
id: STORY-086
slug: STORY-086-implement-report
title: "Implement Report: STORY-086 — refactor release to epic"
story: STORY-086
created: 2029-08-29
updated: 2029-08-29
---

## Reporte de Implementación: STORY-086 — plan-01-refactor-release-to-epic

### Qué cambió

5 skills renombrados (git mv, historial preservado) — incluí epic-creation según acordamos:

Antes	Ahora
release-creation	epic-creation
release-format-validation	epic-format-validation
release-generate-stories	epic-generate-stories
release-generate-all-stories	epic-generate-all-stories
releases-from-project-plan	epic-from-project-plan
Artefacto: los 19 release.md → epic.md con git mv, y type: release → type: epic en los 19 más ambos epic-template.md.

Sección del project-plan: ## Propuesta de Releases → ## Propuesta de Épicas, coordinado en los dos templates, el parser de epic-from-project-plan, el agente project-architect y la única instancia viva (project-plan.md).

Consumidores: header-aggregation (mapa EPIC-* → type: epic), docs-wiki-builder, sddf-init, project-planning, project-flow, project-story-mapping, los story-* que leen la épica padre, y los placeholders de analyze-report-template.md ({release_status} → {epic_status}) con su example output alineado.

ADR-0004 creado (más la fila de ADR-0003 que faltaba en el índice), CHANGELOG con la nota de migración manual, y package.json a 2.0.0 por el breaking change.

### Verificación

0 referencias a nombres viejos fuera del histórico · 0 release.md · 19 epic.md · 0 type: release
name: del frontmatter coincide con el directorio en los 5
npm pack --dry-run: 13 entradas skills/epic-, 0 skills/release
Instalación real en sandbox: 34 skills + 10 agentes, los 5 epic-* con su SKILL.md
Los 141 links specs/ de docs/index.md resuelven, 0 rotos
Todos los evals.json parsean; encoding UTF-8 sin BOM verificado byte a byte
Ejecuté la lógica de epic-format-validation sobre los 19 epic.md: extrae las 3 secciones obligatorias del template y los valida. 17 dan REFINAR por falta de "Flujos Críticos / Smoke Tests" — verifiqué contra git show HEAD que es una carencia preexistente de esas épicas históricas; el único cambio de contenido fue type:.

### Dos cosas que decidí y conviene que revises

"Release slices" de story mapping. Es terminología de Jeff Patton. Lo renombré a "slices de épicas" en project-story-mapping y project-story-mapper, dejando una nota que preserva la referencia al método: "lo que Patton llama release slices; en SDDF cada slice se materializa como una épica". Si prefieres conservar el término original, se revierte fácil.

Lo que NO toqué, por ser release en sentido CI/CD: security-audit --scope release y su Release Readiness, el modelo batch de la guía de branching, deployment-to-npm.md, el [Unreleased] del CHANGELOG y los ADR-0001/0002/0003 (inmutables). Tampoco docs/specs/** histórico ni el directorio specs/releases/. En la guía de branching sí corregí dos líneas que decían "rama release" cuando la rama real ya era epic/.

Todo quedó staged salvo docs/specs/stories/STORY-086-refactor-release-to-epic/ — ese directorio apareció con una copia de mi plan y no es obra mía, así que lo dejé sin trackear para que decidas.
