---
alwaysApply: false
type: design
id: STORY-127
slug: STORY-127-integrar-adoptar-gateway-epica-design
title: "Design: Integrar y documentar el gateway de validación de épicas"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
story: STORY-127
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-127-integrar-adoptar-gateway-epica
  - EPIC-23-completar-flujo-de-epic
  - STORY-124-validar-preparacion-estructural-epica
  - STORY-126-operar-validacion-epica-segura
  - STORY-170-skill-epic-ship
---

<!-- Referencias -->
[[STORY-127-integrar-adoptar-gateway-epica]] · [[EPIC-23-completar-flujo-de-epic]] · [[STORY-124-validar-preparacion-estructural-epica]] · [[STORY-126-operar-validacion-epica-segura]] · [[STORY-170-skill-epic-ship]]

## Context

`/epic-validate` es el skill que emite el veredicto de una épica en `<EPIC_DIR>/epic-validate-report.md`. Lo crean STORY-124, STORY-125, STORY-126, STORY-137 y STORY-169. Esta historia **no** agrega comprobaciones. Su trabajo es convertir el veredicto en la precondición documentada de una transición de estado y asegurar que el skill se distribuye a todos los runtimes soportados (CS-8).

Estado verificado en el filesystem (2026-10-29):

- **Skill:** `skills/epic-validate/` todavía no existe (`ls skills/`). STORY-124 crea `SKILL.md`, el template seed y los evals (todo su diseño está en `READY-FOR-IMPLEMENT/DONE`). AC-3 depende solo de `skills/epic-validate/SKILL.md` (nota de la historia).
- **Contrato del reporte:** `verdict` en el frontmatter (`APPROVED` · `NEEDS-CHANGES` · `BLOCKED`, `docs/policies/validation-contract-policy.md` §4, fila `epic-validate` reservada) y `## Veredicto` como primera sección. G-06 establece que solo `APPROVED` habilita el avance y que un valor ausente o no permitido cuenta como no aprobado.
- **Resultado de ejecución:** STORY-126 cierra toda ejecución con `RESULTADO: ÉXITO | FALLO | SIMULACIÓN` y fija `ÉXITO ⇔ reporte escrito con verdict: APPROVED`. Con `--dry-run` (`SIMULACIÓN`) no se escribe el reporte.
- **Transiciones de épica:** `docs/architecture/state-machine.md` («Nivel ÉPICA») no tiene escritor automático para `DEVELOP → VALIDATE`; el único gate documentado es `epic-format-validation` → `epic-generate-stories` (constitución, regla 15). `docs/domains/domain-epic-lifecycle.md` §6 admite `VALIDATE` con `substatus: IN-PROGRESS`.
- **Guía del pipeline:** `docs/guides/sddf-commands-pipeline.md` §2 documenta `epic-from-project-plan → epic-generate-stories → epic-analyze` y no menciona `epic-validate`.
- **Empaquetado:** `package.json › files` ya contiene `"skills/"`, que incluye cualquier `skills/<skill>/`. No existe `.npmignore`.
- **Instalación:** `scripts/install.js` copia todo `skills/` al destino de cada runtime. La estrategia `full` (por defecto) instala el catálogo completo y `story` excluye el prefijo `epic-`. Los runtimes vienen solo de `config/runtimes.json`; hoy hay cuatro con `support: supported`.
- **Cobertura existente (P3):** `test/install.test.js` («installSDDF copia el inventario fuente al destino canónico de cada runtime») compara el inventario de `skills/` con cada destino soportado. `scripts/smoke-package-install.js` (dentro de `npm run verify:repository`) compara el árbol `skills/` **del tarball** con cada destino. Ninguno detecta que el tarball omita un skill, porque comparan el paquete consigo mismo instalado. Tampoco nombran `epic-validate`.
- **Gate análogo existente (P3):** STORY-170 (`epic-ship`) ya diseña la lectura de `verdict` del mismo reporte como gate (`APPROVED` continúa y cualquier otro valor o ausencia rechaza, remitiendo a `/epic-validate <EPIC_ID>`). Esta historia reutiliza esa regla de lectura y su mensaje.

## Goals / Non-Goals

**Goals:**
- Documentar una única regla de gateway: `/epic-validate <EPIC-ID>` es la precondición de `DEVELOP → VALIDATE` y solo un `verdict: APPROVED` del reporte vigente permite el cambio de status // satisface: AC-1, CNF-1
- Hacer que la regla falle cerrada: `BLOCKED`, `NEEDS-CHANGES`, un reporte ausente o un `verdict` ilegible impiden la transición, dejan la épica en `DEVELOP` y remiten a `## Veredicto` // satisface: AC-2
- Conservar `epic-validate-report.md` en `<EPIC_DIR>` como evidencia del veredicto // satisface: AC-1
- Nombrar el gateway con el mismo texto canónico en la guía del pipeline y en `state-machine.md`, y proteger esa coincidencia con una prueba // satisface: CNF-1
- Garantizar con una prueba nombrada que `skills/epic-validate/` está cubierto por `package.json › files` y llega con su `SKILL.md` al destino de cada runtime soportado // satisface: AC-3, CNF-2, CS-8
- Mantener `npm run verify:repository` y `npm test` en verde // satisface: CS-21

**Non-Goals:**
- Comprobaciones, veredicto, modos o bloque `RESULTADO` de `epic-validate` (STORY-124, STORY-125, STORY-126, STORY-137, STORY-169).
- Un skill o script que escriba `status: VALIDATE`: la transición sigue siendo manual (fuera de alcance de la historia).
- Otras transiciones de épica, `docs/domains/domain-epic-lifecycle.md` y `validation-contract-policy` (STORY-166, STORY-170, STORY-171, CS-20).
- Evals de `epic-validate` (STORY-128).
- Editar `.claude/`, `.opencode/`, `.github/` o `.agents/` del repositorio, porque son salida de `agile-sddf install` (CNF-2, `AGENTS.md`).

## Decisions

### Componentes

| # | Componente | Acción | Ubicación | Responsabilidad única | AC que satisface |
|---|---|---|---|---|---|
| C1 | Sección «Gateway de validación de épicas» | crear (sección) | `docs/guides/sddf-commands-pipeline.md`, al final de §2 (antes del `---` que abre §3) | Describir para el mantenedor el procedimiento de la transición `DEVELOP → VALIDATE` y la tabla de decisión por estado del reporte | AC-1, AC-2, CNF-1 |
| C2 | Línea de gateway del nivel ÉPICA | modificar | `docs/architecture/state-machine.md`, sección «Nivel ÉPICA», justo después de la línea «Gate de calidad: `epic-format-validation` …» | Declarar en la fuente canónica de transiciones que `/epic-validate <EPIC-ID>` es precondición de `DEVELOP → VALIDATE` y remitir a C1 | AC-1, AC-2, CNF-1 |
| C3 | Prueba de consistencia del gateway | crear | `test/epic-validate-gateway.test.js` | Afirmar que C1 y C2 contienen la línea canónica con el mismo punto de entrada y la misma transición | CNF-1 |
| C4 | Prueba de distribución de `epic-validate` | modificar (agregar un `test`) | `test/install.test.js` | Afirmar que una entrada de `package.json › files` cubre `skills/epic-validate/` y que `installSDDF` deja `skills/epic-validate/SKILL.md` en el destino de cada runtime soportado, idéntico a la fuente | AC-3, CNF-2, CS-8 |

No se modifican `package.json`, `config/runtimes.json`, `scripts/install.js` ni `scripts/smoke-package-install.js`, porque ya cumplen AC-3 (D-3, D-4). Tampoco `skills/epic-validate/SKILL.md`: el gateway es una regla del proceso, no un paso del skill (D-1).

### Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Línea canónica del gateway (C1 y C2) | Una línea que empieza con `**Gateway de validación de épicas:**` y contiene, en este orden, `` `/epic-validate <EPIC-ID>` `` y `` `DEVELOP → VALIDATE` `` (flecha U+2192, como en el resto de ambos documentos). Aparece **una sola vez** en cada documento. Es lo único que C3 lee | AC-1, CNF-1 |
| Procedimiento del mantenedor (C1) | 1. La épica está en `status: DEVELOP`. 2. Ejecutar `/epic-validate <EPIC-ID>` **sin** `--dry-run` (una `SIMULACIÓN` no escribe el reporte y no cuenta). 3. Leer **solo** el campo `verdict` del frontmatter de `<EPIC_DIR>/epic-validate-report.md` (G-06). 4. Aplicar la tabla de decisión. 5. No mover, renombrar ni borrar el reporte | AC-1, AC-2 |
| Escritura permitida tras `APPROVED` (C1) | En `epic.md`: `status: VALIDATE`, `substatus: IN-PROGRESS`, `updated: <hoy>`. Ningún otro campo ni archivo cambia | AC-1 |
| Mensaje de remisión (C1) | Ante un resultado bloqueado, la guía indica: «La épica sigue en `DEVELOP`: revisa `## Veredicto` de `<EPIC_DIR>/epic-validate-report.md`, corrige los hallazgos y vuelve a ejecutar `/epic-validate <EPIC-ID>`». Con el reporte ausente, solo la última parte | AC-2 |
| Encabezado de C1 | `### Gateway de validación de épicas` (sin la transición, para que el ancla no cambie si se resuelve CR-001) | CNF-1 |
| Remisión desde C2 | La línea canónica de `state-machine.md` termina con el enlace relativo `[procedimiento](../guides/sddf-commands-pipeline.md#gateway-de-validación-de-épicas)`, que `npm run verify:links` valida con el algoritmo de anclas de GitHub de `scripts/check-doc-links.js` | CNF-1 |
| Prueba C3 | Lee ambos documentos desde `REPO_ROOT`, extrae la línea que empieza con el prefijo canónico, exige exactamente una por documento y compara el punto de entrada y la transición. Las constantes `ENTRY = '/epic-validate <EPIC-ID>'` y `TRANSITION = 'DEVELOP → VALIDATE'` aparecen una sola vez en el archivo | CNF-1 |
| Prueba C4 | Nombre: `epic-validate se empaqueta y se instala con su SKILL.md en cada runtime soportado (STORY-127 AC-3, CS-8)`. Reutiliza `RUNTIMES`, `createFixture`, `withInitCwd`, `withoutInstallLogs` y `destination` de `test/install.test.js`. Una entrada de `files` cubre la ruta si, normalizada sin `/` final, es `skills` o `skills/epic-validate` | AC-3, CNF-2, CS-8 |

### Esquema de datos

**Tabla de decisión del gateway** (contenido de C1) // satisface: AC-1, AC-2

| Estado de `<EPIC_DIR>/epic-validate-report.md` | Transición | `status` de la épica | Qué hace el mantenedor |
|---|---|---|---|
| `verdict: APPROVED` | permitida | pasa a `VALIDATE` (`substatus: IN-PROGRESS`) | Cambia el frontmatter de `epic.md` y conserva el reporte como evidencia |
| `verdict: NEEDS-CHANGES` | impedida | permanece en `DEVELOP` | Revisa los motivos de `## Veredicto`, corrige y vuelve a validar |
| `verdict: BLOCKED` | impedida | permanece en `DEVELOP` | Resuelve los bloqueos de `## Veredicto` y vuelve a validar |
| Reporte ausente | impedida | permanece en `DEVELOP` | Ejecuta `/epic-validate <EPIC-ID>` |
| Frontmatter ilegible, `verdict` ausente o valor fuera de los tres permitidos | impedida | permanece en `DEVELOP` | Vuelve a ejecutar `/epic-validate <EPIC-ID>` |

La guía explica que `RESULTADO: ÉXITO` del bloque final de `/epic-validate` (STORY-126) equivale a la primera fila. Aun así, la fuente de la decisión es el archivo, porque es la evidencia que permanece.

**Disponibilidad por runtime** (nota de C1) // satisface: AC-3, CNF-2

Una línea: el gateway está disponible en todo runtime de `config/runtimes.json` con `support: supported` tras `npx agile-sddf install --target <runtime>` con la estrategia `full` (por defecto); `--strategy story` excluye los skills `epic-*`. La guía no enumera los runtimes (`AGENTS.md`).

### Flujos clave

**F1 — Transición permitida** // satisface: AC-1
1. Épica `EPIC-NN` en `DEVELOP`. El mantenedor ejecuta `/epic-validate EPIC-NN`.
2. El reporte se escribe con `verdict: APPROVED` (el bloque final muestra `RESULTADO: ÉXITO`).
3. Siguiendo C1, el mantenedor cambia `epic.md` a `VALIDATE/IN-PROGRESS` con `updated` de hoy.
4. `epic-validate-report.md` queda en `<EPIC_DIR>`.

**F2 — Transición impedida** // satisface: AC-2
1. El reporte tiene `verdict: BLOCKED` (o `NEEDS-CHANGES`, o falta).
2. C1 indica «impedida». El mantenedor no edita `epic.md`, que sigue en `DEVELOP`, y abre `## Veredicto` para ver los motivos.
3. Tras corregir, vuelve al paso 1 de F1.

**F3 — Distribución** // satisface: AC-3, CNF-2
1. `npm pack` incluye `skills/epic-validate/**` porque `files` contiene `skills/`.
2. `npx agile-sddf install --target <runtime>` (estrategia `full`) copia `skills/epic-validate/` a `<destino>/<skillsDirectory>/epic-validate/`.
3. C4 lo comprueba en `npm test` para cada runtime soportado; `smoke-package-install.js` lo comprueba sobre el tarball real en `npm run verify:repository`.

**F4 — Deriva documental** // satisface: CNF-1
1. Alguien cambia la transición o el punto de entrada en solo uno de los dos documentos.
2. C3 falla en `npm test` con el documento y la línea divergente.

### Decisiones técnicas

| # | Decisión | Opción elegida | Alternativas rechazadas | Justificación | AC |
|---|---|---|---|---|---|
| D-1 | Mecanismo del gateway | Precondición documentada que aplica el mantenedor, igual que `epic-format-validation` → `epic-generate-stories` | (a) Un skill o script que escriba `status: VALIDATE` tras leer el veredicto; (b) que `epic-validate` cambie el status | (a) Está fuera de alcance de la historia. (b) Viola CS-7: `epic-validate` solo escribe su reporte | AC-1, AC-2 |
| D-2 | Fuente de la decisión | Solo `verdict` del frontmatter del reporte (G-06) | (a) La línea `RESULTADO:` de la consola; (b) la línea `**Veredicto:**` del cuerpo | (a) No persiste y no sirve de evidencia (AC-1, segunda línea del Entonces). (b) G-06 prohíbe inferir el valor del cuerpo. Es la misma regla que STORY-170 y `story-plan` | AC-1, AC-2 |
| D-3 | Cumplimiento de CS-8 | Conservar `"skills/"` en `files` y probar que cubre `skills/epic-validate/` | (a) Agregar `"skills/epic-validate/"` explícito; (b) reemplazar `"skills/"` por una lista de skills | (a) Es redundante: npm ya incluye la ruta y una entrada duplicada no cambia el tarball. (b) Exige editar `files` con cada skill nuevo y arriesga omisiones. La prueba C4 hace verificable el criterio sin cambiar el paquete (CR-003) | AC-3, CS-8 |
| D-4 | Verificación de la instalación | Un `test` nombrado en `test/install.test.js` con las utilidades del archivo | (a) Confiar en la prueba genérica de inventario; (b) archivo de prueba nuevo con utilidades copiadas; (c) `npm pack` dentro de `npm test` | (a) No nombra `epic-validate` ni AC-3, y pasa si el skill falta en la fuente. (b) Duplica `withInitCwd` y `withoutInstallLogs` (P3). (c) La prueba de humo `smoke-package-install.js` ya empaqueta en `verify:repository`; repetirlo en las pruebas unitarias las hace lentas | AC-3 |
| D-5 | Garantía de CNF-1 | Línea canónica única por documento más una prueba que las compara | (a) Solo revisión manual; (b) generar un documento desde el otro | (a) No detecta deriva, y CR-001 ya anticipa un cambio de transición que hay que aplicar en ambos documentos. (b) Requiere un generador para dos líneas (P12) | CNF-1 |
| D-6 | Dónde vive el procedimiento completo | En la guía del pipeline (C1). `state-machine.md` solo lleva la línea canónica y el enlace | Duplicar la tabla de decisión en ambos | Una sola fuente del detalle evita que se contradigan. `state-machine.md` es el índice de transiciones, no un manual (P11) | AC-1, AC-2, CNF-1 |
| D-7 | Qué significa «veredicto vigente» | El reporte que deja en `<EPIC_DIR>` la última ejecución de `/epic-validate` sin `--dry-run`, que el procedimiento manda a ejecutar inmediatamente antes de transicionar | (a) Comparar el `updated` del reporte con el de las historias o con `epic.md`; (b) un vencimiento por tiempo | (a) y (b) son mecanismos que nadie ejecuta en una transición manual (P12). Como el procedimiento exige validar justo antes, «vigente» se cumple por construcción. El reporte se sobrescribe por completo en cada ejecución (STORY-124 D-9) | AC-1 |
| D-8 | Valores que impiden la transición | Todo lo que no sea `APPROVED`, incluido `NEEDS-CHANGES` | Enumerar solo `BLOCKED` (texto literal de AC-2) | El contrato vigente del reporte admite `NEEDS-CHANGES` (política §4, nota del PO en EPIC-23). G-06 obliga a fallar cerrado. AC-2 queda cubierto como un caso de la regla (CR-002) | AC-2 |
| D-9 | `substatus` al entrar en `VALIDATE` | `IN-PROGRESS` | `DONE` o conservar el anterior | `domain-epic-lifecycle` §6 define `IN-PROGRESS` como el subestado de trabajo activo en `VALIDATE`. Con `DONE`, la fase VALIDATE se daría por terminada al entrar | AC-1 |

### Decisiones de complejidad justificada

- **Prueba de consistencia documental (C3):** se justifica por CNF-1 y por CR-001. Si la transición se reubica, el cambio debe aplicarse en dos documentos a la vez, y la prueba hace visible cualquier olvido. Lee una sola línea por documento, no el texto completo, para no fallar con cambios de redacción.
- **Sin cambios en `package.json` ni en el instalador:** el código actual ya cumple AC-3. Lo único que faltaba era una prueba que lo afirmara de forma trazable.
- **Tabla de decisión de cinco filas en vez de una regla en prosa:** cubre explícitamente los casos «ausente» e «ilegible», que la historia exige (nota «Regla») y que una frase sobre `APPROVED` deja implícitos.

### Puntos de variación (P6)

- **Transición del gateway:** está en la línea canónica (C1 y C2), en la tabla de decisión de C1 y en la constante `TRANSITION` de C3. El encabezado de C1 no la nombra, así que el ancla de C2 es estable. Reubicarla (CR-001) es un cambio de texto en esos lugares, y C3 falla si falta alguno.
- **Vocabulario del veredicto:** si la política agrega valores, la regla no cambia, porque solo `APPROVED` habilita.
- **Runtimes nuevos:** C4 itera sobre `config/runtimes.json` con `support: supported`, así que un runtime nuevo queda cubierto sin tocar la prueba.
- **Automatización futura de la transición:** si un skill llega a escribir `VALIDATE`, aplica la misma tabla de decisión como paso previo, como hace `epic-ship` en su gate (STORY-170).

### Degradación gradual (P7)

| Fallo | Comportamiento |
|---|---|
| `/epic-validate` no está instalado en el runtime (por ejemplo, con `--strategy story`) | No hay reporte, así que la transición queda impedida (fila «ausente»). La nota de disponibilidad de C1 indica reinstalar con la estrategia `full` |
| `/epic-validate` se interrumpe antes de escribir | El reporte previo, si existe, conserva el veredicto anterior. El procedimiento exige una ejecución completa justo antes, y si no la hubo no se transiciona |
| `skills/epic-validate/SKILL.md` aún no existe (STORY-124 sin entregar) | C4 falla con el mensaje `skills/epic-validate/SKILL.md no existe en la fuente`, que señala la dependencia en lugar de un falso verde |
| Uno de los dos documentos pierde la línea canónica | C3 falla nombrando el documento y la cantidad de líneas encontradas (0 o más de 1) |

### Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | La guía tiene la sección C1 con la línea canónica, el procedimiento y la tabla de decisión, y en la fila `APPROVED` se permite el paso a `VALIDATE` y se conserva el reporte | Revisión documental y C3 | AC-1 |
| 2 | Con un reporte de prueba `verdict: APPROVED` en una épica temporal en `DEVELOP` (fuera de `specs/flow/`), seguir C1 lleva a `VALIDATE/IN-PROGRESS` y el reporte permanece | Recorrido manual con fixture (nota «Desarrollo independiente») | AC-1 |
| 3 | Con `verdict: BLOCKED`, `NEEDS-CHANGES` o sin reporte, C1 impide la transición, remite a `## Veredicto` y la épica sigue en `DEVELOP` | Recorrido manual con tres fixtures | AC-2 |
| 4 | `state-machine.md` («Nivel ÉPICA») y la guía contienen exactamente una línea canónica con el mismo punto de entrada y la misma transición | `node --test test/epic-validate-gateway.test.js` | CNF-1 |
| 5 | `files` cubre `skills/epic-validate/` y cada runtime soportado recibe `skills/epic-validate/SKILL.md`, idéntico a la fuente | `node --test test/install.test.js` (prueba C4) | AC-3, CS-8 |
| 6 | El tarball real contiene `skills/epic-validate/SKILL.md` | `npm pack --dry-run --json` y `smoke-package-install.js` dentro de `npm run verify:repository` | AC-3, CNF-2 |
| 7 | `npm run verify:repository` (incluye `verify:links` sobre el enlace de C2) y `npm test` pasan | Ejecución de ambos comandos | CS-21 |

## Risks / Trade-offs

- [La épica sitúa el gateway en `VALIDATE → SHIP` y la historia en `DEVELOP → VALIDATE` (CR-001)] → Implementar tal cual documenta una transición que la épica considera incorrecta. Mitigación: la transición es un único punto de variación protegido por C3. Conviene resolver CR-001 con `/story-refine` antes de `story-implement-tasks`.
- [STORY-124 no está entregada] → C4 y el contrato de verificación 6 no pasan hasta que exista `skills/epic-validate/SKILL.md`. Mitigación: implementar esta historia después de STORY-124. C1, C2 y C3 no dependen del skill.
- [Transición manual] → El mantenedor podría editar `epic.md` sin seguir la regla. Es un riesgo aceptado: la historia excluye automatizarla, y la regla queda en la fuente canónica de transiciones.
- [`domain-epic-lifecycle` §8 asigna a `DEVELOP → VALIDATE` el «Gate de completitud de historias»] → Dos documentos describirían gates distintos para la misma transición. Mitigación: C1 presenta el gateway como precondición adicional, no como reemplazo. Alinear el documento de dominio le corresponde a CS-20 (CR-001).

## Open Questions

Ninguna que bloquee el diseño. La ubicación de la transición queda registrada como CR-001.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: inviabilidad (inconsistencia con la épica)
- **Descripción**: `EPIC-23 › Notas › Alineación pendiente` establece que «STORY-127 sitúa el gateway en `DEVELOP → VALIDATE`; debe situarlo en `VALIDATE → SHIP`». El diagrama de referencia (`dec_dev -->|YES| epic-validate`, `dec_val -->|APPROVED| epic-ship`), el alcance de la épica («`APPROVED` (avanza a `SHIP`), `NEEDS-CHANGES` (vuelve a `DEVELOP`)») y `domain-epic-lifecycle` §8 (`DEVELOP → VALIDATE` = completitud de historias) coinciden con la épica. Además, STORY-170 (`epic-ship`) ya exige `verdict: APPROVED` antes de `SHIP`. Este diseño sigue los AC vigentes de la historia (`DEVELOP → VALIDATE`) y aísla la transición como punto de variación.
- **Documento afectado**: story.md (AC-1, AC-2, CNF-1, Quiero, Para, nota «Mecanismo de transición»), design.md
- **Acción requerida**: refinar la historia con `/story-refine STORY-127` para que use `VALIDATE → SHIP` (con `NEEDS-CHANGES` → vuelta a `DEVELOP`) **antes de implementar**, y regenerar este diseño. Con esa ubicación, C1 debe remitir al gate de `epic-ship` (STORY-170) en lugar de describir una edición manual de `status`.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: AC-2 y la nota «Contrato consumido» solo nombran `APPROVED` | `BLOCKED`. El contrato vigente (política §4 y decisión del PO del 2026-10-17 en EPIC-23) incluye `NEEDS-CHANGES`. El diseño impide la transición con cualquier valor distinto de `APPROVED` (D-8), así que AC-2 se cumple sin cambios.
- **Documento afectado**: story.md
- **Acción requerida**: al resolver CR-001, actualizar la nota «Contrato consumido» con los tres valores y agregar `NEEDS-CHANGES` al escenario de AC-2 (o a un Esquema del escenario).

### CR-003
- **Tipo**: reutilización
- **Descripción**: CS-8 y AC-3 dicen que `skills/epic-validate/` «figura en el arreglo `files`». La entrada existente `"skills/"` ya la incluye y no hace falta editar `package.json` (D-3). `AGENTS.md` («agrega su ruta al arreglo `files`») describe un paso que, con `"skills/"`, no requiere acción.
- **Documento afectado**: story.md (AC-3), epic.md (CS-8)
- **Acción requerida**: ninguna para implementar. Opcionalmente, reformular CS-8 como «el paquete publicado incluye `skills/epic-validate/`», que es lo que verifican C4 y el contrato de verificación 6.
