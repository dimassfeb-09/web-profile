// Curated project categories for the portfolio filter. A project can belong
// to more than one category (e.g. Foto In Aja is both AI and Web App).
// Keep this list small on purpose: raw tech_stack has 40+ values, most of
// them used once, so it cannot drive a filter. Add a new category here and
// it appears in the admin form checkboxes and the public filter chips.
//
// Cache note: the homepage is ISR-cached for 3600s and the service keeps an
// in-memory copy for the same window, so a categories change made straight
// in the database (bypassing the admin form) stays invisible for up to an
// hour unless the site is redeployed. Admin saves only clear the in-memory
// copy of the instance that handled the request, not the edge cache.
export const PROJECT_CATEGORIES = ['Mobile App', 'Web App', 'Package / Library', 'AI'] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
