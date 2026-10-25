# Test 02 — Inferencia desde capas

**Invocación:** `/project-context-diagram --from-files`

El skill toma el sistema desde `product/vision.md`, los actores desde `product/stakeholders.md` y sistemas externos y relaciones desde `requirements/`. README, manifiestos e imports complementan el resultado.

Después del preview manual y la confirmación de sobrescritura, escribe:

```text
docs/architecture/c4/context-diagram.puml
```

El resultado contiene `Person()`, un único `System()`, `System_Ext()` y relaciones con etiquetas.
