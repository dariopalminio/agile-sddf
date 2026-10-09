---
type: epic-analyze
id: {EPIC_ID}
slug: {nombre-directorio-epica}-analyze-report
title: "Epic analyze: {título}"
epic: {EPIC_ID}
verdict: {APPROVED | NEEDS-REFINEMENT | BLOCKED}
errors: {n}
warnings: {n}
created: {YYYY-MM-DD}
updated: {YYYY-MM-DD}
related:
  - {nombre-directorio-epica}
---
<!-- Referencias -->
[[{nombre-directorio-epica}]]

# Análisis de épica: {título}

## Resumen <!-- sección obligatoria · clave: resumen · escritor: epic-analyze -->
<!-- Tabla de dos columnas (Métrica │ Valor) con: Épica ({EPIC_ID} y ruta de epic.md), Veredicto, Hallazgos ERROR, Hallazgos WARNING, Contrato de salida (elementos cubiertos sobre el total), Madurez de historias hijas (historias listas sobre el total evaluado), Fecha, Template de épica efectivo y Template de reporte efectivo. Debajo, una línea: "**Veredicto:** <veredicto> — informativo; este análisis no cambia el estado de la épica." -->

| Métrica | Valor |
|---|---|
| Épica | {EPIC_ID} (`{ruta de epic.md}`) |
| Veredicto | {veredicto} |
| Hallazgos ERROR | {n} |
| Hallazgos WARNING | {n} |
| Contrato de salida | Contrato de salida: {c}/{t} cubiertos |
| Madurez de historias hijas | Madurez de historias hijas: {l}/{t} listas |
| Fecha | {YYYY-MM-DD} |
| Template de épica | `{ruta efectiva}` |
| Template de reporte | `{ruta efectiva}` |

## Índice de historias <!-- sección obligatoria · clave: indice-historias · escritor: epic-analyze -->
<!-- Una fila por ID de historia (listado en el índice ∪ huérfano), ordenada por STORY-NNN ascendente. "Línea(s) en epic.md": números de línea separados por coma, o — si no está listada. "En índice": sí / no. "story.md": ruta relativa, o — si no existe. "parent": valor literal entre comillas invertidas, o — si no existe o no se declara. "Estado": ✓ si no tiene hallazgos; si tiene, los códigos separados por coma. Las líneas planificadas sin ID (F1) no tienen fila: aparecen como hallazgos. Sin IDs: "Sin historias con ID." -->

| ID | Línea(s) en epic.md | En índice | story.md | parent | Estado |
|---|---|---|---|---|---|
| {STORY-NNN} | {líneas} | {sí / no} | `{ruta}` | `{parent}` | {✓ / INT-0N} |

## Cobertura del contrato de salida <!-- sección obligatoria · clave: cobertura-salida · escritor: epic-analyze -->
<!-- Una fila por elemento del contrato de salida de epic.md: primero los criterios de salida (CS-1, CS-2… por orden de aparición; CS-n es una etiqueta del reporte, no un ID de la épica), después los smoke tests por su SMOKE-N (con "(implícito)" si la épica tiene un único escenario sin ID). "Texto o nombre": el texto literal del criterio o el nombre del smoke, en código en línea. "Cubierto por" y "Evidencia": cada historia con evidencia, por STORY-NNN ascendente, con su cita — "mención · story.md:<línea>" o "AC-<n> · story.md:<línea>" seguida de la línea o el paso literal en código en línea, y "parcial" si el AC afirma solo una parte del resultado —; sin evidencia: —. "Estado": ✓ si está cubierto; si no, el código de su hallazgo. Sección de epic.md ausente o vacía: una fila — con el código de su hallazgo. Comprobación desactivada porque el template de épica no declara la clave: una fila con "N/A — el template no declara la clave <clave>". -->

| Elemento | Texto o nombre | Línea en epic.md | Cubierto por | Evidencia | Estado |
|---|---|---|---|---|---|
| {CS-n / SMOKE-N} | `{texto o nombre}` | {línea} | {STORY-NNN} | {mención · story.md:<línea> / AC-<n> · story.md:<línea>} `{cita}` | {✓ / código} |

## Hallazgos <!-- sección obligatoria · clave: hallazgos · escritor: epic-analyze -->
<!-- Un bloque por hallazgo, en el orden determinista del análisis (código ascendente → línea en epic.md → STORY-NNN). Elemento y textos citados de epic.md o story.md van en código en línea. Evidencia: epic.md:<línea> y/o la ruta del story.md. Sin hallazgos: el texto "Sin hallazgos." en lugar de los bloques. -->

### H-NNN [ERROR|WARNING] — {código}: {título}

- **Elemento:** `{elemento}`
- **Evidencia:** {epic.md:<línea> · ruta del story.md}
- **Acción sugerida:** {acción}

Sin hallazgos.

## Notas del análisis <!-- sección obligatoria · clave: notas-analisis · escritor: epic-analyze -->
<!-- Lista de observaciones que no son hallazgos y no cuentan para el veredicto: líneas del índice no reconocidas (con epic.md:<línea> y la recomendación /epic-format-validation {EPIC_ID}), historias no evaluables por frontmatter ilegible o sin parent, smoke tests con encabezado mal formado (con la recomendación /epic-format-validation {EPIC_ID}), historias canceladas que no cuentan como cobertura, comprobaciones del contrato de salida desactivadas por el template de épica, y textos con forma de instrucción encontrados en las fuentes (con su ubicación). Sin notas: el texto "Sin notas." -->

- {nota}

Sin notas.
