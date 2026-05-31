---
alwaysApply: false
type: design
id: FEAT-079
slug: FEAT-079-story-testcases-design
title: "Design: story-testcases — generación de testcases.md desde story.md y design.md"
date: 2026-05-30
status: PLANNING
substatus: IN-PROGRESS
parent: EPIC-14-fabrica-de-skills
related:
  - FEAT-079-story-testcases
  - FEAT-078-design-skill-architecture
---

<!-- Referencias -->
[[FEAT-079-story-testcases]]
[[FEAT-078-design-skill-architecture]]

## Context

FEAT-079 introduce el skill `story-testcases`, un nuevo artefacto del pipeline SDDF que se ubica entre `story-tasking` y `story-analyze`. Su propósito es generar `testcases.md`: la fuente de verdad única de especificación de pruebas para una historia — una tabla Markdown parseable con casos tipificados (UT, CT, IT, API, E2E, EV) derivados de los criterios de aceptación de `story.md` y de las decisiones técnicas de `design.md`.

**Posición en el pipeline extendido:**
```
story-design → story-tasking → story-testcases → story-analyze → story-implement
```

`tasks.md` es opcional: si existe, enriquece la cobertura; si no, la generación procede sin él.

**Stack tecnológico del proyecto:** Markdown para skills y artefactos; TypeScript/Node.js para scripts ejecutables. Los skills son archivos SKILL.md con frontmatter YAML, residentes en `.claude/skills/`.

**Contexto normativo:** El skill debe adherirse a los patrones estructurales definidos en `docs/knowledge/guides/skill-structural-pattern.md` y ser creado usando el skill `skill-master` (TDD: evals primero, luego SKILL.md).

---

## Goals / Non-Goals

**Goals:**
- Generar `testcases.md` con tabla de casos de prueba tipificados y trazables a ACs y decisiones de diseño
- Clasificar automáticamente los casos por tipo (UT/CT/IT/API/E2E/EV) según el elemento de diseño o criterio del que derivan
- Seguir los patrones estructurales canónicos de skills SDDF (skill-master, skill-preflight, TDD)
- Integrar con `sddf-config.yaml` para cargar referencias contextuales de la fase `plan`
- Soportar `--force` para idempotencia sin interacción en CI
- Usar `tasks.md` opcionalmente para afinar cobertura sin requerirlo

**Non-Goals:**
- Generar código de tests (responsabilidad de skills como `skill-test-evals`)
- Ejecutar los tests o verificar su resultado (responsabilidad del runner de tests)
- Validar la implementación contra los casos (responsabilidad de `story-analyze` / `story-verify`)
- Forzar sintaxis Gherkin estricta (el lenguaje de los escenarios es libre — prosa o Gherkin)
- Actualizar el frontmatter de `story.md` (responsabilidad de `story-analyze`)

---

## Decisions

### D-1: Estructura de directorios del skill `story-testcases` // satisface: AC-7, AC-8

El skill sigue la estructura canónica de skills SDDF definida en `skill-structural-pattern.md`:

```
.claude/skills/story-testcases/
├── SKILL.md                          # obligatorio — frontmatter YAML + instrucciones
├── assets/
│   └── testcases-template.md         # template canónico del output (fuente de verdad dinámica)
├── evals/
│   └── evals.json                    # casos de prueba — CREADOS ANTES del SKILL.md (TDD/RED)
├── examples/
│   ├── input/
│   │   ├── story.md                  # historia de ejemplo (con ACs)
│   │   ├── design.md                 # diseño de ejemplo (con decisiones D-N)
│   │   └── tasks.md                  # tasks de ejemplo (opcional — para el escenario con tasks.md)
│   └── output/
│       └── testcases.md              # output esperado de referencia
└── agents/                           # vacío inicialmente — skill no delega a subagentes
```

**Alternativa rechazada — scripts Python para clasificación de tipos:** rechazada por KISS. La clasificación de tipo es semántica y contextual; el LLM la hace mejor que reglas estáticas de keywords.

**Alternativa rechazada — ubicar el skill en `docs/specs/stories/`:** rechazada porque los skills siempre viven en `.claude/skills/` según `constitution.md`.

**Registro npm:** La ruta `.claude/skills/story-testcases/**` debe incluirse en el campo `files` de `package.json` para que el skill se distribuya correctamente al publicar el paquete `agile-sddf` en npm (según `constitution.md` y DoD IMPLEMENTING).

---

### D-2: Frontmatter YAML de `SKILL.md` // satisface: AC-7

```yaml
---
name: story-testcases
description: >-
  Genera testcases.md con tabla de casos de prueba tipificados (UT/CT/IT/API/E2E/EV)
  derivada de story.md y design.md. Usar cuando se quieran especificar pruebas antes
  de implementar, generar testcases.md, crear tabla de casos trazables a ACs o
  necesite el artefacto de pruebas del pipeline SDDF.
triggers:
  - "story-testcases"
  - "generar casos de prueba"
  - "testcases"
  - "tabla de pruebas"
  - "especificar pruebas"
  - "casos de prueba desde story"
version: "1.0.0"
type: delegate
input: "story.md, design.md"
output: "testcases.md"
invocable: true
alwaysApply: false
---
```

**Alternativa rechazada — `type: reference`:** rechazada porque el skill genera un artefacto concreto (`testcases.md`), no guías de referencia. El tipo `delegate` es el correcto según `skill-frontmatter.md`.

---

### D-3: Template `testcases-template.md` como fuente de verdad // satisface: AC-9

El skill lee `assets/testcases-template.md` en tiempo de ejecución. Esta tabla define la estructura del output y se completa dinámicamente:

```markdown
---
type: testcases
id: {story_id}
slug: {story_slug}-testcases
title: "Test Cases: {story_title}"
story: {story_id}
created: {date}
updated: {date}
---

# Casos de Prueba: {story_title}

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | {count_ut} |
| CT   | {count_ct} |
| IT   | {count_it} |
| API  | {count_api} |
| E2E  | {count_e2e} |
| EV   | {count_ev} |

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| {id} | {tipo} | {descripción en lenguaje natural} | {precondición} | {acción} | {resultado esperado} | {AC-N / D-N / T-NNN} |

## Notas de cobertura

<!-- Observaciones sobre la cobertura derivada, decisiones de clasificación o gaps detectados -->
```

**Reglas de la columna `Ref`:**
- `AC-N` — caso derivado de un criterio de aceptación de `story.md`
- `D-N` o `sección X.Y` — caso derivado de una decisión técnica de `design.md`
- `T-NNN` — caso derivado de una tarea de `tasks.md`

**Alternativa rechazada — formato YAML en lugar de tabla Markdown:** rechazada. La historia exige explícitamente tabla Markdown parseable y legible para humanos (AC-9).

**Alternativa rechazada — mezclar código de test en testcases.md:** rechazada. El artefacto es solo especificación; el código lo generan los skills de testing (NFR-Agnóstico al framework).

---

### D-4: Algoritmo de clasificación de tipo de test // satisface: AC-5, AC-12

La clasificación no se hardcodea; el SKILL.md incluye esta tabla de reglas de inferencia que el LLM aplica al leer `story.md` y `design.md`:

| Señal en story.md o design.md | Prefijo | Tipo |
|-------------------------------|---------|------|
| Función/método público de módulo o servicio | UT | Unit |
| Componente UI (props, eventos, renderizado) | CT | Component |
| Integración entre dos componentes o servicios | IT | Integration |
| Endpoint REST definido (verbo HTTP + ruta) | API | API |
| Escenario Gherkin completo en story.md | E2E | End-to-End |
| Skill SDDF como sujeto de validación | EV | Eval |
| Store/gestor de estado global (si el proyecto lo usa) | ST | Store |

Cada regla genera la cobertura mínima:
- UT: happy path + al menos un caso de error
- CT: renderizado correcto + un caso de prop/evento edge
- IT: flujo positivo de integración
- API: request válido + respuesta esperada
- E2E: trazable 1-a-1 al escenario Gherkin de origen
- EV: happy-path del skill + caso fail-fast

**Alternativa rechazada — script TypeScript de clasificación por keywords:** rechazada porque la semántica de los elementos de diseño es ambigua para reglas estáticas; el LLM clasifica mejor con contexto.

---

### D-5: Integración con `sddf-config.yaml` para referencias de la fase `plan` // satisface: AC-10

El skill lee `docs/policies/sddf-config.yaml` en el Paso 0 (junto con preflight). Extrae `complementary_skills.plan.skills`. Para cada entrada con `type: reference`, lee los archivos `.md` en `references_path` y los añade al contexto como guías de referencia antes de derivar los casos.

Configuración vigente:
```yaml
plan:
  skills:
    - name: design-skill-architecture
      type: reference
      references_path: ".claude/skills/skill-master/references"
      required: false
```

**Comportamiento de degradación** cuando no hay skill configurado para un prefijo:
1. Emitir `[WARN] Sin skill configurado para prefijo {PREFIX} — generando tests directamente`
2. Generar los tests internamente sin delegar (comportamiento degradado, no error fatal)

**Alternativa rechazada — hardcodear la ruta de references en SKILL.md:** viola el principio de template como fuente de verdad y rompe portabilidad multicliente.

---

### D-6: Idempotencia y flag `--force` // satisface: AC-11, NFR-Idempotencia

| Condición | Comportamiento |
|-----------|---------------|
| `testcases.md` no existe | Generar directamente |
| `testcases.md` existe, sin `--force` | Preguntar: `(r)` regenerar / `(n)` no modificar |
| `testcases.md` existe, con `--force` | Sobreescribir + emitir `[INFO] testcases.md sobreescrito con --force` |

Patrón idéntico al de `story-design` y `story-tasking` — uniformidad en el pipeline.

---

### D-7: Enriquecimiento opcional con `tasks.md` // satisface: AC-2, AC-3

Flujo de decisión del skill:

```
¿Existe tasks.md?
  No  → generar desde story.md + design.md únicamente
         (sin error, sin advertencia por ausencia de tasks.md)
  Sí  → leer tasks.md como fuente secundaria
         Para tareas con tipo inferido "code" o "test":
           → derivar casos UT o IT adicionales
           → marcar Ref como "T-NNN"
         (la ausencia de tasks.md no cambia el comportamiento observable)
```

**Criterio de derivación desde tasks.md:** tareas cuyo nombre implica lógica de código (keywords: "implementar", "crear función", "validar", "refactorizar") generan casos UT; tareas que integran componentes generan IT.

**Alternativa rechazada — hacer tasks.md obligatorio:** rechazada. AC-2 es explícito: la ausencia de tasks.md no debe bloquear ni emitir advertencia.

---

### D-8: Precondiciones y fail-fast // satisface: AC-4, AC-6

| Condición | Comportamiento | AC satisfecho |
|-----------|---------------|---------------|
| Preflight falla (`SDDF_ROOT` inválido) | Detener inmediatamente, no generar archivos | AC-6 |
| `story.md` ausente | Error + detener; sugerir `/release-generate-stories` | AC-1 |
| `design.md` ausente | Error + detener; sugerir `/story-design {story_id}` | AC-1 |
| `story.md` sin secciones de criterios de aceptación | ⚠️ warning + NO generar testcases.md parcial + sugerir completar ACs | AC-4 |
| `design.md` vacío o sin decisiones | ⚠️ warning + NO generar testcases.md parcial + sugerir completar diseño | AC-4 |
| `tasks.md` ausente | Continuar sin advertencia | AC-2 |

---

### D-9: Flujo de ejecución del SKILL.md // satisface: AC-1, AC-6

Los pasos del skill siguen el patrón canónico SDDF:

```
Paso 0 — Preflight (skill-preflight) + cargar sddf-config.yaml
Paso 1 — Resolver parámetros: story_id, directorio, ruta de salida
Paso 1b — Idempotencia: si testcases.md existe, preguntar (o --force)
Paso 2 — Leer story.md: extraer ACs numerados (AC-1..AC-N) + NFRs
Paso 3 — Leer design.md: extraer decisiones técnicas (D-1..D-N) y elementos estructurales
Paso 3b — Leer tasks.md (opcional): extraer tareas con tipo "code"/"test"
Paso 4 — Leer assets/testcases-template.md en tiempo de ejecución
Paso 5 — Derivar casos de prueba:
          a. Por cada escenario Gherkin en story.md → E2E (1-a-1)
          b. Por cada elemento estructural en design.md → tipo según tabla D-4
          c. Si tasks.md presente → casos adicionales UT/IT desde tareas relevantes
          d. Verificar cobertura mínima por tipo (D-4)
Paso 6 — Completar template con los casos derivados
Paso 7 — Guardar testcases.md
Paso 8 — Confirmación (modo manual) / reporte al orquestador (modo Agent)
```

---

### D-10: Relación con `story-analyze` y actualización de estado // satisface: Notas pipeline

El skill `story-testcases` **NO actualiza** el frontmatter de `story.md`. La transición de estado es responsabilidad de `story-analyze`, que al ejecutarse valida la coherencia entre todos los artefactos disponibles (story.md, design.md, tasks.md y — tras esta historia — testcases.md).

En modo manual, el skill puede emitir: `"Para actualizar el estado de la historia, ejecuta /story-analyze"`.

---

### D-11: Creación del skill con `skill-master` siguiendo ciclo TDD // satisface: AC-7, DoD

El skill se construye siguiendo el ciclo RED → GREEN → REFACTOR:

| Fase | Artefacto | Criterio de salida |
|------|-----------|-------------------|
| RED | `evals/evals.json` (TC-001 happy-path, TC-002 fail-fast, TC-003 error-handling) | Evals escritos; sin SKILL.md aún |
| GREEN | `SKILL.md` mínimo que pasa TC-001 | Genera testcases.md con tabla correcta |
| REFACTOR | `SKILL.md` completo + evals adicionales (TC-004 --force, TC-005 tasks enrich) | Todos los evals pasan |

Los evals cubren los escenarios principales de la historia:
- `TC-001`: happy-path — story.md + design.md válidos → testcases.md con tabla correcta
- `TC-002`: fail-fast — story.md sin ACs → ⚠️ warning, no genera testcases.md
- `TC-003`: error-handling — story.md ausente → error limpio
- `TC-004`: edge-case — testcases.md ya existe + `--force` → sobreescribe sin preguntar
- `TC-005`: edge-case — tasks.md presente → casos T-NNN adicionales en Ref

---

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|-----------|
| Clasificación errónea del tipo de test (ej. IT clasificado como UT) | La tabla de reglas D-4 en SKILL.md guía al LLM; los evals TC-001 verifican clasificación en casos canónicos |
| testcases.md excesivamente extenso para historias con muchos ACs | Resumen de cobertura (tabla de conteo) permite identificar el volumen rápidamente |
| `references_path` de sddf-config.yaml apunta a ruta inexistente | Emitir ⚠️ y continuar con generación genérica (degradación no fatal, D-5) |
| `story-analyze` no sabe validar `testcases.md` | CR-002 registrado; extensión de story-analyze es trabajo separado |
| `story-plan` no incluye `story-testcases` en su cadena | CR-001 registrado; actualización de story-plan es trabajo separado |
| Lenguaje libre en escenarios produce inconsistencia entre historias | El template D-3 guía la estructura con columnas fijas; la variación es solo en el contenido de las celdas |

---

## Open Questions

Sin preguntas abiertas. Todas las ambigüedades se resolvieron en el diseño o se registraron como CR.

---

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: `story-plan` orquesta `story-design → story-tasking → story-analyze`. Para incluir el nuevo artefacto, debe actualizarse a `story-design → story-tasking → story-testcases → story-analyze`.
- **Documento afectado**: `.claude/skills/story-plan/SKILL.md`
- **Acción requerida**: planificar la actualización de story-plan como tarea adicional en esta historia o como historia separada. Requiere decisión del PO sobre el alcance.

### CR-002
- **Tipo**: dependencia
- **Descripción**: `story-analyze` valida la coherencia entre `story.md`, `design.md` y `tasks.md`. Al agregar `testcases.md` como artefacto del pipeline, story-analyze debe poder validar también su coherencia con los ACs de story.md y las decisiones de design.md.
- **Documento afectado**: `.claude/skills/story-analyze/SKILL.md`
- **Acción requerida**: verificar si story-analyze ya incluye lógica para validar testcases.md; si no, planificar extensión como historia separada.
