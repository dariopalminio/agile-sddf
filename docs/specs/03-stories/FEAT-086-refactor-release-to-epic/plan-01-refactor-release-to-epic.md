# Renombrar el nivel L2 de `release` a `epic`

## Context

SDDF opera con tres niveles de work item (project → L2 → story). El nivel L2 se llama hoy **release**, lo que colisiona con el significado CI/CD del término (liberación, despliegue, versión de npm). El propio `docs/guides/flight-leves-model.md:32` tiene que aclarar que "el release a nivel de gestión de trabajo es independiente del release real y versión de software en herramientas como github" — señal de que el nombre está mal elegido.

El objetivo es que L2 se llame **épica/epic** en todo el framework vivo, dejando `release` reservado exclusivamente para su sentido CI/CD (ramas, despliegue, publicación en npm, `[Unreleased]` del CHANGELOG).

La rama `feat/epic-refactoring` ya tiene avanzado el primer paso (`release-spec-template.md` → `epic-template.md`, con 35 referencias actualizadas). Este plan completa el renombre.

### Decisiones tomadas con el usuario

| Decisión | Resuelto |
|---|---|
| `release-creation` (no estaba en la lista) | Renombrar también → `epic-creation` |
| Artefactos `docs/specs/releases/EPIC-*/release.md` | `git mv` a `epic.md` (19 archivos) |
| Frontmatter `type: release` | → `type: epic` |
| Alcance del vocabulario | Skills + docs vivos. **NO** se toca `docs/specs/**` histórico ni CHANGELOG pasado |
| Compatibilidad hacia atrás | **Ruptura limpia**: sin fallback a `release.md`. Nota de migración en CHANGELOG |
| Triggers antiguos | **No** se conservan como alias. Solo vocabulario `epic`/`épica` |
| Directorio `specs/releases/` | **NO se toca** (restricción explícita del usuario) |

---

## 1. Renombrar los 5 skills (`git mv`)

```
skills/release-creation/            → skills/epic-creation/
skills/release-format-validation/   → skills/epic-format-validation/
skills/release-generate-stories/    → skills/epic-generate-stories/
skills/release-generate-all-stories/→ skills/epic-generate-all-stories/
skills/releases-from-project-plan/  → skills/epic-from-project-plan/
```

Dentro de `epic-creation/examples/`, renombrar también:
`test-01-release-minimo.md` → `test-01-epic-minimo.md`, `test-02-release-completo.md` → `test-02-epic-completo.md` (`test-03-directorio-existente.md` conserva su nombre).

**No requiere cambios en la mecánica de empaquetado:** [package.json](package.json) declara `"skills/"` como entrada de directorio y [install.js](scripts/install.js#L82-L84) escanea `skills/` dinámicamente con `readdirSync`. Verificado — no hay listas de skills hardcodeadas en `scripts/`.

## 2. Actualizar el contenido de los 5 skills renombrados

En cada `SKILL.md`: `name`, `description`, `triggers`, el heading `# Skill: /...`, y toda la prosa donde "release" designa el nivel L2 (→ "épica"). Igual en sus `evals/evals.json` (campo `skill`, `description`, `name` de cada caso, `expected_output`) y en los `examples/*.md`.

Referencias cruzadas a renombrar dentro de estos mismos skills:
- `epic-creation` invoca `epic-format-validation` y sugiere `epic-generate-stories`
- `epic-format-validation` es gate previo de `epic-generate-stories`
- `epic-generate-all-stories` reusa el flujo de `epic-generate-stories` y sugiere `epic-from-project-plan`

## 3. Artefacto generado: `release.md` → `epic.md`

**Renombrar los 19 archivos existentes** con `git mv`:
```
docs/specs/releases/EPIC-00-*/release.md → epic.md
... (EPIC-01 … EPIC-18)
```

**Cambiar el frontmatter** `type: release` → `type: epic` en esos 19 archivos, más:
- [docs/specs/templates/epic-template.md:3](docs/specs/templates/epic-template.md#L3)
- `skills/epic-creation/assets/epic-template.md:3`

En el template, ajustar también el heading de línea 18 (`# Release/Epic: [Nombre de la Épica/Release]` → `# Épica: [Nombre de la Épica]`) y el `slug:` de placeholder.

> Nota: los dos `epic-template.md` (central y seed) difieren hoy en la sección `## Features` — el central emite `FEAT-[INDEX]`, el seed no. Es una divergencia preexistente; **no la corrijo en este cambio** para no mezclar scope. La menciono para que quede registrada.

## 4. Skills consumidores que leen/escriben el artefacto

Estos skills no se renombran pero referencian `release.md`, `type: release` o los nombres de skill viejos:

| Archivo | Qué cambiar |
|---|---|
| [skills/header-aggregation/SKILL.md](skills/header-aggregation/SKILL.md) | Mapa `EPIC-*` → `type: epic` (línea ~82), rutas `specs/releases/*/release.md` → `epic.md` (líneas 57, 140, 147), `type: <project \| epic \| story \| wiki>` (línea 23) |
| [skills/docs-wiki-builder/SKILL.md](skills/docs-wiki-builder/SKILL.md) | Prefijo `release-*` → `epic` (líneas 141, 242), sección "L2 — Releases" → "L2 — Épicas" (línea 180) |
| `skills/docs-wiki-builder/assets/wiki-index-template.md` | Comentarios de nivel release → épica |
| [skills/sddf-init/SKILL.md](skills/sddf-init/SKILL.md) | Tabla de templates centralizados y referencia a `epic-creation` |
| `skills/project-policies-generation/assets/definition-of-done-story-template.md` | `release.md` → `epic.md` |
| `skills/story-{analyze,design,plan,tasking,testcases,implement,implement-tasks,split,improve,code-review,acceptance}/SKILL.md` | Refs a `release-generate-stories` → `epic-generate-stories`, `release.md` → `epic.md` |
| `skills/story-{specify,implement,implement-tasks}/README.md` | ídem |
| `skills/story-analyze/examples/output/analyze.md`, `story-design/examples/output/design.md`, `story-design/evals/evals.json`, `story-split/examples/output/split-result.md` | ídem |

## 5. Sección `## Propuesta de Releases` del project-plan

`epic-from-project-plan` parsea esa sección de `project-plan.md`. Es exactamente la ambigüedad que este trabajo elimina, así que se renombra a **`## Propuesta de Épicas`** — cambio coordinado en tres puntos, todos a la vez o ninguno:

1. [skills/project-planning/assets/project-plan-template.md:39](skills/project-planning/assets/project-plan-template.md#L39) (+ subheadings `### Release N:` → `### Épica N:`, `Release Walking Skeleton` → `Épica Walking Skeleton`, métrica `Releases planificados` → `Épicas planificadas`)
2. `docs/specs/templates/project-plan-template.md` (copia central, mismos cambios)
3. `skills/epic-from-project-plan/SKILL.md` — el parser que busca el heading
4. `docs/specs/projects/PROJ-01-agile-sddf/project-plan.md` — única instancia viva en este repo; sin esto el skill deja de encontrar la sección

## 6. Documentación viva

**Sí se actualizan** (donde "release" = nivel L2):
- [README.md](README.md) — bloques de comandos (líneas 332-348), diagrama de pipeline L2 (205-211), árbol de directorios (289-291, 307), descripción de niveles (197), features (36-37)
- [CLAUDE.md](CLAUDE.md) — "Releases/Épicas" en el patrón de IDs y estructura
- [docs/index.md](docs/index.md) — 66 menciones, incluidos 22 links `[release.md](specs/releases/.../release.md)` que quedan rotos tras el `git mv`. Regenerar con `/docs-wiki-builder` o `sed` + verificación de los 157 wikilinks
- [docs/guides/flight-leves-model.md](docs/guides/flight-leves-model.md) — documento raíz de la ambigüedad: `L2 - Release` → `L2 - Épica`, definición del nivel (línea 32), `Release DoD` → `Épica DoD`
- `docs/guides/{organization-of-artifacts,state-machine,specs_and_workflows,skill-structural-pattern,sddf-commands-pipeline,harness-engineering,root-folder-practices,best-practices-for-testing,best-practices-for-skill-testing,artifact-directory-migration}.md`
- [docs/policies/constitution.md](docs/policies/constitution.md) — regla 7 (IDs: "Release/Épica" → "Épica"), regla 13 (rutas), regla 15 (nombre del gate `epic-format-validation`), regla 8 del frontmatter (`type: project | epic | story`)
- [docs/policies/definition-of-done-story.md](docs/policies/definition-of-done-story.md) — refs a `release.md`
- [docs/guides/branching-strategy-sddf-git-flow.md:45,53](docs/guides/branching-strategy-sddf-git-flow.md#L45) — solo donde dice "rama release" pero la rama real es `epic/` (inconsistencia preexistente). El resto del documento (batch delivery, PR a main, liberación) usa "release" en sentido CI/CD legítimo y **se conserva**

**NO se tocan:**
- `docs/adr/ADR-0001`, `ADR-0002`, `ADR-0003` — ADRs aceptados son inmutables (constitución, regla 16). ADR-0003 ya usa "Epic/Release"
- `docs/specs/**` histórico: los 31 `plan-NN.md`, los `story.md` y `analyze.md` de FEAT-*, `story-map.md`, `project.md`
- `CHANGELOG.md` entradas pasadas y el heading `[Unreleased]`
- `docs/runbooks/deployment-to-npm.md` — sentido CI/CD
- `skills/security-audit/agents/report-generator.agent.md:61` — `$AUDIT_SCOPE == "release"`, sentido CI/CD
- El directorio `docs/specs/releases/` (restricción explícita)

## 7. ADR nuevo + CHANGELOG + versión

**`docs/adr/ADR-0004-renombrar-nivel-l2-de-release-a-epic.md`** siguiendo [docs/adr/adr-template.md](docs/adr/adr-template.md). La constitución (regla 16) lo exige: la decisión afecta a más de un skill y restringe decisiones futuras. Debe registrar el contexto (colisión con el sentido CI/CD), la decisión (L2 = épica; `release` reservado a CI/CD) y la consecuencia (breaking change para instalaciones existentes).

**CHANGELOG.md** — entrada en `[Unreleased]` bajo `### Changed` y `### Removed`, con nota de migración explícita:
```
Migración manual para proyectos con SDDF ya instalado:
  find docs/specs/releases -name release.md -execdir git mv release.md epic.md \;
  sed -i 's/^type: release$/type: epic/' docs/specs/releases/*/epic.md
Los comandos /release-* dejan de existir: usar /epic-*.
```

**Versión:** breaking change de nombres de skill y de artefacto → **major, `2.0.0`** en `package.json` (SemVer, criterio de despliegue del DoD).

---

## Verificación

Sin build ni test runner en este repo (`package.json` solo declara `postinstall`), la verificación es por grep + instalación real:

```bash
# 1. Ningún nombre de skill viejo fuera del histórico
grep -rn "release-creation\|release-format-validation\|release-generate-stories\|release-generate-all-stories\|releases-from-project-plan" \
  --include="*.md" --include="*.json" . \
  | grep -v node_modules | grep -v "^./.git" | grep -v "^./.tmp" \
  | grep -v "^./docs/specs/" | grep -v "^./CHANGELOG.md" | grep -v "^./docs/adr/"
# esperado: 0 líneas

# 2. No queda ningún release.md como artefacto
find docs/specs/releases -name "release.md"     # esperado: vacío
find docs/specs/releases -name "epic.md" | wc -l # esperado: 19

# 3. Frontmatter migrado
grep -rn "^type: release" docs/specs/releases/*/epic.md docs/specs/templates/ skills/
# esperado: 0 líneas

# 4. Los 5 skills existen con el nombre nuevo y ninguno con el viejo
ls skills/ | grep -E "^(epic|release)"
# esperado: epic-creation, epic-format-validation, epic-from-project-plan,
#           epic-generate-all-stories, epic-generate-stories

# 5. El frontmatter `name:` coincide con el directorio en los 5
for d in skills/epic-*; do echo "$d -> $(grep -m1 '^name:' $d/SKILL.md)"; done

# 6. Empaquetado
npm pack --dry-run | grep "skills/epic-"   # aparecen los 5
npm pack --dry-run | grep "skills/release" # esperado: vacío

# 7. Instalación real en sandbox
node scripts/install.js --target .claude --force   # sobre un directorio temporal
```

**Verificación funcional (manual, en sesión Claude Code):**
1. `/epic-format-validation EPIC-18-workflow-hardening` sobre el `epic.md` migrado → debe dar **APROBADO** (confirma que el skill renombrado lee el artefacto renombrado y valida contra `epic-template.md`).
2. `/epic-from-project-plan` en dry-run → debe encontrar la sección `## Propuesta de Épicas` del `project-plan.md` actualizado y proponer directorios `EPIC-NN-*/epic.md`.
3. Abrir [docs/index.md](docs/index.md) en VS Code y comprobar que los links a `specs/releases/EPIC-*/epic.md` resuelven (no quedan 404 de `release.md`).


