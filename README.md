# OSI-Viz

A beautiful, scroll-driven visualization of the **TCP/IP network encapsulation**
process. As you scroll, a rectangle representing your data is built up layer by
layer — each layer wraps the previous one in its own header (and, at the data-link
layer, a trailer), with the newly-added part highlighted and the previous bundle
nested inside as the payload.

**Data → Segment → Packet → Frame → Bits**

Hover (or keyboard-tab through) any header field of the current layer to read a
detailed explanation of what that field does, shown directly under the data
rectangle.

## Stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Framer Motion](https://www.framer.com/motion/) for scroll-linked animation

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## How it works

- `src/data/layers.js` — the single source of truth: every layer, its header/trailer
  fields, example values, and hover explanations.
- `src/components/EncapsulationStage.jsx` — a tall scroll track with a pinned (sticky)
  stage; scroll progress is mapped to the active layer.
- `src/components/PacketAssembly.jsx` — recursively renders the concentric
  encapsulation boxes (outermost box = current layer, inner boxes = wrapped payload).
- `src/components/FieldDetail.jsx` — the explanation panel under the rectangle.

The site is a static front-end with no backend — the `dist/` output deploys to any
static host. It respects `prefers-reduced-motion`.
