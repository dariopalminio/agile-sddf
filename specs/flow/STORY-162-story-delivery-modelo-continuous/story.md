---
alwaysApply: false
type: story
id: STORY-162
kind: feat
slug: STORY-162-story-delivery-modelo-continuous
title: "story-delivery en modelo continuous"
status: SPECIFY
substatus: DONE
parent: EPIC-27-completar-flujo-de-story
created: 2026-10-25
updated: 2026-10-25
related:
  - EPIC-27-completar-flujo-de-story
  - STORY-159-story-delivery-interactivo
  - STORY-163-story-delivery-dry-run-y-force
---
[[EPIC-27-completar-flujo-de-story]]

# 📖 Historia: story-delivery en modelo continuous

**Como** Solo Builder que despliega cada incremento con `delivery-model: continuous`
**Quiero** que `/story-delivery STORY-NNN` me pida afirmar que el incremento ya está desplegado antes de escribir `DELIVER/DONE`
**Para** que el estado de la historia refleje lo que ya está en producción y no solo lo que está listo para salir

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Entrega con despliegue afirmado
```gherkin
Dado una historia STORY-NNN en ACCEPTANCE/DONE con el DoD de DELIVER cumplido
  Y sddf.config.yaml declara defaults.delivery-model: continuous
Cuando el usuario ejecuta /story-delivery STORY-NNN y afirma que el incremento ya está desplegado
Entonces el skill no ejecuta ningún despliegue
  Y story.md queda con status: DELIVER, substatus: DONE y updated: con la fecha de hoy
```

### AC-2 — Escenario alternativo – El usuario no afirma el despliegue
```gherkin
Dado una historia STORY-NNN en ACCEPTANCE/DONE con el DoD de DELIVER cumplido
  Y sddf.config.yaml declara defaults.delivery-model: continuous
Cuando el usuario responde que el incremento todavía no está desplegado
Entonces el skill informa que en continuous DELIVER exige el despliegue previo
  Y story.md no cambia
```

### AC-3 — Escenario de error – Modelo de entrega ausente o inválido
```gherkin
Escenario: story-delivery falla cerrado sin un delivery-model válido
  Dado una historia STORY-NNN en ACCEPTANCE/DONE
    Y sddf.config.yaml tiene defaults.delivery-model "<valor>"
  Cuando el usuario ejecuta /story-delivery STORY-NNN
  Entonces el skill informa que falta un delivery-model válido y lista los valores batch y continuous
    Y story.md no cambia
Ejemplos:
  | valor     |
  | (ausente) |
  | weekly    |
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Sin efectos al bloquear:** en AC-2 y AC-3 `story.md` queda byte a byte igual y no se crea ningún archivo en la carpeta de la historia.
- **CNF-2 — Gate:** `npm run verify:repository` y `npm test` pasan sin errores.

## Fuera de alcance (Non-Goals)

- Ejecutar, disparar o verificar automáticamente el despliegue (el skill solo pide la afirmación humana).
- Los flags `--dry-run` y `--force` (STORY-163).
- El modo `batch` y el ajuste de los documentos de dominio (STORY-159).

## 📎 Notas / contexto adicional

**Contexto del split (`/story-split`, 2026-10-25):** historia hermana del split de STORY-159, separada con el Patrón 2 (variaciones de reglas de negocio) tal como proponía `finvest-evaluation-report.md` si la core seguía grande. Extiende el skill `story-delivery` que crea STORY-159; implementarla después de esa historia.

- **Decisión confirmada (2026-10-25):** si falta `defaults.delivery-model` o su valor no es `batch | continuous`, el skill falla cerrado en lugar de asumir `batch`. Sigue la convención del repo para valores inválidos (p. ej. `npm run test:eval` y la `--strategy` de STORY-161 fallan cerrados).
- El significado de `DELIVER` por modelo está en `docs/domains/domain-story-lifecycle.md` (`DeliveryModel`): `continuous` = incremento ya desplegado.
