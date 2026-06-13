---
type: plan
id: plan-8
slug: plan-8-align-the-declared-multi-client-support
title: "Alinear el soporte multi-cliente declarado con el real — Feature del EPIC-17"
status: DEFINITION
substatus: DONE
parent: EPIC-17
created: 2026-06-13
updated: 2026-06-13
related:
  - EPIC-17-remediating-and-improvement
---

# Plan: A7 — Alinear el soporte multi-cliente declarado con el real — Feature del EPIC-17

## Context

El framework soporta oficialmente 3 plataformas (Claude Code, OpenCode, GitHub Copilot — seleccionables al instalar) y trata Gemini Gems y Atlassian Rovo como **características accesorias**. La documentación contradice esto: `README.md:9` y `:45` prometen 5 plataformas al mismo nivel, mientras `:130` declara solo 3. Además los directorios `.opencode/` y `.github/` contienen punteros de texto de 14 bytes sin explicación, `rovo/` no tiene README (y sus agentes están contextualizados para "Blue Express", una empresa específica), y `gem/` no declara su estado de utilidad accesoria.

**Hallazgos de la exploración que ajustan el alcance:**
- El instalador (`scripts/install.js`) **ya sincroniza desde la fuente única**: `SOURCE_DIR = .claude/` y copia skills+agents al destino elegido (`.claude`/`.agents`/`.github`). La acción (b) del ítem no requiere código nuevo — requiere documentar que ese es el mecanismo de sincronización y explicar los archivos puntero.
- **Bug de veracidad extra:** `CLAUDE.md` lista `AGENTS.md — Convención .agent/` en la estructura del repo, pero ese archivo **no existe** — viola el principio 12 de la constitución (veracidad de CLAUDE.md). Se corrige aquí por ser el mismo tipo de inconsistencia.

---

## Cambios

### (a) Consistencia documental — README.md y CLAUDE.md

**`README.md`:**
1. **Línea 9** (intro): reemplazar la lista de 5 runtimes por: "...en los runtimes de IA soportados (Claude Code, GitHub Copilot, OpenCode), con utilidades accesorias para Google Gemini Gems y Atlassian Rovo."
2. **Línea 45** (bullet Multi-runtime): reescribir a 3 plataformas: "**Multi-runtime**: los mismos skills operan en Claude Code, GitHub Copilot y OpenCode sin modificar el SKILL.md fuente, eligiendo la carpeta destino al instalar (`.claude`/`.github`/`.agents`)". Agregar bullet nuevo a continuación: "**Utilidades accesorias**: prompts para Google Gemini Gems (`gem/`) y agentes para Atlassian Rovo (`rovo/`) como complementos fuera del runtime del framework — ver sus README".
3. **Línea 133**: renombrar "Herramientas externas alternativas" a "Utilidades accesorias (complementos, no runtime del framework)": Jira con Rovo (`rovo/`), Google Gemini Gems (`gem/`).

**`CLAUDE.md`:**
4. Eliminar (o corregir) la línea `AGENTS.md # Convención .agent/...` de la estructura del proyecto — el archivo no existe (principio 12: veracidad).
5. Agregar tras la estructura una nota breve: "**Plataformas soportadas:** Claude Code, OpenCode y GitHub Copilot (elegidas al instalar — el instalador copia desde `.claude/`, fuente única, al destino `.claude`/`.agents`/`.github`). `gem/` y `rovo/` son utilidades accesorias, no runtimes del framework. Soporte a otros CLI/LLMs se evaluará en releases futuros."

### (b) Documentar el mecanismo de sincronización y los punteros

6. **`.opencode/README.md`** (nuevo, breve): explica que `agents` y `skills` son archivos puntero (contienen la ruta `.agents/agents` / `.agents/skills`); el contenido real se instala con `npx agile-sddf install --target .agents`, que copia desde la fuente única `.claude/`.
7. **`.github/README.md`** (nuevo, breve): ídem para sus punteros (`.claude/agents`, `.claude/skills`) + aclarar que `prompts/` (integración OpenSpec para Copilot) y `workflows/` (GitHub Actions) son contenido propio del directorio, no copias.
8. No se modifica `scripts/install.js` — ya implementa la sincronización desde fuente única (verificado: `SOURCE_DIR` apunta a `.claude/`, `copyDir` con skip-if-exists). El rediseño del postinstall es otro ítem del backlog de EPIC-17.

### (c) Documentar gem/ y rovo/ como utilidades accesorias

9. **`gem/README.md`**: agregar al inicio (tras el título) un bloque de estado: "> **Utilidad accesoria** — complemento del framework para el ecosistema Google (Gemini Gems), orientado a stakeholders no técnicos. No es un runtime del framework: no recibe los 47 skills ni se sincroniza desde `.claude/`. Los prompts de `prompts/` se mantienen manualmente."
10. **`rovo/README.md`** (nuevo): título + bloque equivalente para Atlassian Rovo (Jira), con: propósito (agentes Rovo para creación/validación/split de releases e historias en Jira), estado (utilidad accesoria mantenida manualmente, no sincronizada desde `.claude/`), inventario de los 6 agentes, y nota de que los agentes contienen contexto de ejemplo de una empresa específica que debe adaptarse al usarlos.

### Trazabilidad

11. Marcar A7 `[x]` en `docs/specs/releases/EPIC-17-remediating-and-improvement/release.md` con nota de resolución (respetar el id que el usuario use — puede renombrarlo a plan-08).

---

## Verificación

1. `grep -in "gemini\|rovo" README.md` — Gemini/Rovo solo aparecen como utilidades accesorias, nunca en listas de runtimes soportados.
2. `grep -n "AGENTS.md" CLAUDE.md` — sin referencias a archivo inexistente; `Test-Path AGENTS.md` confirma que no existe.
3. `ls .opencode/ .github/ rovo/ gem/` — README.md presente en los cuatro.
4. Releer README líneas 9/45/130-133 — las tres menciones consistentes entre sí (3 plataformas + accesorios).
5. `scripts/install.js` sin cambios (git diff limpio en scripts/).

## Reporte de implementación

Plan-08 implementado y verificado. La documentación ya no contradice la decisión de alcance:

(a) Consistencia documental:

README.md — las tres menciones alineadas: la intro (línea 9) declara los 3 runtimes soportados con Gemini/Rovo como accesorios; el bullet Multi-runtime (línea 45) lista solo Claude Code, GitHub Copilot y OpenCode con la elección de carpeta al instalar, seguido de un bullet nuevo "Utilidades accesorias"; y Prerequisites (línea 134) renombrado a "Utilidades accesorias (complementos, no runtime del framework)".
CLAUDE.md — nota de plataformas soportadas tras la estructura del proyecto. Además se corrigieron dos problemas de veracidad (principio 12): se eliminó la referencia a AGENTS.md, que no existe en el repo, y de paso la estructura ahora incluye docs/adr/ y templates/ (creados en planes anteriores).
(b) Sincronización desde fuente única:

Verificado que scripts/install.js ya implementa la sincronización: copia desde .claude/ al destino elegido (.claude/.agents/.github) — sin cambios de código (git diff limpio en scripts/). El rediseño del postinstall sigue siendo otro ítem del backlog.
Los archivos puntero de 14 bytes quedaron explicados: .opencode/README.md y .github/README.md (este último también aclara que prompts/ y workflows/ son contenido propio, no copias).
(c) Utilidades accesorias documentadas:

gem/README.md — bloque de estado al inicio: utilidad accesoria para el ecosistema Google, mantenida manualmente, no sincronizada desde .claude/.
rovo/README.md — creado: inventario de los 6 agentes con su skill SDDF equivalente, y la advertencia de que contienen contexto de ejemplo de una empresa específica que debe adaptarse antes de usarlos.
plan-08 marcado [x] en EPIC-17 con nota de resolución. Con esto van 8 de los ítems del epic cerrados; quedan pendientes A6 (entrevistas vía subagentes), la máquina de estados, el postinstall, el párrafo de preflight duplicado, y los tres ítems de evals/verificación.
