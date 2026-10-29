---
type: epic-format-validation
id: {EPIC_ID}
slug: {nombre-directorio-epica}-format-validation-report
title: "Epic format validation: {título}"
epic: {EPIC_ID}
verdict: {APPROVED | NEEDS-REFINEMENT}
defects: {n}
created: {YYYY-MM-DD}
updated: {YYYY-MM-DD}
---
# Validación de formato de épica: {título}

## Veredicto <!-- sección obligatoria · clave: veredicto · escritor: epic-format-validation -->
<!-- Una sola línea con el mismo valor que verdict. Motivo determinista: APPROVED → "cumple la estructura obligatoria del template epic-template.md"; NEEDS-REFINEMENT → "<n> defectos de estructura o formato". -->
**Veredicto:** `{veredicto}` — {motivo}

## Resumen <!-- sección obligatoria · clave: resumen · escritor: epic-format-validation -->
<!-- Tabla de dos columnas (Métrica │ Valor). "Template de épica": la ruta efectiva usada en el Paso 2 (central o fallback). "Defectos": el mismo número que el campo defects. -->

| Métrica | Valor |
|---|---|
| Épica | {EPIC_ID} (`{ruta de epic.md}`) |
| Template de épica | `{ruta efectiva}` |
| Defectos | {n} |
| Fecha | {YYYY-MM-DD} |

## Defectos <!-- sección obligatoria · clave: defectos · escritor: epic-format-validation · lector: epic-improve -->
<!-- Una fila por defecto, en el orden de detección (Paso 4a → 4b → 4c → 4d). ID: D-1, D-2… correlativo. Tipo: campo-faltante · seccion-faltante · formato-historias · formato-smoke-tests. Ubicación: "frontmatter" (campo-faltante); "tras ## <título previo según el template>" o "al inicio del cuerpo" si es la primera (seccion-faltante); "línea <n> (## <título>)" (formato). Encontrado: — para faltantes; texto literal de la línea o del encabezado entre comillas invertidas para formato. Corrección esperada: "añadir <clave>:" · "añadir ## <título> según docs/templates/epic-template.md" · la forma F1/F2/F3 · "### SMOKE-N — <nombre>" o "bloque gherkin con Escenario/Dado/Cuando/Entonces". Los títulos citados salen del template. Con APPROVED: el texto "Sin defectos." en lugar de la tabla. -->

| ID | Tipo | Ubicación | Encontrado | Corrección esperada |
|---|---|---|---|---|
| D-{n} | {tipo} | {ubicación} | {`texto literal` / —} | {corrección esperada} |

## Migración <!-- sección condicional · clave: migracion · escritor: epic-format-validation -->
<!-- Solo si hay al menos un defecto seccion-faltante; si no, omite la sección completa. -->
Si la épica se creó con una versión anterior del template → `/memory-system migrate --from=epic-template-v1`
