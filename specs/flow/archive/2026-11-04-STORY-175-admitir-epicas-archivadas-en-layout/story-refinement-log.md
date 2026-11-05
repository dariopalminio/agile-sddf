---
type: refinement-log
story-id: STORY-175
improved: 2026-10-29
dimensions-improved: [V, E, S, T]
previous-score: 3.97
---

# Log de mejoras: STORY-175

## Resumen

- **Fecha:** 2026-10-29
- **Dimensiones mejoradas:** V, E, S, T
- **Score previo (FINVEST):** 3.97
- **Veredicto previo:** NEEDS-REFINEMENT

## Cambios por dimensión

### V – Valiosa (score previo: 3)

**Recomendación aplicada:** Dar al `Para` una señal observable propia, por ejemplo: «…para que `/epic-complete` pueda archivar una épica y los skills de épica sigan numerando y resolviendo épicas sin colisiones ni falsos “no encontrada”». Así el valor deja de depender solo de STORY-171 y STORY-172.

**Cambio realizado:** Se reescribió el `Para` de la historia. Ahora nombra a `/epic-complete` como beneficiario y añade una señal que se puede observar: los skills de épica no reutilizan números de épicas archivadas, y AC-3 lo verifica.

---

### E – Estimable (score previo: 3)

**Recomendación aplicada:** Sustituir «revisar también los demás `skills/epic-*/SKILL.md`» por la lista concreta de lo que hay que cambiar: `epic-analyze`, `epic-creation`, `epic-generate-stories`. Decidir si `epic-from-project-plan` también necesita contar las épicas archivadas al numerar. Aclarar que el ADR nuevo tendrá probablemente el número ADR-0019, porque ADR-0018 ya existe en `PROPOSED`.

**Cambio realizado:** En «Notas / contexto adicional», la nota abierta sobre SKILL.md se sustituyó por una tabla cerrada de documentos y del cambio que necesita cada uno, verificada con una búsqueda de «no se archivan». Quedó decidido que `epic-from-project-plan` también cuenta las épicas archivadas (`$MAX_EPIC`, línea 55). Se aclaró que las copias en `.claude/`, `.agents/` y `.codex/` son salida de `install` y que el ADR será probablemente ADR-0019. Se añadió un Non-Goal que excluye los `design.md` y `tasks.md` históricos de STORY-147, STORY-151 y STORY-152.

---

### S – Small (score previo: 3)

**Recomendación aplicada:** No hace falta dividirla, pero conviene que AC-2 no crezca. Si el ajuste de la numeración de `epic-creation` resulta no trivial, puede salir a una historia hermana.

**Cambio realizado:** Se mantuvieron tres criterios. AC-2 no añadió escenarios: solo se cerró su `Pero` con un ámbito que se puede comprobar. La numeración se resolvió dentro de AC-3, como Scenario Outline de dos filas, en lugar de añadir un AC-4. La tabla de alcance de las notas acota el trabajo para que no crezca durante el planning.

---

### T – Testeable (score previo: 3)

**Recomendación aplicada:** Alinear AC-1 y CNF-1 con la convención de reemplazo de ADR (`status`, `superseded-by` y nota visible, según `docs/adr/README.md:34`), incluida la fila del índice. Hacer que AC-3 falle hoy usando la numeración en lugar de `/epic-generate-stories`, que ya excluye el archivo. Ampliar el `Pero` de AC-2 a todo documento activo de `AGENTS.md`, `docs/` (salvo los ADR inmutables) y `skills/`.

**Cambio realizado:**
- AC-1 exige ahora que ADR-0017 pase a `status "SUPERSEDED"` con `superseded-by` y una nota de reemplazo. Añade un `Y` para la fila del índice en `docs/adr/README.md`. CNF-1 se reescribió con los tres cambios que permite el README.
- AC-2 cierra su `Pero` sobre `AGENTS.md`, `docs/` (salvo los ADR inmutables) y `skills/`, así que se puede verificar con una búsqueda.
- AC-3 se reemplazó por un Scenario Outline de numeración para `/epic-creation` y `/epic-from-project-plan`: con EPIC-30 archivada y EPIC-29 como la activa mayor, la épica nueva recibe EPIC-31 y no EPIC-30. Este escenario falla con el comportamiento actual.

---
