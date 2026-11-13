---
type: plan
id: plan-03
slug: plan-03-epic-analyze-acepta-cs-por-id
title: "Reparación BUG-003 — epic-analyze acepta CS-<id> por ID y cita el criterio literal"
status: COMPLETED
substatus: DONE
parent: BUG-003
created: 2026-11-12
updated: 2026-11-12
related:
  - BUG-003-epic-analyze-ignora-cs-por-id
  - EPIC-28-calibrar-story-code-review-con-review-md
---

# Plan: Reparación BUG-003 — epic-analyze acepta `CS-<id>` por ID y cita el criterio literal

## Contexto

`/epic-analyze` dejó EPIC-28 en `NEEDS-REFINEMENT` (6 SAL-01, commit `a33621b9`). Tres de esos errores se deben a que la regla E1 de `skills/epic-analyze/SKILL.md:198` acepta `SMOKE-<N>` por ID pero a un criterio de salida le exige el texto completo. Esto pasa aunque el template de épica declara un ID estable en cada criterio (`- [ ] **CS-N** — …`, `docs/templates/epic-template.md:30`) y `epic-improve` trata esos IDs como estables (`skills/epic-improve/references/correction-rules.md:22`). Además, en H-004 el informe citó CS-5 con una cláusula que venía de la línea de STORY-183 en el índice (`epic.md:35`) y no de `epic.md:45`.

Resultado buscado: una historia que cita `CS-<id>` por ID cubre el criterio (E1), igual que con `SMOKE-<N>`. La etiqueta del informe es el ID declarado. El texto citado de un criterio es copia literal de su línea en `epic.md`. Las épicas sin IDs siguen funcionando igual que hoy.

**Decisión del usuario:** el defecto 2 se corrige con una regla de copia literal en `SKILL.md` más un eval, sin extractor determinista.

**Hallazgo de la exploración:** `epic-refine` duplica la regla E1 y la etiqueta posicional (`skills/epic-refine/references/sal-corrections.md:16` y `:32`, «La misma de `epic-analyze` Paso 5b.2»). Si no se alinea, la revalidación de `epic-refine` no reconocería como resuelto un criterio citado por ID.

## Decisiones de diseño

- **D-1 — ID declarado.** Un criterio cuya línea es `- [ ] **CS-<id>** — <enunciado>` (también con `[x]` o con `- ` solo) declara el ID `CS-<id>`, con `<id>` = dígitos y un sufijo de letra opcional (`CS-5`, `CS-4a`). La etiqueta del informe pasa a ser ese ID. Un criterio sin ID conserva la etiqueta posicional `CS-<n>`. Si la épica mezcla criterios con ID y sin ID, los criterios sin ID se marcan `(implícito)`, como los smokes. Ante un ID repetido, se evalúa solo la primera aparición y se añade la nota `→ /epic-format-validation <EPIC_ID>`, igual que en `SKILL.md:192`. Así se elimina también el síntoma relacionado: en `d32fb24e`, la fila etiquetada `CS-5` mostraba el criterio `**CS-4a**`.
- **D-2 — E1 por ID.** Para un criterio con ID declarado, el token `CS-<id>` en el cuerpo del `story.md` es E1. El límite de palabra no admite que siga una letra ni un dígito, de modo que `CS-1` no casa con `CS-10` ni con `CS-1a`. Se mantienen las exclusiones actuales: frontmatter y secciones `## Fuera de alcance…`. La coincidencia por texto sigue valiendo como alternativa E1, ahora sobre el **enunciado**, sin el prefijo `**CS-<id>** —`. Los criterios sin ID solo tienen la regla de texto, como hoy.
- **D-3 — Copia literal (defecto 2).** La columna «Texto o nombre» de `cobertura-salida` y el **Elemento** de SAL-01 se copian exactamente de la línea `epic.md:<línea>` que se cita: el enunciado sin la casilla ni el prefijo del ID, sin reformular, sin abreviar y sin tomar texto de otras secciones (índice de historias, alcance). La normalización solo sirve para comparar y nunca se usa para mostrar. Es la misma garantía que ya tienen las citas `mención · story.md:<línea>`.
- **D-4 — Acción de SAL-01.** Con un ID declarado, la acción sugiere «citar `CS-<id>` en su `story.md`» en lugar de copiar el texto. Sin ID, la acción no cambia.
- **D-5 — Alineación de `epic-refine`.** En `sal-corrections.md` se cambian cuatro cosas:
  - La etiqueta: sigue saliendo de la fila del informe; la regla de respaldo pasa a ser la de D-1.
  - El «Elemento vigente»: se busca por ID si lo hay y, si no, por enunciado normalizado.
  - La «Regla E1»: se remite a D-2.
  - El texto que la declara «etiqueta posicional».

  La línea E1 que escribe (`- Cubre el criterio de salida CS-<id> de <EPIC_ID>: <texto>`) sigue siendo válida con las dos reglas y no cambia.
- **Sin cambios:** no se suman coberturas parciales (`SKILL.md:201`, decisión de diseño fuera de alcance del bug), ni cambian E2, las familias INT y MAD, el veredicto o `epic-validate`. Tampoco se toca `.claude/skills/`, que es salida de `agile-sddf install`.

## Archivos que se modifican

| Archivo | Cambio |
|---|---|
| `skills/epic-analyze/evals/evals.json` | Casos nuevos TC-031 a TC-034 al final; TC-011/TC-012 sin cambios (garantizan la compatibilidad sin IDs) |
| `skills/epic-analyze/SKILL.md` | Paso 5b.1 (línea 191): D-1. Tabla E1 (198): D-2. Párrafo nuevo tras 201: D-3. Ejemplos (205-211): una fila `CS-<id>` por mención y otra `CS-1` frente a `CS-1a`. Catálogo SAL-01 (217): D-4. Clave `cobertura-salida` (291): etiqueta declarada y copia literal. Conservar `<!-- SDDF-FIXED-LAYOUT: v1 -->` |
| `skills/epic-analyze/assets/epic-analyze-report-template.md` | Comentario de la línea 47: sustituir «CS-n es una etiqueta del reporte, no un ID de la épica» por la regla de D-1 y la copia literal de D-3 |
| `skills/epic-refine/references/sal-corrections.md` | Líneas 16, 18 y 32 (D-5) |
| `skills/epic-refine/evals/evals.json` | Caso nuevo TC-026 (revalidación por ID) |
| `specs/flow/BUG-003-epic-analyze-ignora-cs-por-id/bug.md` | Estado del work item y evidencias de verificación |

## Orden de trabajo (TDD, principio 11: evals antes que el skill)

1. **Activar el bug:** pasar `bug.md` y este plan a `PLAN/IN-PROGRESS`.
2. **Evals de `epic-analyze`.** Usar el mismo formato que TC-011 (`epic_md_lines`, `stories[].body_lines`):
   - **TC-031 (camino feliz):** criterios `**CS-1**` y `**CS-2**`; STORY-201 dice en sus Notas «Cubre **CS-1** de EPIC-30» y STORY-202, «Cubre **CS-2**». Se espera `contains`: `mención · story.md:`, `Contrato de salida: 3/3 cubiertos`, `verdict: APPROVED`, y `not_contains`: `SAL-01`.
   - **TC-032 (límite de palabra):** criterios `**CS-1**` y `**CS-1a**`, con una historia que cita solo `CS-1a`. Se espera SAL-01 sobre CS-1 cuya acción dice «citar `CS-1`», y CS-1a ✓.
   - **TC-033 (exclusión):** `CS-2` citado solo en `## Fuera de alcance`. Se espera SAL-01.
   - **TC-034 (fidelidad y etiqueta):** criterios `**CS-1a**`, `**CS-1b**` y `**CS-2**`, sin cobertura de CS-2. La línea del índice de STORY-202 parafrasea CS-2 y le añade una cláusula extra. Se espera `contains`: el enunciado exacto de CS-2, `| CS-1a |`, `| CS-2 |`; y `not_contains`: la cláusula extra y `CS-3`.
3. **Eval de `epic-refine`:** TC-026, con un informe SAL-01 sobre `CS-2` (ID declarado) donde la historia candidata ya cita `CS-2` por ID. Se espera `ya resuelto`, `YA-RESUELTOS: 1` y ningún `.bak`.
4. Ejecutar `npm run verify:repository`, que valida el inventario de evals. Los evals **no** se ejecutan en este paso.
5. **`epic-analyze/SKILL.md`:** aplicar D-1 a D-4 en las líneas indicadas arriba.
6. **Plantilla seed del informe:** actualizar el comentario de `cobertura-salida`.
7. **`epic-refine/references/sal-corrections.md`:** aplicar D-5.
8. **Verificación** (siguiente sección) y actualización de `bug.md`.

## Riesgos

- **Mención de un CS de otra épica:** si una historia cita «CS-2 de EPIC-27», se contaría como cobertura de CS-2 de su épica `parent`. Ya ocurre lo mismo con `SMOKE-<N>` y se acepta como riesgo: el universo se limita a las historias con `parent` de esta épica.
- **Cobertura declarada sin verificación:** citar el ID basta para cubrir, igual que con los smokes. La regla de no falsificación de `epic-refine` (CNF-2) no cambia, y E2 sigue siendo la evidencia fuerte.
- **La copia literal depende del agente:** la decisión del usuario lo acepta. TC-034 fija el caso que falló.
- **Conflictos con EPIC-29:** EPIC-29 no toca `epic-analyze` ni `epic-refine`. Aun así, conviene comprobarlo con `git status` antes de empezar, porque hay sesiones concurrentes (no usar `git stash`).
- **Unicode:** después de editar `SKILL.md`, `sal-corrections.md` y los `evals.json`, verificar por bytes que no aparezca un U+FEFF literal (incidencia recurrente; el gate no la detecta).

## Verificación

1. `npm run verify:repository`: gate completo, que incluye el inventario de evals y `verify:layout` con el marcador `SDDF-FIXED-LAYOUT: v1`.
2. `npm test`.
3. `grep -rn "no un ID de la épica" skills/epic-analyze skills/epic-refine`: sin resultados.
4. Bytes: `grep -c $'\xEF\xBB\xBF'` debe dar 0 en los cinco archivos editados.
5. Manual, a criterio humano por la cuota: `npm run test:eval -- epic-analyze` (TC-011, TC-012 y TC-031 a TC-034) y `npm run test:eval -- epic-refine` (TC-026 y los casos SAL existentes).
6. Manual, comprobación del proceso: ejecutar `/epic-analyze` sobre la próxima épica cuyas historias citen `CS-<id>`, o sobre una copia temporal de EPIC-28 tomada de `a33621b9`. CS-2, CS-5 y CS-7 deben salir ✓ y el texto de CS-5 debe ser literal. Anotar las evidencias en `bug.md`.
7. `graphify update .`
