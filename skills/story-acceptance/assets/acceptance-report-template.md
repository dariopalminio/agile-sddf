---
type: acceptance-report
story: {story_id}
title: "Acceptance Report: {story_id} — {story_title}"
date: {date}
validator: {validator}
dod-version: {dod_version}
session-status: {session_status}
verdict: {verdict}
---

# Acceptance Report: {story_id} — {story_title}

## Veredicto

**Veredicto:** `{verdict}` — {verdict_reason}

{verdict_details}

## Resumen ejecutivo

- **Historia:** {story_id} — {story_title}
- **Fecha:** {date}
- **Validador:** {validator}
- **Total criterios:** {total_criterios}
- **Aprobados (APPROVED):** {total_approved}
- **Rechazados (REJECTED):** {total_rejected}
- **Bloqueados (BLOCKED):** {total_blocked}

## Detalle por criterio

| # | Criterio | Resultado | Observaciones del validador | Timestamp |
|---|----------|-----------|-----------------------------|-----------|
{criterios_detalle}

## Criterios DoD ACCEPTANCE

| Criterio DoD | Estado |
|--------------|--------|
{dod_criterios}

## Historial de sesiones anteriores

{historial_sesiones}
