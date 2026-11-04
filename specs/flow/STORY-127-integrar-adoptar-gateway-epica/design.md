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
updated: 2026-10-30
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

`/epic-validate` es el skill que emite el veredicto de una épica en `<EPIC_DIR>/epic-validate-report.md`. Lo crean STORY-124, STORY-125, STORY-126, STORY-137 y STORY-169. Esta historia **no** agrega comprobaciones. Su trabajo es que el propio skill aplique el veredicto como gateway del `status` de la épica (decisión del PO, 2026-10-29), documentar esa regla y asegurar que el skill se distribuye a todos los runtimes soportados (CS-8).

Estado verificado en el filesystem (2026-10-29):

- **Skill:** `skills/epic-validate/` todavía no existe (`ls skills/`). STORY-124 crea `SKILL.md`, el template seed y los evals; STORY-126 agrega a `SKILL.md` la sección «Política de efectos» (su C3) y el bloque de resultado del Paso 6 «Salida» (su C7). El gateway se inserta entre la escritura del reporte y ese Paso 6.
- **Contrato del reporte:** `verdict` en el frontmatter (`APPROVED` · `NEEDS-CHANGES` · `BLOCKED`, `docs/policies/validation-contract-policy.md` §4, fila `epic-validate` reservada) y `## Veredicto` como primera sección. G-06 establece que solo `APPROVED` habilita el avance y que un valor ausente o no permitido cuenta como no aprobado.
- **Resultado de ejecución:** STORY-126 cierra toda ejecución con `RESULTADO: ÉXITO | FALLO | SIMULACIÓN` como últimas líneas, fija `ÉXITO ⇔ reporte escrito con verdict: APPROVED` y cuenta una escritura fallida como `FALLO`. Con `--dry-run` (`SIMULACIÓN`) no se escribe nada.
- **Política de efectos vigente:** STORY-126 (C3) declara que en ninguna ejecución el skill modifica `epic.md`. CS-7 de EPIC-23 ya admite la excepción del gateway (CR-004, resuelto); la política de STORY-126 todavía no (CR-005).
- **Estados de épica:** `docs/domains/domain-epic-lifecycle.md` §6 admite `DONE` en todo estado activo («el trabajo del estado ha terminado y la épica está lista para avanzar») y la invariante 4 devuelve la épica a `DEVELOP` cuando `VALIDATE` falla. `docs/domains/domain-state-management.md` §5.1 permite transiciones no terminales escritas por un skill sin confirmación; la invariante 6 solo reserva `SHIP` y `COMPLETED` de épica.
- **Transiciones documentadas:** `docs/architecture/state-machine.md` («Nivel ÉPICA») no nombra escritor para `VALIDATE`; el único gate documentado es `epic-format-validation` → `epic-generate-stories`. `docs/domains/domain-skills-map.md` (tabla `## Épica (L2)`) recibe en STORY-124 la fila de `epic-validate` con «Cambia estado: —».
- **Guía del pipeline:** `docs/guides/sddf-commands-pipeline.md` §2 documenta `epic-from-project-plan → epic-generate-stories → epic-analyze` y no menciona `epic-validate`.
- **Empaquetado:** `package.json › files` ya contiene `"skills/"`, que incluye cualquier `skills/<skill>/`. No existe `.npmignore`.
- **Instalación:** `scripts/install.js` copia todo `skills/` al destino de cada runtime. La estrategia `full` (por defecto) instala el catálogo completo y `story` excluye el prefijo `epic-`. Los runtimes vienen solo de `config/runtimes.json`; hoy hay cuatro con `support: supported`.
- **Cobertura existente (P3):** `test/install.test.js` («installSDDF copia el inventario fuente al destino canónico de cada runtime») y `scripts/smoke-package-install.js` comparan el paquete consigo mismo instalado; ninguno detecta que el tarball omita un skill ni nombra `epic-validate`.
- **Gate siguiente (P3):** STORY-170 (`epic-ship`) lee `verdict` del mismo reporte antes de `SHIP` (`APPROVED` continúa; otro valor o ausencia rechaza remitiendo a `/epic-validate <EPIC_ID>`). Todavía no exige `VALIDATE/DONE` (CR-006).

## Goals / Non-Goals

**Goals:**
- Que `/epic-validate`, tras escribir su reporte, cambie la épica de `VALIDATE/IN-PROGRESS` a `VALIDATE/DONE` cuando el `verdict` es `APPROVED`, conservando el reporte como evidencia // satisface: AC-1
- Que con `NEEDS-CHANGES` o `BLOCKED` devuelva la épica a `DEVELOP/IN-PROGRESS`, remita a `## Veredicto` y la épica no quede apta para `SHIP` // satisface: AC-2
- Que el gateway falle cerrado: sin reporte escrito en esta ejecución, con `--dry-run` o con la épica fuera de `VALIDATE`, `epic.md` no cambia // satisface: AC-1, AC-2
- Nombrar el gateway con el mismo texto canónico en `SKILL.md`, la guía del pipeline y `state-machine.md`, y proteger esa coincidencia con una prueba // satisface: CNF-1
- Garantizar con una prueba nombrada que `skills/epic-validate/` está cubierto por `package.json › files` y llega con su `SKILL.md` al destino de cada runtime soportado // satisface: AC-3, CNF-2, CS-8
- Mantener `npm run verify:repository` y `npm test` en verde // satisface: CS-21

**Non-Goals:**
- Comprobaciones, veredicto, modos o bloque `RESULTADO` de `epic-validate` (STORY-124, STORY-125, STORY-126, STORY-137, STORY-169).
- La transición `DEVELOP → VALIDATE` (gate de completitud de historias) y cualquier otra transición de épica.
- Que `epic-ship` exija `VALIDATE/DONE` (STORY-170), y los documentos de dominio `domain-epic-lifecycle`, `domain-state-management` y `validation-contract-policy` (STORY-166, STORY-170, STORY-175, CS-20).
- Evals de `epic-validate` (STORY-128).
- Editar `.claude/`, `.opencode/`, `.github/` o `.agents/` del repositorio, porque son salida de `agile-sddf install` (CNF-2, `AGENTS.md`).

## Decisions

### Componentes

| # | Componente | Acción | Ubicación | Responsabilidad única | AC que satisface |
|---|---|---|---|---|---|
| C1 | Sección «Gateway de validación de épicas» | crear (sección) | `docs/guides/sddf-commands-pipeline.md`, al final de §2 (antes del `---` que abre §3) | Explicar al usuario qué transición escribe `/epic-validate` según el veredicto y que solo `VALIDATE/DONE` habilita `SHIP` | AC-1, AC-2, AC-3, CNF-1, CNF-2 |
| C2 | Línea de gateway del nivel ÉPICA | modificar | `docs/architecture/state-machine.md`, sección «Nivel ÉPICA», justo después de la línea «Gate de calidad: `epic-format-validation` …» | Declarar en la fuente canónica de transiciones que `/epic-validate <EPIC-ID>` escribe la transición de `VALIDATE` y remitir a C1 | AC-1, AC-2, CNF-1 |
| C3 | Prueba de consistencia del gateway | crear | `test/epic-validate-gateway.test.js` | Afirmar que `SKILL.md`, C1 y C2 contienen la línea canónica con el mismo punto de entrada y las mismas transiciones | CNF-1 |
| C4 | Prueba de distribución de `epic-validate` | modificar (agregar un `test`) | `test/install.test.js` | Afirmar que una entrada de `package.json › files` cubre `skills/epic-validate/` y que `installSDDF` deja `skills/epic-validate/SKILL.md` en el destino de cada runtime soportado, idéntico a la fuente | AC-3, CNF-2, CS-8 |
| C5 | Paso «Gateway de transición» | crear (paso) | `skills/epic-validate/SKILL.md`, después del paso que escribe el reporte (STORY-124) y antes del Paso 6 «Salida» (STORY-126) | Leer el `verdict` del reporte recién escrito y escribir en `epic.md` la transición de la tabla de decisión | AC-1, AC-2, CNF-1 |
| C6 | Excepción del gateway en «Política de efectos» | modificar | `skills/epic-validate/SKILL.md`, sección «Política de efectos» (STORY-126 C3) | Autorizar, solo fuera de `--dry-run` y después de escribir el reporte, la escritura de `status`, `substatus` y `updated` de `epic.md` | AC-1, AC-2 |
| C7 | Fila de `epic-validate` en el mapa de skills | modificar | `docs/domains/domain-skills-map.md`, tabla `## Épica (L2)`, fila de `epic-validate` (STORY-124) | Declarar en «Escribe» y «Cambia estado» la escritura de `epic.md` y las dos transiciones | AC-1, AC-2 |

No se modifican `package.json`, `config/runtimes.json`, `scripts/install.js` ni `scripts/smoke-package-install.js`, porque ya cumplen AC-3 (D-3, D-4).

### Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Línea canónica del gateway (C5, C1 y C2) | Una línea que empieza con `**Gateway de validación de épicas:**` y contiene, en este orden, `` `/epic-validate <EPIC-ID>` ``, `` `VALIDATE/IN-PROGRESS → VALIDATE/DONE` `` y `` `VALIDATE → DEVELOP/IN-PROGRESS` `` (flecha U+2192). Texto de referencia: `**Gateway de validación de épicas:** `/epic-validate <EPIC-ID>` escribe `VALIDATE/IN-PROGRESS → VALIDATE/DONE` con `verdict: APPROVED` y `VALIDATE → DEVELOP/IN-PROGRESS` con cualquier otro veredicto; solo `VALIDATE/DONE` habilita `SHIP`.` Aparece **una sola vez** en cada documento. Es lo único que C3 lee | AC-1, AC-2, CNF-1 |
| Lectura del veredicto (C5) | Solo el campo `verdict` del frontmatter de `<EPIC_DIR>/epic-validate-report.md`, releído después de escribirlo en esta ejecución (G-06) | AC-1, AC-2 |
| Lectura del estado de la épica (C5) | Solo `status` y `substatus` del frontmatter de `<EPIC_DIR>/epic.md`. Frontmatter ilegible o `status` ausente → sin cambio (tabla de decisión) | AC-1, AC-2 |
| Escritura en `epic.md` (C5, C6) | Solo los campos `status`, `substatus` y `updated: <hoy>` del frontmatter. El cuerpo y el resto de los campos no cambian. Sin `.bak` (el historial lo conserva git) | AC-1, AC-2 |
| Línea `Gateway:` (C5) | Una línea inmediatamente antes del bloque `RESULTADO` de STORY-126, que sigue siendo lo último: `Gateway: <EPIC_ID> <origen> → <destino>` cuando se escribe, o `Gateway: sin cambio — <motivo>` cuando no. Con `NEEDS-CHANGES` o `BLOCKED` agrega `Revisa ## Veredicto de <ruta del reporte>, corrige los hallazgos y vuelve a ejecutar /epic-validate <EPIC_ID>` | AC-1, AC-2 |
| Fallo al escribir `epic.md` (C5) | El reporte queda escrito; la línea es `Gateway: ❌ no se pudo escribir epic.md: <motivo>` y el bloque termina con `RESULTADO: FALLO` y `MOTIVO:`, como cualquier escritura fallida de STORY-126 | AC-1, AC-2 |
| Encabezado de C1 | `### Gateway de validación de épicas` (sin las transiciones, para que el ancla de C2 sea estable) | CNF-1 |
| Remisión desde C2 | La línea canónica de `state-machine.md` termina con el enlace relativo `[detalle](../guides/sddf-commands-pipeline.md#gateway-de-validación-de-épicas)`. `npm run verify:links` no lo valida: `scripts/check-doc-links.js` no recorre `docs/architecture/` (`ACTIVE_ROOTS`) y quita los diacríticos del encabezado, pero no los del fragmento. La coincidencia del fragmento con el ancla de GitHub del encabezado de C1 se comprueba en la revisión documental (contrato de verificación 1) | CNF-1 |
| Prueba C3 | Lee `skills/epic-validate/SKILL.md`, la guía y `state-machine.md` desde `REPO_ROOT`, extrae las líneas que empiezan con el prefijo canónico, exige exactamente una por documento y comprueba `ENTRY`, `APPROVE` y `REWORK` en ese orden. Las constantes `ENTRY = '/epic-validate <EPIC-ID>'`, `APPROVE = 'VALIDATE/IN-PROGRESS → VALIDATE/DONE'` y `REWORK = 'VALIDATE → DEVELOP/IN-PROGRESS'` aparecen una sola vez en el archivo | CNF-1 |
| Prueba C4 | Nombre: `epic-validate se empaqueta y se instala con su SKILL.md en cada runtime soportado (STORY-127 AC-3, CS-8)`. Reutiliza `RUNTIMES`, `createFixture`, `withInitCwd`, `withoutInstallLogs` y `destination` de `test/install.test.js`. Una entrada de `files` cubre la ruta si, normalizada sin `/` final, es `skills` o `skills/epic-validate` | AC-3, CNF-2, CS-8 |

### Esquema de datos

**Tabla de decisión del gateway** (contenido de C5; C1 la resume) // satisface: AC-1, AC-2

| Ejecución | `status` de la épica al validar | `verdict` del reporte | Escritura en `epic.md` | Línea `Gateway:` |
|---|---|---|---|---|
| sin `--dry-run`, reporte escrito | `VALIDATE` (`IN-PROGRESS` o `BLOCKED`) | `APPROVED` | `status: VALIDATE`, `substatus: DONE`, `updated` | `<EPIC_ID> VALIDATE/<substatus> → VALIDATE/DONE` |
| sin `--dry-run`, reporte escrito | `VALIDATE/DONE` | `APPROVED` | ninguna (ya está lista para `SHIP`) | `sin cambio — la épica ya está en VALIDATE/DONE` |
| sin `--dry-run`, reporte escrito | `VALIDATE` (cualquier `substatus`) | `NEEDS-CHANGES`, `BLOCKED`, ausente o fuera de los tres permitidos | `status: DEVELOP`, `substatus: IN-PROGRESS`, `updated` | `<EPIC_ID> VALIDATE/<substatus> → DEVELOP/IN-PROGRESS` + remisión a `## Veredicto` |
| sin `--dry-run`, reporte escrito | distinto de `VALIDATE`, ausente o frontmatter ilegible | cualquiera | ninguna | `sin cambio — la épica está en <status>/<substatus>; el gateway solo transiciona desde VALIDATE` |
| `--dry-run` | cualquiera | el de la previsualización | ninguna | `sin cambio (--dry-run) — aplicaría <origen> → <destino>` |
| error de invocación o fallo antes de escribir el reporte | cualquiera | — | ninguna | `sin cambio — no se escribió el reporte` |

**Resumen de C1** // satisface: AC-1, AC-2, AC-3, CNF-2

- La línea canónica.
- Tres resultados: `APPROVED` → `VALIDATE/DONE` (lista para `SHIP`); `NEEDS-CHANGES` o `BLOCKED` → `DEVELOP/IN-PROGRESS`, revisar `## Veredicto` y volver a validar tras corregir; `--dry-run`, épica fuera de `VALIDATE` o reporte no escrito → sin cambio.
- Que `DEVELOP → VALIDATE` es otro gate (completitud de historias, `/epic-track-progress`) y que la entrada en `VALIDATE` sigue siendo manual.
- Que `epic-validate-report.md` permanece en `<EPIC_DIR>` como evidencia y que `RESULTADO: ÉXITO` (STORY-126) equivale a la primera fila.
- Disponibilidad: el gateway está disponible en todo runtime de `config/runtimes.json` con `support: supported` tras `npx agile-sddf install --target <runtime>` con la estrategia `full` (por defecto); `--strategy story` excluye los skills `epic-*`. La guía no enumera los runtimes (`AGENTS.md`).

### Flujos clave

**F1 — Veredicto aprobado** // satisface: AC-1
1. Épica `EPIC-NN` en `VALIDATE/IN-PROGRESS`. El usuario ejecuta `/epic-validate EPIC-NN`.
2. El skill escribe el reporte con `verdict: APPROVED`.
3. C5 relee `verdict`, lee el estado de `epic.md` y escribe `VALIDATE/DONE` con `updated` de hoy.
4. La salida termina con `Gateway: EPIC-NN VALIDATE/IN-PROGRESS → VALIDATE/DONE` y el bloque `RESULTADO: ÉXITO`. `epic-validate-report.md` queda en `<EPIC_DIR>`.

**F2 — Veredicto no aprobado** // satisface: AC-2
1. El reporte se escribe con `verdict: NEEDS-CHANGES` o `BLOCKED`.
2. C5 escribe `DEVELOP/IN-PROGRESS` y emite la línea `Gateway:` con la remisión a `## Veredicto`.
3. La épica no está en `VALIDATE/DONE`, así que no puede pasar a `SHIP`. Tras corregir, vuelve a `VALIDATE` por el gate de completitud y se repite F1.

**F3 — Sin efectos** // satisface: AC-1, AC-2
1. Con `--dry-run`, un error de invocación o la épica en otro `status`, C5 no escribe `epic.md` y explica el motivo en la línea `Gateway:`.

**F4 — Distribución** // satisface: AC-3, CNF-2
1. `npm pack` incluye `skills/epic-validate/**` porque `files` contiene `skills/`.
2. `npx agile-sddf install --target <runtime>` (estrategia `full`) copia `skills/epic-validate/` a `<destino>/<skillsDirectory>/epic-validate/`.
3. C4 lo comprueba en `npm test` para cada runtime soportado; `smoke-package-install.js` lo comprueba sobre el tarball real en `npm run verify:repository`.

**F5 — Deriva documental** // satisface: CNF-1
1. Alguien cambia el punto de entrada o una transición en solo uno de los tres documentos.
2. C3 falla en `npm test` con el documento y la línea divergente.

### Decisiones técnicas

| # | Decisión | Opción elegida | Alternativas rechazadas | Justificación | AC |
|---|---|---|---|---|---|
| D-1 | Mecanismo del gateway | El propio `/epic-validate` escribe la transición en `epic.md` tras escribir su reporte (decisión del PO, 2026-10-29) | (a) Precondición documentada que aplica el mantenedor a mano; (b) un skill aparte que lea el reporte y escriba el `status` | (a) La regla dependería de que alguien la aplique y la épica podría quedar en un estado que contradice su reporte. (b) Agrega un skill y un paso al flujo para tres campos de frontmatter (P12). Exige ampliar CS-7 y la política de efectos de STORY-126 (CR-004, CR-005) | AC-1, AC-2 |
| D-2 | Fuente de la decisión | `verdict` del frontmatter del reporte, releído tras escribirlo (G-06) | (a) El veredicto en memoria; (b) la línea `RESULTADO:` | (a) Si la escritura falló a medias, la épica avanzaría sin evidencia persistida. (b) Es salida de consola, no evidencia. Es la misma regla que STORY-170 y `story-plan` | AC-1, AC-2 |
| D-3 | Cumplimiento de CS-8 | Conservar `"skills/"` en `files` y probar que cubre `skills/epic-validate/` | (a) Agregar `"skills/epic-validate/"` explícito; (b) reemplazar `"skills/"` por una lista de skills | (a) Es redundante: npm ya incluye la ruta. (b) Exige editar `files` con cada skill nuevo y arriesga omisiones. La prueba C4 hace verificable el criterio sin cambiar el paquete (CR-003) | AC-3, CS-8 |
| D-4 | Verificación de la instalación | Un `test` nombrado en `test/install.test.js` con las utilidades del archivo | (a) Confiar en la prueba genérica de inventario; (b) archivo de prueba nuevo con utilidades copiadas; (c) `npm pack` dentro de `npm test` | (a) No nombra `epic-validate` ni AC-3, y pasa si el skill falta en la fuente. (b) Duplica `withInitCwd` y `withoutInstallLogs` (P3). (c) `smoke-package-install.js` ya empaqueta en `verify:repository` | AC-3 |
| D-5 | Garantía de CNF-1 | Línea canónica única por documento en los tres documentos más una prueba que las compara | (a) Solo revisión manual; (b) generar un documento desde otro | (a) No detecta deriva entre el comportamiento del skill y la documentación. (b) Requiere un generador para tres líneas (P12) | CNF-1 |
| D-6 | Dónde vive el detalle | La tabla de decisión completa vive en `SKILL.md` (C5), que es lo que se ejecuta. C1 la resume para el usuario y `state-machine.md` solo lleva la línea canónica y el enlace | Copiar la tabla completa en la guía y en `state-machine.md` | Una sola fuente del detalle evita contradicciones; C3 protege lo que se repite. `state-machine.md` es el índice de transiciones, no un manual (P11) | AC-1, AC-2, CNF-1 |
| D-7 | Desde qué estado transiciona | Cualquier `substatus` de `status: VALIDATE`; desde otro `status` no cambia nada | (a) Solo `VALIDATE/IN-PROGRESS`; (b) también desde `DEVELOP` | (a) Una revalidación de una épica en `VALIDATE/DONE` que resulte `NEEDS-CHANGES` la dejaría lista para `SHIP` con un reporte no aprobado. (b) Saltaría el gate de completitud de historias (`domain-epic-lifecycle` §8) | AC-1, AC-2 |
| D-8 | Valores que devuelven la épica a `DEVELOP` | Todo lo que no sea `APPROVED`, incluidos `BLOCKED` y un `verdict` ausente o desconocido (decisión del PO, 2026-10-29) | `BLOCKED` → `VALIDATE/BLOCKED` sin retroceder (`domain-state-management` invariante 3) | El PO decidió que todo fallo frena en `DEVELOP` y no permite `SHIP`. G-06 obliga a fallar cerrado ante valores desconocidos | AC-2 |
| D-9 | `substatus` de destino | `VALIDATE/DONE` al aprobar y `DEVELOP/IN-PROGRESS` al rechazar | (a) `SHIP` directamente; (b) `DEVELOP/TODO` | (a) `SHIP` lo escribe `epic-ship` con confirmación humana (STORY-170, invariante 6). (b) `domain-epic-lifecycle` §6 no admite `TODO` en `DEVELOP`; `DONE` significa «lista para avanzar» y la invariante 4 devuelve la épica a `DEVELOP` | AC-1, AC-2 |
| D-10 | Confirmación humana | Ninguna: la transición se escribe en `--mode manual` y en `--mode auto` | Pedir confirmación antes de escribir `epic.md` | Es una transición no terminal escrita por un skill (`domain-state-management` §5.1); la confirmación se reserva a las terminales (§5.2). `--mode auto` nunca pregunta (STORY-126) | AC-1, AC-2 |
| D-11 | Cómo se informa el gateway | Una línea `Gateway:` antes del bloque `RESULTADO`, sin cambiar sus campos | Agregar una línea `TRANSICIÓN:` al bloque | El bloque es un contrato de STORY-126 que lee una automatización; la línea previa informa sin romperlo. Un fallo al escribir `epic.md` ya encaja como `FALLO` por escritura fallida | AC-1, AC-2 |

### Decisiones de complejidad justificada

- **Prueba de consistencia documental sobre tres documentos (C3):** CNF-1 exige que el comportamiento distribuido (`SKILL.md`) y las dos fuentes documentales coincidan. Lee una sola línea por documento para no fallar con cambios de redacción.
- **Tabla de decisión de seis filas en vez de una regla en prosa:** cubre explícitamente revalidación, `--dry-run`, épica fuera de `VALIDATE` y reporte no escrito, que la historia exige (nota «Regla») y que una frase sobre `APPROVED` deja implícitos.
- **Sin cambios en `package.json` ni en el instalador:** el código actual ya cumple AC-3. Lo único que faltaba era una prueba que lo afirmara de forma trazable.

### Puntos de variación (P6)

- **Transiciones del gateway:** están en la línea canónica (C5, C1, C2), en la tabla de C5 y en las constantes de C3. El encabezado de C1 no las nombra, así que el ancla de C2 es estable.
- **Vocabulario del veredicto:** si la política agrega valores, la regla no cambia, porque solo `APPROVED` habilita.
- **Runtimes nuevos:** C4 itera sobre `config/runtimes.json` con `support: supported`, así que un runtime nuevo queda cubierto sin tocar la prueba.

### Degradación gradual (P7)

| Fallo | Comportamiento |
|---|---|
| `/epic-validate` no está instalado en el runtime (por ejemplo, con `--strategy story`) | No hay reporte ni transición; la épica sigue en `VALIDATE`. La nota de disponibilidad de C1 indica reinstalar con la estrategia `full` |
| `/epic-validate` se interrumpe antes de escribir el reporte | `epic.md` no cambia (última fila de la tabla) |
| El reporte se escribe pero falla la escritura de `epic.md` | El reporte queda como evidencia; `Gateway: ❌ …` y `RESULTADO: FALLO`. Volver a ejecutar aplica la transición |
| `skills/epic-validate/SKILL.md` aún no existe (STORY-124 sin entregar) | C3 y C4 fallan nombrando el archivo ausente, en lugar de un falso verde |
| Uno de los tres documentos pierde la línea canónica | C3 falla nombrando el documento y la cantidad de líneas encontradas (0 o más de 1) |

### Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | `SKILL.md` tiene el paso C5 con la tabla de decisión y la excepción C6; la guía tiene C1, el mapa de skills la fila C7 y el enlace de C2 apunta al ancla del encabezado de C1 | Revisión documental y C3 | AC-1, AC-2, CNF-1 |
| 2 | Con una épica fixture en `VALIDATE/IN-PROGRESS` cuyo resultado es `APPROVED`, `/epic-validate` la deja en `VALIDATE/DONE`, emite la línea `Gateway:` y el reporte permanece | Recorrido manual en un `REPO_ROOT` temporal fuera del repositorio | AC-1 |
| 3 | Con resultados `NEEDS-CHANGES` y `BLOCKED`, la épica pasa a `DEVELOP/IN-PROGRESS` y la línea `Gateway:` remite a `## Veredicto` | Recorrido manual con dos fixtures | AC-2 |
| 4 | Con `--dry-run` y con la épica en `DEVELOP`, `epic.md` queda idéntico byte a byte | Recorrido manual con dos fixtures | AC-1, AC-2 |
| 5 | `SKILL.md`, la guía y `state-machine.md` contienen exactamente una línea canónica con el mismo punto de entrada y las mismas transiciones | `node --test test/epic-validate-gateway.test.js` | CNF-1 |
| 6 | `files` cubre `skills/epic-validate/` y cada runtime soportado recibe `skills/epic-validate/SKILL.md`, idéntico a la fuente | `node --test test/install.test.js` (prueba C4) | AC-3, CS-8 |
| 7 | El tarball real contiene `skills/epic-validate/SKILL.md` | `npm pack --dry-run --json` y `smoke-package-install.js` dentro de `npm run verify:repository` | AC-3, CNF-2 |
| 8 | `npm run verify:repository` y `npm test` pasan | Ejecución de ambos comandos | CS-21 |

## Risks / Trade-offs

- [La política de efectos de STORY-126 prohíbe que el skill modifique `epic.md`] → Implementar sin alinearla deja diseños hermanos contradictorios. Mitigación: CR-005; C6 hace explícita la única excepción, que CS-7 de EPIC-23 ya admite (CR-004).
- [STORY-124 y STORY-126 no están entregadas] → C5, C6, C3 y C4 no se pueden implementar ni pasar hasta que exista `SKILL.md` con el paso de escritura, la política de efectos y el bloque `RESULTADO`. Mitigación: implementar esta historia después de ambas. C1 y C2 no dependen del skill.
- [`epic-ship` todavía no exige `VALIDATE/DONE`] → Una épica podría pasar a `SHIP` sin pasar por el gateway si su reporte dice `APPROVED`. Mitigación: CR-006 para STORY-170.
- [Los documentos de dominio no nombran a `epic-validate` como escritor de `VALIDATE/DONE` ni de la vuelta a `DEVELOP`] → `state-machine.md` y el mapa de skills lo dirían y el dominio no. Mitigación: CR-007 para CS-20.
- [Volver a `DEVELOP` por `BLOCKED`] → Un bloqueo de entorno (por ejemplo, smoke tests que no se pueden ejecutar) devuelve la épica a desarrollo aunque las historias estén bien. Es un trade-off aceptado por el PO: todo fallo frena el avance a `SHIP`.

## Open Questions

Ninguna que bloquee el diseño. Las alineaciones pendientes con otros artefactos quedan como CR-005 a CR-007.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: inviabilidad (inconsistencia con la épica)
- **Descripción**: la historia situaba el gateway en `DEVELOP → VALIDATE` y EPIC-23 en `VALIDATE → SHIP`.
- **Documento afectado**: story.md, design.md
- **Acción requerida**: ninguna. Resuelto el 2026-10-29: el PO decidió que el gateway es parte de `/epic-validate` y escribe `VALIDATE/IN-PROGRESS → VALIDATE/DONE` o la vuelta a `DEVELOP`; story.md y este diseño se actualizaron.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: AC-2 y la nota «Contrato consumido» solo nombraban `APPROVED` | `BLOCKED`.
- **Documento afectado**: story.md
- **Acción requerida**: ninguna. Resuelto el 2026-10-29: AC-2 es un esquema con `NEEDS-CHANGES` y `BLOCKED`, y la nota nombra los tres valores.

### CR-003
- **Tipo**: reutilización
- **Descripción**: CS-8 y AC-3 dicen que `skills/epic-validate/` «figura en el arreglo `files`». La entrada existente `"skills/"` ya la incluye y no hace falta editar `package.json` (D-3).
- **Documento afectado**: story.md (AC-3), epic.md (CS-8)
- **Acción requerida**: ninguna para implementar. Opcionalmente, reformular CS-8 como «el paquete publicado incluye `skills/epic-validate/`», que es lo que verifican C4 y el contrato de verificación 7.

### CR-004
- **Tipo**: inconsistencia con la épica
- **Descripción**: CS-7 de EPIC-23 dice «el skill solo escribe `epic-validate-report.md`; no modifica código, fuentes ni otros documentos». El gateway escribe `status`, `substatus` y `updated` de `epic.md`. Además, `epic.md` › Notas › «Alineación pendiente» todavía pide situar el gateway de STORY-127 en `VALIDATE → SHIP`.
- **Documento afectado**: epic.md
- **Acción requerida**: ninguna. Resuelto el 2026-10-29: CS-7, el § Alcance (VALIDATE) y la nota «Posición de `epic-validate`» de EPIC-23 recogen el gateway, y la línea de STORY-127 se retiró de «Alineación pendiente».

### CR-005
- **Tipo**: inconsistencia con historia hermana
- **Descripción**: la «Política de efectos» de STORY-126 (C3, y su objetivo «fuera de `--dry-run` el único archivo escrito es el reporte») excluye `epic.md`. C6 la modifica después de STORY-126.
- **Documento afectado**: STORY-126 design.md
- **Acción requerida**: anotar en STORY-126 que STORY-127 agrega la excepción del gateway, o implementar STORY-127 después de STORY-126 aplicando C6 sobre su texto.

### CR-006
- **Tipo**: inconsistencia con historia hermana
- **Descripción**: el gate de STORY-170 (`epic-ship`) solo exige `verdict: APPROVED`. Con el gateway, la precondición coherente de `SHIP` es `VALIDATE/DONE`.
- **Documento afectado**: STORY-170 story.md y design.md
- **Acción requerida**: refinar STORY-170 para que exija `VALIDATE/DONE` (además del `verdict`) y remita a `/epic-validate` si la épica no está en ese estado.

### CR-007
- **Tipo**: gobierno
- **Descripción**: `domain-epic-lifecycle` (§8 y transiciones) y `domain-state-management` no nombran a `epic-validate` como escritor de `VALIDATE/DONE` ni de la vuelta a `DEVELOP`.
- **Documento afectado**: docs/domains/domain-epic-lifecycle.md, docs/domains/domain-state-management.md
- **Acción requerida**: incluirlo en el ajuste de CS-20 (STORY-175, dueña del nombre de `epic-validate-report.md` en `domain-epic-lifecycle`).

### CR-008
- **Tipo**: decisión de implementación no prevista
- **Descripción**: (1) la segunda línea fija de `## Veredicto` («Informativo: esta validación no cambia el estado de la épica.») contradecía el gateway; se reemplazó en `SKILL.md` (clave `veredicto`) y en el seed `assets/epic-validate-report-template.md` por `` Gateway: si la épica está en `VALIDATE`, `APPROVED` la deja en `VALIDATE/DONE` y otro veredicto la devuelve a `DEVELOP/IN-PROGRESS` (Paso 5b). ``. (2) Las demás afirmaciones de `SKILL.md` que excluían `epic.md` («Qué NO hace», Dependencias, «Sin cambio de estado», Paso 5.6, Verificación del flujo, Salida) se alinearon con C6. (3) `skills/epic-ship/` aún no existe (STORY-170): los textos nuevos dicen que `SHIP` sigue siendo una transición manual en lugar de nombrar `/epic-ship` como su escritor. (4) La tabla del Paso 6 agrega la fila `FALLO` con reporte escrito y escritura de `epic.md` fallida (interfaz «Fallo al escribir `epic.md`»).
- **Documento afectado**: skills/epic-validate/SKILL.md, skills/epic-validate/assets/epic-validate-report-template.md
- **Acción requerida**: ninguna. Al entregar STORY-170, actualizar las menciones de `SHIP` manual si `/epic-ship` pasa a escribirlo.
