---
type: plan
id: plan-15
slug: plan-15-improve-invocation-in-story-implement
title: "Formalización de la invocación de code_generators en story-implement (ADR-0002)"
status: COMPLETED
substatus: DONE
parent: EPIC-17
created: 2026-06-13
updated: 2026-06-13
related:
  - EPIC-17-remediating-and-improvement
---

# Plan: Formalizar la invocación de code_generators en story-implement (ADR-0002)

## Contexto

El usuario identificó que `story-implement` invoca skills como `code-frontend-library-react` de forma **implícita**. La línea exacta en el SKILL.md (l. 452) es:

> "Invocar el skill `{skill}` pasando el bundle."

Esa instrucción no especifica el mecanismo (qué herramienta usar, cómo construir el prompt, cómo pasar el contexto). El harness la interpreta "por inferencia", que es exactamente el problema que ADR-0002 y la constitución §6 prohíben: *"funciona por inferencia, no por contrato"*.

La pregunta es: ¿la solución es mover los code_generators a `.claude/agents/`?

---

## Análisis: por qué NO mover a `.claude/agents/`

`.claude/agents/` es para agentes **globales** que el harness registra como subagent_type. Todos inyectan su descripción en el system prompt de cada sesión (costo de contexto permanente). Los agentes registrados son, por diseño, para discovery/planning reutilizable (project-architect, project-pm, story-product-owner, reverse-engineer-*).

`code-frontend-library-react` es:
- Un **skill de stack** específico (React + CSS BEM + design tokens), no un agente de propósito general
- Invocable directamente por el usuario (`/code-frontend-library-react`)
- Configurable via `sddf.config.yaml` → agnóstico al stack: mañana puede ser `code-frontend-nuxt`, `code-backend-nestjs`, etc.
- Independiente del pipeline de story-implement

Moverlo a `.claude/agents/` implicaría:
- Inyectar una descripción de stack React en **cada sesión** aunque no se use story-implement
- Perder la configurabilidad via `sddf.config.yaml`
- Romper la posibilidad de invocarlo directamente como skill

**La solución correcta es formalizar la invocación en `story-implement/SKILL.md` siguiendo el contrato explícito del ADR-0002**, sin cambiar dónde viven los code_generators.

---

## Solución: invocación explícita de 4 pasos (ADR-0002)

El mismo contrato que story-code-review usa con sus agentes locales (Paso 3b, ADR-0002) aplica aquí:

```
1. Read  →  .claude/skills/{skill}/SKILL.md
2. Agent tool  →  subagent_type: general-purpose
                  prompt: <contenido íntegro del SKILL.md> + <bloque de contexto con variables resueltas>
3. El subagente escribe  →  .tmp/story-implement/{fase}/{layer}/results.json
4. Orquestador lee  →  solo los resultados de .tmp/
```

---

## Cambios en story-implement/SKILL.md

### Sección a modificar 1 — Paso 3 de Fase RED (l. ~255)

**Texto actual:**
```
3. Invocar el skill pasando el bundle construido
4. El subagente escribe sus resultados en `.tmp/story-implement/{tipo}/results.json`
```

**Texto propuesto:**
```
3. Invocar el skill siguiendo el contrato ADR-0002:
   a. Leer `.claude/skills/{skill}/SKILL.md` con Read
   b. Lanzar subagente vía Agent tool con subagent_type: general-purpose, cuyo prompt es:
      - Contenido íntegro del SKILL.md leído
      - Bloque de contexto con las variables resueltas:
        ```
        Contexto de invocación:
        - story_id: {$RED_STORY_ID}
        - testcases_path: {$TESTCASES_PATH}
        - story_path: {$STORY_PATH}
        - design_path: {$DESIGN_PATH}
        - e2e_context: {$E2E_CONTEXT}   ← solo para tipo e2e
        ```
4. El subagente escribe sus resultados en `.tmp/story-implement/{tipo}/results.json`
```

### Sección a modificar 2 — Paso 9 de Fase GREEN (l. ~450-454)

**Texto actual:**
```
Mostrar: `[GREEN/{layer}] → invocando {skill}...`

Invocar el skill `{skill}` pasando el bundle.

El subagente escribe sus resultados en `.tmp/story-implement/green/{layer}/results.json`.
```

**Texto propuesto:**
```
Mostrar: `[GREEN/{layer}] → invocando {skill}...`

Invocar el skill siguiendo el contrato ADR-0002:
1. Leer `.claude/skills/{skill}/SKILL.md` con Read
2. Lanzar subagente vía Agent tool con subagent_type: general-purpose, cuyo prompt es:
   - Contenido íntegro del SKILL.md leído
   - Bloque de contexto con las variables resueltas:
     ```
     Contexto de invocación:
     - story_id: {$RED_STORY_ID}
     - phase: GREEN
     - layer: {layer}
     - test_files: {$RED_FILES_GENERATED}
     - story_path: {$SPECS_BASE}/specs/stories/{story_id}*/story.md
     - design_path: {$SPECS_BASE}/specs/stories/{story_id}*/design.md
     ```
3. El subagente escribe sus resultados en `.tmp/story-implement/green/{layer}/results.json`
```

### Sección a modificar 3 — Fase REFACTOR (misma mecánica que GREEN)

Misma sustitución que Paso 9, cambiando `phase: GREEN` → `phase: REFACTOR` y las rutas `.tmp/story-implement/green/` → `.tmp/story-implement/refactor/`.

### Sección sin cambios — Arquitectura de delegación (l. 771-787)

El diagrama ya es correcto. Solo añadir una nota bajo el diagrama:
```
La invocación sigue el contrato de 4 pasos del ADR-0002: Read del SKILL.md → Agent tool
(subagent_type: general-purpose) → output en .tmp/ → Read de resultados.
```

---

## Archivos afectados

| Archivo | Cambio |
|---|---|
| `.claude/skills/story-implement/SKILL.md` | 3 secciones de invocación: Fase RED (Paso 3), Fase GREEN (Paso 9), Fase REFACTOR |
| `docs/adr/ADR-0002-*.md` | Ninguno — el ADR ya define el contrato correctamente |
| `.claude/skills/code-frontend-library-react/SKILL.md` | Ninguno — permanece como skill independiente |

---

## Lo que NO cambia

- `code-frontend-library-react` y demás code_generators permanecen en `.claude/skills/` (no se mueven a `.claude/agents/`)
- `sddf.config.yaml` sigue siendo la fuente de configuración de code_generators
- La arquitectura de delegación (diagrama) no cambia, solo se especifica el mecanismo

---

## Verificación

1. Leer el SKILL.md actualizado y confirmar que las 3 secciones de invocación mencionan `Read`, `Agent tool`, `subagent_type: general-purpose` y el bloque de contexto
2. Comparar con story-code-review/SKILL.md (patrón de referencia) y confirmar equivalencia estructural
3. Ejecutar `/skill-test-evals evals story-implement` para confirmar que los evals existentes siguen pasando

