---
type: improvement-log
story-id: STORY-133
improved: 2026-10-14
dimensions-improved: [N, V, S, T]
previous-score: 3.97
---

# Log de mejoras: STORY-133

## Resumen

- **Fecha:** 2026-10-14
- **Dimensiones mejoradas:** N, V, S, T
- **Score previo (FINVEST):** 3.97
- **Decisión previa:** REFINAR

## Cambios por dimensión

### N – Negociable (score previo: 3)

**Recomendación aplicada:** Reformular el `Quiero` en términos del comportamiento que observa el practitioner, no del archivo. Dejar la ruta `discovery-ux.md` como restricción en Notas. Agregar `## Fuera de alcance`.

**Cambio realizado:** El `Quiero` ya llegó reformulado por el usuario antes de esta ejecución ("que la sesión del skill asuma el rol UX leyendo un rol local en lugar de delegar en el agente global `project-ux`") y se conservó. El nombre `discovery-ux.md` queda como restricción en Notas. Se agregó la sección `## Fuera de alcance (Non-Goals)` con tres exclusiones: el formato de `ux-findings.md`, los roles PM y Architect (STORY-131/132) y la limpieza de copias ya instaladas en los destinos de runtime.

---

### V – Valiosa (score previo: 3)

**Recomendación aplicada:** Corregir el `Para` según la evidencia (no hay delegación anidada sobre `project-ux`). Resolver la nota pendiente de Notas y avisar que el criterio de salida de la épica parte de una premisa que conviene revisar.

**Cambio realizado:** El `Como` y el `Para` ya llegaron reformulados por el usuario (Solo Builder y Product Owner que ejecuta `/project-discovery` desde Codex, para obtener los hallazgos UX aunque el runtime no soporte subagentes) y se conservaron. En Notas se eliminó la viñeta "Cubre el criterio de salida…". La nota pendiente ("ubicar con precisión dónde ocurre hoy la delegación anidada") se reemplazó por el hallazgo verificado: la invocación es de un solo nivel desde el Paso 5 de `skills/project-discovery/SKILL.md` y el valor está en que el rol pase a ser local. Además, la nota advierte sobre la premisa del criterio de salida de la épica. Se agregó una nota que justifica el runtime objetivo: `codex` es el único con `agentsDirectory: null` y el SMOKE-1 de la épica lo valida. La épica no se modificó.

---

### S – Small (score previo: 3)

**Recomendación aplicada:** El tamaño es adecuado y no hace falta dividirla. Si se agrega el escenario de error propuesto en T, no conviene sumar más.

**Cambio realizado:** No se dividió la historia. Los escenarios se limitaron a tres (AC-1 a AC-3), y AC-2 se acotó a una sola búsqueda verificable en lugar de una revisión abierta de las instrucciones.

---

### T – Testeable (score previo: 3)

**Recomendación aplicada:** En AC-1, nombrar la ruta exacta en lugar de "la ruta inyectada". Convertir AC-2 en una búsqueda verificable de "project-ux". Agregar un escenario de error para cuando falta `discovery-ux.md`.

**Cambio realizado:**
- **AC-1:** "la ruta inyectada que usaba project-ux" se reemplazó por `.tmp/project-discovery/ux-findings.md`, y se agregó el paso que comprueba que la propuesta de requisitos recibe esa ruta como `$UX_FINDINGS_PATH`.
- **AC-2:** pasó a llamarse "Ninguna invocación al agente global" y ahora busca "project-ux" en `skills/`, `agents/`, `config/` y `test/`, con un `Pero` que exige que `ux-findings.md` se siga produciendo en la misma sesión.
- **AC-3 (nuevo):** si falta `discovery-ux.md`, el skill informa que falta el rol local y termina sin escribir en `$SPECS_BASE`. Este comportamiento es coherente con el manejo de templates faltantes del skill.
- **Formato:** se restauraron los saltos de línea Markdown (dos espacios al final) en `Como` y `Quiero`.

---
