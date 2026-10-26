---
type: epic
id: EPIC-27
slug: EPIC-27-completar-flujo-de-story
title: "Completar flujo de story"
status: DEFINE
substatus: TODO
parent: null
created: 2026-10-25
updated: 2026-10-25
related: []
---

# Épica: Completar flujo de story

## Objetivo

Cerrar el ciclo de vida de la historia en el flujo flow-forward, desde `ACCEPTANCE` hasta su archivado, con skills mínimos que verifiquen el DoD de entrega y dejen registro histórico, y permitir instalar solo el flujo de story a quien no trabaja con épicas.

## Alcance

- Skill nuevo `story-delivery`: verifica `docs/guardrails/dod-story-deliver.md` según el `delivery-model` de `sddf.config.yaml` y lleva la historia a `DELIVER/DONE`. Tiene modo interactivo, `--force` y `--dry-run`.
- Skill nuevo `story-complete`: lleva una historia entregada a `COMPLETED/DONE` y la archiva en `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/`; también archiva, sin cambiar su status, las historias ya `COMPLETED/DONE` o `CANCELED/DONE`.
- ADR nuevo que reemplaza a ADR-0016 para admitir en `specs/flow/archive/` las historias `CANCELED`.
- Instalador: estrategia `full` (épica + story) o `story` (sin los skills `epic-*`), con flag y prompt interactivo.
- Ajuste de `domain-state-management` y `domain-story-lifecycle`: las transiciones terminales de story pasan a escribirlas estos skills, siempre con confirmación humana.

## Historias

Skill nuevo `story-delivery`: (dividida en tres historias):
  - [x] **STORY-159** — Skill story-delivery: Como Solo Builder, quiero ejecutar `/story-delivery STORY-NNN` para verificar criterio por criterio el DoD de `docs/guardrails/dod-story-deliver.md` y llevar la historia a `DELIVER/DONE`. El skill lee `defaults.delivery-model` de `sddf.config.yaml` (`batch` = incremento listo para producción, todavía sin publicar; `continuous` = incremento ya desplegado) y pide confirmación antes del paso irreversible. Con `--force` escribe `DELIVER/DONE` sin importar el estado previo ni el DoD, y deja el override registrado. Con `--dry-run` evalúa el DoD y muestra qué haría, sin escribir nada. Incluye el ajuste de `domain-state-management` §6 y de `domain-story-lifecycle` para que `DELIVER` lo escriba este skill con confirmación humana.
  - [x] **STORY-162** — Skill story-delivery: Como Solo Builder, quiero que el skill falle cerrado si falta `defaults.delivery-model` o su valor no es `batch | continuous`, para asegurar que el modelo de entrega sea válido antes de ejecutar `/story-delivery`.
  - [x] **STORY-163** — Skill story-delivery: Como Solo Builder, quiero previsualizar la entrega con `--dry-run` y forzarla con `--force` cuando el estado previo o el DoD la bloquean, para decidir la entrega sabiendo qué pasaría antes de escribir nada y, si la fuerzo, dejar trazado qué se omitió.

Skill nuevo `story-complete`: (dividida en dos historias):
  - [ ] **STORY-160** — Skill story-complete (Core) — completar y archivar una historia entregada: como Solo Builder que entregó una historia con SDD flow-forward quiero completarla y archivarla con `/story-complete STORY-NNN` para que quede en `COMPLETED/DONE` dentro de `specs/flow/archive/` para dejar `specs/flow/` solo con el trabajo activo y conservar la historia entregada como registro histórico, con su historial de git intacto.
  - [ ] **STORY-164** — Skill story-complete — archivar historias canceladas: Como Solo Builder que canceló una historia, quiero archivarla con `/story-complete STORY-NNN` en `specs/flow/archive/` sin que deje de figurar como `CANCELED`, para sacar de `specs/flow/` el trabajo que ya no se hará, sin que una historia cancelada se confunda con una entregada en el registro histórico.

Instalador:
- [ ] **STORY-161** — Estrategia de instalación: Como usuario de `agile-sddf install`, quiero elegir entre la estrategia `full` (épica + story, incluye los skills `epic-*`) y `story` (sin los skills `epic-*`) para instalar solo el flujo que voy a usar. Se elige con `--strategy full|story`. Si el flag falta y hay TTY, el instalador pregunta como ya hace con el runtime; sin TTY usa `full` por defecto. Un valor inválido falla cerrado.

## Criterios de salida

- [ ] **CS-1** — `skills/story-delivery/SKILL.md` y `skills/story-complete/SKILL.md` existen, declaran `<!-- SDDF-FIXED-LAYOUT: v1 -->` y están incluidos en el arreglo `files` de `package.json`.
- [ ] **CS-2** — `story-delivery` lee `defaults.delivery-model` de `sddf.config.yaml`, aplica `dod-story-deliver.md` criterio por criterio y soporta `--force` y `--dry-run`; `--dry-run` no modifica ningún archivo.
- [ ] **CS-3** — `story-complete` rechaza una historia que no esté en `DELIVER/DONE`, `COMPLETED/DONE` ni `CANCELED/DONE` y archiva las que sí lo están en `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/`: las `DELIVER` pasan a `status: COMPLETED` y las `CANCELED` conservan su status. El total de historias activas + archivadas no cambia.
- [ ] **CS-4** — `agile-sddf install --strategy story` no instala ningún skill `epic-*`; `--strategy full` y la invocación sin flag ni TTY instalan el catálogo completo; un valor inválido termina con código distinto de 0 y sin copiar nada.
- [ ] **CS-5** — `domain-state-management` y `domain-story-lifecycle` documentan que `story-delivery` y `story-complete` escriben `DELIVER` y `COMPLETED` con confirmación humana, y un ADR nuevo reemplaza a ADR-0016 para admitir historias `CANCELED` en `specs/flow/archive/`.
- [ ] **CS-6** — `npm run verify:repository` y `npm test` pasan sin errores.

## Smoke tests

### SMOKE-1 — Entrega y archivado de una historia aceptada
```gherkin
Escenario: Entrega y archivado de una historia aceptada
  Dado una historia STORY-NNN en ACCEPTANCE/DONE con un DoD de DELIVER que se cumple
  Cuando el usuario ejecuta /story-delivery STORY-NNN, confirma el paso irreversible y luego ejecuta /story-complete STORY-NNN
  Entonces la historia queda con status COMPLETED en specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/ y ya no aparece en specs/flow/
```

### SMOKE-2 — Dry-run de entrega sin efectos
```gherkin
Escenario: Dry-run de entrega sin efectos
  Dado una historia STORY-NNN en ACCEPTANCE/DONE
  Cuando el usuario ejecuta /story-delivery STORY-NNN --dry-run
  Entonces se muestra la evaluación del DoD y la acción que se ejecutaría, y ningún archivo cambia
```

### SMOKE-3 — Instalación solo story
```gherkin
Escenario: Instalación solo story
  Dado un proyecto destino vacío
  Cuando el usuario ejecuta npx agile-sddf install --strategy story --target claude-code
  Entonces se instalan los skills story-* y ningún skill epic-*
```

## Notas

- **Estado:** el modo forzado escribe `DELIVER/DONE`, no `DEPLOY/DONE`; `DELIVER` es el estado canónico de `domain-story-lifecycle`.
- **Sin manifiesto de release:** se decidió que `story-delivery` sea mínimo. En `batch`, la entrega solo marca la historia `DELIVER/DONE` (lista para producción); no hay append a un manifiesto por ahora. El skill no ejecuta despliegues: en `continuous`, el paso irreversible es confirmar que el incremento ya está desplegado.
- **Regla de dominio:** `domain-state-management` §6 hoy prohíbe que un skill escriba transiciones terminales. Se ajustan los documentos de dominio dentro de las historias 1 y 2, sin un ADR nuevo.
- **Regla de archivo:** ADR-0016 (aceptado, inmutable) deja las historias `CANCELED` en `specs/flow/`. Para que `story-complete` las archive, STORY-160 incluye un ADR nuevo que lo reemplaza (`superseded-by`), y actualiza `AGENTS.md`, `docs/constitution.md` y `docs/domains/`.
- **Instalación:** la estrategia `story` solo excluye los skills con prefijo `epic-*`; los demás skills (`project-*`, `memory-system`, etc.) se instalan en ambas estrategias.
- **Relaciones entre skills del flujo de story:** Para entender el workflow de skills del nivel de story ver docs\architecture\diagrams\flowchart-skill-story-flow-relationships.mermaid




