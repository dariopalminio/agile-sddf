---
type: guide
slug: sdd
title: "Guía SDD con un wikilink roto"
---

# Guía SDD con un wikilink roto

Único wikilink roto del fixture: [[no-existe]].

Falsos positivos que `check` NO debe reportar:

- código inline: `[[en-codigo]]`
- alias que resuelve: [[real|Alias de la guía real]]
- ancla que resuelve: [[real#seccion]]
- historia existente: [[STORY-001-a]]

```markdown
[[en-fence]]
```
