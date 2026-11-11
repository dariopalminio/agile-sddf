---
type: bug
id: BUG-002
slug: BUG-002-story-implement-omite-pruebas-tdd
title: "story-implement no ejecuta las pruebas del ciclo TDD"
created: 2026-11-08
updated: 2026-11-08
status: COMPLETED
substatus: DONE
parent: null
related:
  - FR-040-implementacion-guiada-por-tdd
  - NFR-018-verificacion-demostrada-no-declarada
  - plan-06-configure-story-verify-with-config-file
---

## Título: story-implement no ejecuta las pruebas del ciclo TDD

Las fases RED, GREEN y REFACTOR de `story-implement` leen los comandos de prueba de `defaults.{type}.command`, una clave que no existe desde el 2026-06-07.

## Resumen (opcional)

`story-implement` busca el comando de cada tipo de prueba en `defaults.{type}.command` de `sddf.config.yaml`. Desde el commit `805a17af` (2026-06-07), los comandos se declaran en `verify.{type}.command` y `defaults` solo contiene `delivery-model`. Sin comando, el skill omite las confirmaciones RED y GREEN, no actualiza `testcases.md` y registra «sin regresiones» en REFACTOR sin haber ejecutado nada. El ciclo TDD que promete FR-040 se reduce a generar pruebas y código sin ejecutarlos.

## Ambiente

- **Versión del producto**: 5.1.1
- **Navegador**: No aplica; el defecto está en las instrucciones de `skills/story-implement/SKILL.md`.
- **Paquetes y versiones instalados**: Agile SDDF v5.1.1
- **Sistema operativo**: Independiente del sistema; detectado en Windows 11 por análisis estático del skill y de los informes archivados.

## Pasos para reproducir

1. Partir de un `sddf.config.yaml` con el esquema actual (el de este repo o el que genera `/sddf-init`): comandos en `verify.{type}.command` y un generador activo en `implement.test_generators`, por ejemplo `type: unit` con un skill configurado y `verify.unit.command` definido.
2. Ejecutar `/story-implement STORY-NNN` sobre una historia en `READY-FOR-IMPLEMENT/DONE`.
3. Seguir al pie de la letra el Paso 5 (confirmar RED), el Paso 9b (confirmar GREEN) y la verificación de no-regresión de la fase REFACTOR.
4. Revisar la salida y `implement-report.md`.

También se reproduce de forma estática, sin ejecutar el skill: ver «Evidencias».

## Resultado observado

Para cada tipo de prueba generado, el skill no encuentra el comando:

- **RED:** `[INFO] Sin comando configurado para tipo '{tipo}' — confirmación de RED omitida` (`skills/story-implement/SKILL.md:538-541`). No comprueba que las pruebas nuevas fallen antes de implementar.
- **GREEN:** `[INFO] confirmación GREEN omitida para tipo '{tipo}' — sin comando configurado` (`SKILL.md:855-858`). No comprueba que pasen, y no actualiza las casillas de `## Test Cases Progress for` en `testcases.md`, porque esa actualización está dentro de la rama «el comando existe» (`SKILL.md:839-848`).
- **REFACTOR:** no ejecuta la verificación de no-regresión. Como ningún tipo informa regresiones, `$REFACTOR_REGRESIONES` queda en `false` (`SKILL.md:953-968`) y la historia pasa a `IMPLEMENT/DONE`.

## Resultado esperado (opcional)

El skill lee el comando del bloque `verify`, el mismo que usa `story-verify` (`skills/story-verify/SKILL.md:242-244`), y ejecuta la confirmación RED (exit ≠ 0), la GREEN (exit 0) y la no-regresión de REFACTOR. Un tipo sin comando ejecutable se registra en `implement-report.md` como no ejecutado, con su motivo, en lugar de omitirse en silencio.

## Evidencias (opcional)

Solo `story-implement` usa la clave antigua:

```text
$ grep -rn "defaults.{type}.command" skills/
skills/story-implement/SKILL.md:533:1. Leer `defaults.{type}.command` de `sddf.config.yaml`
skills/story-implement/SKILL.md:834:1. Leer `defaults.{type}.command` de `sddf.config.yaml`
skills/story-implement/SKILL.md:956:1. Leer `defaults.{type}.command` de `sddf.config.yaml`
```

En todas las configuraciones del esquema actual, `defaults` solo contiene `delivery-model`: `sddf.config.yaml:7-8`, `skills/sddf-init/assets/sddf.config.yaml.template:6-7`, `skills/sddf-init/assets/sddf.config.yaml.example:4-5` y el ejemplo de `README.md:435-436`.

Antes de `805a17af`, los comandos sí estaban en `defaults` (`git show 805a17af~1:sddf.config.yaml`):

```yaml
defaults:
  unit:
    command: "pnpm run test:unit"
    required: false
```

En el archivo, el agente compensó ejecutando `npm test` por su cuenta y dejándolo en texto libre en `implement-report.md`: STORY-097 (119/119), STORY-098 (132/132), STORY-101 (170/170) y STORY-102 (187/187).

## Datos de prueba (opcional)

- Configuración de este repo: el único generador activo es `eval` (`skill-test-evals`), con `verify.eval.command: "npm run test:eval"` y `required: false`.
- Plantilla de `sddf-init`: `verify.component` declara `command_template` con `{{test_file_path}}`, no `command`.
- Ningún eval ni ejemplo de `story-implement` incluye un `sddf.config.yaml` con comandos de prueba.

## Contexto adicional (opcional)

### Análisis de causa raíz (RCA)

Análisis del 2026-11-08 con dos cadenas de 5 porqués (por qué ocurre y por qué no se detectó) y un Ishikawa de resumen. No incluye código de corrección.

**Problema.** Desde el 2026-06-07, en todo proyecto con el esquema actual de `sddf.config.yaml`, `story-implement` no ejecuta ninguna prueba en RED, GREEN ni REFACTOR y aun así deja la historia en `IMPLEMENT/DONE`.

**Componente que falló.** `skills/story-implement/SKILL.md`, en sus tres lecturas del comando: Paso 5 (línea 533), Paso 9b (línea 834) y la no-regresión de REFACTOR (línea 956). Es el único skill que lee `defaults.{type}.command`, antes y después del cambio de esquema (`git grep -n "defaults\." 805a17af~1 -- .claude/skills` solo devuelve esas tres líneas). La clave nace con el skill (`111b2d13`, 2026-05-30, «new skill story-implement-tdd») y sobrevive al renombrado (`f453ec82`).

#### 5 porqués: por qué ocurre

1. **¿Por qué no se ejecutan las pruebas?** Porque el skill no encuentra comando para ningún tipo y toma la rama «sin comando»: `[INFO]` en RED (`SKILL.md:538-541`) y en GREEN (`SKILL.md:855-858`). En REFACTOR ni siquiera hay rama: el punto 2 solo dice «Si existe, ejecutar» (`SKILL.md:957`), y `$REFACTOR_REGRESIONES = false` se registra porque ningún tipo informó regresiones (`SKILL.md:968`).
2. **¿Por qué no encuentra comando?** Porque lee `defaults.{type}.command`, y desde `805a17af` los comandos están en `verify.{type}`. En `defaults` solo queda `delivery-model`.
3. **¿Por qué no se actualizó `story-implement` con la migración?** Porque plan-06 de EPIC-16 trató `sddf.config.yaml` como configuración propia de `story-verify`. Su sección «Archivo a modificar» nombra solo `.claude/skills/story-verify/SKILL.md`, su «Verificación» cubre solo casos de `story-verify`, y el commit no toca `story-implement`. No hubo análisis de impacto sobre los demás lectores de la clave, aunque un solo `grep` habría encontrado las tres lecturas.
4. **¿Por qué el cambio pudo romper a un lector sin que fallara nada?** Porque `sddf.config.yaml` no tiene un contrato de claves. Ningún documento lista sus claves ni qué skill lee cada una: `docs/architecture/tech-stack.md:47-56` solo muestra `implement`. Y `scripts/verify-config-contract.js` valida valores (que `required` sea booleano y que los scripts npm/pnpm requeridos existan), pero no que existan las claves que leen los skills.
5. **¿Por qué una clave ausente no produce un error?** Porque el diseño original eligió fallar abierto. `STORY-078/design.md:243` equipara «el comando no existe» con `required: false` y lo resuelve con un `[INFO]` que no bloquea la fase. El skill no distingue entre «el proyecto no configuró este tipo» y «busco en el lugar equivocado», así que una clave obsoleta desactiva el gate sin aviso. Además, `story-implement` ignora `required`: ejecuta cualquier comando que encuentre. `story-verify`, en cambio, solo ejecuta los tipos con `required: true` (`skills/story-verify/SKILL.md:242-244`). Los dos lectores del mismo bloque aplican reglas distintas.

#### 5 porqués: por qué no se detectó

1. **¿Por qué no lo detectó ningún eval?** Porque los casos no ejercen la lectura del comando. De los 37 casos de `skills/story-implement/evals/evals.json`, 35 traen `sddf_config` pero ninguno incluye un bloque `verify` ni `defaults`, y 31 dan el resultado de las pruebas ya resuelto (`red_confirmed`, `tests_pass_after_green`, `tests_pass_after_refactor`). Por ejemplo, TC-006 espera que se detecten regresiones aunque su configuración no tiene ningún comando que ejecutar.
2. **¿Por qué los evals simulan el resultado en vez de la configuración?** Porque los casos de STORY-078 que partían de la configuración (`testcases.md:41-43`: UT-009, UT-010 y UT-011, con `defaults.unit.command`) nunca llegaron a `evals.json`. `git log -S` no encuentra ningún commit que añada «Sin comando configurado» o «estado rojo» a un `evals.json`. Con un oráculo que ya sabe si las pruebas pasan, los evals no dependen de la clave que lea el skill.
3. **¿Por qué no lo detectó el uso real?** Porque el agente compensa: ejecuta `npm test` por iniciativa propia y anota el resultado en texto libre en `implement-report.md` (STORY-097, 098, 101 y 102). El reporte se ve verde aunque el skill no haya ejecutado nada. La evidencia depende del modelo, justo lo que NFR-018 prohíbe.
4. **¿Por qué no lo detectó el uso en este repo?** Porque aquí el único generador activo es `eval` (`skill-test-evals`), con `verify.eval.command` y `required: false`. Como en este repo nadie espera que `story-implement` ejecute pruebas, su ausencia pasa por comportamiento correcto.

#### Ishikawa (resumen)

| Categoría | Causa | Evidencia |
|---|---|---|
| Método (gestión del cambio) | La migración del esquema no analizó el impacto sobre los demás lectores de la clave | plan-06, «Archivo a modificar»; `805a17af --name-only` |
| Diseño del skill | Fallo abierto: un comando ausente es solo `[INFO]`; REFACTOR no tiene rama «sin comando»; se ignora `required` | `STORY-078/design.md:243`; `SKILL.md:953-968` |
| Contrato de configuración | Ni se documenta ni se valida qué claves de `sddf.config.yaml` lee cada skill | `verify-config-contract.js`; `tech-stack.md:47-56` |
| Medición (evals) | Resultados de prueba simulados; ningún fixture incluye comandos | 31/37 casos con resultado dado; 0/37 con `verify` o `defaults` |
| Entorno (agente) | El modelo compensa y oculta el fallo | `implement-report.md` de STORY-097, 098, 101 y 102 |
| Material (configuración dogfood) | El único generador activo es `eval` con `required: false`, así que no ejecutar nada parece normal | `sddf.config.yaml:40-53` |

#### Causas raíz

- **CR-1 (directa):** la clave obsoleta `defaults.{type}.command` en las tres lecturas de `skills/story-implement/SKILL.md` (líneas 533, 834 y 956).
- **CR-2 (de diseño):** el skill falla abierto y en silencio cuando no encuentra un comando. Cualquier desajuste de esquema desactiva el gate TDD en lugar de bloquearlo o advertirlo, y la regla de `required` no coincide con la de `story-verify`.
- **CR-3 (sistémica):** `sddf.config.yaml` no tiene un contrato de claves con sus lectores. No se documenta, y el gate determinista no lo valida.
- **CR-4 (de detección):** los evals de `story-implement` simulan el resultado de las pruebas en vez de la configuración, así que ningún caso falla si el skill lee la clave equivocada.

#### Implicaciones para el plan de corrección

- La «Corrección propuesta» de abajo cubre CR-1 (punto 1), CR-2 (puntos 2 y 3) y CR-4 (punto 4). Para que el punto 4 cubra CR-4, el fixture debe declarar los comandos **solo** en `verify`, de modo que un skill que lea `defaults` falle el caso. También debe haber un caso en que el resultado dependa de ejecutar el comando, no de un `tests_pass_after_*` ya resuelto.
- La no-regresión de REFACTOR necesita una rama explícita para el comando ausente (hoy no tiene ninguna). Si no, `$REFACTOR_REGRESIONES = false` sigue siendo cierto por vacuidad.
- CR-3 no está cubierta. El plan debe decidir si `scripts/verify-config-contract.js` (o una prueba) comprueba que las claves de `sddf.config.yaml` citadas en los `SKILL.md` existan en `skills/sddf-init/assets/sddf.config.yaml.template`, o si se registra como mejora aparte.

**Triaje propuesto.** Severidad media: no rompe la ejecución, pero desactiva sin aviso el gate TDD del skill de FR-040 en todo proyecto con el esquema actual de configuración. Prioridad alta: la sección «Pruebas ejecutadas» que propone mejora-017 (`.temp/propuestas-de-mejoras/mejora-017-resumen-para-pr.md`, sin versionar) depende de estos comandos.

**Trampa para la corrección.** Si solo se cambia la clave, en este repo `story-implement` ejecutaría `npm run test:eval` (los evals de todos los skills, con cuota de LLM) en RED, GREEN y REFACTOR, porque `eval` es el único generador activo. Eso contradice la regla de `AGENTS.md` de ejecutar los evals a mano. Hoy, paradójicamente, la clave rota es lo que lo evita.

**Corrección propuesta.**

1. Leer `verify.{type}` en el Paso 5, el Paso 9b y la no-regresión de REFACTOR.
2. Aplicar la regla de `story-verify`: ejecutar solo los tipos con `required: true` y un comando real. Con `required: false`, `command: manual` o el tipo sin configurar, registrar «no ejecutado — <motivo>» en `implement-report.md`. En este repo, los evals seguirían siendo manuales.
3. Con `command_template`, sustituir `{{test_file_path}}` por los archivos de prueba generados en esa fase, o registrar el tipo como no ejecutado.
4. Escribir primero los casos de eval (principio 11 de la constitución), con un `sddf.config.yaml` de fixture que cubra: comando presente (RED en rojo, GREEN en verde, REFACTOR sin regresiones), `required: false`, `command: manual` y tipo ausente.

**Fuera de alcance.** Que `story-implement-tasks` ejecute pruebas y la sección «Pruebas ejecutadas» de `implement-report.md`: ambas están en mejora-017.

**Coordinación.** EPIC-29 modifica el mismo `SKILL.md` en otros pasos (estados de entrada y rework). Este arreglo toca solo las tres lecturas del comando y sus evals.
