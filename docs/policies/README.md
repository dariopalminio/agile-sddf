---
type: wiki
slug: policies-index
title: "Índice de Policies"
date: 2026-09-20
parent: null
---

# ⚖️ Policies

> Reglas de **gobernanza** del proyecto: documentos declarativos (principios, convenciones, criterios
> de decisión) que desarrollan la constitución en un ámbito concreto. Se verifican con juicio humano
> o semiautomático; cuando una regla necesita ser verificable y bloqueante, se materializa en un
> guardrail.

La constitución **no** vive aquí: está un nivel arriba, en [../constitution.md](../constitution.md),
porque es el documento supremo del que toda policy deriva, no una policy más.

---

## Flujo de autoridad

```
docs/constitution.md          # principios supremos
    ├──► docs/policies/       # esta capa: reglas de gobernanza derivadas
    └──► docs/guardrails/     # restricciones verificables
```

- Toda policy declara de qué principio de la constitución deriva (`derives-from: constitution`).
- Una policy puede declarar qué guardrails la hacen cumplir (`enforced-by`), y el guardrail apunta de vuelta (`originates-from`).
- Ante conflicto policy ↔ constitución, prevalece la constitución.

---

## Policy vs Guardrail

| Aspecto | Policy (`docs/policies/`) | Guardrail (`docs/guardrails/`) |
|---------|---------------------------|--------------------------------|
| Naturaleza | Regla de gobernanza | Restricción operativa/técnica |
| Formato | Documento declarativo (principios, convenciones) | Checklist con severidades (`error`, `warn`) |
| Verificación | Humana o semiautomática | Determinista + revisión semántica |
| Incumplimiento | Requiere juicio; puede escalarse | Bloquea (`error`) o advierte (`warn`) |
| Audiencia primaria | Humanos y equipos | Agentes IA y CI |

El modelo completo está en [domain-knowledge-artifacts.md](../domains/domain-knowledge-artifacts.md#6-guardrail-vs-policy);
el índice de guardrails en [guardrails/README.md](../guardrails/README.md).

---

## Convención

- **Nombre de archivo:** `<ámbito>-policy.md` (kebab-case), p. ej. `security-policy.md`, `quality-policy.md`
- **Frontmatter:** `type: policy`, `slug` igual al nombre del archivo sin extensión, `derives-from: constitution`, y `enforced-by` con los slugs de los guardrails que la verifican (si existen)
- **Sin duplicación:** una regla vive en un solo lugar; la policy enlaza a la constitución y a sus guardrails, no copia su contenido

---

## Índice de policies

| Archivo | Ámbito | Guardrails que la hacen cumplir |
|---------|--------|--------------------------------|
| — | Todavía no hay policies; las reglas transversales viven en [../constitution.md](../constitution.md) | — |
