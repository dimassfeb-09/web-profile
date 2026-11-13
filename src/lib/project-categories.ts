// Curated project categories for the portfolio filter. A project can belong
// to more than one category (e.g. Foto In Aja is both AI and Web App).
// Keep this list small on purpose: raw tech_stack has 40+ values, most of
// them used once, so it cannot drive a filter. Add a new category here and
// it appears in the admin form checkboxes and the public filter chips.
export const PROJECT_CATEGORIES = ['Mobile App', 'Web App', 'Package / Library', 'AI'] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
