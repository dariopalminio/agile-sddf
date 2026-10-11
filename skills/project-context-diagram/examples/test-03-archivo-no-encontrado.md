# Test 03 — Archivo indicado no encontrado

**Invocación:** `/project-context-diagram docs/entrada-inexistente.md`

El skill informa:

```text
❌ No se encontró el archivo indicado: docs/entrada-inexistente.md
```

Luego ofrece:

- **A)** Continuar con `--from-files` usando `product/` y `requirements/`.
- **B)** Continuar con `--interactive`.

Sin respuesta selecciona A. En ningún caso el fallback cambia el destino fijo del diagrama.
