---
type: fix-directives
story: STORY-090
title: "Fix Directives: STORY-090"
review-status: needs-changes
date: 2026-09-11
max-severity: MEDIUM
based-on: code-review-report.md
---

# Fix Directives: STORY-090

## Resumen de bloqueantes

- **Story:** STORY-090 — Todo campo declarado en un template nombra a su escritor
- **Review status:** needs-changes
- **Severidad máxima:** MEDIUM
- **Total de hallazgos bloqueantes:** 5 (0 HIGH · 5 MEDIUM) — 2 de agentes + 3 de DoD CODE-REVIEW

> Los hallazgos #3, #4 y #5 son criterios DoD que se satisfacen automáticamente al resolver #1 y #2: no requieren trabajo propio.

## Instrucciones de corrección

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---------------|-----------|-----------|----------|-----------------|
| 1 | `docs/specs/03-stories/STORY-090-campos-declarados-nombran-su-escritor/evals/story-creation.evals.json:1` · `evals/story-improve.evals.json:1` | code-quality | MEDIUM | Los 6 casos `TC-NNN` no son alcanzables por el runner que declara `implement-report.md`. El modo `evals` de `skill-test-evals` resuelve `$CLI_ROOT/skills/{arg}/`, exige `SKILL.md` en esa ruta y un `evals/evals.json` con ese nombre exacto; estos archivos viven en el directorio de la historia y se llaman `<skill>.evals.json`. `/skill-test-evals evals story-creation` correría los casos preexistentes de `skills/story-creation/evals/evals.json` y devolvería verde sin probar nada de STORY-090. Agravante: los IDs `TC-001..TC-003` colisionan con los ya usados en ambos `evals.json` canónicos. Es la única cobertura automatizada de la historia y produce señal verde falsa en `story-verify` (constitución §3). | Fusionar los 6 casos en `skills/story-creation/evals/evals.json` y `skills/story-improve/evals/evals.json` renumerando los IDs para evitar la colisión (p. ej. desde `TC-004`); o, si se conserva el aislamiento por historia, corregir en `implement-report.md` la afirmación de que `story-verify` los ejecutará tal como están y documentar el comando real que los corre. |
| 2 | `scripts/migrate-finvest-field.js:121,128` | integration-architecture | MEDIUM | Desviación del contrato de interfaz "CLI de migración" (`design.md` › D3). D3 exige detectar **exactamente** las tres líneas inmediatamente después del `---` de cierre del frontmatter y reportar `FORMA INESPERADA` en cualquier otra forma. La implementación tolera (a) líneas en blanco entre el frontmatter y el bloque (l.121) y (b) bloque sin el `---` separador (l.128, `end++` condicional). La variante está en el docblock y en `implement-report.md` (caso STORY-080) pero **no se registró como CR en `design.md`** (solo existe CR-001, sobre otro tema), y contradice el caso especificado UT-004, que exige `FORMA INESPERADA` para "bloque incompleto (sin `---` de cierre)": con el código actual ese fixture devuelve `MIGRADA`. | Añadir `CR-002` en `design.md` ampliando el contrato de detección de D3 con la variante tolerada (y alinear de paso la fila "Salida" de D3 con `ERROR LECTURA` como causa de exit 1, y la fila "Entrada" con el caso directorio `STORY-*` sin `story.md`), y actualizar `UT-004` en `testcases.md` para reflejar el comportamiento acordado. Alternativa: restringir el script a la forma canónica y tratar STORY-080 como caso manual. |
| 3 | `docs/policies/dod-story.md:133` | DoD-CODE-REVIEW | MEDIUM | Los componentes respetan la arquitectura de `design.md` — no cumplido: el script amplía el contrato de D3 sin CR registrado (ver hallazgo #2). | Resolver el hallazgo #2; el criterio queda satisfecho con el `CR-002` en `design.md`. |
| 4 | `docs/policies/dod-story.md:134` | DoD-CODE-REVIEW | MEDIUM | Sin hallazgo bloqueante de severidad HIGH o MEDIUM — no cumplido: 2 hallazgos MEDIUM de agentes (#1, #2). | Resolver los hallazgos #1 y #2 y volver a ejecutar `/story-code-review STORY-090`. |
| 5 | `docs/policies/dod-story.md:138` | DoD-CODE-REVIEW | MEDIUM | Revisión de código aprobada (`review-status: approved` en `code-review-report.md`) — no cumplido: esta revisión cierra en `needs-changes`. | Resolver los hallazgos #1 y #2 y volver a ejecutar `/story-code-review STORY-090` hasta obtener `approved`. |

### Hallazgos no bloqueantes registrados (LOW — no requieren corrección para aprobar)

Consulta `code-review-report.md` para el detalle completo. Resumen de los más accionables:

- `scripts/migrate-finvest-field.js:231` — `process.exit()` inmediato tras ~90 `console.log` puede truncar stdout redirigido; usar `process.exitCode`.
- `scripts/migrate-finvest-field.js:190-195` — un fallo de **escritura** se reporta como `ERROR LECTURA`; separar los `try` o renombrar el estado.
- `scripts/migrate-finvest-field.js:178,102,194` — los mensajes de error filtran la ruta absoluta del host (la cabecera de l.211 sí usa `path.relative`).
- `docs/specs/templates/project-template.md:112` y su seed — `·` (U+00B7) espurio delante del heading `## 2.3.`; **preexistente** (commit `51bcb81`), pero en una línea editada por esta historia. Confirmar con el autor si se corrige como drive-by o se abre aparte; no eliminar en silencio.
- `docs/specs/03-stories/STORY-075-integrar-historia-modo-manual-dryrun/story.md.bak` — residuo de backup versionado que conserva el bloque FINVEST retirado; limpiar en tarea aparte.
- `implement-report.md:61` — el hash `acc7922` ya no existe en el historial (HEAD: `244550b`); actualizar la referencia y marcar `IT-009` como N/A por la desviación aceptada de NFR-3.
- `CHANGELOG.md` — falta la entrada de la historia (retiro del campo FINVEST, principio 13, `scripts/migrate-finvest-field.js`); el propio `implement-report.md` la declara pendiente.
- `testcases.md` › "Test Cases Progress" — las 33 entradas siguen en `[ ]` (ninguna en `[!]`); marcar en `story-verify` las que ya tienen evidencia.

## Lista blanca de archivos permitidos para modificar

Derivados de la columna `Archivo:Línea` de los hallazgos bloqueantes:

- `docs/specs/03-stories/STORY-090-campos-declarados-nombran-su-escritor/evals/story-creation.evals.json` — hallazgo #1
- `docs/specs/03-stories/STORY-090-campos-declarados-nombran-su-escritor/evals/story-improve.evals.json` — hallazgo #1
- `scripts/migrate-finvest-field.js` — hallazgo #2
- `docs/policies/dod-story.md` — hallazgos #3, #4, #5 · **solo lectura**: es el origen de los criterios, no el objeto de la corrección; no editar

Destino de las acciones requeridas (necesarios para aplicar los hallazgos #1 y #2):

- `docs/specs/03-stories/STORY-090-campos-declarados-nombran-su-escritor/design.md` — hallazgo #2 (registrar `CR-002`)
- `docs/specs/03-stories/STORY-090-campos-declarados-nombran-su-escritor/testcases.md` — hallazgo #2 (actualizar `UT-004`)
- `skills/story-creation/evals/evals.json` — hallazgo #1 (fusión con renumeración de IDs)
- `skills/story-improve/evals/evals.json` — hallazgo #1 (fusión con renumeración de IDs)
- `docs/specs/03-stories/STORY-090-campos-declarados-nombran-su-escritor/implement-report.md` — hallazgo #1 (alternativa: corregir el comando declarado)

No deben modificarse archivos fuera de esta lista sin previa aprobación.

## Ciclo de corrección

1. Aplica las correcciones indicadas en la tabla de instrucciones.
2. Limita los cambios a los archivos de la lista blanca.
3. Re-ejecuta `/story-code-review STORY-090`.
4. Si el resultado es `approved`, la historia avanza a READY-FOR-VERIFY.
