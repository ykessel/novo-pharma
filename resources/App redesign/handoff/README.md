# Novo Pharma — redesign handoff

Drop-in source for \`ykessel/novo-pharma\` (branch \`main\`, read at commit tree 18f18c7a9f51).
Written against the repo's real conventions: NativeWind classes, \`rounded-card\`/\`rounded-button\`,
\`lucide-react-native\` icons, \`min-h-[52px]\` buttons, \`h-touch\`/\`w-touch\` 44px targets,
\`formatPrice(cents)\`, and the existing \`Product\` / \`useCartStore\` shapes.

## ⚠ Renombra las carpetas al copiar

Este entorno no permite paréntesis ni corchetes en nombres de carpeta, así que:

| Aquí | En el repo |
| --- | --- |
| \`handoff/app/-tabs-/\` | \`app/(tabs)/\` |
| \`handoff/app/order/-id-.tsx\` | \`app/order/[id].tsx\` |

## Archivos

### Tokens y tema
- \`types/theme.ts\` — **reemplaza.** \`darkColors\` + \`lightColors\`; \`colors\` sigue exportado para no romper imports.
- \`hooks/useTheme.ts\` — **nuevo.** Lee \`useColorScheme()\` y devuelve la paleta.
- \`tailwind.config.js\` — **reemplaza.** Paleta lima, \`darkMode: 'class'\`, fuentes Space Grotesk / JetBrains Mono.

> Contraste: lima \`#C7F04A\` sobre blanco no pasa AA como texto. En tema claro,
> \`accentText\` es oliva \`#4E6B0A\` — úsalo para texto e iconos; \`accent\` solo para rellenos.

### Primitivos nuevos
- \`components/ui/Skeleton.tsx\` — \`Skeleton\`, \`SkeletonProductRow\` (84px, igual que \`ProductRow\`), \`SkeletonProductCard\`.
- \`components/ui/EmptyState.tsx\` — acepta \`children\` para que el vacío siga vendiendo.
- \`components/ui/LoadingSteps.tsx\` — pasos nombrados para esperas > 5s.
- \`components/product/ProductRow.tsx\` — fila de 84px con badge RX, stock y añadir al carrito.

### Navegación
- \`app/(tabs)/_layout.tsx\` — **reemplaza.** Cinco tabs: index · search · cart · orders · profile.
- \`components/navigation/FloatingTabBar.tsx\` — **reemplaza.** Badge de carrito desde \`useCartStore\`.

### Pantallas
- \`app/(tabs)/index.tsx\` — **reemplaza.** Tienda: buscador, promo, categorías, recompra, más vendidos con skeleton.
- \`app/(tabs)/search.tsx\` — **nuevo.** Skeleton al buscar, sin-resultados con corrección y sinónimos.
- \`app/(tabs)/cart.tsx\` — **nuevo.** Bloqueo por receta por línea, resumen, vacío con recompra.
- \`app/(tabs)/orders.tsx\` — **nuevo.** Activos, skeleton, vacío con "cómo funciona", suscripción.
- \`app/(tabs)/profile.tsx\` — **reemplaza.** Alergias, seguro, cuidador, avisos, tema.
- \`app/order/checkout.tsx\` — **reemplaza.** Entrega, pago, seguro, y estado bloqueante con pasos.
- \`app/order/[id].tsx\` — **reemplaza.** Seguimiento con pasos, mensajero y aviso de cédula.

### A borrar
- \`app/(tabs)/prescriptions.tsx\` — deja de ser tab. Muévelo a \`app/prescription/index.tsx\` si quieres conservar el listado.
- \`app/(tabs)/catalog.tsx\` — lo sustituye \`search.tsx\`.

## Orden de aplicación

1. \`types/theme.ts\`, \`hooks/useTheme.ts\`, \`tailwind.config.js\`
2. \`components/ui/Skeleton.tsx\`, \`EmptyState.tsx\`, \`LoadingSteps.tsx\`
3. \`components/product/ProductRow.tsx\`
4. \`components/navigation/FloatingTabBar.tsx\` + \`app/(tabs)/_layout.tsx\`
5. Las pantallas, en cualquier orden

## Pendientes que dejé marcados con TODO

- **\`useCartStore\` necesita dos campos más:** \`prescriptionId?: string\` en \`CartLine\` y un
  \`removeItem\` / \`setQuantity\`. Hoy \`cart.tsx\` mantiene el adjunto en estado local
  (\`const [attached] = useState({})\`) — cámbialo al store cuando exista el endpoint.
- **Endpoints reales:** \`index.tsx\`, \`search.tsx\` y \`orders.tsx\` usan \`setTimeout\` +
  \`MOCK_PRODUCTS\` para demostrar el skeleton. Sustituye por tu fetch; el skeleton ya
  está cableado al flag \`loading\`.
- **Mapa:** \`app/order/[id].tsx\` deja un \`View\` de 280px donde va \`react-native-maps\`.
- **Fuentes:** \`tailwind.config.js\` pide \`SpaceGrotesk-*\` y \`JetBrainsMono-Regular\`.
  Cárgalas con \`expo-font\` en \`app/_layout.tsx\` o revierte \`fontFamily\` a Inter.
- **\`BottomTabBarProps\`:** lo importo de \`@react-navigation/bottom-tabs\` (el repo lo
  tomaba de \`expo-router/tabs\`). Usa el que compile en tu versión.

## Diseño de referencia

\`Novo Pharma Tienda.dc.html\` en este proyecto tiene las 8 pantallas, 6 estados vacíos
y 6 estados de carga, con tema claro/oscuro conmutable.
