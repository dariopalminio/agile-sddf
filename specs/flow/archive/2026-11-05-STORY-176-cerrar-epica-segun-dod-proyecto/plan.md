---
type: plan
slug: plan-cerrar-epica-segun-dod-proyecto
title: "Plan: cerrar una épica según el DoD del proyecto, sin asumir stack ni release"
story: STORY-176-cerrar-epica-segun-dod-proyecto
created: 2026-11-04
updated: 2026-11-04
---

# Plan: cerrar una épica según el DoD del proyecto, sin asumir stack ni release

> **Plan retrospectivo.** Se redactó después de implementar los cambios y describe lo que se hizo, no trabajo por hacer. Salvo el commit `7be7fa7e`, todo sigue sin commit. Los criterios de aceptación viven en [story.md](story.md).

## Archivos que se modifican

**`/epic-ship`**

| Archivo | Cambio |
|---|---|
| `skills/epic-ship/SKILL.md` | Gates de `VALIDATE/DONE` y `SHIP/IN-PROGRESS`, registro de `SHIP/IN-PROGRESS`, análisis de `CHANGELOG.md`, verificación genérica del DoD y confirmación final. Sin versión sugerida, pasos de liberación ni notas de versión |
| `skills/epic-ship/references/release-content.md` | Resultados `escribir` y `al día`, cobertura manual y bloque publicado. Se retiran `valor` y la sección de versión sugerida |
| `skills/epic-ship/assets/release-notes-template.md` | Eliminado, junto con la carpeta `assets/` |
| `skills/epic-ship/evals/evals.json` | Versión 1.3.0 con 21 casos autocontenidos: se añaden TC-009 a TC-022 y se retira TC-007 |

**`/epic-complete`**

| Archivo | Cambio |
|---|---|
| `skills/epic-complete/scripts/epic-complete.js` | La versión pasa a ser opcional, se elimina `NO_VERSION` y `SHIP/IN-PROGRESS` sugiere `/epic-ship` |
| `test/epic-complete.test.js` | Nuevo contrato de versión opcional y sugerencia desde `SHIP/IN-PROGRESS` |
| `skills/epic-complete/SKILL.md` | Resumen y resultado `sin versión`, y confirmación sin afirmar el despliegue |
| `skills/epic-complete/README.md` | Misma semántica de versión opcional |
| `skills/epic-complete/references/error-codes.md` | Se retira `NO_VERSION` y se amplía la sugerencia de `NOT_SHIPPED` |
| `skills/epic-complete/evals/evals.json` | Versión 1.2.0 con 8 casos: cambian TC-001 y TC-004 y se añade TC-008 |

**Guardrail y documentación**

| Archivo | Cambio |
|---|---|
| `docs/guardrails/dod-epic-ship.md` | Creado en el commit `7be7fa7e`; después, los comandos pasan a citarse entre backticks |
| `docs/architecture/state-machine.md` | `SHIP` se define por el DoD del proyecto |
| `docs/guides/sddf-commands-pipeline.md` | Entradas y salidas de `epic-ship` y `epic-complete` |
| `docs/domains/domain-epic-lifecycle.md` | Gate de `SHIP`, reportes y claves de cierre |
| `docs/domains/domain-skills-map.md` | Lecturas, escrituras y transiciones de ambos skills |

**Parte del commit `7be7fa7e`, sin cambio de comportamiento**

- `CHANGELOG.md`: tres entradas de EPIC-23 en `[5.1.0]`.
- `specs/flow/EPIC-23-completar-flujo-de-epic/release-notes.md`: se conserva como histórico.

**Fuera de este plan**

La línea `release: v5.1.0` de `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md` aparece sin commit en el árbol de trabajo, pero no forma parte de estos pasos. Revisarla antes de hacer el commit.

## Orden de trabajo

1. **Definir el DoD de `SHIP` (commit `7be7fa7e`).** Se creó `dod-epic-ship.md` y se declararon en el resumen de `/epic-ship` la aceptación de `SHIP/IN-PROGRESS` y la verificación del DoD. El flujo todavía no los implementaba.
2. **Implementar esas obligaciones en el flujo.**
   - Los gates aceptan `VALIDATE/DONE` y `SHIP/IN-PROGRESS`, siempre con `verdict: APPROVED`.
   - `SHIP/IN-PROGRESS` se escribe después de los gates y del análisis de `CHANGELOG.md`, para que un rechazo no escriba nada.
   - `CHANGELOG.md` solo se escribe si no está al día, y un bloque publicado solo se acepta si cubre todas las historias.
   - Se añade un aviso de WIP, sin bloqueo, al activar la épica.
3. **Hacer los casos de `/epic-ship` autocontenidos.** El dry-run mostró que el runner no resuelve `same_world_as`, así que cada caso declara ahora su mundo.
4. **Quitar la dependencia de un stack.** Se retira la lista de comandos `npm`. El skill ejecuta lo que cita el DoD y solo rechaza, por su efecto, los comandos encadenados o los que crean commits o tags, fusionan, empujan, publican o despliegan. TC-018 y TC-021 lo cubren con otro stack.
5. **Quitar la dependencia de un release.** Se retiran la versión sugerida, los pasos de liberación y la pregunta sobre commit, tag, merge y despliegue. El orden pasa a ser evaluar el DoD y luego confirmar, como en `story-delivery`. TC-022 cubre un DoD sin nociones de release.
6. **Retirar `release-notes.md` de `/epic-ship`.** Se eliminan el template, su paso, sus casos y la lectura de la línea `**Para**`, se renumeran los pasos y se actualiza la documentación.
7. **Hacer opcional la versión en `/epic-complete`, con TDD.** Primero cambiaron las pruebas, y 7 fallaron por el motivo esperado. Después cambiaron el motor, el skill, los evals y la documentación.
8. **Orientar desde `SHIP/IN-PROGRESS` en `/epic-complete`, con TDD.** La prueba falló primero y luego se amplió la sugerencia de `NOT_SHIPPED`. Se añadió TC-008.
9. **Documentar retrospectivamente.** Se creó `story.md` (STORY-176) y este plan.

## Riesgos

| Riesgo | Efecto | Tratamiento |
|---|---|---|
| Sin lista de comandos permitidos, el DoD decide qué se ejecuta | Se ejecutaría un comando dañino que no encaje en los efectos rechazados | Aceptado, como en `epic-validate`. Revisar `dod-epic-ship.md` como si fuera código |
| El DoD se evalúa sin pausa para liberar | Si exige tag o release, la épica queda en `SHIP/IN-PROGRESS` hasta que se cumplan | Comportamiento esperado: reejecutar `/epic-ship` |
| Cambia el contrato entregado por STORY-170 y STORY-171 | Quien espere `release-notes.md`, los pasos de liberación o `NO_VERSION` deja de obtenerlos | Registrarlo en `CHANGELOG.md` al cerrar la historia |
| `/epic-complete` no reconoce entradas manuales de `CHANGELOG.md` | EPIC-23 se cerraría sin versión | Fuera de alcance: usar `--version 5.1.0` |
| El aviso de WIP no bloquea | Hoy hay varias épicas en `IN-PROGRESS` y seguirán activándose otras | Decisión abierta: avisa para no impedir liberar EPIC-24 y EPIC-26 |
| Las copias instaladas quedan desactualizadas | `/epic-ship` y `/epic-complete` ejecutan el flujo anterior en este repositorio | Ejecutar `npx agile-sddf install --force` |
| Los evals no se han ejecutado con un modelo | El comportamiento del `SKILL.md` no está probado de punta a punta | Ejecutarlos a criterio humano, por el coste de cuota |

**Restricciones respetadas:** ningún paso hace commit, tag, push ni publicación; no se editan ADR aceptados; `ADR-0004`, la sección `[5.1.0]` de `CHANGELOG.md` y los documentos anteriores de `specs/` no se tocan.

## Verificación

**Realizada a la fecha de este plan:**

| Comprobación | Resultado |
|---|---|
| `npm run verify:repository` | Aprobado |
| `node --test test/epic-complete.test.js` | 43 pruebas aprobadas |
| `node scripts/run-evals.js epic-ship --dry-run` | Genera los prompts de 21 casos |
| `node scripts/run-evals.js epic-complete --dry-run` | Genera los prompts de 8 casos |
| Motor de `epic-complete` sobre un repositorio temporal, con la entrada en `[Unreleased]` | `plan` y `apply` terminan en `OK`; `epic.md` queda en `COMPLETED/DONE`, con `completed:` y sin `version:` |
| Búsqueda de `npm`, `node_modules`, `package.json`, `cargo` y `git` en `/epic-ship` | Sin resultados en `SKILL.md` ni en su referencia |

**Pendiente, a cargo del mantenedor:**

```
npm run test:eval -- epic-ship
npm run test:eval -- epic-complete
npx agile-sddf install --force
```

El dry-run solo comprueba que los prompts se generan. Los criterios de aceptación de [story.md](story.md) quedan verificados de punta a punta cuando los evals aprueban.
