# skill: story-verify

Orquesta la fase VERIFY del pipeline SDD: ejecuta pruebas, evalúa los criterios del Definition of Done para VERIFY, genera `verify-report.md` y actualiza el estado de la historia.

## Posición en el pipeline

```
story-code-review → [READY-FOR-VERIFY/DONE] → story-verify → [VERIFY/DONE | VERIFY/REJECTED]
```

## Precondiciones

La historia debe tener uno de estos estados antes de ejecutar:

| status | substatus | Fuente |
|--------|-----------|--------|
| `READY-FOR-VERIFY` | `DONE` | Camino normal desde `story-code-review` |
| `IMPLEMENT` | `DONE` | Mínimo aceptable (historia sin code review) |

Cualquier otro estado genera un error descriptivo sin modificar archivos.

## Modos de ejecución

El skill detecta automáticamente el modo en este orden:

| Modo | Condición de activación | Acción |
|------|------------------------|--------|
| `delegado` | Skill de testing en `.claude/skills/` | Invoca el skill de testing externo |
| `automatico-e2e` | `playwright.config.*`, `cypress.config.*`, `features/*.feature` | Ejecuta suite E2E |
| `automatico-unit` | `pytest.ini`, `jest.config.*`, `vitest.config.*`, `go.mod`, etc. | Ejecuta tests unit/integration |
| `manual` | Sin configuración de tests detectada | Guía al usuario escenario por escenario via `qa-engineer.agent.md` |

## Uso

```bash
/story-verify FEAT-050
/story-verify FEAT-050 --mode manual
/story-verify FEAT-050 --dry-run
/story-verify FEAT-050 --verbose
```

## Flags

| Flag | Descripción |
|------|-------------|
| `--mode manual` | Fuerza el modo interactivo aunque existan tests automáticos |
| `--mode auto` | Fuerza ejecución automática (falla si no hay tests configurados) |
| `--dry-run` | Simula sin escribir archivos ni ejecutar tests |
| `--verbose` | Muestra salida completa de los comandos de prueba |

## Output generado

| Archivo | Descripción |
|---------|-------------|
| `$SPECS_BASE/specs/03-stories/<ID>/verify-report.md` | Reporte completo de verificación |
| `story.md` frontmatter | `status: VERIFY`, `substatus: DONE | REJECTED` |

## Template del reporte

El skill lee el template en este orden:
1. `$SPECS_BASE/specs/templates/verify-report-template.md` — ubicación canónica
2. `assets/verify-report-template.md` — fallback local del skill

Si el template cambia, el skill lo refleja automáticamente sin modificaciones.

## DoD VERIFY

Los criterios evaluados se leen en runtime de `$SPECS_BASE/policies/definition-of-done-story.md`, sección VERIFY. Para añadir un nuevo criterio, editar ese archivo — el skill lo detecta automáticamente en la siguiente ejecución.

Si la sección VERIFY no existe, el skill usa criterios mínimos genéricos:
1. Todos los tests del proyecto pasan
2. Sin defectos CRITICAL o HIGH sin resolver

## Idempotencia

Ejecutable múltiples veces. Si `verify-report.md` ya existe, se sobreescribe preservando el contenido de la sección `## Historial de Ejecuciones Anteriores`.

## Estructura

```
story-verify/
├── SKILL.md                        # Orquestador principal
├── README.md                       # Este archivo
├── assets/
│   └── verify-report-template.md   # Template (fallback local)
├── agents/
│   └── qa-engineer.agent.md        # Agente QA para modo manual y e2e-assessment
├── examples/
│   ├── pytest-project/             # Fixture: proyecto con pytest (AC-1, AC-5)
│   ├── jest-project/               # Fixture: proyecto con jest (AC-6)
│   └── no-tests-project/           # Fixture: proyecto sin tests → modo manual (AC-3)
└── evals/
    └── eval-mode-detection.md      # Benchmarks de detección de modo de ejecución
```
