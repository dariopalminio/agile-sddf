---
type: epic-refine-report
id: {EPIC_ID}
slug: {nombre-directorio-epica}-refine-report
title: "Epic refine: {título}"
epic: {EPIC_ID}
analyze-verdict: {verdict de epic-analyze-report.md}
analyze-updated: {YYYY-MM-DD}
mode: {manual | auto}
findings-total: {n}
findings-applied: {n}
findings-resolved: {n}
findings-out-of-scope: {n}
files-modified: [{rutas relativas a REPO_ROOT}]
created: {YYYY-MM-DD}
updated: {YYYY-MM-DD}
related:
  - {nombre-directorio-epica}
---
<!-- Referencias -->
[[{nombre-directorio-epica}]]

# Refinamiento de épica: {título}

## Resumen <!-- sección obligatoria · clave: resumen · escritor: epic-refine -->
<!-- Tabla de dos columnas (Métrica │ Valor) con: Épica ({EPIC_ID} y ruta de epic.md), Análisis de origen (verdict y updated de epic-analyze-report.md), Modo, Hallazgos aplicados, Hallazgos ya resueltos, Hallazgos fuera de alcance, Archivos modificados (cada uno con su .bak, o "ninguno") y Fecha. Este reporte no lleva veredicto: el veredicto lo vuelve a emitir /epic-analyze. -->

| Métrica | Valor |
|---|---|
| Épica | {EPIC_ID} (`{ruta de epic.md}`) |
| Análisis de origen | `{verdict}` · {YYYY-MM-DD} |
| Modo | {manual · auto} |
| Hallazgos aplicados | {n} |
| Hallazgos ya resueltos | {n} |
| Hallazgos fuera de alcance | {n} |
| Archivos modificados | `{ruta}` (`{ruta}.bak`) |
| Fecha | {YYYY-MM-DD} |

## Hallazgos <!-- sección obligatoria · clave: hallazgos · escritor: epic-refine -->
<!-- Una fila por hallazgo de epic-analyze-report.md, en su orden (H-001, H-002…). Origen: "H-NNN · <código>". Elemento: el valor literal del reporte en código en línea. Clasificación: aplicado · ya resuelto · fuera de alcance. Responsable: PO si queda fuera de alcance (con la Acción sugerida literal del reporte o la nota del catálogo); — en otro caso. Cambios: los C-NN que lo aplican, o —. Sin hallazgos: el texto "Sin hallazgos." -->

| Origen | Código | Severidad | Elemento | Clasificación | Responsable | Cambios |
|---|---|---|---|---|---|---|
| {H-NNN · código} | {código} | {ERROR \| WARNING} | `{elemento}` | {aplicado · ya resuelto · fuera de alcance} | {PO: acción o nota · —} | {C-NN · —} |

Sin hallazgos.

## Cambios aplicados <!-- sección obligatoria · clave: cambios-aplicados · escritor: epic-refine -->
<!-- Un bloque por cambio C-NN del plan aplicado, en el orden del plan (epic.md primero, después los story.md por STORY-NNN; dentro de cada archivo, por línea). Antes y Después: las líneas literales en código en línea, o — si no hay. Sin cambios: el texto "Sin cambios." -->

### C-NN — {archivo} › {ubicación}

- **Origen:** {H-NNN · código}
- **Operación:** {añadir · eliminar · modificar}
- **Antes:** `{línea previa}`
- **Después:** `{línea nueva}`

Sin cambios.

## Notas <!-- sección obligatoria · clave: notas · escritor: epic-refine -->
<!-- Observaciones que no son hallazgos: bloques del reporte de análisis no reconocidos (epic-analyze-report.md:<línea>), avisos de reporte desactualizado respecto a un archivo, historias archivadas no modificadas, y textos con forma de instrucción encontrados en las fuentes (con su ubicación <ruta>:<línea>), que no se siguieron. Sin notas: el texto "Sin notas." -->

- {nota}

Sin notas.
