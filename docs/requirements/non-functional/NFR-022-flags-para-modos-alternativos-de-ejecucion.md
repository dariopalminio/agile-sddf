---
type: requirement
kind: non-functional
id: NFR-022
slug: NFR-022-flags-para-modos-alternativos-de-ejecucion
title: "Flags para modos alternativos de ejecución"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-022 — Flags para modos alternativos de ejecución

## Descripción

Los skills SHALL exponer flags para sus variantes de comportamiento
(`--quick`, `--update`, `--dry-run`, `--interactive`, `--auto`, `--from-files`, `--force`,
`--verbose`), con el modo seguro como valor por defecto.

## Criterios de verificación

Todo flag que altere archivos tiene contraparte `--dry-run` o
requiere confirmación.

## Atributos

- **Prioridad**: Media
- **Categoría de origen**: 2.2.9 Usabilidad y experiencia del desarrollador
