# Development workflow

Keep each change small enough for another student to understand and review.

1. Start from the latest `main` and create a descriptive feature branch, for example `feature/journey-results`. Use the existing checkout; a separate worktree is unnecessary.
2. Read README.md and run the current app before editing.
3. Make one focused change. Keep the existing design and behavior working. Label mock transport data as simulated and keep credentials out of Git.
4. Run JavaScript lint, Python lint/format checks, API tests, the frontend build, and browser tests using the README commands. Add relevant tests for new behavior.
5. Inspect `git diff` and `git status`. Commit source, tests, documentation, and lockfile changes together. Do not commit dependencies or generated build outputs.
6. Push the feature branch and open a pull request against `main`. Describe the user-visible change and the checks actually run.
7. Ask a teammate to review, check GitHub Actions, and merge when the work is approved. Preserve working milestones in Git.

The Python/JavaScript migration stays within Phase 1. Do not begin Phase 2 until the project owner reviews the first version.
