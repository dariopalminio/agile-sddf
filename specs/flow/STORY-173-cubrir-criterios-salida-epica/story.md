---
alwaysApply: false
type: story
id: STORY-173
kind: feat
slug: STORY-173-cubrir-criterios-salida-epica
title: "Skill epic-refine: asignar la cobertura de criterios de salida"
status: IMPLEMENT
substatus: DONE
parent: EPIC-23-completar-flujo-de-epic
created: 2026-10-29
updated: 2026-10-29
related:
  - EPIC-23-completar-flujo-de-epic
  - STORY-165
  - STORY-174
---
[[EPIC-23-completar-flujo-de-epic]]

# 📖 Historia: Skill `epic-refine` — asignar la cobertura de criterios de salida

**Como** Product Owner  
**Quiero** que `/epic-refine EPIC-NN` asigne cada criterio de salida o smoke test sin cobertura a una única historia que ya lo verifica parcialmente  
**Para** que la épica supere el análisis de criterios de salida sin elegir ni editar a mano la historia dueña, y sin repartir citas que falseen la cobertura.

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Asignar la cobertura a la historia de cierre
```gherkin
Dado que "epic-analyze-report.md" reporta el criterio "CS-1" sin cobertura (SAL-01)
  Y "STORY-301" y "STORY-302" aportan evidencia "parcial" de "CS-1"
  Y "STORY-302" es la única de las dos sin dependientes en el índice de "epic.md"
Cuando el mantenedor ejecuta "/epic-refine EPIC-30 --auto"
Entonces solo el "story.md" de "STORY-302" cita "CS-1"
  Y el "story.md" de "STORY-301" no recibe ninguna cita nueva de "CS-1"
  Y "epic-refine-report.md" registra "SAL-01 · CS-1 → STORY-302"
```

### AC-2 — Escenario alternativo – Criterio sin evidencia parcial
```gherkin
Dado que "epic-analyze-report.md" reporta el criterio "CS-2" sin cobertura (SAL-01)
  Y ninguna historia de "EPIC-30" aporta evidencia "parcial" de "CS-2"
Cuando el mantenedor ejecuta "/epic-refine EPIC-30 --auto"
Entonces "epic-refine-report.md" lista "SAL-01 · CS-2" como "fuera de alcance" con el responsable "PO"
  Y ningún "story.md" de "EPIC-30" cita "CS-2"
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Seguridad de datos (Backup obligatorio):** Cada `story.md` modificado debe ser respaldado como `story.md.bak` antes de su escritura.
- **CNF-2 — No falsificación de cobertura:** Una cita E1 (mención explícita) o un AC nuevo solo se escriben en una historia si esta verifica el criterio completo; queda prohibido repartir citas para forzar un veredicto `APPROVED` en el análisis posterior.
- **CNF-3 — Encoding:** Todos los archivos generados o modificados deben quedar en UTF-8 sin BOM.
- **CNF-4 — Tamaño del skill:** El detalle de la familia SAL vive en `references/` o `assets/` del skill y el cuerpo de `skills/epic-refine/SKILL.md` sigue por debajo de 500 líneas.

## 🚫 Fuera de alcance (Non-Goals)

- Modificar o retirar criterios de salida y smoke tests de `epic.md` (decisión del PO).
- Crear una historia nueva para cubrir un criterio sin evidencia (delega en `/epic-generate-stories`).
- Corregir el índice y los enlaces `related` (STORY-165) o las referencias obsoletas tras `/story-split` (STORY-174).

## 📎 Notas / contexto adicional

- **Hallazgos que cubre** (catálogo SAL de `skills/epic-analyze/SKILL.md`): SAL-01 (criterio de salida) y SAL-02 (smoke test `SMOKE-<N>`) cuando al menos una historia aporta evidencia `parcial`. Sin evidencia `parcial`, ambos van al PO. SAL-03 y SAL-04 siguen siempre al PO.
- **Regla de la historia de cierre:** entre las historias con evidencia `parcial`, la que no tiene dependientes en el índice de `epic.md`. Si ninguna o varias cumplen la regla, el hallazgo va al PO.
- **Propuesta para `story-design` (no vinculante):** si empatan varias, desempatar por el mayor `STORY-NNN`. Para cubrir el criterio, añadir a la historia de cierre un AC de cierre global con el bloque Gherkin que afirma el resultado completo y la cita literal (E1) del criterio en `## 📎 Notas`.
- **Split:** hermana de STORY-165 (core) resultante de `/story-split` (2026-10-29, patrón 2 — variaciones de reglas de negocio). Amplía el skill `epic-refine` que crea STORY-165, reutilizando su plan de cambios, sus backups y `epic-refine-report.md`. Se implementa después de STORY-165 y es independiente de STORY-174.
- Skill Tool: se debe usar skill-master
- Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores.
