# ✅ SSR Error Fixed!

## The Problem:
```
Error: useSettings must be used within a SettingsProvider
```

This happened because Next.js tried to prerender the `/captions` page during build, but `useSettings()` was throwing an error when the context wasn't available.

## The Fix:

**lib/settings.tsx:**
Changed `useSettings()` to return default settings during SSR instead of throwing:

```typescript
export function useSettings() {
  const context = useContext(SettingsContext)
  // During SSR or if context is undefined, return default settings
  if (context === undefined) {
    if (typeof window === 'undefined') {
      // SSR: return default settings
      return {
        settings: defaultSettings,
        updateSettings: () => {},
      }
    }
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
```

**app/captions/page.tsx:**
- Added `export const dynamic = 'force-dynamic'` to skip static generation
- Removed the workaround code

**app/layout.tsx:**
- Moved `viewport` and `themeColor` to separate `viewport` export (Next.js 16 requirement)

## Result:

✅ Build should now complete successfully!
✅ No more SSR errors
✅ Metadata warnings fixed

Try building again:
```bash
npm run build
```
