// The ONE place that decides whether the developer preview tools exist. They are a design-review aid: development only, never in a
// production build (the same rule the UI-variant switch in PreviewPanel has always followed).
export const DEV_PREVIEW_ENABLED = process.env.NODE_ENV !== "production"
