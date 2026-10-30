# Code Conventions

## Naming Conventions

**Files:**

- `src/artiux/components/<name>/` folders: camelCase (`buttonGroup`, `multiSelect`, `rippleContainer`, `checkboxCompose`). Most contain a single `index.tsx`; a minority use `<name>.tsx` instead (e.g. `dialog/dialog.tsx`, `rippleContainer/rippleContainer.tsx`) — **inconsistent**, no single rule enforced.
- `src/app/components/<name>/` doc-route folders: **mixed** camelCase and kebab-case (`buttonGroup` vs `bubble-button`, `circularProgress` vs `circle-transition`, `ripple-container`, `to-left`, `step-form`).

**Functions/Components:** PascalCase, e.g. `Button`, `CardHeader`, `SelectDesktop`, `SelectMobile`.

**Variants objects:** `<component>Variants`, e.g. `buttonVariants`, `badgeVariants` (both `cva()`-produced).

**Variables:** camelCase throughout.

## Code Organization

**Import/Dependency Declaration:** No enforced/observed strict ordering (no ESLint import-order rule present — no ESLint config at all currently).
**File Structure:** Single-file component modules — props interface(s) + component function(s) all in one file. No separate `types.ts` files anywhere.

## Type Safety/Documentation

**Approach:**

- `strict: true` in `tsconfig.json` — TypeScript is the primary enforced quality gate (no ESLint config currently present).
- Props interfaces extend native HTML attribute types, e.g. `ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>` (`src/artiux/components/button/index.tsx:14`).
- `VariantProps<typeof xVariants>` (from `class-variance-authority`) used to type variant-driven props.
- Generic components for form-bound inputs, e.g. `Select<TFieldValues extends FieldValues>` integrating `Control<TFieldValues>` / `Path<TFieldValues>` from react-hook-form (`src/artiux/components/select/index.tsx:19-54`).
- Both component and its `Props` interface are named-exported, so consumers can import types directly (e.g. `export interface SelectProps<...>`, `export function Select<...>`).

## Error Handling

**Pattern:** No systematic error handling observed (no API calls, no try/catch patterns noted across sampled files) — this is a client-only demo/library app without a backend to fail against.

## Comments/Documentation

**Style:** Minimal to none. Search across `src/` for TODO/FIXME/HACK found zero real matches (one false positive inside an SVG asset string). No JSDoc/docblocks observed on sampled components.

## Styling Convention

- Tailwind CSS utility classes exclusively — no CSS Modules, no styled-components, no `styles.module.css` files anywhere.
- `cn()` (`twMerge(clsx(inputs))`, in `src/lib/utils.ts`) used for conditional/merged class composition.
- `'use client'` directive at the top of nearly every interactive component file.
