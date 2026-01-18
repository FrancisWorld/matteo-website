# Codebase Issues & Type Errors

## Active Issues Found During Analysis

### 1. Blog Routes - Meta/Loader Function Issues

**File**: `src/routes/blog/index.tsx` (Line 8)
```
ERROR: Object literal may only specify known properties, and 'meta' does not exist
```
**Issue**: TanStack Start may use a different API for route metadata. Currently using `meta: () => [...]` but may need `beforeLoad` or different structure.

**File**: `src/routes/blog/$slug.tsx` (Line 11)
```
ERROR: Object literal may only specify known properties, and 'meta' does not exist
ERROR: Binding element 'loaderData' implicitly has an 'any' type
```
**Issue**: Similar meta issue + missing type definition for loader data.

**File**: `src/routes/blog/new.tsx` (Line 1)
```
ERROR: 'redirect' is declared but its value is never read
```
**Issue**: Unused import from '@tanstack/react-router'.

---

### 2. Accessibility Issues

**File**: `src/routes/blog/new.tsx` (Lines 78, 88, 98, 108)
```
ERROR: A form label must be associated with an input
```
**Issue**: Form labels exist but are not properly linked to inputs via `htmlFor` attribute.

**Example Fix**:
```tsx
// Before (incorrect)
<Label>Email</Label>
<Input type="email" />

// After (correct)
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
```

---

### 3. Array Keys in Loops

**File**: `src/routes/blog/index.tsx` (Line 28)
```
ERROR: Avoid using the index of an array as key property in an element
```

**File**: `src/routes/blog/$slug.tsx` (Line 83)
```
ERROR: Avoid using the index of an array as key property in an element
```

**Issue**: Using array index as React key prop causes reconciliation issues. Use unique IDs instead.

**Example Fix**:
```tsx
// Before (incorrect)
{paragraphs.map((p, i) => <p key={i}>{p}</p>)}

// After (correct)
{paragraphs.map((p) => <p key={p.id}>{p}</p>)}
```

---

### 4. Type Inference Issues

**File**: `src/routes/blog/$slug.tsx` (Line 29)
```
ERROR: Property 'post' does not exist on type 'undefined'
ERROR: Parameter 'paragraph' implicitly has an 'any' type
ERROR: Parameter 'i' implicitly has an 'any' type
```

**Issue**: Missing proper typing for loader data and function parameters.

**Root Cause**: TanStack Start's loader/action API may have changed. Current implementation assumes `loaderData` is passed but TypeScript doesn't recognize it.

---

## Priority Fixes

### 🔴 Critical (Blocks Build)
None—current issues are warnings/errors but app runs.

### 🟡 High (Should Fix Before Production)
1. Fix form label associations in `src/routes/blog/new.tsx`
2. Replace array index keys with unique identifiers
3. Fix TypeScript any types in blog routes

### 🟢 Medium (Nice to Have)
1. Clean up unused imports
2. Verify meta/loader function API against latest TanStack Start docs

---

## How to Fix

### Option A: Check TanStack Start Docs
Run:
```bash
context7 resolve-library-id --query "TanStack Start loader meta head function" --library "TanStack Start"
context7 query-docs --library "/tanstack/react-start" --query "loader meta head configuration"
```

### Option B: Verify Against Route Definition Types
Check `src/router.tsx` and route configuration to see how meta/loader should be defined.

### Option C: Run Type Check
```bash
pnpm tsc --noEmit
```

---

## Notes

- These issues don't prevent the app from running locally
- They will likely cause TypeScript build errors in production
- Should be addressed before deploying to staging/production
- Most can be fixed with minor type adjustments and proper attribute linking
