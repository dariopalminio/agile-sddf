---
type: acceptance-report
story: STORY-060
title: "Acceptance Report: STORY-060 — Recuperación de contraseña por email"
date: 2026-05-16
validator: "Darío Palminio"
dod-version: "2026-05-15"
session-status: complete
verdict: NEEDS-CHANGES
---

# Acceptance Report: STORY-060 — Recuperación de contraseña por email

## Veredicto

**Veredicto:** `NEEDS-CHANGES` — 1 criterio(s) rechazado(s) y 0 bloqueado(s).

- Criterio 2 — REJECTED: Escenario alternativo – Email no registrado

## Resumen ejecutivo

- **Historia:** STORY-060 — Recuperación de contraseña por email
- **Fecha:** 2026-05-16
- **Validador:** Darío Palminio
- **Total criterios:** 4
- **Aprobados (APPROVED):** 3
- **Rechazados (REJECTED):** 1
- **Bloqueados (BLOCKED):** 0

## Detalle por criterio

| # | Criterio | Resultado | Observaciones del validador | Timestamp |
|---|----------|-----------|-----------------------------|-----------|
| 1 | Escenario principal – Solicitud exitosa de reset | APPROVED | El email de recuperación llega en < 30 segundos | 11:10 |
| 2 | Escenario alternativo – Email no registrado | REJECTED | El sistema muestra "Email no encontrado" pero debería mostrar "Si el email existe, recibirás instrucciones" por razones de seguridad. El mensaje actual permite enumerar usuarios. | 11:15 |
| 3 | Criterios no funcionales validados | APPROVED | HTTPS verificado, token expira en 1h | 11:17 |
| 4 | Sin defectos bloqueantes durante la sesión | APPROVED | Solo se encontró el defecto del criterio 2 | 11:18 |

## Criterios DoD ACCEPTANCE

| Criterio DoD | Estado |
|--------------|--------|
| Todos los escenarios Gherkin ejecutados manualmente | ✓ cumplido |
| Criterios no funcionales validados | ✓ cumplido |
| Comportamiento coincide con valor de negocio | ✗ no cumplido |
| Sin defectos bloqueantes | ✗ no cumplido |
| acceptance-report.md generado con `verdict: APPROVED` | ✗ no cumplido |
| Todos los criterios registrados con observaciones | ✓ cumplido |
| story.md actualizado con ACCEPTANCE/DONE | ✗ no cumplido |
| Validador humano confirmó la aprobación | ✗ no cumplido |

## Historial de sesiones anteriores

<!-- Sin sesiones anteriores -->
