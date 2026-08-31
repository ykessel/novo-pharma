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
Usar estrictamente las clases de Tailwind configuradas para mantener consistencia con la paleta *Teal Health & Wellness*:

### Colores
- **Brand Primary:** `#0F766E` (`bg-teal-700`, `text-teal-700`)
- **Brand Secondary / Soft Mint:** `#E6F4F1` (`bg-teal-50`, `bg-mint-100`)
- **Accent / CTA:** `#F97316` (`bg-orange-500`, `text-orange-500`)
- **Semánticos:**
  - `Rx / Requiere Receta / Danger:` `#DC2626` (`bg-red-600`, `text-red-600`)
  - `Success / Entregado:` `#16A34A` (`bg-green-600`)
  - `Warning / En Revisión:` `#D97706` (`bg-amber-600`)
- **Neutros:** Fondo `bg-slate-50`, Texto Principal `text-slate-900`, Bordes `border-slate-200`.

### Componentes y Accesibilidad
- **Bordes redondeados:** `rounded-2xl` (16px) para Tarjetas, `rounded-xl` (12px) para Botones, `rounded-full` para Badges.
- **Área de toque (Touch Targets):** Mínimo 44x44px en todos los botones e íconos interactivos (`min-h-[44px]`, `p-3`).
- **Tipografía:** Fuente Inter (Regular `font-normal`, Medium `font-medium`, Bold `font-bold`).

---

## 📁 Arquitectura del Código Frontend

```text
├── app/                      # Rutas de Expo Router
│   ├── (auth)/               # Flujo de autenticación (login, registro)
│   ├── (tabs)/               # Navegación principal (home, catalog, prescriptions, profile)
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
