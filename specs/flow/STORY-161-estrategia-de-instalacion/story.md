---
alwaysApply: false
type: story
id: STORY-161
kind: feat
slug: STORY-161-estrategia-de-instalacion
title: "Estrategia de instalación"
status: IMPLEMENT
substatus: DONE
parent: EPIC-27-completar-flujo-de-story
created: 2026-10-25
updated: 2026-10-25
related:
  - EPIC-27-completar-flujo-de-story
---
[[EPIC-27-completar-flujo-de-story]]

# 📖 Historia: Estrategia de instalación

**Como** usuario de `agile-sddf install` que trabaja solo con historias, sin épicas
**Quiero** elegir entre la estrategia `full` (épica + story, incluye los skills `epic-*`) y `story` (sin los skills `epic-*`) al instalar
**Para** instalar solo el flujo que voy a usar y no cargar mi runtime con skills de épica que nunca invocaré

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Instalación solo story
```gherkin
Dado un proyecto destino vacío
Cuando el usuario ejecuta npx agile-sddf install --strategy story --target claude-code
Entonces se instalan los skills story-* y los demás skills del catálogo que no empiezan por epic-
  Y en el destino del runtime no existe ningún skill con prefijo epic-
  Y el resumen de la instalación indica la estrategia aplicada
```

### AC-2 — Escenario alternativo – Selección de la estrategia
```gherkin
Escenario: resolución de la estrategia según flag y TTY
  Dado un proyecto destino vacío
  Cuando el usuario ejecuta agile-sddf install con "<flag>" en una terminal "<tty>"
  Entonces el resultado es "<resultado>"
Ejemplos:
  | flag             | tty    | resultado                                                    |
  | --strategy full  | sin TTY | instala el catálogo completo, incluidos los skills epic-*    |
  | (sin flag)       | sin TTY | usa full por defecto e instala el catálogo completo          |
  | (sin flag)       | con TTY | pregunta la estrategia (full / story), igual que con el runtime |
```

### AC-3 — Escenario de error – Valor inválido
```gherkin
Dado un proyecto destino vacío
Cuando el usuario ejecuta agile-sddf install --strategy epic
Entonces el instalador termina con código de salida distinto de 0
  Y el mensaje nombra el valor inválido y los valores válidos (full, story)
  Pero no copia ningún archivo al destino
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Fail-closed:** la validación de `--strategy` ocurre antes de cualquier escritura en el destino, igual que la de `--target` en `scripts/cli.js`.
- **CNF-2 — Compatibilidad:** sin flag y sin TTY, el resultado es idéntico al de la versión actual (catálogo completo), y los flags `--global`, `--target` y `--force` se combinan con `--strategy` sin cambiar su comportamiento.
- **CNF-3 — Documentación:** el texto de uso de `agile-sddf` (`USAGE` en `scripts/cli.js`) documenta `--strategy full|story`.
- **CNF-4 — Pruebas:** hay pruebas unitarias en `test/` para `story`, `full`, sin flag sin TTY y valor inválido. `npm run verify:repository` y `npm test` pasan sin errores.

## Fuera de alcance (Non-Goals)

- Excluir otras familias de skills (`project-*`, `memory-system`, etc.): se instalan en ambas estrategias.
- Persistir la estrategia elegida en `sddf.config.yaml` o desinstalar skills `epic-*` ya instalados.
- Estrategias adicionales más allá de `full` y `story`.

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: `specs/flow/EPIC-27-completar-flujo-de-story/epic.md`
Feature origen: STORY-161 — Estrategia de instalación

- Hoy `scripts/cli.js` solo pregunta el runtime cuando falta `--target` y `process.stdin.isTTY` es verdadero (`promptFolderSelection` en `scripts/install.js`). La pregunta de estrategia debe seguir ese mismo patrón.
- Los agentes locales de cada skill viven en `skills/<skill>/assets/agents/` (ADR-0014). Al excluir un skill `epic-*`, sus agentes locales se excluyen con él. Revisar en `/story-design` si algún runtime de `config/runtimes.json` copia agentes a un destino aparte que también haya que filtrar.
- **Pendiente de refinar:** con `--force` y estrategia `story` sobre un destino que ya tiene skills `epic-*` de una instalación previa, ¿se dejan intactos? (Propuesta: sí, fuera de alcance.)
