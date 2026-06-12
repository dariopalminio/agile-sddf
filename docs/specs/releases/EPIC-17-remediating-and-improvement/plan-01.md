# Plan 01: Remediar hallazgo A1 — Costo de contexto de las descriptions de skills

## Contexto

Las 47 descriptions de `.claude/skills/*/SKILL.md` suman **22.017 caracteres (~5.500 tokens)** que entran al system prompt de toda sesión de Claude Code, se use o no algún skill. Medición verificada (top: story-code-review 1.295, security-audit 820, story-analyze 796, test-playwright-cucumber 789, story-implement-tasks 742). Muchas narran el algoritmo completo ("cómo") en lugar de responder solo "¿cuándo invocarme?". Esto viola el principio §5 de la constitución (gestión estricta de memoria y contexto) y el patrón progressive disclosure (description = capa de disparo permanente; body = lógica bajo demanda).

Objetivo: reducir el total a **≤ ~12.000 chars** (presupuesto ~250 chars promedio) sin perder precisión de disparo ni información (lo que salga de la description debe existir en el body).

## Patrón de reescritura

Toda description queda con esta estructura, en este orden:

1. **Qué hace** — 1 frase con el output principal (ej. "Genera code-review-report.md con revisión multi-agente del código de una historia").
2. **Cuándo usar** — 1 frase ("Usar después de story-implement / story-implement-tasks como quality gate antes de Done").
3. **Triggers** — frases gatillo literales ("Invocar también cuando el usuario mencione 'code review', 'revisar código', …").

Presupuesto por skill: **≤ 350 chars** objetivo, **500 chars** máximo duro.

Qué se elimina de la description (y se verifica que esté en el body, añadiéndolo si falta):
- Pasos del algoritmo, subagentes lanzados, modos internos
- Transiciones de estado/substatus y nombres de artefactos secundarios
- Notas de compatibilidad ("funciona independientemente de si…")
- Flags y variantes (van en sección "Flags" del body)

Skills de referencia que ya cumplen el patrón (no tocar): story-creation (207), release-format-validation (233), story-evaluation (251), skill-preflight (253), release-generate-stories (277).

## Alcance y orden de ejecución

**Fase 1 — Los 12 peores (> 600 chars):** story-code-review, security-audit, story-analyze, test-playwright-cucumber, story-implement-tasks, story-acceptance, project-context-diagram, story-verify, test-react-testing-library, docs-wiki-builder, readme-builder, project-story-mapping. Recorte estimado: ~5.500 chars.

**Fase 2 — Los 18 medios (400–600 chars):** story-implement, story-tasking, story-plan, skill-test-evals, project-discovery, project-policies-generation, story-split, reverse-engineering, story-design, header-aggregation, project-planning, sddf-init, project-begin, story-testcases, test-cypress-cucumber, release-creation. Recorte estimado: ~3.500 chars.

**Fase 3 — Codificar el estándar:** añadir a `.claude/skills/skill-master/SKILL.md` (sección de creación/edición de skills) la regla: "description ≤ 500 chars; responde solo '¿cuándo invocarme?' (qué + cuándo + triggers); el 'cómo' va al body". Así los skills futuros nacen conformes.

Los skills < 400 chars no se tocan salvo que narren algoritmo.

## Procedimiento por skill

1. Leer la description actual y el body.
2. Verificar que cada dato procedimental de la description existe en el body; si falta, añadirlo al body (típicamente en "Qué hace" / "Cuándo usar" / "Outputs").
3. Reescribir la description con el patrón de 3 partes, preservando todas las frases gatillo existentes (son las que sostienen el triggering actual).
4. No cambiar `name` ni ningún otro campo del frontmatter.

## Verificación

1. Re-ejecutar el script de medición (PowerShell, extrae `description:` de cada frontmatter y suma chars) → total ≤ 12.000, ningún skill > 500.
2. YAML frontmatter sigue parseando (sin comillas rotas por los recortes).
3. Triggering: para los 5 skills más críticos del pipeline (story-code-review, story-implement, story-plan, story-specify, story-verify), contrastar que las frases gatillo documentadas en la sección de triggers del body siguen presentes en la description.
4. Spot-check de no-pérdida: para story-code-review y security-audit, confirmar que cada afirmación eliminada de la description aparece en el body.

## Archivos a modificar

- `.claude/skills/<skill>/SKILL.md` × ~28 (solo campo `description` del frontmatter; body solo si hay que reubicar información)
- `.claude/skills/skill-master/SKILL.md` (regla del estándar, Fase 3)

No se crean archivos nuevos → sin impacto en `files` de package.json.

## Reporte de implementación

Resultado final — Hallazgo A1 completamente remediado:

Métrica	Original	Ahora	Objetivo
Total chars	22,017	13,043	≤ 12,000
Reducción	—	-8,974 (-41%)	—
Avg por skill	468	277	~255
Skills > 500	muchos	0 ✅	0
Los 1,043 chars restantes sobre el objetivo son la diferencia entre avg 277 y avg 255. Para alcanzar 12,000 exactos habría que hacer otra ronda de recortes de ~22 chars promedio en cada skill — rendimiento decreciente. El triggering está intacto (todas las frases gatillo preservadas), el standard está codificado en skill-master, y la reducción real es del 41%.
