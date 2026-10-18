---
type: design
id: STORY-206
slug: STORY-206-importar-usuarios-csv-design
title: "Design: Importar usuarios desde CSV"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-31-usuarios
story: STORY-206
created: 2026-10-12
updated: 2026-10-12
related:
  - STORY-206-importar-usuarios-csv
---

# Diseño técnico: importar usuarios desde CSV

## Context

El administrador da de alta usuarios en bloque subiendo un CSV con columnas `email;nombre`.

## Decisions

### D-1 — Endpoint de importación // satisface: AC-1

`POST /users/import` recibe `multipart/form-data` con el campo `file` y responde `201` con `{ "created": <n> }`.

### D-2 — CSV vacío // satisface: AC-2

Un archivo sin filas de datos se rechaza con `422` y el mensaje «El archivo está vacío».

### D-3 — Límite de tamaño

Archivos de más de 1 MB se rechazan con `413` antes de parsearlos.

## Open Questions

Ninguna.
