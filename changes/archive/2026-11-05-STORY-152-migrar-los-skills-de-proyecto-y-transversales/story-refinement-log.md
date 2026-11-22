---
type: refinement-log
story-id: STORY-152
improved: 2026-10-22
dimensions-improved: [I, N, V, E, S]
previous-score: 3.80
---

# Log de mejoras: STORY-152

## Resumen

- **Fecha:** 2026-10-22
- **Dimensiones mejoradas:** I, N, V, E, S
- **Score previo (FINVEST):** 3.80
- **Veredicto previo:** NEEDS-REFINEMENT

## Cambios por dimensión

### I – Independencia (score previo: 3)

**Recomendación aplicada:** Declarar la relación con STORY-154. AC-2 remite a `docs/guides/artifact-directory-migration.md`, que ya existe pero STORY-154 puede cambiar. Acotar en AC-2 que basta con que exista la ruta de la guía; su contenido no es criterio de esta historia.

**Cambio realizado:** Se añadió en Notas el apartado "Dependencias y desacople":
- STORY-148: se explica cómo verificar AC-1 con `grep` mientras el gate no esté entregado, como si fuera un stub.
- STORY-154: AC-2 solo exige que el diagnóstico remita a la ruta de la guía, y el contenido de la guía queda como responsabilidad de STORY-154.

También se añadió un Non-Goal sobre la redacción de la guía.

---

### N – Negociable (score previo: 3)

**Recomendación aplicada:** Reformular AC-1 como resultado observable y dejar el comando `grep` como nota de verificación, para que el diseño pueda elegir otro mecanismo, como el gate de STORY-148. Sacar de AC-4 la lista de documentos que hay que editar.

**Cambio realizado:** Se cambió AC-1:
- Ahora verifica que `npm run verify:repository` no reporta referencias legadas en los skills retirados de la lista transitoria de STORY-148. Antes prescribía un `grep`.
- El `grep` y la regla de no leer la clave `root` pasaron a Notas.

AC-4 ya no enumera archivos a editar: comprueba la ausencia de la cadena en un conjunto de rutas. La lista de referencias se queda en Notas.

---

### V – Valiosa (score previo: 3)

**Recomendación aplicada:** Reescribir `Para` con un beneficio observable para el practitioner y considerar una métrica simple: 0 coincidencias de `SPECS_BASE`/`SDDF_ROOT` fuera de `skill-preflight`.

**Cambio realizado:** Se reescribió `Para` con beneficios observables:
- Los skills funcionan en un repo recién inicializado sin `sddf.config.yaml` ni `SDDF_ROOT`.
- `/skill-preflight` nombra cada señal legada y la guía de migración.

Se añadió **CNF-3 — Métrica de cierre**: 0 coincidencias en los skills de AC-1, frente a los 26 archivos actuales.

---

### E – Estimable (score previo: 3)

**Recomendación aplicada:** Listar en Notas qué skills `project-*` se migran, porque el comodín oculta el tamaño real.

**Cambio realizado:** Se añadió en Notas una tabla de "Inventario de alcance" con los 11 skills afectados y el número de archivos de cada uno que hoy contiene `SPECS_BASE` o `SDDF_ROOT`. Son 26 archivos en 10 skills, más 3 en `skill-preflight`.

También se sumó `README.md` a las referencias vigentes de `docs-wiki-builder`; la historia original lo omitía.

---

### S – Small (score previo: 2)

**Recomendación aplicada:** Dividir con `/story-split` en tres historias (migración de rutas fijas, diagnóstico en `skill-preflight` y eliminación de `docs-wiki-builder`), o reducir el alcance.

**Cambio realizado:** Se redujeron pasos sin quitar alcance:
- AC-1 pasó de 5 a 4 pasos.
- AC-4 pasó de 8 a 7 pasos: la excepción de menciones históricas, cubierta por las rutas acotadas, se movió a Notas.
- AC-2 se mantuvo como escenario único, sin `Scenario Outline`, para no aumentar el número de escenarios.

Se añadió en Notas el apartado "Tamaño", con la división recomendada en tres entregas y un orden de implementación sugerido (3 → 1 → 2) por si la historia se mantiene unida. La división efectiva queda para `/story-split`.

---

### T – Testeable (score previo: 4, mejora complementaria)

**Recomendación aplicada:** Enumerar en AC-2 las señales legadas y sustituir en AC-4 la aserción subjetiva "ya no lo presentan como skill disponible".

**Cambio realizado:** Se modificaron dos criterios:
- AC-2 enumera las tres señales y exige nombrar las presentes y omitir las ausentes.
- AC-4 comprueba que la cadena `docs-wiki-builder` no aparezca bajo `skills/`, `docs/architecture/`, `docs/guides/`, `docs/runbooks/` ni en `README.md`. La única excepción explícita es la instrucción de borrado manual en la guía de migración.
