---
alwaysApply: false
type: story
id: STORY-164
kind: feat
slug: STORY-164-archivar-historias-canceladas
title: "Skill story-complete: archivar historias canceladas"
status: CODE-REVIEW
substatus: DONE
parent: EPIC-27-completar-flujo-de-story
created: 2026-10-25
updated: 2026-10-25
related:
  - EPIC-27-completar-flujo-de-story
  - STORY-160-completar-y-archivar-historia-entregada
---
[[EPIC-27-completar-flujo-de-story]]

# 📖 Historia: Skill story-complete: archivar historias canceladas

**Como** Solo Builder que canceló una historia
**Quiero** archivarla con `/story-complete STORY-NNN` en `specs/flow/archive/` sin que deje de figurar como `CANCELED`
**Para** sacar de `specs/flow/` el trabajo que ya no se hará, sin que una historia cancelada se confunda con una entregada en el registro histórico

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Archivado de una historia cancelada
```gherkin
Escenario: Archivado de una historia cancelada
  Dado una historia STORY-NNN en specs/flow/STORY-NNN-<slug>/ con status CANCELED, substatus DONE y las fechas <fechas>
  Cuando el usuario ejecuta /story-complete STORY-NNN y confirma la acción
  Entonces la historia queda en specs/flow/archive/<fecha archivo>-STORY-NNN-<slug>/ con su frontmatter sin cambios (status CANCELED)
    Y specs/flow/STORY-NNN-<slug>/ ya no existe y el skill informa la ruta final
Ejemplos:
  | fechas                                     | fecha archivo |
  | updated: 2026-09-10, created: 2026-08-01   | 2026-09-10    |
  | created: 2026-08-01, sin updated:          | 2026-08-01    |
  | date: 2026-07-15, sin updated: ni created: | 2026-07-15    |
```

### AC-2 — Escenario de error – Historia cancelada que no puede archivarse
```gherkin
Escenario: Rechazo de una historia cancelada que no puede archivarse
  Dado una historia STORY-NNN con status CANCELED en la situación <situación>
  Cuando el usuario ejecuta /story-complete STORY-NNN
  Entonces el skill termina con <mensaje> sin cambiar el frontmatter ni mover el directorio
Ejemplos:
  | situación                                              | mensaje                    |
  | substatus IN-PROGRESS                                  | nombra el estado actual    |
  | substatus DONE sin updated:, created: ni date: válidos | nombra los campos buscados |
```

### AC-3 — Escenario de dominio – Regla de archivo documentada
```gherkin
Escenario: Regla de archivo que admite historias canceladas
  Dado ADR-0016, que admite en specs/flow/archive/ solo historias COMPLETED con la fecha de updated: o created:
  Cuando se completa esta historia
  Entonces un ADR nuevo reemplaza a ADR-0016 (superseded-by) y admite en el archivo las historias COMPLETED y CANCELED, con la fecha de updated:, created: o date:
    Y AGENTS.md, docs/constitution.md y docs/domains/ describen la regla de archivo del ADR nuevo
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — ADR inmutable:** ADR-0016 no se edita in place; solo recibe el campo `superseded-by` que apunta al ADR nuevo, según `docs/adr/README.md`.
- **CNF-2 — Dominio:** `docs/domains/domain-state-management.md` y `docs/domains/domain-story-lifecycle.md` declaran que `story-complete` archiva sin cambiar el status las historias `CANCELED/DONE`, siempre con confirmación humana.
- **CNF-3 — Gate determinista:** `scripts/verify-fixed-layout.js` y el resto de `npm run verify:repository` aceptan historias `CANCELED` dentro de `specs/flow/archive/`; `npm run verify:repository` y `npm test` pasan sin errores.
- **CNF-4 — Conteo invariante:** en todos los escenarios, el total de historias activas + archivadas es igual al previo a la ejecución.

## Fuera de alcance (Non-Goals)

- Completar y archivar historias `DELIVER/DONE` o `COMPLETED/DONE`: lo cubre STORY-160.
- Pasar una historia a `CANCELED`.
- Archivar épicas.
- Hacer commit, push o PR del movimiento.

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: `specs/flow/EPIC-27-completar-flujo-de-story/epic.md`
Feature origen: STORY-160 — Skill story-complete

- **Split (2026-10-25):** historia hermana creada con `/story-split STORY-160` (patrón 2, variaciones de reglas de negocio), siguiendo el plan de `specs/flow/STORY-160-completar-y-archivar-historia-entregada/finvest-evaluation-report.md`.
- **Dependencia de secuencia:** extiende el skill `story-complete` que crea STORY-160; se implementa después de ella. El ADR nuevo (AC-3) sí puede redactarse en paralelo.
- Al terminar esta historia, la fila `CANCELED/DONE` de AC-2 de STORY-160 (rechazo por ADR-0016) deja de aplicar y se sustituye por AC-1 de esta historia.
- Archivar una historia `CANCELED/DONE` no la convierte en entregada: conserva su status y su `updated:`.
- `scripts/migrate-specs-to-flow.js` ya implementa la cadena `updated:` → `created:` → `date:` (`archiveDate`); conviene revisarlo en `/story-design` para reutilizarlo.
