# 📋 Instrucciones de Integración - Diseño Nura Beauty Style

## ✅ Componentes Creados

### 1. **Componentes Reutilizables Base**

#### `IconButton.tsx`
- **Ubicación**: `src/components/IconButton.tsx`
- **Uso**: Botón con icono, soporta badge numérico
- **Props**:
  - `icon`: ReactNode (SVG o icono)
  - `onClick?`: función
  - `badge?`: número para mostrar contador
  - `ariaLabel`: string (accesibilidad)
  - `className?`: clases adicionales

#### `Modal.tsx`
- **Ubicación**: `src/components/Modal.tsx`
- **Uso**: Modal reutilizable con overlay y animaciones
- **Props**:
  - `isOpen`: boolean
  - `onClose`: función
  - `children`: ReactNode
  - `title?`: string opcional

#### `LoginModal.tsx`
- **Ubicación**: `src/components/LoginModal.tsx`
- **Uso**: Modal específico para login (usa Modal base)
- **Props**:
  - `isOpen`: boolean
  - `onClose`: función

#### `HamburgerMenu.tsx`
- **Ubicación**: `src/components/HamburgerMenu.tsx`
- **Uso**: Menú lateral para mobile
- **Props**:
  - `links?`: Array<{href: string, label: string}>

---

### 2. **Componentes de Layout**

#### `Header.tsx` (Actualizado)
- **Ubicación**: `src/components/Header.tsx`
- **Cambios**:
  - Ahora usa TailwindCSS
  - Integra IconButton, LoginModal, HamburgerMenu
  - Logo con estilo serif/script
  - Iconos de carrito, perfil y hamburguesa

#### `Hero.tsx` (Nuevo)
- **Ubicación**: `src/components/Hero.tsx`
- **Uso**: Sección hero con gradiente rosa, título y CTA
- **No requiere props**

#### `Footer.tsx` (Nuevo)
- **Ubicación**: `src/components/Footer.tsx`
- **Uso**: Footer con 3 columnas (info, links, redes)
- **No requiere props**

---

### 3. **Componentes de Productos**

#### `ProductGrid.tsx` (Nuevo)
- **Ubicación**: `src/components/ProductGrid.tsx`
- **Uso**: Grid responsivo con paginación
- **Props**:
  - `products`: Product[]
  - `itemsPerPage?`: number (default: 8)

#### `Pagination.tsx` (Nuevo)
- **Ubicación**: `src/components/Pagination.tsx`
- **Uso**: Paginación con botones prev/next y números
- **Props**:
  - `currentPage`: number
  - `totalPages`: number
  - `onPageChange`: (page: number) => void

#### `ProductCard.tsx` (Sin cambios)
- **Ubicación**: `src/components/ProductCard.tsx`
- **Nota**: Mantiene su estructura actual con CSS modules
- **Sugerencia**: Puedes mantenerlo así o migrarlo a TailwindCSS más adelante

---

## 🎨 Configuración TailwindCSS

### Archivo: `tailwind.config.ts`

Ya está creado con:
- Colores personalizados (pink, cream, purple)
- Fuentes (serif, script)
- Sombras personalizadas (soft, medium, large)
- Border radius (elegant, soft)

### Clases Tailwind Personalizadas Disponibles:

```typescript
// Colores
bg-pink-200, bg-pink-50, text-pink-500, etc.
bg-cream-50, bg-purple-50

// Sombras
shadow-soft, shadow-medium, shadow-large

// Border radius
rounded-elegant (20px), rounded-soft (14px)

// Fuentes
font-serif, font-script
```

---

## 📝 Archivos Modificados

### 1. `src/app/page.tsx`
- **Cambios**:
  - Importa `Hero` y `ProductGrid`
  - Estructura: Hero → ProductGrid
  - Usa TailwindCSS para contenedores

### 2. `src/app/layout.tsx`
- **Cambios**:
  - Agregado `Footer` al final

### 3. `src/app/globals.css`
- **Sin cambios necesarios** (ya tiene Tailwind importado)

---

## 🚀 Pasos de Integración

### Paso 1: Verificar TailwindCSS
Asegúrate de que TailwindCSS esté funcionando:
```bash
npm run dev
```

### Paso 2: Verificar Componentes
Todos los componentes están en `src/components/`:
- ✅ IconButton.tsx
- ✅ Modal.tsx
- ✅ LoginModal.tsx
- ✅ HamburgerMenu.tsx
- ✅ Header.tsx (actualizado)
- ✅ Hero.tsx
- ✅ Footer.tsx
- ✅ ProductGrid.tsx
- ✅ Pagination.tsx

### Paso 3: Verificar Páginas
- ✅ `src/app/page.tsx` (actualizado con Hero y ProductGrid)
- ✅ `src/app/layout.tsx` (actualizado con Footer)

### Paso 4: Probar Funcionalidad

1. **Header**:
   - Click en icono de perfil → abre LoginModal
   - Click en hamburguesa (mobile) → abre menú lateral
   - Click en carrito → va a `/cart`

2. **Hero**:
   - Botón "Shop the Collection" → scroll a productos

3. **ProductGrid**:
   - Muestra productos en grid responsivo
   - Paginación funcional

4. **Footer**:
   - Links funcionales
   - Iconos de redes sociales

---

## 🎯 Responsive Breakpoints

El diseño usa los breakpoints estándar de Tailwind:
- **Mobile**: `< 640px` (1 columna)
- **Tablet**: `640px - 1024px` (2 columnas)
- **Desktop**: `> 1024px` (4 columnas)

---

## 🔧 Personalización

### Cambiar Colores
Edita `tailwind.config.ts`:
```typescript
colors: {
  'pink': {
    '200': '#FDE8EE',  // Cambia este valor
    // ...
  }
}
```

### Cambiar Textos del Hero
Edita `src/components/Hero.tsx`:
```typescript
<h1>Beauty that Begins with You</h1>
<p>Premium skincare designed...</p>
```

### Cambiar Links del Footer
Edita `src/components/Footer.tsx`:
```typescript
<Link href="/about">About</Link>
// Agrega más links según necesites
```

---

## 📱 Funcionalidades TypeScript

### Modal
- ✅ Cierra con ESC
- ✅ Previene scroll del body cuando está abierto
- ✅ Overlay clickeable para cerrar
- ✅ Accesible (aria-*)

### HamburgerMenu
- ✅ Solo visible en mobile (`md:hidden`)
- ✅ Panel lateral desde la derecha
- ✅ Cierra con ESC
- ✅ Previene scroll cuando está abierto

### Pagination
- ✅ Lógica de ellipsis automática
- ✅ Estados disabled para prev/next
- ✅ Accesible (aria-*, roles)
- ✅ Scroll suave al cambiar página

---

## ⚠️ Notas Importantes

1. **ProductCard**: Mantiene su CSS module actual. Si quieres migrarlo a TailwindCSS, puedes hacerlo después sin afectar la funcionalidad.

2. **NextAuth**: El LoginModal usa `signIn` de NextAuth. Asegúrate de tener configurado NextAuth correctamente.

3. **Responsive**: El menú hamburguesa solo aparece en mobile. En desktop, los iconos están siempre visibles.

4. **Accesibilidad**: Todos los componentes incluyen:
   - `aria-label`
   - `aria-expanded` (donde aplica)
   - `role` attributes
   - Navegación por teclado (ESC para cerrar modales)

---

## 🎨 Estilo Visual

El diseño sigue la estética de Nura Beauty:
- **Colores**: Rosados pastel (#FDE8EE, #F3E8FF)
- **Tipografía**: Serif para títulos, sans-serif para body
- **Sombras**: Suaves y sutiles
- **Bordes**: Redondeados (14px, 20px)
- **Espaciado**: Generoso y respirable

---

## ✅ Checklist Final

- [x] TailwindCSS configurado
- [x] Componentes reutilizables creados
- [x] Header actualizado con TailwindCSS
- [x] Hero creado
- [x] ProductGrid con paginación
- [x] Footer creado
- [x] Modal de login funcional
- [x] Menú hamburguesa responsivo
- [x] page.tsx actualizado
- [x] layout.tsx actualizado
- [x] Sin errores de linting

---

## 🚀 Listo para Usar

Todo está integrado y funcionando. Solo ejecuta:
```bash
npm run dev
```

Y visita `http://localhost:3000` para ver el nuevo diseño.

