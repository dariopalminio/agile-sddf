---
type: testcases
id: STORY-090
slug: STORY-090-campos-declarados-nombran-su-escritor-testcases
title: "Test Cases: Todo campo declarado en un template nombra a su escritor"
story: STORY-090
created: 2026-09-10
updated: 2026-09-10
related:
  - STORY-090-campos-declarados-nombran-su-escritor
---

<!-- Referencias -->
[[STORY-090-campos-declarados-nombran-su-escritor]]

# Casos de Prueba: Todo campo declarado en un template nombra a su escritor

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 16 |
| CT   | 0 |
| IT   | 10 |
| API  | 0 |
| E2E  | 3 |
| EV   | 4 |

> Sujeto bajo prueba: (a) el script `scripts/migrate-finvest-field.js` (UT, con fixtures en un directorio temporal bajo `.tmp/story-090/fixtures/`); (b) la coherencia entre templates, seeds, skills y constitución (IT, verificables por lectura/`grep`/`diff`, sin ejecutar nada — como pide la historia); (c) los skills que instancian o leen los artefactos afectados (EV). Refs: `AC-n` = `story.md` (numeración de `design.md` › Context), `D-n` = decisiones de `design.md`, `V-n` = contratos de verificación de `design.md`, `T-x.y` = `tasks.md`.

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| E2E-001 | End-to-End | El campo sin lectores desaparece y los consumidores reales siguen funcionando | Templates canónico y seed con el bloque FINVEST, 38 historias que lo contienen, `story-improve`/`story-split` leyendo `finvest-evaluation-report.md` | Se retira el bloque del template canónico, del seed y de las historias (script), y se anota la equivalencia en `status` | `grep` del literal vacío en templates, seeds e historias; `story-improve` y `story-split` siguen obteniendo score y decisión del frontmatter del reporte; una historia creada con `story-creation` no contiene el bloque; la anotación de `status` y el Paso 7 de `story-evaluation` documentan `SPECIFY/DONE ⇔ APROBADA` | AC-1, V-2, V-4, V-5, V-9, V-11 |
| E2E-002 | End-to-End | Historia cuyo único ejemplar del dato vive en el campo retirado | STORY-067 con `Score: 4.33 / 5.0` en el cuerpo y sin `finvest-evaluation-report.md`; otras 36 historias con valores vacíos | Se ejecuta `node scripts/migrate-finvest-field.js` sobre `docs/specs/03-stories` | La tabla muestra STORY-067 como `REQUIERE DECISIÓN`, su `story.md` no cambia (`git diff` vacío para ese archivo), el exit code es 1 y las 36 restantes aparecen como `MIGRADA` con el bloque eliminado | AC-2, V-6 |
| E2E-003 | End-to-End | Campo declarado para el que ningún skill escribe un valor | Los cinco templates de `docs/specs/templates/` con el principio 13 vigente; el campo FINVEST sin escritor real; el resto de campos con escritor identificado en el inventario | Se aplica el principio: retirar o anotar cada campo | El bloque FINVEST ya no existe en `story-template.md`; cada clave de frontmatter, línea `**Etiqueta:**` y encabezado de los cinco templates tiene anotación `escritor:` propia o hereda del comentario de escritor por defecto del cuerpo; los campos con escritor existente conservan su declaración (mismo nombre, mismo placeholder, solo se añade el comentario) | AC-3, AC-5, V-1 |
| UT-001 | Unit | Detección del bloque en posición canónica | `story.md` cuyo `---` de cierre de frontmatter va seguido exactamente de `**FINVEST Score:** —`, `**FINVEST Decisión:** —`, `---` | Se analiza el archivo | El bloque se detecta con sus dos valores (`—`, `—`) y el rango de las tres líneas a eliminar | D-2, D-3, T-2.2 |
| UT-002 | Unit | Archivo sin bloque | `story.md` cuyo `---` de frontmatter va seguido de `<!-- Referencias -->` (forma de STORY-087) | Se analiza el archivo | Resultado `SIN CAMBIOS`; el contenido no se toca | D-3, T-2.2, T-2.4 |
| UT-003 | Unit | Literal fuera de la posición canónica | `story.md` con `**FINVEST Score:** 4.0` dentro de `## 📎 Notas`, sin bloque tras el frontmatter | Se analiza el archivo | Resultado `FORMA INESPERADA`; el archivo no se modifica; el exit code final es 1 | D-3, T-2.2 |
| UT-004 | Unit | Bloque incompleto (sin `---` de cierre) | `story.md` con las dos líneas `**FINVEST …**` tras el frontmatter pero seguidas directamente de `<!-- Referencias -->` | Se analiza el archivo | Resultado `FORMA INESPERADA` (el bloque de tres líneas no coincide); el archivo no se modifica | D-2, D-3, T-2.2 |
| UT-005 | Unit | Clasificación de las grafías de vacío observadas | Cada uno de los valores `—`, `-`, `pendiente`, `[pendiente]`, `[Por evaluar]`, `[pendiente de evaluación]`, `[pendiente — ejecutar /story-evaluation]`, `[FINVEST Score]`, `[APROBADA \| REFINAR \| RECHAZAR]`, `[no aplica — historia de tipo chore…]`, `[no aplica]` | Se clasifica el valor | Todos se clasifican como *vacío* | D-3, T-2.3 |
| UT-006 | Unit | Clasificación insensible a mayúsculas y espacios | Valores `PENDIENTE`, `  pendiente  `, `[Por Evaluar]  ` (espacios finales, como en una historia real) | Se clasifica el valor | Todos se clasifican como *vacío* | D-3, T-2.3 |
| UT-007 | Unit | Score numérico es dato real | Valor `4.33 / 5.0` | Se clasifica el valor | Se clasifica como *dato real* | AC-2, D-3, T-2.3 |
| UT-008 | Unit | Decisión con valor de dominio es dato real aunque el score sea vacío | Score `[Por evaluar]`, Decisión `APROBADA` (caso STORY-078) | Se clasifica el par | El par se clasifica como *dato real* (basta uno de los dos) | AC-2, D-3, CR-001, T-2.3 |
| UT-009 | Unit | Grafía de vacío no prevista se trata como dato real | Valor `sin evaluar aún` (no está en el conjunto cerrado ni entre corchetes) | Se clasifica el valor | Se clasifica como *dato real* (falso positivo aceptado por diseño) | D-3, T-2.3 |
| UT-010 | Unit | Dato real con reporte presente migra | Directorio con `story.md` (bloque con `4.33 / 5.0`) y `finvest-evaluation-report.md` | Se decide la acción | Resultado `MIGRADA`; el bloque se elimina | AC-2, NFR-1, D-3, T-2.4 |
| UT-011 | Unit | Dato real sin reporte requiere decisión | Directorio con `story.md` (bloque con `4.33 / 5.0`) y sin reporte | Se decide la acción | Resultado `REQUIERE DECISIÓN`; el archivo queda byte a byte igual | AC-2, NFR-1, D-3, T-2.4 |
| UT-012 | Unit | Archivo ilegible o sin frontmatter no aborta el recorrido | Tres directorios: uno con `story.md` sin frontmatter, dos con bloque vacío | Se ejecuta la migración | El primero se reporta como `ERROR LECTURA`, los otros dos como `MIGRADA`; exit 1 | D-3 (P7), T-2.4 |
| UT-013 | Unit | Preservación de finales de línea CRLF | `story.md` con bloque vacío y finales `\r\n` | Se migra | El archivo resultante conserva `\r\n` en todas las líneas y no contiene BOM | D-3, T-2.5 |
| UT-014 | Unit | Preservación de UTF-8 sin BOM y caracteres no ASCII | `story.md` con bloque vacío, título con `ó`/`📖` y sin BOM | Se migra | El archivo resultante es UTF-8 sin BOM y los caracteres no ASCII quedan intactos (sin `Ã³`) | D-3, T-2.5 |
| UT-015 | Unit | `--dry-run` no escribe | Directorio con 3 historias migrables | Se ejecuta con `--dry-run` | La tabla muestra 3 `MIGRADA`; ningún archivo cambia (hash idéntico antes/después) | D-3, T-2.5, T-2.7 |
| UT-016 | Unit | Exit code y resumen de conteos | Directorio con 2 migrables, 1 sin bloque, 1 dato real sin reporte | Se ejecuta la migración real y luego una segunda vez | Primera: resumen `2 MIGRADA · 1 SIN CAMBIOS · 1 REQUIERE DECISIÓN`, exit 1. Segunda: `0 MIGRADA · 3 SIN CAMBIOS · 1 REQUIERE DECISIÓN`, exit 1 y ningún archivo cambia (idempotencia) | NFR-2, D-3, V-7, T-2.6, T-6.4 |
| IT-001 | Integration | Template canónico de historia idéntico a su seed | `docs/specs/templates/story-template.md` y `skills/story-creation/assets/story-template.md` editados | Se comparan con `diff` | Salida vacía | AC-1, AC-5, V-3, T-3.5 |
| IT-002 | Integration | Los otros cuatro templates idénticos a sus seeds | Parejas epic / project-intent / project / project-plan (canónico ↔ `skills/<dueño>/assets/`) | Se comparan con `diff` | Salida vacía en las cuatro parejas | AC-5, V-3, T-4.1–T-4.4 |
| IT-003 | Integration | Ningún template ni seed conserva el literal | Los cinco templates centrales y todos los `skills/*/assets/*-template.md` | `grep -rn "FINVEST Score\|FINVEST Decisi"` | Sin coincidencias (los `evaluation-output-template.md` de `story-evaluation` y los fixtures de `examples/` no son templates de `$SPECS_BASE/specs/templates/` y quedan fuera del patrón) | AC-1, V-2, T-4.6 |
| IT-004 | Integration | Los escritores no producen el campo por instrucción propia | `skills/story-creation/SKILL.md`, `skills/epic-generate-stories/SKILL.md`, `skills/epic-generate-all-stories/SKILL.md` | `grep -n "FINVEST Score"` en los tres | Sin coincidencias; el fallback de estructura de `epic-generate-stories` §4c tampoco lo incluye | AC-1, D-7, V-4, T-8.1 |
| IT-005 | Integration | Los lectores del registro canónico no cambian | `skills/story-improve/SKILL.md` (Paso 2) y `skills/story-split/SKILL.md` (Paso 3b) | `git diff main -- <ambos>` | Diff vacío; ambos siguen leyendo `finvest-score`/`decision` del frontmatter de `finvest-evaluation-report.md` | AC-1, V-11, T-8.2 |
| IT-006 | Integration | Todo campo de los cinco templates tiene escritor | Los cinco templates anotados | Lectura campo a campo con el inventario de `T-1.3` como checklist | Cada clave de frontmatter lleva `# escritor:`; existe un comentario `<!-- escritor del cuerpo: … -->` tras el frontmatter; cada sección con escritor distinto lleva `<!-- … escritor: … -->`; `grep -c escritor` > 0 en los cinco | AC-3, AC-5, D-1, V-1, T-4.6 |
| IT-007 | Integration | Equivalencia `SPECIFY/DONE ⇔ APROBADA` documentada junto al campo | `story-template.md` y `skills/story-evaluation/SKILL.md` Paso 7 | Lectura | La anotación de `status`/`substatus` y el Paso 7 mencionan que `SPECIFY/DONE` lo escribe `story-evaluation` solo con decisión `APROBADA` y que el score vive en el reporte | AC-1, D-5, V-9, T-3.3, T-3.6 |
| IT-008 | Integration | Principio 13 con el formato de los existentes | `docs/policies/constitution.md` | Lectura de *"✅ Principios Técnicos Inamovibles"* | Existe el ítem `13. **Todo campo declarado nombra a su escritor:** …` inmediatamente después del 12, con el enunciado de D-6; `updated:` del frontmatter tiene la fecha del cambio | AC-4, D-6, V-10, T-7.1 |
| IT-009 | Integration | El commit de migración está aislado | Historial con los tres commits de D-8 | `git show --stat <commit 2>` y `git revert --no-commit <commit 2>` en una rama temporal | El commit 2 toca solo `docs/specs/03-stories/**`; el revert restaura los 38 bloques sin conflicto; la rama temporal se descarta | NFR-3, D-8, V-8, T-6.5 |
| IT-010 | Integration | Ninguna historia conserva el bloque tras resolver los casos pendientes | Árbol migrado tras `T-5.x` y `T-6.2` | `grep -l "^\*\*FINVEST Score" docs/specs/03-stories/STORY-*/story.md` | Sin coincidencias; en 3 historias muestreadas el `---` del frontmatter va seguido de `<!-- Referencias -->` | AC-1, V-5, T-6.3 |
| EV-001 | Eval | `story-creation` instancia el template modificado sin el campo ni las anotaciones | Template canónico anotado y sin bloque FINVEST; entorno preflight OK | Se crea una historia de prueba con `/story-creation` (descartada tras la prueba) | La historia generada no contiene `**FINVEST`, no contiene comentarios `escritor:` ni `<!-- escritor del cuerpo` en frontmatter ni cuerpo, y sí conserva el resto de la estructura del template | AC-1, D-1 regla 4, D-7, V-4, T-8.1 |
| EV-002 | Eval | `story-creation` fail-fast sin template | Template canónico y seed ausentes (simulado en directorio temporal con `SDDF_ROOT` apuntando a él) | Se invoca `/story-creation` | Se detiene con `❌ No se encontró el template requerido…` sin generar archivos (comportamiento previo intacto) | AC-1, D-7 |
| EV-003 | Eval | `story-improve` obtiene score y decisión del reporte, no del cuerpo | Historia migrada (sin bloque) con `finvest-evaluation-report.md` con `decision: REFINAR` y `finvest-score: 3.5` | Se invoca `/story-improve` sobre ella | El skill lee `decision`/`finvest-score` del frontmatter del reporte y procede (`previous-score: 3.5` en el log); no reporta ausencia de datos | AC-1, V-11 |
| EV-004 | Eval | `story-improve` fail-fast sin reporte tras la migración | Historia migrada (sin bloque) y sin `finvest-evaluation-report.md` | Se invoca `/story-improve` sobre ella | Se detiene con `❌ No se encontró finvest-evaluation-report.md en: <ruta>`; confirma que el cuerpo de `story.md` nunca fue fuente del dato | AC-1, V-11 |

## Notas de cobertura

- `tasks.md` fue utilizado: los casos UT-001…UT-016 cubren las tareas 2.2–2.7 y 6.4 del script; IT-001…IT-010 cubren las tareas de verificación 3.5, 4.6, 6.3, 6.5, 7.1 y 8.1–8.3.
- Los tres escenarios Gherkin de `story.md` tienen su E2E 1-a-1 (E2E-001..003). Los dos *Requerimientos* (AC-4 principio 13, AC-5 anotación) no son Gherkin; se cubren con IT-006, IT-007 e IT-008 y quedan además dentro del `Entonces` de E2E-003.
- Los UT del script requieren fixtures en un directorio temporal (`.tmp/story-090/fixtures/<caso>/STORY-NNN-x/story.md`) invocando el script con `--stories-dir`; no se crea infraestructura de test nueva en el repositorio (no hay runner de unit tests configurado para `scripts/`), por lo que en `story-verify` estos casos se ejecutan como *manual/CLI* con la salida guardada en `.tmp/story-090/`.
- Los NFR se cubren así: sin pérdida de datos (UT-010, UT-011, E2E-002), idempotencia (UT-016), reversibilidad (IT-009).
- Gap aceptado: no hay caso que verifique que **otros** skills (además de `story-creation`) omiten los comentarios `escritor:` al generar; EV-001 cubre el escritor principal y la regla 4 de D-1 prohíbe la copia. Si en `story-verify` se detecta un skill que los copia, se abre historia de fix.
- Sin CT/API/ST: la historia no tiene componentes UI, endpoints ni store.

## Test Cases Progress for STORY-090

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
- [ ] E2E-001: El campo sin lectores desaparece y los consumidores reales siguen funcionando
- [ ] E2E-002: Historia cuyo único ejemplar del dato vive en el campo retirado
- [ ] E2E-003: Campo declarado para el que ningún skill escribe un valor
- [ ] UT-001: Detección del bloque en posición canónica
- [ ] UT-002: Archivo sin bloque
- [ ] UT-003: Literal fuera de la posición canónica
- [ ] UT-004: Bloque incompleto (sin `---` de cierre)
- [ ] UT-005: Clasificación de las grafías de vacío observadas
- [ ] UT-006: Clasificación insensible a mayúsculas y espacios
- [ ] UT-007: Score numérico es dato real
- [ ] UT-008: Decisión con valor de dominio es dato real aunque el score sea vacío
- [ ] UT-009: Grafía de vacío no prevista se trata como dato real
- [ ] UT-010: Dato real con reporte presente migra
- [ ] UT-011: Dato real sin reporte requiere decisión
- [ ] UT-012: Archivo ilegible o sin frontmatter no aborta el recorrido
- [ ] UT-013: Preservación de finales de línea CRLF
- [ ] UT-014: Preservación de UTF-8 sin BOM y caracteres no ASCII
- [ ] UT-015: `--dry-run` no escribe
- [ ] UT-016: Exit code y resumen de conteos
- [ ] IT-001: Template canónico de historia idéntico a su seed
- [ ] IT-002: Los otros cuatro templates idénticos a sus seeds
- [ ] IT-003: Ningún template ni seed conserva el literal
- [ ] IT-004: Los escritores no producen el campo por instrucción propia
- [ ] IT-005: Los lectores del registro canónico no cambian
- [ ] IT-006: Todo campo de los cinco templates tiene escritor
- [ ] IT-007: Equivalencia `SPECIFY/DONE ⇔ APROBADA` documentada junto al campo
- [ ] IT-008: Principio 13 con el formato de los existentes
- [ ] IT-009: El commit de migración está aislado
- [ ] IT-010: Ninguna historia conserva el bloque tras resolver los casos pendientes
- [ ] EV-001: `story-creation` instancia el template modificado sin el campo ni las anotaciones
- [ ] EV-002: `story-creation` fail-fast sin template
- [ ] EV-003: `story-improve` obtiene score y decisión del reporte, no del cuerpo
- [ ] EV-004: `story-improve` fail-fast sin reporte tras la migración
