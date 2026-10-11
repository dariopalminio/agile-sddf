---
type: analyze
id: STORY-117
slug: STORY-117-analyze-report
title: "Analyze: Verificar sddf.config.yaml y los modos SDD sobre la estructura de dos niveles"
story: STORY-117
design: STORY-117
tasks: STORY-117
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-117-verificar-cierre-epic-21
---

<!-- Referencias -->
[[STORY-117-verificar-cierre-epic-21]] · [[STORY-117-verificar-cierre-epic-21-design]] · [[STORY-117-verificar-cierre-epic-21-tasks]]

# Reporte de Coherencia: Verificar sddf.config.yaml y los modos SDD sobre la estructura de dos niveles

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (más CNF-1 y CNF-2) |
| Cobertura de ACs en testcases.md | ⚠️ | testcases.md no presente: cobertura de pruebas no evaluada |
| Alineación tareas → diseño | ✓ | 28/28 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 13/13 elementos con tarea (7 componentes + 6 interfaces) |
| Alineación con la épica EPIC-21-colapsar-specs-dos-niveles | ⚠️ | Listada y alineada; dos criterios de salida de la épica difieren del diseño (CR-001, CR-002 abiertos) |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️, 0 ❌) |

**Estado general:** ⚠️ Advertencias (0 ERROR · 5 WARNING)

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Cada criterio de salida de EPIC-21 queda en `verify-report.md` como `PASS`, con su comando y su salida, y ningún `sddf.config.yaml` versionado contiene niveles numerados | ✓ | D-4 (compuerta P-0), D-5 (patrón y excepciones de V-06), D-6 (V-01…V-12), D-10 (V-11 compuesto), D-11 (política de `check`), contratos 1–2 |
| AC-2 | SMOKE-1…3, Spec-First y Spec-Anchored sobre repositorios temporales, registrados como `PASS` | ✓ | D-7 (temporales con tarball), D-8 (V-13…V-15), D-9 (V-16, V-17 con guion fijo), interfaces `scaffold`/`migrate`/`index`/`check`/`install`, contratos 3–4 |
| AC-3 | Todo fallo se registra como `FAIL` con su evidencia y la historia responsable; la historia no pasa a ACCEPTANCE; tras corregir no se repite lo que ya pasó | ✓ | D-3 (`Findings` CRITICAL), D-12 (atribución, áreas y repetición), D-2 (rechazo en VERIFY), F-2, F-3, contratos 5–6 |
| CNF-1 | Reproducibilidad en temporales creados desde cero | ✓ | D-7, D-8, contrato 4 |
| CNF-2 | Evidencia en `verify-report.md` | ✓ | D-2, D-3, contrato 7 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Entorno Git Bash y carpeta `.tmp/.../evidence/` | F-4, D-1, D-3 | ✓ |
| T002 | P-0.1: rama, árbol limpio, SHA | D-4 | ✓ |
| T003 | P-0.2: estado de STORY-104…116 | D-4, CR-003 | ✓ |
| T004 | P-0 `FAIL`: detener y saltar a T024 | D-4, F-4, D-12 | ✓ |
| T005 | Registrar el estado de CR-001…CR-005 | Registro de Cambios (CR), D-11 | ✓ |
| T006 | Cerrar IMPLEMENT sin cambios (`IMPLEMENT/DONE`) | D-2 | ✓ |
| T007 | V-01, V-02 | D-6, D-12 | ✓ |
| T008 | V-03, V-04 | D-6, D-12 | ✓ |
| T009 | V-05 | D-6, D-12 | ✓ |
| T010 | V-06 con lista de excepciones | D-5, D-6, D-12, CR-001 | ✓ |
| T011 | V-07 `migrate --dry-run` | D-6, F-4, interfaz `migrate` | ✓ |
| T012 | V-08 `check` exit 0 | D-6, D-11, D-12, CR-005 | ✓ |
| T013 | V-09 wikilinks a `[[EPIC-`/`[[STORY-` | D-6, interfaz `check --json` | ✓ |
| T014 | V-10 `CHANGELOG.md` | D-6, D-12 | ✓ |
| T015 | V-12 `sddf.config.yaml` versionados | D-6, D-12 | ✓ |
| T016 | `npm pack` → `$TGZ` | D-7, F-4, componente "Empaquetado e instalador" | ✓ |
| T017 | Procedimiento común de temporal | D-7, interfaz `npx agile-sddf install` | ✓ |
| T018 | V-13 (SMOKE-1) | D-8, interfaz `scaffold` | ✓ |
| T019 | V-14 (SMOKE-2) | D-8, interfaz `migrate`, componente "Fixtures" | ✓ |
| T020 | V-15 (SMOKE-3) | D-8, interfaz `index` | ✓ |
| T021 | V-16 Spec-First | D-9, D-12, componente "Skills de flujo" | ✓ |
| T022 | V-17 Spec-Anchored | D-9, D-12 | ✓ |
| T023 | V-11 y V-11c | D-10, CR-002 | ✓ |
| T024 | `/story-verify STORY-117 --mode manual` y `verify-report.md` | D-2, D-3, Esquema de datos, interfaz `/story-verify` | ✓ |
| T025 | Transición de AC-3 y limpieza de temporales | D-2, D-7, F-1, F-2 | ✓ |
| T026 | Reverificación por diff | D-12, F-3 | ✓ |
| T027 | Contratos 1–5 | Contratos de verificación #1–#5 | ✓ |
| T028 | Contratos 6–7 y UTF-8 sin BOM | Contratos de verificación #6–#7 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Reporte de verificación (`verify-report.md`) | Componentes afectados | T024, T027 | ✓ |
| Logs y transcripción (`.tmp/story-verify/STORY-117/`) | Componentes afectados | T001, T002, T016, T021, T024 | ✓ |
| Repositorios de prueba (`mktemp -d`) | Componentes afectados | T017, T018–T022, T025 | ✓ |
| Motor de memoria (reutilizado) | Componentes afectados | T011–T013, T018–T020, T022 | ✓ |
| Fixtures `examples/specs-3-levels/` | Componentes afectados | T019, T020 | ✓ |
| Empaquetado e instalador | Componentes afectados | T016, T017 | ✓ |
| Skills de flujo | Componentes afectados | T021, T022, T024 | ✓ |
| `memory-system.js scaffold` | Interfaces | T018 | ✓ |
| `memory-system.js migrate --from specs-3-levels [--dry-run]` | Interfaces | T011, T019, T020 | ✓ |
| `memory-system.js index` | Interfaces | T020, T022 | ✓ |
| `memory-system.js check [--json]` | Interfaces | T012, T013, T019, T020, T022 | ✓ |
| `npx agile-sddf install --target claude-code` | Interfaces | T017 | ✓ |
| `/story-verify STORY-117 --mode manual` | Interfaces | T024, T025 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-21-colapsar-specs-dos-niveles

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` § "Historias", línea de STORY-117; fila 10 de la tabla de dependencias |
| Objetivo de la historia alineado con la épica | ✓ | El "Para" (publicar el breaking change sin dependencias de `01-projects/` ni de rutas numeradas) responde al alcance y a los criterios de salida; la historia reformula "actualizar `sddf.config.yaml`" como verificación (Notas de `story.md`, "Reformulación") |
| Restricciones de la épica respetadas | ⚠️ | Dos criterios de salida no se pueden verificar tal como están redactados: "Ningún skill ni agente referencia…" no prevé la excepción de la lógica de migración (D-5, CR-001), y "Los tres modos SDD (Intent-First, Spec-Anchored, Spec-as-Source)" incluye un modo sin flujo ejecutable y un término distinto del de la guía (D-10, CR-002). La línea de STORY-117 en `epic.md` sigue diciendo "Actualizar `sddf.config.yaml`" e "Intent-First". |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D (desalineación con la épica)
- **Descripción:** el criterio de salida "Ningún skill ni agente referencia `specs/01-projects/`, `specs/02-epics/` ni `specs/03-stories/`" es absoluto, pero D-5 lo evalúa con una lista de excepciones (`specs-3-levels.js`, aviso de `scaffold`, fixture `examples/specs-3-levels/**`, casos de `evals.json` y documentación de `memory-system`). Sin cambiar la épica, V-06 se declara `PASS` con un criterio más laxo que el escrito.
- **Archivo afectado:** `docs/specs/02-epics/EPIC-21-colapsar-specs-dos-niveles/epic.md`, sección "Criterios de salida" (6.º criterio); `design.md`, D-5 y CR-001
- **Acción requerida:** añadir a `epic.md` "salvo la lógica de migración y detección de `memory-system`" antes de VERIFY (CR-001).

### INC-002 [WARNING]

- **Tipo:** D (desalineación con la épica)
- **Descripción:** el criterio de salida "Los tres modos SDD (Intent-First, Spec-Anchored, Spec-as-Source) funcionan" y la línea de STORY-117 en `epic.md` ("Actualizar `sddf.config.yaml`… Intent-First…") no coinciden con la historia (Non-Goals: no cambia `sddf.config.yaml` y no verifica Spec-as-Source) ni con D-10 (V-11 compuesto, V-11c `N/A`).
- **Archivo afectado:** `epic.md`, secciones "Historias" (línea STORY-117) y "Criterios de salida" (11.º criterio); `design.md`, D-10 y CR-002
- **Acción requerida:** reformular en `epic.md` como "Spec-First y Spec-Anchored funcionan con la nueva estructura; Spec-as-Source es compatible en lo estructural" y actualizar el título de la línea de STORY-117 (CR-002; lo puede recoger STORY-116).

### INC-003 [WARNING]

- **Tipo:** F (artefacto de pruebas ausente y referenciado)
- **Descripción:** `testcases.md` no existe, pero el diseño y las tareas lo tratan como portador del procedimiento: D-1 ("procedimiento… que `testcases.md` enumera"), D-9 ("guion fijo que `testcases.md` transcribe") y T021 ("guion fijo 'todo-cli' de D-9 transcrito en `testcases.md`"). El guion está definido en D-9, así que T021 es ejecutable, pero la referencia apunta a un artefacto inexistente y `/story-implement` no está disponible.
- **Archivo afectado:** `design.md`, D-1 y D-9; `tasks.md`, T021
- **Acción requerida:** ejecutar `/story-testcases STORY-117` para transcribir V-01…V-17 y el guion "todo-cli", o cambiar en `design.md` y `tasks.md` la referencia a "el guion de D-9".

### INC-004 [WARNING]

- **Tipo:** D (precondición de AC-1 frente al diseño)
- **Descripción:** el "Dado" de AC-1 ("STORY-104 a STORY-116 están en DONE") usa un `substatus` como estado y no menciona STORY-118. D-4 lo interpreta como `ACCEPTANCE/DONE`, `DELIVER`, `COMPLETED` o `CANCELED` y deja STORY-118 fuera. El diseño es coherente, pero la historia sigue ambigua.
- **Archivo afectado:** `story.md`, AC-1 (línea 35); `design.md`, D-4 y CR-003
- **Acción requerida:** precisar el "Dado" de AC-1 en `story.md` según CR-003. También queda pendiente corregir la nota "Infraestructura existente" (línea 83), que da por existente `npm run test:e2e:smoke` (CR-004).

### INC-005 [WARNING]

- **Tipo:** D (riesgo de cierre conocido)
- **Descripción:** `story.md` enlaza `[[ADR-0013-eliminar-specs-01-projects]]` (línea 23) y lo lista en `related` (línea 15), pero el slug real del ADR es `eliminar-specs-01-projects`: es un wikilink roto en la propia historia. Además, con la línea base medida en D-11/CR-005 (56 problemas en `check`), V-08 y V-09 serán `FAIL` mientras no exista en EPIC-21 una historia de saneamiento de memoria, que hoy no figura en `epic.md`.
- **Archivo afectado:** `story.md`, frontmatter `related` y bloque "Referencias"; `epic.md`, sección "Historias"; `design.md`, CR-005
- **Acción requerida:** reescribir el wikilink y la entrada de `related` a `eliminar-specs-01-projects`, y añadir a EPIC-21 la historia de saneamiento antes de ejecutar VERIFY (CR-005).

---

## Recomendaciones

1. **INC-001:** en `epic.md` › "Criterios de salida", añadir al 6.º criterio la excepción de la lógica de migración y detección de `memory-system` (CR-001).
2. **INC-002:** en `epic.md`, reformular el 11.º criterio de salida y la línea de STORY-117 de "Historias" con el término Spec-First y Spec-as-Source como compatibilidad estructural (CR-002).
3. **INC-003:** ejecutar `/story-testcases STORY-117`, o sustituir en `design.md` (D-1, D-9) y `tasks.md` (T021) "transcrito en `testcases.md`" por "definido en D-9".
4. **INC-004:** en `story.md`, precisar el "Dado" de AC-1 (`ACCEPTANCE/DONE`, `DELIVER`, `COMPLETED` o `CANCELED`; STORY-118 fuera) y corregir la nota de `test:e2e:smoke` (CR-003, CR-004).
5. **INC-005:** en `story.md`, corregir `[[ADR-0013-eliminar-specs-01-projects]]` → `[[eliminar-specs-01-projects]]` (cuerpo y `related`), y crear en EPIC-21 la historia de saneamiento de memoria antes de VERIFY (CR-005).
6. **Granularidad (DoD, criterio 6):** si se quiere que las tareas sean más atómicas, dividir T021 (cuatro skills encadenados en una sesión) y T019 (migración, informe, seco y `check`) en subtareas de ejecución y de comprobación.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente: cobertura de pruebas no evaluada

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-117` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-117` (disponible) |

> Según D-2, IMPLEMENT solo ejecuta el grupo 1 (T001–T006) y deja la historia en `IMPLEMENT/DONE`; la evidencia se produce en VERIFY con `/story-verify STORY-117 --mode manual` (T024).

---

## Cumplimiento DoD — Fase PLAN

DoD: `docs/guardrails/dod-story-plan.md` (override `sddf.config.yaml › guardrails.dod.story.plan: dod-story-plan`), `enforcement: error`.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 y AC-3 en Dado/Cuando/Entonces; AC-2 es un esquema de escenario con 5 ejemplos |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | AC-1: D-4/D-5/D-6/D-10/D-11; AC-2: D-7/D-8/D-9; AC-3: D-3/D-12 |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Goals y D-1…D-12 llevan `// satisface: …`; las tablas de componentes e interfaces tienen la columna "AC que satisface"; los contratos tienen "AC origen" |
| No hay decisiones de arquitectura aplazadas: toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | "Open Questions: Ninguna"; ambigüedades registradas en CR-001…CR-005 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | Existe tasks.md (T001–T028) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ⚠️ | WARNING | Hay tareas para todos los escenarios (AC-1: T007–T015; AC-2: T018–T022; AC-3: T004, T025, T026). T021 encadena cuatro skills en una sesión y T019 agrupa varias comprobaciones; cada una corresponde a una sola verificación, así que se aplica la regla de duda |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md no existe |
