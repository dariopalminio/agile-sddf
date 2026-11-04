---
alwaysApply: false
type: story
id: STORY-127
kind: feat
slug: STORY-127-integrar-adoptar-gateway-epica
title: "Integrar y documentar el gateway de validación de épicas"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
created: 2026-10-12
updated: 2026-10-28
related:
  - EPIC-23-completar-flujo-de-epic
  - STORY-124
  - STORY-125
  - STORY-126
  - STORY-128
---
[[EPIC-23-completar-flujo-de-epic]]

# 📖 Historia: Integrar y documentar el gateway de validación de épicas

**Como** Solo Builder y responsable del ciclo de vida de épicas en Agile-SDDF  
**Quiero** que la transición `DEVELOP → VALIDATE` de una épica exija un veredicto APPROVED de `/epic-validate` y que el gateway se distribuya y documente para los runtimes soportados  
**Para** que ninguna épica llegue a VALIDATE sin un veredicto APPROVED vigente y que todo runtime instalado aplique la misma regla de liberación

## ✅ Criterios de aceptación

### AC-1 — Escenario principal — Transición permitida con veredicto APPROVED
```gherkin
Dado una épica en DEVELOP cuyo epic-validate-report.md declara verdict: APPROVED
  Y la regla de transición a VALIDATE está documentada en la guía del pipeline de épicas
Cuando el mantenedor aplica esa regla para avanzar la épica a VALIDATE
Entonces la regla permite cambiar el status de la épica a VALIDATE
  Y epic-validate-report.md permanece en el directorio de la épica como evidencia del veredicto
```

### AC-2 — Escenario alternativo — Transición bloqueada con veredicto BLOCKED
```gherkin
Dado una épica en DEVELOP cuyo epic-validate-report.md declara verdict: BLOCKED
Cuando el mantenedor aplica la regla para avanzar la épica a VALIDATE
Entonces la regla impide la transición y remite a los hallazgos bloqueantes de la sección ## Veredicto del reporte
  Pero el status de la épica permanece en DEVELOP
```

### AC-3 — Escenario de adopción — Gateway distribuido e instalado
```gherkin
Dado un runtime con support: supported en config/runtimes.json
Cuando se empaqueta el framework y se ejecuta npx agile-sddf install --target <runtime>
Entonces el paquete incluye skills/epic-validate/ porque figura en el arreglo files de package.json
  Y el destino del runtime contiene el skill epic-validate con su SKILL.md
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Consistencia:** la guía del pipeline de épicas (`docs/guides/sddf-commands-pipeline.md`) y la sección "Nivel ÉPICA" de `docs/architecture/state-machine.md` nombran `/epic-validate <EPIC-ID>` como precondición de `DEVELOP → VALIDATE`. Describen el mismo punto de entrada y la misma transición que distribuye el paquete.
- **CNF-2 — Portabilidad:** la disponibilidad no depende de una carpeta de runtime concreta dentro del repositorio fuente.

## 🚫 Fuera de alcance

- Implementar las comprobaciones que forman el veredicto.
- Cambiar otros estados o transiciones del ciclo de vida de épicas.
- Automatizar la escritura de `status: VALIDATE` mediante un skill: la transición sigue siendo manual y el gateway actúa como su precondición documentada.
- Medir la calidad del gateway mediante casos de evaluación.

## 📎 Notas / contexto adicional

- **Contrato consumido:** esta historia solo lee el resultado de STORY-124, STORY-125 y STORY-126, que es `<EPIC_DIR>/epic-validate-report.md`. El veredicto está en el campo `verdict` del frontmatter (`APPROVED` | `BLOCKED`) y en la sección `## Veredicto`, que es la primera tras el título. La forma en que quien invoca distingue el éxito del fallo la decide STORY-126.
- **Desarrollo independiente:** AC-1 y AC-2 se pueden probar con un `epic-validate-report.md` de prueba con `verdict` fijo en `APPROVED` o `BLOCKED`, sin esperar a que se entreguen STORY-124 a STORY-126. AC-3 solo requiere que exista `skills/epic-validate/SKILL.md`.
- **Regla:** la ausencia de `epic-validate-report.md` equivale a un veredicto distinto de APPROVED y también impide la transición.
- **Mecanismo de transición:** hoy ningún skill escribe la transición `DEVELOP → VALIDATE` de una épica (ver `docs/architecture/state-machine.md`, "Nivel ÉPICA"). El gateway se incorpora como precondición documentada, igual que `epic-format-validation` lo es para `epic-generate-stories`.
- **Runtimes:** se verifican los que `config/runtimes.json` declara con `support: supported`. La lista no se duplica en esta historia.
- La fuente del framework permanece en `skills/`; la instalación explícita genera los destinos de runtime.
- Cubre el criterio de salida de EPIC-23: **CS-8** — `skills/epic-validate/` figura en el arreglo `files` de `package.json`.
- Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores.
