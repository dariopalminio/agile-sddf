# epic-analyze

> **Type:** skill · **Category:** guardrail  
> **Location:** `skills/epic-analyze/SKILL.md`  
> **Status:** beta

---

## What it does

Audita una épica cruzando su índice de historias en `epic.md` con los `story.md` que la declaran como `parent`, comprueba que cada criterio de salida y cada smoke test está cubierto por alguna historia con evidencia citable, y verifica la madurez de las historias hijas (especificación terminada y referencias `related` resolubles). Escribe `epic-analyze-report.md` con hallazgos ERROR/WARNING de las familias INT (integridad del índice), SAL (contrato de salida) y MAD (madurez), una acción sugerida por hallazgo y un veredicto `APPROVED`, `NEEDS-REFINEMENT` o `BLOCKED`. Es el equivalente de `story-analyze` en el nivel de épica.

**Produces:**

- `<EPIC_DIR>/epic-analyze-report.md`, regenerado completo en cada ejecución (solo conserva `created` del reporte previo).
- Un resumen en consola (modo manual) o un bloque de retorno de cuatro líneas `STATUS`/`VEREDICTO`/`HALLAZGOS`/`REPORTE` (modo Agent o `--auto`).

**Does not do:**

- No modifica `epic.md`, ningún `story.md` ni el `status`/`substatus` de nada: el veredicto es informativo y la transición `PLAN → READY-FOR-DEV` la decide el PO.
- No valida la forma de las líneas del índice ni de los smoke tests (eso es `epic-format-validation`).
- No crea historias para cubrir huecos, no corrige hallazgos, no analiza varias épicas a la vez ni invoca otros skills.

---

## When to use

**Use it when:**

- Acabes de ejecutar `epic-generate-stories` o `epic-generate-all-stories` y quieras saber si la épica está lista para aprobarse hacia `READY-FOR-DEV`.
- Sospeches que el índice de historias no coincide con las historias reales (faltantes, huérfanas, duplicadas o con `parent` divergente).
- Necesites saber si terminar todas las historias cumple los criterios de salida y los smoke tests de la épica.
- Quieras comprobar que las historias hijas terminaron su especificación (`SPECIFY/DONE` o posterior) y que sus `related` apuntan a historias o épicas existentes.
- El usuario mencione: `"epic-analyze"`, `"analizar épica"`, `"historias huérfanas"`, `"criterios de salida"`, `"smoke tests"`, `"madurez de historias"`, `"épica lista para desarrollo"`.

**Do NOT use it when:**

- Debas validar la estructura del template o el formato del índice → usa `[[epic-format-validation]]`.
- Debas generar las historias que faltan → usa `[[epic-generate-stories]]`.
- Debas auditar la coherencia de una sola historia con su diseño y tareas → usa `[[story-analyze]]`.
- Debas completar la especificación de una historia hija → usa `[[story-specify]]`.

---

## Installation

**Core (incluido en `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/epic-analyze <epica>`, donde `<epica>` es el ID (`EPIC-30`), el nombre del directorio (`EPIC-30-ejemplo`) o la ruta al directorio o a su `epic.md`. Añade `--auto` para ejecutarlo sin preguntas desde un orquestador.

```bash
/epic-analyze EPIC-30
/epic-analyze EPIC-30 --auto
```
