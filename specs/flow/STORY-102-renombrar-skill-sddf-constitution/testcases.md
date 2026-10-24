---
type: testcases
id: STORY-102
slug: STORY-102-renombrar-skill-sddf-constitution-testcases
title: "Test Cases: Renombrar el skill project-policies-generation como sddf-constitution"
story: STORY-102
created: 2026-09-26
updated: 2026-09-26
related:
  - STORY-102-renombrar-skill-sddf-constitution
---

<!-- Referencias -->
[[STORY-102-renombrar-skill-sddf-constitution]]

# Casos de Prueba: Renombrar el skill project-policies-generation como sddf-constitution

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 0 |
| CT   | 0 |
| IT   | 1 |
| API  | 0 |
| E2E  | 2 |
| EV   | 4 |

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| E2E-001 | End-to-End | La fuente canónica adopta el nuevo nombre | El árbol fuente contiene el skill de gobernanza anterior | Se aplica el traslado y la identidad definida en D-01 | Existe solo `skills/sddf-constitution/`, su invocación pública es `/sddf-constitution` y conserva assets, ejemplos y protecciones | AC-1 · D-01 · T002/T003 |
| E2E-002 | End-to-End | Las integraciones presentan solo el nombre nuevo | Los flujos activos de inicialización, diseño y ayuda están actualizados | Una persona mantenedora consulta cada superficie de D-02 | Todas recomiendan `sddf-constitution`; las únicas alusiones antiguas restantes pertenecen a la allowlist histórica | AC-2 · D-02/D-03 · T005/T007/T008 |
| EV-001 | Eval | Contrato declarativo del skill renombrado | Existe `skills/sddf-constitution/SKILL.md` | Se inspeccionan su frontmatter, nombre, descripción, encabezado y modo manual | El nombre coincide con el directorio, no hay clave `triggers` ni alias público anterior y el workflow funcional sigue describiendo constitution, policies y DoD por etapa | AC-1 · D-01 · T003 |
| EV-002 | Eval | sddf-init conserva su integración con el nombre nuevo | El caso TC-006 y el contrato de `sddf-init` fueron migrados | Se planifica o ejecuta el dry-run de eval de `sddf-init` en nivel minimal | El literal `[OMITIDO] sddf-constitution (nivel minimal)` es el esperado y no se ofrece el nombre retirado | AC-2 · D-02 · T005 |
| EV-003 | Eval | El inventario de evals reconoce la exención renombrada | El skill no tiene fixtures de eval propios y conserva su exención temporal | Se ejecuta `npm run verify:eval-inventory` | El inventario acepta `sddf-constitution`, no deja una exención huérfana y no informa un skill sin cobertura declarada | AC-1 · AC-2 · D-02/D-04 · T004/T009 |
| EV-004 | Eval | La búsqueda operativa distingue identidad retirada de historia preservada | Existe la allowlist de D-03 | Se inspeccionan el árbol renombrado y las superficies activas | Ninguna superficie activa ofrece `project-policies-generation`; las coincidencias permitidas solo describen trazabilidad o migración heredada | AC-2 · CNF-01 · D-03 · T001/T008 |
| IT-001 | Integration | Una instalación limpia distribuye el inventario fuente renombrado | El paquete publica el árbol `skills/` y el instalador deriva sus entradas dinámicamente | Se ejecutan las pruebas de instalación y smoke package sobre un destino limpio | Cada runtime instala `sddf-constitution` desde la fuente y no recibe el directorio retirado; no se pretende podar destinos existentes | AC-1 · CNF-02 · D-04 · T009 |

## Notas de cobertura

`tasks.md` se usó para asociar cada verificación con T001–T009. Los dos escenarios Gherkin de
`story.md` tienen cobertura E2E uno a uno. Los casos EV cubren la identidad del skill, la integración
con `sddf-init`, la exención temporal y el límite histórico; IT-001 cubre la distribución sin exigir
la limpieza de runtimes ya existentes, que es un non-goal.

## Test Cases Progress for STORY-102

- [x] E2E-001: La fuente canónica adopta el nuevo nombre
- [x] E2E-002: Las integraciones presentan solo el nombre nuevo
- [x] EV-001: Contrato declarativo del skill renombrado
- [x] EV-002: sddf-init conserva su integración con el nombre nuevo
- [x] EV-003: El inventario de evals reconoce la exención renombrada
- [x] EV-004: La búsqueda operativa distingue identidad retirada de historia preservada
- [x] IT-001: Una instalación limpia distribuye el inventario fuente renombrado
