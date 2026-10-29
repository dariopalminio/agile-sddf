---
alwaysApply: false
type: story
id: STORY-127
kind: feat
slug: STORY-127-integrar-adoptar-gateway-epica
title: "Integrar y documentar el gateway de validación de épicas"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-23-completar-flujo-de-epic
created: 2026-10-12
updated: 2026-10-29
related:
  - EPIC-23-completar-flujo-de-epic
  - STORY-124
  - STORY-125
  - STORY-126
  - STORY-128
  - STORY-170
---
[[EPIC-23-completar-flujo-de-epic]]

# 📖 Historia: Integrar y documentar el gateway de validación de épicas

**Como** Solo Builder y responsable del ciclo de vida de épicas en Agile-SDDF  
**Quiero** que `/epic-validate` aplique como gateway la transición de la épica según su veredicto (`VALIDATE/IN-PROGRESS → VALIDATE/DONE` con APPROVED y vuelta a `DEVELOP` con cualquier otro) y que el skill se distribuya y documente para los runtimes soportados  
**Para** que ninguna épica quede lista para `SHIP` sin un veredicto APPROVED vigente y que todo runtime instalado aplique la misma regla de liberación

## ✅ Criterios de aceptación

### AC-1 — Escenario principal — Veredicto APPROVED deja la épica lista para SHIP
```gherkin
Dado una épica en VALIDATE/IN-PROGRESS
Cuando se ejecuta /epic-validate sobre la épica sin --dry-run
  Y el reporte se escribe con verdict: APPROVED
Entonces el skill cambia la épica a VALIDATE/DONE, lista para SHIP
  Y epic-validate-report.md permanece en el directorio de la épica como evidencia del veredicto
```

### AC-2 — Escenario alternativo — Veredicto no aprobado devuelve la épica a DEVELOP
```gherkin
Esquema del escenario: Veredicto <veredicto> devuelve la épica a DEVELOP
  Dado una épica en VALIDATE/IN-PROGRESS
  Cuando se ejecuta /epic-validate sobre la épica sin --dry-run
    Y el reporte se escribe con verdict: <veredicto>
  Entonces el skill devuelve la épica a DEVELOP/IN-PROGRESS y remite a los hallazgos de la sección ## Veredicto del reporte
    Pero la épica no queda en VALIDATE/DONE, por lo que no puede transicionar a SHIP

  Ejemplos:
    | veredicto     |
    | NEEDS-CHANGES |
    | BLOCKED       |
```

### AC-3 — Escenario de adopción — Gateway distribuido e instalado
```gherkin
Dado un runtime con support: supported en config/runtimes.json
Cuando se empaqueta el framework y se ejecuta npx agile-sddf install --target <runtime>
Entonces el paquete incluye skills/epic-validate/ porque figura en el arreglo files de package.json
  Y el destino del runtime contiene el skill epic-validate con su SKILL.md
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Consistencia:** `skills/epic-validate/SKILL.md`, la guía del pipeline de épicas (`docs/guides/sddf-commands-pipeline.md`) y la sección "Nivel ÉPICA" de `docs/architecture/state-machine.md` nombran `/epic-validate <EPIC-ID>` como gateway de `VALIDATE/IN-PROGRESS → VALIDATE/DONE`, con vuelta a `DEVELOP/IN-PROGRESS` si el veredicto no es APPROVED. Los tres describen el mismo punto de entrada y las mismas transiciones.
- **CNF-2 — Portabilidad:** la disponibilidad no depende de una carpeta de runtime concreta dentro del repositorio fuente.

## 🚫 Fuera de alcance

- Implementar las comprobaciones que forman el veredicto.
- La transición `DEVELOP → VALIDATE` (gate de completitud de historias, que informa `epic-track-progress`) y el resto de transiciones del ciclo de vida de épicas.
- Que `/epic-ship` exija `VALIDATE/DONE` antes de escribir `SHIP` (STORY-170).
- Medir la calidad del gateway mediante casos de evaluación (STORY-128).

## 📎 Notas / contexto adicional

- **Mecanismo de transición (decisión del PO, 2026-10-29):** el gateway es parte del proceso de `/epic-validate`. Tras escribir su reporte, el propio skill cambia el `status` de la épica: con `APPROVED` pasa de `VALIDATE/IN-PROGRESS` a `VALIDATE/DONE` (equivalente a «lista para SHIP»); con `NEEDS-CHANGES` o `BLOCKED` vuelve a `DEVELOP/IN-PROGRESS` y no puede transicionar a `SHIP`. CS-7 de EPIC-23 ya admite esta escritura; la política de efectos de STORY-126 todavía debe alinearse.
- **Contrato consumido:** el gateway lee el resultado de STORY-124, STORY-125 y STORY-126, que es `<EPIC_DIR>/epic-validate-report.md`. El veredicto está en el campo `verdict` del frontmatter (`APPROVED` | `NEEDS-CHANGES` | `BLOCKED`) y en la sección `## Veredicto`, que es la primera tras el título. El bloque de resultado de la ejecución lo define STORY-126.
- **Regla:** la épica solo cambia de `status` cuando esta ejecución escribió el reporte. Con `--dry-run`, con un error de invocación o con un fallo que impide escribir el reporte, `epic.md` no cambia. Si la épica no está en `VALIDATE`, el skill escribe el reporte pero no cambia su `status` e informa el motivo.
- **Dependencia:** el gateway es un paso de `skills/epic-validate/SKILL.md`, así que se implementa después de STORY-124 y STORY-126. AC-1 y AC-2 se prueban con épicas fixture cuyo resultado esté fijado en `APPROVED`, `NEEDS-CHANGES` o `BLOCKED`. AC-3 solo requiere que exista `skills/epic-validate/SKILL.md`.
- **Runtimes:** se verifican los que `config/runtimes.json` declara con `support: supported`. La lista no se duplica en esta historia.
- La fuente del framework permanece en `skills/`; la instalación explícita genera los destinos de runtime.
- Cubre el criterio de salida de EPIC-23: **CS-8** — `skills/epic-validate/` figura en el arreglo `files` de `package.json`.
- Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores.
