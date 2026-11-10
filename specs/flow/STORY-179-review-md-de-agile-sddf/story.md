---
alwaysApply: false
type: story
id: STORY-179
kind: chore
slug: STORY-179-review-md-de-agile-sddf
title: "REVIEW.md de agile-sddf"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-28-calibrar-story-code-review-con-review-md
created: 2026-11-08
updated: 2026-11-08
related:
  - EPIC-28-calibrar-story-code-review-con-review-md
  - STORY-178-adr-guia-de-revision
---
[[EPIC-28-calibrar-story-code-review-con-review-md]]

# 📖 Historia: REVIEW.md de agile-sddf

**Como** mantenedor de agile-sddf que revisa sus historias con `/story-code-review`  
**Quiero** un `REVIEW.md` en la raíz, hecho desde `docs/templates/REVIEW-template.md`, con las cuatro secciones de la convención (qué es importante en cada área del repo, tope de Minor, qué no reportar y qué verificar siempre) y con las reglas propias del repo que hoy viven dentro de los agentes  
**Para** que la revisión juzgue con los riesgos reales de este repositorio: que deje de bloquear por ruido (fixtures con secretos falsos, copias de instalación, LOW repetidos entre rondas) y que no pase por alto los defectos que ya costaron rondas, como los caracteres invisibles o un ADR aceptado editado in place

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – REVIEW.md con las cuatro secciones de la convención
```gherkin
Dado que "docs/templates/REVIEW-template.md" define las secciones "Qué es «Importante» aquí", "Tope de Minor", "No reportar" y "Verificar siempre"
Cuando el mantenedor crea "REVIEW.md" en la raíz del repositorio desde esa plantilla
Entonces "REVIEW.md" tiene esas cuatro secciones, en ese orden, sin placeholders "[...]" ni comentarios de la plantilla
  Y "Qué es «Importante» aquí" tiene una viñeta para cada área: "skills/", "scripts/", "docs/adr/", "docs/templates/" y "docs/guardrails/", y otra para cualquier archivo
  Y "Tope de Minor" fija un máximo de 5 LOW por revisor
  Pero "REVIEW.md" no tiene sección de formato de salida
```

### AC-2 — Escenario con datos – Cada regla del repo cae en una sola sección
```gherkin
Escenario: Ubicación de las reglas propias de agile-sddf
  Dado la regla de agile-sddf "<regla>"
  Cuando se busca en "REVIEW.md"
  Entonces aparece en una sola sección, "<sección>"
Ejemplos:
  | regla                                                                                       | sección                  |
  | un subagente delega en otro subagente o invoca un skill orquestador                         | Qué es «Importante» aquí |
  | un subagente escribe su informe fuera de la ruta de ".tmp/" que lee su skill                 | Qué es «Importante» aquí |
  | un ADR aceptado se edita in place                                                           | Qué es «Importante» aquí |
  | secretos falsos intencionados en "skills/*/examples/" y "skills/*/evals/"                    | No reportar              |
  | copias de instalación ".claude/", ".github/skills/", ".agents/" usadas como fuente de reglas  | No reportar              |
  | caracteres invisibles por bytes ("ai-no-hidden-characters") en el alcance de la historia      | Verificar siempre        |
  | "evals/evals.json" actualizado cuando cambia el comportamiento de un skill                   | Verificar siempre        |
```

### AC-3 — Escenario alternativo – Lo que ya cubre el gate no se verifica dos veces
```gherkin
Dado que "npm run verify:repository" ya ejecuta sus comprobaciones deterministas
Cuando se revisa la sección "Verificar siempre" de "REVIEW.md"
Entonces cada ítem nombra una comprobación que "verify:repository" no ejecuta
  Y "No reportar" excluye lo que "verify:repository" ya comprueba
  Pero ninguna ruta citada en "REVIEW.md" deja de existir en el repositorio
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Doble vocabulario:** cada sección usa los dos vocabularios, el de Claude Code Review y el de `story-code-review` (🔴 Important = HIGH/MEDIUM, 🟡 Minor = LOW, 🟣 Pre-existing = PREEXISTENTE), con la traducción que fije el ADR de la guía de revisión (STORY-178). Así el archivo sirve a `/story-code-review` y también al servicio gestionado de GitHub si algún día se activa.

- **CNF-2 — Sin cuarta raíz y sin publicación:** `REVIEW.md` vive en la raíz por convención de la herramienta, como `AGENTS.md` y `CLAUDE.md`, sin abrir una raíz nueva en ADR-0019. `package.json › files` no lo incluye y `npm pack --dry-run` no lo lista.

- **CNF-3 — Idioma y codificación:** español, UTF-8 sin BOM y sin caracteres invisibles (`ai-no-hidden-characters` de `docs/guardrails/gr-ai-security-checklist.md`, comprobado por bytes).

- **CNF-4 — Gate verde:** `npm run verify:repository` y `npm test` pasan tras añadir `REVIEW.md`.

## Fuera de alcance (Non-Goals)

- Quitar las reglas de agile-sddf de los agentes de `story-code-review` (CS-3) y hacer que el skill lea `REVIEW.md`: es la historia «story-code-review lee REVIEW.md». Esta historia copia las reglas en `REVIEW.md` y no modifica los agentes.
- La mecánica de PREEXISTENTE, la verificación de evidencia, la deduplicación y la aplicación del tope de LOW por el árbitro: son las historias «Hallazgos preexistentes» y «Verificación, deduplicación y tope de ruido». `REVIEW.md` solo declara las reglas.
- El `REVIEW.md` semilla para proyectos consumidores y la copia de la plantilla en `skills/sddf-constitution/assets/`: es la historia «REVIEW.md semilla para proyectos consumidores».
- Activar Claude Code Review en GitHub (decisión humana, fuera de alcance de la épica).

## 📎 Notas / contexto adicional

- Cubre la parte de `REVIEW.md` del criterio de salida **CS-1** de EPIC-28. La parte del ADR corresponde a STORY-178.
- **Orden recomendado:** implementar después de STORY-178. El vocabulario de CNF-1 y la tabla de AC-2 siguen la propuesta de las notas de la épica; si el ADR la ajusta, `REVIEW.md` adopta la traducción del ADR.
- **Plantilla:** `docs/templates/REVIEW-template.md` se ajustó el 2026-11-08, al crear esta historia, a las cuatro secciones de la convención. Se quitó la sección «Formato de salida» (prefijos `[P1-Seguridad]`…) porque `REVIEW.md` "cambia lo que la revisión encuentra y reporta; no cambia el formato" (code.claude.com/docs/en/code-review-customize): el formato lo fija la plantilla de `code-review-report.md`. Se añadió una línea con el vocabulario y la regla de que un Important exige `archivo:línea` y un escenario de fallo concreto.
- **Reglas que hoy viven en los agentes:** `skills/story-code-review/agents/integration-reviewer.agent.md:48-49` exige «un solo nivel de delegación» y cita el «Principio 6 de constitution.md» para la escritura en `.tmp/`. En un proyecto consumidor ese principio es otro. AC-2 recoge esas reglas sin citar el número de principio.
- **Fuente del contenido:** el borrador «REVIEW.md para este repo» de `.temp/propuestas-de-mejoras/mejora-015-REVIEW.md` (L60-L90). Ahí también figuran, como candidatos para «Qué es «Importante» aquí» y «No reportar», los scripts que escriben fuera de `REPO_ROOT` o de los destinos de `config/runtimes.json`, el uso de `.agents` como destino, la sobrescritura sin `--force` y los artefactos generados (`.tmp/`, `graphify-out/`, `specs/flow/archive/`). En `design.md` se decide cuáles entran.
- **Evidencia del ruido (2026-11-07):** ≈580 LOW en 55 de los 71 `code-review-report.md` archivados. En STORY-125, el Security-Reviewer usó como fuente de reglas la copia de instalación `.claude/skills/security-audit/…`, y los caracteres invisibles costaron una ronda.
