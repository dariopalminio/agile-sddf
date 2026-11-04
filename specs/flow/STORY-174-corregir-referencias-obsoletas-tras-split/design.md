---
alwaysApply: false
type: design
id: STORY-174
slug: STORY-174-corregir-referencias-obsoletas-tras-split-design
title: "Design: Skill epic-refine: corregir referencias obsoletas tras un split"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
story: STORY-174
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-174-corregir-referencias-obsoletas-tras-split
  - STORY-165-corregir-indice-y-enlaces-epica
  - STORY-173-cubrir-criterios-salida-epica
  - EPIC-23-completar-flujo-de-epic
---

<!-- Referencias -->
[[STORY-174-corregir-referencias-obsoletas-tras-split]] · [[STORY-165-corregir-indice-y-enlaces-epica]] · [[STORY-173-cubrir-criterios-salida-epica]] · [[EPIC-23-completar-flujo-de-epic]]

## Context

STORY-174 amplía el skill `epic-refine` que crea STORY-165. Su diseño (`specs/flow/STORY-165-corregir-indice-y-enlaces-epica/design.md`) fija lo que esta historia reutiliza sin cambios: invocación `/epic-refine <epica> [--auto]` y gate por `verdict` (D-2), extracción de bloques `H-NNN` y revalidación (D-3), tabla de enrutamiento como único punto de extensión (D-4), plan consolidado `C-NN │ Origen │ Archivo │ Ubicación │ Operación │ Antes │ Después` cuya columna **Origen** ya reserva `COH-n` (D-6), escritura con `.bak`, relectura y restauración global (D-7), `epic-refine-report.md` sin veredicto, ampliable por filas (D-8) y contenido no confiable (D-9).

Estado verificado del que parte el diseño:

- **`skills/epic-refine/` aún no existe** (`ls skills/`): STORY-165 está en `PLAN`. Esta historia se implementa después de STORY-165 (nota de la historia) y modifica archivos que esa historia crea.
- **Por qué `epic-analyze` no reporta los slugs obsoletos:** resuelve las referencias **por ID**, no por slug. En el índice toma la primera ocurrencia de `**STORY-NNN**` e ignora el texto posterior (`skills/epic-analyze/SKILL.md:134`, «p. ej. `— [[STORY-086-…]]`… se ignora»); en `related` normaliza el valor y busca `specs/flow/<STORY-NNN>-*/story.md` o `specs/flow/archive/*-<STORY-NNN>-*/story.md`, y declara «un slug desactualizado no es una referencia rota» (`SKILL.md:244`, `:249`). Si el ID existe con otro slug, no hay hallazgo; si el ID no existe, hay MAD-02 (en `related`) o INT-01 (si es el token `**STORY-NNN**` del índice).
- **Forma del archivo:** `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` (ADR-0017; `ls specs/flow/archive/`, p. ej. `2026-04-22-STORY-001-project-begin`): el slug archivado es el nombre del directorio sin el prefijo de fecha.
- **`/story-split`** conserva el ID en la historia core y le puede cambiar el slug (nota «Regla de reemplazo» de la historia; EPIC-23: STORY-173 y STORY-174 son hermanas del split de STORY-165).
- **Escritores:** STORY-165 D-10 añade `epic-refine (INT-02, INT-03)` al `escritor:` de la sección `historias` del template de épica y `epic-refine (retira referencias rotas, MAD-02)` al de `related:` del template de historia; ninguno cubre el reemplazo de un slug.

## Goals / Non-Goals

**Goals:**
- Con `verdict: NEEDS-REFINEMENT`, detectar en las líneas F2/F3 del índice de `epic.md` y en el `related` de las historias activas de la épica los slugs `STORY-NNN-<slug>` que no existen como directorio en `specs/flow/` ni en `specs/flow/archive/` y que el reporte no cubre, numerarlos `COH-<n>` y planificarlos junto a los hallazgos `H-NNN` // satisface: AC-1, AC-2
- Reemplazarlos por el único directorio con el mismo ID, tras el plan consolidado y con `<archivo>.bak` previo, y registrarlos como `aplicado` en `epic-refine-report.md` // satisface: AC-1, CNF-1
- Llevar a «fuera de alcance · PO» los COH sin reemplazo único, sin escribir el archivo // satisface: AC-2
- Con `verdict: APPROVED`, no ejecutar la detección: AC-2 de STORY-165 sin cambios // satisface: AC-1 (Notas: disparo)
- Detallar la familia COH en `skills/epic-refine/references/coh-corrections.md` y mantener el cuerpo del `SKILL.md` < 500 líneas; UTF-8 sin BOM // satisface: CNF-2, CNF-3

**Non-Goals:**
- Corregir hallazgos que `epic-analyze` sí reporta (INT, MAD de STORY-165; SAL de STORY-173): COH nunca duplica un `H-NNN` (D-3).
- Revisar referencias fuera del índice de `epic.md` y del `related` de los `story.md` de la épica: ni el cuerpo de los `story.md` (`[[…]]`), ni `docs/index.md`, ni el `related` o la línea de referencias de `epic.md`.
- Referencias a slugs de épica (`EPIC-NN-<slug>`) y referencias por ID sin slug (`STORY-301`): no son slugs de historia que un `/story-split` deje obsoletos.
- Cambiar `status`/`substatus` (CS-15) o modificar historias archivadas.
- Ejecutar `/story-split` o detectar historias que convenga dividir (D-7, CR-002).
- Cambiar `skills/epic-analyze/`.

## Decisions

### D-1 — Extensión por origen propio + catálogo `coh-corrections.md` // satisface: AC-1, AC-2, CNF-3

Cambios en `skills/epic-refine/` (archivos creados por STORY-165):

| Archivo | Acción | Cambio | AC |
|---|---|---|---|
| `skills/epic-refine/SKILL.md` | modificar | Paso 3: tras extraer los `H-NNN`, una sub-sección «Detección COH» de ≤ 10 líneas que remite a `references/coh-corrections.md` y solo corre con `NEEDS-REFINEMENT` (el gate del Paso 2 ya terminó con `APPROVED`). Tabla de enrutamiento (D-4 de STORY-165): fila `COH · Reemplazo del slug por el del único directorio con el mismo ID · PO en los casos de D-5 · coh-corrections.md`. `description`: añadir «y corrige referencias a slugs obsoletos tras un /story-split» sin superar 500 caracteres. Ningún Paso nuevo | AC-1, AC-2, CNF-3 |
| `skills/epic-refine/references/coh-corrections.md` | crear | Ámbito de detección, forma del slug, existencia, exclusión de lo reportado, numeración, regla de reemplazo, forma del cambio y casos «fuera de alcance» (D-2 a D-5) | AC-1, AC-2, CNF-3 |
| `skills/epic-refine/assets/epic-refine-report-template.md` | modificar | Comentario de la sección `hallazgos`: forma de las filas COH (D-6); sin columnas ni secciones nuevas | AC-1, AC-2 |
| `skills/epic-refine/README.md` | modificar | Capacidades: añadir COH | CS-12 |
| `skills/epic-refine/evals/evals.json` | modificar | Casos TC-014…TC-018 (D-8) | AC-1, AC-2, CNF-1 |
| `skills/epic-refine/examples/<caso>/` | crear | Fixtures COH (D-8) | AC-1, AC-2 |

A diferencia de las familias INT, MAD y SAL, COH no llega del reporte: su origen es el propio `epic-refine`. Por eso se engancha en la extracción (Paso 3) y no solo en la tabla; los Pasos 4 a 9 (revalidación, plan, confirmación, escritura, relectura, reporte) lo tratan como un origen más. `coh-corrections.md` se lee siempre que el veredicto sea `NEEDS-REFINEMENT`, porque la detección no sabe de antemano si hay COH; con `APPROVED` o un error del gate no se lee.

| Alternativa | Motivo del rechazo |
|---|---|
| Paso nuevo «Detectar referencias obsoletas» en el `SKILL.md` | STORY-165 D-4 fija la tabla como punto de extensión; un Paso propio duplicaría plan, backup y reporte y alargaría el cuerpo (CNF-3). La sub-sección del Paso 3 solo añade un origen de hallazgos. |
| Añadir la detección a `epic-analyze` (nuevo código de su catálogo) | La historia fija que `COH` es un código de `epic-refine`, no de `epic-analyze`, y lo deja fuera de alcance; cambiaría el veredicto de un gate ya entregado. |
| Script Node que recorra `specs/flow/` y reescriba los slugs | Ningún corrector del repositorio usa script (STORY-165 D-1); exigiría CLI y pruebas propias para dos globs y un reemplazo de token. |

### D-2 — Detección: ámbito, forma del slug y existencia // satisface: AC-1, AC-2

**Ámbito** (único para COH):

| Lugar | Qué se lee | Archivo que se escribiría |
|---|---|---|
| Índice | Las líneas F2/F3 de nivel superior (`- [ ] **STORY-NNN**` / `- [x] **STORY-NNN**`) de la sección de clave `historias` de `epic.md`, localizada por `clave:` como en STORY-165 D-5; el texto completo de la línea, incluido lo que `epic-analyze` ignora tras el primer token | `epic.md` |
| `related` | Las entradas del `related` del frontmatter (forma de bloque o en línea) de cada `story.md` **activo** del universo de la épica (`epic-analyze` Paso 4.6: listadas en el índice con `story.md` ∪ con `parent` de prefijo `EPIC_ID`), normalizadas como en `epic-analyze` Paso 5c.2 (sin espacios, comillas ni `[[…]]`) | ese `story.md` |

Las historias archivadas no se leen para COH: son registro histórico (STORY-165 D-7) y nunca se escriben.

**Slug de historia:** token `STORY-<≥3 dígitos>-<segmentos>` con segmentos `[a-z0-9]+` separados por `-`, delimitado por un carácter que no sea letra, dígito ni `-` (o el borde de la línea). En `related`, el valor normalizado completo debe tener esa forma. `STORY-301` (sin slug) y `EPIC-NN-<slug>` no son candidatos. El token `**STORY-NNN**` de la línea F2/F3 es un ID, no un slug.

**Existencia:** el slug `S` con ID `STORY-NNN` existe si hay un directorio `specs/flow/S/` o un directorio `specs/flow/archive/<YYYY-MM-DD>-S/` (comparación exacta del nombre, sin glob). Un slug que existe no es COH.

| Alternativa | Motivo del rechazo |
|---|---|
| Comparar con el `slug:` del frontmatter de cada `story.md` | Exige leer todas las historias del repositorio; el nombre del directorio es la identidad que usan los globs de todo el framework (ADR-0017) y basta un `ls`. |
| Detectar también en el cuerpo de los `story.md` y en `docs/` | La historia restringe el alcance al índice y al `related` (Non-Goals); ampliar el ámbito modificaría archivos que el plan no anuncia. |
| Revisar también las historias archivadas | No se modifican; un `related` obsoleto en ellas no afecta a la épica en curso. |

### D-3 — Exclusión de lo que el reporte ya cubre y numeración // satisface: AC-1, AC-2

**Exclusión:** un candidato `(archivo, valor)` no es COH si el reporte contiene un hallazgo MAD-02 cuyo **Elemento** normalizado es igual a `valor` para esa misma historia (el que se corrige por STORY-165, retirándolo). Es el único solapamiento posible: `epic-analyze` resuelve por ID, así que solo reporta un slug cuando su ID no existe en `related` (MAD-02); en el índice el texto tras el primer token nunca entra en sus hallazgos. Esta regla cumple la definición «que `epic-analyze-report.md` no reporta» y evita dos cambios sobre la misma entrada.

**Líneas eliminadas por otro cambio:** si un `C-NN` de INT-03 elimina la línea del índice que contiene el slug, el COH de esa línea se clasifica **ya resuelto** con nota `línea eliminada por C-NN`; el COH de la línea que se conserva se planifica normalmente.

**Agrupación y numeración:**
- Índice: un COH por par `(línea, slug)`; todas las apariciones del mismo slug en esa línea se reemplazan en un único cambio.
- `related`: un COH por par `(historia, valor)`; todas las apariciones del valor en ese `related` se reemplazan en un único cambio (misma regla de agrupación que MAD-02).
- Orden: `epic.md` primero, por número de línea; después los `story.md` por `STORY-NNN` y por la primera línea del valor; dentro de una misma línea, por posición. Se numeran `COH-1`, `COH-2`… tras ordenar. AC-1: `COH-1` = índice de `epic.md`, `COH-2` = `related` de STORY-302.

La numeración COH es independiente de la de `H-NNN` (secuencias distintas en la columna **Origen**).

### D-4 — Regla de reemplazo determinista // satisface: AC-1, AC-2

Para un COH con ID `STORY-NNN`, se listan los directorios `specs/flow/<STORY-NNN>-*/` y `specs/flow/archive/*-<STORY-NNN>-*/` con `story.md` (guion obligatorio tras el ID, los mismos globs que `epic-analyze` Paso 4.4) y se cuentan **en conjunto**:

| Directorios con el mismo ID | Tratamiento |
|---|---|
| Exactamente 1 | **Aplicable.** Reemplazo = nombre del directorio; si está archivado, sin el prefijo `<YYYY-MM-DD>-`. AC-1: `STORY-301-exportar-informe` → `STORY-301-exportar-informe-csv` |
| 0 | **Fuera de alcance · PO**, nota `sin directorio STORY-NNN-* en specs/flow/ ni en specs/flow/archive/: reemplazo no determinable` (AC-2) |
| ≥ 2 | **Fuera de alcance · PO**, nota `varios directorios con el ID STORY-NNN: <lista>` |

Revalidación (Paso 4 de STORY-165): se calcula sobre el filesystem actual. Una re-ejecución tras aplicar el reemplazo ya no detecta el slug (ahora existe), así que no genera COH ni vuelve a escribir.

| Alternativa | Motivo del rechazo |
|---|---|
| Usar el `related` de las hermanas del split para elegir el reemplazo | No determinista: las hermanas también citan a la core y a otras historias; el refinamiento de la historia lo descartó (`story-refinement-log.md`). |
| Con 0 directorios, retirar la entrada como MAD-02 | La historia fija «si no existe ninguno… el hallazgo va al PO»; retirar sin decisión pierde una referencia que el PO puede querer recrear. |
| Con 1 activo y 1 archivado, preferir el activo | La historia exige un **único** directorio; elegir entre dos es una decisión que el skill no toma. |

### D-5 — Forma del cambio y casos «fuera de alcance» // satisface: AC-1, AC-2, CNF-1

**Cambio en el plan (D-6 de STORY-165):** Origen `COH-<n>`, Operación `modificar`.

| Lugar | Ubicación | Antes | Después |
|---|---|---|---|
| Índice | `historias › epic.md:<línea>` | La línea completa | La misma línea con cada aparición del slug (con límite de token) sustituida por el reemplazo; ningún otro carácter cambia (`[[…]]`, comillas invertidas y texto se conservan) |
| `related` | `related › <ruta del story.md>:<línea(s)>` | La entrada o la lista en línea | La entrada con el valor sustituido conservando su envoltorio (comillas, `[[…]]`) y su forma (bloque o en línea) |

El límite de token impide que `STORY-301-exportar-informe` case dentro de `STORY-301-exportar-informe-csv`. Reglas comunes de STORY-165 D-5 y D-7: cambio mínimo, `updated:` del archivo modificado a la fecha de hoy, `status`/`substatus` nunca se escriben, un `.bak` y una sola escritura por archivo aunque reciba cambios de varios orígenes, relectura con restauración global. La relectura añade una comprobación: el slug obsoleto ya no aparece en la ubicación de cada `COH` aplicado.

**Fuera de alcance (`PO`)** — el archivo no se escribe por ese COH:

| Caso | Nota |
|---|---|
| 0 o ≥ 2 directorios con el ID (D-4) | La de D-4 |
| `related` en forma no reconocida | La misma nota de `epic-analyze` Paso 5c.2 |

**Confirmación:** la de STORY-165 D-6 sin cambios: en modo manual el plan único (con los `H-NNN` y los `COH-n`) se confirma una vez; en `--auto` se aplica. Sin `C-NN` (AC-2) solo se escribe `epic-refine-report.md`.

**Contenido no confiable (D-9 de STORY-165):** el slug y la línea se tratan como datos; un texto con forma de orden en la línea del índice se copia literal en **Antes**/**Después** y se registra en `notas`. El reemplazo proviene solo del nombre de un directorio, nunca del texto de la fuente.

### D-6 — Plan y reporte: filas, no columnas // satisface: AC-1, AC-2

`epic-refine-report.md` › `hallazgos` (D-8 de STORY-165) recibe una fila por COH:

| Columna | Valor COH |
|---|---|
| Origen | `COH-<n>` |
| Código | `COH` |
| Severidad | `—` (COH no pertenece al catálogo de `epic-analyze`) |
| Elemento | aplicado: `` `<slug obsoleto>` → `<reemplazo>` `` en `<ubicación>`; fuera de alcance o ya resuelto: `` `<slug obsoleto>` `` en `<ubicación>` |
| Clasificación | `aplicado` · `ya resuelto` · `fuera de alcance` |
| Responsable | `—` si aplicado; `PO` si fuera de alcance (AC-2) |
| Cambios | el `C-NN`, o `—` |

AC-1: filas `COH-1 │ COH │ — │ STORY-301-exportar-informe → STORY-301-exportar-informe-csv en historias › epic.md:<línea> │ aplicado` y `COH-2 … related › STORY-302 … │ aplicado`. AC-2: `COH-1 │ COH │ — │ STORY-310-importar-datos en related › STORY-302 │ fuera de alcance │ PO │ —`, con la nota de D-4 en `notas`. `cambios-aplicados`: un bloque `### C-NN` por COH aplicado con **Antes** y **Después**. Frontmatter: los conteos `findings-*` incluyen los COH.

| Alternativa | Motivo del rechazo |
|---|---|
| Sección propia «Referencias obsoletas» | STORY-165 D-8 fija que las ampliaciones añaden filas; duplicaría `hallazgos` y `cambios-aplicados`. |
| Asignar severidad `WARNING` a COH | Inventaría una severidad que ningún gate evalúa; `epic-refine` no emite veredicto. |

### D-7 — Derivación de historias a dividir // satisface: Non-Goals de la historia

`epic-refine` no ejecuta `/story-split` ni incorpora un detector de «historia que conviene dividir»: ni el reporte de `epic-analyze` ni la historia definen un criterio de detección. La derivación de la nota se materializa con el mecanismo existente: un hallazgo del reporte que requiera dividir una historia queda «fuera de alcance · PO» con su **Acción sugerida** literal (STORY-165 D-4). Ver CR-002.

| Alternativa | Motivo del rechazo |
|---|---|
| Heurística propia (p. ej. ≥ 4 escenarios Gherkin) | Duplica `story-evaluation` (FINVEST) y añade juicio a un corrector determinista. |
| Preguntar en modo manual si se divide una historia | Ningún AC lo pide; introduce una segunda confirmación en un plan que la historia quiere único. |

### D-8 — Escritores, documentación, evals y fixtures // satisface: AC-1, AC-2, CNF-1, CS-12

| Componente | Cambio |
|---|---|
| `docs/templates/epic-template.md` y `skills/epic-creation/assets/epic-template.md` | Añadir `epic-refine (COH: reemplaza slugs obsoletos)` al `escritor:` de la sección `historias`; ambos idénticos (`test/epic-template.test.js`) |
| `docs/templates/story-template.md` y `skills/story-creation/assets/story-template.md` | Añadir `epic-refine (COH: reemplaza slugs obsoletos)` al `escritor:` de `related:`; ambos idénticos |
| `docs/guides/sddf-commands-pipeline.md` §2 | La fila de `epic-refine` (descomentada por STORY-165) incluye la corrección de referencias obsoletas tras un split |
| `skills/epic-analyze/`, `package.json › files` | Sin cambios |

Fixtures nuevos en `skills/epic-refine/examples/` (cada uno un `specs/flow/` mínimo con `EPIC-30-ejemplo/`):

| Fixture | Contenido | `epic-analyze-report.md` |
|---|---|---|
| `split-slug-obsoleto/` | Directorios `STORY-301-exportar-informe-csv`, `STORY-302-*`, `STORY-305-*`, `STORY-306-*`; la línea F2 de STORY-301 termina en `— [[STORY-301-exportar-informe]]`; el `related` de STORY-302 contiene `STORY-301-exportar-informe` | `NEEDS-REFINEMENT` con un único hallazgo fuera de alcance (INT-05 de una línea F1) y sin mención del slug |
| `split-sin-reemplazo/` | El `related` de STORY-302 contiene `STORY-310-importar-datos`; no hay `STORY-310-*` en ningún origen | `NEEDS-REFINEMENT` con INT-05 y **sin** MAD-02 para `STORY-310` (reporte anterior a la referencia, CR-001) |
| `split-ambiguo/` | Como `split-slug-obsoleto/`, con además `archive/2026-10-01-STORY-301-exportar-informe-pdf/` | Igual que `split-slug-obsoleto/` |
| `split-reportado/` | Como `split-sin-reemplazo/`, con el reporte que **sí** lista MAD-02 `STORY-310-importar-datos` | `NEEDS-REFINEMENT`; H-002 MAD-02 |
| `split-aprobada/` | Como `split-slug-obsoleto/` | `APPROVED`, `Sin hallazgos.` |

Casos nuevos en `skills/epic-refine/evals/evals.json` (versión `1.2.0`; la versión exacta sigue a la que dejen STORY-165 y STORY-173):

| Caso | AC | Modo | Esperado (`contains` / `not_contains`) |
|---|---|---|---|
| TC-014 | AC-1, CNF-1 | manual, `s`, sobre `split-slug-obsoleto/` | `COH-1`, `COH-2`, `STORY-301-exportar-informe-csv`, `aplicado`, `epic.md.bak`, `story.md.bak` / `[[STORY-301-exportar-informe]]` en `epic.md`, `STORY-301-exportar-informe` sin `-csv` en el `related` de STORY-302 |
| TC-015 | AC-2 | `--auto` sobre `split-sin-reemplazo/` | `COH-1`, `fuera de alcance`, `PO`, `STORY-310-importar-datos` / `story.md.bak` |
| TC-016 | D-4 | `--auto` sobre `split-ambiguo/` | `varios directorios`, `PO` / `epic.md.bak`, `story.md.bak` |
| TC-017 | D-3 | `--auto` sobre `split-reportado/` | `MAD-02`, `aplicado` / `COH-1` |
| TC-018 | Notas (disparo) | manual, sobre `split-aprobada/` | `no necesita refinamiento` / `COH`, `epic-refine-report.md`, `¿Aplicar el plan?` |

Los evals se ejecutan a criterio humano (`npm run test:eval -- epic-refine`, AGENTS.md).

### Componentes afectados

| Componente | Acción | Ubicación | AC |
|---|---|---|---|
| Skill corrector de épica (detección COH, enrutamiento, `description`) | modificar | `skills/epic-refine/SKILL.md` | AC-1, AC-2, CNF-3 |
| Catálogo de la familia COH | crear | `skills/epic-refine/references/coh-corrections.md` | AC-1, AC-2, CNF-3 |
| Template del reporte de refinamiento | modificar | `skills/epic-refine/assets/epic-refine-report-template.md` | AC-1, AC-2 |
| Ficha del skill | modificar | `skills/epic-refine/README.md` | CS-12 |
| Evals y fixtures COH | modificar / crear | `skills/epic-refine/evals/evals.json`, `skills/epic-refine/examples/split-*/` | AC-1, AC-2, CNF-1 |
| Template de épica (central + seed) | modificar | `docs/templates/epic-template.md`, `skills/epic-creation/assets/epic-template.md` | AC-1 (veracidad de escritores) |
| Template de historia (central + seed) | modificar | `docs/templates/story-template.md`, `skills/story-creation/assets/story-template.md` | AC-1 (veracidad de escritores) |
| Guía de pipeline | modificar | `docs/guides/sddf-commands-pipeline.md` §2 | AC-1 |
| Gate de integridad | sin cambios (consumido) | `skills/epic-analyze/` | AC-1, AC-2 |

### Interfaces y contratos

| Interfaz | Contrato | AC |
|---|---|---|
| Filesystem → detección COH | `ls specs/flow/<slug>/` y `specs/flow/archive/<YYYY-MM-DD>-<slug>/` (existencia exacta); globs `specs/flow/<STORY-NNN>-*/` y `specs/flow/archive/*-<STORY-NNN>-*/` con `story.md` (reemplazo) | AC-1, AC-2 |
| `epic.md` / `story.md` → detección | Líneas F2/F3 de la sección `historias`; entradas de `related` normalizadas (Paso 5c.2 de `epic-analyze`) | AC-1, AC-2 |
| Reporte de análisis → exclusión | Bloques `H-NNN` MAD-02 con **Elemento** = valor y la historia que lo declara | AC-1, AC-2 |
| `SKILL.md` → `coh-corrections.md` | Leído en el Paso 3 solo con `verdict: NEEDS-REFINEMENT` | CNF-3 |
| `epic-refine` → plan / reporte | `C-NN` con Origen `COH-<n>`, Operación `modificar`; fila de `hallazgos` con Código `COH` y **Elemento** `<obsoleto> → <reemplazo>` | AC-1, AC-2 |
| `epic-refine` → disco | `epic.md.bak` / `story.md.bak` antes de escribir; una escritura por archivo; UTF-8 sin BOM | AC-1, CNF-1, CNF-2 |

### Flujos clave

- **F-1 Reemplazar el slug de la core (AC-1):** reporte `NEEDS-REFINEMENT` (INT-05 fuera de alcance) → cargar `coh-corrections.md` → índice: `[[STORY-301-exportar-informe]]` no existe → `related` de STORY-302: mismo slug → ninguno en MAD-02 → `COH-1` (índice), `COH-2` (`related`) → un único `STORY-301-*` (`STORY-301-exportar-informe-csv`) → plan `C-01 epic.md › historias · modificar`, `C-02 STORY-302/story.md › related · modificar` → `s` → `epic.md.bak`, `story.md.bak` → escritura → relectura (slug ausente, status intacto) → reporte `COH-1`, `COH-2` `aplicado` → `Siguiente paso: /epic-analyze EPIC-30`.
- **F-2 Sin reemplazo (AC-2):** `--auto` → `STORY-310-importar-datos` no existe, el reporte no lo lista → `COH-1` → 0 directorios `STORY-310-*` → «fuera de alcance · PO» → sin `C-NN` → solo `epic-refine-report.md`; `story.md` de STORY-302 intacto.
- **F-3 Ya reportado (D-3):** MAD-02 lista el valor → no se genera COH; STORY-165 lo retira.
- **F-4 Aprobada:** `APPROVED` → fin en el Paso 2; ni detección ni archivos.
- **F-5 Degradación (P7):** `coh-corrections.md` ausente → `❌ Catálogo references/coh-corrections.md no encontrado` antes de escribir; `related` no reconocido → «fuera de alcance · PO»; relectura fallida → restauración global (D-7 de STORY-165).
- **Puntos de cambio (P6):** otro lugar de referencias (p. ej. cuerpo de `story.md`) → una fila en la tabla de ámbito de D-2; otra regla de reemplazo → solo D-4 en `coh-corrections.md`; nuevo formato de archivo → solo la regla de existencia de D-2.

## Decisiones de complejidad justificada

- **Exclusión por MAD-02 (D-3):** una comparación más por candidato evita dos cambios sobre la misma entrada (retirar y reemplazar) y cumple la definición de la historia.
- **Existencia por nombre exacto + reemplazo por ID:** dos consultas al filesystem en lugar de leer frontmatters; son las únicas que la regla determinista de la historia necesita.
- **Límite de token en el reemplazo:** imprescindible porque el reemplazo suele contener al slug obsoleto como prefijo (`…-informe` → `…-informe-csv`).
- **Carga de `coh-corrections.md` con todo `NEEDS-REFINEMENT`:** la detección necesita sus reglas antes de saber si hay COH; el coste es una lectura y el cuerpo del `SKILL.md` no crece (CNF-3).

## Contratos de verificación

| # | Criterio | Método | AC |
|---|---|---|---|
| V-1 | COH-1 y COH-2 aplicados con el slug de la core, `.bak` y reporte `aplicado` | Eval TC-014 | AC-1, CNF-1 |
| V-2 | Reemplazo no determinable: `fuera de alcance · PO` y `story.md` intacto | Evals TC-015, TC-016 | AC-2 |
| V-3 | Un valor reportado como MAD-02 no genera COH | Eval TC-017 | AC-1 (definición) |
| V-4 | Con `APPROVED` no hay detección ni archivos | Eval TC-018 | AC-1 (Notas: disparo), CS-15 |
| V-5 | UTF-8 sin BOM en archivos creados y modificados | `npm run verify:repository` / revisión de los primeros bytes | CNF-2 |
| V-6 | `SKILL.md` < 500 líneas y detalle COH en `references/coh-corrections.md` | `wc -l skills/epic-refine/SKILL.md`; revisión | CNF-3 |
| V-7 | Templates central = seed tras añadir los escritores | `npm test` (`test/epic-template.test.js`); `cmp docs/templates/story-template.md skills/story-creation/assets/story-template.md` | AC-1 |
| V-8 | `npm run verify:repository` y `npm test` en verde | Comandos | CS-21 |

## Risks / Trade-offs

- [STORY-165 o STORY-173 cambian su diseño durante la implementación] → esta historia depende del Paso 3 (extracción), la tabla de enrutamiento, la columna **Origen** del plan, D-7 y las secciones del reporte; un cambio en ellos exige revisar D-1 y D-6 antes de implementar.
- [Un slug de otra épica en el índice o en `related` también se corrige] → la regla es la misma para cualquier historia: el reemplazo es determinista y solo cambia el sufijo del mismo ID.
- [Un slug obsoleto en el cuerpo de un `story.md` o en `docs/` persiste] → fuera de alcance por decisión de la historia; un punto de cambio documentado (D-2).
- [Varias historias del mismo ID (activa + archivada) bloquean la corrección] → va al PO con la lista de directorios; es el caso seguro.

## Open Questions

Ninguna. El ámbito y la forma del slug (D-2), la exclusión (D-3), el reemplazo (D-4) y la forma del cambio (D-5) quedan fijados.

## Autoevaluación (P9, P10)

- **Omisiones:** AC-1 (D-2…D-6, F-1, V-1), AC-2 (D-4, D-5, F-2, V-2), CNF-1 (D-5, V-1), CNF-2 (D-5, V-5), CNF-3 (D-1, V-6); disparo con `APPROVED` (D-1, F-4, V-4); Non-Goals respetados (no se tocan hallazgos reportados, estados, archivadas ni `docs/`; no se divide).
- **Ambigüedad:** «no reporta» se define por la exclusión MAD-02 (D-3); «único directorio» cuenta ambos orígenes (D-4).
- **Nombres:** «referencia obsoleta» = `COH-<n>`; «slug» = token `STORY-NNN-<segmentos>`; «reemplazo» = nombre del único directorio con el mismo ID; «ámbito» = índice F2/F3 + `related` de historias activas.
- **Estructura:** sin ciclos (`epic-refine` lee filesystem, `epic.md`, `story.md` y el reporte; nunca invoca a `epic-analyze`). `coh-corrections.md` tiene una sola razón de cambio (reglas COH); el `SKILL.md` gana una sub-sección de detección y una fila de enrutamiento.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: inconsistencia / ambigüedad
- **Descripción**: en AC-2, `STORY-310-importar-datos` no tiene ningún directorio `STORY-310-*`; un `/epic-analyze` actualizado lo reportaría como MAD-02 (resolución por ID, `skills/epic-analyze/SKILL.md:244`) y STORY-165 lo retiraría, modificando el `story.md` que AC-2 exige intacto. El escenario solo se cumple si el reporte no lista ese valor (p. ej. la referencia se añadió después del análisis; STORY-165 D-2 emite el aviso de reporte desactualizado). El diseño define la exclusión (D-3) y el fixture `split-sin-reemplazo/` usa un reporte que no lista el valor; `split-reportado/` cubre el caso contrario.
- **Documento afectado**: story.md (AC-2) / design.md
- **Acción requerida**: opcionalmente añadir a AC-2 «Y "epic-analyze-report.md" no reporta esa referencia»; ningún cambio de diseño.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: los Non-Goals dicen que `epic-refine`, si detecta una historia que conviene dividir, la deriva a `/story-split` (con confirmación en modo manual) o al PO (en `--auto`), pero no definen cómo se detecta y ningún hallazgo de `epic-analyze` lo señala. El diseño no añade detector (D-7): todo hallazgo que lo requiera queda «fuera de alcance · PO» con su **Acción sugerida**.
- **Documento afectado**: story.md (Non-Goals)
- **Acción requerida**: si el PO quiere un detector, especificarlo en una historia nueva.

### CR-003
- **Tipo**: dependencia
- **Descripción**: reemplazar slugs en el índice y en `related` obliga a añadir `epic-refine` (COH) a los escritores de la sección `historias` del template de épica y de `related:` del template de historia, con sus seeds; la historia no lo menciona.
- **Documento afectado**: tasks.md
- **Acción requerida**: incluir la tarea y comprobar la igualdad central = seed.

### CR-004
- **Tipo**: dependencia
- **Descripción**: `skills/epic-refine/` no existe todavía; los archivos que esta historia modifica los crea STORY-165.
- **Documento afectado**: tasks.md
- **Acción requerida**: la primera tarea verifica que STORY-165 esté implementada (Paso 3 de extracción, tabla de enrutamiento y columna **Origen** del plan) antes de modificar el skill.

### CR-005
- **Tipo**: inconsistencia (detectada en IMPLEMENT)
- **Descripción**: D-8 describe los reportes de los fixtures como `NEEDS-REFINEMENT` «con un único hallazgo fuera de alcance (INT-05)», pero `epic-analyze` Paso 6 declara `APPROVED` con 0 ERROR y ≤ 3 WARNING, e INT-05 es WARNING. Para que los reportes sean coherentes con el gate, los fixtures `split-slug-obsoleto/`, `split-sin-reemplazo/`, `split-ambiguo/` y `split-reportado/` añaden al índice una línea `**STORY-307**` sin `story.md` (H-001 INT-01, ERROR, fuera de alcance) antes de la línea F1 (H-002 INT-05); en `split-reportado/` el MAD-02 es H-003. `split-aprobada/` no lleva esas dos líneas, para que `Sin hallazgos.` sea veraz (el slug obsoleto no lo reporta `epic-analyze`). Además, los `not_contains` de TC-014 no pueden excluir el slug obsoleto porque aparece en **Antes** del plan y del reporte; TC-014 comprueba el reemplazo por `contains` (`` `STORY-301-exportar-informe` → `STORY-301-exportar-informe-csv` ``, `[[STORY-301-exportar-informe-csv]]`) y excluye `COH-3`, `MAD-02` y los `.bak` de STORY-305/STORY-306.
- **Documento afectado**: design.md (D-8)
- **Acción requerida**: ninguna; los conteos esperados de los evals (`FUERA-DE-ALCANCE`) incluyen INT-01 e INT-05.
