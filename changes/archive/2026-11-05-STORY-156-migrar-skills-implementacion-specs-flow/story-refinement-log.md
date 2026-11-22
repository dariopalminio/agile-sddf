---
type: refinement-log
story-id: STORY-156
improved: 2026-10-22
dimensions-improved: [I, N, E, S]
previous-score: 3.85
---

# Log de mejoras: STORY-156

## Resumen

- **Fecha:** 2026-10-22
- **Dimensiones mejoradas:** I, N, E, S (y T como efecto de la mejora de S)
- **Score previo (FINVEST):** 3.85
- **Veredicto previo:** NEEDS-REFINEMENT

## Cambios por dimensión

### I – Independencia (score previo: 2)

**Recomendación aplicada:** AC-3 solo puede cumplirse cuando STORY-150 y STORY-155 estén entregadas. Separa AC-3, el grep global de cierre, en una historia de cierre o gate, o acota el grep a los skills de esta historia (`story-implement*`, `story-code-review`, `story-verify`, `story-acceptance`). Así AC-1 y AC-2 dependen solo de STORY-148. Declara las dependencias duras en `related` o en las notas (`depends-on: STORY-148`) y distínguelas del orden sugerido.

**Cambio realizado:** AC-3 se acotó a los cinco skills de esta historia en lugar de todos los `skills/story-*`. La verificación global pasó a "Fuera de alcance", delegada al gate de STORY-148 a nivel de épica. En "Notas" se añadió una subsección "Dependencias": declara `depends-on: STORY-148` como dura, indica que AC-1 y AC-2 pueden desarrollarse contra el contrato documentado y aclara que STORY-150 y STORY-155 no son dependencias (el orden 150 → 155 → 156 es solo sugerido). También se eliminó la frase "Esta historia cierra el split", que imponía ese orden.

---

### N – Negociable (score previo: 3)

**Recomendación aplicada:** Describe el criterio en términos de resultado («ningún artefacto de historia se escribe fuera de `specs/flow/`») en lugar de fijar el comando `grep -rnE`. Deja el mecanismo de comprobación al diseño.

**Cambio realizado:** AC-3 ya no fija `grep -rnE "SPECS_BASE|SDDF_ROOT"`. Ahora exige dos resultados: que el gate determinista de STORY-148 no reporte resolución legada en esos skills y que ningún artefacto de historia quede fuera de `specs/flow/STORY-NNN-<slug>/`. El mecanismo concreto de comprobación queda para el diseño.

---

### E – Estimable (score previo: 3)

**Recomendación aplicada:** Añade en las notas un inventario inicial: cuántas coincidencias de `SPECS_BASE|SDDF_ROOT` hay hoy en los cinco skills y sus `assets/agents/`. Con eso el equipo puede estimar el esfuerzo.

**Cambio realizado:** Se añadió en "Notas" un inventario con fecha 2026-10-22, medido sobre el filesystem. Para cada skill recoge las coincidencias de `SPECS_BASE|SDDF_ROOT` (total, en `SKILL.md` y en otros archivos), las rutas `specs/stories` y los agentes locales. Suma 83 coincidencias de raíz legada y 40 rutas `specs/stories`. También se corrigió que los agentes locales viven en `agents/`, no en `assets/agents/`, y que no tienen coincidencias.

---

### S – Small (score previo: 2)

**Recomendación aplicada:** Cinco skills con agentes y evals es mucho para una sola entrega. Considera dividir en dos historias: (a) `story-implement` + `story-implement-tasks`; (b) `story-code-review` + `story-verify` + `story-acceptance`. El grep global pasaría a una tercera historia o a un gate de épica. Si la historia se mantiene unida, usa un Scenario Outline con tabla `Ejemplos` (skill → informe esperado) en lugar de enumerar los tres skills dentro de un único escenario.

**Cambio realizado:** La historia se mantiene unida (cambio mínimo) y se redujo su tamaño: el grep global sobre todos los `skills/story-*` salió del alcance y pasó al gate de épica. AC-1 y AC-2 se convirtieron en `Esquema del escenario` con tabla `Ejemplos`. AC-1 cubre `/story-implement` y `/story-implement-tasks`, que antes no tenía escenario; AC-2 cubre los tres skills de revisión, cada uno con su informe. En "Notas" se documentó el corte (a)/(b) por si el equipo decide dividirla.

---

### T – Testeable (score previo: 4, mejora derivada de S)

**Recomendación aplicada:** Convierte AC-2 en un Scenario Outline con `Ejemplos` (`/story-code-review` → `code-review-report.md`, `/story-verify` → `verify-report.md`, `/story-acceptance` → `acceptance-report.md`). Con eso se evalúa cada skill por separado y F3 pasa a 5.

**Cambio realizado:** AC-2 es ahora un `Esquema del escenario` con exactamente esa tabla, más el paso `Y no se escribe nada en "docs/specs/"`, igual que en AC-1.

---
