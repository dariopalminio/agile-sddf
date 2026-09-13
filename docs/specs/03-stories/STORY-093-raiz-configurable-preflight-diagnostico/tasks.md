---
alwaysApply: false
type: tasks
id: STORY-093
slug: STORY-093-raiz-configurable-preflight-diagnostico-tasks
title: "Tasks: Resolver una raíz configurable y usar preflight como diagnóstico"
date: 2026-09-12
status: PLAN
substatus: DONE
parent: EPIC-19-framework-consistency
story: STORY-093
design: STORY-093
related:
  - STORY-093-raiz-configurable-preflight-diagnostico
  - STORY-049-reading-of-sddf-root
  - STORY-053-centralizar-validacion-entorno-sddf
  - STORY-054-inicializar-entorno-sddf
---

<!-- Referencias -->
[[STORY-093-raiz-configurable-preflight-diagnostico]]

> Trazabilidad: AC-n corresponde a los tres escenarios de story.md; D-n a las
> decisiones de design.md; V-n a los contratos de verificación. El orden es:
> evaluación y contrato → bootstrap y diagnóstico → migración de consumidores →
> documentación y trazabilidad → validación de extremo a extremo.

## 1. Contrato, bootstrap y diagnóstico

- [x] T001 Definir fixtures y casos de evaluación para la precedencia, el default, los
  errores sin escritura, el bootstrap y el diagnóstico explícito antes de modificar los
  skills; inventariar SKILL.md y todo eval, ejemplo o README que afirme un Paso 0
  automático — AC-1, AC-2, AC-3, D-6.
- [x] T002 Añadir la clave root a sddf.config.yaml y a
  skills/sddf-init/assets/sddf.config.yaml.template; preservar las secciones actuales y
  usar docs como valor inicial de la plantilla — AC-1, D-1, D-3.
- [x] T003 Actualizar skills/sddf-init/SKILL.md y .env.template para aplicar D-1,
  crear root: docs solo en el bootstrap sin override y detener sin escribir si hay
  SDDF_ROOT pero aún no existe configuración; permitir que solo sddf-init cree una
  raíz versionada relativa dentro de REPO_ROOT y no fijar un override temporal como
  configuración versionada — AC-1, AC-2, D-3.
- [x] T004 Reescribir skills/skill-preflight/SKILL.md como diagnóstico explícito de
  solo lectura, con ROOT_SOURCE, directorios estándar y los cinco templates centrales
  de D-4, sin comprobación o warning de OpenSpec retirado — AC-3, D-1, D-4.
- [x] T005 Eliminar scripts/normalize-preflight-paso0.js y crear
  scripts/audit-root-resolution.js como auditor Node de solo lectura de D-2; impedir
  que cualquier automatismo reinserte el antiguo Paso 0 — AC-1, AC-3, D-2, D-6.

## 2. Migración de skills consumidores

- [x] T006 [P] Migrar docs-wiki-builder y header-aggregation al bloque de resolución
  local y retirar su invocación automática de preflight — AC-1, AC-3, D-2.
- [x] T007 [P] Migrar epic-creation, epic-format-validation, epic-from-project-plan
  y epic-generate-stories al bloque de resolución local; conservar sus rutas bajo
  SPECS_BASE — AC-1, AC-3, D-2.
- [x] T008 [P] Migrar epic-generate-all-stories, project-begin, project-discovery y
  project-planning al bloque de resolución local, sin alterar su lógica de negocio —
  AC-1, AC-3, D-2.
- [x] T009 [P] Migrar project-flow, project-context-diagram,
  project-policies-generation y project-story-mapping; resolver CLI_ROOT solo en los
  pasos que consumen skills o agentes instalados, sin cambiar su orden actual de
  detección — AC-1, AC-3, D-2, D-5.
- [x] T010 [P] Migrar reverse-engineering, story-creation, story-evaluation y
  story-specify al contrato D-1; story-evaluation mantiene su ausencia de preflight
  automático — AC-1, AC-3, D-2.
- [x] T011 [P] Migrar story-improve y story-split a la resolución local y a la
  semántica de error seguro ante raíz explícita inválida — AC-1, AC-2, D-1, D-2.
- [x] T012 [P] Migrar la cadena de planning story-plan, story-design,
  story-tasking, story-testcases y story-analyze; cada skill resuelve una vez su
  contexto sin encadenar preflight — AC-1, AC-3, D-2.
- [x] T013 [P] Migrar story-acceptance y story-implement-tasks al contrato directo,
  preservando sus gates y la ubicación de artefactos bajo SPECS_BASE — AC-1, AC-3,
  D-2.
- [x] T014 Actualizar story-implement, story-code-review y story-verify con la
  separación REPO_ROOT/SPECS_BASE/CLI_ROOT; en particular, leer configuración desde
  REPO_ROOT y código desde la raíz del repositorio — AC-1, AC-2, AC-3, D-5.
- [x] T015 [P] Actualizar los evals, ejemplos y README inventariados en T001 que aún
  afirman preflight automático; incluir al menos los soportes de epic-creation,
  epic-generate-all-stories, epic-generate-stories, story-acceptance, story-specify,
  story-plan y story-design — AC-3, D-6.

## 3. Normativa, documentación y trazabilidad

- [x] T016 Actualizar AGENTS.md, docs/policies/constitution.md y
  docs/domains/domain.md para reemplazar la obligatoriedad de preflight por resolución
  local obligatoria y diagnóstico bajo demanda — AC-1, AC-3, D-7.
- [x] T017 Actualizar README.md, docs/guides/root-folder-practices.md,
  sddf-commands-pipeline.md, skill-structural-pattern.md,
  harness-eng-agents-orchestration.md, best-practices-for-skills.md y
  artifact-directory-migration.md con la precedencia canónica, ejemplos de CI y la
  ausencia de dependencias de shell externas — AC-1, AC-3, D-1, D-2, D-7.
- [x] T018 Añadir STORY-093 a la sección Historias de
  EPIC-19-framework-consistency/epic.md, y actualizar sus Flujos Críticos e Impacto
  para retirar el arranque obligatorio sddf-init + skill-preflight; registrar que
  sustituye operativamente los contratos de STORY-049 y STORY-053 sin editar sus
  históricos — AC-3, D-7, CR-001, CR-002.

## 4. Verificación y distribución

- [ ] T019 Ejecutar la matriz de testcases: configuración docs, raíz configurada,
  override de entorno, ausencia de fuente, creación de salida propia bajo docs,
  fuentes inválidas, bootstrap de root versionado, rutas relativas/absolutas/con
  espacios, override válido ante YAML roto, consumidores especiales y preflight manual;
  comprobar que los casos de error no escriben archivos — AC-1, AC-2, AC-3, D-6.
- [x] T020 Ejecutar el auditor fuente y verificar que ningún skill conserva una
  invocación automática de preflight y que ningún soporte de evaluación afirma ese
  comportamiento; revisar que cada skill consumidor declara una única resolución local
  — AC-1, AC-3, D-2, D-6.
- [x] T021 Realizar un smoke test de instalación en un directorio temporal para
  confirmar que las fuentes actualizadas se distribuyen a un runtime ya soportado sin
  requerir yq, Bash ni scripts no empaquetados, y sin cambiar su selección de CLI_ROOT
  — AC-1, D-2, D-5, D-6.
