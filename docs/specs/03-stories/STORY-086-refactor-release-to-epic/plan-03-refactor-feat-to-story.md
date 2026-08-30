# PLAN: Renombrar el prefijo de historias de `FEAT-NNN` a `STORY-NNN`

## Context

Los tres niveles usan prefijo de ID: `PROJ-NN` (L3), `EPIC-NN` (L2) y `FEAT-NNN` (L1). Los dos primeros nombran el **nivel**; el tercero nombra un **tipo** de trabajo. Esa asimetría produce dos problemas concretos:

**1. Colisión con la convención de ramas.** [branching-strategy:68](docs/guides/branching-strategy-sddf-git-flow.md#L68) define `feat/<story-id>`, `fix/<story-id>`, `chore/<story-id>` — el prefijo de rama **es** el tipo. Con `FEAT` en el ID resulta `fix/FEAT-042-corregir-login`, que se contradice. Y [flight-leves-model.md](docs/guides/flight-leves-model.md#L43-L48) ya declara cuatro **Tipos de Story** (Feat, Fix, Chore, Hotfix), así que `FEAT-042` para un bug es incorrecto por construcción.

**2. Ya hay un bug vivo causado por esto.** Existe `docs/specs/03-stories/FIX-001-error-in-npm-install-locally/` con `id: FIX-001` — alguien tuvo una historia de corrección, vio que `FEAT-` no encajaba e inventó un prefijo. Consecuencias reales hoy:

- El glob `03-stories/FEAT-*/story.md`, hardcodeado en [story-creation:216](skills/story-creation/SKILL.md#L216), [story-evaluation:160](skills/story-evaluation/SKILL.md#L160) y [epic-generate-stories:140](skills/epic-generate-stories/SKILL.md#L140), **no ve `FIX-001`**. El cálculo del siguiente ID libre lo ignora → riesgo de colisión de numeración.
- El mapa de tipos de [header-aggregation:82](skills/header-aggregation/SKILL.md#L82) (`FEAT-*` → `story`) no lo clasifica → caería a `wiki`.

`STORY-NNN` nombra el nivel, hace que el globbing por nivel vuelva a ser total, y libera el tipo para que viva donde corresponde.

### Decisiones tomadas con el usuario

| Decisión | Resuelto |
|---|---|
| Prefijo | `FEAT-NNN` → **`STORY-NNN`**, 3 dígitos, **conservando el número** (`FEAT-042` ≡ `STORY-042`) |
| Tipo de historia | Nuevo campo **`kind: feat \| fix \| chore \| hotfix`** en el frontmatter, por defecto `feat` |
| Sección `## Features` de `epic.md` | Renombrar a **`## Historias`** |
| Alcance del barrido | **Todo**, incluido `docs/specs/**` histórico — al preservarse el número no se falsifica nada, solo cambia cómo se nombra el mismo ítem |
| Versión | Sigue dentro del **2.0.0** en curso (una sola migración) |

> **Regla que queda fijada:** *prefijo = nivel, tipo = frontmatter + rama.* Nada de `BUG-XXX` o `CHORE-XXX` en el futuro: reintroduciría la confusión y volvería a romper el globbing por nivel.

### Alcance medido

**2590 referencias** a `FEAT-`: 602 en `skills/`, 1751 en `docs/specs/`, 159 en `docs/index.md`, 16 en `docs/guides/`, 12 en `README.md`. **79 directorios** de historia (78 `FEAT-*` con números 001–086 + `FIX-001`). Sin referencias en `scripts/`.

### Skills afectados: 23 skills, 88 archivos

Clasificados por **tipo de trabajo**, no solo por aparición del literal. Los de los grupos A y B necesitan edición razonada; el grupo C se resuelve con el barrido mecánico.

**Grupo A — acoplamiento estructural (7 skills).** Hardcodean el glob `FEAT-*`, calculan el siguiente ID libre o generan el sufijo `-bis`. Son los que hoy **no ven `FIX-001`**; hay que revisarlos línea a línea, no solo sustituir:

| Skill | Qué toca |
|---|---|
| [story-creation](skills/story-creation/SKILL.md#L216) | Glob de cálculo de siguiente ID + fallback |
| [story-evaluation](skills/story-evaluation/SKILL.md#L160) | Resolución de historia por ID y campo `story-id:` |
| [story-split](skills/story-split/SKILL.md) | IDs de historias hijas y sufijo `-bis` |
| [epic-generate-stories](skills/epic-generate-stories/SKILL.md#L140) | Backfill de IDs en `epic.md`, doble fuente (filesystem + épicas) |
| [epic-generate-all-stories](skills/epic-generate-all-stories/SKILL.md) | Ídem en modo batch |
| [epic-creation](skills/epic-creation/SKILL.md) | Nota de asignación diferida de IDs |
| [header-aggregation](skills/header-aggregation/SKILL.md#L82) | Mapa de tipos `FEAT-*` → `story` (hoy deja `FIX-001` como `wiki`) |

**Grupo B — encabezado `## Features` → `## Historias` (5 skills):** `epic-creation` (guía de preguntas + `assets/epic-template.md` + 2 examples), `epic-generate-stories`, `epic-generate-all-stories`, `epic-from-project-plan`, y `readme-builder/assets/readme-template.md`.

**Grupo B′ — campo `kind:` (5 skills):** los que escriben frontmatter de historia — `story-creation` (+ `assets/story-template.md`), `epic-generate-stories`, `epic-generate-all-stories`, `story-split` (hereda el `kind` de la historia madre), `header-aggregation` (lo rellena en modo batch).

**Grupo C — solo sustitución literal (16 skills restantes).** `FEAT-NNN` aparece en prosa, `evals.json`, `examples/` o `assets/` sin lógica asociada: `story-acceptance`, `story-analyze`, `story-code-review` (+ su `agents/tech-lead-reviewer.agent.md`), `story-design`, `story-implement`, `story-implement-tasks`, `story-improve`, `story-plan`, `story-specify`, `story-tasking`, `story-testcases`, `story-verify` (+ `agents/qa-engineer.agent.md`), `project-flow`, `project-planning` (+ `assets/project-plan-template.md`), `epic-from-project-plan`, `security-audit` ([2 refs](skills/security-audit/SKILL.md#L90): un ejemplo de `--story` y un ejemplo de slug de `$AUDIT_TMP`).

> Los `evals.json` de 14 skills contienen IDs `FEAT-NNN` en sus casos de prueba. Entran en el barrido y deben seguir parseando como JSON válido.

---

## 1. Renombrar los 79 directorios (`git mv`)

```
docs/specs/03-stories/FEAT-NNN-<slug>/  →  docs/specs/03-stories/STORY-NNN-<slug>/
```

El número se conserva 1:1, así que toda referencia histórica sigue siendo trazable.

**Caso especial — `FIX-001-error-in-npm-install-locally`:** su número `001` colisiona con `STORY-001`. Pasa a **`STORY-087-error-in-npm-install-locally`** (087 = siguiente libre tras el máximo 086), con `kind: fix`. Hay que actualizar sus campos `id:` y `slug:`, el wikilink de [docs/index.md:171](docs/index.md#L171) y la mención en `plan-03-integrate-story-improve-in-story-specify.md`.

## 2. Barrido global `FEAT-` → `STORY-`

Sustitución mecánica en todo el repo vivo e histórico: `skills/`, `agents/`, `docs/`, `README.md`, `CLAUDE.md`.

**Cuidado con dos cosas que el patrón `FEAT-` no cubre:**

- **Prosa sin guion:** "los FEAT IDs" en [epic-creation:185](skills/epic-creation/SKILL.md#L185) y [epic-generate-stories:63,133,155](skills/epic-generate-stories/SKILL.md#L63) → "los IDs de historia".
- **Falso positivo a evitar:** `FEATURE`/`FEATU` en `skills/security-audit/assets/security-checklist.md` — el patrón con guion no lo toca, pero conviene verificarlo al final.

Placeholders de template incluidos: `FEAT-NNN`, `FEAT-[INDEX]`, `FEAT-[ID]`, y el sufijo de duplicados `FEAT-029-nombre-bis` de [story-split](skills/story-split/SKILL.md) y `epic-generate-stories`.

## 3. Campo `kind:` en el frontmatter de historia

Añadir a **ambos** `story-template.md` (seed [skills/story-creation/assets/](skills/story-creation/assets/story-template.md) y central [docs/specs/templates/](docs/specs/templates/story-template.md)), justo bajo `id:`:

```yaml
type: story                        # nivel L1 (no cambia)
id: <STORY-NNN>
kind: <feat | fix | chore | hotfix>   # tipo de historia; determina el prefijo de rama
```

Poblar las 79 historias existentes: `kind: feat` en todas salvo la ex-`FIX-001`, que recibe `kind: fix`.

Actualizar los 5 skills del **grupo B′** que escriben ese frontmatter (ver tabla de alcance).

Conectar el campo con la convención de ramas en `branching-strategy-sddf-git-flow.md`: `<kind>/<id>-<slug>` (ej. `fix/STORY-087-error-in-npm-install-locally`).

## 4. `## Features` → `## Historias` en la épica

Cambio coordinado — todos a la vez o ninguno:

1. Los dos `epic-template.md` (seed [skills/epic-creation/assets/](skills/epic-creation/assets/epic-template.md) y [central](docs/specs/templates/epic-template.md)), incluido el comentario `<!-- sección obligatoria-->` que la marca
2. Los **19 `epic.md`** existentes en `docs/specs/02-epics/`
3. Los 5 skills del **grupo B** que hardcodean el encabezado (ver tabla de alcance)

> `epic-format-validation` **no necesita cambios**: extrae las secciones obligatorias del template en runtime. Pero los 19 `epic.md` sí deben migrarse a la vez, o fallarían la validación con `REFINAR — falta: Historias`.

## 5. Convención y documentación

- [docs/policies/constitution.md](docs/policies/constitution.md) — regla 7, tabla de IDs: `Feature/Historia · FEAT-NNN-kebab` → `Historia · STORY-NNN-kebab`; y regla 8, añadir `kind` al frontmatter documentado
- [docs/guides/organization-of-artifacts.md](docs/guides/organization-of-artifacts.md) — ejemplos de IDs, reglas de `parent` y de resolución de wikilinks
- [docs/guides/flight-leves-model.md](docs/guides/flight-leves-model.md) — enlazar los "Tipos de Story" con el nuevo campo `kind`
- [docs/guides/state-machine.md](docs/guides/state-machine.md), [sddf-commands-pipeline.md](docs/guides/sddf-commands-pipeline.md), [specs_and_workflows.md](docs/guides/specs_and_workflows.md)
- [docs/index.md](docs/index.md) — 159 referencias, todas en links y wikilinks navegables
- [README.md](README.md) — 12 referencias
- Artefactos vivos: los 19 `epic.md` (checklists), `01-projects/PROJ-01-agile-sddf/{project-plan.md,story-map.md,project.md}`

## 6. ADR-0005, CHANGELOG y versión

- **`docs/adr/ADR-0005-prefijo-story-para-el-nivel-l1.md`** siguiendo [adr-template.md](docs/adr/adr-template.md). Es una decisión **nueva**, no una reversión de ADR-0004, así que no lo supersede. Debe registrar: el argumento de colisión con el prefijo de rama, la evidencia de `FIX-001` como bug ya materializado, la regla *prefijo = nivel / tipo = frontmatter*, y como alternativas descartadas: mantener `FEAT`; renombrar la carpeta a `03-features/` en vez del prefijo; permitir prefijos por tipo (`BUG-`, `CHORE-`). Añadir al índice de `docs/adr/README.md` y a `docs/index.md`.
- **CHANGELOG** — ampliar la entrada BREAKING del 2.0.0 con este renombre, el campo `kind`, el cambio de sección, y el bloque de migración:
  ```bash
  # 1. directorios e IDs (el número se conserva)
  for d in docs/specs/03-stories/FEAT-*; do
    git mv "$d" "${d/FEAT-/STORY-}"
  done
  # 2. referencias en todos tus documentos
  grep -rlZ 'FEAT-' docs | xargs -0 sed -i 's/FEAT-/STORY-/g'
  # 3. sección de las épicas
  sed -i 's/^## Features/## Historias/' docs/specs/02-epics/*/epic.md
  # 4. añadir kind a las historias existentes
  sed -i '/^id: STORY-/a kind: feat' docs/specs/03-stories/*/story.md
  ```
  Advertir sobre historias con prefijo propio (`FIX-`, `BUG-`): hay que renumerarlas al siguiente ID libre y ponerles el `kind` correspondiente.
- **Versión:** se mantiene `2.0.0` (aún sin publicar); es parte del mismo salto mayor.

---

## Verificación

```bash
# 1. Ningún FEAT- fuera del checklist de seguridad (donde es "FEATURE")
grep -rn "FEAT-" --include="*.md" --include="*.json" . \
  | grep -v node_modules | grep -v "^./.git" | grep -v "^./.tmp"
# esperado: 0 líneas

# 2. Directorios y numeración
ls docs/specs/03-stories | grep -c "^STORY-"        # 79
ls docs/specs/03-stories | grep -v "^STORY-"        # vacío
ls docs/specs/03-stories | grep -oE "STORY-[0-9]+" | sort | uniq -d   # vacío (sin duplicados)

# 3. Frontmatter: id y kind en las 79
grep -L "^id: STORY-" docs/specs/03-stories/*/story.md   # vacío
grep -L "^kind: " docs/specs/03-stories/*/story.md       # vacío
grep -c "^kind: fix" docs/specs/03-stories/STORY-087-*/story.md   # 1

# 4. Sección migrada en las 19 épicas y en ambos templates
grep -c "^## Historias" docs/specs/02-epics/*/epic.md | grep -c ":1$"   # 19
grep -rn "^## Features" docs/specs/ skills/                             # vacío

# 5. El glob por nivel ahora los encuentra a todos
ls -d docs/specs/03-stories/STORY-*/story.md | wc -l    # 79  (antes FEAT-* daba 78)

# 6. Cobertura: ningún skill quedó a medias
grep -rl "FEAT-" --include="*.md" --include="*.json" skills/ | cut -d/ -f2 | sort -u
# esperado: vacío  (baseline antes del cambio: 23 skills, 88 archivos)

# 7. Los evals.json siguen siendo JSON válido tras el barrido
for f in skills/*/evals/evals.json; do node -e "JSON.parse(require('fs').readFileSync('$f','utf8'))" || echo "INVALIDO $f"; done

# 8. Empaquetado e instalación
npm pack --dry-run | grep -c "skills/epic-"             # 13
node scripts/cli.js install --target .claude --force    # en un dir temporal
```

**Verificación de links y funcional:**

1. Script que extrae los links locales `](…)` de [docs/index.md](docs/index.md) y comprueba `os.path.exists` de cada uno → **0 rotos** (baseline actual: 171 links, 0 rotos).
2. Ejecutar la lógica de `epic-format-validation` sobre los 19 `epic.md`: debe extraer `Descripción` / **`Historias`** / `Flujos Críticos` del template y dar **2 APROBADO / 17 REFINAR**, idéntico a la baseline — cualquier otro reparto significa que la migración de la sección quedó a medias.
3. Simular el cálculo de siguiente ID de `story-creation` con el glob nuevo (`03-stories/STORY-*/story.md`): debe devolver **088** (máximo 087 + 1). Con el glob viejo devolvía 087 e ignoraba `FIX-001` — este check confirma que el bug queda cerrado.
4. `git diff --cached --stat -M` debe mostrar los 79 directorios como **renombrados (R)** con 0 inserciones/0 borrados en los archivos que solo se movieron.


