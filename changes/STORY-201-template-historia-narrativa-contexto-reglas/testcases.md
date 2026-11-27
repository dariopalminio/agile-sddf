---
type: testcases
id: STORY-201
slug: STORY-201-template-historia-narrativa-contexto-reglas-testcases
title: "Test Cases: Template de historia con narrativa, contexto y reglas de negocio"
story: STORY-201
created: 2026-11-27
updated: 2026-11-27
related:
  - STORY-201-template-historia-narrativa-contexto-reglas
---

<!-- Referencias -->
[[STORY-201-template-historia-narrativa-contexto-reglas]]

# Casos de Prueba: Template de historia con narrativa, contexto y reglas de negocio

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 4 |
| CT   | 0 |
| IT   | 2 |
| API  | 0 |
| E2E  | 3 |
| EV   | 6 |

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| E2E-001 | End-to-End | El template expone la estructura nueva | `docs/templates/story-template.md` y el seed actualizados | Se listan los títulos `## ` y `### AC-` del template y se compara con el seed | Aparecen en orden `## Narrativa`, `## Contexto y valor *(si aplica)*`, `## ✅ Criterios de aceptación (escenarios Gherkin)`, `## Reglas (reglas de negocio) *(si aplica)*`, `## ⚙️ Criterios no funcionales específicos *(si aplica)*`, `## 🚫 Fuera de alcance (Non-Goals) *(si aplica)*`, `## 🔗 Notas adicionales (Dependencias, supuestos y notas) *(si aplica)*`; los tres AC usan `### AC-<n> - `; las reglas terminan en `→ cubierta por [AC-1, AC-n]`; `cmp` seed ↔ copia = idénticos | AC-1 |
| E2E-002 | End-to-End | Historia nueva sin contexto ni reglas | Template actualizado y una necesidad sin contexto de negocio ni reglas transversales | Se ejecuta `/story-creation` con esa necesidad | El `story.md` tiene `## Narrativa` con `Como/Quiero/Para` y `## ✅ Criterios de aceptación (escenarios Gherkin)` con ≥1 AC principal y ≥1 alternativo; no contiene `## Contexto y valor` ni `## Reglas` | AC-2 |
| E2E-003 | End-to-End | Compatibilidad con historias de títulos anteriores | Una historia existente con `## ✅ Criterios de aceptación` y `## 📎 Notas / contexto adicional` | Se ejecuta `npm run verify:repository` | Código 0; story-acceptance, story-verify, story-evaluation, story-refine y epic-refine nombran el comienzo común o ambos títulos; el AC de cierre de epic-refine usa `### AC-<k+1> - ` | AC-3 |
| UT-001 | Unit | Orden y forma de los títulos del template | Seed reescrito (T001) | `grep -n "^## "` y `grep -c "  \*(si aplica)\*"` sobre el seed | Orden idéntico a AC-1 y 0 títulos con doble espacio | D-1, T003 |
| UT-002 | Unit | Borde: ningún AC del template usa raya | Seed reescrito | `grep -c "^### AC-[0-9]* —"` y `grep -c "^### AC-[0-9]* - "` | 0 y 3 respectivamente | D-6, T003 |
| UT-003 | Unit | Encoding de los archivos modificados | Todos los `.md` tocados por T001–T012 | Se inspeccionan los 3 primeros bytes y se busca U+FEFF | Ninguno empieza por `ef bb bf`; 0 coincidencias de U+FEFF | CNF-1, D-3, T015 |
| UT-004 | Unit | Borde: no quedan títulos anteriores en instrucciones | Consumidores y ejemplos inline actualizados (T004–T011) | `grep -rn "📎 Notas / contexto adicional"` en `skills/`, excluyendo `examples/`, `evals/` y `refinement-log-template.md`; `grep -c "### AC-<k+1> —" skills/epic-refine/references/sal-corrections.md` | 0 coincidencias en ambos | D-5, D-6, D-7, T014 |
| IT-001 | Integration | Scaffold de memory-system copia el seed nuevo | Seed actualizado | `npm test` (incluye `test/memory-system.test.js:476-477`) | Código 0; el `story-template.md` sembrado es byte a byte igual al seed | D-3, T013 |
| IT-002 | Integration | Gate determinista completo | Todos los cambios aplicados | `npm run verify:repository` | Código 0 (enlaces activos, layout fijo, release y smoke del tarball incluidos) | AC-3, T013 |
| EV-001 | Eval | story-creation, happy path con contexto y reglas | Template actualizado y una necesidad con contexto de negocio y dos reglas transversales | Se ejecuta `/story-creation` | El `story.md` incluye `## Contexto y valor` (2–5 líneas) y `## Reglas` con líneas `- **Regla-<n>:** … → cubierta por [AC-…]` que referencian AC existentes | D-4, T004 |
| EV-002 | Eval | story-creation, fail-fast sin template | No existe `docs/templates/story-template.md` ni el seed | Se ejecuta `/story-creation` | Emite `❌ No se encontró el template requerido…` y no crea `changes/STORY-NNN-*/` | D-4 |
| EV-003 | Eval | story-evaluation reconoce la estructura nueva | Una historia con `# 📖 Historia:` + `## Narrativa` y `## ✅ Criterios de aceptación (escenarios Gherkin)` con AC principal y alternativo | Se ejecuta `/story-evaluation` | Componente 1 no se penaliza por falta de `## 📖 Historia`; componente 2 = 5 | D-5, T008 |
| EV-004 | Eval | story-evaluation, borde: historia con títulos anteriores | Una historia con `## ✅ Criterios de aceptación` sin sufijo | Se ejecuta `/story-evaluation` | Componente 2 obtiene el mismo score que antes del cambio | D-5, T008 |
| EV-005 | Eval | epic-refine inserta el AC de cierre con guion | Una historia de cierre con `## ✅ Criterios de aceptación (escenarios Gherkin)` y un criterio de salida SAL-01 sin cobertura | Se ejecuta `/epic-refine` y se aplica la corrección | El AC nuevo es `### AC-<k+1> - Cierre del contrato de salida – CS-<n> de <EPIC_ID>`, dentro de la sección de AC | D-5, D-6, T010 |
| EV-006 | Eval | epic-refine, borde: notas en ambas formas | Una historia con `## 🔗 Notas adicionales…` y otra con `## 📎 Notas / contexto adicional` | Se aplica una corrección E1 en cada una | La línea E1 se agrega al final de la sección de notas existente en ambos casos, sin crear una sección duplicada | D-5, T010 |

## Notas de cobertura

- `tasks.md` se usó para enriquecer los casos: T003 → UT-001/UT-002, T013 → IT-001/IT-002, T014 → UT-004 y T015 → UT-003.
- No hay casos API, CT ni ST: el cambio es Markdown, sin endpoints, UI ni estado global.
- Los casos UT son verificaciones deterministas de archivos (`grep`, `cmp`, bytes). No hay funciones nuevas: el diseño descarta crear scripts (Decisiones de complejidad justificada).
- E2E-002 y todos los EV dependen de ejecutar un skill con LLM. Se validan manualmente (T016) o con `npm run test:eval -- <skill>` a criterio humano (`AGENTS.md`), y no forman parte del gate automático.
- Los fixtures de `skills/epic-analyze/evals/evals.json` y `skills/story-split/evals/evals.json` conservan los títulos anteriores a propósito: ejercitan la compatibilidad de AC-3.

## Test Cases Progress for STORY-201

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
- [ ] E2E-001: El template expone la estructura nueva
- [ ] E2E-002: Historia nueva sin contexto ni reglas
- [ ] E2E-003: Compatibilidad con historias de títulos anteriores
- [ ] UT-001: Orden y forma de los títulos del template
- [ ] UT-002: Borde: ningún AC del template usa raya
- [ ] UT-003: Encoding de los archivos modificados
- [ ] UT-004: Borde: no quedan títulos anteriores en instrucciones
- [ ] IT-001: Scaffold de memory-system copia el seed nuevo
- [ ] IT-002: Gate determinista completo
- [ ] EV-001: story-creation, happy path con contexto y reglas
- [ ] EV-002: story-creation, fail-fast sin template
- [ ] EV-003: story-evaluation reconoce la estructura nueva
- [ ] EV-004: story-evaluation, borde: historia con títulos anteriores
- [ ] EV-005: epic-refine inserta el AC de cierre con guion
- [ ] EV-006: epic-refine, borde: notas en ambas formas
