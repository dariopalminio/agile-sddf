---
type: refinement-log
story-id: STORY-185
improved: 2026-11-08
dimensions-improved: [I, E, S]
previous-score: 4.02
---

# Log de mejoras: STORY-185

## Resumen

- **Fecha:** 2026-11-08
- **Dimensiones atendidas:** I, E, S
- **Score previo (FINVEST):** 4.02
- **Veredicto previo:** APPROVED
- **Motivo:** cambio de alcance solicitado para resolver INC-001. El reporte FINVEST previo sigue siendo histórico; no se recalculó el score.

## Cambios por dimensión

### I – Independencia (score previo: 3)

**Recomendación aplicada:** tratar STORY-180 como orden recomendado y permitir probar el tope declarado con un fixture de `REVIEW.md`.

**Cambio realizado:** las Notas aclaran que el tope por defecto y AC-2 funcionan sin STORY-180, y fijan cómo integrar el control de LOW después de la fusión de hallazgos de STORY-182.

### E – Estimable (score previo: 3)

**Recomendación aplicada:** fijar el orden de omisión por arrastre y aplicación del tope, y mostrar los LOW que no puedan compararse.

**Cambio realizado:** las Notas establecen el orden de selección, el tratamiento de los omitidos por arrastre y de los LOW sin ubicación comparable. AC-2 distingue la comparación con registro previo del informe legado sin registro.

### S – Small (score previo: 2)

**Recomendación aplicada:** acotar el alcance de AC-2 si el emparejamiento histórico resulta costoso.

**Cambio realizado:** la intención «Quiero» y AC-2 exigen omitir LOW repetidos solo cuando la revisión anterior guardó `code-review-lows.json`. Para un informe legado se aplica el tope, se avisa «arrastre no comprobado» y se crea el registro de la ronda actual. El diseño y las tareas retiran la adopción histórica con manifiesto y su prueba sintética.
