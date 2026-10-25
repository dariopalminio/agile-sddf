---
alwaysApply: false
type: story
id: STORY-159
kind: feat
slug: STORY-159-story-delivery-interactivo
title: "story-delivery interactivo en modelo batch"
status: SPECIFY
substatus: DONE
parent: EPIC-27-completar-flujo-de-story
created: 2026-10-25
updated: 2026-10-25
related:
  - EPIC-27-completar-flujo-de-story
  - STORY-160-skill-story-complete
  - STORY-162-story-delivery-modelo-continuous
  - STORY-163-story-delivery-dry-run-y-force
---
[[EPIC-27-completar-flujo-de-story]]

# 📖 Historia: story-delivery interactivo en modelo batch

**Como** Solo Builder que tiene una historia aceptada en el flujo SDD flow-forward con `delivery-model: batch`
**Quiero** ejecutar `/story-delivery STORY-NNN` para verificar criterio por criterio el DoD de `docs/guardrails/dod-story-deliver.md` y llevar la historia a `DELIVER/DONE` con mi confirmación
**Para** registrar que el incremento está listo para producción con evidencia del DoD, sin editar el frontmatter a mano ni saltarme los criterios de entrega

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Entrega interactiva en batch con DoD cumplido
```gherkin
Dado una historia STORY-NNN en ACCEPTANCE/DONE
  Y sddf.config.yaml declara defaults.delivery-model: batch
  Y se cumplen los criterios de docs/guardrails/dod-story-deliver.md
Cuando el usuario ejecuta /story-delivery STORY-NNN y confirma la entrega
Entonces el skill lista cada criterio del DoD con su estado (✅, ❌ o «no aplica en batch») y el comando o archivo que lo evidencia
  Y el criterio de instalación del paquete publicado figura como «no aplica en batch» sin bloquear la entrega
  Y story.md queda con status: DELIVER, substatus: DONE y updated: con la fecha de hoy
```

### AC-2 — Escenario de error – Entrega bloqueada sin cambios
```gherkin
Escenario: story-delivery no entrega la historia
  Dado una historia STORY-NNN en "<estado>" con el DoD "<dod>"
  Cuando el usuario ejecuta /story-delivery STORY-NNN y responde "<respuesta>"
  Entonces el skill informa "<motivo>"
    Y story.md no cambia
Ejemplos:
  | estado          | dod        | respuesta         | motivo                                    |
  | VERIFY/DONE     | cumplido   | (no se pregunta)  | el estado actual VERIFY/DONE              |
  | ACCEPTANCE/DONE | incumplido | (no se pregunta)  | la lista de criterios incumplidos         |
  | ACCEPTANCE/DONE | cumplido   | rechaza           | que el usuario canceló la entrega         |
```

### AC-3 — Escenario de dominio – El dominio autoriza a story-delivery a escribir DELIVER
```gherkin
Dado que el invariante 6 de §4 de docs/domains/domain-state-management.md, la fila DELIVER de docs/domains/domain-story-lifecycle.md y la regla BR-006 de docs/domains/domain.md prohíben hoy que un skill escriba DELIVER
Cuando se completa esta historia
Entonces los tres documentos declaran que story-delivery escribe DELIVER siempre con confirmación humana
  Pero SHIP y COMPLETED siguen sin skill escritor
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Layout fijo:** `skills/story-delivery/SKILL.md` declara `<!-- SDDF-FIXED-LAYOUT: v1 -->`, resuelve solo `REPO_ROOT` y pasa `scripts/verify-fixed-layout.js`.
- **CNF-2 — Publicación:** `skills/story-delivery` se agrega al arreglo `files` de `package.json`.
- **CNF-3 — Sin efectos al bloquear:** cuando la entrega no ocurre (AC-2), `story.md` queda byte a byte igual y no se crea ningún archivo en la carpeta de la historia.
- **CNF-4 — Gate:** `npm run verify:repository` y `npm test` pasan sin errores.

## Fuera de alcance (Non-Goals)

- El modelo `continuous` y el caso de `defaults.delivery-model` ausente o inválido (STORY-162).
- Los flags `--dry-run` y `--force`, y el registro del override (STORY-163).
- Ejecutar despliegues, publicar en npm o crear tags de release.
- Escribir o actualizar un manifiesto de release en el modelo `batch`.
- Llevar la historia a `COMPLETED` o archivarla (STORY-160).
- Crear un ADR para el cambio del invariante de dominio (la épica lo resuelve en los documentos de dominio).

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: `specs/flow/EPIC-27-completar-flujo-de-story/epic.md`
Feature origen: STORY-159 — Skill story-delivery

**Contexto del split (`/story-split`, 2026-10-25):** historia core del split de STORY-159 (antes `STORY-159-skill-story-delivery`), guiado por el plan de `finvest-evaluation-report.md` (S = 1). Patrón 4 (complejidad de criterios de aceptación) para separar los flags y Patrón 2 (variaciones de reglas de negocio) para separar el modelo `continuous`, que el reporte proponía si la core seguía grande. Hermanas: STORY-162 (modelo `continuous` y `delivery-model` ausente) y STORY-163 (`--dry-run` y `--force`). Esta historia crea el skill; las hermanas lo extienden.

- La épica cita "`domain-state-management` §6", pero la regla está en el **invariante 6 de §4** (`docs/domains/domain-state-management.md`); §6 es "Categorías de Gate". En `docs/domains/domain.md` la misma regla aparece en **BR-006** y en el resumen de substatus ("los terminales requieren acción humana o CI/CD"); ambos deben quedar coherentes.
- `defaults.delivery-model` ya existe en `sddf.config.yaml` (`batch | continuous`), y `dod-story-deliver.md` ya existe en `docs/guardrails/`.
- **Contradicción DoD vs. `batch` (resuelta en AC-1, negociable):** el último criterio de `dod-story-deliver.md` («el paquete publicado puede instalarse limpiamente con `npm install agile-sddf`») no se puede cumplir si en `batch` DELIVER significa «todavía sin publicar». Se propone mostrarlo como «no aplica en batch» sin bloquear. Alternativa a evaluar en el diseño: verificarlo con el tarball de `npm pack`.
- **Cómo se evidencia cada criterio del DoD (orientativo para el diseño):** por comando (`npm run verify:repository`, `npm pack --dry-run`); leyendo artefactos (versión en `package.json`, entrada en `CHANGELOG.md`, campo `files`); y con confirmación humana los que el skill no puede observar (estado del build de CI).
- Coordinar con STORY-160 la redacción de AC-3: esta historia deja `COMPLETED` sin escritor y STORY-160 lo autoriza, sin reescribir el mismo invariante.
