# Novo Pharma — App Redesign (lima/dark-mode commerce pivot)

Status: approved by user 2026-08-31. Source material: `resources/App redesign/handoff/`
(drop-in RN code, README inside it) and `resources/redesign.dc.html` (interactive canvas
mockup — visual/state reference only, not code to port).

## Why

Full design-system pivot: teal/light-only ("Teal Health & Wellness") → lima accent +
switchable light/dark. App architecture reframes from "prescription-first" to
"storefront-first" commerce: home is a shopfront, cart becomes a first-class tab,
prescriptions become a purchase requirement rather than the center of the app.

## Decisions locked in with user

- Load real Space Grotesk / JetBrains Mono fonts (not fallback to Inter).
- Drop "Recetas" tab entirely; move listing to `app/prescription/index.tsx` (secondary
  screen), 5 tabs = Tienda · Buscar · Carrito · Pedidos · Perfil.
- Keep mock data (`setTimeout` + `MOCK_PRODUCTS`) for this pass — no real Supabase wiring.
- Update `CLAUDE.md` design-tokens section to document the new palette once done.

## A — Tokens & theme

- Replace `types/theme.ts` with handoff version: `ColorTokens` interface, `darkColors`,
  `lightColors`, plus `colors` kept as an alias (`= darkColors`) so any straggler import
  doesn't hard-crash at import time (still must be migrated per section G — this alias is
  a safety net, not a design pattern to keep using).
- Add `hooks/useTheme.ts`: reads `useColorScheme()`, returns `{ colors, isDark }`.
- Replace `tailwind.config.js` with handoff version: `accent`/`ink`/`paper`/`info`/`rx`/
  `warning` color keys, `darkMode: 'class'`, `fontFamily` pointing at
  `SpaceGrotesk-*`/`JetBrainsMono-Regular`, `borderRadius.card`=18px, `.button`=14px.
- Screens/components consume color via `useTheme()` + inline `style={{ color: colors.x }}`,
  **not** Tailwind `dark:` variants — this is the pattern the handoff code already uses
  throughout (see `ProductRow.tsx`). Tailwind classes stay responsible for spacing/type
  scale/radius only.

## B — Fonts

- Add deps: `@expo-google-fonts/space-grotesk`, `@expo-google-fonts/jetbrains-mono`.
- `app/_layout.tsx`: add `useFonts` entries `SpaceGrotesk-Regular/Medium/Bold` and
  `JetBrainsMono-Regular` (family names must match `tailwind.config.js` `fontFamily`
  exactly). Keep existing Inter loading as-is — cheap to leave loaded, avoids touching
  unrelated font-loading logic.

## C — New primitives (copied from handoff, no changes)

- `components/ui/Skeleton.tsx` — `Skeleton`, `SkeletonProductRow`, `SkeletonProductCard`.
- `components/ui/EmptyState.tsx`
- `components/ui/LoadingSteps.tsx`
- `components/product/ProductRow.tsx`

## D — Navigation

- Replace `components/navigation/FloatingTabBar.tsx` and `app/(tabs)/_layout.tsx` with
  handoff versions (5 tabs, cart badge from `useCartStore`).
- **Deviation from handoff:** import `BottomTabBarProps` from `expo-router/tabs` (already
  proven to resolve in this repo), not `@react-navigation/bottom-tabs` (not hoisted to
  top-level `node_modules`, would fail to resolve at build time).
- Delete `types/navigation.ts` — its only consumers (`TabItem`, `FloatingTabBarProps`) were
  the old tab bar + old `_layout.tsx`, both replaced.

## E — Screens: replace / add

Folder names below use the real RN Router names — handoff's `-tabs-`/`-id-` are just its
filesystem workaround for parens/brackets.

- `app/(tabs)/index.tsx` — replace
- `app/(tabs)/search.tsx` — add (new)
- `app/(tabs)/cart.tsx` — add (new), see section H for store wiring change
- `app/(tabs)/orders.tsx` — add (new)
- `app/(tabs)/profile.tsx` — replace
- `app/order/checkout.tsx` — replace
- `app/order/[id].tsx` — replace (280px empty `View` placeholder stays where
  `react-native-maps` would go — no new map dependency this pass)

## F — Deletions / moves

- Delete `app/(tabs)/catalog.tsx` — fully superseded by `search.tsx` + `ProductRow`.
- Delete `components/product/ProductCard.tsx` — only consumer was `catalog.tsx`; unused
  after F's first bullet, and it hardcodes now-removed color tokens (`bg-brand`,
  `colors.rx` from the old static export).
- Move `app/(tabs)/prescriptions.tsx` → `app/prescription/index.tsx`, remove its
  `Tabs.Screen` entry. `app/prescription/upload.tsx` keeps working as the modal it already
  is (`app/_layout.tsx` registers it outside the tab group).

## G — Existing code not in the handoff, but broken by the token swap

The handoff never touches these files, but they hardcode class names/hex values tied to
color keys that section A removes (`bg-brand`, `bg-brand-secondary`, `text-brand`,
`bg-rx`/`text-rx` as semantic danger, `text-warning`, plus raw hex like `#0F766E`,
`#94A3B8`). Left alone, these render broken (transparent buttons, invisible brand marks).
Since this is a full redesign these need to move to the new system too — **re-skin only,
no layout or logic changes**:

- `components/ui/Button.tsx`, `Card.tsx`, `Badge.tsx`, `Input.tsx` — migrate from static
  Tailwind color classes to `useTheme()` + inline `style`, same variant/tone APIs
  (`variant`, `tone`, `status`) preserved so call sites don't change.
- `app/(auth)/login.tsx`, `app/(auth)/register.tsx`, `app/prescription/upload.tsx`,
  `app/prescription/index.tsx` (post-move) — swap hardcoded `bg-slate-50`/`bg-white`/
  `bg-brand`/`text-brand`/hex icon colors for `useTheme()` tokens. Copy, fields, validation,
  navigation all stay identical.

## H — Cart store

- `hooks/useCartStore.ts`: add `prescriptionId?: string` to `CartLine`; add
  `removeItem(productId: string)` and `setQuantity(productId: string, quantity: number)`.
- `app/(tabs)/cart.tsx`: replace its local `const [attached] = useState({})` placeholder
  with the store field — closes the TODO the handoff README flagged. This is cart-state
  wiring, not a backend change (still no real prescription-matching endpoint).

## I — Explicitly out of scope

- Real Supabase queries/endpoints (mocks stay, per user decision).
- `react-native-maps` integration (placeholder stays, per user decision).
- `resources/stitch_screens_app/*` — unrelated earlier exploration, not used.

## J — Docs

- Update `CLAUDE.md`'s "Sistema de Diseño (Tokens)" section to document the lima/dark-mode
  palette (`accent #C7F04A`, `ink`/`paper` surface scale, `rx`/`warning`/`info`) in place
  of the teal section, once the above is implemented and verified.

## Testing / verification

- `npm run typecheck` (tsc --noEmit) after each major step (README's application order:
  tokens → primitives → ProductRow → nav → screens → cleanup).
- Manual check via Expo (web or simulator) of: light/dark toggle (OS-level, since theme
  follows `useColorScheme()`), all 5 tabs, cart add/remove/attach-receipt flow, login/
  register render correctly (not transparent), prescription upload screen.
- No automated test suite exists in this repo currently — manual verification is the bar.
