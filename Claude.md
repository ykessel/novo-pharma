# CLAUDE.md - Contexto y Convenciones del Proyecto

## 📌 Resumen del Proyecto
Aplicación móvil e-commerce de farmacia y venta/entrega de medicamentos con subida y validación de recetas médicas (Rx).

---

## 🛠️ Stack Tecnológico
- **Frontend Móvil:** React Native con Expo (Expo Router v3).
- **Estilos & UI:** Tailwind CSS v3 a través de **NativeWind**.
- **Iconos:** Lucide-react-native / Expo Vector Icons (Material Symbols).
- **Navegación:** File-based routing con Expo Router (`app/`).
- **Estado Global & Fetching:** React Query (TanStack Query) + Zustand.
- **Backend & BD:** Supabase (PostgreSQL, Supabase Auth, Storage para recetas).
- **Lenguaje:** TypeScript estricto.

---

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

---

## 📁 Arquitectura del Código Frontend

```text
├── app/                      # Rutas de Expo Router
│   ├── (auth)/               # Flujo de autenticación (login, registro)
│   ├── (tabs)/               # Navegación principal (Tienda, Buscar, Carrito, Pedidos, Perfil)
│   ├── prescription/         # Modales y pantallas de flujo de subida de recetas
│   └── order/                # Pantallas de checkout y tracking en vivo
├── components/
│   ├── ui/                   # Componentes atómicos (Button, Input, Badge, Card)
│   ├── home/                 # Componentes específicos del Dashboard
│   ├── product/              # Cards, listados y selector de dosis
│   └── prescription/         # Componentes de carga de imagen/PDF y vista previa
├── hooks/                    # Custom hooks (useAuth, usePrescriptionUpload, etc.)
├── services/                 # Llamadas a API / Supabase Client
├── types/                    # Interfaces y Tipos de TypeScript (Product, Order, Rx)
└── utils/                    # Helper functions (formateadores de precios, fechas)
