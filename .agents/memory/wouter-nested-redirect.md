---
name: Wouter nested route redirect bug
description: Inside a Wouter nested Route (<Route nest>), both setLocation() AND Link href with absolute paths resolve relative to the nest base — NOT the root. Must use relative hrefs and window.location to escape.
---

## The Rule
Inside any component rendered inside `<Route path="/admin" nest>`:
- `<Link href="/admin/rooms">` → navigates to `/admin/admin/rooms` ✗ — use `<Link href="/rooms">` ✓
- `setLocation("/admin/login")` → navigates to `/admin/admin/login` ✗ — use `window.location.replace("/admin/login")` ✓
- `useLocation()` returns `/rooms` when URL is `/admin/rooms` (relative to nest base)

**Why:** Wouter v3.10 nested Router contexts strip the base prefix from location AND prepend it to all navigation. Absolute paths starting with `/` are treated as absolute within the sub-router, not the root router.

**How to apply:** 
1. All `<Link>` hrefs inside AdminLayout must use relative paths (e.g., `/rooms`, `/floors`, `/`) not full paths (`/admin/rooms`).
2. All `setLocation()` calls that redirect OUT of the nested context must use `window.location.replace(url)` instead.
3. Active-link checks must compare `useLocation()` result (relative) against relative paths.

**Applied in:**
- `AdminLayout.tsx`: Link hrefs changed to `link.rel` (relative paths), logout uses `window.location.replace`
- `App.tsx` ProtectedRoute: uses `window.location.replace("/admin/login")` instead of `setLocation`
