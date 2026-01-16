# PrettyFall

A lightweight waterfall / grid layout library with framework wrappers for React, Vue and Angular.

PrettyFall is a small, configurable layout engine that works with plain DOM elements and also provides framework adapters located in `src/wrappers` for easy integration with popular front-end frameworks.

**Features**
- Supports fluid (auto column count) and fixed-column layouts
- Customizable item creation, move and container-scaling callbacks
- Minimal footprint and only depends on `get-size`
- Includes a simple `ImageLoader` helper for loading images
- Framework wrappers for React, Vue and Angular in `src/wrappers`

## Installation

- From npm (if published):

  ```bash
  npm install prettyfall
  # or
  yarn add prettyfall
  ```

- Local development / build:

  ```powershell
  npm install
  npm run build
  npm start    # starts demo using sirv
  ```

## Quickstart (Browser / UMD)

Include the UMD bundle (`dist/prettyfall.umd.js`) which exposes `PrettyFall` and `ImageLoader` on `window`:

```html
<script src="dist/prettyfall.umd.js"></script>
<script>
  const pf = new PrettyFall({
    container: '.grid-wrapper',
    itemsSelector: '.grid-item',
    numberOfColumns: 3,
    isFluid: false
  });

  pf.initialize();

  // append an item (the default createItem uses fields like animename, imgpath, description)
  pf.append({ animename: 'Example', imgpath: '/images/foo.jpg', description: 'A short description' });
</script>
```

## ESM / Module Usage

```js
import PrettyFall, { ImageLoader } from 'prettyfall';

const pf = new PrettyFall({ container: '#grid', itemsSelector: '#grid .grid-item' });
pf.initialize();

// Preload an image and append when ready
const loader = new ImageLoader();
loader.get('/path/to/img.jpg', (props) => {
  // props: { url, height, width, ratio }
  pf.append({ animename: 'Name', imgpath: props.url, description: '...' });
});
```

## Main API & Options

The constructor accepts a configuration object. Common options include:

- `container` (string, required) — container selector (e.g. `#grid` or `.grid-wrapper`).
- `itemsSelector` (string, required) — item selector (e.g. `.grid-item`).
- `boundary` — measurement boundary (default: `window`).
- `createItem(data)` — function that returns a DOM node for given data (a default is provided).
- `isFluid` (boolean) — if true, column count is computed from item width and container width.
- `layout` (string) — layout algorithm; default is `'ordinal'` (also `'optimized'` available).
- `numberOfColumns` (number) — fixed column count when `isFluid` is false.
- `resizeDebounceDelay` (number) — debounce delay in ms for window resize handling.
- `moveItem(item, left, top, callback)` — custom item positioning (default sets `left` and `top`).
- `scaleContainer(container, width, height, callback)` — custom container sizing.

Common methods:

- `initialize()` — initialize layout and attach `resize` handler.
- `append(data, callback)` — create and append a new item using `createItem(data)` then layout.
- `restack()` — recompute column count and re-layout.
- `reset()` — reset internal state and rebuild.

## Framework Wrappers

- Vue: `src/wrappers/vue/PrettyFallVue.js` exports a `PrettyFallGrid` component that accepts `items` and `options` props.
- React: `src/wrappers/react/PrettyFallReact.jsx` exports a `PrettyFallReact` function component that accepts `items` and `options`.
- Angular: `src/wrappers/angular/angular-PrettyFall.js` includes an `ngPrettyFall` directive example.

Each wrapper creates a `PrettyFall` instance on mount and injects provided `items` via `append`.

## Example (Vue)

```html
<!-- In a Vue component template -->
<PrettyFallGrid :items="list" :options="{ itemsSelector: '.grid-item' }" />
```

## Development & Demo

- Source is in `src/`, the library entry is `src/PrettyFall.js` (exports core class and `ImageLoader`).
- To run the demo locally:

```powershell
npm install
npm start
# open http://localhost:5000 to view the demo (sirv default)
```

## Contributing

- PRs and issues are welcome. Please run `npm run build` before submitting changes and add/update demo examples under `demo/` when relevant.

## License

- This project is licensed under the MIT License (see `LICENSE`).

---
