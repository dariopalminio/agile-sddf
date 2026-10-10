---
type: story
id: STORY-017
kind: feat
slug: STORY-017-reverse-engineering
title: "reverse-engineering — Skill orquestador de ingeniería inversa"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-03-reverse-engineering
---

<!-- Referencias -->
[[EPIC-03-reverse-engineering]]

# Historia de Usuario

## 📖 Historia: reverse-engineering — Skill orquestador de ingeniería inversa

**Como** developer o architect que trabaja con un repositorio existente sin documentación de requisitos
**Quiero** ejecutar el skill `reverse-engineering` sobre ese repositorio para que cuatro agentes analicen en paralelo el código fuente
**Para** obtener `$SPECS_BASE/specs/projects/project.md` generado automáticamente desde el código, sin tener que documentar los requisitos desde cero

## ✅ Criterios de aceptación

### Escenario principal – Generación exitosa de requirement-spec.md desde código
```gherkin
Dado que el desarrollador está en la raíz de un repositorio con código fuente
Cuando ejecuta el skill "reverse-engineering"
Entonces el skill lanza 4 agentes en paralelo (architect, product-discovery, business-analyst, ux-flow-mapper)
  Y al finalizar el sintetizador fusiona los outputs en "docs/specs/projects/project.md"
  Y el documento incluye stack, features, reglas de negocio y mapa de navegación inferidos del código
```

### Escenario alternativo / error – Repositorio sin código fuente reconocible
```gherkin
Dado que el directorio solo contiene archivos de configuración sin lógica de negocio
Cuando el skill analiza el repositorio
Entonces los agentes generan outputs con secciones marcadas como "<!-- PENDING MANUAL REVIEW -->"
  Y el sintetizador informa qué secciones no pudieron inferirse del código disponible
```

## ⚙️ Criterios no funcionales

[Por completar]

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: release-03-reverse-engineering.md
Feature origen: STORY-017 — reverse-engineering (skill orquestador)
