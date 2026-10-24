---
type: testcases
id: STORY-099
slug: STORY-099-sddf-init-level-full-testcases
title: "Test Cases: Inicializar la memoria completa desde sddf-init con el parámetro --level"
story: STORY-099
created: 2026-09-21
updated: 2026-09-21
related:
  - STORY-099-sddf-init-level-full
---

<!-- Referencias -->
[[STORY-099-sddf-init-level-full]]

# Casos de Prueba: Inicializar la memoria completa desde sddf-init con el parámetro --level

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 0 |
| CT   | 0 |
| IT   | 3 |
| API  | 0 |
| E2E  | 2 |
| EV   | 6 |

## Tabla de casos

<!-- Reglas de columnas:
  ID      : prefijo-NNN donde prefijo ∈ {UT, CT, IT, API, E2E, EV, ST}; NNN secuencial desde 001
  Tipo    : Unit | Component | Integration | API | End-to-End | Eval | Store
  Escenario: descripción breve en lenguaje natural — no Gherkin estricto
  Dado    : precondición del escenario
  Cuando  : acción que dispara el comportamiento
  Entonces: resultado esperado verificable
  Ref     : AC-N (origen story.md) | D-N / sección X.Y (origen design.md) | T-NNN (origen tasks.md)
-->

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| E2E-001 | End-to-End | sddf-init --level full invoca memory-system scaffold | Dos directorios temporales vacíos sin `sddf.config.yaml`; `memory-system` instalado | En A se ejecuta `/sddf-init --level full`; en B `/sddf-init` y después `/memory-system scaffold` (misma respuesta a la pregunta de políticas) | A tiene `sddf.config.yaml`, `.env.template`, `specs/01..03`, `templates/` con 6 plantillas, 11 capas y `constitution.md`; el informe de A contiene el bloque `── memory-system scaffold (nivel full) ──`; el listado de archivos de A es idéntico al de B | AC-1, NFR-3, D-2, D-3, F-1 |
| E2E-002 | End-to-End | minimal y standard no invocan el scaffolding | Directorio temporal vacío | Se ejecuta `/sddf-init` sin argumentos, luego en otro directorio `--level standard`, luego en otro `--level minimal` | Sin argumentos y `standard`: informe idéntico al de la versión anterior (directorios, 5 templates, config, `.env.template`, pregunta de políticas) y sin mención a `memory-system`; `minimal`: solo directorios base, `sddf.config.yaml` y `.env.template`, sin `templates/*.md`, sin pregunta, con `[OMITIDO] project-policies-generation (nivel minimal)` | AC-2, AC-3, NFR-1, D-1, D-4, F-2, F-3 |
| IT-001 | Integration | Paso 5b captura y concatena el informe de scaffold | Directorio vacío; `memory-system` instalado | `sddf-init --level full` llega al Paso 5b | Se invoca `memory-system scaffold --yes` inline; su informe aparece tal cual bajo el encabezado del bloque; los cinco templates compartidos figuran `[CREADO]` en el bloque de `sddf-init` y `[PRESERVADO]` en el de scaffold; la línea de cierre lleva `(nivel full)` | AC-1, NFR-3, D-2, CR-001, T004, T005 |
| IT-002 | Integration | Degradación sin memory-system instalado | Directorio vacío; `$CLI_ROOT/skills/memory-system/` ausente | Se ejecuta `/sddf-init --level full` | Pasos 1–5 completos; aviso `⚠️ memory-system no está instalado — nivel full termina como standard`; informe sin bloque de scaffold; sin error | AC-1, D-2, F-4, CR-003, T004 |
| IT-003 | Integration | Orden 5 → 5b preserva la constitución de políticas | Directorio vacío; el usuario responde `sí` a la pregunta de políticas | Se ejecuta `/sddf-init --level full` | `project-policies-generation` crea `docs/constitution.md`; el bloque de scaffold lo marca `[PRESERVADO]` (no lo sobrescribe con la semilla) | AC-1, D-4, CR-002, T003, T004 |
| EV-001 | Eval | sddf-init sin flags (regresión) | Proyecto nuevo sin configuración ni override | Skill invocado sin argumentos | Los casos TC existentes de `sddf-init` pasan sin cambios; la salida no contiene `memory-system` | AC-2, NFR-1, D-5, T001, T007 |
| EV-002 | Eval | sddf-init --level minimal | Proyecto nuevo | Skill invocado con `--level minimal` | La salida contiene `[OMITIDO] project-policies-generation (nivel minimal)`, `sddf.config.yaml` y `.env.template`; no contiene `templates/story-template.md` ni `¿Deseas inicializar los documentos de políticas` | AC-2, AC-3, D-1, D-4, T001 |
| EV-003 | Eval | sddf-init --level full | Proyecto nuevo; `memory-system` instalado | Skill invocado con `--level full` | La salida contiene `── memory-system scaffold (nivel full) ──`, `creados:` y `[PRESERVADO] docs/templates/story-template.md` | AC-1, D-2, T001 |
| EV-004 | Eval | sddf-init --level full sin memory-system | Proyecto nuevo; skill ausente | Skill invocado con `--level full` | La salida contiene `memory-system no está instalado — nivel full termina como standard` y no contiene `creados:` | AC-1, D-2, T001 |
| EV-005 | Eval | sddf-init --level foo (fail-fast) | Proyecto nuevo | Skill invocado con `--level foo` | La salida contiene `--level no admitido: foo` y no contiene `[CREADO]`; ningún archivo creado | AC-3, D-1, F-4, T001 |
| EV-006 | Eval | sddf-init --level full idempotente | Proyecto ya inicializado con `full` | Skill invocado con `--level full` de nuevo | La salida contiene `[YA EXISTÍA]` y `creados: 0`; no contiene `[ERROR]` | NFR-2, D-2, T001 |

## Notas de cobertura

- `tasks.md` fue usado como enriquecimiento: `T-NNN` apunta al SKILL.md (T003–T005) y a
  los evals (T001, T007).
- Los dos escenarios Gherkin de `story.md` tienen E2E 1-a-1 (E2E-001 `full`, E2E-002
  `minimal`/`standard`).
- No hay casos UT: esta historia no añade código ejecutable; toda la lógica vive en el
  `SKILL.md` de `sddf-init` (Markdown) y se verifica con evals e integración. No hay CT ni
  API. No aplica ST ni PT.
- AC-4 (cambio mínimo) se verifica por revisión del diff (V-8, T006), no con caso de
  prueba.
- EV-003, IT-001 e IT-003 dependen de STORY-096 (`scaffold --yes`); IT-002 y EV-004 cubren
  la ausencia del skill y pueden ejecutarse antes.
- EV con `npm run test:eval -- sddf-init`; E2E/IT en directorios temporales (T012).

## Test Cases Progress for STORY-099

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
- [x] E2E-001: sddf-init --level full invoca memory-system scaffold
- [x] E2E-002: minimal y standard no invocan el scaffolding
- [x] IT-001: Paso 5b captura y concatena el informe de scaffold
- [ ] IT-002: Degradación sin memory-system instalado
- [x] IT-003: Orden 5 → 5b preserva la constitución de políticas
- [x] EV-001: sddf-init sin flags (regresión)
- [x] EV-002: sddf-init --level minimal
- [x] EV-003: sddf-init --level full
- [x] EV-004: sddf-init --level full sin memory-system
- [x] EV-005: sddf-init --level foo (fail-fast)
- [x] EV-006: sddf-init --level full idempotente
