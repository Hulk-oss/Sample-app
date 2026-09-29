# Frontend Design System

## Typography

The application uses one type family across public, authentication, user, and company surfaces:

- IBM Plex Sans Regular (400): body copy and data.
- IBM Plex Sans Medium (500): labels and secondary emphasis.
- IBM Plex Sans Semibold (600): controls and compact emphasis.
- IBM Plex Sans Bold (700): page headings and key financial numbers.

Avoid introducing another font family inside a feature.

## Core visual tokens

Existing CSS variables remain the source of truth for the current product. New components should reuse them instead of adding one-off values.

Core groups:
- canvas/background
- surface
- border
- text
- muted text
- primary/action
- success
- warning
- danger
- spacing
- radius
- shadow

## Component hierarchy

### Foundation
- Button
- Badge
- Input/select
- Icon button
- Modal
- Toast

### Data display
- KPI
- Card
- Table
- Empty state
- Chart card

### Product layout
- App shell
- Sidebar
- Topbar
- Page heading
- Feature-specific section layouts

## Interaction rules

Interactions should communicate state without decorative noise.

Use:
- subtle hover elevation
- clear active states
- visible focus rings
- disabled states
- short transitions

Avoid:
- decorative glow
- excessive gradients
- attention-seeking continuous animation
- large transformations on small controls

## Accessibility

Interactive controls should:
- remain keyboard reachable
- expose a visible `:focus-visible` state
- use buttons for actions rather than clickable non-controls
- keep readable text size
- preserve sufficient contrast
- communicate disabled/loading states

## Responsive behavior

Mobile layouts should preserve the same information hierarchy as desktop.

Do not:
- remove important financial information simply to fit the viewport
- reduce body copy below a readable size
- rely only on hover interactions

## Finance-product principle

The visual system should make financial values, account state and actions easy to understand.

Decorative UI must remain subordinate to:
1. financial numbers
2. account status
3. action controls
4. explanatory context
