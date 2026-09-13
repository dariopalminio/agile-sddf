# Plan 01 — Corregir la cobertura y el fallo de la CI de seguridad

## Contexto

El workflow skill-security-audit.yml filtra cambios bajo .claude/skills y ejecuta
Skill Shielder sobre esa ruta. La fuente versionada y canónica del producto es
skills/, mientras que .claude/ es una salida de instalación. Por ello, una
modificación de un skill fuente puede no ejecutar el control.

El mismo workflow usa continue-on-error en el paso de auditoría y solo falla
para un código concreto. Un error operativo del escáner, o un código de
hallazgo distinto del esperado, puede dejar el job verde.

## Objetivo verificable

Todo cambio en una superficie de seguridad definida debe activar la auditoría.
La auditoría debe revisar skills/ como fuente real y cualquier resultado no
cero del escáner debe hacer fallar el job, conservando siempre un informe para
diagnóstico.

## Alcance

Incluido:

- Corregir los filtros y el directorio objetivo de Skill Shielder.
- Activar el workflow ante cambios de skills, agentes, scripts, políticas,
  guardrails y workflows.
- Hacer bloqueantes tanto los hallazgos como los fallos operativos del escáner.
- Conservar audit-report.txt aun cuando la auditoría falle.
- Alinear SECURITY.md con el comportamiento implantado.
- Añadir una verificación regresiva del contrato del workflow.

No incluido:

- Fijar versiones o commits de GitHub Actions y Skill Shielder. Es una mejora
  de cadena de suministro independiente.
- Rediseñar todos los guardrails ni resolver enlaces rotos no relacionados.
- Usar pull_request_target, aumentar permisos o modificar el modelo de
  seguridad de contribuciones.

## Decisiones de diseño

### Fuente y superficies protegidas

La fuente auditada por Skill Shielder será exclusivamente skills/. No se debe
volver a leer .claude/ como fuente de revisión.

El workflow se activará para cambios en estas rutas:

| Superficie | Patrón de activación | Razón |
|---|---|---|
| Skills | skills/** | Instrucciones ejecutables fuente |
| Agentes | agents/** | Instrucciones ejecutables fuente |
| Scripts | scripts/** | Código de instalación y soporte |
| Políticas | docs/policies/** | Reglas que los agentes consumen |
| Guardrails | docs/guardrails/** | Controles de seguridad versionados |
| Workflows | .github/workflows/** | Definición de los propios controles |
| Contrato | SECURITY.md y AGENTS.md | Alcance y fuente canónica declarados |

La activación no equivale por sí sola a inspeccionar el contenido de cada
superficie. En esta corrección, Skill Shielder audita skills/. Antes de declarar
cobertura automática de agentes, scripts, políticas y workflows, se debe
confirmar qué directorios soporta el escáner. Si no los soporta, se añadirá un
job complementario y versionado para esas superficies; no se simulará cobertura
ejecutando Skill Shielder sobre un directorio que no entiende.

### Política de fallo

Se elimina continue-on-error. El paso que invoca el escáner debe:

1. Redirigir stdout y stderr a audit-report.txt.
2. Registrar su código de salida como salida del paso.
3. Finalizar con ese mismo código.

De esta forma, cero significa auditoría limpia y cualquier código distinto de
cero bloquea el job. Esto cubre tanto hallazgos de seguridad como errores de
red, permisos, herramientas faltantes o cambios incompatibles en el escáner.

La subida del artefacto usará if: always(), de modo que el informe permanezca
disponible incluso cuando el paso anterior falle. Ya no será necesario un paso
final que solo interprete el código 2.

El workflow mantiene permissions: contents: read y pull_request. Se añadirá
push sobre main con los mismos filtros para que un push directo excepcional no
evite el control, y se conserva workflow_dispatch para diagnóstico manual.

## Cambios por archivo

| Archivo | Cambio |
|---|---|
| .github/workflows/skill-security-audit.yml | Sustituir .claude/skills/** por la matriz de rutas protegidas; ejecutar Skill Shielder sobre skills/; quitar continue-on-error; propagar cualquier código de salida; subir el informe con if: always(); añadir push a main. |
| SECURITY.md | Reemplazar la limitación conocida sobre .claude/skills por la cobertura real, el alcance de activación y la política de fallo bloqueante. |
| scripts/verify-skill-security-workflow.js, o prueba equivalente | Validar de forma determinista que el workflow no referencia .claude/skills, incluye skills/ y las rutas críticas, no usa continue-on-error y conserva el artefacto ante fallo. |
| package.json, solo si hace falta | Exponer el verificador anterior mediante un script de CI. No añadir dependencias si Node estándar basta. |

## Plan de ejecución

1. Confirmar el contrato de salida de la versión de Skill Shielder que se usa
   actualmente: ejecución limpia, hallazgo y fallo técnico. Documentar los
   códigos observados, pero mantener la regla de que cualquier valor no cero
   bloquea.
2. Editar el bloque on del workflow con los patrones de la tabla anterior para
   pull_request y push sobre main. Mantener workflow_dispatch.
3. Cambiar el objetivo del comando de auditoría de .claude/skills a skills/.
   El informe debe indicar claramente el objetivo auditado.
4. Reescribir el paso de auditoría para capturar y propagar de forma segura el
   estado del comando. No usar pipes que oculten el código de Skill Shielder;
   si se usa tee, habilitar pipefail y capturar el estado del primer comando.
5. Eliminar continue-on-error y el paso final que solo falla cuando el código
   es 2. Configurar Upload audit report con if: always().
6. Ejecutar una comprobación de capacidad del escáner sobre agents/, scripts/,
   docs/policies/, docs/guardrails/ y .github/workflows/. Si admite esas
   entradas, añadir escaneos separados y etiquetados por superficie. Si no,
   crear un job complementario basado en controles locales para ellas y
   registrar su alcance explícito.
7. Actualizar SECURITY.md para que no afirme la limitación corregida ni
   prometa controles aún inexistentes.
8. Añadir el verificador regresivo del YAML y conectarlo a la CI de calidad
   cuando esta exista. Mientras tanto, ejecutarlo en la revisión de la PR.
9. Lanzar workflow_dispatch desde la rama de cambio, revisar el artefacto y
   configurar el status check resultante como requerido para main.

## Matriz de validación

| Caso | Preparación | Resultado esperado |
|---|---|---|
| Cambio de skill | PR que modifica skills/<nombre>/SKILL.md | El workflow se activa y Skill Shielder recibe skills/. |
| Cambio de agente | PR que modifica agents/<nombre>.agent.md | El workflow se activa; el informe identifica la superficie o el job complementario aplicable. |
| Cambio de script, política o workflow | Una PR por cada patrón protegido | El workflow se activa. |
| Auditoría limpia | Ejecución manual sobre la rama actual | Job verde y artefacto audit-report.txt disponible. |
| Hallazgo | Fixture temporal o mock controlado que devuelve un código de hallazgo | Job rojo y artefacto disponible. |
| Error del escáner | Mock controlado, ruta inválida o fallo de comando | Job rojo y artefacto disponible; nunca verde por continue-on-error. |
| Regresión de configuración | Ejecución del verificador de workflow | Falla si reaparece .claude/skills, falta una ruta crítica o se toleran errores. |
| Seguridad de permisos | Revisión estática del YAML | Solo contents: read; no pull_request_target. |

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| La ampliación revela hallazgos heredados | Corregirlos o justificarlos de forma visible antes de exigir el check; no añadir exclusiones silenciosas. |
| Un fallo de red del clon remoto bloquea PRs | Es el comportamiento seguro acordado; conservar artefacto y registrar el pinning del escáner como seguimiento de supply chain. |
| Skill Shielder no soporta una superficie no-skill | No declarar cobertura ficticia: usar job complementario con controles adecuados y documentados. |
| El check no protege pushes directos | Añadir push a main y configurarlo como required status check en la protección de rama. |

## Criterios de cierre

- No quedan referencias a .claude/skills ni a continue-on-error en el workflow.
- El scanner recibe skills/ como fuente auditada.
- Toda salida no cero del scanner deja el job rojo.
- El informe se conserva tanto en éxito como en fallo.
- Las siete superficies de la tabla disparan el workflow.
- SECURITY.md describe el comportamiento real.
- El check está requerido para cambios que llegan a main.
