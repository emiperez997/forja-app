# Roadmap actualizado — Forja

Estado a la fecha: Fase 0, Fase 1 y Fase 2 completas.

---

## ✅ Fase 0 — Setup (completa)

- Backend Nest + Drizzle + Postgres (Neon en prod, Podman local en dev)
- Frontend Angular standalone + Tailwind
- Monorepo con pnpm workspaces

## ✅ Fase 1 — MVP core (completa)

- Auth (JWT, guard, interceptor)
- CRUD de `nodes` (carpetas y notas, jerarquía tipo Notion)
- Sidebar en árbol con crear/renombrar/eliminar/mover (drag & drop)
- Editor Tiptap básico con autoguardado (debounce)
- Modales propios (crear/renombrar y confirmación) en vez de diálogos nativos
- Fix de bug de sesión (estado que quedaba entre usuarios distintos)

## ✅ Fase 2 — Papelera, imágenes, búsqueda y formato (completa)

- [x] Papelera con borrado soft (schema, endpoints, vista, restaurar/eliminar definitivo)
- [x] Migración de emojis a íconos Lucide (árbol, menú contextual, sidebar, papelera)
- [x] Búsqueda por título (backend con `ILIKE` + barra en el sidebar)
- [x] Subida de imágenes al editor (Cloudinary en vez de R2 — botón, drag&drop y paste)
- [x] Resaltado de texto (extensión `Highlight` de Tiptap)
- [x] Formato tipo Notion: encabezados, listas, citas — con atajos de Markdown (ya los trae `StarterKit`) y mini-toolbar (`BubbleMenu` de Tiptap) al seleccionar texto

### Pendiente de pulido, sin bloquear el uso diario

- [ ] Menú tipo "slash command" (`/` para elegir bloque), como agregado al menú de selección que ya existe
- [ ] Reordenar notas/carpetas dentro de un mismo nivel (hoy el orden es el de inserción)

---

## Fase 3 — Export y organización avanzada

- [ ] Export de una nota a PDF (Puppeteer del lado del backend, generando desde el HTML renderizado)
- [ ] Tags o etiquetas cruzadas, además de la jerarquía de carpetas
- [ ] Búsqueda de contenido completo (no solo título) — columna `search_text` + `tsvector`/`to_tsquery` de Postgres
- [ ] Deploy real: backend a Railway, frontend a Vercel (quedó pendiente desde Fase 0 a propósito)

## Fase 4 — SaaS / IA / suscripciones

- [ ] Integración con API de Leonardo (u otro proveedor) para generar imágenes desde el editor
- [ ] Sistema de créditos por plan (gratis vs pago)
- [ ] Stripe: Checkout + Billing Portal
- [ ] Multi-tenancy simple (1 usuario = sus datos, sin equipos/orgs)
- [ ] Estados de suscripción (trial, cancelado, pago fallido) — la parte que suele llevar más tiempo del esperado, incluso con Stripe

---

## Notas generales

- El nombre del proyecto quedó como **Forja**.
- Paleta: crema (`#FAF6F0`), tinta (`#2B2622`), terracota (`#C1633D`), salvia (`#7A8B6F`).
- Stack: NestJS + Drizzle + Postgres (backend), Angular standalone + Tailwind (frontend), pnpm workspaces (monorepo).
