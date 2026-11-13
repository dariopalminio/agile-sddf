---
type: epic
id: EPIC-28
slug: EPIC-28-calibrar-story-code-review-con-review-md
title: "Calibrar story-code-review con REVIEW.md"
status: VALIDATE
substatus: DONE
parent: null
created: 2026-11-07
updated: 2026-11-12
related: []
---

# Épica: Calibrar story-code-review con REVIEW.md

## Objetivo

Que `/story-code-review` reporte lo que de verdad importa en cada repositorio y no bloquee por ruido, con una guía de revisión por proyecto (`REVIEW.md`, la convención de Claude Code Review) separada de los criterios genéricos que distribuye el framework.

## Alcance

- `REVIEW.md` en la raíz de este repo, con las cuatro secciones de la convención de Claude Code Review, y un ADR que fija su ubicación, su precedencia frente a `constitution.md`, el DoD y la plantilla del informe, su fuente de lectura y su vocabulario.
- `story-code-review` lee `REVIEW.md` y lo pasa a los cuatro revisores y al árbitro. Incorpora la categoría PREEXISTENTE, la verificación de evidencia, la deduplicación y el tope de LOW. Sus agentes quedan sin reglas propias de agile-sddf, con las rutas de `.tmp/` y de los checklists de seguridad corregidas.
- `dod-story-code-review.md` (guardrail y plantilla de `sddf-constitution`) sin criterios circulares ni duplicados con los revisores.
- `sddf-constitution` genera un `REVIEW.md` semilla para los proyectos consumidores.

## Historias

- [x] **STORY-177** — Corregir rutas de story-code-review: Como Solo Builder, quiero que los cuatro revisores escriban sus informes en `.tmp/story-code-review/{story_id}/`, la ruta que lee el orquestador, y que el Security-Reviewer busque los checklists de seguridad en `docs/guardrails/` y no en `docs/policies/`, para que la revisión no dependa de que el agente concilie rutas contradictorias ni de los enlaces de `constitution.md`.
- [x] **STORY-178** — ADR de la guía de revisión: Como mantenedor de agile-sddf, quiero un ADR que fije dónde vive `REVIEW.md`, qué decide frente a `constitution.md`, el DoD CODE-REVIEW y la plantilla del informe, de dónde se lee y cómo se traducen las severidades de Claude Code Review (Important, Minor, Pre-existing), para que las demás historias de la épica implementen una sola decisión.
- [x] **STORY-179** — REVIEW.md de agile-sddf: Como mantenedor de agile-sddf, quiero un `REVIEW.md` en la raíz con las cuatro secciones de la convención (qué es importante en cada área del repo, tope de Minor, qué no reportar y qué verificar siempre), que recoja las reglas propias del repo que hoy viven dentro de los agentes, para que la revisión juzgue con los riesgos reales de este repositorio.
- [x] **STORY-180** — story-code-review lee REVIEW.md: Como Solo Builder, quiero que `/story-code-review` lea `REVIEW.md` cuando existe, lo pase a los cuatro revisores y al árbitro y avise si la historia modifica `REVIEW.md` o el DoD, para calibrar la revisión de cada proyecto sin editar los agentes. Sin `REVIEW.md`, el skill advierte y mantiene el comportamiento actual, y los agentes dejan de contener reglas propias de agile-sddf.
- [x] **STORY-181** — Hallazgos preexistentes: Como Solo Builder, quiero que un defecto en líneas que la historia no tocó se informe como PREEXISTENTE, sin contar para `max-severity` ni entrar en `fix-directives.md`, para no pagar rondas de corrección por problemas que la historia no introdujo.
- [x] **STORY-182** — Verificación, deduplicación hallazgos: Como Solo Builder, quiero que el árbitro verifique la evidencia de los hallazgos, fusione los hallazgos repetidos entre revisores y no trate como bloqueante ningún HIGH o MEDIUM sin `Archivo:Línea` y escenario de fallo concreto, para que el informe tenga señal y un falso positivo no cueste una ronda.
- [x] **STORY-183** — DoD CODE-REVIEW sin criterios circulares: Como Solo Builder, quiero que `dod-story-code-review.md` (guardrail y plantilla de `sddf-constitution`) contenga solo criterios que la revisión puede comprobar, sin "informe creado", "veredicto APPROVED" ni "sin bloqueantes", y que los criterios cubiertos por un revisor tomen su resultado en lugar de crear hallazgos nuevos, para que un mismo defecto no aparezca varias veces en `fix-directives.md`.
- [x] **STORY-184** — REVIEW.md semilla para proyectos consumidores: Como Solo Builder que adopta agile-sddf, quiero que `/sddf-constitution` cree un `REVIEW.md` inicial desde una plantilla cuando el proyecto no tiene uno, sin sobrescribir uno existente, para calibrar `/story-code-review` desde el primer día.
- [x] **STORY-185** — Tope de LOW y arrastres entre rondas: Como Solo Builder que lee `code-review-report.md`, quiero que el árbitro limite los LOW por revisor y no repita en una nueva ronda los LOW de la anterior que están en líneas que el rework no tocó, para que el informe conserve señal y no me obligue a releer los mismos nits en cada ronda.

## Criterios de salida

- [ ] **CS-1a** — Un ADR nuevo, registrado en `docs/adr/README.md`, fija la ubicación, la precedencia, la fuente de lectura y el vocabulario de `REVIEW.md`.
- [ ] **CS-1b** — `REVIEW.md` existe en la raíz con las secciones qué es importante, tope de Minor, qué no reportar y qué verificar siempre.
- [ ] **CS-2** — `story-code-review` pasa `REVIEW.md` a los cuatro revisores y al árbitro; sin `REVIEW.md` emite una advertencia y el contrato de `code-review-report.md` (frontmatter, secciones y veredicto) no cambia.
- [ ] **CS-3** — `grep -rE "Principio 6|teléfono descompuesto|un solo nivel de delegación" skills/story-code-review/agents/` no devuelve resultados.
- [ ] **CS-4a** — Un hallazgo PREEXISTENTE no cambia el veredicto ni entra en `fix-directives.md`.
- [ ] **CS-4b** — Un HIGH/MEDIUM sin `Archivo:Línea` y escenario de fallo no cambia el veredicto ni entra en `fix-directives.md`, y un hallazgo repetido entre revisores aparece una sola vez.
- [ ] **CS-4c** — Ningún revisor supera el tope de LOW.
- [ ] **CS-5** — `dod-story-code-review.md` y su plantilla en `skills/sddf-constitution/assets/dod-story/` no contienen criterios que el orquestador satisface por sí mismo (informe creado, veredicto `APPROVED`, ausencia de bloqueantes), y `memory-system check` pasa.
- [ ] **CS-6** — `/sddf-constitution` crea `REVIEW.md` desde una plantilla cuando no existe y no lo modifica si ya existe.
- [ ] **CS-7** — Los cuatro informes parciales se escriben en `.tmp/story-code-review/{story_id}/`, y el Security-Reviewer descubre los checklists `docs/guardrails/gr-*security*` sin depender de los enlaces de `constitution.md`.
- [ ] **CS-8a** — `skills/story-code-review/evals/evals.json` incluye los casos de calibración `REVIEW.md` presente, `REVIEW.md` ausente y secreto falso en `examples/`.
- [ ] **CS-8b** — `skills/story-code-review/evals/evals.json` incluye el caso de calibración hallazgo preexistente.
- [ ] **CS-8c** — `skills/story-code-review/evals/evals.json` incluye el caso de calibración tope de LOW.

## Smoke tests

### SMOKE-1 — Revisión calibrada por REVIEW.md
```gherkin
Escenario: Revisión calibrada por REVIEW.md
  Dado una historia STORY-NNN en IMPLEMENT/DONE cuyo alcance incluye un secreto falso en skills/<skill>/examples/ y un REVIEW.md que excluye esos fixtures
  Cuando el usuario ejecuta /story-code-review STORY-NNN
  Entonces el secreto falso no figura como hallazgo HIGH ni MEDIUM y no provoca NEEDS-CHANGES
```

### SMOKE-2 — Un defecto preexistente no bloquea
```gherkin
Escenario: Un defecto preexistente no bloquea
  Dado una historia STORY-NNN en IMPLEMENT/DONE sin defectos propios, cuyo alcance incluye un archivo con un defecto en líneas que la historia no tocó
  Cuando el usuario ejecuta /story-code-review STORY-NNN
  Entonces el defecto figura como PREEXISTENTE, el veredicto es APPROVED y no se genera fix-directives.md
```

### SMOKE-3 — Proyecto consumidor sin REVIEW.md
```gherkin
Escenario: Proyecto consumidor sin REVIEW.md
  Dado un proyecto que instaló agile-sddf y no tiene REVIEW.md
  Cuando el usuario ejecuta /story-code-review STORY-NNN sobre una historia en IMPLEMENT/DONE
  Entonces el skill advierte que no hay guía de revisión y genera code-review-report.md con el mismo contrato de frontmatter, secciones y veredicto
```

### SMOKE-4 — REVIEW.md semilla
```gherkin
Escenario: REVIEW.md semilla
  Dado un proyecto sin REVIEW.md
  Cuando el usuario ejecuta /sddf-constitution dos veces
  Entonces la primera ejecución crea REVIEW.md con las cuatro secciones y la segunda no lo modifica
```

## Notas

- **Fuente:** `.temp/propuestas-de-mejoras/mejora-015-REVIEW.md` (2026-11-07): análisis del consejo de Anthropic sobre `REVIEW.md` frente a `story-code-review` y `dod-story-code-review.md`, con evidencia de los 71 `code-review-report.md` archivados.
- **Convención de Anthropic** (code.claude.com/docs/en/code-review-customize): `REVIEW.md` solo lo lee el servicio gestionado de Code Review en GitHub (el `/code-review` local no); "cambia lo que la revisión encuentra y reporta; no cambia el formato"; se lee de la rama base, nunca de los cambios del PR. Por eso el formato sigue siendo de la plantilla del skill y `story-code-review` debe leer `REVIEW.md` de forma explícita.
- **Vocabulario:** 🔴 Important = HIGH/MEDIUM (bloquea en `story-code-review`), 🟡 Minor = LOW, 🟣 Pre-existing = PREEXISTENTE. A diferencia de Anthropic, cuyo check es neutral y nunca bloquea, `story-code-review` es un gate: un falso MEDIUM cuesta una ronda completa.
- **Línea base (2026-11-07):** ≈580 hallazgos LOW en 55 de los 71 informes archivados (media ≈10, máximo 21); en STORY-125, 20 LOW arrastrados entre rondas y uno duplicado entre revisores; los criterios 8 y 9 del DoD se autoevalúan; el informe de STORY-171 no sigue la plantilla.
- **Decisiones para el ADR** (obligatorio por la regla 16 de la constitución, porque afecta a `story-code-review` y `sddf-constitution`): (a) leer `REVIEW.md` del working tree o de la rama base; hoy el skill no usa git, y como mínimo debe advertir si la historia modifica `REVIEW.md` o el DoD. (b) Cómo identificar las líneas no tocadas para PREEXISTENTE, si hoy el skill no usa `git diff`. (c) `REVIEW.md` va en la raíz por convención de la herramienta, como `AGENTS.md` y `CLAUDE.md`, sin abrir una cuarta raíz en ADR-0019.
- **Refinamiento del contrato de salida (2026-11-12):** tras el `NEEDS-REFINEMENT` de `/epic-analyze`, CS-1, CS-4 y CS-8 se dividieron según el reparto real entre historias (CS-1a/b, CS-4a/b/c, CS-8a/b/c), porque `/epic-analyze` no suma coberturas parciales de varias historias; el contenido exigido no cambia. La parte de CS-8 «`npm run verify:repository` y `npm test` pasan sin errores» se retiró del contrato de salida: la exige el DoD VALIDATE de la épica (`docs/guardrails/dod-epic-validate.md`), y `verify:repository` ya ejecuta `node --test test`.
- **Publicación:** el `REVIEW.md` de la raíz es propio de este repo y no se publica (`package.json › files` no lo incluye); los proyectos consumidores reciben la semilla vía `sddf-constitution`.
- **Evals:** cada historia que cambie el comportamiento de un skill escribe primero sus casos en `evals/evals.json` (principio 11); `npm run test:eval` se ejecuta a criterio humano.
- **Fuera de alcance:** activar Claude Code Review en GitHub (decisión humana) y ejecutar los content guardrails `gr-*` en CI.
- **Alternativa:** la primera historia corrige un defecto previo; si se quiere resolver antes de activar la épica, puede tramitarse como `BUG-NN`.
