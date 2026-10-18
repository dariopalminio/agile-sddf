---
name: story-fix-plan
description: >-
  Corrige design.md, tasks.md y testcases.md aplicando los hallazgos de analyze.md (inconsistencias, recomendaciones, DoD PLAN), con backup y fix-plan-report.md.
  Usar cuando story-analyze reporta advertencias o inconsistencias.
  Invocar para "story-fix-plan", "corregir plan de historia", "aplicar analyze" o "corrige advertencias/warnings".
---

# Skill: `/story-fix-plan`

**Cuándo usar este skill:**
- Cuando `/story-analyze` dejó en `analyze.md` el veredicto `verdict: NEEDS-CHANGES` y se quiere corregir el plan antes de implementar.
- Cuando el usuario dice "story-fix-plan STORY-NNN corrige advertencias" o "story-fix-plan STORY-NNN corrige warnings": el veredicto es `APPROVED` pero se quieren resolver los hallazgos WARNING.
- Cuando el usuario dice "story-fix-plan STORY-NNN", "corregir el plan de la historia", "aplicar las recomendaciones de analyze".
- Cuando el Cumplimiento DoD — Fase PLAN tiene criterios `⚠️` o `❌` que se resuelven editando `design.md`, `tasks.md` o `testcases.md`.

## Objetivo

Lee los hallazgos de `analyze.md`, planifica en un único ciclo los cambios mínimos que los resuelven y los aplica sobre los **archivos del plan** —`design.md` más `tasks.md` y/o `testcases.md`, los que existan—, manteniéndolos coherentes entre sí y con `story.md` y registrando el plan en `fix-plan-report.md`.

**Archivos del plan (`$PLAN_FILES`):** `design.md` siempre; `tasks.md` y `testcases.md` solo si existen. Debe existir al menos uno de los dos; pueden existir ambos.

**Qué hace este skill:**
- Lee el `verdict` del frontmatter de `analyze.md` y solo continúa con `NEEDS-CHANGES` o, en modo advertencias, también con `APPROVED`; en el resto de casos termina sin cambios
- Extrae de `analyze.md` las secciones «Inconsistencias Detectadas», «Hallazgos», «Recomendaciones» y las filas `⚠️`/`❌` de «Cumplimiento DoD»
- Unifica esos hallazgos en una lista sin duplicados y clasifica cada uno como aplicable (a uno o más archivos de `$PLAN_FILES`), ya resuelto o fuera de alcance
- Construye un plan de cambios trazable (cambio → hallazgo de origen) y, en modo manual, lo muestra para confirmación
- Crea `<archivo>.bak` de cada archivo que modifica antes de escribir y aplica el plan preservando IDs y referencias cruzadas
- Edita los archivos de `$PLAN_FILES` según el plan de cambios
- Genera `fix-plan-report.md` con `assets/fix-plan-report-template.md` como fuente de verdad

**Qué NO hace este skill:**
- Modificar `analyze.md`, `story.md`, `epic.md` ni ningún archivo fuera de `$PLAN_FILES`
- Crear `tasks.md` o `testcases.md` cuando no existen (eso corresponde a `/story-tasking` y `/story-testcases`)
- Cambiar `status` o `substatus` del frontmatter (la transición la decide `/story-analyze`)
- Ejecutar `/story-analyze` tras la corrección
- Implementar código, marcar tareas como hechas ni cambiar el estado de los casos de prueba

## Entrada

| Artefacto | Ubicación | Requerido |
|---|---|---|
| `analyze.md` | `$SPECS_BASE/specs/stories/<STORY-NNN>-*/analyze.md` | ✓ obligatorio |
| `design.md` | `$SPECS_BASE/specs/stories/<STORY-NNN>-*/design.md` | ✓ obligatorio |
| `tasks.md` | `$SPECS_BASE/specs/stories/<STORY-NNN>-*/tasks.md` | condicional — al menos uno de `tasks.md` o `testcases.md` |
| `testcases.md` | `$SPECS_BASE/specs/stories/<STORY-NNN>-*/testcases.md` | condicional — al menos uno de `tasks.md` o `testcases.md` |
| `story.md` | `$SPECS_BASE/specs/stories/<STORY-NNN>-*/story.md` | opcional — solo lectura, para verificar los AC citados |
| `assets/fix-plan-report-template.md` | `$CLI_ROOT/skills/story-fix-plan/assets/fix-plan-report-template.md` | ✓ obligatorio |

## Parámetros

- `<STORY-NNN>` o `--story-id <STORY-NNN>`: ID de la historia (ej. `STORY-138`). Obligatorio.
- `--auto`: aplica el plan sin pedir confirmación. Es el comportamiento cuando lo invoca un orquestador.
- `--warnings`: **modo advertencias**. Se activa también cuando la invocación incluye, en lenguaje natural, «corrige advertencias», «corregir advertencias», «corrige warnings» o «corregir warnings» (sin distinguir mayúsculas). Permite continuar con `verdict: APPROVED` para resolver sus hallazgos WARNING. Sin este modo, `APPROVED` termina sin cambios.

## Precondiciones

- La raíz de artefactos debe resolverse mediante el contrato local antes de continuar.
- La historia existe bajo `$SPECS_BASE/specs/stories/` y su directorio contiene `analyze.md` y `design.md`.
- El directorio contiene `tasks.md`, `testcases.md` o ambos.

## Dependencias

- Templates: [`assets/fix-plan-report-template.md`]

## Modos de ejecución

- **Manual**: `/story-fix-plan STORY-NNN` — muestra el plan de cambios y pide confirmación antes de escribir.
- **Advertencias**: `/story-fix-plan STORY-NNN corrige advertencias` (o `--warnings`) — igual que el modo manual o `--auto`, pero también corrige un `analyze.md` con `verdict: APPROVED` que tenga hallazgos WARNING.
- **Automático**: `/story-fix-plan STORY-NNN --auto` o invocado por un orquestador — aplica el plan y reporta al terminar.

## Restricciones / Reglas

- **`analyze.md` es solo lectura** en todo el flujo; también `story.md` y `epic.md`.
- **Solo se escriben** los archivos de `$PLAN_FILES`, sus `.bak` y `fix-plan-report.md`. Un archivo del plan ausente nunca se crea: los hallazgos que lo requieren quedan fuera de alcance.
- **Planificar antes de escribir:** todos los hallazgos se resuelven en un único plan; nunca se escriben cambios parciales hallazgo por hallazgo.
- **Backup primero:** cada archivo que el plan modifica se copia a `<archivo>.bak` (sobrescribiendo uno anterior) antes de escribirlo. Un archivo que el plan no toca no recibe backup.
- **Cambio mínimo:** se edita solo lo que el hallazgo exige; las secciones válidas no se reescriben ni se reordenan.
- **Guía semántica, no sustitución literal:** la «Acción requerida» y la recomendación orientan el cambio; el texto final debe encajar con el estilo y la estructura del archivo.
- **IDs estables:** nunca se renumeran tareas (`TNNN`), decisiones (`D-N`), contratos (`V-N`), casos de prueba (`UT-NNN`, `CT-NNN`, `IT-NNN`, `API-NNN`, `E2E-NNN`, `EV-NNN`, `ST-NNN`) ni otros IDs. Un elemento nuevo toma el siguiente ID libre de su prefijo; uno eliminado deja su ID sin reutilizar.
- **Referencias cruzadas completas:** al eliminar, renombrar o cambiar un elemento, se actualizan todas sus menciones en todos los archivos de `$PLAN_FILES` (`requiere T026`, rangos como `T012–T017`, tablas de trazabilidad, contratos que la tarea cita, columna `Ref` de `testcases.md`).
- **Coherencia entre archivos del plan:** si un cambio en `design.md` altera lo que una tarea ejecuta o verifica, o lo que un caso de prueba espera en `Entonces`, esa tarea o ese caso se actualiza en el mismo plan, y viceversa.
- **Trazabilidad:** todo elemento de diseño nuevo lleva su anotación `// satisface: AC-N` (o la forma que ya use el archivo); toda tarea nueva sigue el formato del archivo (`- [ ] TNNN [P]? <acción> (requiere …) — <trazas>`) y es atómica; todo caso de prueba nuevo es una fila completa de la «Tabla de casos» (`ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref`) con `Ref` a un AC, D-N o tarea existente.
- **Estructura derivada de `testcases.md`:** al añadir o eliminar casos, se recalculan los conteos de «Resumen de cobertura» y se sincroniza la checklist de «Test Cases Progress» (un caso nuevo entra como `[ ]`; uno eliminado sale de la lista).
- **Estado de checkboxes intacto:** no se marcan ni desmarcan tareas existentes ni se cambia el estado (`[x]`, `[ ]`, `[!]`) de los casos de prueba existentes.
- **Frontmatter:** en cada archivo modificado solo cambia `updated:` (fecha actual, `YYYY-MM-DD`).
- **Sin marcadores en el contenido:** no se añaden comentarios del tipo «corregido por INC-001»; el registro externo es `fix-plan-report.md`.
- **Fuera de alcance explícito:** un hallazgo cuya acción exige tocar otro archivo no se aplica; se registra con el skill o responsable sugerido.
- **Encoding:** todo `.md` generado se guarda en **UTF-8 sin BOM**. Caracteres como `Ã³` o `ðŸ“–` indican un error de encoding que debe corregirse.

---

## Flujo de ejecución

### Paso 0 — Resolver contexto local

<!-- SDDF-ROOT-RESOLUTION: v1 -->

Resuelve una sola vez `REPO_ROOT` y el contexto local antes de leer o escribir artefactos:

1. Si `SDDF_ROOT` está definida, exige un valor no vacío que apunte a un directorio accesible; úsalo como `SPECS_BASE` y registra `ROOT_SOURCE = SDDF_ROOT`. Si no es utilizable, informa la fuente y el valor y detén el workflow antes de cualquier escritura.
2. Solo si `SDDF_ROOT` no está definida, lee `<REPO_ROOT>/sddf.config.yaml`. Si su clave superior `root` existe, debe ser un escalar no vacío que resuelva a un directorio accesible (las rutas relativas se anclan en `REPO_ROOT`); úsalo como `SPECS_BASE` y registra `ROOT_SOURCE = sddf.config.yaml`. Una configuración o raíz explícita inválida detiene el workflow sin fallback ni escrituras.
3. Si no existe ninguna fuente explícita, usa `docs` relativo a `REPO_ROOT` y registra `ROOT_SOURCE = default`. Conserva `SPECS_BASE` y `ROOT_SOURCE` durante toda la invocación.
4. Resuelve `CLI_ROOT` independientemente y solo cuando el workflow necesite skills, agentes o comandos del runtime; nunca lo derives de `SPECS_BASE`.

El diagnóstico de entorno se solicita explícitamente con `/skill-preflight`; este workflow no lo invoca en su hot path.

### Paso 1 — Resolver la historia y sus artefactos

1. Si no se proporcionó ID, preguntar y esperar respuesta:
   ```
   ¿Qué historia deseas corregir?
   Proporciona el ID (ej. STORY-138).
   ```
2. Buscar con Glob `$SPECS_BASE/specs/stories/<STORY-NNN>-*/` y tomar el directorio cuyo nombre empieza por el ID. Si no existe:
   ```
   ❌ No se encontró la historia <STORY-NNN> bajo $SPECS_BASE/specs/stories/
   ```
   Detener.
3. Verificar los artefactos en este orden. Ante el primer fallo, emitir el mensaje y detener sin escribir nada:

   | Falta | Mensaje |
   |---|---|
   | `analyze.md` | `❌ No se encontró analyze.md en <ruta>. Ejecuta /story-analyze <STORY-NNN> para generarlo.` |
   | `design.md` | `❌ No se encontró design.md en <ruta>. Ejecuta /story-design <STORY-NNN> para generarlo.` |
   | `tasks.md` **y** `testcases.md` | `❌ No se encontró tasks.md ni testcases.md en <ruta>. Ejecuta /story-tasking <STORY-NNN> o /story-testcases <STORY-NNN> para generar al menos uno.` |

4. Registrar `$PLAN_FILES` = `design.md` + los que existan de `tasks.md` y `testcases.md`, y mostrarlo:
   ```
   ✓ Archivos del plan: design.md, <tasks.md>, <testcases.md>
   ```
   Si falta uno de los dos, indicarlo sin detenerse: `ℹ️ <archivo> no existe — sus hallazgos quedarán fuera de alcance`.

5. Registrar `$MODE`: `advertencias` si se pasó `--warnings` o la invocación incluye «corrige(r) advertencias» o «corrige(r) warnings»; `estándar` en otro caso. En modo advertencias, mostrar `ℹ️ Modo advertencias: también se corrigen los hallazgos WARNING de un analyze.md APPROVED`.

### Paso 2 — Gate de veredicto de `analyze.md`

Leer el frontmatter de `analyze.md` y registrar `$VERDICT` con el valor del campo `verdict` (canónico según el contrato de validación). Si `verdict` no existe, aceptar `veredict` como alias. Registrar también el `updated:` del frontmatter y la línea `**Estado general:**` del cuerpo, que se usan en el resumen y en el reporte.

| `$VERDICT` | Acción |
|---|---|
| `NEEDS-CHANGES` | Continuar al Paso 3 (en ambos modos) |
| `APPROVED` con `$MODE = advertencias` | Continuar al Paso 3 para corregir los hallazgos WARNING |
| `APPROVED` con `$MODE = estándar` | Emitir `ℹ️ <STORY-NNN>: analyze.md declara verdict: APPROVED — no hay cambios encontrados para aplicar. Para corregir sus advertencias: /story-fix-plan <STORY-NNN> corrige advertencias` y terminar |
| Campo ausente | Emitir `ℹ️ <STORY-NNN>: analyze.md no declara verdict: NEEDS-CHANGES en su frontmatter — no hay cambios encontrados para aplicar` y terminar |
| Cualquier otro valor | Emitir `ℹ️ <STORY-NNN>: analyze.md declara verdict: <valor>, no NEEDS-CHANGES — no hay cambios encontrados para aplicar` y terminar |

El veredicto manda sobre `**Estado general:**`: no se infiere un veredicto a partir del cuerpo. El modo advertencias no cambia las dos últimas filas: sin `verdict` o con otro valor, el skill termina igual. Al terminar en este paso no se crea ni modifica ningún archivo.

### Paso 3 — Extraer hallazgos de `analyze.md`

Leer `analyze.md` completo. Extraer cuatro fuentes; los títulos de sección se buscan por coincidencia insensible a mayúsculas y emojis (`## Inconsistencias Detectadas`, `## Hallazgos`, `### Hallazgos`, `## Recomendaciones`, `## Cumplimiento DoD — Fase PLAN` o variantes):

| Fuente | Qué extraer | ID de origen |
|---|---|---|
| Inconsistencias Detectadas | Cada `### INC-NNN [ERROR/WARNING]`: severidad, **Tipo**, **Descripción**, **Archivo afectado** (archivo, sección, línea) y **Acción requerida** | `INC-NNN` |
| Hallazgos | Cada subsección o viñeta: descripción, archivo/sección si se indica, severidad si se indica (si no, `WARNING`) | `HAL-N` |
| Recomendaciones | Cada ítem de la lista. Si cita un `INC-NNN` o `HAL-N`, se adjunta a ese hallazgo como recomendación preferida; si no, es un hallazgo propio | `REC-N` |
| Cumplimiento DoD | Cada fila con estado `⚠️` o `❌`: criterio, severidad y evidencia. Si la evidencia remite a un `INC-NNN`, se adjunta a él en lugar de duplicarlo | `DOD-N` |

Si una sección dice «Sin inconsistencias detectadas» o está ausente, no aporta hallazgos.

### Paso 4 — Gate sin hallazgos

Si la lista unificada está vacía (con `NEEDS-CHANGES`, o con `APPROVED` en modo advertencias sin ningún hallazgo WARNING):
```
ℹ️ <STORY-NNN>: analyze.md declara <$VERDICT> pero no reporta hallazgos accionables — no hay cambios encontrados para aplicar
```
Terminar sin escribir ningún archivo.

### Paso 5 — Leer el plan actual y clasificar hallazgos

1. Leer completos los archivos de `$PLAN_FILES`; leer `story.md` si existe, solo para confirmar los AC y CNF citados.
2. Si el `updated:` de algún archivo de `$PLAN_FILES` es posterior al de `analyze.md`, emitir `⚠️ analyze.md puede estar desactualizado respecto a <archivo>` y continuar: el paso 5.3 descarta lo ya resuelto.
3. Clasificar cada hallazgo:

   | Clasificación | Criterio |
   |---|---|
   | **Aplicable — <archivos>** | La acción requerida o la recomendación se resuelve editando uno o más archivos de `$PLAN_FILES` |
   | **Ya resuelto** | La evidencia citada (tarea, caso, fila, línea, texto) ya no existe o ya cumple lo pedido en el archivo actual |
   | **Fuera de alcance** | La acción exige tocar un archivo que no está en `$PLAN_FILES`. Responsable sugerido: `story.md` → `/story-improve` o PO; `tasks.md` ausente → `/story-tasking`; `testcases.md` ausente → `/story-testcases`; `epic.md` → PO o skills de épica; otro archivo → responsable humano |

   Un hallazgo que afecta a varios archivos se aplica en los que existen; la parte que exige un archivo ausente se registra además como fuera de alcance (por ejemplo, tipo A sin `tasks.md`: se añade el elemento de diseño y el caso de prueba, y la tarea queda pendiente para `/story-tasking`).

   Orientación por tipo de inconsistencia de `story-analyze`:

   | Tipo | Corrección típica |
   |---|---|
   | A — AC sin cobertura en design.md | Añadir o ampliar un elemento de diseño con `// satisface: AC-N`; añadir la tarea que lo implementa (si existe `tasks.md`) y el caso que lo verifica (si existe `testcases.md`) cuando falten |
   | B — Tarea sin diseño | Eliminar la tarea o declarar en design.md el elemento que la justifica, según la opción preferida |
   | C — Diseño sin tarea | Añadir la tarea atómica que lo implementa, en el grupo y orden de dependencia correctos |
   | D — Desalineación con la épica | Normalmente fuera de alcance; aplicable solo si la acción pide ajustar un archivo de `$PLAN_FILES` |
   | E — Criterio DoD PLAN no cumplido | Según el criterio: trazabilidad, decisiones aplazadas, atomicidad de tareas, cobertura de escenarios en testcases… |
   | F — AC sin caso de prueba | Si existe `testcases.md`: añadir el caso que cubre el AC, con `Ref: AC-N`, en el tipo (UT/CT/IT/API/E2E/EV) que corresponda al diseño. Si no existe: fuera de alcance (`/story-testcases`) |
   | Incoherencia design ↔ testcases | Alinear `Dado`/`Cuando`/`Entonces` o `Ref` del caso con el elemento de diseño, o corregir el diseño si la recomendación lo indica |

4. **Elegir la corrección** cuando el reporte ofrece alternativas («retirar T026, o bien declararla…»): primero la opción que las Recomendaciones señalan como preferida; si no hay preferencia, la de menor cambio que deje todos los archivos del plan coherentes. Registrar la alternativa descartada.

### Paso 6 — Construir el plan de cambios

Para cada hallazgo aplicable, definir uno o más cambios `C-NN` con: origen, archivo, ancla (sección, ID o línea), operación (`añadir`, `modificar`, `eliminar`), contenido concreto y efecto en referencias cruzadas. Antes de cerrar el plan:

- Recorrer todos los archivos de `$PLAN_FILES` buscando cada ID afectado y añadir los cambios de referencia que falten.
- Comprobar que ningún cambio contradice otro ni reintroduce un hallazgo ya resuelto.
- Comprobar que cada AC sigue cubierto en design.md, que cada tarea sigue trazada a un elemento de diseño y que la `Ref` de cada caso de prueba apunta a un AC, D-N o tarea que existe.
- Si el plan añade o elimina casos de prueba, incluir los cambios de «Resumen de cobertura» y «Test Cases Progress».

**Modo manual:** mostrar el plan y esperar confirmación:
```
──────────────────────────────────────────────────
 Plan de cambios: <STORY-NNN>
──────────────────────────────────────────────────
 C-01  INC-001 [ERROR]   tasks.md › 6. Verificación final   eliminar T026
 C-02  INC-002 [WARNING] design.md › Contratos de verificación › V-2   modificar método
 C-03  INC-002 [WARNING] tasks.md › T012   modificar comando (espejo de C-02)
 C-04  INC-005 [WARNING] testcases.md › Tabla de casos   añadir API-004 (Ref: AC-2)
 …
 Fuera de alcance: INC-004 → epic.md (PO)
 Ya resueltos:     <ninguno | lista>
──────────────────────────────────────────────────
 ¿Aplicar el plan? (s / n / editar)
```
Con `n`, terminar sin escribir. Con `editar`, incorporar los ajustes del usuario y volver a mostrar el plan.

**Modo `--auto`:** continuar sin preguntar.

Si ningún hallazgo resulta aplicable (todos fuera de alcance o ya resueltos), emitir `ℹ️ <STORY-NNN>: ningún hallazgo se resuelve en los archivos del plan (<$PLAN_FILES>) — no se realizan cambios`, listar los fuera de alcance con su responsable y terminar sin escribir.

### Paso 7 — Backup y escritura

1. Por cada archivo con al menos un cambio en el plan, escribir `<archivo>.bak` con su contenido actual.
2. Aplicar todos los cambios del plan sobre el contenido en memoria; actualizar `updated:` a la fecha actual; escribir el archivo una sola vez.
3. Releer cada archivo escrito y verificar que cada cambio quedó aplicado y que ningún ID eliminado sigue referenciado. Si algo falla, corregirlo antes de continuar.

Confirmar con una línea por archivo modificado (omitir los que el plan no tocó):
```
✓ Backup creado: design.md.bak, <tasks.md.bak>, <testcases.md.bak>
✓ design.md actualizado (<N> cambios)
✓ tasks.md actualizado (<N> cambios)
✓ testcases.md actualizado (<N> cambios)
```

### Paso 8 — Generar `fix-plan-report.md`

Leer `assets/fix-plan-report-template.md` en tiempo de ejecución y completarlo con el plan aplicado, las alternativas descartadas, los hallazgos ya resueltos y los fuera de alcance. Escribirlo en `<directorio-historia>/fix-plan-report.md` (sobrescribe uno anterior).

### Paso 9 — Resumen en consola

```
──────────────────────────────────────────────────
 story-fix-plan: <STORY-NNN>
──────────────────────────────────────────────────
 Estado previo (analyze.md): verdict <$VERDICT> · <estado general>
 Modo: <estándar | corrige advertencias>
 Archivos del plan: <$PLAN_FILES>
 Hallazgos: <total> · aplicados <N> · ya resueltos <N> · fuera de alcance <N>
──────────────────────────────────────────────────
 Archivos generados / modificados:
   ✓ design.md (+ design.md.bak)
   ✓ tasks.md (+ tasks.md.bak)
   ✓ testcases.md (+ testcases.md.bak)
   ✓ fix-plan-report.md
 Fuera de alcance:
   - INC-004 → epic.md (PO)
──────────────────────────────────────────────────
 Siguiente paso: ejecuta /story-analyze <STORY-NNN>
 para verificar que el plan quedó coherente.
──────────────────────────────────────────────────
```
Omitir las líneas de archivos que el plan no tocó.

---

## Salida

| Artefacto | Ubicación | Condición |
|---|---|---|
| `design.md` / `tasks.md` / `testcases.md` | `$SPECS_BASE/specs/stories/<STORY-NNN>-*/` | Solo los que existen y el plan modifica |
| `<archivo>.bak` | `$SPECS_BASE/specs/stories/<STORY-NNN>-*/` | Uno por cada archivo modificado |
| `fix-plan-report.md` | `$SPECS_BASE/specs/stories/<STORY-NNN>-*/fix-plan-report.md` | Siempre que se aplique al menos un cambio |

Sin `verdict: NEEDS-CHANGES` (o `APPROVED` en modo advertencias), sin hallazgos accionables, con el plan rechazado o con un artefacto obligatorio ausente, no se crea ni modifica ningún archivo.
