# Agent Rules

## Approval-First Workflow (MANDATORY)

**You MUST follow this workflow for every task that involves touching the codebase:**

1. **Research only** — investigate the codebase, read files, gather context. Do NOT modify any files during this phase.
2. **Create an implementation plan** — write a clear plan describing every file that will be added, modified, or deleted, and why.
3. **Wait for explicit user approval** — stop and do nothing until the user says to proceed (e.g. "go ahead", "looks good", "approved", etc.).
4. **Execute** — only after approval, make the code changes.
5. **Verify** — run build/type checks and summarize what was changed.

> **This rule is NON-NEGOTIABLE.** Never make proactive code edits, never "fix small things along the way", and never interpret ambiguous intent as approval. When in doubt, ask.

---

## No-Comment Rule

Do **not** add comments to code unless absolutely necessary.

When a comment is required, explain **why**, not **what**. The code itself should communicate what it does.

- ❌ `// Normalize path to ensure leading slash` — describes what the code does, redundant.
- ✅ `// Strapi rejects requests without a leading slash even when the URL is otherwise valid` — explains a non-obvious external constraint.
