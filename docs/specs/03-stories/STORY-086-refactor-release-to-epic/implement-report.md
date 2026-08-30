---
alwaysApply: false
type: implement-report
id: STORY-086
slug: STORY-086-implement-report
title: "Reporte de Implementación STORY-086"
story: STORY-086
created: 2029-08-29
updated: 2029-08-29
---

# Reporte de Implementación STORY-086

## Reporte de Implementación: plan-01-refactor-release-to-epic

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

## Reporte de Implementación:  plan-02-refactor-dev-levels


### Estructura nueva

docs/specs/
├── 01-projects/   L3
├── 02-epics/      L2   ← era releases/
├── 03-stories/    L1
└── templates/     (sin numerar — no es un nivel de vuelo)
Los tres git mv preservan historial: 236 renombrados, 90 modificados, 7 altas. Se actualizaron 1081 referencias de ruta en 79 archivos del framework vivo, incluidas las variantes con barra invertida (docs\specs\…) y los nombres desnudos de los diagramas de árbol, que el patrón simple no capturaba. Los dos dueños de la estructura —sddf-init y skill-preflight— declaran los nombres nuevos y concuerdan entre sí.

### Defectos del barrido anterior, corregidos

Los encontré al medir el alcance y los arreglé como parte de esto:

Valores de frontmatter con tilde — type: project | épica | story en tres guías. El más grave: son plantillas que un agente copia literalmente al generar YAML. Ahora project | epic | story.
Directorio inexistente épicas/ — 9 apariciones. Resueltas a 02-epics/.
artifact-directory-migration.md documenta una migración pasada y el barrido le reescribió los nombres de origen (release-01-nombre.md → épica-01-nombre.md), archivos que jamás existieron así. Restauré la columna "ruta anterior" a lo realmente existente y dejé la "ruta nueva" apuntando a la estructura vigente — la guía vuelve a ser ejecutable.
Slugs con tilde (EPIC-001-nombre-épica) y el placeholder {épica} → {epic}.
sddf-commands-pipeline.md:62 declaraba input épica-*.md y output stories/story-[ID].md; ambos obsoletos. Corregidos.
De paso, un error preexistente en HEAD: organization-of-artifacts.md listaba …/PROJ-01-nombre-project/release.md — un release.md dentro del directorio de proyecto. Ahora project.md.

### ADR

Reescribí ADR-0004 y lo renombré a ADR-0004-nivel-l2-epic-y-directorios-numerados.md. La decisión ahora incluye la reestructura y su fundamento real (cardinalidad N:M), y las alternativas descartadas son las verdaderas — entre ellas "renombrar solo skills y artefacto dejando specs/releases/", descartada explícitamente por dejar el estado a medias. Referencias actualizadas en el índice de ADRs, docs/index.md y la nota de terminología de flight-leves-model.md.

### Verificación

0 rutas viejas en el framework vivo; las 15 restantes son intencionales (columna "ruta anterior" de la guía de migración y la nota que nombra specs/releases/ como histórico)
0 tildes en directorios, valores de frontmatter o slugs
171 links locales de docs/index.md, 0 rotos
npm pack: 13 entradas skills/epic-, 0 skills/release; los 34 evals.json parsean
Instalación real en sandbox: 34 skills + 10 agentes, con la estructura numerada declarada
Validación funcional: los 19 epic.md en su ruta nueva dan 2 APROBADO / 17 REFINAR — idéntico a la baseline previa, o sea sin regresión (los REFINAR son la carencia preexistente de "Flujos Críticos"). epic-from-project-plan encuentra 01-projects/PROJ-01-agile-sddf/project-plan.md con su ## Propuesta de Épicas y las 9 ### Épica NN

Dos cosas que debes saber
17 archivos históricos están en CP-1252, no UTF-8 — 03-stories/FEAT-006, FEAT-010, FEAT-013, FEAT-018→021, y otros. Verifiqué contra HEAD que ya estaban así antes de todo este trabajo; solo cambiaron de directorio, byte a byte. Contradice la regla de encoding que los propios skills declaran, pero arreglarlo es un cambio aparte y no lo toqué.

Los tres evals.json de skills renombrados aparecen como D+A en vez de R — git no los detectó como renombres porque el contenido cambió por debajo del umbral de similitud. No hay pérdida: los tres existen y parsean.

Todo quedó staged, incluido docs/specs/03-stories/FEAT-086-refactor-release-to-epic/ (tus plan-01, plan-02 e implement-report.md). Si prefieres commitearlos aparte, git restore --staged sobre ese directorio.

## Reporte de Implementación: plan-03-refactor-feat-to-story

### Qué cambió

79 directorios renombrados con git mv: FEAT-NNN-* → STORY-NNN-*, conservando el número 1:1. FIX-001-error-in-npm-install-locally pasó a STORY-087 con kind: fix (su 001 colisionaba con STORY-001).

2590 referencias sustituidas en 305 archivos, incluida la prosa sin guion ("los FEAT IDs" → "IDs de historia", "sin FEAT propio" → "sin historia propia").

Campo kind: añadido a ambos story-template.md y poblado en las 76 historias con story.md (75 feat + 1 fix), conectado con la convención de ramas <kind>/<id>-<slug> en branching-strategy, flight-leves-model, constitution (reglas 7 y 8) y header-aggregation.
```
## Features → ## Historias en los dos templates, los 18 epic.md que la tenían y los 4 skills que la hardcodean.
```

ADR-0005 creado y registrado; CHANGELOG ampliado con la migración de 5 pasos.

### Verificación

Cobertura: 0 skills con FEAT- restante (baseline: 23 skills, 88 archivos). Los únicos FEAT- que quedan son el CHANGELOG y el ADR-0005, que nombran el prefijo antiguo por necesidad
79 directorios STORY-*, sin duplicados de número; 0 historias sin id: ni kind:
172 links de docs/index.md, 0 rotos; los 34 evals.json parsean
npm pack: 13 entradas skills/epic-, 0 skills/release; instalación en sandbox OK con el template llevando kind
Validación funcional: 2 APROBADO / 17 REFINAR, idéntico a la baseline — confirma que la migración de ## Features a ## Historias quedó completa; si estuviera a medias, más épicas fallarían
El bug queda cerrado: el glob 03-stories/STORY-*/story.md ve ahora las 79 (máximo 87 → siguiente ID 088). Antes FEAT-* daba máximo 86 → 087, ignorando silenciosamente FIX-001
172 renombres registrados como R en git; los 17 archivos en CP‑1252 conservaron su codificación y recibieron kind correctamente
Correcciones a lo que te dije en el plan
readme-builder era un falso positivo. Lo listé en el grupo B, pero su ## Features es la sección de un README de producto, no de la épica. Excluido — el grupo B son 4 skills, no 5.

Aparecieron restos de los barridos anteriores que corregí de paso: header-aggregation seguía citando stories/, releases/, projects/ desnudos (mi barrido de rutas solo cubría las que llevan prefijo specs/), y un El épica / Ningun otro épica en epic-generate-stories/evals.json.

### Dos cosas pendientes que dejo señaladas

story-map.md tiene 82 referencias a "release" en su vocabulario (columnas | Release |, ## Release Slices, "Releases 00–02"). Es un artefacto vivo que el barrido release → épica de hace dos turnos nunca tocó. Cambié solo la columna FEAT → ID, que era lo que entraba en el alcance aprobado. Queda fuera de esta tarea; dime si quieres que lo alinee.

Tres directorios sin story.md — STORY-084, STORY-085 y STORY-086 solo contienen planes y reportes, así que no tienen frontmatter donde declarar kind. EPIC-00/epic.md tampoco tiene ninguna sección ## (por eso era uno de los REFINAR previos). Ambas cosas son preexistentes.