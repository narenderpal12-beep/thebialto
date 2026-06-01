---
name: Wouter nested route redirect bug
description: setLocation() from useLocation() inside a Wouter nested Route (<Route nest>) navigates relative to the nest base, not the root — causes wrong destinations when redirecting out of a nested context.
---

## The Rule
Never use `setLocation("/admin/login")` inside a component that renders inside a `<Route path="/admin" nest>`. Use `window.location.replace("/admin/login")` instead.

**Why:** In Wouter v3.10, `useLocation()` inside a nested Route context returns a path relative to the nest base, AND `setLocation()` navigates relative to that same base. So `setLocation("/admin/login")` inside the `/admin` nest actually navigates to `/admin/admin/login`, which falls through to the NotFound route while still showing the AdminLayout.

**How to apply:** Any time a component (like ProtectedRoute) renders inside a nested Route and needs to redirect to an absolute URL outside that nest, use `window.location.replace(url)` instead of Wouter's `setLocation`. This applies in App.tsx's ProtectedRoute which renders inside `<Route path="/admin" nest>`.

**Side effects of the bug:** The AdminLayout sidebar still renders (because the outer nest matches), but the inner Switch shows NotFound ("Did you forget to add the page to the router?") instead of the login page.

**Also:** `useLocation()` in AdminLayout (which is inside the nested context) returns relative paths like `/` for `/admin` and `/rooms` for `/admin/rooms`. Active link highlighting must compare against these relative paths, not full paths like `/admin/rooms`.
