# Architecture

**Pattern:** Component-library-as-website — a Next.js App Router site that both hosts marketing/landing content (`src/views/home`) AND serves as the live documentation/demo site for a copy-paste component library (`/components/*` routes). No backend; it's a static/client-only app.

## High-Level Structure

```
Root layout (src/app/layout.tsx)
├─ Home route (src/app/page.tsx → src/views/home) — landing page, scrollytelling, live showcase
└─ /components/* routes (src/app/components/**)
   └─ shared docs layout (SidebarWrapper + Breadcrumb) wraps every component doc page
      └─ per-component route folder: layout.tsx (title metadata only) + page.tsx (docs/demo page)
```

Three parallel, differently-purposed "components" directories:

- `src/app/components/*` — Next.js **route segments** for docs pages (one folder per library component, each just `layout.tsx` + `page.tsx`). Not components themselves — pages that document/demo components.
- `src/artiux/components/*` — the actual **publishable component library** source. This is what a consumer copies into their own project. camelCase folders, mostly single `index.tsx` files.
- `src/components/*` — **site-only** supporting UI used to build the docs/marketing site itself (header/footer, sidebar, code preview/copy blocks, some shadcn-scaffolded `ui/` primitives). Not part of the library, not for external consumption.

## Identified Patterns

### Copy-paste library distribution (shadcn/ui style)

**Location:** `src/artiux/components/*`
**Purpose:** Ship components as source to be pasted into consumer projects, not as an npm package.
**Implementation:** Each doc page (`src/app/components/<name>/page.tsx`) embeds the raw component source as a template-literal string and renders a "copy code" block (`CopyCode`/`PreviewCode` from `src/components/*`) alongside a live-rendered instance.
**Example:** `src/app/components/select/page.tsx` imports live `Select` from `@/artiux/components/select` for the demo AND inlines its source text for copying.

### Responsive variant-switching within a single component

**Location:** e.g. `src/artiux/components/select/index.tsx`
**Purpose:** One public component API that renders entirely different implementations for mobile vs desktop.
**Implementation:** `useIsMobile('768')` (from `@/artiux/hooks/use-mobile`) branches between `<SelectMobile>` (uses custom `Drawer`) and `<SelectDesktop>` (Radix `Select` + `motion` animation layer).
**Example:** `src/artiux/components/select/index.tsx:54-78`

### Compound components — two competing conventions

**Location:** `src/artiux/components/*`
**Purpose:** Expose sub-parts of a component (e.g. Card.Header, Dialog.Title) for flexible composition.
**Implementation:** Inconsistent across the library —

- Flat named-export style (Card, Select, Drawer): `export function CardHeader()`, `export function CardTitle()`, composed manually by the consumer.
- Static-property style (Dialog only): default export with subcomponents attached (`Dialog.Header = Header`, etc. — `src/artiux/components/dialog/dialog.tsx:85-88`).

### Dynamic Tailwind color classes via safelist

**Location:** `src/artiux/utils/getColors.ts`, consumed across most components
**Purpose:** Let components accept a `color` prop and produce Tailwind classes like `bg-${colors.background}/15` at runtime.
**Implementation:** Because these class strings are built dynamically, Tailwind's static analyzer can't detect them — mitigated via an `@source inline(...)` safelist block in `src/app/globals.css` (lines 8-20).

## Data Flow

No client-server data flow exists — this is a fully static, client-rendered app. "Data" shown in demos (select options, status lists, framework lists) is hardcoded arrays inline in view/page files. Forms (react-hook-form + zod) validate client-side only; no submission endpoint was found.

## Code Organization

**Approach:** Feature/route-based for the Next.js app shell (`src/app`), source-copy-library-based for `src/artiux`, and a flat catch-all for site-only UI (`src/components`).
**Module boundaries:** Enforced only by folder convention and import path (`@/artiux/...` vs `@/components/...`), not by package boundaries — everything lives in one `src/` tree with a single `@/*` path alias.
