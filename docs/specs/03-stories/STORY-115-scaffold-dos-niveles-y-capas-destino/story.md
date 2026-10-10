---
alwaysApply: false
type: story
id: STORY-115
kind: feat
slug: STORY-115-scaffold-dos-niveles-y-capas-destino
title: "Actualizar scaffolding de memory-system a specs/ de dos niveles"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-10-05
updated: 2026-10-05
related:
  - EPIC-21-colapsar-specs-dos-niveles
  - ADR-0013-eliminar-specs-01-projects
  - STORY-108-renombrar-specs-sin-prefijos
  - STORY-111-planning-escribe-roadmap
  - STORY-114-migrate-specs-3-levels
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]
[[ADR-0013-eliminar-specs-01-projects]]

# ðŸ“– Historia: Actualizar scaffolding de `memory-system` a `specs/` de dos niveles

**Como** usuario de SDDF que inicializa la memoria de un proyecto nuevo con `/memory-system scaffold` (o `ensure`)  
**Quiero** obtener `specs/epics/` y `specs/stories/` sin `specs/01-projects/`, junto con `product/roadmap.md` y las carpetas `requirements/functional/` y `requirements/non-functional/` listas para recibir requisitos  
**Para** empezar directamente con la estructura de ADR-0013, sin una carpeta `01-projects/` vacÃ­a que invite a crear la documentaciÃ³n del proyecto en el lugar equivocado

## âœ… Criterios de aceptaciÃ³n

### AC-1 â€” Escenario principal â€“ Proyecto vacÃ­o
```gherkin
Dado un directorio de proyecto sin "docs/"
Cuando el usuario ejecuta "/memory-system scaffold"
Entonces existen "docs/specs/epics/" y "docs/specs/stories/"
  Y existen "docs/product/vision.md", "docs/product/stakeholders.md", "docs/product/objectives.md" y "docs/product/roadmap.md"
  Y existen "docs/requirements/functional/" y "docs/requirements/non-functional/"
  Pero no existen "docs/specs/01-projects/", "docs/specs/02-epics/" ni "docs/specs/03-stories/"
```

### AC-2 â€” Escenario alternativo â€“ Repositorio con la estructura antigua
```gherkin
Dado un repositorio con "docs/specs/01-projects/PROJ-01-demo/project.md", "docs/specs/02-epics/" y "docs/specs/03-stories/"
Cuando el usuario ejecuta "/memory-system scaffold"
Entonces ningÃºn archivo de "01-projects/", "02-epics/" ni "03-stories/" se modifica, mueve ni elimina
  Y el informe incluye una lÃ­nea "[WARNING]" que indica ejecutar "/memory-system migrate --from=specs-3-levels"
  Pero el comando termina con el mismo exit code que tendrÃ­a sin esa estructura
```

### AC-3 â€” Escenario alternativo â€“ Idempotencia con roadmap existente
```gherkin
Dado un proyecto en el que ya se ejecutÃ³ "/memory-system scaffold"
  Y "docs/product/roadmap.md" fue editado con contenido propio
Cuando el usuario vuelve a ejecutar "/memory-system scaffold"
Entonces la Ãºltima lÃ­nea del informe empieza con "creados: 0 Â· sobrescritos: 0"
  Y "docs/product/roadmap.md" conserva su contenido
```

## âš™ï¸ Criterios no funcionales especÃ­ficos

- **CNF-1 â€” Fuente Ãºnica del Ã¡rbol semilla:** el Ã¡rbol de `skills/memory-system/assets/scaffold/`, la tabla de archivos gestionados de `references/memory-rules.md`, la descripciÃ³n del `SKILL.md` y el Ã¡rbol esperado de `test/memory-system.test.js` describen la misma estructura; `npm test` termina con exit code 0.
- **CNF-2 â€” Coherencia de la semilla de roadmap:** las secciones de `product/roadmap.md` sembrado coinciden con el template de roadmap que define STORY-111.
- **CNF-3 â€” Capa retirada:** la capa de Ã­ndice `specs-projects` deja de existir para `index` y `check`; solo la detecciÃ³n de la estructura antigua (AC-2 y `migrate`) reconoce `01-projects/`.
- **CNF-4 â€” Encoding:** las semillas se escriben en UTF-8 sin BOM.

## Fuera de alcance (Non-Goals)

- **Renombrar las semillas y rutas de `02-epics/` â†’ `epics/` y `03-stories/` â†’ `stories/`** en el motor, `memory-rules.md`, `SKILL.md` y tests: lo hace STORY-108 como parte del renombrado atÃ³mico. AC-1 solo verifica el resultado.
- **Migrar automÃ¡ticamente** la estructura antigua: STORY-114. AquÃ­ solo se avisa.
- **`sddf-init`**, que tambiÃ©n crea los directorios de `specs/`: STORY-113.
- **Sembrar templates de visiÃ³n, requisitos y roadmap en `docs/templates/`**: los crean STORY-109 a STORY-111.
- **Archivos FR/NFR de ejemplo:** `requirements/functional/` y `non-functional/` se crean vacÃ­os.

## ðŸ“Ž Notas / contexto adicional

- **Origen:** [[ADR-0013-eliminar-specs-01-projects]] ("SimplificaciÃ³n del scaffolding: `memory-system` ya no necesita crear `specs/01-projects/`") y el smoke test 1 de EPIC-21.
- **Estado actual (2026-10-05):** el Ã¡rbol semilla tiene `specs/01-projects/.gitkeep`, `specs/02-epics/.gitkeep`, `specs/03-stories/.gitkeep` y `product/{vision,stakeholders,objectives}.md`; no tiene `roadmap.md` ni subcarpetas en `requirements/`. El motor mapea `01-projects` a la capa `specs-projects`.
- **Reparto con STORY-108:** su AC-2 exige que no quede "02-epics"/"03-stories" en `skills/`, lo que ya obliga a renombrar estas semillas. Por eso esta historia se queda con lo que no es renombrado: retirar `01-projects`, sembrar `roadmap.md` y `requirements/{functional,non-functional}/`, y avisar de la estructura antigua.
- **`product/README.md`:** su convenciÃ³n fija tres documentos (`vision`, `stakeholders`, `objectives`). Si `roadmap.md` pasa a sembrarse siempre, conviene incluirlo como cuarto documento fijo en la semilla del README; se decide en diseÃ±o.
- **Independencia:** CNF-2 se apoya en el template de STORY-111. Si esta historia va antes, la semilla define la estructura y STORY-111 debe respetarla.
