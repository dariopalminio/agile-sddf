---
alwaysApply: false
type: tasks
id: STORY-201
slug: STORY-201-template-historia-narrativa-contexto-reglas-tasks
title: "Tasks: Template de historia con narrativa, contexto y reglas de negocio"
status: PLAN
substatus: IN-PROGRESS
parent: null
story: STORY-201
design: STORY-201
created: 2026-11-27
updated: 2026-11-27
related:
  - STORY-201-template-historia-narrativa-contexto-reglas
---

<!-- Referencias -->
[[STORY-201-template-historia-narrativa-contexto-reglas]]

## 1. Template de historia (seed y copia del proyecto)

- [x] T001 Reescribir `skills/story-creation/assets/story-template.md` con el contenido de `changes/STORY-201-template-historia-narrativa-contexto-reglas/story-new-template.md`. Agregar `<!-- sección opcional · escritor: defecto -->` a `## Contexto y valor *(si aplica)*` y a `## Reglas (reglas de negocio) *(si aplica)*`. Conservar sin cambios el frontmatter, la línea `[[…]]` y los comentarios `escritor:` del template vigente (D-1, D-2). // AC-1, AC-2
- [x] T002 Copiar por bytes el seed a `docs/templates/story-template.md` (`cp`) y verificar con `cmp` que son idénticos (D-3). // AC-1, CNF-1
- [x] T003 Verificar el seed: no tiene BOM (`head -c3` ≠ `ef bb bf`) ni U+FEFF literal; los títulos `## ` están en el orden de AC-1 sin espacios dobles; los tres `### AC-<n> - ` usan guion y no hay `### AC-<n> —`; las líneas `- **Regla-<n>:**` terminan en `→ cubierta por [AC-1, AC-n]` (contratos 1–4 y 9 de design.md). // AC-1, CNF-1

## 2. Generación de historias (`story-creation`)

- [x] T004 [P] En `skills/story-creation/SKILL.md` («Restricciones / Reglas»), agregar la regla: las secciones del template marcadas `*(si aplica)*` se omiten por completo, título incluido, cuando la necesidad no aporta contenido, y nunca quedan con placeholders (D-4). // AC-2
- [x] T005 [P] En `skills/story-creation/SKILL.md` («Ejemplo de output»), actualizar el ejemplo a `## Narrativa`, `## ✅ Criterios de aceptación (escenarios Gherkin)`, `### AC-1 - …` / `### AC-2 - …` y `## 🔗 Notas adicionales (Dependencias, supuestos y notas) *(si aplica)*`. El ejemplo omite `Contexto y valor` y `Reglas` (D-4). // AC-2

## 3. Compatibilidad de los skills consumidores

- [x] T006 [P] En `skills/story-acceptance/SKILL.md:203`, reemplazar el título exacto por «la sección cuyo título empieza por `## ✅ Criterios de aceptación`» y nombrar ambas formas (D-5). // AC-3
- [x] T007 [P] En `skills/story-verify/SKILL.md:397`, aplicar el mismo cambio que T006 (D-5). // AC-3
- [x] T008 [P] En `skills/story-evaluation/SKILL.md:222-239`, hacer que el componente 1 acepte `## 📖 Historia` o el par `# 📖 Historia:` + `## Narrativa`, y que el componente 2 busque la sección que empieza por `## ✅ Criterios de aceptación`. No cambiar scores, pesos ni umbrales (D-5). // AC-3
- [x] T009 [P] En `skills/story-refine/SKILL.md:244,247`, nombrar la sección de notas en sus dos formas: `## 🔗 Notas adicionales…` y, en historias anteriores, `## 📎 Notas / contexto adicional` (D-5). // AC-3
- [x] T010 [P] En `skills/epic-refine/references/sal-corrections.md`, cambiar las líneas 54, 76 y 131 a «la sección cuyo título empieza por `## ✅ Criterios de aceptación`», la línea 95 a «empieza por `## 🔗 Notas` o `## 📎 Notas`», y en las líneas 83 y 91 `### AC-<k+1> —` por `### AC-<k+1> -` (D-5, D-6). // AC-3
- [x] T011 [P] Actualizar los ejemplos inline de `skills/epic-generate-stories/SKILL.md` (líneas 253, 288-311) y `skills/epic-generate-all-stories/SKILL.md` (líneas 255-278) a los títulos nuevos y a `### AC-<n> - …`, sin cambiar su regla `[Por completar]` (D-7). // AC-3

## 4. Documentación de la versión

- [x] T012 Agregar `### Changed` en `## [Unreleased]` de `CHANGELOG.md` con la estructura nueva del template, el guion en los títulos de AC y la compatibilidad con los títulos anteriores. No es BREAKING (D-8). // AC-1, AC-3

## 5. Verificación

- [x] T013 Ejecutar `npm test` y `npm run verify:repository`; ambos terminan con código 0 (incluye `test/memory-system.test.js:476-477`, igualdad seed ↔ scaffold). // AC-3
- [x] T014 [P] Ejecutar `grep` sobre los cinco consumidores de AC-3: cada uno nombra el comienzo común o ambos títulos, y `grep -c "### AC-<k+1> —" skills/epic-refine/references/sal-corrections.md` = 0. Un `grep` de `📎 Notas / contexto adicional` en `skills/` (sin `examples/`, `evals/` ni `refinement-log-template.md`) no devuelve coincidencias (contratos 7 y 8). // AC-3
- [x] T015 [P] Verificar el encoding de todos los `.md` modificados: sin BOM y sin U+FEFF literal, comprobado por bytes. // CNF-1
- [x] T016 Validación manual: reinstalar localmente (`npx agile-sddf install --target claude --force`), ejecutar `/story-creation` con una necesidad sin contexto ni reglas y comprobar que el `story.md` generado tiene `## Narrativa` y `## ✅ Criterios de aceptación (escenarios Gherkin)` con ≥1 AC principal y ≥1 alternativo, sin `## Contexto y valor` ni `## Reglas`. Después, eliminar el directorio `changes/STORY-NNN-…` de prueba y registrar la evidencia en `implement-report.md` (contrato 5). // AC-2
