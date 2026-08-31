# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

---

## [2.0.2] — 2026-08-30 — `readme-builder` sale del core

### Removed

- **Skill `readme-builder`** — la generación del `README.md` se movió al repositorio de extensiones
  [`agile-sddf-extension`](https://github.com/dariopalminio/agile-sddf-extension). Su plantilla
  evoluciona con las convenciones de presentación de cada proyecto, no con el pipeline SDD, así que
  seguía el mismo criterio de frontera que ya separaba a `skill-master` y `skill-test-evals` del
  core (ver 2.0.0). Quien lo use debe instalarlo con
  `npx skills add dariopalminio/agile-sddf-extension --skill readme-builder`. El core pasa de 34 a
  33 skills. `FR-049` de `project.md` queda retirado; `STORY-042` y `EPIC-09` se conservan como
  registro histórico del trabajo.

---

## [2.0.0] — 2026-08-30 — Épicas, niveles numerados y prefijo STORY (EPIC-18 + ADR-0004/0005/0006)

> **Versión major.** Renombra el work item de nivel medio (`release` → **épica**), cambia el prefijo
> de ID del nivel L1 (`FEAT-NNN` → **`STORY-NNN`**) y reestructura `docs/specs/` en directorios
> numerados por nivel de vuelo. No hay alias retrocompatibles: los comandos `/release-*` dejan de
> existir y los proyectos con SDDF ya instalado requieren la migración manual documentada más abajo.

### Added

- **`ADR-0006` — Workflows canónicos de Story y Epic, con migración retroactiva de los estados históricos** — supersede a `ADR-0003`, que había aceptado explícitamente como trade-off *no* migrar los artefactos ya escritos («son artefactos cerrados y la inconsistencia es aceptable»). Esa premisa dejó de sostenerse: la excepción alcanzaba a **15 de 19 épicas** (el 79% del corpus, es decir, el esquema antiguo era el mayoritario); `RELEASED` reintrodujo justo la colisión semántica que `ADR-0004` había eliminado al reservar *release* para CI/CD; los artefactos históricos siguen siendo entrada de skills y agentes (la reescritura de `project.md` tuvo que leer el estado de las 19); y el coste real resultó ser la sustitución de cuatro literales de frontmatter, sin ningún `SKILL.md` que lea o escriba esos valores. ADR-0006 conserva íntegros los dos workflows de ADR-0003 y solo revierte esa consecuencia. ADR-0003 queda marcado `SUPERSEDED` (único cambio permitido sobre un ADR aceptado, según `docs/adr/README.md`)
- **Runbook `actualizar-spec-de-proyecto`** — procedimiento de 7 pasos para resincronizar el `project.md` de nivel L3 con la realidad del repositorio: delimitar contra el template, inventariar el filesystem con `ls`/`grep` («contar, no recordar»), explorar en paralelo con tres subagentes acotados (épicas / historias / skills), contrastar con las fuentes transversales (`docs/index.md`, `CHANGELOG.md`, ADRs, `state-machine.md`), **verificar personalmente todo lo que se va a afirmar** —incluido lo que reportan los subagentes—, construir el inventario de drift *afirmación → realidad → evidencia*, y reescribir. Documenta también por qué `/reverse-engineering --update` no sirve para esto (solo re-analiza secciones marcadas `PENDING MANUAL REVIEW`, y aquí el problema es que las secciones **sin** marcar son las obsoletas) y las señales para disparar el procedimiento
- **`evals/evals.json` para `epic-from-project-plan`** — era el único de los 5 skills L2 sin evals, y justamente aquel cuyo parser cambió en esta versión (aceptar `—` y `:` como separador de `### Épica`, y mapear el bloque `Walking Skeleton` sin número al ID `00`). 7 casos: ambos separadores, Walking Skeleton → `EPIC-00`, regresión productor→gate (el `epic.md` generado pasa `epic-format-validation` sin retoques), plan ausente, sección sin bloques reconocibles y directorio de épica preexistente
- **`ADR-0005` — El ID del nivel L1 se prefija con `STORY`; el tipo de trabajo vive en el campo `kind`** — registra la regla *prefijo = nivel, tipo = `kind` + rama*, la evidencia del bug ya materializado (`FIX-001` invisible al glob `FEAT-*`), y las alternativas descartadas: mantener `FEAT`; renombrar la carpeta a `03-features/`; oficializar prefijos de ID por tipo (`BUG-`, `CHORE-`); poner el tipo en el slug
- **Campo `kind` en el frontmatter de historia** — `kind: feat | fix | chore | hotfix`, añadido a ambos `story-template.md` (seed y central) y poblado en las 76 historias con `story.md` (75 `feat` + 1 `fix`). Declara el tipo de trabajo, que antes solo existía implícito en el prefijo del ID, y compone el nombre de rama `<kind>/<id>-<slug>`. Documentado en `constitution.md` (regla 8), `flight-leves-model.md` (Tipos de Story), `branching-strategy-sddf-git-flow.md` y `header-aggregation`
- **`ADR-0004` — El nivel L2 es una épica, y los niveles viven en directorios numerados** — registra la decisión completa (renombre semántico + reestructura de directorios), su fundamento de cardinalidad N:M entre épica y release, y las alternativas descartadas: mantener `release` y documentar mejor; renombrar solo skills y artefacto dejando `specs/releases/`; usar `epics/` sin prefijo numérico; numerar también `templates/`; alias retrocompatibles. Añadido al índice de `docs/adr/README.md`, que además recupera la fila de `ADR-0003` que faltaba
- **Frontmatter en 6 guías** — `best-practices-for-skill-testing`, `best-practices-for-system-prompt`, `best-practices-for-testing`, `specs_and_workflows` y `skill-structural-pattern` no tenían bloque YAML, y `root-folder-practices` declaraba un `slug` duplicado de `organization-of-artifacts`; aplicado con `/header-aggregation` usando `slug` = nombre de archivo (regla de `docs-wiki-builder`, no la de directorio, que habría dado `slug: guides` en las 18) y `date` = fecha del primer commit de cada archivo. Las 18 guías tienen ahora `slug` único

### Changed

- **Estados de las 19 épicas migrados a la máquina de estados canónica** — hasta ahora 15 de 19 `epic.md` declaraban valores fuera del pipeline de épica (`DEFINE → PLAN → READY-FOR-DEV → DEVELOP → VALIDATE → SHIP → COMPLETED`) o fuera del conjunto canónico de substatus (`TODO | IN-PROGRESS | DONE | BLOCKED`). Equivalencias aplicadas: `status: RELEASED` → **`COMPLETED`** en 13 épicas (era el terminal del esquema de 2 estados; su sucesor es el terminal pasivo, **no** `SHIP`, que `ADR-0003` define como «último estado *activo*» y que habría dejado 13 épicas históricas parqueadas en un estado activo y desalineadas de EPIC-14/15/16/18, ya en `COMPLETED`); `status: DEFINITION` → **`DEFINE`** en EPIC-13 (renombrado ya previsto por ADR-0003); `status: IMPLEMENT` → **`DEVELOP`** en EPIC-17 (`IMPLEMENT` es un estado de *story*, no de épica); y `substatus: READY` → **`DONE`** en 12 épicas. Resultado: 17 `COMPLETED/DONE`, 1 `DEVELOP/DONE`, 1 `DEFINE/IN-PROGRESS`. **La migración traduce etiquetas, no reevalúa avance:** preserva la afirmación de progreso que cada documento ya hacía, por lo que EPIC-13 sigue en `DEFINE` con sus historias marcadas y EPIC-17 en `DEVELOP/DONE` sin haber pasado por `VALIDATE` ni `SHIP` — ambos quedan anotados en el apéndice B de `project.md` como revisión de avance pendiente. Se tocaron **15 de los 19 `epic.md`** — las cuatro ya canónicas (EPIC-14, 15, 16, 18) no se modificaron, para no registrar un cambio de fecha sin cambio de contenido. `updated:` se refrescó solo en las 5 épicas migradas que ya usaban el par `created:`/`updated:`; las 10 que conservan `date:` (EPIC-00…EPIC-09) quedan sin tocar y anotadas como deuda en el apéndice B de `project.md`. Ver `ADR-0006`
- **`README.md`: sección `Upgrading desde 1.x` y sección `Extensions`** — la primera avisa del cambio incompatible de estructura para quien viene de 1.x (tabla de equivalencias destacada bajo los badges, los 6 pasos de migración, y los cuatro puntos a revisar después: directorios `release-*` huérfanos que el instalador no borra, historias con prefijo propio que el script no toca y que quedarían invisibles al glob que calcula el siguiente ID, el `kind: feat` por defecto mal asignado a fixes y chores, y el `release-spec-template.md` huérfano). La segunda documenta la frontera core/extensión: qué contiene [`agile-sddf-extension`](https://github.com/dariopalminio/agile-sddf-extension) (14 skills en 5 categorías), cómo se instala (`npx skills add`) y **cómo se conecta al pipeline** vía `implement.test_generators` / `implement.code_generators` — contrato que la extensión no documenta porque vive en `story-implement`: validación *fail-fast* antes de invocar nada, `skill: none` para desactivar, semántica de `required` (gobierna la **ausencia** del worker, no su fallo en ejecución) y orden de invocación según el YAML. El bullet de Features se redujo a un puntero, eliminando la mención a MUI/Shadcn, que no corresponde a ningún skill del repositorio de extensiones. Los enlaces a los ADR se pusieron absolutos porque `docs/` no se publica en el paquete npm
- **`docs/index.md` actualizado a mano** — entrada del runbook nuevo en la sección Runbooks, fila de `ADR-0006` y `ADR-0003` marcado `SUPERSEDED` en la lista de ADRs, etiquetas de estado de EPIC-13 (`DEFINITION` → `DEFINE`) y EPIC-17 (`IMPLEMENT` → `DEVELOP`), y recuento de archivos `.md`, runbooks y wikilinks. **Las filas «Rutas únicas enlazadas», «L1 historias» y «Artefactos derivados» conservan el valor de la generación completa del 2026-08-29** y quedan marcadas como tales con una nota al pie: solo se recontó lo tocado a mano. Reejecutar `/docs-wiki-builder --update` para recalcular la tabla entera
- **`project.md` (PROJ-01) reescrito contra el repositorio** — el documento databa del 2026-04-19, generado por `/reverse-engineering`, y describía un sistema que ya no existe: ~15 skills, integración OpenSpec, cinco runtimes y control de flujo por un campo `**Estado**: IN-PROGRESS | Ready`. Trece desfases confirmados contra el filesystem, entre ellos: los skills se citaban en `.claude/skills/` cuando la fuente única está en `skills/` de la raíz (EPIC-18 plan-08); `gem/` y `rovo/` fueron eliminados (EPIC-17 plan-13), quedando 3 runtimes; **no existe `openspec/` ni ningún skill `openspec-*`**, con lo que cuatro requisitos funcionales completos (FR-027…FR-030) y un pipeline entero del árbol de navegación describían una capacidad retirada; `skills-lock.json` no existe (NFR-011 eliminado) y `skill-master`/`skill-test-evals` viven ahora en `agile-sddf-extension`, declarados vía `sddf.config.yaml`; el stack declaraba Python 3.x cuando los únicos `.py` restantes son *fixtures* de `story-verify/examples/`; `story-refine` se citaba como skill vigente pese a haber sido sustituido por `story-specify`; y «generación de código de implementación» seguía listada como **non-goal** mientras `story-implement` ya ejecuta el ciclo TDD RED→GREEN→REFACTOR. Resultado: **54 requisitos funcionales** en 9 categorías que espejan los pipelines reales (infraestructura y preflight · proyecto L3 · ingeniería inversa · épicas L2 · SPECIFY · PLAN · IMPLEMENT→ACCEPTANCE · docs y seguridad · distribución npm) y **24 requisitos no funcionales** en 10 categorías, con dos bloques nuevos que el documento no tenía: arquitectura de agentes (composición inline vs. delegación de un salto, contrato `.tmp/<skill-name>/`, prohibición agente→agente — ADR-0002) y seguridad (Skill Shielder en CI, `security-audit` OWASP). Cada FR referencia ahora skill + historia + épica en vez de rutas `.claude/`. El árbol de navegación de §3.3 se rehízo con los tres niveles de vuelo y el workflow L1 completo; §4.1 documenta la frontera core/extensión; §11 pasó de «Sin referencias» a enlazar el índice, los 5 ADR, las políticas y las guías; el frontmatter se alineó al esquema de `header-aggregation` (`date:` → `created:`/`updated:`, `substatus: READY` → `DONE`). La sección «Gaps & Next Steps» heredada de la ingeniería inversa —preguntas que la IA no supo responder, varias ya resueltas— se sustituyó por dos apéndices: **A, estado de implementación** (19 épicas, 77 historias por estado, superficie del framework) y **B, brechas verificadas**: 13 de 19 épicas usan `status: RELEASED` fuera de la máquina de estados canónica; 5 historias con `parent: null`; STORY-084/085 sin `story.md` y con IDs en colisión entre EPIC-14 y EPIC-15; `STORY-043` con los placeholders del template sin rellenar; 8 IDs planificados nunca materializados; 11 de 34 skills sin `evals/`; `README.md` aún anuncia «Integración OpenSpec»; y `project-plan.md` describe 9 épicas frente a las 19 reales. Procedimiento documentado en el runbook `actualizar-spec-de-proyecto`
- **⚠️ BREAKING — el nivel L2 pasa de llamarse "release" a llamarse "épica"** — el término colisionaba con su sentido CI/CD (liberación, despliegue, versión publicada), hasta el punto de que `flight-leves-model.md` tenía que aclarar que "el release a nivel de gestión de trabajo es independiente del release real y versión de software en herramientas como github". A partir de esta versión **`release` queda reservado exclusivamente para CI/CD** y el work item de nivel medio es siempre una **épica** (`EPIC-NN`). Ver `ADR-0004`. Cambios:
  - **Skills renombrados:** `release-creation` → `epic-creation`, `release-format-validation` → `epic-format-validation`, `release-generate-stories` → `epic-generate-stories`, `release-generate-all-stories` → `epic-generate-all-stories`, `releases-from-project-plan` → `epic-from-project-plan`. Los triggers antiguos ("crear release", "validar release", …) **no** se conservan como alias
  - **Artefacto renombrado:** `release.md` → `epic.md` dentro de cada `EPIC-NN-*/`, y frontmatter `type: release` → `type: epic`
  - **Sección de `project-plan.md`:** `## Propuesta de Releases` → `## Propuesta de Épicas`, con sus bloques `### Release NN` → `### Épica NN`. Cambio coordinado en los dos `project-plan-template.md` (seed y central), en el parser de `epic-from-project-plan` y en el agente `project-architect`
  - **Consumidores actualizados:** `header-aggregation` (mapa `EPIC-*` → `type: epic`, busca `epic.md`), `docs-wiki-builder`, `sddf-init`, `project-planning`, `project-flow`, `project-story-mapping`, los `story-*` que leen la épica padre, y los templates `story-template.md` (campo `parent`) y `analyze-report-template.md` (`{epic_status}`, `{epic_detail}`)
  - **⚠️ Directorios de specs reestructurados a niveles numerados** — `specs/projects/` → `specs/01-projects/`, `specs/releases/` → `specs/02-epics/`, `specs/stories/` → `specs/03-stories/`. `specs/templates/` **no** se numera: es infraestructura, no un nivel de vuelo. El prefijo hace que el orden alfabético del explorador coincida con el jerárquico (L3 → L2 → L1), que era la virtud accidental del nombre `releases`. Motivo de fondo: épica y release son **N:M** — una épica abarca varias releases y una release contiene varias épicas — así que anidar `epic.md` dentro de `releases/` afirmaba una contención que no existe. El nombre `releases/` queda libre para documentar lanzamientos reales. Actualizadas 1081 referencias en 79 archivos del framework vivo; `sddf-init` y `skill-preflight` (los dos dueños de la estructura) crean y verifican los nombres nuevos
  - **`release` se conserva donde significa CI/CD:** `security-audit --scope release` y su sección Release Readiness, el modelo batch de `branching-strategy-sddf-git-flow.md`, `deployment-to-npm.md` y las entradas pasadas de este CHANGELOG
  - **⚠️ El prefijo de ID de historia pasa de `FEAT-NNN` a `STORY-NNN`** — los tres niveles se nombran ya con el mismo criterio (`PROJ` / `EPIC` / `STORY`). El número se conserva 1:1 (`FEAT-042` ≡ `STORY-042`), así que toda referencia histórica sigue siendo trazable. Motivo: `FEAT` nombraba un **tipo**, no el nivel, y colisionaba con el prefijo de rama (`fix/FEAT-042` se contradice). **Era un bug real, no teórico:** existía `FIX-001-error-in-npm-install-locally` con prefijo inventado, invisible para el glob `03-stories/FEAT-*/story.md` que usan `story-creation`, `story-evaluation` y `epic-generate-stories` para calcular el siguiente ID libre — el cálculo podía asignar un número en colisión. Renumerada a `STORY-087` con `kind: fix`. Actualizadas 2590 referencias en 305 archivos (23 skills, 79 directorios de historia). Ver `ADR-0005`
  - **Sección `## Features` de `epic.md` renombrada a `## Historias`** — lista ítems del nivel L1, no "features" genéricas. Migrados los dos `epic-template.md`, los 18 `epic.md` que la tenían y los 4 skills que hardcodean el encabezado (`epic-creation`, `epic-generate-stories`, `epic-generate-all-stories`, `epic-from-project-plan`). `epic-format-validation` no necesitó cambios: extrae las secciones obligatorias del template en runtime
  - **Sin fallback retrocompatible.** **Migración manual** para proyectos con SDDF ya instalado:
    ```bash
    # 1. artefacto release.md → epic.md y su frontmatter
    find docs/specs/releases -name release.md -execdir git mv release.md epic.md \;
    sed -i 's/^type: release$/type: epic/' docs/specs/releases/*/epic.md
    sed -i 's/^## Propuesta de Releases$/## Propuesta de Épicas/;s/^### Release \([0-9]\{2\}\) —/### Épica \1 —/' docs/specs/projects/*/project-plan.md

    # 2. directorios de nivel → numerados
    git mv docs/specs/projects docs/specs/01-projects
    git mv docs/specs/releases docs/specs/02-epics
    git mv docs/specs/stories  docs/specs/03-stories

    # 3. referencias de ruta en tus propios documentos
    grep -rlZ 'specs/projects\|specs/releases\|specs/stories' docs \
      | xargs -0 sed -i -e 's|specs/projects|specs/01-projects|g' \
                        -e 's|specs/releases|specs/02-epics|g' \
                        -e 's|specs/stories|specs/03-stories|g'

    # 4. prefijo de historia FEAT- → STORY- (el número se conserva)
    for d in docs/specs/03-stories/FEAT-*; do git mv "$d" "${d/FEAT-/STORY-}"; done
    grep -rlZ 'FEAT-' docs | xargs -0 sed -i 's/FEAT-/STORY-/g'

    # 5. sección de las épicas y campo kind en las historias
    sed -i 's/^## Features *$/## Historias/' docs/specs/02-epics/*/epic.md
    sed -i '/^id: STORY-/a kind: feat' docs/specs/03-stories/*/story.md
    ```
    Después, reinstalar los skills (`npx agile-sddf install --force`) y borrar a mano los directorios `release-*` huérfanos en `.claude/skills/` (o `.agents/`, `.github/`). Los comandos `/release-*` dejan de existir: usar `/epic-*`.
    **Si tienes historias con prefijo propio** (`FIX-`, `BUG-`, `CHORE-`): renuméralas al siguiente `STORY-NNN` libre y ponles el `kind` correspondiente a mano — el paso 4 no las toca. **Revisa también el `kind: feat` por defecto** del paso 5: las historias que en realidad sean correcciones o tareas técnicas quedan mal clasificadas hasta que las ajustes
- **`release-spec-template.md` renombrado a `epic-template.md`** — era el único de los cinco templates centrales que no seguía el patrón `<tipo>-template.md` de sus hermanos; renombrados el central (`docs/specs/templates/`) y el seed (`skills/release-creation/assets/`), con 35 referencias actualizadas en 9 archivos operativos: `description` de frontmatter y cuerpo de `release-creation`, `release-format-validation`, `releases-from-project-plan` y `sddf-init` (tabla de templates centralizados del Paso 2b), más `evals.json`, 3 `examples/` y `docs/index.md`. **Upgrade:** quien ya corrió `sddf-init` conserva un `release-spec-template.md` huérfano en `$SPECS_BASE/specs/templates/` que hay que borrar a mano tras re-ejecutar `sddf-init`; sin re-ejecutarlo, los skills caen en el fallback al seed con el WARNING documentado (`central → seed → error`), sin romperse
- **`docs/index.md` regenerado** — el índice describía una sección `docs/wiki/` inexistente y ninguno de sus wikilinks resolvía (usaba una convención propia como `[[story-FEAT-001-project-begin]]` en vez del `slug` real del frontmatter). Reescrito contra el filesystem: 170 rutas enlazadas, 157 wikilinks, 0 rotos; cada entrada lleva wikilink más ruta relativa navegable en VS Code y GitHub; incorpora EPIC-10→18, los 31 `plan-NN.md`, FEAT-049→085, ADR-0003, `docs/policies/`, `docs/guides/` y `docs/runbooks/`
- **Rutas `docs/knowledge/guides/` → `docs/guides/`** — actualizadas en `CLAUDE.md`, `ADR-0002` y los SKILL.md de `security-audit`, `story-code-review` y `story-verify`, que apuntaban a la estructura anterior al aplanamiento. No se tocó `docs/specs/`: esos planes describen el estado del repo en su momento
- **`skills/docs-wiki-builder/assets/wiki-index-template.md`** — el template generaba la estructura obsoleta (`docs/wiki/`, `knowledge/{constitution,architecture,process,ux}/`); alineado con la estructura vigente (`policies/`, `adr/`, `guides/`, `runbooks/`)
- **`docs/policies/constitution.md`** — `type: constitution` → `type: policy`; añadida referencia a la Política de Creación de Skills
- **`README.md` — sección OpenSpec retirada** — eliminada la documentación de gestión de cambios con OpenSpec (`/openspec-init-config`, `/openspec-propose`, `/openspec-apply-change`, `/openspec-archive-change` y `/openspec-explore` ya no se documentan como flujo del framework)
- **Skills y agentes movidos a la raíz** — la fuente de verdad de skills y agentes dejó de vivir bajo `.claude/` y pasó a `skills/` y `agents/` en la raíz, para que el framework sea agnóstico del CLI/LLM; `scripts/install.js` (`SOURCE_DIR`) y `scripts/normalize-preflight-paso0.js` (`SKILLS_DIR`) actualizados para leer desde la nueva ubicación. El destino de instalación se mantiene (`.claude` / `.agents` / `.github`)
- **`package.json` — arreglo `files` simplificado** — las ~41 entradas individuales `.claude/skills/<nombre>` y `.claude/agents/` reemplazadas por las entradas de directorio `skills/` y `agents/`; se mantiene en sync automáticamente al agregar skills y elimina referencias a rutas inexistentes
- **`README.md`** — sustituido el bullet "Testing especializado y E2E" (que listaba como features skills ya no incluidos) por "Skills worker customizados (extensión)", aclarando que los workers de implementación, testing y utilidades se instalan por separado desde [`agile-sddf-extension`](https://github.com/dariopalminio/agile-sddf-extension) y se declaran en `sddf.config.yaml`

### Fixed

- **⚠️ `IN‑PROGRESS` llevaba un guion no-rompible (U+2011) en lugar del ASCII `-`** — afectaba a los **5 templates centrales** (`epic`, `story`, `project`, `project-intent`, `project-plan`), a los 5 seeds que `sddf-init` copia, y a ~35 `SKILL.md`/agentes: 156 ocurrencias en 48 archivos. Consecuencia: **todo artefacto generado desde un template nacía con U+2011**, invisible para el control WIP=1 y para cualquier comparación de `substatus: IN-PROGRESS` en ASCII (`project-begin`, `project-flow`, `project-discovery`). La contradicción se veía dentro de un mismo skill: `docs-wiki-builder` normalizaba a ASCII en una línea y conservaba U+2011 en la siguiente. Defecto preexistente, diagnosticado en `EPIC-17/plan-03-clean.md` y nunca aplicado; se cierra aquí porque esta versión reescribió el contrato de frontmatter que lo propagaba. **Upgrade:** re-ejecutar `sddf-init` no sobrescribe los templates ya centralizados — hay que corregir a mano `substatus:` en `$SPECS_BASE/specs/templates/*.md` y en los artefactos generados antes de esta versión
- **`epic-creation` ofrecía subestados inexistentes** — la tabla del Paso 3 preguntaba `¿Subestado? (IN-PROGRESS / REVIEW / READY)`, pero el conjunto canónico de `state-machine.md` es `TODO | IN-PROGRESS | DONE | BLOCKED`; `REVIEW` y `READY` no existen (es el origen de los 62 `substatus: READY` del corpus histórico). El valor por defecto pasa de `IN-PROGRESS` a **`TODO`**: una épica recién creada no debe quedar activa sin pasar por el límite WIP=1
- **`epic-generate-all-stories` generaba historias en `READY-FOR-IMPLEMENT`** — mientras `epic-generate-stories` usaba `SPECIFY` para el mismo artefacto. La variante batch nacía saltándose los gates SPECIFY y PLAN que la máquina de estados declara secuenciales, de modo que `story-implement` habría aceptado esas historias sin `design.md` ni `tasks.md`. Unificado a `status: SPECIFY` en ambos
- **`type: release` sobrevivía en 6 planes de `EPIC-16`** — la verificación de la migración solo barrió los `epic.md`. Corregidos a `type: plan`, coherente con los otros 25 planes del repo y con el conjunto `project | epic | story | wiki` que declara `header-aggregation`
- **`README.md` documentaba la estructura anterior** — el árbol de `docs/specs/` seguía mostrando `projects/`, `releases/`, `stories/` y `requirement-spec.md` en la misma versión cuyo *breaking change* es ese renombre, contradiciendo a `ADR-0004` y al propio README diez líneas más arriba. Actualizado a `01-projects/` / `02-epics/` / `03-stories/`, con `kind` añadido a la lista de campos de frontmatter y el ciclo de vida corregido (`PLANNING` no es un estado canónico; el de historia es `PLAN`)
- **`parent` sin resolver en 6 historias** — `STORY-053`, `073`, `074`, `075`, `076` y `077` conservaban el placeholder del template (`<nombre-del-release-padre>`, `~`), que el barrido `release → épica` no tocó por estar dentro de un marcador. Poblados con el directorio de su épica (`EPIC-10-*`, `EPIC-13-*`) o `null` cuando ninguna épica las reclama. Además, ambos generadores L2 escribían `parent: <EPIC-NN>` (ID desnudo) mientras `story-template.md` y `header-aggregation` definen `parent` como el **nombre del directorio**; alineados a `EPIC-NN-<slug>`
- **`docs/adr/README.md`** — la nota sobre los tres niveles de registro de decisiones apuntaba a `docs/specs/stories/STORY-NNN/design.md`, ruta inexistente desde la reestructura; contradecía a la regla 16 de la constitución, que sí quedó correcta
- **Contratos divergentes entre `epic-template.md` central y su seed** — el central listaba `- [ ] STORY-[INDEX] - **Nombre:**` y el seed no, pese a que `sddf-init` copia seed → central: un proyecto nuevo recibía un contrato distinto del que este repo usaba, y `STORY-[INDEX]` no es un ID válido para el parser de `epic-generate-stories` (que contempla "con ID" y "sin ID", no un placeholder literal). Alineados a la forma sin ID, coherente con la asignación *lazy* que documenta `epic-creation`
- **`epic-creation` hardcodeaba las claves de frontmatter que el gate deriva** — enumeraba la lista tres líneas después de declarar "nunca hardcodear"; si el template ganaba una clave obligatoria, el gate la exigía y el productor no la escribía. Ahora deriva las claves del template menos la allowlist de opcionales (`alwaysApply`, `parent`, `related`), la misma regla del Paso 3b de `epic-format-validation`
- **`## Backlog de Features` → `## Backlog de Historias`** — último residuo del barrido `FEAT- → STORY-`: la sección listaba ítems `STORY-NNN` bajo un encabezado que decía "Features". Migrada en los dos `project-plan-template.md` (seed y central) y en el `project-plan.md` vivo. Ningún skill la parsea por nombre
- **Defectos introducidos por el barrido `release → épica`** — el reemplazo masivo tradujo texto que debía permanecer en ASCII o describir el pasado: (a) el **valor de frontmatter** `type: project | épica | story` en `organization-of-artifacts`, `skill-structural-pattern` y `artifact-directory-migration` — el más grave, porque son plantillas que un agente copia literalmente al generar YAML; corregido a `project | epic | story`; (b) un directorio inexistente `épicas/` (con tilde) en 9 puntos de `organization-of-artifacts` y `root-folder-practices`; (c) `artifact-directory-migration.md` documentaba una migración *pasada* y el barrido reescribió los nombres **de origen** (`release-01-nombre.md` → `épica-01-nombre.md`), archivos que nunca existieron con ese nombre — restaurada la columna "ruta anterior" a lo realmente existente; (d) slugs con tilde (`EPIC-001-nombre-épica`), que por constitución son kebab-case ASCII; (e) el placeholder de argumento `{épica}` de `epic-generate-stories` → `{epic}`
- **`sddf-commands-pipeline.md`** — declaraba que el input de `epic-generate-stories` era `épica-*.md` y su output `stories/story-[ID]-[Nombre].md`; ambos obsoletos desde la migración a directorios por workitem. Corregidos a `epic.md` y `03-stories/FEAT-[NNN]-[nombre]/story.md`
- **`organization-of-artifacts.md`** — el ejemplo de rutas listaba `docs\specs\projects\PROJ-01-nombre-project\release.md`, un `release.md` dentro del directorio de proyecto que nunca tuvo sentido; corregido a `project.md`
- **17 guías restauradas en `docs/guides/`** — `branching-strategy-sddf-git-flow` se borró en `cb2e3e7` (2026-08-05) y las otras 16 en `63fb587` (2026-08-26) durante el aplanamiento de `docs/knowledge/`; el contenido único de `best-practices-for-skills.md` (modelo de delegación, patrón `.tmp/<skill>/` y contrato de invocación de agentes locales del ADR-0002) no había sobrevivido en ningún otro documento pese a seguir siendo citado como normativo por `CLAUDE.md`, `constitution.md` (principio #6), ADR-0002, ADR-0003 y tres SKILL.md. Recuperadas verbatim desde el historial de `main` (`63fb587^` y `cb2e3e7^`), verificadas hash a hash

### Removed

- **Skills worker movidos a repositorio de extensión** — `test-react-testing-library`, `test-cypress-cucumber`, `test-playwright-cucumber`, `code-frontend-library-react` y `changelog-generator` ya no se publican desde este paquete; los workers customizados por stack ahora viven en [`agile-sddf-extension`](https://github.com/dariopalminio/agile-sddf-extension)
- **`skill-master` y `skill-test-evals`** — retirados del paquete; la fábrica de skills y el generador de evals dejan de distribuirse desde este repositorio
- **`docs/how-to/`** — los dos how-to de Docker dev container se consolidaron en `docs/runbooks/`, que pasa a agrupar procedimientos operativos y guías paso a paso

---

## [1.13.0] — 2026-06-14 — Remediating and Improvement (EPIC-17)

### Added

- **`docs/knowledge/guides/state-machine.md`** — documento canónico de la máquina de estados SDDF con diagramas Mermaid para los 3 niveles (story, project, release), tabla de transiciones por skill y sección de inconsistencias conocidas; referenciado desde `specs_and_workflows.md` y `docs/index.md` (plan-09)
- **`ADR-0002`** — registro de decisión de arquitectura que formaliza el contrato de invocación de agentes locales de skill: bloque de mecanismo de 4 pasos insertado en los 3 SKILL.md afectados (`story-code-review`, `security-audit`, `story-implement`); propagado también a `best-practices-for-skills.md` (plan-07, plan-15)

### Changed

- **Descriptions de skills recortadas** — 47 descriptions normalizadas al patrón "cuándo invocarme" (qué + cuándo + triggers, ≤500 chars/skill); total reducido de 22.017 a ≤12.000 chars en el system prompt (plan-01)
- **`skill-preflight` — párrafo centralizado** — 29 SKILL.md normalizados al bloque canónico de 3 líneas vía `scripts/normalize-preflight-paso0.js`; detalles del protocolo quedan como fuente única en `skill-preflight/SKILL.md` (plan-12)
- **Frontmatter YAML de skills estandarizado** — zoo de 24 campos distintos reducido al estándar declarado en `skill-master`; eliminados campos muertos (`inputs`, `outputs`, `invocable`, `department`, etc.) no procesados por Claude Code (plan-05)
- **Templates compartidos centralizados** — 5 templates compartidos migrados a `$SPECS_BASE/specs/templates/` completando FEAT-055; 13 SKILL.md actualizados con lógica de resolución central → seed del dueño → error; `sddf-init` copia los templates en Paso 2b; `skill-preflight` verifica templates centrales (plan-06)
- **Soporte multi-cliente declarado alineado con el real** — `README.md` y `CLAUDE.md` consistentes con 3 plataformas soportadas (Claude Code, OpenCode, GitHub Copilot) + accesorios; `gem/` y `rovo/` documentados con `README.md` propio como utilidades accesorias, no runtime del framework (plan-08)
- **Resiliencia de entrevistas multivuelta** — Protocolo de Resiliencia de 4 niveles agregado a `project-pm.agent.md`; excepción de subagente interactivo documentada en `harness-engineering.md`; instrucción de resiliencia propagada a los 3 skills invocadores (`project-begin`, `project-discovery`, `project-flow`) (plan-10)
- **Skills agnósticos al CLI** — 13 referencias a `.claude/` eliminadas de `story-implement/SKILL.md` reemplazadas por rutas relativas agnósticas al LLM/CLI (plan-16)
- **`story-plan`** — estado `PLANNING` corregido a `PLAN` (plan-09)
- **`header-aggregation`** — substatus ampliado con `DONE` y `BLOCKED` (plan-09)
- **Esquema de evals unificado** — 5 archivos `evals.json` legacy (Schema 1: `skill_name` + `evals[]`) migrados a Schema 2 canónico (TC-NNN: `skill` + `version` + `cases[]`); total: 10 evals.json en esquema uniforme (plan-14)
- **Cobertura de evals ampliada** — 14 nuevos `evals/evals.json` creados para skills críticos del pipeline sin cobertura; cobertura aumentada de 10 a 24 skills (del 21% al ~51%) (plan-17)

### Fixed

- **`CLAUDE.md`** — información falsa sobre estructura del repo corregida para reflejar el estado real del filesystem; añadida regla explícita en `constitution.md`: "CLAUDE.md solo describe estructura verificable con el filesystem" (plan-02)
- **`story-code-review`** — inconsistencia entre description (prometía 4 subagentes con nombres ‹Inspector de Código, Guardián de Requisitos›) y body (lanzaba 3 subagentes con otros nombres) resuelta; un único modelo mental coherente en todo el artefacto (plan-04)
- **Instalador npm** — eliminado prompt por stdin en `postinstall` (anti-patrón); lógica de skip-if-exists reemplazada por diff de versión con flag `--force` para que upgrades propaguen skills ya instalados (plan-11)

### Removed

- **Assets muertos y legacy** — `constitution-template.md` duplicada junto a `project-constitution-template.md` usada; `skills-lock.json` con entradas de skills inexistentes; comandos `pnpm` de proyecto externo en `sddf.config.yaml` raíz; guion no-ASCII (U+2011) en `docs/index.md`; `story-improve/agents/` vacío (plan-03, plan-07)
- **Directorios `gem/` y `rovo/`** — 11 archivos de prompts legacy divergentes eliminados; referencias quitadas de `README.md` y `CLAUDE.md` (plan-13)

---

## [1.12.0] — 2026-06-07 — Safe Enhancement & Fortify Skills (EPIC-16)

### Added

- **`story-plan`** — genera `testcases.md` por defecto invocando `story-testcases`; acepta parámetros para generar solo `tasks.md`, solo `testcases.md`, o ambos (default); mantiene compatibilidad con flujos existentes que no usan testcases
- **Checklist de progreso en `testcases.md`** — nueva sección `## Test Cases Progress for {story_id}` con checkboxes `[ ]` / `[x]` / `[!]` por cada caso de prueba; `story-implement` actualiza los checkboxes automáticamente tras ejecutar las pruebas (mapping: unit→UT, component→CT, integration→IT, e2e→E2E, etc.); actualización silenciosa si `testcases.md` no existe o no tiene la sección
- **Selección de directorio de instalación de skills** — `scripts/install.js` y `scripts/cli.js` presentan un prompt de selección para elegir el directorio destino: `.agents`, `.claude` o `.github`; `postinstall.js` sin cambios para preservar compatibilidad con instalaciones globales/locales sin interacción
- **READMEs en `skill-master` y `skill-test-evals`** — documentación de uso, flags soportados y ejemplos de integración

### Changed

- **`story-verify`** — lee `sddf.config.yaml` para determinar el `delivery-model` (`batch` | `continuous`) y los comandos de ejecución de pruebas configurados en la sección `verify`; si `delivery-model: batch` ejecuta `e2e-regression` si está marcado como requerido; si `delivery-model: continuous` ejecuta `e2e-sanity`; solo deduce pruebas automáticamente si no encuentra configuración en `sddf.config.yaml`
- **`story-code-review`** — extendido con análisis de `testcases.md` y del reporte `implement-report.md` (opcional) generado por `story-implement`; los resultados de tests y cobertura quedan reflejados en `code-review-report.md`
- **`story-specify`** — renombrado desde `story-refine`; integra invocación a `story-improve` como parte del ciclo de especificación y refinamiento; descripción y triggers actualizados para reflejar el nuevo enfoque

### Added

- **`.github/workflows/docker-security.yml`** — workflow de CI que construye `Dockerfile.dev` y escanea la imagen con Trivy en cada push/PR que modifique archivos Docker; falla en hallazgos CRITICAL o HIGH sin parche disponible (SEC-076)
- **`sddf.config.yaml`** en raíz del proyecto — configuración operacional del framework (comandos de test por tipo, mapeo de skills `test_generators` y `code_generator`); movida desde `docs/policies/sddf-config.yaml` para ser agnóstica al CLI de IA (`.claude/` es propiedad de Anthropic; `.agents/` podría usarse en el futuro); ahora incluida en el array `files` de `package.json` para distribución npm
- **`sddf.config.yaml.example`** en `sddf-init/assets/` — configuración de ejemplo para proyectos de librería UI React + TypeScript; preconfigura `test-component-react-testing-library` como generador de tests de componente, `test-e2e-playwright-cucumber` como generador E2E e `impl-frontend-library-react-component` como code generator
- **EPIC-15 — Skills de Testing Especializado y E2E Capability** — release creado con 4 features: FEAT-084 (`impl-frontend-library-react-component`), FEAT-085 (`test-component-react-testing-library`), FEAT-086 (`test-e2e-cypress-cucumber`), FEAT-087 (`test-e2e-playwright-cucumber`); skills registrados en `package.json` files array

### Changed

- **`skill-test-evals`** — skill unificado que absorbe la funcionalidad de `skill-verify`; ahora soporta tres modos: `generate` (crea evals.json + skeleton SKILL.md), `evals` (1 run → informe pass/fail) y `benchmark` (N runs × caso → métricas estadísticas mean ± stddev); el modo se detecta automáticamente del primer argumento; soporte para `--runs N`, `--report`, `--from-skill`, `--auto`/`--manual`; versión `2.0.0`
- **`sddf-init`** — eliminado Paso "Generar openspec/config.yaml": OpenSpec tiene su propio skill de inicialización (`openspec-init-config`) y su configuración no debe delegarse a `sddf-init` (separación de responsabilidades); se eliminó también el template huérfano `assets/config.yaml.template`; añadido nuevo Paso 3 "Generar sddf.config.yaml" que crea el archivo de configuración operacional del framework desde `assets/sddf.config.yaml.template`
- **`Dockerfile.dev`** — imagen base pineada por digest SHA-256 (`debian:bookworm-slim@sha256:0104b334...`) para builds reproducibles y detectables (SEC-076); eliminado `curl` innecesario para reducir superficie de ataque; añadido usuario no-root `appuser` (UID/GID 1001 configurables vía `ARG`) con instrucción `USER appuser` antes de `CMD` (SEC-052); `docker-compose.dev.yml` actualizado con `user: "${UID:-1001}:${GID:-1001}"` para alinear UID del contenedor con el del host

### Security

- **SEC-056 (Unicode ASCII smuggling)** — añadida función `sanitize_for_llm()` en `skill-creator/scripts/utils.py`; aplica normalización NFKC y filtra caracteres zero-width (ZWSP, ZWNJ, ZWJ, BOM, soft-hyphen) y el bloque Unicode Tag (U+E0000–U+E007F) antes de enviar texto al LLM; aplicada sobre `query` en `run_eval.py` y sobre `skill_content` en `improve_description.py`

### Removed

- **Skill `skill-verify`** — eliminado; su funcionalidad (modos verify y benchmark) fue absorbida íntegramente por `skill-test-evals` v2.0.0; todos los skills y referencias actualizadas

---

## [1.10.0] — 2026-05-31 — Skills Factory (EPIC-14 + EPIC-13)

### Added

- New skills: story-testcases, skills-master, skill-test-evals
- **Skill `/story-improve`** (FEAT-077) — aplica automáticamente las recomendaciones del reporte FINVEST sobre `story.md`; lee `finvest-evaluation-report.md` del directorio de la historia, extrae scores y recomendaciones por dimensión, y aplica mínimo 1 mejora concreta por cada dimensión con score ≤ 3; gate de decisión: si `decision: APROBADA` informa y termina sin modificar ningún archivo; carga contexto de historias hermanas condicionalmente (solo si dimensión I ≤ 3) para evitar duplicar cobertura; crea `story.md.bak` antes de cualquier modificación (idempotente: sobreescribe si ya existe); genera `story-improvement-log.md` con trazabilidad de recomendación aplicada y cambio realizado por dimensión; incluido en `package.json` files para distribución npm

### Changed
- story-implement: add TDD support and skill complementaries.
- integrar-config-sddf-init: moved sddf.config.yaml template from docs/policies to skill assets and updated sddf-init to generate it
- **`story-evaluation`** — genera `finvest-evaluation-report.md` en disco además de mostrar el reporte en conversación; el archivo incluye frontmatter YAML con `story-id`, `finvest-score`, `decision` y `evaluated`; si el input fue ID o ruta de archivo, el reporte se persiste en el directorio de la historia; sobreescribe evaluaciones anteriores (la más reciente siempre reemplaza); la actualización del frontmatter de `story.md` a `SPECIFY/DONE` solo ocurre cuando `decision: APROBADA`

### Fixed

- **`story-evaluation`** — corregido bug de derivación de IDs idéntico al de `story-creation`: la búsqueda de IDs existentes fallaba silenciosamente cuando el directorio `specs/stories/` estaba vacío o el patrón glob no coincidía, resultando en IDs duplicados o mal formados
- **`release-generate-all-stories`** — corregido bug de derivación de IDs (misma causa raíz que `story-creation`) y eliminado caso donde INVEST se omitía sin justificación en la evaluación de historias generadas en lote
- **`release-generate-stories`** — corregido bug de derivación de IDs (misma causa raíz que `story-creation`) y eliminado caso donde INVEST se omitía sin justificación en la evaluación de historias individuales
- **`release-creation`** y **`story-creation`** — corregida asignación incorrecta de IDs cuando la búsqueda de IDs existentes fallaba silenciosamente; la falla silenciosa provocaba que los IDs se generaran desde 0 en lugar de continuar la secuencia existente
- Eliminada historia `FEAT-000` usada solo para pruebas del pipeline

### Added

- **Skill `/story-acceptance`** (FEAT-072, EPIC-13) — quality gate de validación humana final antes de INTEGRATION; guía al validador a través de los criterios de aceptación Gherkin de `story.md` y los criterios DoD ACCEPTANCE uno a uno; recopila resultado `PASS / FAIL / BLOCKED` con observaciones obligatorias para los no aprobados; genera `acceptance-report.md` con trazabilidad completa (ID, texto, resultado, observación, timestamp) y resumen ejecutivo; actualiza `story.md` a `ACCEPTANCE/DONE` si todos APPROVED o a `READY-FOR-IMPLEMENT/DONE` si hay rechazados; soporta sesiones interrumpibles y reanudables (`session-status: partial`), flag `--restart` y flag `--dry-run`; lee la sección ACCEPTANCE del DoD en runtime (dinámica) y usa solo criterios Gherkin si el DoD no tiene esa sección

- **Skill `/story-verify`** (FEAT-071, EPIC-13) — quality gate de verificación automática post-`story-code-review`; lanza el subagente QA Engineer que detecta el framework de testing del proyecto (Jest, pytest, Mocha, etc.) y ejecuta las suites; genera `verify-report.md` con resultado por suite, cobertura y estado final `VERIFY-PASSED / VERIFY-FAILED`; transiciona `story.md` a `VERIFY/DONE` si pasan o a `IMPLEMENT/IN-PROGRESS` si fallan; incluye ejemplos de proyectos Jest y pytest y evals de detección de modo

- **Skill `/security-audit`** (EPIC-13) — auditoría de seguridad condicional y automatizada; lanza en paralelo tres subagentes especializados: Context Detector (identifica el stack y la superficie de ataque), Checklist Evaluator (evalúa el proyecto contra `security-checklist.md` con más de 100 controles por categoría: auth, input validation, secrets, dependencies, cryptography, etc.) y Report Generator (consolida hallazgos con severidades `CRITICAL / HIGH / MEDIUM / LOW / INFO`); el skill es condicional: si no detecta superficie de riesgo omite la auditoría sin error; incluye evals de detección y ejemplos de proyectos JWT y vacíos

- **Skill `/story-code-review`** (FEAT-064, FEAT-065) — ejecuta una revisión multi-agente del código implementado en una historia SDD; lanza en paralelo tres subagentes especializados: Inspector de Código (convenciones, complejidad, seguridad), Guardián de Requisitos (cobertura de ACs) e Inspector de Integración (contratos de interfaz); consolida hallazgos en `code-review-report.md` con severidades `HIGH / MEDIUM / LOW / INFO`; cuando no hay hallazgos HIGH ni MEDIUM establece `review-status: approved` y transiciona `story.md` a `READY-FOR-VERIFY/DONE`; cuando detecta bloqueantes genera `fix-directives.md` con instrucciones concretas por archivo y retrocede `story.md` a `IMPLEMENT/IN-PROGRESS`; actúa como quality gate post-`story-implement` en el pipeline SDD

### Changed

- **`story-code-review`** (EPIC-13) — integra DoD CODE-REVIEW como quality gate; verifica los criterios de la sección `CODE-REVIEW` de `definition-of-done-story.md` antes de aprobar la revisión; el reporte `code-review-report.md` incluye sección de cumplimiento DoD; la transición a `READY-FOR-VERIFY/DONE` solo ocurre si se cumplen tanto los criterios de revisión de código como los del DoD
- **`story-implement`** (EPIC-13, FEAT-067) — integra DoD IMPLEMENT como quality gate; verifica los criterios de la sección `IMPLEMENT` de `definition-of-done-story.md` como paso previo a transicionar a `READY-FOR-CODE-REVIEW/DONE`; soporte para continuar implementaciones parciales: detecta tareas ya completadas en `tasks.md` (`[x]`) y procesa solo las pendientes (`[ ]`); integra automáticamente las correcciones de `fix-directives.md` si existe
- **`story-analyze`** (EPIC-13) — integra DoD PLAN como quality gate; verifica los criterios de la sección `PLAN` de `definition-of-done-story.md` (cobertura de ACs, trazabilidad en `design.md`, tareas atómicas ordenadas) como paso previo a transicionar a `READY-FOR-IMPLEMENT/DONE`
- **`definition-of-done-story.md`** (EPIC-13) — añadida sección `ACCEPTANCE` con criterios de aceptación funcional (escenarios Gherkin ejecutados manualmente, criterios no funcionales validados, valor de negocio confirmado, sin defectos bloqueantes) y criterios de documentación y trazabilidad (`acceptance-report.md` generado, confirmación explícita del validador humano); criterios de despliegue actualizados con validación npm (`npm pack --dry-run`, instalación limpia) y criterios de skills (uso de `skill-master`, inclusión en `files` de `package.json`); refactorizado junto con `constitution.md` para mejorar claridad y separación de responsabilidades por fase del pipeline
- **Máquina de estados del ciclo de vida de historias SDD** (EPIC-13) — extendida con los estados finales del pipeline: `→ READY-FOR-VERIFY/DONE → VERIFY/IN-PROGRESS → VERIFY/DONE → ACCEPTANCE/IN-PROGRESS → ACCEPTANCE/DONE → COMPLETED/DONE`; `story-verify` gestiona la transición `VERIFY`; `story-acceptance` gestiona la transición `ACCEPTANCE`; al ser rechazada en `ACCEPTANCE`, la historia regresa a `READY-FOR-IMPLEMENT/DONE` para corrección
- Renombrado `DOING` → `IN-PROGRESS` en el campo `substatus` de todos los artefactos de spec para alinear con la nomenclatura canónica de la máquina de estados
- Renombrado template `story-gherkin-template` → `story-template` como nombre canónico compartido
- **Restructura de `$SPECS_BASE/specs/`** — migrado a la convención workitem-per-directory: cada proyecto, release e historia ocupa su propio directorio con un archivo canónico (`project.md`, `release.md`, `story.md`); `project/` (flat) → `projects/PROJ-01-agile-sddf/`; 10 releases flat → `EPIC-NN-nombre/release.md`; 42 stories flat → `FEAT-NNN-nombre/story.md`; wikilinks y referencias `parent:` actualizados

---

## [1.9.4] — 2026-05-01 — Docs & Wiki Builders + Planning Pipeline (Release 09)

### Added

- **Skill `/story-design`** — genera `design.md` a partir de `story.md`, modelando el sistema antes de codificar; implementa 12 principios de diseño explícitos (P1-P12: alternativas consideradas, trazabilidad AC-N, reutilización, vocabulario de dominio, uniformidad, diseño para el cambio, degradación gradual, diseño ≠ programación, autoevaluación estructural, revisión conceptual, cohesión/acoplamiento, KISS/YAGNI); fallback chain de 3 niveles para template y resolución de historia por ID; extracción de contexto técnico del proyecto; checklist de principios (Paso 6); mecanismo de Change Requests (Paso 7); template de fallback interno
- **Template `story-design-template.md`** — template canónico del skill `/story-design`; tabla de Componentes Afectados con columna AC, tabla de Interfaces, sección de Puntos de Variación, sección "Decisiones de complejidad justificada" (P12) y sección Registro de Cambios (CR)
- **Políticas del proyecto** — skill `/project-policies-generation` genera `docs/policies/constitution.md` y `docs/policies/definition-of-done-story.md` desde templates
- **Skill `/sddf-init`** (FEAT-054) — inicializa el entorno SDDF en un proyecto nuevo: crea los directorios `specs/projects/`, `specs/releases/` y `specs/stories/` bajo `SDDF_ROOT`, genera `.env.template` documentando `SDDF_ROOT`; idempotente; aborta con `[ERROR]` si `SDDF_ROOT` no existe; distingue `[CREADO]` vs `[YA EXISTÍA]`
- **Skill `/skill-preflight`** — protocolo centralizado de verificación de entorno; verifica `SDDF_ROOT`, subdirectorios de specs, templates requeridos; produce informe `[OK] / [WARNING] / [ERROR]`; todos los skills migrados para invocarlo en Paso 0
- **Variable de entorno `SDDF_ROOT`** (FEAT-049) — todos los skills del pipeline leen `SDDF_ROOT` para determinar `SPECS_BASE`; fallback `docs` si no definida
- **Skill `/story-tasking`** (FEAT-058) — genera `tasks.md` a partir de `story.md` y `design.md`; descompone el diseño en tareas atómicas trazables a AC; modo manual e invocable por orquestador
- **Skill `/story-analyze`** (FEAT-059) — audita coherencia entre `story.md`, `design.md` y `tasks.md`; detecta 4 tipos de inconsistencias (TIPO A-D); genera `analyze.md` con tabla de cobertura por AC
- **Skill `/story-plan`** (FEAT-060) — orquestador del pipeline de planning: `story-design → story-tasking → story-analyze`; flag `--skip-analyze`; tabla de estado por paso
- **Skill `/story-implement`** (FEAT-061) — implementa una historia SDD tarea por tarea siguiendo TDD; genera test fallido → código mínimo; actualiza `tasks.md` en tiempo real; genera `implement-report.md`; precondición de estado `READY-FOR-IMPLEMENT/DONE` requerida
- **Skill `/changelog-generator`** — genera release notes y changelogs profesionales; soporta Keep a Changelog, release notes amigables y técnicas; categoriza por tipo de cambio (feat, fix, security, etc.)
- **Máquina de estados del ciclo de vida de historias SDD** (FEAT-062) — define formalmente los estados válidos y transiciones: `BACKLOG/TODO → SPECIFY/IN‑PROGRESS → READY-FOR-PLAN/DONE → PLAN/IN‑PROGRESS → READY-FOR-IMPLEMENT/DONE → IMPLEMENT/IN‑PROGRESS → READY-FOR-CODE-REVIEW/DONE`

- **Skill `/docs-wiki-builder`** (FEAT-044) — reorganiza `docs/` como wiki navegable con índice central `docs/index.md` y wikilinks internos `[[slug]]`; patrón LLM Wiki (Karpathy); soporta `--update` y `--dry-run`
- **Skill `/header-aggregation`** (FEAT-040) — agrega tabla de contenido a documentos Markdown existentes
- **Skill `/readme-builder`** (FEAT-042) — genera `README.md` completo desde artefactos SDDF; descubrimiento de contenido en 3 tiers
- **Skill `/skill-master`** (FEAT-048) — ciclo iterativo de creación y mejora de skills; scripts Python y agentes `analyzer`, `comparator`, `grader`; viewer HTML de benchmarking
- **Wiki guides** — `docs/wiki/guides/` con buenas prácticas, estrategia de branching SDDF Git Flow y modelo Flight Levels
- **Runbook despliegue a npm** — `docs/runbooks/deployment-to-npm.md`

### Changed

- **`story-refine`** — añade gestión de ciclo de vida de estados: establece `status: SPECIFY / substatus: IN‑PROGRESS` al iniciar o retomar una historia y `status: READY-FOR-PLAN / substatus: DONE` al aprobar FINVEST; reemplaza los valores `IN-PROGRESS`/`DONE` por los estados canónicos de la máquina de estados; añade sección "Modos de Ejecución" (manual y retomar backlog)
- **`story-plan`** — añade transición `status: PLANNING / substatus: IN‑PROGRESS` al inicio del pipeline (incondicional, permite re-ejecución sobre cualquier estado previo); resumen final reporta si el estado fue actualizado correctamente; añade tabla de ciclo de vida de estados
- **`story-analyze`** — añade actualización de frontmatter a `status: READY-FOR-IMPLEMENT / substatus: DONE` al finalizar sin ERROREs; si hay inconsistencias ERROR-level el estado permanece en `PLAN/IN‑PROGRESS`; aplica tanto en modo manual como en modo Agent; confirmación final refleja el estado resultante
- **`story-implement`** — añade precondición de estado (`READY-FOR-IMPLEMENT/DONE` requerido); error descriptivo con estado actual si no se cumple; actualización a `IMPLEMENT/IN‑PROGRESS` antes de la primera tarea; actualización a `READY-FOR-CODE-REVIEW/DONE` y checklist del release al finalizar
- **`story-evaluation`** — añade sección "Modos de Ejecución" (manual y Agent), documentando qué retorna en cada modo para que el orquestador actualice el estado de `story.md`

- **Restructura de `$SPECS_BASE/specs/`** — migrado a la convención workitem-per-directory: cada proyecto, release e historia ocupa su propio directorio con un archivo canónico (`project.md`, `release.md`, `story.md`); wikilinks y referencias `parent:` actualizados
- **`substatus` en lugar de `Estado`** — reemplazado el campo `**Estado:**` por `substatus` en todos los skills y agentes del pipeline; afecta 17 archivos; incluye actualización del template `release-spec-template.md`
- **Assets empaquetados por skill** (FEAT-048) — renombradas todas las carpetas `templates/` dentro de los skills a `assets/`; actualizadas todas las referencias en SKILL.md, agentes y documentación
- **Skills multicliente con rutas relativas** (FEAT-047) — los skills del pipeline actualizados para usar rutas relativas a su directorio base; eliminada dependencia de paths absolutos

---

## [1.5.6] — 2026-04-25

### Fixed

- `package.json` — corrección de campos de metadata del paquete npm

---

## [1.5.5] — 2026-04-25

### Changed

- Eliminada integración por comandos `opsx:*` en favor de invocación por skills
- Añadida entrada en `.gitignore` para excluir archivos generados de `openspec/`

---

## [1.5.4] — 2026-04-25 — npm Package & Local Install

### Added

- **Publicación como paquete npm** (FEAT-039) — `package.json` con metadata completa; `npm install -g agile-sddf` instala el framework globalmente con script `postinstall` que copia skills y agentes a `~/.claude/`
- **Instalación local** (FEAT-041) — `npm install agile-sddf` copia skills y agentes a `./.claude/` del proyecto actual sin afectar la instalación global; `scripts/postinstall.js` detecta automáticamente el tipo de instalación (global vs local)
- **Assets empaquetados por skill** — cada directorio de skill incluye su propio subdirectorio `assets/` para portabilidad multi-cliente; los templates y recursos se copian junto con el skill en la instalación

### Fixed

- `scripts/postinstall.js` — incluido el directorio de agentes en el paso de copia (resuelto en 3 iteraciones de fix)

---

## [1.4.0] — 2026-04-23 — Release & Story Generator + OpenSpec Utilities

### Added

- **Skill `/release-generate-stories`** (FEAT-029) — genera archivos `story-[ID]-[nombre-kebab].md` en `$SPECS_BASE/specs/stories/` a partir de las features de un archivo de release; acepta nombre corto, nombre con extensión o ruta relativa como input; solicita confirmación antes de sobreescribir historias existentes
- **Skill `/release-generate-all-stories`** (FEAT-035) — procesa en modo batch todos los archivos `.md` de `$SPECS_BASE/specs/releases/` en orden alfabético; detecta conflictos anticipadamente con confirmación global única (sobreescribir todo / saltar todos / decidir uno por uno); muestra resumen consolidado con contadores al finalizar
- **Skill `/openspec-init-config`** (FEAT-036) — carga el contexto del proyecto en `openspec/config.yaml` leyendo exhaustivamente `README.md`, `CLAUDE.md` y `AGENTS.md`; actualiza únicamente el campo `context:` preservando `schema:` y `rules:`; ejecutado sobre el propio proyecto SDDF para inicializar el contexto de OpenSpec
- **Skill `/openspec-generate-baseline`** (FEAT-037) — genera una línea base de especificaciones OpenSpec mediante ingeniería inversa del código fuente (`src/`, `README.md`, `AGENTS.md`); invoca `/opsx:propose baseline` con instrucción de reverse engineering y archiva el change directamente sin fase de apply; detecta conflictos si ya existe un change `baseline` (opción de sobreescribir o usar sufijo de fecha)

### Changed

- **Centralización de skills y agentes** — `.claude/` es ahora la fuente única de verdad para skills y agentes; `.agents/` y `.github/` apuntan via symlinks a `.claude/skills/` y `.claude/agents/`
- **Rovo agents actualizados** — agentes Rovo (`release-creator`, `release-validator`) alineados con las convenciones de naming y estructura actuales del proyecto

### OpenSpec

- Specs archivadas y promovidas a `openspec/specs/`:
  - `release-generate-stories/spec.md` — 7 requisitos
  - `release-generate-all-stories/spec.md` — 5 requisitos
  - `openspec-load-context/spec.md` — 3 requisitos (renombrado a `openspec-init-config`)
  - `openspec-generate-baseline/spec.md` — 4 requisitos

---

## [1.3.3] — 2026-04-18

### Changed
- Clarified automatic rejection rule in `story-evaluation` to explicitly scope `INVE-T` as all INVEST dimensions except `S` (Small)
- Strengthened `story-product-owner` guidance with stricter story-writing checks:
  - Added explicit guardrails for a real, concrete user role in `Como`
  - Added explicit clarity criteria for `Quiero`
  - Expanded refinement guidance to include `DIVIDIR` decisions and separate weak cohesion from pure size issues

### Added
- Archived OpenSpec change `add-skill-story-refine` under `openspec/changes/archive/2026-04-18-add-skill-story-refine/` with full proposal/design/spec/tasks artifacts
- Promoted capability spec to `openspec/specs/story-refine-skill/spec.md`

---

## [1.3.2] — 2026-04-18

### Added
- Skill `/project-flow` as a single entry-point orchestrator for the full ProjectSpecFactory pipeline (`project-begin` → `project-discovery` → `project-planning`) in one interactive session
- Review gates between phases to enforce explicit confirmation and transition each output document from `**substatus**: IN‑PROGRESS` to `**substatus**: DONE`
- Startup state detection logic in `project-flow` to resume from the appropriate phase based on existing outputs in `$SPECS_BASE/specs/projects/`
- Main OpenSpec capability spec for `project-flow-skill` at `openspec/specs/project-flow-skill/spec.md`

---

## [1.3.1] — 2026-04-17

### Changed
- Renamed skill `finvest-evaluation` → `story-finvest-evaluation` for consistency with the `story-` prefix convention used by sibling skills (`story-creation`, `story-split`)
  - Renamed directories in `.claude/skills/`, `.agents/skills/`, `.github/skills/`
  - Updated `name:` and heading in all three copies of `SKILL.md`
  - Updated all references in `story-creation`, `story-split`, `rovo/` agents, and `README.md`

### Added
- **Restricciones de entrada** section in `story-finvest-evaluation/SKILL.md`: el skill ahora ignora adjuntos de imagen (wireframes, screenshots) y evalúa únicamente el texto Markdown de la historia de usuario

---

## [1.3.0] — 2026-04-17 — Reverse Engineering

### Added
- Skill `reverse-engineering` (invocation: `/reverse-engineering`)
- Reverse-engineering agents to follow `reverse-engineer-<rol>` convention:
  - `reverse-engineer-architect.agent.md`
  - `reverse-engineer-business-analyst.agent.md`
  - `reverse-engineer-ux-flow-mapper.agent.md`
  - `reverse-engineer-product-discovery.agent.md`
  - `reverse-engineer-synthesizer.agent.md`

---

## [1.2.1]

### Changed
- Renamed agent files to follow `project-` prefix convention:
  - `architect.agent.md` → `project-architect.agent.md` (`name: project-architect`)
  - `product-manager.agent.md` → `project-pm.agent.md` (`name: project-pm`)
  - `ux-designer.agent.md` → `project-ux.agent.md` (`name: project-ux`)
- Renamed skill directories and commands to follow `project-` prefix convention:
  - `/ps-begin-intention` → `/project-begin-intention`
  - `/ps-discovery` → `/project-discovery`
  - `/ps-planning` → `/project-planning`
- Updated all skill invocations, agent cross-references, specs, and documentation to reflect new names

---

## [1.2.0] — 2026-04-16 — ProjectSpecFactory CLI

### Added
- **ProjectSpecFactory CLI pipeline** — three-skill workflow for project specification:
  - `/ps-begin-intention` — captures project intent and produces `$SPECS_BASE/specs/projects/project-intent.md`
  - `/ps-discovery` — conducts user discovery and produces `$SPECS_BASE/specs/projects/project.md`
  - `/ps-planning` — generates prioritized release backlog and produces `$SPECS_BASE/specs/projects/project-plan.md`
- **Role-based agents** — three specialized agents replacing task-based agents:
  - `architect.agent.md` — technical architect for SPECIFY and Planning phases
  - `product-manager.agent.md` — PM for Begin Intention and Discovery phases
  - `ux-designer.agent.md` — UX Designer supporting Discovery phase
- **Skill templates** — `project-intent-template.md`, `project-template.md`, `project-plan-template.md`
- **Gem prompts** — standalone prompt files for `ps-begin-intention`, `ps-discovery`, `ps-planning`
- **OpenSpec workflow** — `opsx:propose`, `opsx:apply`, `opsx:archive`, `opsx:explore` skills and commands
- **OpenSpec specs** — baseline specifications for all pipeline capabilities
- **Sample output documents** — `project-intent.md`, `requirement-spec.md`, `project-plan.md` for ProjectSpecFactory itself

---

## [1.1.0] — 2026-04-09 — Features-spec-builder

### Added
- **`/story-creation`** — creates a user story in story-gherkin format (Como/Quiero/Para + Gherkin) applying Mike Cohn, 3 C's, and INVEST principles
- **`/story-split`** — splits a large story into smaller independent stories using 8 splitting patterns
- **`/finvest-evaluation`** — evaluates story quality with the FINVEST rubric (Formato + INVEST) on a Likert 1–5 scale; produces per-dimension scores, global score, and Ready / Refine / Reject decision
- **`story-template.md`** — canonical template shared across story skills
- **`output-template.md`** — evaluation output template for finvest-evaluation
- **Examples** — `example-ready.md`, `example-refinar.md`, `example-rechazar.md` for finvest-evaluation
- **Dockerization** — Docker support for local development
- **`CLAUDE.md`** — global project instructions
- **`skills-lock.json`** — skill dependency lock file
