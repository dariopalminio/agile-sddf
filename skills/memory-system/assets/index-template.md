---
type: wiki
slug: index
title: "Índice de documentación"
status: IN-PROGRESS
substatus: IN-PROGRESS
parent: null
updated: {date}
---

# 📚 Índice de documentación

> Este índice es el punto de entrada principal para LLMs y humanos.
> Lee este archivo primero para orientarte antes de abrir cualquier otro nodo.
> Formato de cada entrada: wikilink + link markdown a la ruta relativa + título.
> El slug del wikilink es el declarado en el frontmatter del documento (convención SDDF) o, si no lo
> declara, el derivado del nombre del archivo o del directorio. Cuando un archivo no tiene frontmatter,
> se enlaza solo por ruta. Usa [Foam](https://foambubble.github.io/foam/) para visualizar el grafo.
>
> Generado por `memory-system index`: no edites las entradas a mano, regenera con `/memory-system index`.

---

## ⚖️ Gobernanza (constitución → policies → guardrails)

Tres capas con jerarquía explícita: la **constitución** es el documento supremo; las **policies** la desarrollan en reglas de gobernanza; los **guardrails** la hacen verificable como checklists que bloquean. Ante conflicto, prevalece la constitución.

### Raíz (constitución)

{layer:root}

### Policies (policies/)

{layer:policies}

### Guardrails (guardrails/)

{layer:guardrails}

---

## 🎯 Producto y requisitos

### Producto (product/)

{layer:product}

### Requisitos (requirements/)

{layer:requirements}

---

## 🗂️ Especificaciones (specs/)

### L3 — Proyecto (specs/01-projects/)

{layer:specs-projects}

### L2 — Épicas (specs/02-epics/)

{layer:specs-epics}

### L1 — Historias de usuario (specs/03-stories/)

> **Convención de directorio:** cada `STORY-NNN-*/` contiene `story.md` como nodo principal y, según la
> fase alcanzada, puede contener además `analyze.md`, `design.md`, `tasks.md`, `testcases.md`,
> `*-report.md`, `fix-directives.md` o `finvest-evaluation-report.md`. Esos artefactos derivados no se
> enumeran aquí: se leen desde el directorio de la historia. Los templates (`templates/`) tampoco se
> listan porque sus wikilinks son placeholders.

{layer:specs-stories}

---

## 🧭 Dominio y arquitectura

### Dominios (domains/)

{layer:domains}

### Arquitectura (architecture/)

{layer:architecture}

### Decisiones de arquitectura (adr/)

{layer:adr}

---

## 📖 Guías y operación

### Guías (guides/)

{layer:guides}

### Runbooks (runbooks/)

{layer:runbooks}

---

## 🔗 Artefactos externos

Nodos de otros harnesses (OpenSpec, Spec-kit) indexados en modo solo lectura; sus rutas son relativas a este directorio.

{layer:external}

---

## 📊 Estado del grafo

| Métrica | Valor |
|---------|-------|
{stats}
| Enlaces locales, anchors y wikilinks de documentación activa | `node scripts/check-doc-links.js` |
| Última regeneración | ver `updated` en el frontmatter |

> El resultado de enlaces no se mantiene como un número manual: el checker lo genera y la CI lo exige.

---

*Generado por el skill `memory-system`. Regenera con `/memory-system index`.*
