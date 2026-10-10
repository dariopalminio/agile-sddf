---
alwaysApply: false
type: story
id: STORY-094
kind: chore
slug: STORY-094-refactory-and-fixing-insights
title: "Fix insight and VerificaciÃ³n de la instalaciÃ³n en Windows, macOS y Linux"
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

# ðŸ“– Historia: Hacer ejecutables y bloqueantes los contratos operativos del framework SDDF (harden-sddf-ci-install-and-evals)

**Como** mantenedor del framework SDDF,  
**Quiero** que la CI, el instalador y el runner de evals hagan cumplir de forma bloqueante los contratos que el repositorio ya declara,  
**Para** que ni un PR ni una instalaciÃ³n limpia puedan quedar en verde sin evidencia real, y el onboarding refleje capacidades reales.

---

## Criterios de aceptaciÃ³n

### CrÃ­ticos

1. **CI de seguridad sobre la fuente canÃ³nica**  
   El workflow escanea `skills/` (no `.claude/skills`), y tambiÃ©n `agents/`, `scripts/`, polÃ­ticas y workflows. Los hallazgos y errores del escÃ¡ner **bloquean** el workflow (no se toleran).

2. **ContenciÃ³n de rutas en la instalaciÃ³n**  
   `installSDDF` valida `SDDF_TARGET` permitiendo solo `.claude`, `.agents`, `.github`, y verifica contenciÃ³n con `path.resolve`/`path.relative`. La copia automÃ¡tica desde `postinstall` pasa a ser **opt-in**.

3. **Sin falsos verdes en evals**  
   `run-evals.js` falla (exit â‰  0) cuando no hay casos que ejecutar o cuando `--only` referencia IDs inexistentes. Se aÃ±ade `--changed-from <ref>` para PRs y en CI se usa base SHA o `--all`.

### Altos

4. **Perfil core/dogfood reproducible**  
   Se definen perfiles explÃ­citos (`core`, `dogfood`, stack) o se dejan los workers como `none` por defecto. Se documenta que `skill-test-evals` y `skill-master` **no son core**: son herramientas de construcciÃ³n del framework que se instalan desde el repositorio de extensiÃ³n externo.

5. **Runner endurecido**  
   `run-evals.js` usa `execFileSync` en lugar de interpolaciÃ³n en shell, valida nombres e IDs, y usa un helper de "ruta contenida" antes de cada lectura/escritura.

6. **Cadena mÃ­nima de pruebas deterministas en CI**  
   `node --test`, chequeo de sintaxis, auditor de raÃ­z, validaciÃ³n de evals/frontmatter, link-checker, `npm pack --dry-run` y smoke de instalaciÃ³n. Las evaluaciones LLM quedan en jobs manuales/nocturnos.

7. **Enlaces y documentaciÃ³n operativa reparados**  
   Se corrigen rutas hacia `docs/guardrails/gr-*.md` en `SECURITY.md`, `docs/policies/dod-story.md` y `docs/index.md`. La documentaciÃ³n histÃ³rica se marca como tal. Link-checker integrado en CI.

### Medios

8. **README con matriz de capacidades**  
   Publica claramente: Core / ExtensiÃ³n / Runtime / Requisito externo (por ejemplo, `security-audit` y OpenSpec).

9. **Contrato Ãºnico de rutas multi-runtime**  
   Mapa runtimeâ†’destino centralizado, compartido por instalador, preflight y README, con smoke tests Windows/Linux.

10. **Cadena de suministro reproducible**  
    Skill Shielder se clona con commit SHA fijo y las acciones del workflow usan SHAs inmutables (no tags mutables).

11. **Soporte PARCIAL instalaciÃ³n Codex (SOLO SKILLS)**  
    El instalador debe aceptar `--target codex` y copiar los skills y agentes al destino correspondiente, verificando que `/skill-preflight` reporte `âœ“ Entorno OK` tras la instalaciÃ³n. : Codex carga skills desde .agents/skills, pero sus subagentes personalizados usan archivos TOML en .codex/agents. ImplementarÃ© codex como target gestionado de skills, sin copiar los agentes Markdown de SDDF a una ruta que Codex no reconoce. modelar Codex como destino de solo skills: instalarÃ¡ en .agents/skills sin copiar los agentes Markdown incompatibles. 


---

## Orden de ejecuciÃ³n acordado

1. CI de seguridad, contenciÃ³n de rutas de instalaciÃ³n y falsos verdes de evals.
2. Perfil core/dogfood reproducible y pruebas deterministas.
3. Enlaces reparados y contrato real de capacidades/extensiones publicado.
4. Release hygiene: versiÃ³n `package.json` â†” changelog, inventario, empaquetado y smoke de instalaciÃ³n.
5. Soporte PARCIAL instalaciÃ³n Codex (SOLO SKILLS).
---

## DefiniciÃ³n de Terminado

- [ ] Los 3 hallazgos crÃ­ticos corregidos y verificados en CI.
- [ ] Los 4 hallazgos altos corregidos con pruebas que los cubran.
- [ ] Los 3 hallazgos medios resueltos o con issue de seguimiento asignado.
- [ ] `npm run test:eval` en Ã¡rbol limpio devuelve exit â‰  0.
- [ ] `sddf.config.yaml` no exige scripts ni skills que no existan en una instalaciÃ³n core.
- [ ] README refleja exactamente lo que el paquete instala por defecto.
- [ ] Soporte instalaciÃ³n Codex
---

## Notas

- **`skill-test-evals` y `skill-master` no son parte del core**: son necesarios solo para construir este framework. Para usuarios finales son opcionales y se instalan desde el repositorio de extensiÃ³n correspondiente.
- El foco no es aÃ±adir mÃ¡s proceso, sino **hacer ejecutables y bloqueantes** los contratos ya expresados en el repositorio.
- **Soporte parcial Codex:** La implementaciÃ³n quedarÃ¡ explÃ­citamente limitada a skills en Codex: el contrato rechazarÃ¡ configuraciones ambiguas y el instalador no crearÃ¡ .agents/agents ni .codex/agents. El usuario tendrÃ­a que gestionar manualmente cualquier agente adicional necesario para Codex, para lo cual: deberÃ¡ colocar los archivos de agentes de subagentes correspondientes en `.codex/agents` y asegurarse de que los subagentes personalizados sean reconocidos por Codex pidiendole al runtime que los transforme en TOML (se delega la responsabilidad al usuario consumidor). El usuario debe instalar manualmente los agentes y pedirle a Codex que los transforme en archivos TOML.