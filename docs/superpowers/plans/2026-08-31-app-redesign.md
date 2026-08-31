# App Redesign (lima/dark-mode commerce pivot) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Replace the teal/light-only design system with the lima-accent, light/dark-aware
system from `resources/App redesign/handoff/`, and reframe the app from
prescription-first to storefront-first commerce (5 tabs: Tienda · Buscar · Carrito ·
Pedidos · Perfil).

**Architecture:** Swap the global token layer (`types/theme.ts`, `tailwind.config.js`) and
add a `useTheme()` hook that reads `useColorScheme()`. Screens/components consume colors
via `useTheme()` + inline `style`, never Tailwind `dark:` classes — Tailwind stays
responsible for spacing/type-scale/radius only. Drop the handoff's package files in
mostly as-is (they already follow this repo's conventions), then re-skin the handful of
existing files the handoff doesn't touch but that break once the old color classes
disappear.

**Tech Stack:** React Native + Expo Router v3, NativeWind (Tailwind v3), Zustand,
TanStack Query, Supabase, TypeScript strict.

**Spec:** `docs/superpowers/specs/2026-08-31-app-redesign-design.md`

## Global Constraints

- TypeScript strict mode (`tsconfig.json`: `strict: true`, `noImplicitAny: true`). Every
  task's code must compile under this.
- No automated test suite exists in this repo. Each task's "test" step is
  `npm run typecheck` (`tsc --noEmit`) plus a manual Expo smoke check — not a Jest/RTL
  file. This matches the spec's Testing/verification section.
- Expo Router has **no typed routes enabled** (`app.json` has no
  `experiments.typedRoutes`, confirmed) — `router.push('/some/path')` string literals are
  never type-checked against real files, so task ordering is not constrained by route
  string existence.
- Colors/spacing/radius come from `useTheme()` (`hooks/useTheme.ts`) + inline `style`.
  Tailwind classes are for spacing, typography, and `rounded-card`/`rounded-button`/
  `rounded-full`/`min-h-touch`/`h-touch`/`w-touch` only — never a raw hex or an old
  `bg-brand`/`text-rx`/etc. class in any file this plan touches.
- **Deviation from the handoff package (locked in during brainstorming):** import
  `BottomTabBarProps` from `expo-router/tabs`, not `@react-navigation/bottom-tabs` —
  confirmed via `require.resolve` that the latter isn't hoisted to top-level
  `node_modules` in this repo and would fail to resolve at build time. Applied in Task 8.
- Because several existing files (outside the handoff's file list) hardcode now-deleted
  color classes/hex values, mid-plan `npm run typecheck` runs will show a shrinking, known
  set of pre-existing errors until the task that fixes each file is reached. Each task
  below states exactly which errors are expected to remain.
- Money is always `priceCents`/`totalCents` (integer cents) formatted with
  `formatPrice()` from `utils/format.ts` — never format cents directly.
- Two gaps discovered while planning that the spec doesn't spell out, both resolved here
  rather than re-opening the design review (small, mechanical, inside the spec's stated
  intent):
  - `hooks/useAuth.ts` doesn't export `signOut`, but the handoff's `profile.tsx` calls
    `const { signOut } = useAuth()`. Task 7 adds it, wrapping the `mockAuth.signOut()` /
    `supabase.auth.signOut()` split the file already uses elsewhere.
  - The spec's decision to move the prescriptions listing to a secondary screen
    (`app/prescription/index.tsx`) leaves it with no UI entry point — the handoff's
    `profile.tsx` has no link to it. Task 15 adds one "Mis recetas" row to Profile's
    settings list, matching that screen's existing `Row` pattern.
  - `components/prescription/PrescriptionUploader.tsx` also hardcodes old-palette classes
    (`bg-brand-secondary`, `bg-brand`, `border-brand/30`, `#0F766E`) and isn't in the
    handoff's file list either — it renders broken (invisible backgrounds) once Task 1
    lands. Task 18 re-skins it alongside `upload.tsx`.

---

### Task 1: Design tokens & theme hook

**Files:**
- Modify: `types/theme.ts` (full replace)
- Create: `hooks/useTheme.ts`
- Modify: `tailwind.config.js` (full replace)

**Interfaces:**
- Produces: `ColorTokens` interface (`bg`, `surface`, `elevated`, `border`, `textPrimary`,
  `textSecondary`, `textDim`, `accent`, `accentInk`, `accentText`, `accentSoft`, `info`,
  `danger`, `dangerBg`, `warning` — all `string`), `darkColors`/`lightColors`/`colors`
  (`ColorTokens`) from `types/theme.ts`; `useTheme(): { colors: ColorTokens; isDark:
  boolean }` from `hooks/useTheme.ts`. Every later task consumes these exact names.

- [x] **Step 1: Replace `types/theme.ts`**

```ts
// types/theme.ts — replaces the teal token set
export interface ColorTokens {
  bg: string;
  surface: string;
  elevated: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textDim: string;
  accent: string;
  accentInk: string;
  accentText: string;
  accentSoft: string;
  info: string;
  danger: string;
  dangerBg: string;
  warning: string;
}

export const darkColors: ColorTokens = {
  bg: '#0D0F12',
  surface: '#15181D',
  elevated: '#1D2128',
  border: '#22262D',
  textPrimary: '#F4F5F6',
  textSecondary: '#8B929E',
  textDim: '#6D7480',
  accent: '#C7F04A',
  accentInk: '#111409',
  accentText: '#C7F04A',
  accentSoft: 'rgba(199,240,74,0.10)',
  info: '#55D3E0',
  danger: '#FF8B78',
  dangerBg: 'rgba(255,107,90,0.10)',
  warning: '#FFC46B',
};

export const lightColors: ColorTokens = {
  bg: '#F3F5F1',
  surface: '#FFFFFF',
  elevated: '#E9EDE3',
  border: '#E0E4DC',
  textPrimary: '#14170F',
  textSecondary: '#656C5F',
  textDim: '#98A092',
  accent: '#C7F04A',
  accentInk: '#1B2109',
  // lime text fails contrast on white — use olive for text/icons only
  accentText: '#4E6B0A',
  accentSoft: 'rgba(199,240,74,0.30)',
  info: '#0E7C8C',
  danger: '#B8412A',
  dangerBg: 'rgba(184,65,42,0.08)',
  warning: '#9A6A08',
};

/** Default export kept as `colors` so existing imports keep compiling. */
export const colors: ColorTokens = darkColors;

export const radius = {
  card: 18,
  button: 14,
  pill: 999,
} as const;

export const touchTarget = 44;
```

- [x] **Step 2: Create `hooks/useTheme.ts`**

```ts
// hooks/useTheme.ts
import { useColorScheme } from 'react-native';
import { darkColors, lightColors, type ColorTokens } from '../types/theme';

export function useTheme(): { colors: ColorTokens; isDark: boolean } {
  const scheme = useColorScheme();
  const isDark = scheme !== 'light';
  return { colors: isDark ? darkColors : lightColors, isDark };
}
```

- [x] **Step 3: Replace `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#C7F04A',
          ink: '#111409',
          text: '#4E6B0A',
        },
        ink: {
          DEFAULT: '#0D0F12',
          surface: '#15181D',
          elevated: '#1D2128',
          line: '#22262D',
        },
        paper: {
          DEFAULT: '#F3F5F1',
          surface: '#FFFFFF',
          elevated: '#E9EDE3',
          line: '#E0E4DC',
        },
        info: { DEFAULT: '#55D3E0' },
        rx: { DEFAULT: '#FF8B78' },
        warning: { DEFAULT: '#FFC46B' },
      },
      fontFamily: {
        sans: ['SpaceGrotesk-Regular'],
        medium: ['SpaceGrotesk-Medium'],
        bold: ['SpaceGrotesk-Bold'],
        mono: ['JetBrainsMono-Regular'],
      },
      spacing: { touch: '44px' },
      borderRadius: { card: '18px', button: '14px' },
    },
  },
  plugins: [],
};
```

- [x] **Step 4: Run typecheck**

Run: `npm run typecheck`
Expected: FAIL, with errors only in these files (all fixed by later tasks — do not touch
them now): `app/(tabs)/index.tsx`, `app/(tabs)/catalog.tsx`, `app/(tabs)/prescriptions.tsx`,
`components/product/ProductCard.tsx` — all reference removed `ColorTokens` properties
(`brandPrimary`, `textSecondary` as old shape, `rx`, `warning`, `placeholder`). No other
files should error.

- [x] **Step 5: Commit**

```bash
git add types/theme.ts hooks/useTheme.ts tailwind.config.js
git commit -m "Replace teal token set with lima/dark-mode theme + useTheme hook"
```

---

### Task 2: Fonts

**Files:**
- Modify: `package.json` (via `npm install`)
- Modify: `app/_layout.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: fonts registered under the exact family names `tailwind.config.js` (Task 1)
  expects: `SpaceGrotesk-Regular`, `SpaceGrotesk-Medium`, `SpaceGrotesk-Bold`,
  `JetBrainsMono-Regular`.

- [x] **Step 1: Install font packages**

```bash
npm install @expo-google-fonts/space-grotesk @expo-google-fonts/jetbrains-mono
```

- [x] **Step 2: Update `app/_layout.tsx`**

```tsx
import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
    'SpaceGrotesk-Regular': SpaceGrotesk_400Regular,
    'SpaceGrotesk-Medium': SpaceGrotesk_500Medium,
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
    'JetBrainsMono-Regular': JetBrainsMono_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="prescription/upload" options={{ presentation: 'modal' }} />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
```

- [x] **Step 3: Run typecheck**

Run: `npm run typecheck`
Expected: same residual failures as Task 1 Step 4 — no new ones.

- [x] **Step 4: Manual smoke check**

Run: `npm run web`
Expected: app boots past the splash screen (no red-screen "font not found" error). Exact
pixel-perfect font rendering is verified later in Task 20 once real screens exist.

- [x] **Step 5: Commit**

```bash
git add package.json package-lock.json app/_layout.tsx
git commit -m "Load Space Grotesk and JetBrains Mono fonts"
```

---

### Task 3: Delete superseded files

**Files:**
- Delete: `app/(tabs)/catalog.tsx`
- Delete: `components/product/ProductCard.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing (removes two of Task 1's residual typecheck errors).

- [x] **Step 1: Confirm no other consumers**

Run: `grep -rn "ProductCard" --include=*.tsx app components`
Expected: only `app/(tabs)/catalog.tsx` and `components/product/ProductCard.tsx` itself
match (both are being deleted). If anything else matches, stop and re-check scope before
deleting.

- [x] **Step 2: Delete the files**

```bash
git rm "app/(tabs)/catalog.tsx" "components/product/ProductCard.tsx"
```

- [x] **Step 3: Run typecheck**

Run: `npm run typecheck`
Expected: FAIL, with errors only in `app/(tabs)/index.tsx` and `app/(tabs)/prescriptions.tsx`
(both fixed by later tasks).

- [x] **Step 4: Commit**

```bash
git commit -m "Delete catalog.tsx and ProductCard.tsx (superseded by search.tsx + ProductRow)"
```

---

### Task 4: New primitives

**Files:**
- Create: `components/ui/Skeleton.tsx`
- Create: `components/ui/EmptyState.tsx`
- Create: `components/ui/LoadingSteps.tsx`
- Create: `components/product/ProductRow.tsx`

**Interfaces:**
- Consumes: `useTheme()` (Task 1), `useCartStore` (existing shape — `lines`, `addItem`;
  the Task 8 extension is additive and doesn't change these calls).
- Produces: `Skeleton`, `SkeletonProductRow`, `SkeletonProductCard` from
  `components/ui/Skeleton.tsx`; `EmptyState` (props: `icon: LucideIcon`, `title: string`,
  `body: string`, `primary?: { label, onPress, icon? }`, `secondary?: { label, onPress,
  icon? }`, `children?: ReactNode`) from `components/ui/EmptyState.tsx`; `LoadingSteps`
  (`steps: LoadingStep[]`) and `LoadingStep` (`{ label: string; state: 'done'|'active'|
  'pending'; meta?: string }`) from `components/ui/LoadingSteps.tsx`; `ProductRow` (props:
  `product: Product`, `onPress?: () => void`) from `components/product/ProductRow.tsx`.
  All later screen tasks import these.

- [x] **Step 1: Copy the four files from the handoff, unchanged**

```bash
cp "resources/App redesign/handoff/components/ui/Skeleton.tsx" components/ui/Skeleton.tsx
cp "resources/App redesign/handoff/components/ui/EmptyState.tsx" components/ui/EmptyState.tsx
cp "resources/App redesign/handoff/components/ui/LoadingSteps.tsx" components/ui/LoadingSteps.tsx
cp "resources/App redesign/handoff/components/product/ProductRow.tsx" components/product/ProductRow.tsx
```

(Source content for reference — identical to what lands at each destination path: see
`resources/App redesign/handoff/components/ui/Skeleton.tsx`,
`resources/App redesign/handoff/components/ui/EmptyState.tsx`,
`resources/App redesign/handoff/components/ui/LoadingSteps.tsx`,
`resources/App redesign/handoff/components/product/ProductRow.tsx`.)

- [x] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: same two residual failures as Task 3 Step 3 (`app/(tabs)/index.tsx`,
`app/(tabs)/prescriptions.tsx`) — no new ones. These four new files must compile clean.

- [x] **Step 3: Commit**

```bash
git add components/ui/Skeleton.tsx components/ui/EmptyState.tsx components/ui/LoadingSteps.tsx components/product/ProductRow.tsx
git commit -m "Add Skeleton, EmptyState, LoadingSteps, ProductRow primitives"
```

---

### Task 5: Re-skin shared UI primitives (Button, Card, Badge, Input)

**Files:**
- Modify: `components/ui/Button.tsx`
- Modify: `components/ui/Card.tsx`
- Modify: `components/ui/Badge.tsx`
- Modify: `components/ui/Input.tsx`

**Interfaces:**
- Consumes: `useTheme()` (Task 1).
- Produces: same public APIs as before — `Button` (`label`, `variant?: 'primary' |
  'secondary' | 'outline' | 'danger'`, `loading?`, `disabled?`, `icon?`, plus
  `PressableProps`), `Card` (`ViewProps & { className?: string }`), `Badge` (`label?`,
  `tone?: 'rx'|'success'|'warning'|'neutral'`, `status?: 'rx_required'|
  'pending_verification'|'in_stock'`), `Input` (`label?`, `error?`, `icon?`,
  `rightElement?`, plus `TextInputProps`, forwardRef to `TextInput`). No call site
  anywhere in the repo needs to change.

Semantic tone→token mapping used below (no `success`/`warningBg` token exists in the new
palette, so these are deliberate choices, not omissions): `rx` → `colors.dangerBg` /
`colors.danger`; `success` → `colors.accentSoft` / `colors.accentText` (matches
`ProductRow`'s "in stock" treatment); `warning` → `colors.elevated` / `colors.warning`;
`neutral` → `colors.elevated` / `colors.textPrimary`.

- [x] **Step 1: Replace `components/ui/Button.tsx`**

```tsx
import { ActivityIndicator, Pressable, Text, PressableProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import type { ColorTokens } from '../../types/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
}

function variantStyle(variant: ButtonVariant, colors: ColorTokens) {
  switch (variant) {
    case 'primary':
      return { bg: colors.accent, text: colors.accentInk, border: colors.accent };
    case 'secondary':
      return { bg: colors.accentSoft, text: colors.accentText, border: colors.accentSoft };
    case 'outline':
      return { bg: 'transparent', text: colors.textPrimary, border: colors.border };
    case 'danger':
      return { bg: colors.danger, text: colors.surface, border: colors.danger };
  }
}

export function Button({ label, variant = 'primary', loading = false, disabled = false, icon: Icon, ...props }: ButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;
  const { bg, text, border } = variantStyle(variant, colors);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      className="min-h-[52px] flex-row items-center justify-center gap-2 rounded-button px-4"
      style={({ pressed }) => ({
        backgroundColor: bg,
        borderWidth: variant === 'outline' ? 1 : 0,
        borderColor: border,
        opacity: isDisabled ? 0.5 : pressed ? 0.7 : 1,
      })}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={text} />
      ) : (
        <>
          {Icon ? <Icon color={text} size={20} /> : null}
          <Text style={{ color: text }} className="font-medium text-base">{label}</Text>
        </>
      )}
    </Pressable>
  );
}
```

- [x] **Step 2: Replace `components/ui/Card.tsx`**

```tsx
import { View, ViewProps } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export function Card({ className = '', style, children, ...props }: ViewProps & { className?: string }) {
  const { colors } = useTheme();
  return (
    <View
      className={`rounded-card border p-4 ${className}`}
      style={[{ backgroundColor: colors.surface, borderColor: colors.border }, style]}
      {...props}
    >
      {children}
    </View>
  );
}
```

- [x] **Step 3: Replace `components/ui/Badge.tsx`**

```tsx
import { Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import type { ColorTokens } from '../../types/theme';

export type BadgeTone = 'rx' | 'success' | 'warning' | 'neutral';
export type MedicationStatus = 'rx_required' | 'pending_verification' | 'in_stock';

interface BadgeProps {
  label?: string;
  tone?: BadgeTone;
  status?: MedicationStatus;
}

function toneStyle(tone: BadgeTone, colors: ColorTokens) {
  switch (tone) {
    case 'rx':
      return { bg: colors.dangerBg, text: colors.danger };
    case 'success':
      return { bg: colors.accentSoft, text: colors.accentText };
    case 'warning':
      return { bg: colors.elevated, text: colors.warning };
    case 'neutral':
      return { bg: colors.elevated, text: colors.textPrimary };
  }
}

const statusConfig: Record<MedicationStatus, { label: string; tone: BadgeTone }> = {
  rx_required: { label: 'Requiere receta', tone: 'rx' },
  pending_verification: { label: 'En verificación', tone: 'warning' },
  in_stock: { label: 'En stock', tone: 'success' },
};

export function Badge({ label, tone, status }: BadgeProps) {
  const { colors } = useTheme();
  const resolvedTone = tone ?? (status ? statusConfig[status].tone : 'neutral');
  const resolvedLabel = label ?? (status ? statusConfig[status].label : '');
  const { bg, text } = toneStyle(resolvedTone, colors);

  return (
    <View
      accessibilityRole="text"
      style={{ backgroundColor: bg }}
      className="rounded-full px-3 py-1 self-start"
    >
      <Text style={{ color: text }} className="text-xs font-medium">{resolvedLabel}</Text>
    </View>
  );
}
```

- [x] **Step 4: Replace `components/ui/Input.tsx`**

```tsx
import { forwardRef, ReactNode, useState } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, icon, rightElement, className = '', onFocus, onBlur, ...props },
  ref,
) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error ? colors.danger : isFocused ? colors.accent : colors.border;

  return (
    <View className="mb-3">
      {label ? <Text style={{ color: colors.textPrimary }} className="mb-1 text-sm font-medium">{label}</Text> : null}

      <View className="relative justify-center">
        {icon ? <View className="absolute left-4 z-10">{icon}</View> : null}

        <TextInput
          ref={ref}
          accessibilityLabel={label ?? props.placeholder}
          accessibilityState={{ disabled: Boolean(props.editable === false) }}
          placeholderTextColor={colors.textDim}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          style={{ backgroundColor: colors.surface, borderColor, color: colors.textPrimary }}
          className={`min-h-touch rounded-xl border-2 text-base ${icon ? 'pl-11' : 'pl-4'} ${
            rightElement ? 'pr-11' : 'pr-4'
          } ${className}`}
          {...props}
        />

        {rightElement ? <View className="absolute right-4 z-10">{rightElement}</View> : null}
      </View>

      {error ? <Text style={{ color: colors.danger }} className="mt-1 text-xs">{error}</Text> : null}
    </View>
  );
});
```

- [x] **Step 5: Run typecheck**

Run: `npm run typecheck`
Expected: same residual failures as Task 4 Step 2 — no new ones. These four files must
compile clean.

- [x] **Step 6: Commit**

```bash
git add components/ui/Button.tsx components/ui/Card.tsx components/ui/Badge.tsx components/ui/Input.tsx
git commit -m "Re-skin Button, Card, Badge, Input to the lima/dark-mode tokens"
```

---

### Task 6: Cart store extension

**Files:**
- Modify: `hooks/useCartStore.ts`

**Interfaces:**
- Consumes: `Product` from `types/product.ts` (unchanged).
- Produces: `CartLine` now includes `prescriptionId?: string`; `useCartStore` gains
  `removeItem(productId: string): void`, `setQuantity(productId: string, quantity:
  number): void`, `attachPrescription(productId: string, prescriptionId: string): void`.
  Existing `lines`, `addItem(product: Product): void`, `itemCount(): number` are
  unchanged. Task 13 (cart screen) reads `line.prescriptionId` directly instead of the
  handoff's local `useState` placeholder.

- [x] **Step 1: Replace `hooks/useCartStore.ts`**

```ts
import { create } from 'zustand';
import type { Product } from '../types/product';

interface CartLine {
  product: Product;
  quantity: number;
  prescriptionId?: string;
}

interface CartState {
  lines: CartLine[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  attachPrescription: (productId: string, prescriptionId: string) => void;
  itemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  lines: [],
  addItem: (product) =>
    set((state) => {
      const existing = state.lines.find((line) => line.product.id === product.id);
      if (existing) {
        return {
          lines: state.lines.map((line) =>
            line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line,
          ),
        };
      }
      return { lines: [...state.lines, { product, quantity: 1 }] };
    }),
  removeItem: (productId) =>
    set((state) => ({ lines: state.lines.filter((line) => line.product.id !== productId) })),
  setQuantity: (productId, quantity) =>
    set((state) => ({
      lines: quantity <= 0
        ? state.lines.filter((line) => line.product.id !== productId)
        : state.lines.map((line) => (line.product.id === productId ? { ...line, quantity } : line)),
    })),
  attachPrescription: (productId, prescriptionId) =>
    set((state) => ({
      lines: state.lines.map((line) =>
        line.product.id === productId ? { ...line, prescriptionId } : line,
      ),
    })),
  itemCount: () => get().lines.reduce((total, line) => total + line.quantity, 0),
}));
```

- [x] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: same residual failures as Task 5 Step 5 — no new ones.

- [x] **Step 3: Commit**

```bash
git add hooks/useCartStore.ts
git commit -m "Add prescriptionId, removeItem, setQuantity, attachPrescription to cart store"
```

---

### Task 7: Auth hook signOut extension

**Files:**
- Modify: `hooks/useAuth.ts`

**Interfaces:**
- Consumes: `isSupabaseConfigured`, `supabase` (`services/supabase.ts`), `mockAuth`
  (`services/mockAuth.ts` — already has `signOut(): Promise<void>`), `AuthUser`
  (`types/auth.ts`), all unchanged.
- Produces: `useAuth()` now returns `{ user, loading, signOut }` where `signOut: () =>
  Promise<void>`. `user`/`loading` behavior is unchanged. Task 15 (profile screen) calls
  `signOut()`.

- [x] **Step 1: Replace `hooks/useAuth.ts`**

```ts
import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../services/supabase';
import { mockAuth } from '../services/mockAuth';
import type { AuthUser } from '../types/auth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(isSupabaseConfigured ? null : mockAuth.getUser());
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return mockAuth.subscribe(setUser);
    }

    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user;
      setUser(sessionUser ? { id: sessionUser.id, email: sessionUser.email ?? '', user_metadata: sessionUser.user_metadata } : null);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      const sessionUser = newSession?.user;
      setUser(sessionUser ? { id: sessionUser.id, email: sessionUser.email ?? '', user_metadata: sessionUser.user_metadata } : null);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  async function signOut() {
    if (!isSupabaseConfigured) {
      await mockAuth.signOut();
      return;
    }
    await supabase.auth.signOut();
  }

  return { user, loading, signOut };
}
```

- [x] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: same residual failures as Task 6 Step 2 — no new ones.

- [x] **Step 3: Commit**

```bash
git add hooks/useAuth.ts
git commit -m "Add signOut to useAuth"
```

---

### Task 8: Navigation

**Files:**
- Modify: `components/navigation/FloatingTabBar.tsx` (full replace, with the
  `expo-router/tabs` deviation applied)
- Modify: `app/(tabs)/_layout.tsx` (full replace)
- Delete: `types/navigation.ts`

**Interfaces:**
- Consumes: `useTheme()` (Task 1), `useCartStore` (Task 6 — reads `s.lines` for the cart
  badge count).
- Produces: `FloatingTabBar` now takes React Navigation's `BottomTabBarProps` directly
  (imported from `expo-router/tabs`) instead of the old custom `TabItem`/
  `FloatingTabBarProps` shape — no other file imports those types after this task (they're
  deleted).

- [x] **Step 1: Replace `components/navigation/FloatingTabBar.tsx`**

```tsx
// components/navigation/FloatingTabBar.tsx — 5 commerce tabs, cart badge
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { Store, Search, ShoppingBag, ReceiptText, User, type LucideIcon } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { useCartStore } from '../../hooks/useCartStore';
import { useFloatingTabBarOffset, FLOATING_TAB_BAR_HEIGHT } from '../../hooks/useTabBarInset';

const ICONS: Record<string, LucideIcon> = {
  index: Store, search: Search, cart: ShoppingBag, orders: ReceiptText, profile: User,
};
const LABELS: Record<string, string> = {
  index: 'Tienda', search: 'Buscar', cart: 'Carrito', orders: 'Pedidos', profile: 'Yo',
};

export const FloatingTabBar = memo(function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const bottom = useFloatingTabBarOffset();
  const count = useCartStore((s) => s.lines.reduce((n, l) => n + l.quantity, 0));

  return (
    <View
      style={{
        position: 'absolute', left: 16, right: 16, bottom,
        height: FLOATING_TAB_BAR_HEIGHT, borderRadius: FLOATING_TAB_BAR_HEIGHT / 2,
        paddingHorizontal: 6, backgroundColor: colors.surface,
        borderWidth: 1, borderColor: colors.border,
        flexDirection: 'row', alignItems: 'center',
      }}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const Icon = ICONS[route.name] ?? Store;
        const tint = focused ? colors.accentText : colors.textSecondary;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={LABELS[route.name] ?? route.name}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
            }}
            className="min-h-touch flex-1 items-center justify-center gap-[3px]"
          >
            <View>
              <Icon color={tint} size={21} fill={focused ? tint : 'transparent'} />
              {route.name === 'cart' && count > 0 ? (
                <View
                  style={{ backgroundColor: colors.accent, position: 'absolute', top: -5, right: -9 }}
                  className="h-4 min-w-[16px] items-center justify-center rounded-full px-1"
                >
                  <Text style={{ color: colors.accentInk }} className="font-bold text-[9.5px]">{count}</Text>
                </View>
              ) : null}
            </View>
            <Text style={{ color: tint }} className="font-medium text-[9.5px]">{LABELS[route.name]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
});
```

- [x] **Step 2: Replace `app/(tabs)/_layout.tsx`**

```tsx
// app/(tabs)/_layout.tsx — prescriptions tab retired; cart + orders promoted
import { Tabs } from 'expo-router';
import { FloatingTabBar } from '../../components/navigation/FloatingTabBar';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <FloatingTabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'Tienda' }} />
      <Tabs.Screen name="search" options={{ title: 'Buscar' }} />
      <Tabs.Screen name="cart" options={{ title: 'Carrito' }} />
      <Tabs.Screen name="orders" options={{ title: 'Pedidos' }} />
      <Tabs.Screen name="profile" options={{ title: 'Yo' }} />
    </Tabs>
  );
}
```

- [x] **Step 3: Delete `types/navigation.ts`**

Run: `grep -rn "types/navigation\|TabItem\|FloatingTabBarProps" --include=*.tsx --include=*.ts app components`
Expected: no matches once step 1/2 have landed (the only two consumers were the files just
replaced). Then:

```bash
git rm types/navigation.ts
```

- [x] **Step 4: Run typecheck**

Run: `npm run typecheck`
Expected: FAIL, with errors only in `app/(tabs)/index.tsx` and `app/(tabs)/prescriptions.tsx`
(Tasks 12 and 14 fix these) — the navigation files themselves must compile clean. Note:
`app/(tabs)/search.tsx`, `cart.tsx`, `orders.tsx` don't exist yet so `Tabs.Screen` entries
referencing them are inert until Tasks 13/14/15 add the files (Expo Router doesn't
type-check screen names against files without typed routes, so this isn't an error).

- [x] **Step 5: Commit**

```bash
git add components/navigation/FloatingTabBar.tsx "app/(tabs)/_layout.tsx"
git commit -m "Replace tab bar and layout with 5-tab commerce navigation

Deviation from handoff: import BottomTabBarProps from expo-router/tabs,
not @react-navigation/bottom-tabs (unresolved at top level in this repo)."
```

---

### Task 9: Storefront screen (`app/(tabs)/index.tsx`)

**Files:**
- Modify: `app/(tabs)/index.tsx` (full replace)

**Interfaces:**
- Consumes: `useTheme()` (Task 1), `useTabBarContentInset()` (existing,
  `hooks/useTabBarInset.ts` — unchanged), `SkeletonProductCard`/`Skeleton` (Task 4),
  `MOCK_PRODUCTS`/`CATEGORIES` (existing, `utils/mockProducts.ts` — unchanged),
  `formatPrice` (existing, `utils/format.ts` — unchanged), `Product` (existing,
  `types/product.ts` — unchanged).

- [x] **Step 1: Replace `app/(tabs)/index.tsx`**

```bash
cp "resources/App redesign/handoff/app/-tabs-/index.tsx" "app/(tabs)/index.tsx"
```

(Source: `resources/App redesign/handoff/app/-tabs-/index.tsx` — copied unchanged. Shows
a 4-item mock storefront with a 800ms `setTimeout` skeleton, promo banner, category grid,
reorder row, and "más vendidos" grid.)

- [x] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: FAIL, with errors only in `app/(tabs)/prescriptions.tsx` (Task 13 fixes it).
`app/(tabs)/index.tsx` must compile clean.

- [x] **Step 3: Manual smoke check**

Run: `npm run web`, open the Tienda tab.
Expected: skeleton grid renders for ~800ms, then 4 product cards with images, promo
banner in lima, category chips.

- [x] **Step 4: Commit**

```bash
git add "app/(tabs)/index.tsx"
git commit -m "Replace storefront screen with lima/dark-mode design"
```

---

### Task 10: Search screen (`app/(tabs)/search.tsx`)

**Files:**
- Create: `app/(tabs)/search.tsx`

**Interfaces:**
- Consumes: `useTheme()` (Task 1), `useTabBarContentInset()` (existing), `ProductRow`
  (Task 4), `SkeletonProductRow` (Task 4), `EmptyState` (Task 4), `MOCK_PRODUCTS`
  (existing).

- [x] **Step 1: Add `app/(tabs)/search.tsx`**

```bash
cp "resources/App redesign/handoff/app/-tabs-/search.tsx" "app/(tabs)/search.tsx"
```

(Source: `resources/App redesign/handoff/app/-tabs-/search.tsx` — copied unchanged. Reads
an optional `category` param, shows a 600ms skeleton while "searching", and a no-results
`EmptyState` with a spell-check suggestion, synonym chips, and a "pregúntale a un
farmacéutico" row.)

- [x] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: same residual failure as Task 9 Step 2 (`app/(tabs)/prescriptions.tsx`) — no new
ones.

- [x] **Step 3: Manual smoke check**

Run: `npm run web`, open the Buscar tab, type "amoxicilina", then type "zzz".
Expected: 600ms skeleton rows while typing settles, then a `ProductRow` result; "zzz"
shows the no-results empty state with suggestion chips.

- [x] **Step 4: Commit**

```bash
git add "app/(tabs)/search.tsx"
git commit -m "Add search screen with skeleton and no-results states"
```

---

### Task 11: Cart screen (`app/(tabs)/cart.tsx`)

**Files:**
- Create: `app/(tabs)/cart.tsx`

**Interfaces:**
- Consumes: `useTheme()` (Task 1), `useCartStore` (Task 6 — reads `s.lines`, each line's
  `prescriptionId` directly instead of a local placeholder), `useTabBarContentInset()`
  (existing), `EmptyState` (Task 4), `formatPrice` (existing).

- [x] **Step 1: Add `app/(tabs)/cart.tsx`**

Same as the handoff's `app/-tabs-/cart.tsx`, with the local `attached` placeholder state
removed in favor of the store's `prescriptionId` field (closes the TODO the handoff
README flagged):

```tsx
// app/(tabs)/cart.tsx — cart with prescription gating + empty state
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ShoppingBag, Store, Camera, Lock } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { useCartStore } from '../../hooks/useCartStore';
import { useTabBarContentInset } from '../../hooks/useTabBarInset';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatPrice } from '../../utils/format';

const SHIPPING_CENTS = 499;

export default function CartScreen() {
  const { colors } = useTheme();
  const inset = useTabBarContentInset();
  const lines = useCartStore((s) => s.lines);

  if (lines.length === 0) {
    return (
      <View style={{ backgroundColor: colors.bg }} className="flex-1 px-5">
        <Text style={{ color: colors.textPrimary }} className="pb-2 pt-4 font-bold text-xl">Carrito</Text>
        <ScrollView contentContainerStyle={{ paddingBottom: inset }} showsVerticalScrollIndicator={false}>
          <EmptyState
            icon={ShoppingBag}
            title="Tu carrito está vacío"
            body="Empieza por lo que ya compraste antes, o busca por síntoma y te decimos qué sirve."
            primary={{ label: 'Ir a la tienda', icon: Store, onPress: () => router.push('/(tabs)') }}
            secondary={{ label: 'Comprar con mi receta', icon: Camera, onPress: () => router.push('/prescription/upload') }}
          />
        </ScrollView>
      </View>
    );
  }

  const subtotal = lines.reduce((sum, l) => sum + l.product.priceCents * l.quantity, 0);
  const blocked = lines.filter((l) => l.product.requiresRx && !l.prescriptionId);

  return (
    <View style={{ backgroundColor: colors.bg }} className="flex-1">
      <Text style={{ color: colors.textPrimary }} className="px-5 pb-2 pt-4 font-bold text-xl">Carrito</Text>

      <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: inset + 96 }} showsVerticalScrollIndicator={false}>
        {lines.map(({ product, quantity, prescriptionId }) => {
          const needsRx = product.requiresRx && !prescriptionId;
          return (
            <View
              key={product.id}
              style={{ backgroundColor: colors.surface, borderColor: needsRx ? colors.danger : colors.border }}
              className="mb-3 rounded-card border p-3"
            >
              <View className="flex-row items-center gap-3">
                <Image
                  source={{ uri: product.imageUrl }}
                  style={{ width: 54, height: 54, borderRadius: 12, backgroundColor: colors.elevated }}
                />
                <View className="flex-1">
                  <Text style={{ color: colors.textPrimary }} className="font-medium text-sm">{product.name}</Text>
                  <Text style={{ color: colors.textSecondary }} className="mt-1 font-mono text-[10.5px]">
                    {product.dosage} · {quantity} ud.
                  </Text>
                </View>
                <Text style={{ color: colors.textPrimary }} className="font-mono text-sm">
                  {formatPrice(product.priceCents * quantity)}
                </Text>
              </View>

              {needsRx ? (
                <View style={{ backgroundColor: colors.dangerBg }} className="mt-3 flex-row items-center gap-2.5 rounded-xl p-3">
                  <Lock color={colors.danger} size={19} />
                  <View className="flex-1">
                    <Text style={{ color: colors.danger }} className="font-medium text-xs">
                      Necesita receta para despachar
                    </Text>
                    <Text style={{ color: colors.textSecondary }} className="mt-0.5 text-[11px]">
                      Sube una foto o usa una receta aprobada
                    </Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Adjuntar receta para ${product.name}`}
                    onPress={() => router.push('/prescription/upload')}
                    style={{ backgroundColor: colors.danger }}
                    className="min-h-[36px] justify-center rounded-[10px] px-3"
                  >
                    <Text style={{ color: colors.surface }} className="font-bold text-[11.5px]">Adjuntar</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          );
        })}

        <View style={{ backgroundColor: colors.elevated }} className="mt-2 gap-2.5 rounded-card p-4">
          <View className="flex-row justify-between">
            <Text style={{ color: colors.textSecondary }} className="text-[12.5px]">Subtotal</Text>
            <Text style={{ color: colors.textSecondary }} className="font-mono text-[12.5px]">{formatPrice(subtotal)}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text style={{ color: colors.textSecondary }} className="text-[12.5px]">Envío express</Text>
            <Text style={{ color: colors.textSecondary }} className="font-mono text-[12.5px]">{formatPrice(SHIPPING_CENTS)}</Text>
          </View>
          <View style={{ backgroundColor: colors.border }} className="mt-1 h-px" />
          <View className="flex-row items-baseline justify-between">
            <Text style={{ color: colors.textPrimary }} className="font-bold text-sm">Total</Text>
            <Text style={{ color: colors.textPrimary }} className="font-mono text-lg">
              {formatPrice(subtotal + SHIPPING_CENTS)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={{ backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: inset - 60 }}
        className="absolute inset-x-0 bottom-0 border-t px-4 pt-3"
      >
        {blocked.length > 0 ? (
          <Text style={{ color: colors.textSecondary }} className="mb-2.5 text-[11.5px]">
            {blocked.length} artículo{blocked.length > 1 ? 's esperan' : ' espera'} receta · el resto sale igual
          </Text>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ir a pagar"
          onPress={() => router.push('/order/checkout')}
          style={{ backgroundColor: colors.accent }}
          className="min-h-[54px] items-center justify-center rounded-button"
        >
          <Text style={{ color: colors.accentInk }} className="font-bold text-[14.5px]">
            Ir a pagar · {formatPrice(subtotal + SHIPPING_CENTS)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
```

- [x] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: same residual failure as Task 10 Step 2 — no new ones.

- [x] **Step 3: Manual smoke check**

Run: `npm run web`. With an empty cart, open Carrito → see the empty state. Add a
non-Rx product from Buscar, return to Carrito → see the line item and totals. Add
"Amoxicilina" (Rx) → see the red "Necesita receta" block and the footer's "espera
receta" note.

- [x] **Step 4: Commit**

```bash
git add "app/(tabs)/cart.tsx"
git commit -m "Add cart screen wired to cart store's prescriptionId field"
```

---

### Task 12: Orders screen (`app/(tabs)/orders.tsx`)

**Files:**
- Create: `app/(tabs)/orders.tsx`

**Interfaces:**
- Consumes: `useTheme()` (Task 1), `useTabBarContentInset()` (existing), `EmptyState`
  (Task 4), `SkeletonProductRow` (Task 4), `formatPrice` (existing).

- [x] **Step 1: Add `app/(tabs)/orders.tsx`**

```bash
cp "resources/App redesign/handoff/app/-tabs-/orders.tsx" "app/(tabs)/orders.tsx"
```

(Source: `resources/App redesign/handoff/app/-tabs-/orders.tsx` — copied unchanged. 900ms
mock loading always resolves to an empty list, showing the "cómo funciona" empty state
and a subscription upsell row.)

- [x] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: same residual failure as Task 11 Step 2 — no new ones.

- [x] **Step 3: Manual smoke check**

Run: `npm run web`, open the Pedidos tab.
Expected: 3 skeleton rows for ~900ms, then the "Ningún pedido activo" empty state with
the 3-step "cómo funciona" card and subscription row.

- [x] **Step 4: Commit**

```bash
git add "app/(tabs)/orders.tsx"
git commit -m "Add orders screen with skeleton and empty states"
```

---

### Task 13: Move + re-skin prescriptions listing (`app/prescription/index.tsx`)

**Files:**
- Create: `app/prescription/index.tsx`
- Delete: `app/(tabs)/prescriptions.tsx`

**Interfaces:**
- Consumes: `useTheme()` (Task 1), `Card`/`Badge`/`Button` (Task 5), `EmptyState` (Task
  4), `Prescription`/`PrescriptionStatus` (existing, `types/prescription.ts` —
  unchanged), `formatDate` (existing).
- Produces: route `/prescription` (no `Stack.Screen` registration needed — Expo Router
  auto-serves file-based routes not explicitly listed in `app/_layout.tsx`'s `<Stack>`,
  same as how `/prescription/upload` already worked before its explicit
  `presentation: 'modal'` option was added). Task 15 (profile screen) links here.

- [x] **Step 1: Create `app/prescription/index.tsx`**

Reuses the new `EmptyState` primitive instead of the old screen's hand-rolled empty view
(DRY — matches cart/orders/search's empty-state look). Drops the old screen's inert "Ver
historial de recetas" button, which had `onPress={() => {}}` (a no-op, not a real
destination) and this screen has no tab bar to account for (it's pushed as a secondary
screen, not a tab), so `useTabBarContentInset()` is dropped too.

```tsx
// app/prescription/index.tsx — moved from (tabs); reached from Profile, not a tab
import { FlatList, Text, View } from 'react-native';
import { router } from 'expo-router';
import { FileText, Plus, ShieldCheck } from 'lucide-react-native';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { useTheme } from '../../hooks/useTheme';
import type { Prescription, PrescriptionStatus } from '../../types/prescription';
import { formatDate } from '../../utils/format';

const STATUS_LABEL: Record<PrescriptionStatus, string> = {
  pending: 'Pendiente',
  in_review: 'En revisión',
  approved: 'Aprobada',
  rejected: 'Rechazada',
};

const STATUS_TONE: Record<PrescriptionStatus, 'warning' | 'success' | 'rx' | 'neutral'> = {
  pending: 'neutral',
  in_review: 'warning',
  approved: 'success',
  rejected: 'rx',
};

const MOCK_PRESCRIPTIONS: Prescription[] = [];

export default function PrescriptionListScreen() {
  const { colors } = useTheme();
  const isEmpty = MOCK_PRESCRIPTIONS.length === 0;

  return (
    <View style={{ backgroundColor: colors.bg }} className="flex-1 p-4">
      {!isEmpty ? <Button label="Subir nueva receta" icon={Plus} onPress={() => router.push('/prescription/upload')} /> : null}

      <FlatList
        className={isEmpty ? undefined : 'mt-4'}
        contentContainerStyle={isEmpty ? { flexGrow: 1, justifyContent: 'center' } : undefined}
        data={MOCK_PRESCRIPTIONS}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <EmptyState
            icon={FileText}
            title="No tienes recetas activas"
            body="Sube una foto de tu receta médica para empezar a pedir tus medicamentos de forma segura y rápida."
            primary={{ label: 'Subir nueva receta', icon: Plus, onPress: () => router.push('/prescription/upload') }}
          >
            <View className="flex-row items-center justify-center gap-2 opacity-80">
              <ShieldCheck color={colors.textSecondary} size={16} />
              <Text style={{ color: colors.textSecondary }} className="text-xs">Carga segura y confidencial</Text>
            </View>
          </EmptyState>
        }
        renderItem={({ item }) => (
          <Card className="mb-3">
            <Badge label={STATUS_LABEL[item.status]} tone={STATUS_TONE[item.status]} />
            <Text style={{ color: colors.textSecondary }} className="mt-2 text-sm">{formatDate(item.createdAt)}</Text>
          </Card>
        )}
      />
    </View>
  );
}
```

- [x] **Step 2: Delete the old tab screen**

```bash
git rm "app/(tabs)/prescriptions.tsx"
```

- [x] **Step 3: Run typecheck**

Run: `npm run typecheck`
Expected: PASS — this was the last residual failure from Task 1. Zero errors.

- [x] **Step 4: Manual smoke check**

Run: `npm run web`, navigate to `/prescription` directly (e.g. temporarily from a dev
link, or wait for Task 15's Profile row).
Expected: empty state renders with the "Subir nueva receta" primary button and the
"Carga segura" footnote.

- [x] **Step 5: Commit**

```bash
git add app/prescription/index.tsx
git commit -m "Move prescriptions listing to app/prescription/index.tsx, re-skin, drop dead history button"
```

---

### Task 14: Re-skin auth screens (login, register)

**Files:**
- Modify: `app/(auth)/login.tsx` (full replace)
- Modify: `app/(auth)/register.tsx` (full replace)

**Interfaces:**
- Consumes: `useTheme()` (Task 1), `Button`/`Input` (Task 5). Copy, validation, and
  navigation logic are unchanged from the current files — only color source changes.

- [ ] **Step 1: Replace `app/(auth)/login.tsx`**

```tsx
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Eye, EyeOff, HeartPulse, Lock, Mail } from 'lucide-react-native';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useTheme } from '../../hooks/useTheme';
import { isSupabaseConfigured, supabase } from '../../services/supabase';
import { mockAuth } from '../../services/mockAuth';

export default function LoginScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState(isSupabaseConfigured ? '' : 'demo@Nova Pharma.app');
  const [password, setPassword] = useState(isSupabaseConfigured ? '' : 'demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      await mockAuth.signIn(email);
      setLoading(false);
      router.replace('/(tabs)');
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.replace('/(tabs)');
  }

  return (
    <View style={{ backgroundColor: colors.bg }} className="flex-1 justify-center px-6">
      <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="rounded-card border p-6">
        <View className="mb-6 items-center gap-2">
          <View style={{ backgroundColor: colors.accent }} className="h-16 w-16 items-center justify-center rounded-full">
            <HeartPulse color={colors.accentInk} size={28} />
          </View>
          <Text style={{ color: colors.accentText }} className="text-2xl font-bold">Nova Pharma</Text>
          <Text style={{ color: colors.textPrimary }} className="text-lg font-bold">Bienvenido de nuevo</Text>
          {!isSupabaseConfigured ? (
            <Text style={{ color: colors.warning }} className="text-xs">Modo demo — cualquier contraseña funciona</Text>
          ) : null}
        </View>

        <Input
          placeholder="Correo electrónico"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          icon={<Mail color={colors.textDim} size={20} />}
        />

        <Input
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          icon={<Lock color={colors.textDim} size={20} />}
          rightElement={
            <Pressable accessibilityRole="button" accessibilityLabel="Mostrar contraseña" onPress={() => setShowPassword((v) => !v)}>
              {showPassword ? <EyeOff color={colors.textDim} size={20} /> : <Eye color={colors.textDim} size={20} />}
            </Pressable>
          }
        />

        <Pressable accessibilityRole="button" className="mb-4 items-end">
          <Text style={{ color: colors.accentText }} className="text-sm font-medium">¿Olvidaste tu contraseña?</Text>
        </Pressable>

        {error ? <Text style={{ color: colors.danger }} className="mb-3 text-sm">{error}</Text> : null}

        <Button label="Entrar" loading={loading} onPress={handleLogin} />

        <View className="mt-4 flex-row justify-center">
          <Text style={{ color: colors.textSecondary }} className="text-sm">¿No tienes cuenta? </Text>
          <Link href="/(auth)/register" style={{ color: colors.accentText }} className="text-sm font-medium">
            Regístrate
          </Link>
        </View>
      </View>
    </View>
  );
}
```

- [ ] **Step 2: Replace `app/(auth)/register.tsx`**

```tsx
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Check, Eye, EyeOff, Lock, Mail, Phone, Stethoscope, User } from 'lucide-react-native';
import { isSupabaseConfigured, supabase } from '../../services/supabase';
import { mockAuth } from '../../services/mockAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useTheme } from '../../hooks/useTheme';

export default function RegisterScreen() {
  const { colors } = useTheme();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      await mockAuth.signUp(email, fullName, phone);
      setLoading(false);
      router.replace('/(tabs)');
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone } },
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    router.replace('/(tabs)');
  }

  const canSubmit = acceptedTerms && fullName.length > 0 && email.length > 0 && password.length >= 8;

  return (
    <View style={{ backgroundColor: colors.bg }} className="flex-1 justify-center px-6 py-8">
      <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="rounded-card border p-6">
        <View className="mb-6 items-center gap-1">
          <View style={{ backgroundColor: colors.accentSoft }} className="mb-2 h-12 w-12 items-center justify-center rounded-full">
            <Stethoscope color={colors.accentText} size={24} />
          </View>
          <Text style={{ color: colors.textPrimary }} className="text-xl font-bold">Crear cuenta</Text>
          <Text style={{ color: colors.textSecondary }} className="text-center text-sm">Únete a Nova Pharma para atención médica sin fricciones.</Text>
        </View>

        <Input
          label="Nombre completo"
          placeholder="Jane Doe"
          value={fullName}
          onChangeText={setFullName}
          icon={<User color={colors.textDim} size={20} />}
        />

        <Input
          label="Correo electrónico"
          placeholder="jane@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          icon={<Mail color={colors.textDim} size={20} />}
        />

        <Input
          label="Teléfono"
          placeholder="(555) 123-4567"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          icon={<Phone color={colors.textDim} size={20} />}
        />

        <Input
          label="Contraseña"
          placeholder="••••••••"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          icon={<Lock color={colors.textDim} size={20} />}
          rightElement={
            <Pressable accessibilityRole="button" accessibilityLabel="Mostrar contraseña" onPress={() => setShowPassword((v) => !v)}>
              {showPassword ? <EyeOff color={colors.textDim} size={20} /> : <Eye color={colors.textDim} size={20} />}
            </Pressable>
          }
        />
        <Text style={{ color: colors.textSecondary }} className="-mt-2 mb-4 text-xs">Debe tener al menos 8 caracteres.</Text>

        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: acceptedTerms }}
          onPress={() => setAcceptedTerms((v) => !v)}
          className="mb-4 min-h-touch flex-row items-center gap-3"
        >
          <View
            style={{
              borderColor: acceptedTerms ? colors.accent : colors.border,
              backgroundColor: acceptedTerms ? colors.accent : 'transparent',
            }}
            className="h-5 w-5 items-center justify-center rounded border-2"
          >
            {acceptedTerms ? <Check color={colors.accentInk} size={14} /> : null}
          </View>
          <Text style={{ color: colors.textSecondary }} className="flex-1 text-sm">
            Acepto los <Text style={{ color: colors.accentText }} className="font-medium">Términos y Condiciones</Text> y la{' '}
            <Text style={{ color: colors.accentText }} className="font-medium">Política de Privacidad</Text>.
          </Text>
        </Pressable>

        {error ? <Text style={{ color: colors.danger }} className="mb-3 text-sm">{error}</Text> : null}

        <Button label="Registrarme" loading={loading} disabled={!canSubmit} onPress={handleRegister} />

        <View className="mt-4 flex-row justify-center">
          <Text style={{ color: colors.textSecondary }} className="text-sm">¿Ya tienes cuenta? </Text>
          <Link href="/(auth)/login" style={{ color: colors.accentText }} className="text-sm font-medium">
            Inicia sesión
          </Link>
        </View>
      </View>
    </View>
  );
}
```

- [ ] **Step 3: Run typecheck**

Run: `npm run typecheck`
Expected: PASS — zero errors (this task doesn't touch any file with a residual failure).

- [ ] **Step 4: Manual smoke check**

Run: `npm run web`, open `/(auth)/login` and `/(auth)/register`.
Expected: both render solid (not transparent) backgrounds, lima accent on the logo
circle/checkbox/links, correct light/dark colors when the OS theme is toggled.

- [ ] **Step 5: Commit**

```bash
git add "app/(auth)/login.tsx" "app/(auth)/register.tsx"
git commit -m "Re-skin login and register screens to the lima/dark-mode tokens"
```

---

### Task 15: Profile screen (`app/(tabs)/profile.tsx`)

**Files:**
- Modify: `app/(tabs)/profile.tsx` (full replace)

**Interfaces:**
- Consumes: `useTheme()` (Task 1), `useTabBarContentInset()` (existing), `useAuth()`
  (Task 7 — uses the new `signOut`).
- Produces: adds one "Mis recetas" row (not in the handoff) linking to `/prescription`
  (Task 13) — the only reachable entry point to that screen, since the handoff's
  `profile.tsx` has none and the "Recetas" tab was dropped per the spec's locked-in
  decision.

- [ ] **Step 1: Replace `app/(tabs)/profile.tsx`**

```tsx
// app/(tabs)/profile.tsx
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import {
  TriangleAlert, HeartPulse, Users, FileText, Globe, Moon, Shield, Headset, LogOut, ChevronRight,
  type LucideIcon,
} from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { useTabBarContentInset } from '../../hooks/useTabBarInset';
import { useAuth } from '../../hooks/useAuth';

interface RowProps { icon: LucideIcon; label: string; value?: string; onPress?: () => void }

export default function ProfileScreen() {
  const { colors, isDark } = useTheme();
  const inset = useTabBarContentInset();
  const { signOut } = useAuth();

  function Row({ icon: Icon, label, value, onPress }: RowProps) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        className="min-h-touch flex-row items-center gap-3 px-3.5 py-3"
      >
        <Icon color={colors.textSecondary} size={20} />
        <Text style={{ color: colors.textPrimary }} className="flex-1 font-medium text-[13.5px]">{label}</Text>
        {value ? <Text style={{ color: colors.textSecondary }} className="text-xs">{value}</Text> : null}
        <ChevronRight color={colors.textDim} size={18} />
      </Pressable>
    );
  }

  return (
    <View style={{ backgroundColor: colors.bg }} className="flex-1 px-5">
      <ScrollView contentContainerStyle={{ paddingBottom: inset }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-3.5 pt-4">
          <View style={{ backgroundColor: colors.accent }} className="h-[60px] w-[60px] items-center justify-center rounded-full">
            <Text style={{ color: colors.accentInk }} className="font-bold text-[19px]">AR</Text>
          </View>
          <View className="flex-1">
            <Text style={{ color: colors.textPrimary }} className="font-bold text-[19px]">Alex Rivera</Text>
            <Text style={{ color: colors.textSecondary }} className="mt-1 font-mono text-xs">alex@correo.do</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Editar perfil" className="min-h-touch justify-center">
            <Text style={{ color: colors.accentText }} className="font-medium text-xs">Editar</Text>
          </Pressable>
        </View>

        <View className="mt-5 flex-row gap-2.5">
          {[['92%', 'adherencia', colors.accentText], ['3', 'medicamentos', colors.textPrimary], ['18', 'pedidos', colors.textPrimary]].map(
            ([value, label, tint]) => (
              <View
                key={label}
                style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                className="flex-1 rounded-card border p-3.5"
              >
                <Text style={{ color: tint }} className="font-mono text-xl">{value}</Text>
                <Text style={{ color: colors.textSecondary }} className="mt-1.5 text-[11px]">{label}</Text>
              </View>
            ),
          )}
        </View>

        <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="mt-5 rounded-card border p-4">
          <Text style={{ color: colors.textSecondary }} className="font-bold text-[9.5px] tracking-[1.6px]">SALUD</Text>
          <View className="mt-3.5 gap-3.5">
            {[
              [TriangleAlert, 'Alergias', 'Penicilina, sulfas'],
              [HeartPulse, 'Seguro', 'ARS Humano · plan Élite'],
              [Users, 'Cuidador', 'Rosa M. · recibe alertas'],
            ].map(([Icon, label, detail]) => {
              const I = Icon as LucideIcon;
              return (
                <Pressable key={label as string} accessibilityRole="button" accessibilityLabel={label as string} className="min-h-touch flex-row items-center gap-3">
                  <I color={colors.accentText} size={20} />
                  <View className="flex-1">
                    <Text style={{ color: colors.textPrimary }} className="font-medium text-[13.5px]">{label}</Text>
                    <Text style={{ color: colors.textSecondary }} className="mt-0.5 text-[11.5px]">{detail}</Text>
                  </View>
                  <ChevronRight color={colors.textDim} size={18} />
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="mt-3 rounded-card border p-4">
          <Text style={{ color: colors.textSecondary }} className="font-bold text-[9.5px] tracking-[1.6px]">AVISOS</Text>
          <View className="mt-3.5 gap-4">
            {[
              ['Estado de recetas', 'al validarse o vencer', true],
              ['Estado de pedidos', 'entrega y rastreo', true],
              ['Ofertas', 'promos y novedades', false],
            ].map(([label, detail, on]) => (
              <View key={label as string} className="flex-row items-center justify-between">
                <View className="flex-1 pr-2.5">
                  <Text style={{ color: colors.textPrimary }} className="font-medium text-[13.5px]">{label}</Text>
                  <Text style={{ color: colors.textSecondary }} className="mt-0.5 text-[11px]">{detail}</Text>
                </View>
                <Switch
                  accessibilityLabel={label as string}
                  value={on as boolean}
                  trackColor={{ true: colors.accent, false: colors.elevated }}
                  thumbColor={colors.surface}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="mt-3 rounded-card border p-1.5">
          <Row icon={FileText} label="Mis recetas" onPress={() => router.push('/prescription')} />
          <Row icon={Globe} label="Idioma" value="Español" />
          <Row icon={Moon} label="Tema" value={isDark ? 'Oscuro' : 'Claro'} />
          <Row icon={Shield} label="Privacidad y datos" />
          <Row icon={Headset} label="Hablar con un farmacéutico" />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar sesión"
          onPress={() => { signOut(); router.replace('/(auth)/login'); }}
          style={{ borderColor: colors.danger }}
          className="mt-3 min-h-[52px] flex-row items-center justify-center gap-2.5 rounded-button border"
        >
          <LogOut color={colors.danger} size={19} />
          <Text style={{ color: colors.danger }} className="font-medium text-base">Cerrar sesión</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
```

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: PASS — zero errors.

- [ ] **Step 3: Manual smoke check**

Run: `npm run web`, open the Yo tab.
Expected: stats row, SALUD card, AVISOS toggles, settings list (now including "Mis
recetas" which pushes `/prescription`), sign-out button in danger color. Toggle OS theme
→ "Tema" row value flips Claro/Oscuro and colors re-render.

- [ ] **Step 4: Commit**

```bash
git add "app/(tabs)/profile.tsx"
git commit -m "Replace profile screen with lima/dark-mode design, add Mis recetas entry point"
```

---

### Task 16: Checkout screen (`app/order/checkout.tsx`)

**Files:**
- Modify: `app/order/checkout.tsx` (full replace)

**Interfaces:**
- Consumes: `useTheme()` (Task 1), `useCartStore` (Task 6 — reads `s.lines`),
  `LoadingSteps`/`LoadingStep` (Task 4), `formatPrice` (existing).

- [ ] **Step 1: Replace `app/order/checkout.tsx`**

```bash
cp "resources/App redesign/handoff/app/order/checkout.tsx" app/order/checkout.tsx
```

(Source: `resources/App redesign/handoff/app/order/checkout.tsx` — copied unchanged.
Delivery method toggle, payment/insurance summary, and a blocking `LoadingSteps` confirm
state after tapping Pay.)

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: PASS — zero errors.

- [ ] **Step 3: Manual smoke check**

Run: `npm run web`, add a product to cart, go to Carrito → "Ir a pagar".
Expected: delivery/payment/summary cards render; tapping "Pagar" swaps to the
`LoadingSteps` confirming view.

- [ ] **Step 4: Commit**

```bash
git add app/order/checkout.tsx
git commit -m "Replace checkout screen with lima/dark-mode design and blocking confirm state"
```

---

### Task 17: Order tracking screen (`app/order/[id].tsx`)

**Files:**
- Modify: `app/order/[id].tsx` (full replace)

**Interfaces:**
- Consumes: `useTheme()` (Task 1), `LoadingSteps`/`LoadingStep` (Task 4).

- [ ] **Step 1: Replace `app/order/[id].tsx`**

```bash
cp "resources/App redesign/handoff/app/order/-id-.tsx" "app/order/[id].tsx"
```

(Source: `resources/App redesign/handoff/app/order/-id-.tsx` — copied unchanged. 280px
placeholder `View` stands in for `react-native-maps` per the spec's explicit
out-of-scope decision; `LoadingSteps` for delivery progress; courier contact row.)

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: PASS — zero errors.

- [ ] **Step 3: Manual smoke check**

Run: `npm run web`, navigate to `/order/123` directly.
Expected: 280px placeholder block at top, ETA header, `LoadingSteps` progress, courier
contact card, cédula notice.

- [ ] **Step 4: Commit**

```bash
git add "app/order/[id].tsx"
git commit -m "Replace order tracking screen with lima/dark-mode design"
```

---

### Task 18: Re-skin prescription upload flow

**Files:**
- Modify: `components/prescription/PrescriptionUploader.tsx` (full replace)
- Modify: `app/prescription/upload.tsx` (full replace)

**Interfaces:**
- Consumes: `useTheme()` (Task 1), `Button` (Task 5), `usePrescriptionUpload()`
  (existing, `hooks/usePrescriptionUpload.ts` — unchanged: `file`, `pickFromCamera`,
  `pickFromGallery`, `pickDocument`, `clear`).

- [ ] **Step 1: Replace `components/prescription/PrescriptionUploader.tsx`**

```tsx
import { Image, Pressable, Text, View } from 'react-native';
import { Camera, FileText, ImagePlus, X } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import type { PrescriptionFile } from '../../hooks/usePrescriptionUpload';

interface PrescriptionUploaderProps {
  file: PrescriptionFile | null;
  onPickCamera: () => void;
  onPickGallery: () => void;
  onPickDocument: () => void;
  onClear: () => void;
}

export function PrescriptionUploader({ file, onPickCamera, onPickGallery, onPickDocument, onClear }: PrescriptionUploaderProps) {
  const { colors } = useTheme();

  if (file) {
    return (
      <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="rounded-card border p-3">
        <View className="relative">
          {file.type === 'image' ? (
            <Image source={{ uri: file.uri }} className="h-48 w-full rounded-xl" resizeMode="cover" />
          ) : (
            <View style={{ backgroundColor: colors.elevated }} className="h-24 w-full flex-row items-center gap-2 rounded-xl px-4">
              <FileText color={colors.accentText} size={22} />
              <Text numberOfLines={1} style={{ color: colors.textPrimary }} className="flex-1 text-sm">
                {file.name}
              </Text>
            </View>
          )}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Eliminar archivo adjunto"
            onPress={onClear}
            style={{ backgroundColor: colors.textPrimary }}
            className="absolute -right-2 -top-2 h-9 w-9 items-center justify-center rounded-full"
          >
            <X color={colors.surface} size={18} />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: colors.accentSoft, borderColor: colors.border }} className="items-center gap-4 rounded-card border-2 border-dashed p-8">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Tomar foto o subir archivo de la receta"
        onPress={onPickGallery}
        style={{ backgroundColor: colors.accent }}
        className="h-16 w-16 items-center justify-center rounded-full"
      >
        <ImagePlus color={colors.accentInk} size={28} />
      </Pressable>

      <View className="items-center gap-1">
        <Text style={{ color: colors.textPrimary }} className="text-center text-lg font-bold">Toma una foto o sube el PDF de tu receta</Text>
        <Text style={{ color: colors.textSecondary }} className="text-center text-sm">Asegúrate de que todos los datos sean legibles.</Text>
      </View>

      <View className="flex-row gap-3">
        <Pressable
          accessibilityRole="button"
          onPress={onPickCamera}
          style={{ backgroundColor: colors.surface, borderColor: colors.accent }}
          className="min-h-touch flex-row items-center gap-2 rounded-full border px-4"
        >
          <Camera color={colors.accentText} size={18} />
          <Text style={{ color: colors.accentText }} className="text-sm font-medium">Cámara</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={onPickDocument}
          style={{ backgroundColor: colors.surface, borderColor: colors.accent }}
          className="min-h-touch flex-row items-center gap-2 rounded-full border px-4"
        >
          <FileText color={colors.accentText} size={18} />
          <Text style={{ color: colors.accentText }} className="text-sm font-medium">PDF</Text>
        </Pressable>
      </View>
    </View>
  );
}
```

- [ ] **Step 2: Replace `app/prescription/upload.tsx`**

```tsx
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, MapPin, ShieldCheck, Truck } from 'lucide-react-native';
import { usePrescriptionUpload } from '../../hooks/usePrescriptionUpload';
import { PrescriptionUploader } from '../../components/prescription/PrescriptionUploader';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';

export default function UploadPrescriptionScreen() {
  const { colors } = useTheme();
  const { file, pickFromCamera, pickFromGallery, pickDocument, clear } = usePrescriptionUpload();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: colors.bg }} className="flex-1">
      <View
        style={{ paddingTop: insets.top, backgroundColor: colors.surface, borderBottomColor: colors.border }}
        className="flex-row items-center border-b px-2 py-3"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-full"
        >
          <ArrowLeft color={colors.textSecondary} size={22} />
        </Pressable>
        <Text style={{ color: colors.accentText }} className="text-lg font-bold">Subir receta</Text>
      </View>

      <ScrollView contentContainerClassName="gap-6 p-4 pb-32">
        <View style={{ backgroundColor: colors.accentSoft }} className="flex-row items-center gap-2 self-start rounded-full px-4 py-2">
          <ShieldCheck color={colors.accentText} size={18} />
          <Text style={{ color: colors.accentText }} className="text-xs font-bold">Verificado por farmacéuticos licenciados</Text>
        </View>

        <PrescriptionUploader
          file={file}
          onPickCamera={pickFromCamera}
          onPickGallery={pickFromGallery}
          onPickDocument={pickDocument}
          onClear={clear}
        />

        <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="gap-4 rounded-card border p-5">
          <View className="flex-row items-center justify-between">
            <Text style={{ color: colors.textPrimary }} className="text-base font-bold">Detalles de entrega</Text>
            <Truck color={colors.accentText} size={20} />
          </View>

          <View className="flex-row items-start gap-3">
            <MapPin color={colors.textSecondary} size={18} />
            <View>
              <Text style={{ color: colors.textPrimary }} className="text-base">Calle Bienestar 123, Apt 4B</Text>
              <Text style={{ color: colors.textSecondary }} className="text-sm">Ciudad Metro, NY 10001</Text>
            </View>
          </View>

          <View style={{ backgroundColor: colors.elevated }} className="flex-row items-center gap-3 rounded-xl p-3">
            <Clock color={colors.warning} size={18} />
            <Text style={{ color: colors.textPrimary }} className="text-sm font-medium">Entrega estimada: 30-45 min</Text>
          </View>
        </View>

        <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="gap-3 rounded-card border p-5">
          <Text style={{ color: colors.textPrimary }} className="text-base font-bold">Resumen de pago</Text>

          <View className="flex-row justify-between">
            <Text style={{ color: colors.textSecondary }}>Subtotal</Text>
            <Text style={{ color: colors.textSecondary }}>Pendiente de verificación</Text>
          </View>
          <View className="flex-row justify-between">
            <Text style={{ color: colors.textSecondary }}>Costo de envío</Text>
            <Text style={{ color: colors.textSecondary }}>$4.99</Text>
          </View>
          <View style={{ borderTopColor: colors.border }} className="flex-row items-center justify-between border-t pt-3">
            <Text style={{ color: colors.textPrimary }} className="text-base font-bold">Total</Text>
            <Text style={{ color: colors.textSecondary }} className="text-sm italic">Se calcula tras la verificación</Text>
          </View>
        </View>
      </ScrollView>

      <View style={{ backgroundColor: colors.surface, borderTopColor: colors.border }} className="absolute bottom-0 left-0 w-full border-t p-4">
        <Button
          label="Enviar receta para revisión"
          disabled={!file}
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}
```

- [ ] **Step 3: Run typecheck**

Run: `npm run typecheck`
Expected: PASS — zero errors.

- [ ] **Step 4: Manual smoke check**

Run: `npm run web`, open `/prescription/upload` (as a modal, e.g. from Cart's "Comprar
con mi receta").
Expected: header, verified badge, dashed uploader placeholder in lima-soft, delivery and
payment summary cards, disabled submit button until a file is picked.

- [ ] **Step 5: Commit**

```bash
git add components/prescription/PrescriptionUploader.tsx app/prescription/upload.tsx
git commit -m "Re-skin prescription upload flow to the lima/dark-mode tokens"
```

---

### Task 19: Update CLAUDE.md design tokens section

**Files:**
- Modify: `CLAUDE.md`

**Interfaces:** none — documentation only.

- [ ] **Step 1: Replace the "🎨 Sistema de Diseño (Tokens)" section**

Replace the existing section (from `## 🎨 Sistema de Diseño (Tokens)` through the end of
its "Componentes y Accesibilidad" subsection, i.e. everything up to the next `---`) with:

```markdown
## 🎨 Sistema de Diseño (Tokens)
Paleta "Lima + Dark Mode" — tema claro/oscuro conmutable vía `useColorScheme()`. Los
colores viven en `types/theme.ts` (`darkColors`/`lightColors`) y se consumen con el hook
`useTheme()` (`hooks/useTheme.ts`) + `style` inline — **no** con variantes `dark:` de
Tailwind. Tailwind (NativeWind) sigue siendo responsable de spacing, tipografía y radios.

### Colores (oscuro / claro)
- **Accent / CTA:** `#C7F04A` de relleno (`colors.accent`) en ambos temas. En tema claro
  el texto/íconos sobre relleno lima usan oliva `colors.accentText` (`#4E6B0A`) por
  contraste AA; en oscuro `accentText` es el mismo lima que `accent`.
- **Superficies:** `colors.bg` (fondo) → `colors.surface` (tarjetas) → `colors.elevated`
  (chips/inputs) — oscuro: `#0D0F12 → #15181D → #1D2128`; claro: `#F3F5F1 → #FFFFFF →
  #E9EDE3`.
- **Texto:** `colors.textPrimary` / `colors.textSecondary` / `colors.textDim`.
- **Semánticos:** `Rx / Danger:` `colors.danger` (+ `colors.dangerBg` para fondos
  suaves) · `Warning:` `colors.warning` · `Info:` `colors.info`.
- **Bordes:** `colors.border`.

### Componentes y Accesibilidad
- **Bordes redondeados:** `rounded-card` (18px) para Tarjetas, `rounded-button` (14px)
  para Botones, `rounded-full` para Badges/pills.
- **Área de toque (Touch Targets):** Mínimo 44x44px (`min-h-touch`/`h-touch`/`w-touch`,
  `min-h-[52px]` en botones primarios).
- **Tipografía:** Space Grotesk (`font-sans` Regular, `font-medium` Medium, `font-bold`
  Bold) para texto general; JetBrains Mono (`font-mono`) para precios, horas y datos
  tabulares.
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "Document lima/dark-mode design tokens in CLAUDE.md"
```

---

### Task 20: Final verification pass

**Files:** none (verification only).

- [ ] **Step 1: Full-repo typecheck**

Run: `npm run typecheck`
Expected: PASS, zero errors.

- [ ] **Step 2: Confirm no dead references remain**

Run: `grep -rln "bg-brand\|text-brand\|bg-rx\b\|text-rx\b\|text-warning\|bg-success\|text-success\|bg-mint\|#0F766E\|#E6F4F1\|#94A3B8\|#3E4949\|#DC2626\|#16A34A\|#D97706" --include=*.tsx --include=*.ts app components`
Expected: no matches (all old-palette references removed or re-skinned).

Run: `grep -rln "TabItem\|FloatingTabBarProps\|types/navigation" --include=*.tsx --include=*.ts app components`
Expected: no matches.

- [ ] **Step 3: Manual verification checklist (Expo web or simulator)**

- [ ] Toggle OS light/dark mode; confirm every screen re-colors (no hardcoded colors
      left behind).
- [ ] All 5 tabs present and navigable: Tienda, Buscar, Carrito, Pedidos, Perfil — no
      "Recetas" tab.
- [ ] Cart flow: add a non-Rx product, add an Rx product ("Amoxicilina"), see the
      per-line Rx block and the footer's blocked-count note, reach Checkout, submit and
      see the blocking `LoadingSteps` confirm screen.
- [ ] Order tracking (`/order/123`) renders the placeholder map block and progress
      steps.
- [ ] Login and register screens render solid backgrounds and correct brand colors (not
      transparent).
- [ ] Prescription upload screen (`/prescription/upload`, opened as a modal) renders
      correctly; "Mis recetas" row in Profile pushes `/prescription` and shows the empty
      state.
- [ ] Cart badge on the Carrito tab icon updates when items are added.

- [ ] **Step 4: Report results**

Summarize the typecheck output and the manual checklist results (pass/fail per item) to
the user — do not mark this task done silently if any item fails; fix and re-verify
first.
