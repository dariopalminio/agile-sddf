---
alwaysApply: false
type: design
id: STORY-124
slug: STORY-124-validar-preparacion-estructural-epica-design
title: "Design: Validar la preparación estructural de una épica"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
story: STORY-124
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-124-validar-preparacion-estructural-epica
  - EPIC-23-completar-flujo-de-epic
  - STORY-125-validar-evidencia-operativa-epica
  - STORY-126-operar-validacion-epica-segura
  - STORY-128-evaluar-validacion-epica-repetible
  - STORY-168-skill-epic-track-progress
---

<!-- Referencias -->
[[STORY-124-validar-preparacion-estructural-epica]] · [[EPIC-23-completar-flujo-de-epic]] · [[STORY-125-validar-evidencia-operativa-epica]] · [[STORY-168-skill-epic-track-progress]]

## Context

`epic-validate` es el nodo de la fase `VALIDATE` en `docs/architecture/diagrams/flowchart-skill-epic-flow-relationship.mermaid` (`dec_dev -->|YES| epic-validate`, `dec_val -->|APPROVED| epic-ship`, `dec_val -->|NEEDS-CHANGES| epic-track-progress`). Hoy el nodo no tiene skill: `ls skills/` no lista `epic-validate`. Esta historia es el **núcleo** del split de STORY-124: crea el skill, su template de reporte y las dos comprobaciones estructurales (cierre de historias y análisis de la épica). STORY-125 añade la evidencia operativa (smoke tests, `verify:release`, DoD), STORY-126 los modos y `--dry-run`, STORY-137 `--verbose`, STORY-127 la integración documental y STORY-128 los evals de cobertura CS-9.

Estado verificado del que parte el diseño:

- **Contrato de validación:** `docs/policies/validation-contract-policy.md` §4 ya reserva la fila `epic-validate` (previsto, EPIC-23) → `epic-validate-report.md`, valores `APPROVED`, `NEEDS-CHANGES`, `BLOCKED`. Reglas G-01 (`verdict` único), G-02 (`## Veredicto` primera sección tras `#`, primera línea `` **Veredicto:** `<VALOR>` — <motivo> ``), G-05 (`NEEDS-CHANGES` gana a `BLOCKED`) y G-06 (lectura cerrada: solo `APPROVED` habilita).
- **Vocabulario decidido por el PO (EPIC-23, Notas, 2026-10-17):** `NEEDS-CHANGES` = la evidencia existe pero no cumple (p. ej. historia no terminal, análisis sin `APPROVED`); `BLOCKED` = un bloqueo impide obtener la evidencia. SMOKE-3 (que esta historia cubre) exige `NEEDS-CHANGES` para una historia no terminal. El AC-2 de `story.md` aún dice `BLOCKED` y la épica lo registra como «alineación pendiente» → CR-001.
- **Verificador del contrato:** `scripts/verify-validation-contract.js` toma de §4 solo los skills con `skills/<skill>/SKILL.md` y exige para cada uno una entrada en `REPORT_TEMPLATES` (error P-1 `skill <s> sin entrada en REPORT_TEMPLATES`), comprueba G-01…G-04 en ese template y que el `SKILL.md` contenga `APPROVED` (S-3). Crear el `SKILL.md` sin tocar el script rompe `npm run verify:repository` (CS-21). Su prueba `test/verify-validation-contract.test.js` construye fixtures desde un mapa `REPORTS` paralelo y su caso F-4 afirma que `epic-validate` sin `SKILL.md` no produce error.
- **Reglas de cruce existentes (P3):** `skills/epic-analyze/SKILL.md` fija la resolución de la épica (Paso 1: `specs/flow/<ID>-*/epic.md`, guion obligatorio, épicas nunca en `archive/`, mensaje `❌ No se encontró la épica <arg>: no existe <ruta-buscada>` y fin **sin escribir**), el parseo del índice (Paso 3: F1/F2/F3), el inventario de historias activas y archivadas con pertenencia por prefijo `EPIC-NN` de `parent` (Paso 4) y el patrón de template por claves con seed en `assets/` y override en `docs/templates/` (Paso 7). STORY-168 (`epic-track-progress`, diseñado) reutiliza esas mismas reglas y fija «terminada» = `DELIVER/DONE` o `COMPLETED/DONE`, con `CANCELED/DONE` como `cancelada` que no bloquea.
- **Análisis de la épica:** `epic-analyze` escribe `<EPIC_DIR>/epic-analyze-report.md` con `verdict: APPROVED | NEEDS-REFINEMENT`; §5 traduce su valor heredado `BLOCKED` a `NEEDS-REFINEMENT`.
- **Registro de un skill nuevo:** `package.json › files` ya publica `skills/` completo (CS-8 queda cubierto sin editarlo); `scripts/verify-fixed-layout.js` exige `<!-- SDDF-FIXED-LAYOUT: v1 -->` y prohíbe `SDDF_ROOT`, `SPECS_BASE` y `SDDF-ROOT-RESOLUTION: v1`; `scripts/verify-eval-inventory.js` exige `evals/evals.json` con ≥ 1 caso `TC-NNN` para todo skill sin exención en `config/eval-exemptions.json`.

## Goals / Non-Goals

**Goals:**
- Crear `skills/epic-validate/SKILL.md` que resuelve solo `REPO_ROOT` con rutas fijas y declara el marcador de layout // satisface: CNF-1, CS-1
- Crear el template seed del reporte con `## Veredicto` como primera sección y el marcador `sección obligatoria · clave · escritor` en cada sección // satisface: CNF-2, CS-2
- Evaluar dos comprobaciones estructurales (cierre de historias hijas y veredicto de `epic-analyze-report.md`) y calcular el veredicto como función pura de sus resultados // satisface: AC-1, AC-2, CS-3
- Escribir `<EPIC_DIR>/epic-validate-report.md` desde el template, sin marcadores sin resolver, con el mismo veredicto en `## Veredicto` y en `verdict` // satisface: AC-1, AC-2, CNF-2, CS-5
- Identificar en el reporte cada historia no terminal con su `status/substatus` y el análisis con su veredicto // satisface: AC-2, SMOKE-3
- Ante una épica inexistente, informar la ruta buscada y terminar sin crear reporte // satisface: AC-3, CS-6, SMOKE-2
- Mantener verde `npm run verify:repository` y `npm test` con el skill nuevo // satisface: CS-21

**Non-Goals:**
- Smoke tests, `verify:release`, DoD de épica y fuentes de evidencia por modo (STORY-125).
- Flags `--mode`, `--dry-run`, retorno estructurado de modo Agent e idempotencia como contrato verificado (STORY-126); `--verbose` (STORY-137); suites de staging (STORY-169).
- Cambiar el `status`/`substatus` de la épica o de sus historias (fuera de alcance de la historia).
- Integrar el veredicto en la transición, documentar el gateway en guías o `state-machine.md` (STORY-127).
- Evals de cobertura CS-9 (STORY-128): aquí solo los casos mínimos de los AC de esta historia.
- Versionar `validation-contract-policy` para retirar «(previsto, EPIC-23)» de §4 (su dueño es STORY-166; ver Risks).

## Decisions

### Componentes

| Componente | Acción | Ubicación | Responsabilidad | AC que satisface |
|---|---|---|---|---|
| Skill `epic-validate` | crear | `skills/epic-validate/SKILL.md` | Orquestar: resolver épica, ejecutar las comprobaciones `EST-*`, calcular el veredicto, rellenar el template y escribir el reporte | AC-1, AC-2, AC-3, CNF-1, CS-1, CS-3, CS-5, CS-6 |
| Reglas de fuentes | crear | `skills/epic-validate/references/story-sources.md` | Detallar resolución de épica, parseo del índice, inventario y pertenencia de historias (reglas de `epic-analyze` Pasos 1, 3 y 4, con su origen citado) | AC-1, AC-2, AC-3, CNF-1 |
| Template seed del reporte | crear | `skills/epic-validate/assets/epic-validate-report-template.md` | Estructura del reporte por claves; `## Veredicto` primero | AC-1, AC-2, CNF-2, CS-2, CS-5 |
| Evals mínimos | crear | `skills/epic-validate/evals/evals.json` | Casos `TC-001…TC-005` de los AC de esta historia (STORY-128 los amplía) | AC-1, AC-2, AC-3, CS-21 |
| Verificador del contrato | modificar | `scripts/verify-validation-contract.js` (`REPORT_TEMPLATES`) | Añadir `'epic-validate': 'skills/epic-validate/assets/epic-validate-report-template.md'` | CS-2, CS-5, CS-21 |
| Prueba del verificador | modificar | `test/verify-validation-contract.test.js` | Añadir `epic-validate` al mapa `REPORTS`; en F-4 sustituir la fila `epic-validate` por otro skill previsto ficticio que conserve la aserción «fila de §4 sin `SKILL.md` no es error» | CS-21 |
| Mapa de skills | modificar | `docs/domains/domain-skills-map.md` (tabla `## Épica (L2)`) | Fila: momento `VALIDATE`; lee `epic.md`, `story.md`, `epic-analyze-report.md` y el template; escribe `<EPIC_DIR>/epic-validate-report.md`; cambia estado `—` | AC-1 (veracidad documental, `AGENTS.md`) |

No se crea `scripts/` (D-1) ni `README.md` del skill. No se edita `package.json` (ya publica `skills/`). Los destinos de runtime son salida de `agile-sddf install`.

### Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Invocación | `/epic-validate <epica>` con `<epica>` = `EPIC-NN`, nombre de directorio `EPIC-NN-<slug>` o ruta al directorio o a su `epic.md`. Sin argumento → pregunta `¿Qué épica deseas validar? …`. Cualquier otro argumento (p. ej. un flag aún no soportado) → `❌ Argumento no reconocido: <arg>` y fin sin escribir (D-7) | AC-1, AC-2, AC-3 |
| Frontmatter de `SKILL.md` | `name: epic-validate`; `description: >-` en español, ≤ 500 caracteres, con disparadores «epic-validate», «validar épica», «gate de VALIDATE», «épica lista para liberar» | CS-1 |
| Resolución de épica | Paso 1 de `epic-analyze` (en `references/story-sources.md`): 0 coincidencias o directorio sin `epic.md` → `❌ No se encontró la épica <arg>: no existe <ruta-buscada>` con `<ruta-buscada>` relativa a `REPO_ROOT` (p. ej. `specs/flow/EPIC-77-*/epic.md`); > 1 → lista y error. En ambos casos no se escribe nada | AC-3, CS-6 |
| Lectura de `story.md` | Solo frontmatter: `parent`, `status`, `substatus` (escalares). El cuerpo nunca se lee | AC-1, AC-2 |
| Lectura de `epic-analyze-report.md` | Solo el campo `verdict` del frontmatter (G-06); la línea `**Veredicto:**` solo se cita como motivo | AC-1, AC-2 |
| Template del reporte | Efectivo: `docs/templates/epic-validate-report-template.md` → seed `$CLI_ROOT/skills/epic-validate/assets/epic-validate-report-template.md` (con aviso de seed). Ninguno → `❌ Template epic-validate-report-template.md no encontrado (probado: …)` y fin sin escribir | CNF-2, CS-5 |
| Escritura | Única ruta: `<EPIC_DIR>/epic-validate-report.md`, sobrescritura completa; del reporte previo solo se conserva `created` | AC-1, AC-2 |
| Salida en consola | `📄 Reporte escrito: <ruta>` · `Veredicto: <VALOR>` · una línea por motivo (`M-NNN [<VALOR>] <comprobación> — <elemento>`) o `Sin motivos.` | AC-1, AC-2 |

### Esquema de datos

**Universo de historias** (reglas de `epic-analyze` Pasos 3–4; mismo criterio que STORY-168) // satisface: AC-1, AC-2

Índice de `epic.md` (F1/F2/F3) ∪ `story.md` activos y archivados cuyo `parent` tiene el prefijo `EPIC_ID`. Cada fila: `id` (`STORY-NNN` o nombre de la línea F1), `status`, `substatus` (literales o `—`), `ubicacion` (`activa` · `archivada` · `no encontrada` · `planificada (sin ID)`).

**Clasificación de cada historia** (D-3) // satisface: AC-1, AC-2

| Condición | Clasificación | Efecto en `EST-01` |
|---|---|---|
| `DELIVER/DONE` o `COMPLETED/DONE` (activa o archivada) | `terminada` | ninguno |
| `CANCELED/DONE` | `cancelada` | ninguno |
| Cualquier otro par, o `status`/`substatus` ausente | `no terminal` | motivo `NEEDS-CHANGES` con `status/substatus` |
| ID del índice sin directorio en `specs/flow/` ni `specs/flow/archive/` | `no terminal` (`no encontrada`) | motivo `NEEDS-CHANGES` |
| Línea F1 (planificada sin ID) | `no terminal` (`planificada (sin ID)`) | motivo `NEEDS-CHANGES` |

**Comprobaciones estructurales** // satisface: AC-1, AC-2, CS-3

| ID | Comprobación | `cumple` | `no cumple` | `bloqueada` |
|---|---|---|---|---|
| `EST-01` | Cierre de historias hijas | ≥ 1 `terminada` y 0 `no terminal` | ≥ 1 `no terminal`, o universo sin ninguna `terminada` (D-4) | — (nunca: los `story.md` siempre son legibles o se clasifican `no terminal`) |
| `EST-02` | Análisis de la épica | `epic-analyze-report.md` con `verdict: APPROVED` | El reporte existe y `verdict` es otro valor, falta o no es reconocido (G-06; un `BLOCKED` heredado se cita traducido por §5 a `NEEDS-REFINEMENT`) | El reporte no existe o no es legible: no hay evidencia que leer (D-5) |

El prefijo `EST-` identifica la familia; STORY-125 añade su propia familia (p. ej. `OPE-`) sin cambiar la regla del veredicto.

**Veredicto** (función pura; aplica G-05) // satisface: AC-1, AC-2, CS-5

| Resultados de las comprobaciones | `verdict` |
|---|---|
| Todas `cumple` | `APPROVED` |
| ≥ 1 `no cumple` (haya o no `bloqueada`) | `NEEDS-CHANGES` |
| 0 `no cumple` y ≥ 1 `bloqueada` | `BLOCKED` |

**Motivo** `{ id: M-NNN, veredicto, comprobacion, elemento, evidencia, accion }`, ordenados por comprobación (`EST-01` < `EST-02`) y, dentro de `EST-01`, por `STORY-NNN` con las F1 al final; numerados después de ordenar. Acciones: `EST-01` → `completar la historia en su pipeline (o cancelarla)`; `EST-02 no cumple` → `corregir la épica con /epic-refine y volver a ejecutar /epic-analyze <EPIC_ID>`; `EST-02 bloqueada` → `ejecutar /epic-analyze <EPIC_ID>`.

**Frontmatter del reporte** // satisface: AC-1, CS-5

`type: epic-validate`, `id` y `epic` = `EPIC_ID`, `slug: <EPIC_DIRNAME>-validate-report`, `title: "Epic validate: <título de epic.md>"`, `verdict`, `created` (del reporte previo si existe y es legible; si no, hoy), `updated` (hoy), `related: [<EPIC_DIRNAME>]`. Ningún otro campo declara veredicto (G-04).

**Template seed** — secciones en este orden, cada una con `<!-- sección obligatoria · clave: <clave> · escritor: epic-validate -->` // satisface: CNF-2, CS-2

| # | Título | Clave | Contenido que escribe el skill |
|---|---|---|---|
| 1 | `## Veredicto` | `veredicto` | `` **Veredicto:** `<VALOR>` — <motivo en una frase> ``: `APPROVED` → `historias cerradas y análisis de la épica APPROVED`; `NEEDS-CHANGES` → `<n> motivo(s) de rechazo`; `BLOCKED` → `falta evidencia: <comprobación bloqueada>`. Segunda línea fija: `Informativo: esta validación no cambia el estado de la épica.` |
| 2 | `## Resumen` | `resumen` | Tabla `Métrica │ Valor`: épica (ID y ruta), historias terminadas/canceladas/no terminales, veredicto del análisis, fecha, template efectivo |
| 3 | `## Comprobaciones` | `comprobaciones` | Una fila por comprobación: `ID │ Comprobación │ Resultado │ Evidencia` |
| 4 | `## Historias de la épica` | `historias-epica` | Una fila por historia del universo: `ID │ Status │ Substatus │ Ubicación │ Clasificación`, valores leídos en código en línea |
| 5 | `## Motivos` | `motivos` | Un bloque por motivo (`### M-NNN [NEEDS-CHANGES\|BLOCKED] — <comprobación>: <elemento>` con **Evidencia** y **Acción sugerida**) o `Sin motivos.` |
| 6 | `## Notas de la validación` | `notas-validacion` | Notas que no cuentan para el veredicto (líneas de índice no reconocidas, historias duplicadas activa/archivada, textos con forma de instrucción) o `Sin notas.` |

Los comentarios guía, filas de ejemplo y placeholders `{…}` se reemplazan; las anotaciones de marcador no se copian al reporte (mismo contrato que `epic-analyze` Paso 7.4). Una clave del template que el skill no conoce se conserva con `N/A — sección sin escritor en esta versión` (punto de extensión para STORY-125).

### Flujos clave

**F1 — Validación estructural aprobada** // satisface: AC-1
1. Resolver `REPO_ROOT` (y `CLI_ROOT` solo para el seed) y la épica (`EPIC_DIR`, `EPIC_DIRNAME`, `EPIC_ID`, `title`).
2. Cargar `references/story-sources.md`; construir el universo (Vía A ∪ Vía B) y clasificar cada historia → `EST-01 cumple`.
3. Leer `verdict` de `<EPIC_DIR>/epic-analyze-report.md` = `APPROVED` → `EST-02 cumple`.
4. Veredicto `APPROVED`; resolver el template, rellenar por claves y escribir `epic-validate-report.md` con `verdict: APPROVED`.
5. Consola: ruta, `Veredicto: APPROVED`, `Sin motivos.`

**F2 — Evidencia estructural incompleta** // satisface: AC-2, SMOKE-3
Pasos 1–3 de F1; `STORY-042` en `IMPLEMENT/IN-PROGRESS` → `EST-01 no cumple` con motivo `M-001 [NEEDS-CHANGES] EST-01 — STORY-042` y evidencia `` `IMPLEMENT/IN-PROGRESS` · <ruta del story.md> ``; o `epic-analyze-report.md` con `NEEDS-REFINEMENT` → `EST-02 no cumple` citando ese veredicto. Veredicto `NEEDS-CHANGES`; se escribe el reporte.

**F3 — Análisis ausente** // satisface: AC-2 (D-5)
`epic-analyze-report.md` no existe → `EST-02 bloqueada`. Si `EST-01 cumple`, veredicto `BLOCKED` con acción `ejecutar /epic-analyze <EPIC_ID>`; si `EST-01 no cumple`, `NEEDS-CHANGES` (G-05) y ambos motivos figuran.

**F4 — Épica inexistente** // satisface: AC-3, SMOKE-2, CS-6
En el paso 1, 0 coincidencias → `❌ No se encontró la épica EPIC-77: no existe specs/flow/EPIC-77-*/epic.md` y fin. No se lee ningún template ni se crea ningún archivo.

### Decisiones técnicas

| # | Decisión | Opción elegida | Alternativas rechazadas | Justificación | AC |
|---|---|---|---|---|---|
| D-1 | Mecanismo de cálculo | Instrucciones Markdown en `SKILL.md` ejecutadas por el agente sobre frontmatter | (a) Motor Node `scripts/epic-validate.js`; (b) invocar `/epic-track-progress` y `/epic-analyze` | (a) Dos comprobaciones sobre escalares no justifican código, pruebas y resolución de ruta en runtimes instalados (P12); se revisa si STORY-125/169 necesitan ejecutar comandos de forma determinista. (b) `epic-analyze` reescribe su reporte (el skill solo debe escribir el suyo, CS-7) y la constitución (patrón 4) pide cadenas de composición cortas; `epic-track-progress` solo responde en el chat, no aporta un dato legible | AC-1, AC-2 |
| D-2 | Fuente de las reglas de cruce | Copiar a `references/story-sources.md` las reglas de los Pasos 1, 3 y 4 de `epic-analyze`, con su origen citado (mismo patrón que STORY-168 D-2) | (a) Enlazar `skills/epic-analyze/SKILL.md`; (b) reglas propias | (a) Ruta entre skills que no se resuelve con instalaciones `--target` parciales y carga 336 líneas ajenas. (b) La misma épica tendría historias distintas en `epic-analyze`, `epic-track-progress` y `epic-validate` | AC-1, AC-3, CNF-1 |
| D-3 | Definición de historia terminal | `terminada` = `DELIVER/DONE` o `COMPLETED/DONE`; `CANCELED/DONE` = `cancelada`, no bloquea | (a) Solo `DELIVER` (invariante 3 literal); (b) `CANCELED` como no terminal | (a) Las `COMPLETED` archivadas ya pasaron por `DELIVER`; excluirlas rechazaría épicas entregadas. (b) Una cancelada nunca llegará a `DELIVER`: el gate quedaría bloqueado para siempre. Coincide con STORY-168 D-3, así el semáforo de `DEVELOP` y el gate de `VALIDATE` no divergen | AC-1, AC-2 |
| D-4 | Épica sin historias o solo canceladas | `EST-01 no cumple` | Verdad vacía (`cumple`) | Una épica sin entregas no debe avanzar a `SHIP`; coincide con STORY-168 D-4 | AC-2 |
| D-5 | `epic-analyze-report.md` ausente o ilegible | `EST-02 bloqueada` → `BLOCKED` (salvo G-05) | (a) `no cumple` → `NEEDS-CHANGES`; (b) error sin reporte | (a) `NEEDS-CHANGES` devuelve la épica a `DEVELOP` (flowchart), que no produce el análisis; la política define `BLOCKED` como «un bloqueo impide completar el proceso … se vuelve a ejecutar el mismo gate», que es exactamente correr `/epic-analyze` y repetir. (b) Esconde el estado de `EST-01` y deja sin reporte un resultado legítimo del gate | AC-2 |
| D-6 | Vocabulario ante historia no terminal o análisis sin `APPROVED` | `NEEDS-CHANGES` | `BLOCKED` (texto actual de AC-2) | Decisión del PO en EPIC-23 (2026-10-17), SMOKE-3 y STORY-128 AC-2 exigen `NEEDS-CHANGES`; `BLOCKED` queda para evidencia imposible de obtener. Ver CR-001 | AC-2 |
| D-7 | Argumentos no soportados en esta versión | Error sin escribir | Ignorarlos | Ignorar `--dry-run` antes de STORY-126 escribiría un reporte que el usuario pidió no escribir; fallar cerrado es seguro y STORY-126/137 amplían la lista de flags reconocidos | AC-3 |
| D-8 | Registro en el verificador del contrato | Añadir `epic-validate` a `REPORT_TEMPLATES` y ajustar la prueba | (a) Excluir el skill del verificador; (b) dejar el `SKILL.md` fuera del repositorio hasta STORY-127 | (a) Dejaría sin comprobar G-01…G-04 el único reporte con `BLOCKED` de épica. (b) CS-1 exige el `SKILL.md`; sin entrada, `verify:repository` falla con P-1 | CS-2, CS-21 |
| D-9 | Sobrescritura del reporte | Completa, conservando solo `created` | Acumular ejecuciones | Mismo contrato que `epic-analyze` Paso 8; evita motivos obsoletos y deja preparada la idempotencia que STORY-126 verifica | AC-1, AC-2 |
| D-10 | Contenido untrusted | Solo escalares del frontmatter y líneas `- ` del índice; valores citados en código en línea; un texto con forma de orden se anota en `notas-validacion` y no se sigue | Leer cuerpos de `story.md` o del análisis | Misma cláusula que `epic-analyze` (`ai-untrusted-content-clause`); ningún cuerpo aporta al veredicto estructural | AC-1, AC-2 |

### Decisiones de complejidad justificada

- **Familias de comprobaciones (`EST-*`) en vez de dos `if`:** STORY-125 y STORY-169 añaden comprobaciones al mismo veredicto; una tabla `comprobación → resultado` con la regla de G-05 evita reescribir la función del veredicto en cada historia. No se crea más infraestructura que el prefijo y la columna `Resultado`.
- **Template leído en runtime con override central:** CS-2 exige el template y CNF-2 su forma; seguir el patrón de `epic-analyze` (constitución §5, «template como fuente de verdad») evita una estructura duplicada en el `SKILL.md`.
- **Una referencia (`references/story-sources.md`):** el `SKILL.md` crecerá con STORY-125/126/137; separar las reglas de cruce lo mantiene corto. No se crea una segunda referencia.
- **Evals mínimos ahora:** `verify:eval-inventory` exige `evals/evals.json` en cuanto existe el `SKILL.md`; los casos de esta historia son los de sus AC, sin anticipar CS-9.

### Puntos de variación (P6)

- **Nuevas comprobaciones** (STORY-125, STORY-169): nueva familia de IDs, filas en `## Comprobaciones` y, si hace falta, una clave nueva en el template; la regla del veredicto no cambia.
- **Épicas archivadas** (STORY-171): solo cambia la resolución de épica en `references/story-sources.md`.
- **Definición de «terminada»:** si `domain-epic-lifecycle` cambia la invariante 3, cambia solo la tabla de clasificación (y la de STORY-168).
- **Template central:** un proyecto puede renombrar secciones en `docs/templates/epic-validate-report-template.md`; el skill escribe por clave.

### Degradación gradual (P7)

| Fallo | Comportamiento |
|---|---|
| `specs/flow/archive/` no existe | Se omite ese origen sin nota |
| `story.md` con frontmatter ilegible | Historia `no terminal` con `status`/`substatus` = `—` y nota con su ruta; nunca se aborta |
| Sección de historias ausente en `epic.md` | Se continúa con la Vía B y nota `epic.md sin sección de historias → /epic-format-validation <EPIC_ID>` |
| `epic-analyze-report.md` ausente o ilegible | `EST-02 bloqueada` (D-5) |
| Template central y seed ausentes | `❌ … (probado: …)` y fin sin escribir |
| Escritura del reporte falla | `❌ No se pudo escribir <ruta>: <causa>`; no se informa veredicto como emitido |

### Contratos de verificación

| # | Criterio | Método | AC origen |
|---|---|---|---|
| 1 | Épica con historias `DELIVER/DONE` y `COMPLETED/DONE` (una archivada) y análisis `APPROVED` → reporte con `verdict: APPROVED` y `` **Veredicto:** `APPROVED` `` en `## Veredicto` | Eval TC-001 | AC-1 |
| 2 | Historia `STORY-042` en `IMPLEMENT/IN-PROGRESS` → `NEEDS-CHANGES` y el motivo cita `STORY-042` y `IMPLEMENT/IN-PROGRESS` | Eval TC-002 (= SMOKE-3) | AC-2 |
| 3 | Análisis con `verdict: NEEDS-REFINEMENT` → `NEEDS-CHANGES` y el motivo cita ese veredicto | Eval TC-003 | AC-2 |
| 4 | Análisis ausente y historias cerradas → `BLOCKED` con acción `/epic-analyze` | Eval TC-004 | AC-2 (D-5) |
| 5 | `EPIC-77` inexistente → `❌ … specs/flow/EPIC-77-*/epic.md` y ningún archivo creado | Eval TC-005 (= SMOKE-2) | AC-3 |
| 6 | El reporte no contiene `{`…`}` de placeholder ni `sección obligatoria ·` | Aserción `not_contains` en TC-001…TC-004 | CNF-2, CS-5 |
| 7 | El template declara el marcador en cada `##` y `## Veredicto` es la primera sección; G-01…G-04 | `npm run verify:validation-contract` | CS-2, CNF-2 |
| 8 | `SKILL.md` declara `<!-- SDDF-FIXED-LAYOUT: v1 -->` y no menciona `SDDF_ROOT` ni `SPECS_BASE` | `npm run verify:layout` | CNF-1, CS-1 |
| 9 | `evals/evals.json` válido e inventariado | `npm run verify:eval-inventory` | CS-21 |
| 10 | `npm run verify:repository` y `npm test` pasan | Ejecución local | CS-21 |

### Autoevaluación (P9, P10, P11)

- **Cobertura:** AC-1 (F1, D-3), AC-2 (F2, F3, D-4, D-5, D-6), AC-3 (F4, D-7); CNF-1 (D-2, Contrato 8), CNF-2 (template, Contratos 6–7). Sin omisiones.
- **Ambigüedad:** el vocabulario de AC-2 se decide en D-6 y se retroalimenta en CR-001; la lectura de CNF-1 en CR-002.
- **Nombres:** «terminada», «cancelada», «no terminal», `cumple`/`no cumple`/`bloqueada` y «motivo» se usan de forma única en esquema, template y evals.
- **Estructura:** sin ciclos (`SKILL.md → references/story-sources.md`, `SKILL.md → template`); el verificador conoce solo la ruta del template, no el skill. Cada componente tiene una razón de cambio: flujo y veredicto · reglas de cruce · forma del reporte · pruebas.

## Risks / Trade-offs

- [Las reglas copiadas de `epic-analyze` divergen de las de `epic-track-progress` y `epic-analyze`] → `references/story-sources.md` cita su origen y los evals fijan los bordes (prefijo `EPIC-300` vs `EPIC-30`, activa vs archivada).
- [Un `epic-analyze-report.md` `APPROVED` puede estar desactualizado respecto de `epic.md`] → fuera del alcance de los AC; el reporte cita el `updated` del análisis en la evidencia de `EST-02` para que el humano lo vea. Si se vuelve necesario, una comprobación de vigencia es una nueva fila `EST-*`.
- [§4 de la política sigue diciendo «(previsto, EPIC-23)» cuando el skill ya existe] → no afecta al verificador (toma el primer token en código); su corrección va con el versionado de la política que hace STORY-166.
- [La invariante 3 de `domain-epic-lifecycle` dice «todas en `DELIVER`»] → D-3 lo amplía igual que STORY-168; el ajuste documental va con STORY-170/171, que ya editan esos documentos.

## Open Questions

Ninguna: las decisiones abiertas se resuelven en D-1…D-10; las que afectan a la historia se registran como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: AC-2 de `story.md` dice que una historia no terminal o un análisis sin `APPROVED` producen `BLOCKED`. La decisión del PO en `epic.md` (Notas, 2026-10-17), SMOKE-3 —que esta historia cubre— y STORY-128 AC-2 exigen `NEEDS-CHANGES` para esos casos, y `epic.md` lo lista como «alineación pendiente». El diseño aplica `NEEDS-CHANGES` (D-6) y reserva `BLOCKED` para el análisis ausente o ilegible (D-5). La nota «veredicto binario» de la historia también queda desactualizada.
- **Documento afectado**: story.md
- **Acción requerida**: cambiar en AC-2 «el reporte declara BLOCKED» por «el reporte declara NEEDS-CHANGES»; añadir un escenario (o nota) para el análisis ausente → `BLOCKED`; reemplazar «veredicto binario» por «veredicto `APPROVED` / `NEEDS-CHANGES` / `BLOCKED` según `validation-contract-policy`». Retirar la línea correspondiente de «Alineación pendiente» en `epic.md` cuando se aplique.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: CNF-1 pide resolver la raíz de artefactos «con la precedencia vigente de SDDF»; esa precedencia (`SDDF_ROOT`, `root`, `SPECS_BASE`) fue retirada por ADR-0017 y CS-1 exige resolver solo `REPO_ROOT`. El diseño interpreta CNF-1 como «resuelve `REPO_ROOT` y usa el layout fijo».
- **Documento afectado**: story.md
- **Acción requerida**: reescribir CNF-1 como «la validación resuelve solo `REPO_ROOT` y localiza la épica con las rutas fijas de ADR-0017».
