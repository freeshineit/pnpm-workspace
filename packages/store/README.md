# @ak2021/store

A tiny event-based store utility for lightweight state and message flow.

## Install

```bash
pnpm add @ak2021/store
```

## Quick Start

```ts
import Store from "@ak2021/store";

const store = new Store({ id: "app-store" });

store.on("user:login", (payload) => {
  console.log("login event", payload);
});

store.emit("user:login", { id: 1, name: "Alice" });
```

## API

### StoreOptions

```ts
interface StoreOptions {
  id?: string;
}
```

### EventListener

```ts
type EventListener<T = any> = (data: T) => void;
```

### new Store(options?)

Creates a new store instance.

```ts
const store = new Store({ id: "my-store" });
```

### on(type, fn)

Subscribe to an event.

```ts
store.on("count:change", (value: number) => {
  console.log(value);
});
```

### once(type, fn)

Subscribe to an event for a single trigger.

```ts
store.once("ready", () => {
  console.log("ready only once");
});
```

### off(type, fn?)

Unsubscribe listener(s).

```ts
const onChange = (value: number) => console.log(value);

store.on("count:change", onChange);
store.off("count:change", onChange); // remove one listener
store.off("count:change"); // remove all listeners of this event type
```

### emit(type, data?)

Emit an event with optional payload.

```ts
store.emit("count:change", 10);
```

## Chaining

All event methods return the current store instance, so chaining is supported.

```ts
store
  .on("start", () => {})
  .once("finish", () => {})
  .emit("start")
  .emit("finish");
```

## TypeScript Example

```ts
type User = { id: number; name: string };

const store = new Store();

store.on<User>("user:update", (user) => {
  console.log(user.name);
});

store.emit<User>("user:update", { id: 1, name: "Bob" });
```

## Development

```bash
pnpm --filter @ak2021/store dev
```

## Build

```bash
pnpm --filter @ak2021/store build
```
