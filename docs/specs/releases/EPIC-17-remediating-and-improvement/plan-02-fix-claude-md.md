# Plan: Corrección de CLAUDE.md — Feature del EPIC-17

## Contexto

CLAUDE.md es el archivo que todo agente lee en cada sesión. Contiene información falsa sobre la estructura del repo en dos puntos concretos:

1. **Diagrama de estructura**: lista solo 3 agentes cuando en realidad hay 10; omite `.claude/commands/` por completo.
2. **Política de commands vs. realidad**: la política escrita dice "evitamos comandos" de forma absoluta, pero `.claude/commands/opsx/` contiene 4 comandos activos (`propose`, `apply`, `archive`, `explore`) que incluso son referenciados por el skill `openspec-generate-baseline`.

---

## Sub-tarea 1 — Actualizar diagrama de estructura en CLAUDE.md

**Archivo:** `CLAUDE.md` (sección `## Project structure`)

Reemplazar el árbol de directorios por uno que refleje la realidad:

```
agile-sddf/
  ├── docs/specs/                      # Artefactos generados (projects/, releases/, stories/)
  ├── docs/policies/                   # constitution.md, definition-of-done-story.md
  ├── AGENTS.md                        # Convención .agent/ — compatible con Codex, Cursor, etc.
  ├── CLAUDE.md                        # Instrucciones globales del proyecto
  └── .claude/                         # Fuente única de verdad para agentes y skills
      ├── agents/                      # 10 agentes registrados por el harness
      │   ├── project-pm.agent.md
      │   ├── project-architect.agent.md
      │   ├── project-ux.agent.md
      │   ├── project-story-mapper.agent.md
      │   ├── story-product-owner.agent.md
      │   ├── reverse-engineer-architect.agent.md
      │   ├── reverse-engineer-business-analyst.agent.md
      │   ├── reverse-engineer-product-discovery.agent.md
      │   ├── reverse-engineer-synthesizer.agent.md
      │   └── reverse-engineer-ux-flow-mapper.agent.md
      ├── commands/
      │   └── opsx/                    # Integración experimental OpenSpec (apply, archive, explore, propose)
      └── skills/
          ├── skill-name/
          │   ├── assets/
          │   ├── examples/
          │   ├── scripts/
          │   └── SKILL.md
          └── ...
```

---

## Sub-tarea 2 — Reconciliar política de commands con la realidad

**Archivo:** `CLAUDE.md` (sección `### Comandos en Claude`)

La política actual dice "evitamos comandos" de forma absoluta, pero esto contradice la existencia de `.claude/commands/opsx/`. La corrección no es eliminar los commands (están en uso activo por `openspec-generate-baseline`) sino actualizar el texto para que sea preciso.

Reemplazar el párrafo actual por:

> En Claude **preferimos skills sobre commands**: los skills son más componibles, más fáciles de versionar y se adaptan al contexto de ejecución. Los commands son apropiados solo para integraciones externas donde el harness de commands ofrece ventajas claras (argumentos posicionales `$ARGUMENTS`, inyección de resultados de shell).
>
> **Excepción activa:** `.claude/commands/opsx/` mantiene 4 comandos de integración OpenSpec (`propose`, `apply`, `archive`, `explore`) mientras se evalúa su migración a skills. No crear nuevos commands Claude sin evaluar primero si un skill cumple el mismo propósito.

---

## Sub-tarea 3 — Añadir regla de veracidad a constitution.md

**Archivo:** `docs/policies/constitution.md` (sección `## ✅ Principios Técnicos Inamovibles`, al final de la lista)

Añadir como nuevo principio:

> **12. Veracidad de CLAUDE.md:** CLAUDE.md solo describe estructura verificable con el filesystem en el momento de la edición. Antes de actualizar la sección de estructura de directorios o la lista de agentes, verificar con `ls .claude/agents/` y `ls .claude/commands/`. Nunca listar archivos que no existen ni omitir directorios relevantes que sí existen.

---

## Archivos a modificar

| Archivo | Acción |
|---|---|
| `CLAUDE.md` | Diagrama actualizado + política de commands reconciliada |
| `docs/policies/constitution.md` | Añadir principio #12 de veracidad |

---

## Verificación

1. `ls .claude/agents/*.md` → confirmar que todos los agentes listados en el diagrama existen y no faltan.
2. `ls .claude/commands/opsx/` → confirmar que los 4 commands listados existen.
3. Leer `constitution.md` → confirmar que el principio #12 está presente.
4. Spot-check: ninguna de las rutas listadas en el diagrama de CLAUDE.md apunta a algo inexistente.

## Reporte de implementación

Verificación completa:

10 agentes en .claude/agents/ — todos listados en el diagrama actualizado.
4 commands en .claude/commands/opsx/ (apply, archive, explore, propose) — presentes en el diagrama y mencionados en la política reconciliada.
Los tres cambios están aplicados:

CLAUDE.md — diagrama reemplazado con la estructura real (10 agentes + directorio commands/opsx/).
CLAUDE.md — política de commands reconciliada: "preferimos skills, excepción activa opsx".
docs/policies/constitution.md — principio #12 añadido: veracidad obligatoria de CLAUDE.md.