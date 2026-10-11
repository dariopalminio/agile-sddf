---
type: plan
slug: plan-05-move-dod-story
title: "Mover `dod-story.md` de `policies/` a `guardrails/dod-story-checklist.md`"
---

# Mover `dod-story.md` de `policies/` a `guardrails/dod-story-checklist.md`

## Contexto

`docs/policies/dod-story.md` es un **transition guardrail** (checklist con severidades que bloquea transiciones de estado de una historia), no una policy. `docs/architecture/memory-system.md` ya lo declara así (§3 árbol, §8 anti-patrón "Poner `dod-story.md` en `policies/`") y `docs/domains/domain-knowledge-artifacts.md` §6 define la diferencia. El archivo vive en la capa equivocada; hay que moverlo a `docs/guardrails/dod-story-checklist.md` y actualizar todo lo que lo referencia **en vivo** (skills, scripts, docs activas, templates), sin reescribir historia (specs, ADRs, CHANGELOG pasado).

Decisiones tomadas con el usuario:
- **Compatibilidad:** los skills consumidores buscan primero `$SPECS_BASE/guardrails/dod-story-checklist.md`; si no existe, hacen fallback a `$SPECS_BASE/policies/dod-story.md` con aviso de deprecación.
- **Frontmatter:** `type: guardrail`, `kind: transition`, `enforcement: error`, `slug: dod-story-checklist` (en el archivo y en el template generador).

## Cambios

### 1. Mover el archivo (con `git mv`)

`docs/policies/dod-story.md` → `docs/guardrails/dod-story-checklist.md`

Frontmatter nuevo:
```yaml
alwaysApply: false
type: guardrail
kind: transition
enforcement: error
slug: dod-story-checklist
title: "Definition of Done — Story (transition guardrail)"
created/updated: (conservar)
```
Conservar el comentario HTML explicativo y todo el cuerpo. Añadir al inicio del cuerpo una nota de dos líneas (estilo de los `gr-*`): a qué aplica (transiciones de estado de historias: SPECIFY → PLAN → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE) y que los guardrails de contenido viven en `gr-*-checklist.md`.

### 2. Template generador

`skills/project-policies-generation/assets/definition-of-done-story-template.md` → renombrar a `assets/dod-story-checklist-template.md` y aplicar el mismo frontmatter (`type: guardrail`, `kind: transition`, `enforcement: error`, `slug: dod-story-checklist-template`).

`skills/project-policies-generation/SKILL.md` (22 refs): ruta de salida `$SPECS_BASE/guardrails/dod-story-checklist.md`; crear `guardrails/` si no existe; referencia en CLAUDE.md pasa a `@docs/guardrails/dod-story-checklist.md`; descripción del frontmatter ("Inicializa o actualiza constitution.md y dod-story-checklist.md…"); paso de migración: si existe `policies/dod-story.md` y no la nueva, ofrecer moverlo (con confirmación) en lugar de crear uno nuevo.

### 3. Skills consumidores — patrón "nueva ruta + fallback"

Reemplazar en cada uno el paso "Buscar `$SPECS_BASE/policies/dod-story.md`" por:

```
1. Buscar `$SPECS_BASE/guardrails/dod-story-checklist.md`
2. Si no existe, buscar `$SPECS_BASE/policies/dod-story.md`; si existe, usarlo y emitir:
   ⚠️ policies/dod-story.md está deprecado — muévelo a guardrails/dod-story-checklist.md
3. Si ninguno existe → comportamiento actual (omitir validación DoD / criterios genéricos)
```

Archivos y puntos a tocar (mensajes de error, tablas de entradas, comentarios de reportes):
- `skills/story-design/SKILL.md` (L52, L193-196, L475)
- `skills/story-analyze/SKILL.md` (L74, L181-184, L540, L667) + `assets/analyze-report-template.md` L99
- `skills/story-implement-tasks/SKILL.md` (L70, L383-387, L610, L749)
- `skills/story-implement/SKILL.md` (L124, L184, L962) + `evals/evals.json` (rutas `docs/policies/dod-story.md` en fixtures → nueva ruta; son datos de whitelist/`archivo_linea`, actualizar de forma consistente)
- `skills/story-code-review/SKILL.md` (L75, L252, L260, L291, L414, L479, L539, L640) + `agents/*.agent.md` (descripción de `$DOD_PATH`, 4 archivos) + `examples/example-needs-changes-medium/fix-directives.md`
- `skills/story-verify/SKILL.md` (L39, L57, L180-184) + `README.md` L68
- `skills/story-acceptance/SKILL.md` (L50, L62, L184, L503) + `evals/evals.json` L109
- `skills/sddf-init/SKILL.md` (L131, L160: informe final muestra `docs/guardrails/dod-story-checklist.md`)

### 4. Docs activas

- `AGENTS.md` L35 (árbol: `policies/ # constitution.md` · `guardrails/ # gr-*-checklist.md, dod-story-checklist.md`) y L85 (`@docs/guardrails/dod-story-checklist.md`)
- `README.md` L217 (árbol), L248, L416 (enlace)
- `docs/index.md` L29 → `[[dod-story-checklist]] — [dod-story-checklist.md](guardrails/dod-story-checklist.md)`
- `docs/policies/constitution.md` L51 → `../guardrails/dod-story-checklist.md`
- `docs/guardrails/README.md`: convención pasa a distinguir **content guardrails** (`gr-<ámbito>-checklist.md`) y **transition guardrails** (`dod-<workitem>-checklist.md`); añadir fila al índice con ámbito "transiciones de estado de historia" y sin prefijo de id.
- `docs/architecture/memory-system.md` L106 → `dod-story-checklist.md`; L216 anti-patrón sigue válido (mantener).
- `docs/domains/domain.md` L201 → nueva ruta.
- `skills/docs-wiki-builder/assets/wiki-index-template.md` L52 → `[[dod-story-checklist]]`.
- `CHANGELOG.md`: entrada en `[Unreleased]` → `Changed` (movido + fallback deprecado). No editar entradas pasadas.

### 5. No tocar

- `docs/specs/**`, `docs/adr/**`, entradas históricas de `CHANGELOG.md` (registros; `check-doc-links.js` los excluye).
- `scripts/check-doc-links.js` ya escanea `docs/guardrails`; `verify-skill-security-workflow.js` ya incluye ambas carpetas. `audit-root-resolution.js` solo lista `constitution.md`. Sin cambios en scripts salvo que las pruebas fallen.
- Copias instaladas en `.claude/`, `.agents/`, `.github/` (no son fuente).

## Verificación

1. `git status` muestra el rename (`R docs/policies/dod-story.md -> docs/guardrails/dod-story-checklist.md`).
2. `grep -rn "policies/dod-story" skills/ AGENTS.md README.md docs/index.md docs/policies docs/guardrails docs/architecture docs/domains` devuelve solo las líneas de fallback/deprecación.
3. `node scripts/check-doc-links.js` pasa (enlaces de README, index, policies, guardrails).
4. `npm run test:installer` y `node scripts/audit-root-resolution.js` (comandos `verify.unit`/`integration` de `sddf.config.yaml`) siguen en verde.
5. `npm run test:eval -- story-implement story-acceptance` (o el runner de evals para los dos skills cuyos `evals.json` cambian) sigue pasando.
6. Lectura manual: `docs/guardrails/README.md` y `AGENTS.md` describen la nueva ubicación de forma consistente.

