## El Pipeline Completo de Bug Fixing (Agile SDDF)

**1. Bug Report (Reporte y Triaje)**
*   *¿Qué pasa?* Se recibe el reporte y se clasifica. Se valida que sea un bug real (y no un error de usuario o una feature faltante).
*   *Artefacto:* `bug.md` (creado con la plantilla oficial).
*   *Acción:* Se asigna severidad, prioridad y etiquetas (labels). Si no es un bug, se rechaza o se convierte en una `story`.

**2. Bug RCA (Root Cause Analysis / Análisis de Causa Raíz)**
*   *¿Qué pasa?* Se investiga el *por qué* del fallo. **No se escribe código de solución todavía.**
*   *Artefacto:* Se documenta en el mismo `bug.md` (sección "Contexto adicional") o en un `rca.md` derivado si es un bug crítico.
*   *Acción:* Uso de técnicas como "5 Whys" o Ishikawa. Se identifica el componente exacto que falló.

**3. Fix Plan (Planificación de la Solución)**
*   *¿Qué pasa?* Se define *cómo* se va a reparar el problema y qué impacto tendrá.
*   *Artefacto:* `plan.md` (derivado del bug) y `tasks.md`.
*   *Acción:* Se evalúan alternativas, se definen los archivos a tocar, los riesgos y se desglosan las tareas de implementación.

**4. Fixing (Implementación)**
*   *¿Qué pasa?* El desarrollador escribe el código (o actualiza los scripts de los skills).
*   *Artefacto:* Commits en la rama `fix/BUG-XXX-...` (rama de corta duración, alineado con Trunk-Based Development) y actualización de `tasks.md`.
*   *Acción:* Se aplica la solución según el plan, manteniendo los commits pequeños y atómicos.

**5. Code Review & CI (Revisión de Código e Integración Continua)**
*   *¿Qué pasa?* Se abre un Pull Request (PR) hacia `main`. Un compañero revisa el código y, en paralelo, el pipeline de CI/CD ejecuta pruebas automatizadas.
*   *Artefacto:* El **Pull Request** (PR) y los resultados del pipeline de CI.
*   *Acción:* El revisor valida que el fix ataca la causa raíz (RCA), no introduce *scope creep* y cumple con los estándares. **Regla de oro:** No hay merge sin aprobación (LGTM) y sin que las pruebas automáticas pasen en verde.

**6. Verify (Verificación / QA)**
*   *¿Qué pasa?* Se comprueba manualmente (si aplica) que el bug se ha ido y que no se ha roto nada más en un entorno de *staging* o local.
*   *Artefacto:* Evidencias de prueba (logs, capturas) añadidas al `bug.md` o al Pull Request.
*   *Acción:* Pruebas de regresión. *En tu caso específico:* ejecutar el validador de enlaces para confirmar que ya no hay enlaces rotos. *(Nota: Si la verificación es 100% automatizable, esto ocurre en el paso 5).*

**7. Bug Deploy (Despliegue)**
*   *¿Qué pasa?* Se integra el código en la rama principal y se despliega.
*   *Artefacto:* `CHANGELOG.md` actualizado.
*   *Acción:* Merge a `main` y despliegue automatizado o controlado por *Feature Flags*. En Trunk-Based Development, este paso es rápido y continuo.

**8. Complete, Closure & Post-mortem (Cierre y Lecciones Aprendidas)**
*   *¿Qué pasa?* Se cierra el workitem y se archiva.
*   *Artefacto:* Se archiva el `bug.md` y sus derivados (ej. moviéndolos a la carpeta `archived/`).
*   *Acción:* Se invoca el skill `/bug-complete`. Se actualiza la documentación (si aplica) y, en bugs críticos, se documenta qué se aprendió para evitar que vuelva a ocurrir.
