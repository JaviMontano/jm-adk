# Design Tokens

> Single source of truth for all visual design values. Import or reference these tokens in every project built with the kit.

---

## CSS Custom Properties

```css
:root {
  /* ─── Colors — Neutral ─── */
  --color-bg: hsl(0, 0%, 100%);
  --color-bg-alt: hsl(220, 14%, 96%);
  --color-surface: hsl(0, 0%, 100%);
  --color-border: hsl(220, 13%, 91%);
  --color-text: hsl(220, 13%, 13%);
  --color-text-muted: hsl(220, 9%, 46%);

  /* ─── Colors — Brand ─── */
  --color-primary: hsl(220, 90%, 56%);
  --color-primary-hover: hsl(220, 90%, 46%);
  --color-secondary: hsl(160, 84%, 39%);
  --color-accent: hsl(38, 92%, 50%);
  --color-error: hsl(0, 84%, 60%);
  --color-warning: hsl(38, 92%, 50%);
  --color-success: hsl(160, 84%, 39%);
  --color-info: hsl(220, 90%, 56%);

  /* ─── Spacing — 4px scale ─── */
  --space-xs: 0.25rem;   /*  4px */
  --space-sm: 0.5rem;    /*  8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  --space-2xl: 3rem;     /* 48px */
  --space-3xl: 4rem;     /* 64px */

  /* ─── Typography ─── */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 2rem;      /* 32px */
  --font-size-4xl: 2.5rem;    /* 40px */

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* ─── Breakpoints ─── */
  --bp-sm: 640px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;

  /* ─── Border Radius ─── */
  --radius-sm: 0.25rem;   /*  4px */
  --radius-md: 0.5rem;    /*  8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-full: 9999px;

  /* ─── Shadows ─── */
  --shadow-sm: 0 1px 2px hsl(0 0% 0% / 0.05);
  --shadow-md: 0 4px 6px hsl(0 0% 0% / 0.07);
  --shadow-lg: 0 10px 15px hsl(0 0% 0% / 0.1);

  /* ─── Transitions ─── */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;

  /* ─── Z-Index Scale ─── */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 300;
  --z-toast: 400;
}
```

---

## Usage Guidelines

### Applying Colors

```css
body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--space-lg);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-lg);
  transition: background var(--transition-fast);
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}
```

### Responsive Breakpoints

```css
/* Mobile first — default styles apply to smallest screens */

@media (min-width: 640px)  { /* sm  — large phones, landscape */ }
@media (min-width: 768px)  { /* md  — tablets */ }
@media (min-width: 1024px) { /* lg  — laptops */ }
@media (min-width: 1280px) { /* xl  — desktops */ }
```

### Spacing Convention

Use the 4px grid. Combine tokens for compound spacing:

| Context | Token |
|---|---|
| Inline element gap | `--space-xs` or `--space-sm` |
| Component padding | `--space-md` or `--space-lg` |
| Section margin | `--space-xl` to `--space-3xl` |
| Page-level gutter | `--space-lg` to `--space-2xl` |

### Typography Scale

| Role | Size Token | Weight Token |
|---|---|---|
| Body text | `--font-size-base` | `--font-weight-regular` |
| Small / caption | `--font-size-sm` | `--font-weight-regular` |
| Subheading | `--font-size-lg` | `--font-weight-semibold` |
| Heading 3 | `--font-size-xl` | `--font-weight-semibold` |
| Heading 2 | `--font-size-2xl` | `--font-weight-bold` |
| Heading 1 | `--font-size-3xl` | `--font-weight-bold` |
| Hero / display | `--font-size-4xl` | `--font-weight-bold` |
| Code / monospace | `--font-size-sm` | `--font-weight-regular` + `--font-mono` |

---

## Dark Mode (Optional Extension)

When a project requires dark mode, add a `[data-theme="dark"]` selector:

```css
[data-theme="dark"] {
  --color-bg: hsl(220, 13%, 10%);
  --color-bg-alt: hsl(220, 13%, 14%);
  --color-surface: hsl(220, 13%, 16%);
  --color-border: hsl(220, 13%, 24%);
  --color-text: hsl(220, 14%, 96%);
  --color-text-muted: hsl(220, 9%, 60%);

  --shadow-sm: 0 1px 2px hsl(0 0% 0% / 0.2);
  --shadow-md: 0 4px 6px hsl(0 0% 0% / 0.3);
  --shadow-lg: 0 10px 15px hsl(0 0% 0% / 0.4);
}
```

---

*Last updated: 2026-03-21*
