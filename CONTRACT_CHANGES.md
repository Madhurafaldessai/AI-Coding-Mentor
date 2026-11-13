# Shared contract additions

- `MentorResponse.costXp?: number` exposes the server-calculated cost of the requested hint.
- `AttemptPayload.language?: Lang` and `runtimeMs?: number` support per-language attempt recording.
- `ProgressResponse` gained optional XP breakdown, level-progress, and completion-state fields; existing fields are unchanged.
