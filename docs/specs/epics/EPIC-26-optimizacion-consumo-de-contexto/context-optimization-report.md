---
type: report
slug: context-optimization-report.md
title: "Informe de Optimización del Consumo de Contexto"
created: 2026-10-21
updated: 2026-10-21
related:
  - EPIC-26-optimizacion-consumo-de-contexto
---

# Informe de Optimización del Consumo de Contexto

**Problema: el problema de contexto viene sobre todo de los SKILL.md demasiado largos y de cómo los orquestadores invocan a otros skills, no de AGENTS.md.** Con las mediciones actuales, una sesión de `/story-implement` en este repo consume unos **125–140K tokens**, por encima de la meta **<= 120K tokens**.

**Objetivo**: El objetivo es optimizar este repositorio y harness en cuanto al consumo de contexto, es decir, lograr bajar el contexto de sesiones a que sean menores a 120 K tokens como primera meta. Con dos cambios estructurales baja a unos 85K, y la segunda meta màs ambiciosa (65K) se alcanza con tres más. 

---

## 1. Estado medido

| Artefacto | Recomendado | Medido | Estado |
|---|---|---|---|
| AGENTS.md | 50–150 | 52 líneas | ✅ |
| SKILL.md | 40–120 (crítico >150) | **24 de 36 superan 150**; 6 superan 500 | 🔴 |
| SKILL.md más grande | — | `story-implement` con 1260 líneas / 80 KB (unos 22K tokens) | 🔴 |
| Suma de todos los SKILL.md | — | unos 12.500 líneas / 700 KB | 🔴 |
| references/*.md | 150–400 | solo 2 skills usan `references/`, y el más grande tiene 355 líneas | ⚠️ casi sin uso |
| README.md | 30–80 (crítico >100) | 484 líneas | 🔴 |
| docs/index.md (punto de entrada de la wiki) | <300 si se carga completo | 504 líneas | 🔴 |
| DoD por etapa (`guardrails/dod-story-*.md`) | — | entre 21 y 54 líneas | ✅ |
| design.md de una historia | — | hasta 42 KB (STORY-143), unos 11K tokens | 🔴 |
| graphify-out/GRAPH_REPORT.md | — | 380 KB, unos 100K tokens | 🔴 si llega a leerse |

Lo que hay que conservar: AGENTS.md es corto y delega bien, 35 de 36 skills tienen evals, `verify:repository` es un gate determinista amplio, existe el canal `.tmp/` y el ADR-0014 hace los skills independientes.

## 2. Presupuesto estimado de una sesión de `/story-implement`

Es una estimación hecha con el tamaño de los archivos a razón de unos 3,7 bytes por token.

| Componente | Tokens |
|---|---|
| Base del harness: system prompt, herramientas, catálogo de unos 42 skills, AGENTS.md y memoria | 20–25K |
| `story-implement/SKILL.md` | unos 22K |
| `skill-test-evals`, que se lee y luego se vuelve a pegar en el prompt del subagente | unos 11K |
| `skill-master` (39 KB) en las fases GREEN y REFACTOR, leído y pegado en cada una | **unos 42K** |
| Artefactos de la historia (design, tasks, story, testcases) | unos 20K |
| Salidas de las herramientas (tests, diffs) | 10–20K |
| **Total** | **125–140K** |

## 3. Hallazgos por área, de mayor a menor impacto

### Contexto

1. **🔴 Los orquestadores duplican skills completos en su propio contexto.** En [story-implement/SKILL.md:492-495](skills/story-implement/SKILL.md#L492-L495) el orquestador lee el SKILL.md del generador y lo pega "íntegro" en el prompt del subagente. Por eso ese contenido ocupa el contexto dos veces por cada fase. El arreglo es pasar solo la ruta (`skill_path`) y que el subagente lo lea en su contexto limpio. Esto ahorra entre 40 y 53K tokens por sesión. Como cambia el contrato del ADR-0002, requiere un ADR nuevo que lo reemplace (`superseded-by`).
2. **🔴 El bloque de resolución de raíz está copiado literalmente en 27 skills** (unos 6 párrafos cada uno). La frase sobre el encoding UTF-8, además en inglés, aparece en 16. Conviene reemplazarlos por un script determinista (por ejemplo `node scripts/resolve-root.js`, que devuelva `SPECS_BASE` y `ROOT_SOURCE` en JSON) más una línea de referencia en cada skill.
3. **🔴 Artefactos de historia sin tope de tamaño.** Un design.md de 42 KB entra completo en el plan, el análisis y la implementación. La regla propuesta es design.md ≤200 líneas y que los skills consumidores lean primero el resumen y las secciones por ancla.
4. **⚠️ GRAPH_REPORT.md tiene unos 100K tokens.** AGENTS.md permite leerlo "para una revisión amplia de la arquitectura". Una sola lectura rompe las dos metas. Debería prohibirse su lectura completa y permitir solo `graphify query`.
5. **⚠️ docs/index.md (504 líneas) y README.md (484 líneas)** superan el umbral para cargarse completos. Conviene un índice raíz de 80 líneas o menos, con índices por capa.

### Skills

6. **🔴 Hay 24 skills por encima de 150 líneas.** La guía [gr-skill-creation-checklist.md:56](docs/guardrails/gr-skill-creation-checklist.md#L56) fija un error a partir de 500 líneas, pero **ningún script de `verify:repository` lo comprueba**. Por eso 6 skills la incumplen: story-implement, story-implement-tasks, story-analyze, story-code-review, story-verify y story-design. Es una regla que existe solo en un documento.
7. **🔴 Casi no se usa `references/`.** `story-implement` debería tener un núcleo de unas 120 líneas (objetivo, contrato y pasos de una línea cada uno) y un archivo por fase: `references/red.md`, `green.md`, `refactor.md`, `rework.md` y `report.md`, que se cargan solo al entrar en esa fase. El mismo patrón sirve para los otros 5 skills de más de 500 líneas.
8. **⚠️ Predominan las instrucciones en negativo.** `story-implement` tiene 149 líneas con "no / nunca / NO" y `memory-system` tiene 118. Además, 16 skills usan "MUST" en inglés, aunque la regla de idioma pide español.
9. **⚠️ Faltan contratos de salida explícitos:** `epic-from-project-plan`, `header-aggregation`, `sddf-init` y `skill-preflight` no tienen sección `## Salida`.
10. **⚠️ Organización inconsistente de los agentes.** `story-code-review/agents/` y `story-verify/agents/` no siguen la ruta `assets/agents/` del ADR-0014.

### Catálogo y system prompt (se inyecta en cada sesión)

11. **⚠️ Hay entradas obsoletas o duplicadas que generan confusión:**
    - `.claude/skills/project-policies-generation` es una instalación vieja que ya no está en `skills/` y tiene una descripción casi idéntica a la de `sddf-constitution`.
    - `.claude/skills/story-fix` es un directorio sin SKILL.md.
    - `story-improve` es un alias obsoleto.
    - `docs-wiki-builder` sigue en `skills/` aunque `memory-system` dice que lo sustituye.
12. **⚠️ Cinco skills tienen `skillOverrides: name-only`** (project-flow, project-begin, project-discovery, reverse-engineering, epic-format-validation). Ahorra tokens pero quita las frases disparadoras. Es aceptable si se invocan solo con slash; en ese caso es mejor documentarlo como decisión explícita.

### Harness y reglas deterministas

13. **🔴 No hay ningún hook configurado**, ni en `.claude/settings.local.json` ni en `~/.claude/settings.json`. Hay reglas críticas que dependen solo del prompt:
    - WIP = 1: no encontré un gate que recorra `docs/specs`.
    - Inmutabilidad de los ADR aceptados.
    - No leer archivos completos de más de 300 líneas.
    - No hacer push.

## 4. Plan por metas

**Meta 1 (menos de 120K), unos 85K estimados:**
- Pasar a los subagentes la ruta del skill en vez de su contenido, con un ADR nuevo (hallazgo 1).
- Limpiar el catálogo y las instalaciones obsoletas (hallazgo 11).
- Prohibir la lectura completa de GRAPH_REPORT.md (hallazgo 4).

**Meta 2 (menos de 65K), unos 55–60K estimados:**
- Dividir `story-implement` en un núcleo de 120 líneas o menos más references por fase (−17K). Repetir el patrón con los otros 5 skills de más de 500 líneas.
- Limitar design.md a 200 líneas y leer los artefactos por sección (−8 a −10K).
- Mover la resolución de raíz a un script.
- Pedir que los subagentes devuelvan solo un `results.json` de 20 líneas o menos, nunca el log completo.

**Reglas estructurales para que no se repita:**
- Linter de tamaño en `verify:repository`: aviso por encima de 150 líneas en SKILL.md, error por encima de 300 (y bajar el umbral con el tiempo); error en `references/*.md` por encima de 500; aviso en descripciones de más de 350 caracteres.
- Linter de duplicación: si un mismo párrafo largo aparece en 3 o más SKILL.md, que vaya a `references/` o a un script.
- Hook `PreToolUse` sobre Read: bloquear o avisar al leer archivos de más de 300 líneas sin `offset`/`limit`, y bloquear GRAPH_REPORT.md.
- Hook o script de WIP = 1 antes de pasar algo a `IN-PROGRESS`, y comprobación de ADR inmutables en el gate (diff sobre ADR con `status: accepted`).

## 5. Checklist

| Pregunta | Resultado |
|---|---|
| ¿Cada skill resuelve una sola capacidad? | ⚠️ En general sí, pero los orquestadores (implement, code-review, plan) incluyen procedimientos completos de rework y reporte. |
| ¿El SKILL.md cabe en 120 líneas o menos? | ❌ Solo 11 de 36. |
| ¿Las instrucciones son positivas y medibles? | ⚠️ Son medibles (tablas y gates) pero muy negativas. |
| ¿El system prompt define rol, límites, formato y política de incertidumbre? | ⚠️ Rol y límites sí; no tiene política de incertidumbre ni formato de salida general. |
| ¿El contexto usa rutas y resúmenes en lugar de archivos completos? | ❌ Los skills se pegan íntegros y los artefactos se leen completos. |
| ¿Cada error recurrente se convirtió en regla, hook o linter? | ⚠️ Hay muchos linters, pero ningún hook, y la regla de tamaño solo existe en la documentación. |

Si quieres compartir este reporte con el equipo, puedo publicarlo como página.

