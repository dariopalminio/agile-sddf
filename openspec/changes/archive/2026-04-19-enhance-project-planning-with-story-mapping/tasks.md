## 1. Insert story mapping gate into project-planning skill

- [x] 1.1 Open `.claude/skills/project-planning/SKILL.md` and add a new **Paso 0 — Story Mapping** section after the template verification step (step 3) and before the architect delegation (step 4)
- [x] 1.2 In Paso 0: check if `docs/specs/project/story-map.md` exists; if it does, read it and display a confirmation that it will be used as planning input
- [x] 1.3 In Paso 0: if `story-map.md` does NOT exist, ask the user whether to run story mapping now or skip; if user accepts, invoke the `project-story-mapping` skill
- [x] 1.4 Ensure step numbering in the rest of the skill is updated (old step 4 → step 5, old step 5 → step 6)

## 2. Enrich architect delegation prompt

- [x] 2.1 Update the architect delegation instruction (Paso 5 after renumbering) to conditionally include `story-map.md` in the list of documents to read
- [x] 2.2 Add explicit instruction to the architect: when `story-map.md` is present, use the backbone activities as a guide for feature grouping and release slices as a guide for release structure in `project-plan.md`

## 3. Validate

- [x] 3.1 Read the updated SKILL.md and verify the story mapping gate is inserted in the correct position (after template verification, before architect delegation)
- [x] 3.2 Confirm the fallback path (user skips story mapping) results in behavior identical to the previous version
- [x] 3.3 Confirm the enriched architect prompt correctly references `story-map.md` when it exists
