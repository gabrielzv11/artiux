# Project Structure

**Root:** `c:\Users\Usuario\Documents\Trabalhos\ArtIux\artiux-lab`

## Directory Tree

```
src/
├─ app/                        Next.js App Router
│  ├─ layout.tsx, page.tsx, loading.tsx, globals.css, favicon.ico
│  ├─ layers/
│  ├─ three/
│  └─ components/               doc/demo routes, one folder per library component
│     ├─ layout.tsx, page.tsx   (listing page for /components)
│     └─ <name>/  { layout.tsx (title metadata only), page.tsx (docs/demo) }
│        (28 folders: badge, breadcrumb, bubble-button, button, buttonGroup,
│         calendar, card, checkboxCompose, circle-transition, circularProgress,
│         dialog, drawer, iconButton, icons, inputNumber, multiSelect,
│         progressBar, radioCompose, radioGroup, ripple-container, select,
│         step-form, switch, tabs, text, textField, to-left, utils)
│
├─ artiux/                     the publishable component library
│  ├─ components/<name>/       index.tsx (or <name>.tsx) — 26 components
│  ├─ hooks/                   use-mobile.tsx, useOutsideClick.ts
│  └─ utils/                   getColors.ts
│
├─ assets/                     brand/, components/, images/
├─ components/                 site-only marketing/docs UI (NOT the library)
│  ├─ animatedForm/, barChart/, breadcrumb/, button/, cardSwap/,
│  │  circularProgress/, command/, componentCard/, copyCode/, customize/,
│  │  draggableBox/, dropdownMenu/, grainient/, label/,
│  │  layout/ (footer/, header/, sidebarWrapper/, transitionWrapper/),
│  │  lineChart/, link/, modernCard/, movingSquares/, musicBars/,
│  │  pageLoader/, pieChart/, previewCode/, radio/, stepFormProvider/,
│  │  textField/, ui/
│
├─ data/
├─ hook/                       site-only hooks (useSnap, useScrollSmoother, ...)
├─ interfaces/
├─ lib/                        utils.ts → cn() helper
└─ views/
   └─ home/  index.tsx         landing page composition
```

## Module Organization

### `src/app` — Next.js routing shell

**Purpose:** Route definitions, global layout, fonts, providers (ViewTransitions, Toaster, Analytics).
**Location:** `src/app/layout.tsx` (root), `src/app/components/layout.tsx` (docs shell).
**Key files:** `src/app/globals.css` (Tailwind v4 theme + safelist), `src/app/page.tsx`.

### `src/artiux` — the component library itself

**Purpose:** Source-of-truth for every component the library ships; this is what end users copy into their own projects.
**Location:** `src/artiux/components/<name>/index.tsx`.
**Key files:** `src/artiux/utils/getColors.ts` (shared color-class resolver), `src/artiux/hooks/use-mobile.tsx` (responsive variant switch).

### `src/components` — docs/site-only UI

**Purpose:** Builds the artiux.dev website chrome and docs page furniture (header, footer, sidebar nav, code-copy blocks, charts for demos). Explicitly NOT part of the shippable library (per README).
**Location:** `src/components/*`.
**Key files:** `src/components/copyCode`, `src/components/previewCode` (render the "copy this code" blocks on every doc page), `src/components/layout/sidebarWrapper` (docs nav).

## Where Things Live

**Adding/editing a library component:**

- Component source: `src/artiux/components/<name>/index.tsx`
- Doc/demo page: `src/app/components/<name>/page.tsx` (+ `layout.tsx` for `<title>` metadata)
- Config: no per-component config files; styling inline via Tailwind + `cva`.

**Site chrome (header/footer/sidebar):** `src/components/layout/*`

**Landing page:** `src/views/home/index.tsx`, wired via `src/app/page.tsx`
