---
type: story
id: FEAT-047
slug: FEAT-047-skills-multicliente-rutas-relativas
title: "Skills con templates Multicliente"
date: 2026-04-26
status: COMPLETED
substatus: READY
parent: EPIC-09-docs-and-wiki-builders
---

<!-- Referencias -->
[[EPIC-09-docs-and-wiki-builders]]

## ?? Historia: Skills con templates Multicliente

**Como** developer o tech lead que mantiene y distribuye skills del SDDF en m�ltiples clientes LLM (Claude Code, OpenCode, GitHub Copilot, etc.)
**Quiero** que los skills referencien sus templates usando rutas relativas al directorio del skill (`templates/{template}.md`) en lugar de rutas absolutas hardcodeadas (`.claude/skills/<skill-name>/templates/{template}.md`)
**Para** que los skills sean **portable y resistente** y poder ejecutar y distribuir cualquier skill en cualquier cliente LLM sin modificar rutas ni adaptar el c�digo del skill por plataforma

## ? Criterios de aceptaci�n

### Escenario principal � Skill lee template correctamente en cliente distinto de Claude Code
```gherkin
Dado que el skill referencia su template como `templates/story-template.md`
  Y el skill se ejecuta en un cliente LLM distinto de Claude Code (ej. OpenCode)
Cuando el cliente resuelve la ruta del template
Entonces el template se lee correctamente desde el directorio del skill activo
  Y el skill genera el output esperado sin errores de ruta
```

### Escenario alternativo / error � Ruta hardcodeada falla en cliente no-Claude
```gherkin
Dado que un skill referencia su template con ruta `.claude/skills/story-creation/templates/story-template.md`
  Y el skill se ejecuta en un cliente que no monta skills bajo `.claude/`
Cuando el cliente intenta leer el archivo
Entonces el skill falla con error de archivo no encontrado
  Pero si la ruta se reemplaza por `templates/story-template.md`, el error no ocurre
```

### Escenario alternativo / error � Cliente no resuelve rutas relativas al skill autom�ticamente
```gherkin
Dado que el cliente LLM no resuelve rutas relativas al directorio del skill activo
Cuando el skill intenta leer `templates/story-template.md`
Entonces el skill puede usar `{{SKILL_ROOT}}/templates/story-template.md` como alternativa expl�cita
  Y el skill documenta que `{{SKILL_ROOT}}` debe estar configurada si el cliente no la inyecta autom�ticamente
  Pero nunca hardcodea una ruta que asuma `.claude/skills/` como directorio ra�z
```

### Requirement: Patr�n de referencia a templates
Todos los skills que referencian templates internos SHALL reemplazar el formato:
`.claude/skills/{skill-name}/templates/{template}.md`
por la forma relativa al directorio del skill:
`templates/{template}.md`

Como alternativa expl�cita (para clientes que requieren rutas absolutas), se acepta:
`{{SKILL_ROOT}}/templates/{template}.md`

El skill `readme-builder` ya implementa este patr�n y sirve de referencia.

### Requirement: Skills afectados
Los siguientes skills contienen rutas hardcodeadas que deben actualizarse:
- `project-begin` ? `project-intent-template.md`
- `project-discovery` ? `project-template.md`
- `project-planning` ? `project-plan-template.md`
- `release-format-validation` ? `release-spec-template.md`
- `release-generate-stories` ? `story-template.md`
- `reverse-engineering` ? `project-template.md`
- `story-creation` ? `story-template.md`
- `story-split` ? `story-template.md`

### Requirement: Auto-descubrimiento de la ruta del skill
El mecanismo, {{SKILL_ROOT}} es una variable que el cliente (Claude Code, OpenCode, etc.) debe expandir antes de ejecutar los comandos. Si el cliente no la expande (por ejemplo, en una versi�n antigua, o en otro asistente que no sigue esa convenci�n), el comando literal cat {{SKILL_ROOT}}/templates/mi-template.md fallar� porque intentar� leer un archivo llamado {{SKILL_ROOT}}/templates/... (que no existe). La mejor pr�ctica es no depender �nicamente de {{SKILL_ROOT}}, sino incluir un mecanismo de fallback que busque el template en ubicaciones est�ndar. Puedes hacerlo con un peque�o script shell dentro del SKILL.md que intente varias rutas hasta encontrar el archivo.
Estrategia paso a paso:
1. Primero, intentar usar {{SKILL_ROOT}} si est� definida.
2. Si no, buscar en directorios relativos al proyecto (.claude/skills/, .github/skills/, etc.).
3. Como �ltima alternativa, buscar en el directorio global del usuario (~/.claude/skills/).
El script ejemplo de la l�gica de fallback podr�a verse as�:
```bash
#!/bin/bash

# Funci�n para encontrar el template
find_template() {
    local skill_name="project-discovery"   # Cambia por el nombre de tu skill
    local template_path="templates/project-template.md"

    # 1. Si SKILL_ROOT est� definida y el archivo existe
    if [ -n "$SKILL_ROOT" ] && [ -f "$SKILL_ROOT/$template_path" ]; then
        echo "$SKILL_ROOT/$template_path"
        return 0
    fi

    # 2. Buscar en .claude/skills/ (proyecto)
    if [ -f ".claude/skills/$skill_name/$template_path" ]; then
        echo ".claude/skills/$skill_name/$template_path"
        return 0
    fi

    # 3. Buscar en .github/skills/ (para Copilot)
    if [ -f ".github/skills/$skill_name/$template_path" ]; then
        echo ".github/skills/$skill_name/$template_path"
        return 0
    fi

    # 4. Buscar en la carpeta global del usuario
    if [ -f "$HOME/.claude/skills/$skill_name/$template_path" ]; then
        echo "$HOME/.claude/skills/$skill_name/$template_path"
        return 0
    fi

    # 5. No encontrado
    return 1
}

TEMPLATE_FILE=$(find_template)
if [ -z "$TEMPLATE_FILE" ]; then
    echo "? No se pudo encontrar el template. Aseg�rate de que el skill est� correctamente instalado."
    exit 1
fi

cat "$TEMPLATE_FILE"
```

## ?? Criterios no funcionales

* Portabilidad: el cambio no requiere ninguna adaptaci�n adicional por cliente LLM
* Retrocompatibilidad: en Claude Code, las rutas relativas `templates/x.md` deben seguir funcionando igual que antes
* Documentaci�n: si un skill usa `{{SKILL_ROOT}}`, debe incluir una nota indicando qu� hacer si el cliente no inyecta la variable autom�ticamente

## ?? Notas / contexto adicional

El skill `readme-builder` ya fue implementado con la convenci�n `templates/readme-template.md` (ruta relativa) y sirve de referencia para los dem�s.

La estrategia preferida es `templates/{template}.md` (m�s simple, no depende de soporte de variable de entorno). `{{SKILL_ROOT}}/templates/{template}.md` es la alternativa para clientes que prefieren rutas expl�citas y absolutas.

Splitting: esta historia cubre la actualizaci�n de 8 skills con un patr�n de cambio uniforme (string replacement). Si el equipo prefiere atomicidad, puede dividirse por skill � pero dado que el cambio es mec�nico y acotado, se recomienda implementar en un �nico PR.
