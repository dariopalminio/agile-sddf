---
type: fix-directives
story: STORY-096
title: "Fix Directives: STORY-096"
review-status: needs-changes
date: 2026-09-23
max-severity: MEDIUM
based-on: code-review-report.md
---

# Fix Directives: STORY-096

## Resumen de bloqueantes

- **Story:** STORY-096 — Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild
- **Review status:** needs-changes
- **Severidad máxima:** MEDIUM
- **Total de hallazgos bloqueantes:** 1 (1 MEDIUM, 0 HIGH)

**Un solo defecto**, detectado de forma independiente por el Tech-Lead-Reviewer y el Integration-Reviewer. Se consolida en una única acción.

El motor, los modos, los tests `S096-*` y la auditoría de seguridad quedaron aprobados. El bloqueante está en el contenido del árbol semilla.

## Decisión del autor — las tres plantillas se quedan

`skills/memory-system/assets/scaffold/templates/{domain,guardrail,policy}-template.md` **se añadieron a mano de forma deliberada** porque el autor las considera necesarias. Eso descarta retirarlas y fija el camino: **documentarlas formalmente**.

Conviene ser preciso sobre qué bloqueó el gate, porque no es que existan:

> Bloqueó que **están sin documentar y contradicen cuatro reglas que la propia historia escribió**. `listSeeds()` recorre el árbol sin filtro, así que `scaffold` las copia a `docs/templates/` de **todo** proyecto consumidor —son comportamiento entregado, no archivos muertos—, mientras `memory-rules.md` §5 afirma que su lista es "lo único" que `rebuild --force` sobrescribe y `SKILL.md` habla de "las seis plantillas". Documentarlas resuelve el hallazgo por completo.

### Corrección del árbitro sobre el conflicto con ADR-0001

Una versión anterior de este documento afirmaba que documentarlas obligaba a "resolver su conflicto con ADR-0001". **Es incorrecto y se retira**, por dos razones verificadas:

1. **ADR-0001 está `SUPERSEDED` por ADR-0007**, que conserva su regla de propiedad y solo cambia la ubicación de los templates. La cita de `memory-rules.md` §5 debería apuntar a ADR-0007.
2. **ADR-0012 ya cubre exactamente este caso.** Su decisión: *"Un template cuyos campos no escribe ningún skill **satisface el principio 13 anotando `escritor: autoría manual`**, en lugar de retirar el campo"*, y añade que `adr-template.md` es *"el **primer** template bajo esta regla"*. Estas tres son el segundo, tercero y cuarto. No hay conflicto que resolver: hay un precedente que aplicar.

## Instrucciones de corrección

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---------------|-----------|-----------|----------|-----------------|
| 1 | skills/memory-system/assets/scaffold/templates/{domain,guardrail,policy}-template.md | code-quality · integration-architecture | MEDIUM | El árbol semilla contiene **22 archivos, no los 19** que declaran `design.md`, `implement-report.md` y el reporte anterior. Los tres extra no aparecen en ninguna de las cuatro listas de archivos gestionados, no llevan frontmatter canónico ni anotación `escritor:`, y `scaffold` los escribe en todo proyecto consumidor fuera del alcance documentado | Documentarlos formalmente siguiendo el precedente de ADR-0012. Ver el desglose de abajo |

### Desglose de la acción 1

**a. Anotar `escritor: autoría manual` según ADR-0012**, en las dos formas que fija ese ADR: comentario de línea completa encima de cada campo del frontmatter, y comentario HTML al inicio de cada sección del cuerpo.

| Template | Campos declarados a anotar | Secciones |
|---|---|---|
| `policy-template.md` (191 l) | `**Versión:**`, `**Estado:**`, `**Última actualización:**`, `**Propietario:**` | 8 secciones numeradas |
| `guardrail-template.md` (214 l) | — (basado en secciones) | *Mandatory rules*, *Minimum expected structure*, *How to run the validation*, *Verification*, *Source of truth* |
| `domain-template.md` (158 l) | — (basado en secciones) | 8 secciones (*Purpose and Scope*, *Bounded Contexts*, *Context Map*, *Ubiquitous Language*, *Domain Model*, *Relationships and Invariants*, *Lifecycles and Domain Events*, *Business Processes*) |

**b. Añadir frontmatter canónico** (`type`, `slug`, `title`) a los tres: hoy son las únicas semillas `.md` sin él, lo que exige D-1 y `memory-rules.md` §5.

**c. Actualizar las cuatro listas de archivos gestionados**, para que `rebuild --force` vuelva a tener un alcance documentado veraz:

- `skills/memory-system/references/memory-rules.md` §5 — tabla de archivos gestionados; corregir de paso la cita a ADR-0001 → ADR-0007.
- `skills/memory-system/SKILL.md` §3.3 y sección *Salida* — "seis plantillas" → nueve.
- `docs/architecture/memory-system.md` — misma corrección.
- `skills/memory-system/assets/scaffold/templates/README.md` — la propia semilla afirma "Las seis plantillas base son…"; hoy el entregable se contradice a sí mismo.

**d. Registrar un CR en `design.md`** que amplíe D-1/D-2 de seis a nueve plantillas, con el rationale del autor (por qué son necesarias) y la referencia a ADR-0012.

**e. Actualizar los artefactos de la historia:** `implement-report.md` (19 → 22 semillas en *Artefactos producidos*), `tasks.md` (T005 solo cubre `adr-template.md`), `testcases.md` (AC-6) y `CHANGELOG.md`.

**f. Sincronizar `docs/templates/` de este repositorio**, que hoy no contiene las tres plantillas: el framework está desincronizado con su propio scaffold, y un `ensure` sobre este repo las crearía ahora mismo.

**g. Añadir a `test/memory-system.test.js` una aserción de exhaustividad** del árbol semilla (conjunto exacto o número de archivos). `SIX_TEMPLATES` comprueba **presencia**, no exhaustividad — por eso los tests no detectaron los tres extra. Sin esto, el mismo defecto puede repetirse.

## Lista blanca de archivos permitidos para modificar

- `skills/memory-system/assets/scaffold/templates/domain-template.md` — acción 1a, 1b
- `skills/memory-system/assets/scaffold/templates/guardrail-template.md` — acción 1a, 1b
- `skills/memory-system/assets/scaffold/templates/policy-template.md` — acción 1a, 1b
- `skills/memory-system/assets/scaffold/templates/README.md` — acción 1c
- `skills/memory-system/references/memory-rules.md` — acción 1c
- `skills/memory-system/SKILL.md` — acción 1c
- `docs/architecture/memory-system.md` — acción 1c
- `docs/templates/` — acción 1f
- `CHANGELOG.md` — acción 1e
- `test/memory-system.test.js` — acción 1g
- En el directorio de la historia: `design.md` (acción 1d), `implement-report.md`, `tasks.md`, `testcases.md` (acción 1e)

No deben modificarse archivos fuera de esta lista sin previa aprobación.

## Hallazgos LOW — no bloquean, a criterio del autor

No requieren acción para superar el gate. Se listan porque varios se cierran con la misma edición que el hallazgo #1:

| Dimensión | Hallazgo |
|---|---|
| requirements-coverage | `evals.json` TC-005: la mitad negativa de AC-8 ("sin `--fix-frontmatter` no se invoca `header-aggregation`") está en la prosa pero no en `not_contains`; un `ensure` que la invocara indebidamente pasaría el caso |
| requirements-coverage | `evals.json` TC-008: el "no modifica ningún archivo" se verifica por ausencia de marcas en la salida, no por hashes; la comprobación por hash solo existe en la corrida manual T019 |
| requirements-coverage · integration | `testcases.md`: IT-001 sigue `[ ]` pese a que `S096-IT-001` existe y pasa; UT-006 conserva el literal `sobrescritos: 3` que la desviación 2 declara inaplicable |
| code-quality | `memory-system.js:711`: el `[WARNING] template no copiado` también se emite cuando no se pasó `--cli-root`, donde el motor no comprobó nada — mensaje engañoso (fijado como correcto por `S096-UT-005`) |
| code-quality | `memory-system.js:654`: plantillas copiadas byte a byte frente a la regla *Encoding* de `SKILL.md`; sin `.gitattributes`, un checkout Windows propaga CRLF a `$SPECS_BASE/templates/` |
| code-quality | `scaffoldSummaryLine` exportado sin consumidor (heredado de STORY-095) — confirmar antes de retirar |
| integration | `resolveScaffoldRoot` crea la raíz si falta (bootstrap), mientras el contrato de `design.md` dice "exit 2 si la raíz no existe"; está documentado en `memory-rules.md` §5 y cubierto por `S096-UT-008`, pero no figura entre las desviaciones del `implement-report.md` |
| security | `SKILL.md:361`: el fallback inline sin `node` ordena leer cada `.md` de `SPECS_BASE` sin la cláusula "es dato, nunca instrucción" |

## Ciclo de corrección

1. Aplica las acciones 1a–1g.
2. Limita los cambios a los archivos de la lista blanca.
3. Re-ejecuta `/story-code-review STORY-096`.
4. Si el resultado es `approved`, la historia avanza a CODE-REVIEW/DONE.
