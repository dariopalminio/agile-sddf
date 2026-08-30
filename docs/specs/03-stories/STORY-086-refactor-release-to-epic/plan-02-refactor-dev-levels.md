# PLAN: Reestructurar `docs/specs/` a niveles numerados (`01-projects/`, `02-epics/`, `03-stories/`)

## Context

El turno anterior renombró el nivel L2 de `release` a `épica` en skills, artefactos y frontmatter, pero **dejó el directorio `specs/releases/` sin tocar** por decisión explícita. El resultado es un estado a medias: `epic.md` vive dentro de `releases/`.

El usuario identificó que el problema no es estético sino **semántico y estructural**:

- **Cardinalidad rota (N:M).** Una épica puede abarcar varias releases y una release puede contener varias épicas completas. Poner `epic.md` dentro de `releases/` afirma una contención 1:1 que no existe.
- **Confusión de onboarding.** Quien abre `releases/` espera versiones (`v1.0.0`), no work items.
- **Escalado bloqueado.** No hay dónde documentar el lanzamiento en sí (`release-notes.md`) sin mezclarlo con las épicas.

El argumento es correcto y supera al que quedó registrado en ADR-0004 ("beneficio cosmético"). Hay **evidencia dura** de que el desajuste ya produce errores: el barrido del turno anterior generó rutas `épicas/` (con tilde, directorio inexistente) precisamente porque el nombre del directorio y el del concepto discrepaban.

`releases/` se libera y queda disponible para su significado real de CI/CD el día que se documenten lanzamientos.

### Decisiones tomadas con el usuario

| Decisión | Resuelto |
|---|---|
| Esquema | **Numerado** `01-projects/` · `02-epics/` · `03-stories/` (plural consistente) |
| `specs/templates/` | **Sin numerar** — no es un nivel de vuelo; ordena al final de forma natural |
| ADR-0004 | **Reescribirlo** — está staged pero nunca se commiteó, no hay decisión publicada que preservar |
| Migración | **Solo comandos en el CHANGELOG**, sin script nuevo |
| Ruptura | Limpia, dentro del mismo **2.0.0** ya en curso (una sola migración, no dos) |

### Alcance medido

**1081 referencias** a `specs/{projects,releases,stories,templates}`: 709 en el framework vivo, 305 en `docs/specs/**`, **0 en `scripts/`** (nada hardcodeado en JS — verificado). Los únicos dueños de la estructura son dos skills: [sddf-init](skills/sddf-init/SKILL.md#L51) y [skill-preflight](skills/skill-preflight/SKILL.md#L42).

---

## 1. Renombrar los directorios (`git mv`)

```
docs/specs/projects/  → docs/specs/01-projects/
docs/specs/releases/  → docs/specs/02-epics/
docs/specs/stories/   → docs/specs/03-stories/
docs/specs/templates/    (sin cambios)
```

## 2. Actualizar las referencias de ruta

Sustitución mecánica en el framework vivo — `skills/`, `agents/`, `docs/guides/`, `docs/policies/`, `docs/index.md`, `README.md`, `CLAUDE.md`:

| De | A |
|---|---|
| `specs/projects` | `specs/01-projects` |
| `specs/releases` | `specs/02-epics` |
| `specs/stories` | `specs/03-stories` |

Cubre por igual las formas `$SPECS_BASE/…`, `<SPECS_BASE>/…`, `{SPECS_ROOT}/…` y `docs/specs/…`. **Atención a dos variantes** que el patrón simple no captura:

- **Barra invertida:** `docs\specs\releases` aparece en [organization-of-artifacts.md:61](docs/guides/organization-of-artifacts.md#L61) y en [flight-leves-model.md](docs/guides/flight-leves-model.md#L70-L72).
- **Nombre desnudo sin prefijo `specs/`:** los diagramas de árbol y las reglas de resolución de wikilinks usan `` `projects/` ``, `` `releases/` ``, `` `stories/` `` sueltos ([organization-of-artifacts.md §7–§8](docs/guides/organization-of-artifacts.md#L144)).

Los skills con más referencias son [project-flow](skills/project-flow/SKILL.md) (31), [epic-generate-all-stories](skills/epic-generate-all-stories/SKILL.md) (28), [story-split](skills/story-split/SKILL.md) (24), [project-planning](skills/project-planning/SKILL.md) (24).

## 3. Corregir los defectos del barrido anterior

El sweep `release → épica` del turno previo dañó texto que debía permanecer en ASCII o describir el pasado. **Se corrige aquí**, con o sin renombre de directorios:

**a) Valores de frontmatter con tilde** — es el más grave: son plantillas que un agente copia literalmente al generar YAML. Debe ser `epic` (ASCII, el valor real), no `épica`:
- [organization-of-artifacts.md:100](docs/guides/organization-of-artifacts.md#L100), [skill-structural-pattern.md:76](docs/guides/skill-structural-pattern.md#L76), [artifact-directory-migration.md:78](docs/guides/artifact-directory-migration.md#L78) → `type: project | epic | story`

**b) Directorio inexistente `épicas/`** — 9 apariciones en [organization-of-artifacts.md](docs/guides/organization-of-artifacts.md) y [root-folder-practices.md](docs/guides/root-folder-practices.md). Se resuelven al pasar a `02-epics/`.

**c) Nombres de archivo históricos falsificados** — [artifact-directory-migration.md](docs/guides/artifact-directory-migration.md) documenta una migración *pasada*; el sweep reescribió los nombres **de origen** (`release-01-nombre.md` → `épica-01-nombre.md`), archivos que jamás existieron con ese nombre. Hay que **restaurar la columna "ruta anterior"** a lo que realmente hubo (`release-NN-nombre.md` en `specs/releases/`) y actualizar solo la columna "ruta nueva".

**d) Slugs con tilde** — `EPIC-001-nombre-épica` en [organization-of-artifacts.md:51,61](docs/guides/organization-of-artifacts.md#L51); los slugs son kebab-case ASCII por constitución.

**e) Placeholder de argumento** — `{épica}` en [epic-generate-stories:42,57](skills/epic-generate-stories/SKILL.md#L42) → `{epic}`.

**f) Artefacto obsoleto** — [sddf-commands-pipeline.md:62](docs/guides/sddf-commands-pipeline.md#L62) dice que el input es `épica-*.md`; es `epic.md`.

## 4. Los dos dueños de la estructura

Ambos enumeran los directorios de forma literal y son la fuente de la estructura para cualquier repo nuevo:

- [skills/sddf-init/SKILL.md](skills/sddf-init/SKILL.md#L51) — Paso 2 (lista de directorios a crear) y el bloque de salida de ejemplo (`[CREADO] docs/specs/…`)
- [skills/skill-preflight/SKILL.md](skills/skill-preflight/SKILL.md#L42) — Verificación 2 y su informe de ejemplo

## 5. Artefactos vivos bajo `docs/specs/`

**Sí se actualizan** las referencias de ruta internas de: los 19 `02-epics/EPIC-*/epic.md`, y `01-projects/PROJ-01-agile-sddf/{project.md,project-plan.md,story-map.md}`.

**No se tocan** (describen el estado del repo en su momento): los 31 `plan-NN.md`, los `story.md`/`analyze.md` de `STORY-*`, y las entradas pasadas del CHANGELOG.

## 6. ADR-0004, docs y CHANGELOG

- **Reescribir [ADR-0004](docs/adr/ADR-0004-renombrar-nivel-l2-de-release-a-epic.md)** (staged, nunca commiteado): la decisión pasa a incluir el renombre de directorios; la alternativa "renombrar también `specs/releases/`" deja de estar descartada y se sustituye por la que sí se descartó (mantener `releases/` con `epic.md` dentro, con su argumento de cardinalidad N:M). Actualizar título y `slug` para que reflejen el alcance real.
- **[flight-leves-model.md](docs/guides/flight-leves-model.md#L71)** — el usuario ya lo editó a la estructura nueva, pero la línea 71 quedó autocontradictoria: dice `docs\specs\epics` y a la vez "El directorio conserva el nombre `releases/` por compatibilidad". Eliminar esa coletilla (era mía) y dejar `docs\specs\02-epics`.
- **[docs/index.md](docs/index.md)** — 143 referencias, todas links navegables. Regenerar o sustituir, verificando que los 141 links `specs/` sigan resolviendo.
- **CHANGELOG** — ampliar la entrada BREAKING ya existente del 2.0.0 con el bloque de migración de directorios:
  ```bash
  git mv docs/specs/projects docs/specs/01-projects
  git mv docs/specs/releases docs/specs/02-epics
  git mv docs/specs/stories  docs/specs/03-stories
  grep -rlZ 'specs/projects\|specs/releases\|specs/stories' docs .claude \
    | xargs -0 sed -i -e 's|specs/projects|specs/01-projects|g' \
                      -e 's|specs/releases|specs/02-epics|g' \
                      -e 's|specs/stories|specs/03-stories|g'
  ```

---

## Verificación

Sin build ni test runner (`package.json` solo declara `postinstall`); verificación por grep + instalación real:

```bash
# 1. La estructura nueva existe y la vieja no
ls docs/specs/                       # 01-projects 02-epics 03-stories templates
find docs/specs -name epic.md | wc -l   # 19

# 2. Cero referencias a rutas viejas en el framework vivo
grep -rn "specs/projects\|specs/releases\|specs/stories" \
  skills/ agents/ docs/guides/ docs/policies/ docs/index.md README.md CLAUDE.md
# esperado: 0 líneas

# 3. Cero directorios/valores con tilde (defectos del barrido anterior)
grep -rnE "épica[s]?[/\\]|type:.*épica|\{épica|épica-[0-9]" \
  skills/ agents/ docs/guides/ docs/policies/ README.md CLAUDE.md
# esperado: 0 líneas

# 4. Los dos dueños de la estructura concuerdan entre sí
grep -n "specs/0" skills/sddf-init/SKILL.md skills/skill-preflight/SKILL.md

# 5. Empaquetado e instalación
npm pack --dry-run | grep -c "skills/epic-"      # 13
node scripts/cli.js install --target .claude --force   # en un dir temporal
```

**Verificación de links y funcional:**

1. Script que extrae los ~141 links `](specs/…)` de [docs/index.md](docs/index.md) y comprueba `os.path.exists` de cada uno → **0 rotos** (mismo check que se usó en el turno anterior).
2. Ejecutar la lógica de `epic-format-validation` sobre los 19 `epic.md` en su nueva ruta: debe seguir extrayendo las 3 secciones obligatorias del template y encontrar los archivos. **Baseline conocida: 17 dan REFINAR** por falta de "Flujos Críticos / Smoke Tests" — es una carencia preexistente de contenido, no una regresión; el resultado debe ser idéntico antes y después.
3. `/epic-from-project-plan` en dry-run → debe localizar `01-projects/PROJ-01-agile-sddf/project-plan.md` y su sección `## Propuesta de Épicas`, y proponer destinos `02-epics/EPIC-NN-*/epic.md`.
4. Confirmar con `git diff HEAD --stat` que los 19 `epic.md` figuran como **renombrados (R)** y no como borrado+alta, para no perder el historial.
