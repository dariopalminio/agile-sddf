
---
alwaysApply: false
---
**Título**: Copiar los templates a los skills correspondientes
**Versión**: 1.0
**Estado**: Completed
**Fecha**: 2026-04-23
**FINVEST Score:** —
**FINVEST Decisión:** —
---

## 📖 Historia: Copiar los templates a los skills correspondientes

**Como** desarrollador/mantenedor y usuario del framework SDDF
**Quiero** copiar todos los templates de `docs/specs/templates/` al directorio `templates/` del skill que los usa
**Para** que cada skill sea autónomo y `docs/specs/` solo contenga documentos generados (salida)

## ✅ Criterios de aceptación

### Escenario principal – Templates copiados al skill correspondiente
```gherkin
Dado que existen templates en "docs/specs/templates/"
  Y cada template es utilizado por al menos un skill en ".claude/skills/"
Cuando se copia cada template al directorio "templates/" del skill que lo usa
  Y se actualizan las referencias en los SKILL.md que los mencionan
Entonces cada skill tiene su template en ".claude/skills/<skill>/templates/<template>.md"
  Y el directorio "docs/specs/templates/" no contiene templates compartidos (solo quedan como referencia).
  Y los skills funcionan usando la ruta local del template
```

### Escenario alternativo / error – SKILL.md con referencia a ruta antigua
```gherkin
Dado que un SKILL.md referencia "docs/specs/templates/<template>.md"
Cuando el template ha sido copiado a ".claude/skills/<skill>/templates/<template>.md"
Entonces el SKILL.md actualiza la referencia a la nueva ruta relativa
  Y no queda ninguna referencia a "docs/specs/templates/" en los SKILL.md activos
```

### Escenario alternativo – Template referenciado por múltiples skills
```gherkin
Dado que un template es referenciado por más de un skill
Cuando se decide dónde ubicarlo
Entonces se copia al skill que es su "dueño principal" (el que lo define o usa más)
  Y cada skill que lo necesita recibe su propia copia local en su carpeta "templates/"
```

### Requerimiento: Excluir templates no usados por ningún skill activo
Los templates de `others_references/` (openspec-*.md) quedan excluidos de este movimiento si no corresponden a ningún skill activo; se decide su destino por separado.
Los templates de "docs/specs/templates/" solo quedan como referencia, no necesitan ser borrados, solo ser copiados en los skills correspondientes.

### Requerimiento: Duplicar templates si es necesario
Los templates que son usados por varios skills serán copiados en cada skill que lo usa aunque queden duplicados. Por ejemplo `story-gherkin-template.md` es usado por los skills: release-generate-all-stories, story-creation, story-evaluation, story-split. Cada uno debe tener el template en su carpeta.

### Requerimiento: Actualizar referencias en SKILL.md y agentes  
Actualizar referencias en SKILL.md y las referencias en los agentes que usan los templates en `.claude\agents`. No deben quedar referencias deprecadas a `docs/specs/templates/` en ningún lugar del código activo.

## ⚙️ Criterios no funcionales

* Trazabilidad: cada template copiado debe poder asociarse a su skill dueño sin ambigüedad
* Compatibilidad: los skills ya migrados (`project-begin`, `project-planning`) no se modifican

## 📎 Notas / contexto adicional

Templates actuales en `docs/specs/templates/` 

La carpeta `docs/specs/templates/others_references/` (openspec design, proposal, spec, tasks) queda fuera del scope de esta historia; se tratará en una historia separada si aplica.
