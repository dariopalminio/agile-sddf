---
type: epic-validate
id: {EPIC_ID}
slug: {nombre-directorio-epica}-validate-report
title: "Epic validate: {título}"
epic: {EPIC_ID}
verdict: {APPROVED | NEEDS-CHANGES | BLOCKED}
created: {YYYY-MM-DD}
updated: {YYYY-MM-DD}
related:
  - {nombre-directorio-epica}
---
<!-- Referencias -->
[[{nombre-directorio-epica}]]

# Validación de épica: {título}

## Veredicto <!-- sección obligatoria · clave: veredicto · escritor: epic-validate -->
<!-- La primera línea declara el veredicto y su motivo en una frase: APPROVED → "historias cerradas y análisis de la épica APPROVED"; NEEDS-CHANGES → "<n> motivo(s) de rechazo"; BLOCKED → "falta evidencia: <comprobación bloqueada>". La segunda línea aclara que la validación es informativa. -->
**Veredicto:** `{veredicto}` — {motivo}
Informativo: esta validación no cambia el estado de la épica.

## Resumen <!-- sección obligatoria · clave: resumen · escritor: epic-validate -->
<!-- Tabla de dos columnas (Métrica │ Valor) con: Épica ({EPIC_ID} y ruta de epic.md), Historias terminadas, Historias canceladas, Historias no terminales, Veredicto del análisis de la épica (valor literal en código en línea, o "ausente"), Fecha y Template de reporte efectivo. -->

| Métrica | Valor |
|---|---|
| Épica | {EPIC_ID} (`{ruta de epic.md}`) |
| Historias terminadas | {n} |
| Historias canceladas | {n} |
| Historias no terminales | {n} |
| Análisis de la épica | `{verdict del análisis}` |
| Fecha | {YYYY-MM-DD} |
| Template de reporte | `{ruta efectiva}` |

## Comprobaciones <!-- sección obligatoria · clave: comprobaciones · escritor: epic-validate -->
<!-- Una fila por comprobación, ordenadas por ID (EST-01 < EST-02). "Resultado": cumple / no cumple / bloqueada. "Evidencia": conteo de historias por clasificación para EST-01; ruta, verdict y updated de epic-analyze-report.md para EST-02 (o "no existe"). -->

| ID | Comprobación | Resultado | Evidencia |
|---|---|---|---|
| {EST-NN} | {comprobación} | {cumple / no cumple / bloqueada} | {evidencia} |

## Historias de la épica <!-- sección obligatoria · clave: historias-epica · escritor: epic-validate -->
<!-- Una fila por historia del universo de la épica, ordenada por STORY-NNN con las planificadas sin ID al final. Status y Substatus: valores literales en código en línea, o — si faltan. Ubicación: activa / archivada / no encontrada / planificada (sin ID). Clasificación: terminada / cancelada / no terminal. Universo vacío: "Sin historias." -->

| ID | Status | Substatus | Ubicación | Clasificación |
|---|---|---|---|---|
| {STORY-NNN} | `{status}` | `{substatus}` | {ubicación} | {clasificación} |

## Motivos <!-- sección obligatoria · clave: motivos · escritor: epic-validate -->
<!-- Un bloque por motivo, ordenado por comprobación y, dentro de EST-01, por STORY-NNN con las planificadas sin ID al final; numerado M-001, M-002… después de ordenar. Valores citados en código en línea. Sin motivos: el texto "Sin motivos." en lugar de los bloques. -->

### M-NNN [NEEDS-CHANGES|BLOCKED] — {comprobación}: {elemento}

- **Evidencia:** {evidencia}
- **Acción sugerida:** {acción}

Sin motivos.

## Notas de la validación <!-- sección obligatoria · clave: notas-validacion · escritor: epic-validate -->
<!-- Observaciones que no cuentan para el veredicto: líneas del índice no reconocidas (con epic.md:<línea> y /epic-format-validation {EPIC_ID}), historias duplicadas activa/archivada, frontmatter ilegible, sección de historias ausente y textos con forma de instrucción encontrados en las fuentes (con su ubicación). Sin notas: el texto "Sin notas." -->

- {nota}

Sin notas.
