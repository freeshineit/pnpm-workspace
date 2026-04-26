# @ak2021/web-components

A lightweight Web Components package that provides reusable UI elements:

- `wc-button`
- `wc-picker`
- `wc-popover`

## Install

```bash
pnpm add @ak2021/web-components
```

## Quick Start

Import once to register all custom elements:

```ts
import "@ak2021/web-components";
```

If you need styles from the package output:

```html
<link rel="stylesheet" href="./dist/style/css.css" />
```

## Components

### wc-button

A simple button wrapper based on Shadow DOM.

```html
<wc-button>Button</wc-button>
```

### wc-picker

A picker/pop layer component powered by `@skax/picker`.

```html
<wc-picker trigger="click" placement="bottom" content='<div style="padding: 12px; background: #fff;">Picker Content</div>'>
  <button>Open Picker</button>
</wc-picker>
```

Supported attributes:

- `content`: HTML string displayed in the picker
- `trigger`: `click` | `hover` (default: `click`)
- `placement`: `top` | `tl` | `tr` | `bottom` | `bl` | `br` (default: `bottom`)
- `open`: controlled open state (`true`/presence means open)
- `disabled`: disable interactions
- `mobile`: enable mobile mode

### wc-popover

A popover menu component with list data.

```html
<wc-popover
  list='[
    {"value": 1, "label": "1x"},
    {"value": 2, "label": "2x"}
  ]'
  open="true">
  <wc-button>Click Me</wc-button>
</wc-popover>
```

Supported attributes:

- `list`: JSON string array, e.g. `[{"label":"A","value":"a"}]`
- `open`: controlled visible state (`true`/presence means visible)

## Development

```bash
pnpm --filter @ak2021/web-components dev
```

## Build

```bash
pnpm --filter @ak2021/web-components build
```
