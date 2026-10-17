---
alwaysApply: false
type: story
id: STORY-130
slug: STORY-130-renombrar-skill-story-improve-a-story-refine
title: "Renombrar skill `story-improve` a `story-refine`"
status: SPECIFY
substatus: DONE
parent: null
created: 2026-10-12
updated: 2026-10-17
related: null
---

# 📖 Historia: renombrar skill `story-improve` a `story-refine`

**Como** Solo Builder y Product Owner
**Quiero** el skill que aplica las recomendaciones FINVEST sobre `story.md` (que actualmente se llama  `story-improve`) se llame `story-refine`, porque lo que hace es refinar la historia (decisión REFINAR)
**Para** consistencia en la nomenclatura de los skills.

## ✅ Criterios de aceptación

### AC-1 — **Compatibilidad:** `story-improve` queda como **alias deprecado** que delega en `/story-refine`, igual que se hizo con `docs-wiki-builder` → `memory-system`. Es un cambio minor (4.2.0) y el alias se elimina en 5.0.0. Hace falta porque `scripts/install.js` (`copyDir`, líneas 103-128) no borra skills retirados.
### AC-2 — **Artefactos:** se renombran a `story-refinement-log.md`, `assets/refinement-log-template.md` y `type: refinement-log`.

