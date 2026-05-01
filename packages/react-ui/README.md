# @ak2021/react-ui

A lightweight React UI package with basic components:

- Button
- Input

It also re-exports `Picker` from `@skax/picker`.

## Install

```bash
pnpm add @ak2021/react-ui react clsx
```

## Quick Start

```tsx
import React from "react";
import { Button, Input } from "@ak2021/react-ui";
import "@ak2021/react-ui/dist/style"; // or import "@ak2021/react-ui/dist/style/style.js"

export default function App() {
  return (
    <div>
      <Button type="primary">Submit</Button>
      <Input placeholder="Type something" />
    </div>
  );
}
```

## Exports

```ts
import { Button, Input, Picker } from "@ak2021/react-ui";
```

## Button

```tsx
import { Button } from "@ak2021/react-ui";

export default function Demo() {
  return (
    <>
      <Button>Default</Button>
      <Button type="primary" size="small">
        Primary Small
      </Button>
      <Button size="large" htmlType="submit">
        Submit
      </Button>
      <Button disabled>Disabled</Button>
    </>
  );
}
```

Button props:

- `children?: React.ReactNode`
- `className?: string`
- `style?: React.CSSProperties`
- `type?: "primary"`
- `size?: "small" | "middle" | "large"`
- `disabled?: boolean`
- `htmlType?: "button" | "submit" | "reset"`
- `onClick?: React.MouseEventHandler<HTMLButtonElement>`

## Input

```tsx
import React from "react";
import { Input } from "@ak2021/react-ui";

export default function Demo() {
  const [value, setValue] = React.useState("");

  return <Input value={value} placeholder="Email" type="email" size="middle" maxLength={100} onChange={(e) => setValue(e.target.value)} onPressEnter={() => console.log("Enter pressed")} />;
}
```

Input props:

- `value?: string`
- `defaultValue?: string`
- `placeholder?: string`
- `disabled?: boolean`
- `size?: "small" | "middle" | "large"`
- `className?: string`
- `style?: React.CSSProperties`
- `maxLength?: number`
- `type?: "text" | "password" | "email" | "number" | "tel" | "url" | "search"`
- `onChange?: React.ChangeEventHandler<HTMLInputElement>`
- `onFocus?: React.FocusEventHandler<HTMLInputElement>`
- `onBlur?: React.FocusEventHandler<HTMLInputElement>`
- `onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>`
- `onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>`

## Development

```bash
pnpm --filter @ak2021/react-ui dev
```

## Build

```bash
pnpm --filter @ak2021/react-ui build
```
