# Cierre de la migración release→epic / FEAT→STORY: alinear gate, evals y documentación normativa

## Contexto

La migración de STORY-086 (commits `2b02009`, `472d4ae`, `a63be8a`) renombró el nivel L2 de
`release` a `epic`, renumeró los directorios de specs (`01-projects` / `02-epics` / `03-stories`)
y cambió el prefijo `FEAT-` por `STORY-`. Los templates canónicos y los skills de generación
quedaron migrados, pero **el gate de calidad, sus evals y la documentación normativa se
quedaron en el contrato anterior**.

El defecto de mayor impacto: `epic-format-validation` valida un contrato que ya no existe
(campos Markdown `**Título**` / `**Versión**` / `**Estado**` / `**Fecha**` y sección
`## Features`), mientras el template vigente usa frontmatter YAML y `## Historias`.
Verificado en [epic-template.md:1-28](docs/specs/templates/epic-template.md#L1-L28) contra
[SKILL.md:138-158](skills/epic-format-validation/SKILL.md#L138-L158): **el gate devolvería
REFINAR sobre una épica canónica válida**, bloqueando `epic-generate-stories` según la regla 10
de la constitución.

Durante la verificación aparecieron dos productores de épicas que escriben el campo legacy
`date:` en lugar de `created`/`updated`. Arreglar solo el validador movería el falso REFINAR
de sitio en vez de eliminarlo, así que entran en el alcance (decisión confirmada).

**Resultado esperado:** una épica generada por cualquier productor del framework pasa el gate;
los evals prueban el contrato vigente; CLAUDE.md y la constitución describen la estructura real.

---

## 1. `epic-format-validation` — corrección funcional (crítico)

Archivo: [skills/epic-format-validation/SKILL.md](skills/epic-format-validation/SKILL.md)

**Paso 3 (líneas 132-143)** — reescribir la derivación del contrato. Las secciones ya se
extraen bien del marcador `<!-- sección obligatoria`; corregir el "Resultado esperado" y
añadir la derivación del frontmatter:

- Resultado esperado a partir del template actual: `Descripción`, `Historias`,
  `Flujos Críticos / Smoke Tests` (sustituye a `Features`).
- Claves de frontmatter: leer el bloque `---` del template y exigir todas sus claves **menos**
  una allowlist documentada de opcionales: `alwaysApply`, `parent`, `related`.
  Resultado con el template actual: `type`, `id`, `slug`, `title`, `status`, `substatus`,
  `created`, `updated`.
- Dejar explícito *por qué* la allowlist existe (son claves nullables o de configuración del
  documento, no del contrato), para que un cambio de template no obligue a tocar el skill.

**Paso 4a (líneas 151-159)** — validar claves YAML `clave:` dentro del bloque `---`,
no patrones Markdown `**Campo**:`.

**Coherencia:** la restricción de "Extracción dinámica" (línea 66) y la sección `## Salida`
ya son correctas; solo cambia lo que se deriva y cómo se busca.

## 2. Alinear los productores con el frontmatter canónico

Necesario para que el gate corregido no rechace lo que el propio framework genera.

- [skills/epic-creation/SKILL.md:142](skills/epic-creation/SKILL.md#L142) y la tabla del
  Paso 3 (línea ~152): campos obligatorios `slug, title, date, status` → contrato canónico
  (`type`, `id`, `slug`, `title`, `status`, `substatus`, `created`, `updated`); la fila `date`
  de la tabla pasa a `created`/`updated`.
- [skills/epic-from-project-plan/SKILL.md:71](skills/epic-from-project-plan/SKILL.md#L71):
  la extracción de `**Fecha:**` y el bloque de ejemplo de la línea 154-160 (`date:`) se alinean
  con `created`/`updated`; el ejemplo debe incluir `type: epic`, `id`, `slug`.
- Mismo archivo, **línea 66**: el parser espera `### Épica NN — Nombre`, pero
  [project-plan-template.md:46,60](docs/specs/templates/project-plan-template.md#L46-L60)
  genera `### Épica Walking Skeleton: MVP` y `### Épica 1: [Nombre]` (dos puntos, y un bloque
  sin ID numérico). El `project-plan.md` vivo usa la forma con `—`. Aceptar ambos separadores
  (`—` y `:`) y contemplar el bloque `Walking Skeleton` sin `NN`, documentando qué ID recibe.

**No tocar** `skills/epic-creation/assets/epic-template.md`: verificado idéntico al canónico
salvo el prefijo `STORY-[INDEX]` en `## Historias`. Es el fallback correcto.

## 3. Migrar los evals de los tres skills L2 (alto)

Patrón único aplicado a los tres `evals/evals.json`: sustituir en fixtures, nombres de caso,
descripciones, contextos y expectativas el vocabulario obsoleto `Features` → `Historias`,
"features" → "historias", `Version`/`Fecha` → claves YAML canónicas.

- [epic-format-validation/evals/evals.json](skills/epic-format-validation/evals/evals.json):
  TC-003 `contains: [..., "Features"]` → `"Historias"`; TC-004 `["Version", "Fecha"]` →
  `["created", "updated"]`, y renombrar el fixture `EPIC-03-sin-frontmatter` a algo que
  describa el caso real (frontmatter incompleto). Añadir un caso que cubra el defecto
  regresado: **épica canónica completa → APROBADO** con `not_contains: ["REFINAR"]`.
- [epic-generate-stories/evals/evals.json](skills/epic-generate-stories/evals/evals.json):
  líneas 4, 10, 58, 60, 62 y el contexto de asignación lazy (línea 108) — incluye renombrar el
  caso "sección Features ausente" y el directorio de fixture `EPIC-02-sin-features`.
- [epic-generate-all-stories/evals/evals.json](skills/epic-generate-all-stories/evals/evals.json):
  líneas 4, 85, 87, 89.

Los `SKILL.md` de los dos generadores ya consumen `## Historias` (verificado): **solo cambian
los evals**.

## 4. Migrar `project-architect` al contrato actual (alto)

Archivo: [agents/project-architect.agent.md](agents/project-architect.agent.md)

- **Rutas sin directorio de proyecto** (líneas 32-33, 40-43, 103-104, 111-113, 129, 182):
  `$SPECS_BASE/specs/01-projects/<archivo>.md` → `$SPECS_BASE/specs/01-projects/$PROJ_DIR/<archivo>.md`.
  El orquestador ya resuelve `$PROJ_DIR` en su Paso 0b
  ([project-planning/SKILL.md:88-98](skills/project-planning/SKILL.md#L88-L98)) y se lo pasa
  resuelto en el Paso 5; el agente debe declarar `PROJ_DIR` como entrada recibida y no asumir
  proyecto único.
- **Ruta acoplada a Claude** (línea 119): `.claude/skills/project-planning/assets/project-plan-template.md`
  → recibir la ruta del template resuelta por el orquestador. Contradice la regla de agnosticismo
  de plataforma de `CLAUDE.md` y rompe en instalaciones `.agents/` o `.github/`.
- **Complemento en el orquestador**: el Paso 5 de `project-planning/SKILL.md` (línea 170) pasa
  `assets/project-plan-template.md` (relativo) en lugar de la ruta que su propio Paso 3 ya
  resolvió (central o seed). Pasar la ruta resuelta.
- **Output del Paso 7** (líneas 180-194): declarar que debe respetar los encabezados del
  template en runtime — `## Propuesta de Épicas` con bloques `### Épica NN` — y alinear el
  frontmatter (`type: plan` / `date:` → el del template vigente:
  [project-plan-template.md:1-14](docs/specs/templates/project-plan-template.md#L1-L14)).
- **Residuos de nombres** (líneas 4-6, 115): `requirement-spec.md` y "ProjectSpecFactory"
  referidos como artefacto vivo → `project.md`.

## 5. Veracidad de `CLAUDE.md` (alto)

[CLAUDE.md:27-30](CLAUDE.md#L27) — el árbol declara directorios inexistentes. Verificado con
`find docs -maxdepth 2 -type d`:

- `docs/specs/{projects,releases,stories,templates}` → `docs/specs/{01-projects,02-epics,03-stories,templates}`
- `docs/knowledge/{guides,how-to,runbooks}` → `docs/guides/` y `docs/runbooks/`
  (no existe `docs/knowledge/` ni `how-to/`; las referencias vivas del archivo a
  `docs/guides/best-practices-for-skills.md` ya son correctas)

Incumple el principio 12 de la constitución, que este mismo archivo invoca.

## 6. Constitución: regla 13 (medio)

[constitution.md:164](docs/policies/constitution.md#L164) — `02-epics/<EPIC-NN>/ → releases`
contradice ADR-0004. Cambiar a "épicas" y reflejar la forma real observada en disco:
`$SPECS_BASE/specs/02-epics/<EPIC-NN>-<slug>/epic.md`. Aplicar el mismo ajuste de forma a las
líneas de proyecto e historia de esa regla, que también omiten el slug y el archivo.

## 7. `implement-report.md` de STORY-086 (medio)

[docs/specs/03-stories/STORY-086-refactor-release-to-epic/implement-report.md](docs/specs/03-stories/STORY-086-refactor-release-to-epic/implement-report.md)

- `created` / `updated`: `2029-08-29` → `2026-08-29` (líneas 8-9).
- Añadir tras el `#` un aviso inequívoco de documento histórico: narra el estado vigente
  **durante la ejecución de cada plan**, no el estado actual del repositorio; rutas como
  `docs/specs/stories/…` e identificadores `FEAT-086` eran correctos en ese momento.
- **No reescribir el cuerpo** — falsearía el registro de lo ocurrido.

---

## Verificación

Sin build ni test runner en el repo (`package.json` solo declara `postinstall`); la
verificación es por ejecución de la lógica del skill y comprobación textual.

1. **Gate sobre el corpus real** — ejecutar la lógica corregida de `epic-format-validation`
   sobre los 19 `docs/specs/02-epics/*/epic.md`. Baseline documentada en el propio
   implement-report: **2 APROBADO / 17 REFINAR**, donde los 17 fallan por ausencia de
   "Flujos Críticos / Smoke Tests" (carencia preexistente de épicas históricas).
   *Criterio de éxito:* ningún REFINAR menciona `Features`, `Versión`, `Título`, `Estado` ni
   `Fecha`; el conteo no empeora respecto a la baseline.
2. **Contrato productor→gate (extremo a extremo)** — generar una épica con
   `/epic-from-project-plan` desde `PROJ-01-agile-sddf/project-plan.md` (contiene
   `## Propuesta de Épicas` con 9 bloques `### Épica NN`) y pasarle el gate: debe dar
   **APROBADO** sin retoques manuales. Es la prueba de que el punto 2 cierra el bucle.
3. **Ausencia de vocabulario obsoleto** —
   `grep -rn "## Features\|\*\*Versión\*\*\|\*\*Fecha\*\*" skills/` sin resultados fuera de
   `readme-builder` (su `## Features` es de un README de producto, falso positivo ya
   identificado en el implement-report).
4. **Evals parsean** — los 34 `evals/evals.json` siguen siendo JSON válido.
5. **Veracidad de la doc** — cada ruta del árbol de `CLAUDE.md` existe según
   `find docs -maxdepth 2 -type d`.
6. **Encoding** — los archivos tocados quedan en UTF-8 sin BOM (regla declarada por los propios
   skills; hay 17 archivos históricos en CP-1252 que **no** entran en este alcance).

## Fuera de alcance

- Las 82 referencias a "release" en `story-map.md` (señaladas como pendientes en el
  implement-report; artefacto vivo, decisión aparte).
- Los 17 archivos históricos en CP-1252.
- `security-audit --scope release`, `deployment-to-npm.md` y el `[Unreleased]` del CHANGELOG:
  ahí "release" significa despliegue CI/CD, no el nivel L2.
- Las 17 épicas históricas sin "Flujos Críticos / Smoke Tests": carencia de contenido
  preexistente, no del gate.

