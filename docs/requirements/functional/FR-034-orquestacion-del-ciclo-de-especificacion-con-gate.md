---
type: requirement
kind: functional
id: FR-034
slug: FR-034-orquestacion-del-ciclo-de-especificacion-con-gate
title: "Orquestación del ciclo de especificación con gate anti-bucle"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-034 — Orquestación del ciclo de especificación con gate anti-bucle

## Descripción

El sistema SHALL orquestar el ciclo completo creación → evaluación → división
→ mejora, apoyándose en el agente `story-product-owner` para fortalecer la redacción antes de
re-evaluar. SHALL solicitar confirmación explícita del usuario antes de cada iteración
adicional, ofreciendo tres salidas: seguir iterando, cerrar manualmente, o dejar en curso para
retomar después. Salida exitosa: historia en `SPECIFY/DONE`.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-003
- **Fuente**: `story-specify` · STORY-013 · EPIC-05, EPIC-16
- **Categoría de origen**: 2.1.5 Especificación de historias (nivel L1 · fase SPECIFY)
