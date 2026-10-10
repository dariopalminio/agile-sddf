---
type: requirement
kind: non-functional
id: NFR-005
slug: NFR-005-sistema-de-archivos-como-unica-capa-de
title: "Sistema de archivos como única capa de persistencia"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-005 — Sistema de archivos como única capa de persistencia

## Descripción

El sistema SHALL usar exclusivamente el sistema de archivos local. No SHALL
requerir base de datos, servicio de almacenamiento externo ni servidor propio. Todos los
outputs son archivos `.md` (o `.puml`, `.json`, `.yaml`) bajo `$SPECS_BASE/specs/`.

## Criterios de verificación

No existe ningún archivo de configuración de base de datos en el
repositorio.

## Atributos

- **Prioridad**: Alta
- **Categoría de origen**: 2.2.3 Almacenamiento y persistencia
