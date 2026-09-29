# Contributing

## Workflow

1. Create a focused branch.
2. Keep changes small and reviewable.
3. Run `npm run build` before opening a PR.
4. Describe user-visible changes and financial-calculation impact.

## Commit style

Use concise descriptive messages such as:

- Add invoice reminder modal
- Improve mobile transaction table
- Update runway scenario calculations

Do not use Conventional Commit prefixes such as `feat:`, `fix:`, `docs:`, or `chore:`.

## Finance changes

Formula changes should document the formula, preserve deterministic calculation behavior, and keep critical calculations outside the AI layer.

## UI changes

Maintain the dark system, compact spacing, strong hierarchy, readable numbers, restrained borders, accessible contrast, and responsive layouts.
