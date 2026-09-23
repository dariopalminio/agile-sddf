---
type: architecture
slug: sdcl-sddf
title: SDLC-SDDF Flujo de estados (SDLC-TBD)
---

# SDLC-SDDF Flujo de estados (SDLC-TBD)

Correspondencia SDLC clásico vs SDLC de SDDF:
1. Requirement: SPECIFY
2. Design: PLAN (Diseño técnico + test-cases + tasking)
3. Development: IMPLEMENT + CODE-REVIEW
4. Verification&Validation: VERIFY + ACCEPTANCE
5. Deploy: DELIVER
6. Done/Maintenance: COMPLETED

Estados SDLC-SDDF:
- **SPECIFY**: Especificación funcional.
- **PLAN**: Diseño técnico + test-cases + tasking.
- **READY-FOR-IMPLEMENT**: Cola buffer y señal de listo para implementar con WIP limitado.
- **IMPLEMENT**: Se escribe código y se ejecuta TDD/BDD.
- **CODE-REVIEW**: Revisión de código independiente (PR y merge a main para CI/CD).
- **VERIFY**: Pruebas automáticas sobre main (E2E, regresión) + feature flag (flag OFF).
- **ACCEPTANCE**: Aceptación humana o del PO, pruebas exploratorias y validación de criterios de aceptación.
- **DELIVER**: Desplegando a producción (Flag-on).
- **COMPLETED**: Cierre administrativo.
- **CANCELED**: La historia fue cancelada sin entregar.

Diagrama:
```
  ┌─────────┐       ┌────────┐
  │ SPECIFY │──────▶│  PLAN  │
  └─────────┘       └────┬───┘
                         │
                         ▼
                    ┌────────────────────────┐         ┌───────────┐
                    │  READY-FOR-IMPLEMENT   │────────▶│ IMPLEMENT │
                    └────────────────────────┘         └─────┬─────┘
                         ▲    ▲    ▲                         │
                         │    │    │                         ▼
                         │    │    │                   ┌─────────────┐
                         │    │    └───────────────────│ CODE-REVIEW │
                         │    │                        └──────┬──────┘
                         │    │                               │
                         │    │                               ▼
                         │    │                        ┌──────────┐
                         │    └────────────────────────│  VERIFY  │
                         │                             └────┬─────┘
                         │                                  │
                         │                                  ▼
                         │                          ┌─────────────┐      ┌──────────┐
                         └──────────────────────────│ ACCEPTANCE  │─────▶│ DELIVER  │
                                                    └─────────────┘      └─────┬────┘
                                                                               │
                                                                               ▼
                                                                         ┌───────────┐
                                                                         │ COMPLETED │
                                                                         └───────────┘

                    * ────────────────────────────────────────────────▶ ┌──────────┐
                                                                         │ CANCELED │
                                                                         └──────────┘

  ────────────────────────────────────────────────────────────────────────────────────
  Leyenda:

    ─────▶   Flujo normal (avance).
    ▲        Rework: CODE-REVIEW, VERIFY y
             ACCEPTANCE devuelven la historia a READY-FOR-IMPLEMENT/DONE.
    *        Cancelación posible desde cualquier estado activo.
  ────────────────────────────────────────────────────────────────────────────────────
```


