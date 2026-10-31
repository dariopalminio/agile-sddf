---
type: release-notes
id: {epic_id}
epic: {epic_dirname}
slug: {epic_dirname}-release-notes
title: {yaml_title}
created: {created}
updated: {updated}
related:
  - {epic_dirname}
---

# Notas de versión: {title}

<!-- {yaml_title} es el escalar YAML completo para «Notas de versión: » + title. Al instanciar: serializarlo como cadena JSON/YAML entre comillas dobles, escapando comillas, barras inversas y controles (incluidos saltos de línea); no interpolar title directamente en el frontmatter. El valor de title del encabezado es texto Markdown, con saltos de línea normalizados a espacios. Quitar este comentario guía. -->

## Resumen
<!-- El objetivo de la épica (sección ## Objetivo de epic.md) contado a un stakeholder: qué cambia para quien usa el producto, en dos o tres frases, sin jerga técnica ni IDs. -->

{resumen}

## Novedades
<!-- Una viñeta por historia liberada, en el orden del bloque de CHANGELOG.md: - **<title>** — <valor>. -->

{novedades}

## Historias incluidas
<!-- Una fila por historia liberada, en el mismo orden. Estado = status/substatus literal. -->

| ID | Título | Categoría | Estado |
|---|---|---|---|
{filas}

## No incluidas
<!-- Historias CANCELED/DONE de la épica: - <ID> — <title>. Sin ninguna, escribir solo: Ninguna. -->

{no_incluidas}
