---
type: tasks
id: FEAT-076
slug: FEAT-076-integrar-historia-multi-modelo-entrega-tasks
title: "Tasks: story-integrate — Soporte multi-modelo de entrega"
story: FEAT-076
design: FEAT-076
created: 2026-05-17
updated: 2026-05-17
related:
  - FEAT-076-integrar-historia-multi-modelo-entrega
  - FEAT-074-integrar-historia-batch-configurable
---

[[FEAT-076-integrar-historia-multi-modelo-entrega]]

## 1. Setup / Verificación

- [ ] T001 Verificar que `.claude/skills/story-integrate/SKILL.md` y `assets/integration-config-template.yaml` existen (creados en FEAT-074); si no existen, usar stubs mínimos con estructura base

## 2. Core — Extensión de SKILL.md

- [ ] T002 Añadir función `resolverModelo` en SKILL.md: (1) leer `config.delivery-model`; (2) buscar la sección `config[delivery-model]`; (3) si no existe → invocar flujo AC-2; (4) validar que la sección tiene las subclaves `commands.create-pr`, `commands.check-pr`, `commands.merge-pr`; (5) retornar comandos y branch-patterns del modelo activo
- [ ] T003 Añadir flujo AC-2 en SKILL.md: cuando `resolverModelo` no encuentra el modelo activo, mostrar `❌ El modelo '<modelo>' no está configurado en integration-config.yaml`, listar dinámicamente los modelos disponibles (claves con subclave `commands`), detener sin ejecutar ningún comando ni modificar story.md
- [ ] T004 Modificar Paso 4 de FEAT-074 en SKILL.md (cálculo de ramas): reemplazar la referencia directa a `config.batch` por el resultado de `resolverModelo`; asegurar que `source-branch-pattern` y `target-branch-pattern` vienen del modelo activo, no del hardcoded `batch`
- [ ] T005 Modificar Paso 8 de FEAT-074 en SKILL.md (actualización de story.md): añadir el campo `delivery-model` al bloque `integration:` escrito en el frontmatter de story.md tras integración exitosa
- [ ] T006 Añadir fallback en SKILL.md: si el campo `delivery-model` no existe en la config (config pre-FEAT-076), asumir `batch` y emitir advertencia `⚠️ Campo delivery-model no encontrado — usando batch como fallback`

## 3. Assets — Actualización de template

- [ ] T007 Actualizar `assets/integration-config-template.yaml`: añadir la sección `continuous` junto a la existente `batch`, con sus propios `source-branch-pattern`, `target-branch-pattern` y comandos `gh`; añadir comentario explicando que el modelo activo se selecciona con `delivery-model`

## 4. Examples

- [ ] T008 Crear `examples/example-multi-model.md`: Scenario Outline completo documentando ejecución con `batch` (target=`release/v1.2.0`) y con `continuous` (target=`main`); incluir el frontmatter de story.md resultante en ambos casos con el campo `delivery-model` registrado; añadir también el escenario de modelo no reconocido con su mensaje de error y lista de modelos disponibles

## 5. Verificación de criterios de aceptación

- [ ] T009 Verificar AC-1 batch — revisar que SKILL.md con `delivery-model: batch` genera target-branch `release/v1.2.0` y registra `delivery-model: batch` en story.md (CRV-1, CRV-3)
- [ ] T010 Verificar AC-1 continuous — revisar que SKILL.md con `delivery-model: continuous` genera target-branch `main` y registra `delivery-model: continuous` en story.md (CRV-2, CRV-3)
- [ ] T011 Verificar AC-1 compatibilidad — confirmar que config mínima de FEAT-074 (solo sección `batch`, sin `delivery-model`) sigue funcionando con el fallback batch (CRV-6)
- [ ] T012 Verificar AC-2 — revisar que SKILL.md con modelo desconocido muestra error, lista modelos disponibles y no modifica story.md (CRV-4, CRV-5)
- [ ] T013 Verificar NFR Extensibilidad — confirmar que el skill no tiene lista de modelos hardcodeada; la resolución es dinámica por nombre de sección
