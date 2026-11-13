---
type: refinement-log
story-id: STORY-192
improved: 2026-11-13
dimensions-improved: [I, N, V, S]
previous-score: 3.88
---

# Log de mejoras: STORY-192

## Resumen

- **Fecha:** 2026-11-13
- **Dimensiones mejoradas:** I, N, V, S
- **Score previo (FINVEST):** 3.88
- **Veredicto previo:** NEEDS-REFINEMENT

## Cambios por dimensión

### I – Independencia (score previo: 3)

**Recomendación aplicada:** Agregar `STORY-187-dominio-sin-estados-buffer` a `related` y a las Notas, porque cambia `domain-story-lifecycle` §4.1 y §5 y `epic-analyze/SKILL.md:236` declara su orden según ese documento. Decir en la nota de dependencia qué aporta STORY-186.

**Cambio realizado:** La nota de dependencia de «Notas / contexto adicional» se reemplazó por un bloque **Dependencias** con tres puntos. STORY-186 aporta el ADR que se cita, y los evals y el texto pueden empezar antes de que se entregue. STORY-187 tiene que dejar el mismo orden de estados porque `SKILL.md:236` cita `domain-story-lifecycle` §4.1 y §5. Se conservó que la historia es independiente de STORY-188 a STORY-191. `related` no se tocó, porque story-refine solo modifica `updated:` en el frontmatter: agregar STORY-187 queda pendiente para el refinamiento conversacional.

---

### N – Negociable (score previo: 3)

**Recomendación aplicada:** Mantener la lista de líneas solo en Notas como evidencia, no en el `Quiero`.

**Cambio realizado:** En el `Quiero` quedó solo el resultado: los skills de épica dejan de nombrar los buffers y `/epic-analyze` acepta el valor legado con un aviso. El paréntesis de ubicaciones pasó a una nota nueva, «Menciones a retirar». La aprobación manual salió del `Quiero`, porque ya la cubren AC-1, CNF-2 y el `Para`. También se agregaron a los puntos de cambio las líneas 20 y 30 de `README.md`.

---

### V – Valiosa (score previo: 3)

**Recomendación aplicada:** Cambiar el `Para` a algo observable, por ejemplo «Para que `/epic-analyze` me indique el paso real de aprobación (`PLAN/DONE`) y no marque como inmaduras las historias planificadas antes de 6.0.0».

**Cambio realizado:** El `Para` describía el estado del workflow de épica. Ahora dice el beneficio que el usuario ve en el reporte: `/epic-analyze` indica el paso real de aprobación (`PLAN/DONE`, editado a mano) y no clasifica como no clasificables las historias planificadas antes de 6.0.0.

---

### S – Small (score previo: 2)

**Recomendación aplicada:** En AC-3, quitar la fila `IMPLEMENT` (o la `SPECIFY`). En AC-2, quedarse con una sola fila de control `no-clasificable` (el eval de `BACKLOG` ya existe).

**Cambio realizado:** Se quitaron la fila `BACKLOG` de AC-2 (ya tiene eval en `evals.json`) y la fila `IMPLEMENT` de AC-3 (comportamiento que no cambia). Los casos bajan de 7 a 5, y la fila `READY-FOR-VERIFY` muestra que la regla del valor legado no abarca cualquier `READY-FOR-*`. Los dos casos retirados se documentan en la nota nueva «Casos que no cambian». No se dividió la historia.

---
