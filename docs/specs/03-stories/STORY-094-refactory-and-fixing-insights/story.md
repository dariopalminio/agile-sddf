---
alwaysApply: false
type: story
id: STORY-094
kind: chore
slug: STORY-094-refactory-and-fixing-insights
title: "Fix insight and Verificación de la instalación en Windows, macOS y Linux"
status: COMPLETED
substatus: DONE
parent: EPIC-19-framework-consistency
created: 2026-09-13
updated: 2026-09-13
related:
  - EPIC-19-framework-consistency
  - STORY-049-reading-of-sddf-root
---
<!-- Referencias -->
[[EPIC-19-framework-consistency]]
[[STORY-049-reading-of-sddf-root]]

# 📖 Historia: Hacer ejecutables y bloqueantes los contratos operativos del framework SDDF (harden-sddf-ci-install-and-evals)

**Como** mantenedor del framework SDDF,  
**Quiero** que la CI, el instalador y el runner de evals hagan cumplir de forma bloqueante los contratos que el repositorio ya declara,  
**Para** que ni un PR ni una instalación limpia puedan quedar en verde sin evidencia real, y el onboarding refleje capacidades reales.

---

## Criterios de aceptación

### Críticos

1. **CI de seguridad sobre la fuente canónica**  
   El workflow escanea `skills/` (no `.claude/skills`), y también `agents/`, `scripts/`, políticas y workflows. Los hallazgos y errores del escáner **bloquean** el workflow (no se toleran).

2. **Contención de rutas en la instalación**  
   `installSDDF` valida `SDDF_TARGET` permitiendo solo `.claude`, `.agents`, `.github`, y verifica contención con `path.resolve`/`path.relative`. La copia automática desde `postinstall` pasa a ser **opt-in**.

3. **Sin falsos verdes en evals**  
   `run-evals.js` falla (exit ≠ 0) cuando no hay casos que ejecutar o cuando `--only` referencia IDs inexistentes. Se añade `--changed-from <ref>` para PRs y en CI se usa base SHA o `--all`.

### Altos

4. **Perfil core/dogfood reproducible**  
   Se definen perfiles explícitos (`core`, `dogfood`, stack) o se dejan los workers como `none` por defecto. Se documenta que `skill-test-evals` y `skill-master` **no son core**: son herramientas de construcción del framework que se instalan desde el repositorio de extensión externo.

5. **Runner endurecido**  
   `run-evals.js` usa `execFileSync` en lugar de interpolación en shell, valida nombres e IDs, y usa un helper de "ruta contenida" antes de cada lectura/escritura.

6. **Cadena mínima de pruebas deterministas en CI**  
   `node --test`, chequeo de sintaxis, auditor de raíz, validación de evals/frontmatter, link-checker, `npm pack --dry-run` y smoke de instalación. Las evaluaciones LLM quedan en jobs manuales/nocturnos.

7. **Enlaces y documentación operativa reparados**  
   Se corrigen rutas hacia `docs/guardrails/gr-*.md` en `SECURITY.md`, `docs/policies/dod-story.md` y `docs/index.md`. La documentación histórica se marca como tal. Link-checker integrado en CI.

### Medios

8. **README con matriz de capacidades**  
   Publica claramente: Core / Extensión / Runtime / Requisito externo (por ejemplo, `security-audit` y OpenSpec).

9. **Contrato único de rutas multi-runtime**  
   Mapa runtime→destino centralizado, compartido por instalador, preflight y README, con smoke tests Windows/Linux.

10. **Cadena de suministro reproducible**  
    Skill Shielder se clona con commit SHA fijo y las acciones del workflow usan SHAs inmutables (no tags mutables).

11. **Soporte PARCIAL instalación Codex (SOLO SKILLS)**  
    El instalador debe aceptar `--target codex` y copiar los skills y agentes al destino correspondiente, verificando que `/skill-preflight` reporte `✓ Entorno OK` tras la instalación. : Codex carga skills desde .agents/skills, pero sus subagentes personalizados usan archivos TOML en .codex/agents. Implementaré codex como target gestionado de skills, sin copiar los agentes Markdown de SDDF a una ruta que Codex no reconoce. modelar Codex como destino de solo skills: instalará en .agents/skills sin copiar los agentes Markdown incompatibles. 


---

## Orden de ejecución acordado

1. CI de seguridad, contención de rutas de instalación y falsos verdes de evals.
2. Perfil core/dogfood reproducible y pruebas deterministas.
3. Enlaces reparados y contrato real de capacidades/extensiones publicado.
4. Release hygiene: versión `package.json` ↔ changelog, inventario, empaquetado y smoke de instalación.
5. Soporte PARCIAL instalación Codex (SOLO SKILLS).
---

## Definición de Terminado

- [ ] Los 3 hallazgos críticos corregidos y verificados en CI.
- [ ] Los 4 hallazgos altos corregidos con pruebas que los cubran.
- [ ] Los 3 hallazgos medios resueltos o con issue de seguimiento asignado.
- [ ] `npm run test:eval` en árbol limpio devuelve exit ≠ 0.
- [ ] `sddf.config.yaml` no exige scripts ni skills que no existan en una instalación core.
- [ ] README refleja exactamente lo que el paquete instala por defecto.
- [ ] Soporte instalación Codex
---

## Notas

- **`skill-test-evals` y `skill-master` no son parte del core**: son necesarios solo para construir este framework. Para usuarios finales son opcionales y se instalan desde el repositorio de extensión correspondiente.
- El foco no es añadir más proceso, sino **hacer ejecutables y bloqueantes** los contratos ya expresados en el repositorio.
- **Soporte parcial Codex:** La implementación quedará explícitamente limitada a skills en Codex: el contrato rechazará configuraciones ambiguas y el instalador no creará .agents/agents ni .codex/agents. El usuario tendría que gestionar manualmente cualquier agente adicional necesario para Codex, para lo cual: deberá colocar los archivos de agentes de subagentes correspondientes en `.codex/agents` y asegurarse de que los subagentes personalizados sean reconocidos por Codex pidiendole al runtime que los transforme en TOML (se delega la responsabilidad al usuario consumidor). El usuario debe instalar manualmente los agentes y pedirle a Codex que los transforme en archivos TOML.