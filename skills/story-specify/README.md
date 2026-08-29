# story-specify

Skill orquestador del flujo completo de especificación de historias SDD: guía al usuario a través de un ciclo interactivo de creación, evaluación, división, mejora automática y refinamiento conversacional hasta producir especificaciones aprobadas (SPECIFY/DONE) listas para planning.

## Posicionamiento en el flujo SDD

```
/epic-generate-stories              → genera story.md iniciales desde epic.md
    ↓
/story-specify                         [story.md: SPECIFY/IN‑PROGRESS → SPECIFY/DONE]  ← aquí
    ├── /story-creation     → Crea o normaliza story.md (Como/Quiero/Para + Gherkin)
    ├── /story-evaluation   → Evalúa con rúbrica FINVEST → APROBADA/REFINAR/RECHAZAR/DIVIDIR
    ├── /story-split        → Divide historias grandes en partes independientes
    ├── /story-improve      → Aplica mejoras automáticas por dimensión FINVEST (Paso 5A)
    └── story-product-owner → Refinamiento conversacional: discovery y gaps de contexto (Paso 5B)
    ↓ [story.md: SPECIFY/DONE]
/story-plan                            [story.md: PLANNING/IN‑PROGRESS → READY-FOR-IMPLEMENT/DONE]
```

## Precondiciones

| Precondición | Descripción |
|---|---|
| `skill-preflight` retorna OK | Entorno válido (SDDF_ROOT, subdirectorios de specs) |
| `$SPECS_BASE/specs/03-stories/` accesible | Se crea automáticamente si no existe |

## Modos de ejecución

| Modo | Descripción |
|---|---|
| **Iniciar** | Sin backlog previo — el skill crea la primera historia desde una descripción en lenguaje natural |
| **Retomar** | Con historias en `SPECIFY/IN‑PROGRESS` — el skill detecta el backlog y pregunta si retomar o crear nueva |
| **Automático** | Invocado por orquestador de nivel superior — reporta resultado sin interacción |

## Parámetros

Sin parámetros posicionales — el skill es **completamente interactivo** y detecta el contexto automáticamente al inicio (backlog existente vs. historia nueva).

## Ciclo de especificación por historia

```
story-creation (crear/normalizar)
    ↓
story-evaluation (FINVEST score)
    ├── APROBADA → SPECIFY/DONE ✓ (siguiente historia)
    ├── DIVIDIR  → story-split → historias hijas al backlog
    └── REFINAR/RECHAZAR
            ↓
        Paso 5A: story-improve (automático, modo Agent)
            ├── APROBADA detectada → gate (omitir 5B)
            ├── Mejoras aplicadas  → story-improvement-log.md + continúa a 5B
            └── Fallo/sin reporte  → ⚠️ non-blocking, continúa a 5B
            ↓
        Paso 5B: story-product-owner (conversacional)
            → discovery, redacción, testabilidad
            ↓
        Gate anti-bucle (decisión del usuario)
            ├── Seguir iterando → volver a story-evaluation
            ├── Cerrar manualmente → SPECIFY/DONE
            └── Pausar → SPECIFY/IN-PROGRESS (retomar luego)
```

## Artefactos generados

| Artefacto | Generado por | Condición |
|---|---|---|
| `story.md` | `story-creation` / `story-product-owner` | Siempre |
| `finvest-evaluation-report.md` | `story-evaluation` | Por cada ciclo de evaluación |
| `story.md.bak` | `story-improve` (Paso 5A) | Solo cuando decision ≠ APROBADA |
| `story-improvement-log.md` | `story-improve` (Paso 5A) | Solo cuando decision ≠ APROBADA |

## Transiciones de estado

| Evento | status | substatus |
|---|---|---|
| Historia nueva o retomada | `SPECIFY` | `IN‑PROGRESS` |
| `story-evaluation` retorna `APROBADA` | `SPECIFY` | `DONE` |
| Usuario cierra manualmente | `SPECIFY` | `DONE` |
| Usuario pausa sin aprobación | `SPECIFY` | `IN‑PROGRESS` (sin cambio) |

## Uso

```bash
# Iniciar ciclo de especificación (nueva historia o retomar backlog)
/story-specify
```

El skill detecta automáticamente si existen historias en `SPECIFY/IN‑PROGRESS` y ofrece:
- **Retomar backlog actual** — continúa con las historias pendientes
- **Crear una historia nueva** — inicia con una descripción en lenguaje natural
