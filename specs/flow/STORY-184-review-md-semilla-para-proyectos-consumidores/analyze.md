---
type: analyze
id: STORY-184
slug: STORY-184-analyze-report
title: "Analyze: REVIEW.md semilla para proyectos consumidores"
story: STORY-184
design: STORY-184
testcases: STORY-184
tasks: STORY-184
verdict: APPROVED
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-184-review-md-semilla-para-proyectos-consumidores
---

<!-- Referencias -->
[[STORY-184-review-md-semilla-para-proyectos-consumidores]]

# Reporte de Coherencia: REVIEW.md semilla para proyectos consumidores

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo F

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (y 4/4 CNF) |
| Cobertura de ACs en testcases.md | ✓ | 3/3 ACs con caso de prueba; 2 WARNING de calidad en casos (INC-001, INC-002) |
| Alineación tareas → diseño | ✓ | 16/16 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 12/12 elementos con tarea (C-1 a C-6, I-1 a I-6) |
| Alineación con la épica EPIC-28-calibrar-story-code-review-con-review-md | ✓ | Listada en el índice (`epic.md:36`), cubre CS-6 (`epic.md:46`) y SMOKE-4 (`epic.md:76-82`) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Sin `REVIEW.md`: se crea desde la plantilla con las cuatro secciones e informa `✅ Creado: REVIEW.md` | ✓ | C-1, C-2; I-1, I-3, I-4; D-1, D-2, D-4; F-1 |
| AC-2 | Con `REVIEW.md`: queda byte a byte igual, se informa que se conserva y el resto del flujo continúa | ✓ | I-2, I-4, I-5; D-2 (Paso 4 entre DoD y registro, sin depender de los Pasos 2-3); D-3; F-2 |
| AC-3 | Dos ejecuciones: la primera crea y la segunda no modifica | ✓ | D-3 (AC-3 = AC-1 seguido de AC-2, por condición de existencia); F-2; CR-002 |
| CNF-1 | Plantilla única en `assets/`, igual a `docs/templates/REVIEW-template.md`, de solo lectura | ✓ | C-1, D-1, I-6 (UT-001 de la prueba) |
| CNF-2 | Se publica por `package.json › files`; `REVIEW.md` raíz no | ✓ | C-6 (IT-001), contrato 5 |
| CNF-3 | Evals primero, en `skills/sddf-constitution/evals/evals.json` | ✓ | C-4, C-5, D-5 (orden), contrato 8; CR-001 |
| CNF-4 | Español, UTF-8 sin BOM, sin caracteres invisibles | ✓ | D-6 (UT-002, EV-005), contrato 10 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Comprobar el estado de partida y restricciones sobre `description` | design.md › Context; C-2 (frontmatter) | ✓ |
| T002 | Crear `evals/evals.json` con TC-001 a TC-004 | C-4, D-5, I-4 | ✓ |
| T003 | Retirar la exención de `config/eval-exemptions.json` | C-5, D-5, CR-001 | ✓ |
| T004 | Modificar `test/sddf-constitution.test.js` (E2E-001, EV-003, IT-001, UT-001, UT-002, EV-005) en RED | C-6, D-6, I-6 | ✓ |
| T005 | Copiar binariamente la plantilla al skill | C-1, D-1, I-3 | ✓ |
| T006 | Insertar el Paso 4 «Sembrar REVIEW.md» | C-2, D-2, D-3, D-4, I-1, I-2, I-4, Esquema de datos | ✓ |
| T007 | Renumerar los Pasos 4→5 y 5→6 | C-2, D-2 | ✓ |
| T008 | Resumen, «Qué hace», Entrada, Dependencias, Salida y `description` | C-2, I-5 | ✓ |
| T009 [P] | Actualizar `README.md` del skill | C-3 | ✓ |
| T010 | Ejecutar `node --test test/sddf-constitution.test.js` | C-6; contratos 1-5 | ✓ |
| T011 [P] | `npm pack --dry-run --json` | contrato 5 (CNF-2) | ✓ |
| T012 [P] | Comando `ai-no-hidden-characters` y BOM | contrato 10 (CNF-4) | ✓ |
| T013 | Verificación manual con SHA-256 (AC-1, AC-2, AC-3, SMOKE-4) | contrato 6; F-1, F-2 | ✓ |
| T014 | `npm test` y `npm run verify:repository` | contrato 9 | ✓ |
| T015 | Dejar anotado `npm run test:eval -- sddf-constitution` | contrato 7; D-5 | ✓ |
| T016 | `git status` / `git diff --stat` y orden evals → skill | contrato 8; Non-Goals | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| C-1 Plantilla semilla | Componentes afectados | T005 | ✓ |
| C-2 Paso «Sembrar REVIEW.md» | Componentes afectados | T006, T007, T008 | ✓ |
| C-3 README del skill | Componentes afectados | T009 | ✓ |
| C-4 Evals del skill | Componentes afectados | T002 | ✓ |
| C-5 Inventario de exenciones | Componentes afectados | T003 | ✓ |
| C-6 Pruebas del skill | Componentes afectados | T004, T010 | ✓ |
| I-1 Origen y destino | Interfaces | T006 | ✓ |
| I-2 Condición de creación | Interfaces | T006 | ✓ |
| I-3 Copia | Interfaces | T005, T006 | ✓ |
| I-4 Mensajes | Interfaces | T002, T004, T006 | ✓ |
| I-5 Línea del resumen | Interfaces | T008 | ✓ |
| I-6 Igualdad de plantillas | Interfaces | T004 (UT-001) | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-28-calibrar-story-code-review-con-review-md

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md:36`, entrada STORY-184 del índice |
| Objetivo de la historia alineado con la épica | ✓ | «calibrar `/story-code-review` desde el primer día» cumple CS-6 (`epic.md:46`); SMOKE-4 (`epic.md:76-82`) lo cubren E2E-003 y T013 |
| Restricciones de la épica respetadas | ✓ | No activa Claude Code Review en GitHub ni ejecuta `gr-*` en CI (`epic.md:93`). Respeta la ubicación en la raíz del ADR de STORY-178 (D-2) y no abre una cuarta raíz de ADR-0019 |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** F, caso de prueba de AC-2 defectuoso. El AC tiene cobertura, pero un caso fallaría en falso.
- **Descripción:** TC-002 (EV-002) pone `Sobreescribir` en `not_contains`. Su escenario tiene `docs/constitution.md` existente, y en ese caso el Paso 2c de `skills/sddf-constitution/SKILL.md:144-151` muestra siempre la opción `(s) Sobreescribir con el template en blanco`. El eval fallaría aunque el skill conservara `REVIEW.md` correctamente. E2E-002 sigue cubriendo AC-2.
- **Archivo afectado:** design.md, sección «D-5», fila TC-002; testcases.md, fila EV-002; tasks.md, T002 (usa la tabla de D-5).
- **Acción requerida:** cambiar el `not_contains` de TC-002 por un literal exclusivo del Paso 4, por ejemplo `✅ Creado: REVIEW.md` (ya está) y `Sobrescribir REVIEW.md`, o quitar `Sobreescribir`.

### INC-002 [WARNING]

- **Tipo:** F, casos E2E no ejecutables tal como están descritos.
- **Descripción:** T013 (E2E-001 a E2E-003) pide «crear un proyecto» en el scratchpad y ejecutar `/sddf-constitution`, pero no dice cómo se instala allí el skill ni desde qué sesión se invoca con ese `REPO_ROOT`. Sin el skill instalado de la rama (`npx agile-sddf install` desde el checkout, o `installSDDF` con `baseDir` temporal), la prueba usaría la copia de `.claude/skills/`, que puede estar desactualizada.
- **Archivo afectado:** tasks.md, T013; testcases.md, filas E2E-001 a E2E-003 (columna «Dado»).
- **Acción requerida:** precisar en T013 la preparación: instalar con `node scripts/cli.js install --target claude` sobre el directorio temporal (o el comando equivalente de `config/runtimes.json`) y ejecutar `/sddf-constitution` en una sesión abierta en ese directorio.

---

## Recomendaciones

1. **INC-001:** en design.md › D-5 (fila TC-002), testcases.md › EV-002 y tasks.md › T002, sustituir `Sobreescribir` en `not_contains` por un literal que solo pueda emitir el Paso 4, o eliminarlo. Aplicable con `/story-fix-plan STORY-184`.
2. **INC-002:** en tasks.md › T013, añadir la instalación del skill de la rama en el directorio temporal y abrir la sesión de `/sddf-constitution` en él. Reflejarlo en la columna «Dado» de E2E-001 a E2E-003.
3. **Observación (sin tipo, no bloquea):** T016 y el contrato 8 piden que «el historial» muestre los evals antes del cambio del skill. AGENTS.md no prevé commits intermedios del agente, así que la evidencia práctica del orden es el registro de T002-T003 y T006-T008 en `implement-report.md`. Conviene redactarlo así en T016.
4. **Observación (sin tipo, no bloquea):** un consumidor que actualice agile-sddf sin `--force` conserva el skill anterior completo (`scripts/install.js:158-160`, «Skipped (already exists)»). Sin la plantilla, el comportamiento es coherente: tampoco tiene el Paso 4 nuevo. No hace falta cambiar nada, pero merece una línea en las notas de release de EPIC-28.

---

## Cobertura de ACs en Testcases

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | Crea `REVIEW.md` con las cuatro secciones e informa `✅ Creado: REVIEW.md` | ✓ | E2E-001, EV-001, EV-004, UT-002, UT-003, UT-006 |
| AC-2 | Conserva `REVIEW.md` byte a byte y el flujo continúa | ✓ (EV-002 defectuoso, INC-001) | E2E-002, EV-002, UT-003, UT-007 |
| AC-3 | La segunda ejecución no modifica | ✓ | E2E-003, EV-003 |

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ | `/story-implement STORY-184` |
| tasks.md | ✓ | `/story-implement-tasks STORY-184` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | `story.md:29-53`: AC-1 a AC-3 en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | Tabla de cobertura: 3/3 y 4/4 CNF |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1 a D-6 y «Esquema de datos» con `// satisface:`; C-1 a C-6 e I-1 a I-6 con columna «AC / CNF» |
| No hay decisiones de arquitectura aplazadas: toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | «Open Questions: Ninguna»; CR-001 a CR-003 registrados |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | Existen los dos |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | 16 tareas acotadas a un archivo o una verificación; AC-1 a AC-3 en T006, T013 |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | E2E-001 a E2E-003 trazables 1-a-1 a AC-1 a AC-3 |
