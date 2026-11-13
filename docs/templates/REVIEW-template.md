<!-- ------------------------------------------------------------------ -->
<!-- REVIEW TEMPLATE — guía de revisión del proyecto                     -->
<!--                                                                    -->
<!-- Cómo usarla:                                                        -->
<!-- 1. Copia este archivo a REVIEW.md en la raíz del repositorio,       -->
<!--    junto a AGENTS.md y CLAUDE.md.                                   -->
<!-- 2. Reemplaza los [placeholders] por los riesgos reales de tu repo   -->
<!--    y borra las viñetas que no apliquen.                             -->
<!-- 3. Conserva solo las cuatro secciones de la convención de Claude    -->
<!--    Code Review: qué es Important, tope de Minor, qué no reportar y   -->
<!--    qué verificar siempre. REVIEW.md cambia QUÉ se reporta y con qué -->
<!--    severidad; NO cambia el formato del informe, que lo fija la      -->
<!--    plantilla de code-review-report.md de /story-code-review. Por    -->
<!--    eso esta guía no tiene sección de formato de salida.             -->
<!-- 4. Cita rutas que existan: la guía no describe nada inexistente.    -->
<!-- 5. Borra estos comentarios antes de publicar.                       -->
<!-- ------------------------------------------------------------------ -->

# REVIEW.md — Guía de revisión de [nombre del proyecto]

Esta guía decide qué se reporta y con qué severidad; no cambia el formato del informe.
Vocabulario: 🔴 Important = HIGH/MEDIUM (bloquea en `/story-code-review`) · 🟡 Minor = LOW (no bloquea) · 🟣 Pre-existing = PREEXISTENTE (se informa, no bloquea).

## Qué es «Importante» aquí — 🔴 Important · HIGH/MEDIUM

<!-- instrucción: una viñeta por área del repositorio (ruta o glob) con el defecto concreto que la rompe:
     comportamiento roto, fuga de datos o rollback imposible. Nunca "código de mala calidad". -->

Reserva 🔴 Important para hallazgos que rompan el comportamiento, filtren datos o bloqueen un rollback seguro:

- `[ruta o glob del área]`: [defecto que la rompe, p. ej. contrato entre componentes roto, lógica incorrecta, condición de carrera]
- `[ruta o glob del área]`: [defecto que la rompe, p. ej. migración no compatible hacia atrás]
- Cualquier archivo: [riesgo transversal, p. ej. secreto o credencial versionada, PII en logs o mensajes de error]

Un 🔴 Important exige `archivo:línea` y un escenario de fallo concreto (entrada o estado → resultado incorrecto).
Estilo, nombres y refactors: 🟡 Minor como máximo.

## Tope de Minor — 🟡 Minor · LOW

- Máximo **[5]** 🟡 Minor por revisor: elige los más relevantes y resume el resto en una línea.
- No repitas un 🟡 Minor de una ronda anterior si el rework no tocó esas líneas.
- Si no hay hallazgos por encima de 🟡 Minor, dilo en una frase, sin elogios ni resúmenes archivo por archivo.

## No reportar

<!-- instrucción: rutas y clases de problemas que la revisión ignora. Excluye también las rutas que
     no deben servir como fuente de reglas (copias de instalación, artefactos generados). -->

- Lo que ya comprueba el CI con `[comando del gate]`: [p. ej. lint, formato, errores de tipo].
- Artefactos generados y copias de instalación: `[rutas]`. No se revisan ni sirven como fuente de reglas.
- Datos falsos intencionados en fixtures y pruebas: `[rutas]`.
- Código de terceros: `[p. ej. vendor/, node_modules/]`.
- Líneas que la historia no tocó → 🟣 Pre-existing (PREEXISTENTE): se informa, no bloquea.

## Verificar siempre

<!-- instrucción: solo verificaciones que el CI no ejecuta y que, olvidadas, cuestan una ronda de
     corrección. Cada ítem debe poder comprobarse en el alcance de la historia. -->

En cada revisión, confirma que:

- [ ] [Verificación que el CI no cubre, p. ej. las rutas de API nuevas incluyen una prueba de integración]
- [ ] [Verificación que el CI no cubre, p. ej. las líneas de log no contienen correos, IDs de usuario ni cuerpos de petición]
- [ ] [Verificación que el CI no cubre, p. ej. las queries filtran por el `tenant_id` del llamante]
