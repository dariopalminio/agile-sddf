# Catálogo de corrección — familia MAD

Lo lee `epic-refine` en el Paso 4 solo si el reporte contiene un MAD-02. MAD-01 y MAD-03 nunca se corrigen aquí: completar la especificación o normalizar el estado es decisión del PO.

## MAD-02 — `related` roto: retirar la entrada

Hallazgo: **Elemento** = el valor referenciado (p. ej. `STORY-999`); **Evidencia** = `STORY-NNN › <ruta del story.md>:<línea(s)>` de la historia que lo declara. Esa historia se resuelve por su `STORY-NNN` (Paso 3.5 del `SKILL.md`), nunca por la ruta citada.

### Normalización

Cada entrada de `related` se compara normalizada como en `epic-analyze` Paso 5c.2: recortar espacios, comillas y un envoltorio `[[…]]`. `STORY-999`, `"STORY-999"` y `[[STORY-999]]` son el mismo valor.

### Ya resuelto

Cualquiera de:
- el `related` de la historia ya no contiene el valor normalizado;
- el valor ahora resuelve por ID con los globs de `epic-analyze` Paso 5c.2 (`specs/flow/<STORY-NNN>-*/story.md`, `specs/flow/archive/*-<STORY-NNN>-*/story.md` o `specs/flow/<EPIC-NN>-*/epic.md`): alguien creó la historia o la épica referenciada.

### Regla

Se retiran **todas** las apariciones del valor en el `related` de esa historia; nada más cambia.

| Forma de `related` | Operación |
|---|---|
| Bloque (`related:` seguido de líneas `  - <valor>`) | Un `C-NN` `eliminar` por cada línea `  - <valor>` que normaliza al valor, con la línea literal en **Antes**. Si el bloque queda sin entradas, un `C-NN` `modificar` reescribe `related:` como `related: []` |
| En línea (`related: [a, b]`) | Un `C-NN` `modificar` que reescribe la lista sin el valor, conservando el orden y la forma de las demás entradas; sin entradas: `related: []` |

El cuerpo del `story.md` (incluidos los enlaces `[[…]]` de la cabecera) no se toca: la corrección es solo del frontmatter.

Ejemplo — `related` de `STORY-301`:

```yaml
related:
  - EPIC-30-ejemplo
  - STORY-999
```

Cambio: `C-NN │ H-NNN · MAD-02 │ …/STORY-301-…/story.md │ related · línea 15 │ eliminar │ `  - STORY-999` │ —`. Resultado:

```yaml
related:
  - EPIC-30-ejemplo
```

### Fuera de alcance (responsable `PO`)

| Caso | Nota |
|---|---|
| `related` en una forma no reconocida o ilegible | `related no reconocido` (la misma nota de `epic-analyze`) |
| La historia que declara la referencia solo existe archivada | `historia archivada: registro histórico` |

### Por qué no se reemplaza la referencia

MAD-02 significa que el ID no existe: no hay un reemplazo determinable sin juicio. El valor retirado queda en **Antes** del reporte y en `story.md.bak`, para que el PO lo recupere si lo necesita. Las referencias a slugs obsoletos tras un `/story-split` son de la familia COH ([coh-corrections.md](coh-corrections.md)).
