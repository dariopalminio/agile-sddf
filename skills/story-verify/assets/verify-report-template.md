---
type: verify-report
id: {story_id}
slug: {story_id}-verify-report
title: "Verify Report: {story_title}"
story: {story_id}
date: {date}
mode: {mode}
dod_version: {dod_version}
created: {date}
updated: {date}
---

# Test Report: {story_title}

**Date**: {date}
**Story**: {story_id}
**Mode**: {mode}
**DoD Version**: {dod_version}

## Summary

| Metric | Value |
|--------|-------|
| Total Tests | {total_tests} |
| Passed | {passed} |
| Failed | {failed} |
| Skipped | {skipped} |
| Coverage | {coverage} |

## Test Scope

- {unit_tests_check} Unit tests
- {integration_tests_check} Integration tests
- {e2e_tests_check} E2E tests
- {performance_tests_check} Performance tests
- {security_tests_check} Security tests

## Findings

{findings_by_severity}

## Coverage Analysis

{coverage_analysis}

## DoD VERIFY Criteria

| # | Criterio | Estado | Evidencia |
|---|----------|--------|-----------|
{dod_criteria_rows}

**Resumen DoD**: {dod_passed}/{dod_total} criterios ✓

## Recommendations

{recommendations}

## Sign-off

- {sign_off_critical} All critical issues addressed
- {sign_off_coverage} Coverage meets threshold (80%)
- {sign_off_performance} Performance meets SLA

## Severity Definitions

| Severity | Criteria |
|----------|----------|
| **CRITICAL** | Security vulnerability, data loss, system crash |
| **HIGH** | Major functionality broken, severe performance |
| **MEDIUM** | Feature partially working, workaround exists |
| **LOW** | Minor issue, cosmetic, edge case |

## Historial de Ejecuciones Anteriores

{history}
