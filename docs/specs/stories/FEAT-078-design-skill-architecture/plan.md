# Plan: FEAT-078 — design-skill-architecture (modelo híbrido reference/delegate)

## Context

FEAT-078 es parte de EPIC-14 (Fábrica de Skills). El objetivo es crear design-skill-architecture como un skill de tipo reference dentro de un sistema híbrido en el que los skills complementarios pueden ser:

reference: cargan sus archivos de referencias como contexto enriquecido para el orquestador (no generan output propio)
delegate: toman control y generan un artefacto específico (para tareas altamente especializadas como TDD o benchmarking)
Para la fase de diseño (plan), design-skill-architecture es reference porque story-design ya sabe generar design.md y tasks.md — solo necesita las guías de buenas prácticas para construir skills SDDF correctamente. El orquestador hace la síntesis; el skill complementario aporta el conocimiento especializado.

story-design (orquestador)
  └── lee sddf-config.yaml
  └── skills.plan[type=reference]: carga referencias en contexto
      └── design-skill-architecture/references/ → enriquece el contexto
  └── skills.plan[type=delegate]: invoca skill activo (si hubiera)
  └── genera design.md + tasks.md con contexto enriquecido

### Tabla de tipos por skill de la Fábrica
Skill	Tipo	Motivo
design-skill-architecture	reference	Su valor son las guías de buenas prácticas; story-design ya sabe generar design+tasks
impl-skill-builder	delegate	Ejecuta ciclo TDD activo (subagentes, pressure scenarios)
test-skill-verify	delegate	Lanza benchmarks, genera reportes, falla si no se cumplen umbrales
Skills de stack (React, Python…)	reference	Guías concretas para el stack; la lógica genérica la hace el orquestador

## Archivos a crear/modificar
Acción	Archivo	Descripción
CREAR	.claude/skills/design-skill-architecture/references/skill-structure.md	Estándar de estructura de carpetas de un skill
CREAR	.claude/skills/design-skill-architecture/references/tdd-workflow.md	Ciclo RED/GREEN/REFACTOR con pressure scenarios
CREAR	.claude/skills/design-skill-architecture/references/evals-format.md	Cómo escribir evals.json y casos de prueba
CREAR	.claude/skills/design-skill-architecture/references/skill-frontmatter.md	Convenciones de frontmatter de SKILL.md (name, description, triggers, version)
CREAR	.claude/skills/design-skill-architecture/references/tasks-tdd-template.md	Plantilla de tasks.md con fases TDD explícitas
CREAR	.claude/skills/design-skill-architecture/SKILL.md	SKILL.md mínimo (documentación del skill reference)
MODIFICAR	docs/policies/sddf-config.yaml	Nueva estructura con type: reference/delegate
MODIFICAR	.claude/skills/story-design/SKILL.md	Añadir Paso 3b: leer config, cargar referencias, invocar delegates

## Implementación paso a paso

### Paso 1 — Crear los archivos de referencias

Ruta base: .claude/skills/design-skill-architecture/references/

Cada archivo es una guía en Markdown que story-design carga en contexto. Escribir con vocabulario prescriptivo (DEBE, NO DEBE) y ejemplos concretos del proyecto.

references/skill-structure.md Estructura de carpetas estándar de un skill SDDF (basada en la constitución):

skill-name/
├── SKILL.md          # obligatorio — frontmatter YAML + instrucciones
├── assets/           # templates canónicos (fuente de verdad dinámica)
├── references/       # guías y documentación de referencia
├── evals/
│   └── evals.json    # casos de prueba (definir ANTES de escribir SKILL.md)
├── examples/
│   ├── input/
│   └── output/
└── scripts/          # ejecutables en TS/Node.js si aplica
Reglas: cuándo incluir cada directorio, cuándo omitirlo, convenciones de nombre.

references/tdd-workflow.md Ciclo completo RED → GREEN → REFACTOR para skills:

RED: definir evals.json ANTES del SKILL.md; ejecutar pressure scenario sin el skill y verificar que falla
GREEN: escribir el SKILL.md mínimo que pasa el pressure scenario
REFACTOR: mejorar el skill manteniendo el pressure scenario en verde
Ejemplos de pressure scenarios (subagente que intenta una tarea sin el skill)
Criterios para pasar de cada fase a la siguiente
references/evals-format.md Formato de evals.json con esquema, campos obligatorios y 3 ejemplos:

happy path (story con Gherkin válido)
fail-fast (story sin Gherkin)
error handling (ruta inválida)
references/skill-frontmatter.md Convenciones de frontmatter YAML:

---
name: nombre-del-skill
description: >-
  Descripción de una o dos líneas. Incluir frases clave.
triggers:
  - "frase disparadora"
version: "1.0.0"   # semver obligatorio
---
Cuándo usar alwaysApply: true, invocable: true, cómo redactar description para triggering automático.

references/tasks-tdd-template.md Plantilla de tasks.md con grupos de tareas anotados por fase TDD:
```
## 1. Setup [Pre-RED]
- [ ] 1.1 Crear estructura de carpetas
## 2. Evals [RED Phase — definir ANTES del SKILL.md]
- [ ] 2.1 Escribir evals.json con pressure scenarios
## 3. SKILL.md Mínimo [GREEN Phase]
- [ ] 3.1 Escribir el mínimo SKILL.md que pasa los evals
## 4. Scripts / Assets [GREEN Phase]
- [ ] 4.1 Implementar scripts declarados en design.md
## 5. REFACTOR
- [ ] 5.1 Mejorar SKILL.md manteniendo los evals en verde
```

### Paso 2 — Crear design-skill-architecture/SKILL.md (mínimo)

SKILL.md de documentación del skill reference. No tiene flujo de ejecución porque el orquestador carga sus referencias directamente.

---
name: design-skill-architecture
description: >-
  Skill de referencia con guías de buenas prácticas para diseñar skills SDDF.
  Cargado por story-design cuando sddf-config.yaml lo declara como skill
  complementario de la fase plan. No ejecuta pasos propios — enriquece el
  contexto del orquestador con referencias de estructura, TDD y evals.
type: reference
references_path: ".claude/skills/design-skill-architecture/references"
version: "1.0.0"
---
Incluir una sección ## Referencias disponibles que liste los archivos de references/ y su propósito.

### Paso 3 — Actualizar sddf-config.yaml

Ruta: docs/policies/sddf-config.yaml

Reemplazar la sección complementary_skills (estructura plana con skills: none) por la nueva estructura con type:
```
skills:
  plan:
    - name: design-skill-architecture
      type: reference
      references_path: ".claude/skills/design-skill-architecture/references"
      description: "Guías de buenas prácticas para diseñar skills SDDF"
      required: false

  implementing:
    - name: impl-skill-builder
      type: delegate
      input: "story.md"
      output: "SKILL.md"
      description: "Implementa skills con TDD (RED/GREEN/REFACTOR)"
      required: false

  verify:
    - name: test-skill-verify
      type: delegate
      input: "SKILL.md"
      output: "evals/benchmark-report.json"
      description: "Benchmarks de calidad con umbral ≥95%"
      required: false
```
Mantener las secciones defaults, reports_dir y regression sin cambios.

### Paso 4 — Modificar story-design/SKILL.md

Ruta: .claude/skills/story-design/SKILL.md

Insertar Paso 3b entre el Paso 3 (Extraer contexto técnico, línea ~213) y el Paso 4 (Leer el template en tiempo de ejecución, línea ~215):

```
### Paso 3b — Cargar skills complementarios de la fase `plan`

Leer `docs/policies/sddf-config.yaml`.

Si el archivo no existe: emitir ⚠️ y continuar con Paso 4.

Obtener `skills.plan` (lista de skills complementarios).

**Para cada skill con `type: reference`:**
- Leer todos los archivos `.md` en `references_path`
- Añadirlos al contexto técnico interno como "Guías de referencia: <nombre-skill>"
- Emitir: `[OK] Contexto enriquecido con referencias de <nombre-skill>`

**Para cada skill con `type: delegate` y `required: false`:**
- Invocar ese skill pasándole `story.md` como entrada
- El skill produce su artefacto de output (`skill.output`)
- Si el delegate falla: emitir advertencia y continuar
- Si el delegate tiene `required: true`: si falla, detener con error

**Al completar el Paso 3b:**
- Si algún delegate completó el artefacto que story-design iba a generar (design.md):
  - Omitir los pasos de generación genérica (Pasos 4–7)
  - Continuar directamente al Paso 8 (guardar)
- Si solo hubo references: continuar con Paso 4 usando el contexto enriquecido
```

## Actualizar Dependencias del skill:

- Skills: [`skill-preflight`]
- Archivos opcionales: [`docs/policies/sddf-config.yaml`]

## Orden de ejecución
1. references/*.md          ← primero: el conocimiento que todo lo demás usa
2. SKILL.md (mínimo)        ← documentación del skill reference
3. sddf-config.yaml         ← registrar el skill con su tipo
4. story-design/SKILL.md    ← conectar el orquestador (Paso 3b)
No hay evals propios de design-skill-architecture porque es type: reference — el test es que story-design genera un design.md de mayor calidad cuando las referencias están cargadas vs. sin ellas. Esto se valida con el mecanismo test-skill-verify (FEAT-080).

## Verificación

**Con referencias cargadas**: Invocar /story-design FEAT-078. Verificar que el design.md generado incluye las secciones de skill design (estructura de carpetas, frontmatter propuesto, evals.json, fases TDD) que story-design no generaría sin el contexto de design-skill-architecture.

**Sin referencias**: Comentar design-skill-architecture en sddf-config.yaml. Invocar /story-design FEAT-078. Verificar que el design.md es más genérico (sin guías específicas de skill).

**Config ausente**: Eliminar sddf-config.yaml. Invocar /story-design. Verificar que emite ⚠️ y continúa con flujo normal.

Patrones reutilizados (no recrear)
Preflight Paso 0: story-design/SKILL.md:109-117
Tabla manejo de errores: story-design/SKILL.md:436-444
Encoding UTF-8: story-design/SKILL.md:101-103
Estructura de references/: directorio nuevo para este skill; assets/ es el equivalente más cercano en skills existentes
