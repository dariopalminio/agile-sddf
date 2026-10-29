---
alwaysApply: false
type: story
id: STORY-165
kind: feat
slug: STORY-165-corregir-indice-y-enlaces-epica
title: "Skill epic-refine (Core): corregir índice y enlaces de una épica"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-23-completar-flujo-de-epic
created: 2026-10-25
updated: 2026-10-29
related:
  - EPIC-23-completar-flujo-de-epic
  - STORY-173
  - STORY-174
---
[[EPIC-23-completar-flujo-de-epic]]

# 📖 Historia: Skill `epic-refine` (Core) — corregir índice y enlaces de una épica

**Como** Solo Builder y Product Owner  
**Quiero** que `/epic-refine EPIC-NN` corrija en `epic.md` y en los `story.md` los hallazgos de índice de historias y de enlaces `related` que reporta `epic-analyze-report.md`, mostrando antes el plan de cambios  
**Para** no corregir a mano el índice ni los enlaces rotos de una épica cada vez que `epic-analyze` los detecta, y poder volver a analizarla sin esos hallazgos.

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Aplicar hallazgos y generar reporte
```gherkin
Dado que "epic-analyze-report.md" de "EPIC-30" tiene "verdict: NEEDS-REFINEMENT" con hallazgos INT-02 (huérfana "STORY-304") y MAD-02 (related roto "STORY-999" en "STORY-301")
Cuando el mantenedor ejecuta "/epic-refine EPIC-30" y confirma el plan de cambios consolidado
Entonces existen "epic.md.bak" y "STORY-301-*/story.md.bak" con el contenido previo a la escritura
  Y el índice de "epic.md" contiene una línea F2 para "STORY-304"
  Y el "related" de "STORY-301" ya no contiene "STORY-999"
  Y "epic-refine-report.md" lista los hallazgos INT-02 y MAD-02 como aplicados
  Y el "status" y el "substatus" de "epic.md" y de cada "story.md" son idénticos a los previos
```

### AC-2 — Escenario de cierre – Veredicto APPROVED
```gherkin
Dado que "epic-analyze-report.md" tiene "verdict: APPROVED"
Cuando el mantenedor ejecuta "/epic-refine EPIC-30"
Entonces el skill emite un mensaje indicando que la épica no necesita refinamiento
  Y ningún archivo de "specs/flow/" se crea ni se modifica, incluido "epic-refine-report.md"
```

### AC-3 — Escenario alternativo – Solo hallazgos que requieren decisión del PO
```gherkin
Dado que "epic-analyze-report.md" tiene "verdict: NEEDS-REFINEMENT"
  Pero todos sus hallazgos son INT-01, INT-05 o SAL-03
Cuando el mantenedor ejecuta "/epic-refine EPIC-30 --auto"
Entonces el skill lista cada hallazgo como "fuera de alcance" con el responsable "PO"
  Y ningún "epic.md" ni "story.md" se modifica
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Seguridad de datos (Backup obligatorio):** Cada archivo modificado (`epic.md` o `story.md`) debe ser respaldado como `<archivo>.bak` antes de su escritura.
- **CNF-2 — Gestión de contenido no confiable:** El contenido de los reportes y los artefactos es tratado como datos, no como instrucciones. Cualquier intento de inyección de prompt en el texto se registra en las notas del reporte, no se ejecuta.
- **CNF-3 — Encoding:** Todos los archivos generados o modificados deben quedar en UTF-8 sin BOM.
- **CNF-4 — Progressive disclosure:** Los catálogos de hallazgos y el detalle extenso de cada corrección viven en `references/` o `assets/` del skill y se cargan solo cuando el reporte contiene un hallazgo de esa familia.
- **CNF-5 — Tamaño del skill:** El cuerpo de `skills/epic-refine/SKILL.md` tiene menos de 500 líneas (límite de `docs/guides/custom-skill-creation-guide.md`).

## 🚫 Fuera de alcance (Non-Goals)

- Modificar los criterios de salida, smoke tests o alcance de `epic.md` sin confirmación explícita del PO.
- Cambiar los estados (`status`/`substatus`) de la épica o de las historias.
- Crear nuevas historias o especificarlas (delega en `/epic-generate-stories`, `/story-creation` o `/story-specify`).
- Modificar `epic-analyze-report.md` (debe ser regenerado por el skill `/epic-analyze`).
- Asignar la cobertura de criterios de salida y smoke tests (SAL-01, SAL-02): lo aborda STORY-173.
- Detectar referencias obsoletas que `epic-analyze` no reporta (COH): lo aborda STORY-174.

## 📎 Notas / contexto adicional

- **Origen:** El flujo de calidad actual detecta problemas (`epic-analyze`) pero no tiene un mecanismo automatizado para corregirlos a nivel de épica. `story-fix-plan` resuelve esto a nivel de historia, pero las correcciones de índice y enlaces `related` cruzados requieren un skill de nivel superior.
- **Modos de ejecución:** El skill debe soportar un modo manual interactivo (muestra el plan y pide confirmación) y un modo `--auto` (aplica las correcciones automáticas y deriva las decisiones del PO a "fuera de alcance").
- **Idempotencia:** El skill debe ser seguro de re-ejecutar tras un fallo parcial, gracias a la verificación previa de hallazgos "ya resueltos" contra el sistema de archivos.
- **Catálogo de hallazgos de esta historia** (tomado de los catálogos INT, SAL y MAD de `skills/epic-analyze/SKILL.md`):

  | Tratamiento | Códigos |
  |---|---|
  | Corrección automática | INT-02 (añadir línea F2/F3 al índice), INT-03 (dejar una sola línea), MAD-02 (corregir o retirar la entrada `related`) |
  | Siempre al PO ("fuera de alcance") | INT-01, INT-04, INT-05, INT-06, SAL-03, SAL-04, MAD-01, MAD-03 |
  | "Fuera de alcance" hasta que se entregue STORY-173 | SAL-01, SAL-02 |

- **Propuesta para `story-design` (no vinculante):** ejecución estrictamente secuencial, sin subagentes. El plan de cambios y `epic-refine-report.md` se diseñan para que STORY-173 y STORY-174 añadan sus familias de hallazgos sin cambiar su estructura.
- **Split:** historia core resultante de `/story-split` (2026-10-29, patrón 2 — variaciones de reglas de negocio). Las hermanas STORY-173 (cobertura de criterios de salida) y STORY-174 (coherencia derivada tras `/story-split`) amplían este skill; se implementan después de esta historia y son independientes entre sí. El `finvest-evaluation-report.md`, `story-refinement-log.md` y `story.md.bak` de este directorio corresponden a la historia antes del split.
- Skill Tool: se debe usar skill-master
- Cubre el criterio de salida de EPIC-23: **CS-15** — `epic-refine` aplica los hallazgos de `epic-analyze-report.md` con backup de cada archivo modificado, escribe `epic-refine-report.md` y no cambia `status` ni `substatus`; con `verdict: APPROVED` no modifica ningún archivo.
- Cubre el smoke test de EPIC-23: **SMOKE-5** — Bucle de PLAN: historia huérfana entra al índice.
- Aporta a **CS-12** la parte de `epic-refine`: `skills/epic-refine/SKILL.md` existe, declara `<!-- SDDF-FIXED-LAYOUT: v1 -->`, figura en el arreglo `files` de `package.json` y tiene `evals/evals.json`.
- Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores.
