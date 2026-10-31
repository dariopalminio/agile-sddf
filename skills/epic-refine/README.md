# epic-refine

> **Tipo:** skill · **Categoría:** worker  
> **Ubicación:** `skills/epic-refine/SKILL.md`  
> **Estado:** beta

---

## Qué hace

Corrige una épica que `epic-analyze` dejó en `NEEDS-REFINEMENT`: añade al índice de `epic.md` las historias huérfanas (INT-02), deja una sola línea por historia duplicada (INT-03) y retira de los `story.md` las entradas `related` que apuntan a historias o épicas inexistentes (MAD-02) y asigna cada criterio de salida o smoke test sin cobertura (SAL-01, SAL-02) a la historia de cierre —la única que ya lo verifica en parte y de la que no depende ninguna otra—, a la que añade un AC de cierre y una cita del criterio; si no hay una única historia de cierre, la decisión queda para el PO. Además detecta por su cuenta (familia COH) las referencias a slugs de historias que dejaron de existir tras un `/story-split` —en el índice de `epic.md` y en los `related` de las historias de la épica, nunca en el cuerpo de los `story.md` ni en `docs/`— y las reemplaza por el slug del único directorio con el mismo ID; si no hay ninguno o hay varios, la referencia queda para el PO. Antes de escribir muestra un plan de cambios consolidado y pide confirmación; los hallazgos que requieren una decisión del PO no se tocan y quedan registrados como «fuera de alcance» con su responsable. Es el corrector del bucle de `PLAN`, `epic-analyze → epic-refine → epic-analyze`.

**Qué produce:**

- `epic.md` y los `story.md` activos de la épica corregidos (solo cambian las líneas del plan y `updated:`), cada uno con su `<archivo>.bak` previo.
- `<EPIC_DIR>/epic-refine-report.md` con cada hallazgo clasificado como `aplicado`, `ya resuelto` o `fuera de alcance`, los cambios aplicados y las notas; no lleva veredicto.
- Un resumen en consola (modo manual) o un bloque de retorno `STATUS`/`APLICADOS`/`YA-RESUELTOS`/`FUERA-DE-ALCANCE`/`REPORTE` (modo Agent o `--auto`).

**Qué no hace:**

- No diagnostica la épica ni vuelve a ejecutar `epic-analyze` al terminar.
- No cambia `status`, `substatus` ni `parent`; no modifica criterios de salida, smoke tests ni alcance; no crea historias.
- No modifica ni retira criterios de salida ni smoke tests de `epic.md`, y no crea historias para cubrir un criterio sin evidencia parcial.
- No reparte citas de un criterio entre varias historias: la cobertura se asigna a una sola historia de cierre.
- No modifica `epic-analyze-report.md` ni las historias archivadas.
- No corrige la forma de `epic.md` (eso es `epic-improve`).
- No ejecuta `/story-split` ni detecta historias que convenga dividir.

---

## Cuándo usarlo

**Úsalo cuando:**

- `epic-analyze` declaró `NEEDS-REFINEMENT` por historias huérfanas, líneas duplicadas en el índice, `related` rotos o criterios de salida y smoke tests sin cobertura que una historia ya verifica en parte.
- Quieras volver a analizar la épica sin corregir a mano el índice ni los enlaces.
- Tras un `/story-split`, el índice o los `related` sigan citando el slug anterior de la historia core.
- El usuario mencione: `"epic-refine"`, `"refinar épica"`, `"aplicar epic-analyze"`, `"historia huérfana"`, `"related roto"`, `"criterio de salida sin cobertura"`, `"referencias obsoletas tras split"`.

**No lo uses cuando:**

- La épica no tiene todavía `epic-analyze-report.md` → usa `[[epic-analyze]]` primero.
- Debas corregir la forma de `epic.md` señalada por `epic-format-validation` → usa `[[epic-improve]]`.
- Falten historias por generar (INT-01, INT-05) → usa `[[epic-generate-stories]]`.
- Debas completar la especificación de una historia hija (MAD-01) → usa `[[story-specify]]`.

---

## Instalación

**Core (incluido en `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocación

Usa `/epic-refine <epica>`, donde `<epica>` es el ID (`EPIC-30`), el nombre del directorio (`EPIC-30-ejemplo`) o la ruta al directorio o a su `epic.md`; la ruta solo se acepta si es una épica activa `specs/flow/EPIC-NN-<slug>/` del repositorio (nunca externa ni archivada). Añade `--auto` para aplicar el plan sin preguntas desde un orquestador.

```bash
/epic-refine EPIC-30
/epic-refine EPIC-30 --auto
```
