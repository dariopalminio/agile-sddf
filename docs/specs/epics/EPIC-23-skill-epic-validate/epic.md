---
type: epic
id: EPIC-23
slug: EPIC-23-skill-epic-validate
title: "Skill epic-validate"
status: DEFINE
substatus: TODO
parent: null
created: 2026-10-12
updated: 2026-10-12
related: []
---

# Épica: Skill `epic-validate`

## Alcance

Crear `/epic-validate <EPIC-ID>` como gateway de calidad para la transición `DEVELOP → VALIDATE` de una épica. Verifica evidencia estructural y operativa y escribe `epic-validate-report.md` con veredicto `READY-TO-SHIP` o `BLOCKED`.

El skill solo lee artefactos de entrada y, fuera de una previsualización, escribe únicamente su reporte. No modifica la épica, las historias, el código ni las fuentes, y no reejecuta verificaciones de historias que ya cuentan con evidencia.

## Historias

- [ ] **STORY-124** — Validar la preparación estructural de una épica: determinar el veredicto a partir del cierre de historias y del análisis de la épica.
- [ ] **STORY-125** — Validar la evidencia operativa de una épica: incorporar smoke tests, verificación de release y DoD aplicable.
- [ ] **STORY-126** — Operar la validación de épicas de manera segura: ofrecer modos manual, automático y de previsualización sin efectos inesperados.
- [ ] **STORY-127** — Integrar y documentar el gateway de validación de épicas: aplicar el gateway antes de la transición y hacerlo disponible en los runtimes soportados.
- [ ] **STORY-128** — Evaluar la validación de épicas de forma repetible: cubrir resultados READY-TO-SHIP y BLOCKED contra regresiones.

## Criterios de salida

- [ ] `skills/epic-validate/SKILL.md` existe, resuelve `REPO_ROOT` y `SPECS_BASE` con la precedencia vigente y contiene `evals/evals.json`.
- [ ] Se verifican las cinco condiciones: historias terminales, análisis APPROVED, smoke tests, `verify:release` y DoD de épica cuando exista.
- [ ] El reporte usa su plantilla, resuelve todos sus marcadores y comunica `READY-TO-SHIP` o `BLOCKED`.
- [ ] Una épica inexistente informa la ruta buscada y no genera reporte.
- [ ] El skill solo escribe `epic-validate-report.md`; no modifica código, fuentes ni otros documentos.
- [ ] `skills/epic-validate/` forma parte del contenido publicable del paquete.
- [ ] Las evaluaciones incluyen al menos una épica consistente que resulte READY-TO-SHIP y una inconsistente que resulte BLOCKED.

## Smoke tests

### SMOKE-1 — Épica consistente obtiene READY-TO-SHIP
```gherkin
Escenario: Épica consistente obtiene READY-TO-SHIP
  Dado una épica con historias terminales y análisis APPROVED
    Y con smoke tests y verificación de release aprobados
  Cuando se ejecuta /epic-validate sobre la épica
  Entonces se escribe epic-validate-report.md con READY-TO-SHIP
    Y no hay motivos de bloqueo
```

### SMOKE-2 — Épica inexistente no escribe reporte
```gherkin
Escenario: Épica inexistente
  Dado que no existe ningún directorio para EPIC-77
  Cuando se ejecuta /epic-validate EPIC-77
  Entonces informa la ruta buscada, no escribe reporte y finaliza con error
```

### SMOKE-3 — Historia no terminal bloquea la épica
```gherkin
Escenario: Épica con historia no terminal
  Dado una épica cuya historia STORY-042 no está en estado terminal
  Cuando se ejecuta /epic-validate sobre la épica
  Entonces el reporte declara BLOCKED e identifica STORY-042 y su estado
```

## Notas

- La épica se crea en `DEFINE/TODO` para no activar otro ítem de nivel épica mientras existen épicas en progreso.
- Las historias ya existían al crear esta épica; se registran como F2 y se vinculan a `EPIC-23` sin asignarles nuevos IDs.
