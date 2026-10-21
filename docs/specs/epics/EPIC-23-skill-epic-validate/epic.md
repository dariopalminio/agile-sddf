---
type: epic
id: EPIC-23
slug: EPIC-23-skill-epic-validate
title: "Skill epic-validate"
status: DEFINE
substatus: IN-PROGRESS
parent: null
created: 2026-10-12
updated: 2026-10-17
related:
  - EPIC-25-unificar-contrato-de-validaciones-en-skills
---

# Épica: Skill `epic-validate`

## Alcance

Crear `/epic-validate <EPIC-ID>` como gateway de calidad para la transición `DEVELOP → VALIDATE` de una épica. Verifica evidencia estructural y operativa y escribe `epic-validate-report.md` con veredicto `APPROVED`, `NEEDS-CHANGES` o `BLOCKED`, según el contrato de validación de EPIC-25.

El skill solo lee artefactos de entrada y, fuera de una previsualización, escribe únicamente su reporte. No modifica la épica, las historias, el código ni las fuentes, y no reejecuta verificaciones de historias que ya cuentan con evidencia.

## Historias

- [ ] **STORY-124** — Validar la preparación estructural de una épica: determinar el veredicto a partir del cierre de historias y del análisis de la épica.
- [ ] **STORY-125** — Validar la evidencia operativa de una épica: incorporar smoke tests, verificación de release y DoD aplicable.
- [ ] **STORY-126** — Operar la validación de épicas de manera segura: ofrecer modos manual, automático y de previsualización sin efectos inesperados.
- [ ] **STORY-127** — Integrar y documentar el gateway de validación de épicas: aplicar el gateway antes de la transición y hacerlo disponible en los runtimes soportados.
- [ ] **STORY-128** — Evaluar la validación de épicas de forma repetible: cubrir resultados APPROVED, NEEDS-CHANGES y BLOCKED contra regresiones.
- [ ] **STORY-137** — Controlar el detalle y los límites de la ejecución de la validación de épicas: `--verbose` y rechazo de `--mode auto` sin pruebas configuradas.

## Criterios de salida

- [ ] **CS-1** — `skills/epic-validate/SKILL.md` existe y resuelve `REPO_ROOT` y `SPECS_BASE` con la precedencia vigente.
- [ ] **CS-2** — `skills/epic-validate/assets/epic-validate-report-template.md` existe, declara en cada sección su marcador `sección obligatoria · clave · escritor` y tiene `## Veredicto` como primera sección tras el título.
- [ ] **CS-3** — Se verifican el estado terminal de las historias y el veredicto APPROVED del análisis de la épica.
- [ ] **CS-4** — Se verifican los smoke tests, `verify:release` y el DoD de épica cuando exista.
- [ ] **CS-5** — El reporte se genera desde su plantilla sin marcadores sin resolver, declara el veredicto en su primera sección y en el campo `verdict` del frontmatter con el vocabulario único `APPROVED`, `NEEDS-CHANGES` o `BLOCKED`.
- [ ] **CS-6** — Una épica inexistente informa la ruta buscada y no genera reporte.
- [ ] **CS-7** — El skill solo escribe `epic-validate-report.md`; no modifica código, fuentes ni otros documentos.
- [ ] **CS-8** — `skills/epic-validate/` figura en el arreglo `files` de `package.json`.
- [ ] **CS-9** — `skills/epic-validate/evals/evals.json` incluye al menos una épica consistente que resulte APPROVED, una inconsistente que resulte NEEDS-CHANGES y una cuya evidencia no se puede obtener que resulte BLOCKED.
- [ ] **CS-10** — Se reconocen y manejan correctamente los flags `--mode manual`, `--mode auto`, `--dry-run` y `--verbose`.

## Smoke tests

### SMOKE-1 — Épica consistente obtiene APPROVED
```gherkin
Escenario: Épica consistente obtiene APPROVED
  Dado una épica con historias terminales y análisis APPROVED
    Y con smoke tests y verificación de release aprobados
  Cuando se ejecuta /epic-validate sobre la épica
  Entonces se escribe epic-validate-report.md con APPROVED
    Y no hay motivos de rechazo ni de bloqueo
```

### SMOKE-2 — Épica inexistente no escribe reporte
```gherkin
Escenario: Épica inexistente
  Dado que no existe ningún directorio para EPIC-77
  Cuando se ejecuta /epic-validate EPIC-77
  Entonces informa la ruta buscada, no escribe reporte y finaliza con error
```

### SMOKE-3 — Historia no terminal rechaza la épica
```gherkin
Escenario: Épica con historia no terminal
  Dado una épica cuya historia STORY-042 no está en estado terminal
  Cuando se ejecuta /epic-validate sobre la épica
  Entonces el reporte declara NEEDS-CHANGES e identifica STORY-042 y su estado
```

## Notas

- La épica se crea en `DEFINE/TODO` para no activar otro ítem de nivel épica mientras existen épicas en progreso.
- Las historias ya existían al crear esta épica; se registran como F2 y se vinculan a `EPIC-23` sin asignarles nuevos IDs.
- **Vocabulario del veredicto (decisión del PO, 2026-10-17):** sigue el contrato de validación de EPIC-25 (`docs/policies/validation-contract-policy.md`, STORY-138).
  - `NEEDS-CHANGES`: la evidencia existe pero no cumple. Por ejemplo, una historia no terminal, un análisis de la épica sin `APPROVED`, smoke tests o `verify:release` fallidos, o el DoD incumplido.
  - `BLOCKED`: un bloqueo impide obtener la evidencia, por ejemplo, los smoke tests o `verify:release` no se pueden ejecutar.
  - Si hay a la vez algo que no cumple y algo bloqueado, gana `NEEDS-CHANGES`.
  - Antes, `BLOCKED` significaba «la validación falló»; ese caso es ahora `NEEDS-CHANGES`. Las historias STORY-124 a STORY-128 todavía usan `APPROVED` / `BLOCKED` y deben alinearse con este vocabulario.
- Los IDs `CS-N` de los criterios de salida son estables, como los `SMOKE-N`: no se renumeran al insertar o eliminar criterios.
- Cada criterio de salida y cada smoke test tiene una historia dueña que lo cita en sus notas: STORY-124 (CS-1, CS-2, CS-3, CS-5, CS-6; SMOKE-2, SMOKE-3), STORY-125 (CS-4; SMOKE-1), STORY-126 (CS-7), STORY-127 (CS-8), STORY-128 (CS-9) y STORY-137 (CS-10, junto con STORY-126 para `--mode` y `--dry-run`).
- Los flags disponibles para `/epic-validate` se describen en la siguiente tabla:
| Flag | Descripción |
|------|-------------|
| `--mode manual` | Fuerza el modo interactivo aunque existan tests automáticos |
| `--mode auto` | Fuerza ejecución automática (falla si no hay tests configurados) |
| `--dry-run` | Simula sin escribir archivos ni ejecutar tests |
| `--verbose` | Muestra salida completa de los comandos de prueba |
- Los modos de uso del skill deben ser como sigue:
```bash
/epic-validate EPIC-23
/epic-validate EPIC-23 --mode manual
/epic-validate EPIC-23 --dry-run
/epic-validate EPIC-23 --verbose
```
