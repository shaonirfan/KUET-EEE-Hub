# Custom React Hooks

All hooks are written in TypeScript and live in **`/src/hooks`** or **`/src/components/hooks`**. They follow React's convention of being **client-side only** (i.e. they must be used inside a `"use client"` component).

---

## `useIsMobile()`

Detect whether the viewport is currently below the **mobile breakpoint** (default `768px`). Internally it listens to a `matchMedia` query and re-evaluates on resize.

```ts
import { useIsMobile } from "@/hooks/use-mobile"

export const Example = () => {
  const isMobile = useIsMobile()

  return <span>{isMobile ? "📱 Mobile" : "🖥️ Desktop"}</span>
}
```

Return value | Type | Description
-------------|------|------------
`boolean`    | `boolean` | `true` if `window.innerWidth < 768`.

---

## `useToast()`

Global toast state manager inspired by **react-hot-toast** but with no external dependency. Pairs with the `Toast` / `Toaster` components under `src/components/ui`.

```ts
"use client"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

export default function Demo() {
  const { toast } = useToast()

  return (
    <>
      <button
        onClick={() => toast({
          title: "Saved!",
          description: "Your profile has been updated.",
        })}
      >
        Show Toast
      </button>
      {/* Mount once at the root of your app */}
      <Toaster />
    </>
  )
}
```

### API

`const { toast, dismiss, toasts } = useToast()`

* **`toast(options)`** – Adds a new toast. Returns `{ id, dismiss, update }`.
* **`dismiss(id?)`** – Programmatically hide a toast (or all if `id` omitted).
* **`toasts`** – Current toast array for advanced use-cases.

---

## `useAutoScroll(opts?)`

Automatic "stick-to-bottom" behaviour for chat windows / logs. You get a `ref` that should be attached to the **scrollable container**.

```ts
import { useAutoScroll } from "@/components/hooks/use-auto-scroll"

export const ChatLog = ({ messages }) => {
  const { scrollRef, disableAutoScroll, isAtBottom } = useAutoScroll({
    offset: 20,   // px tolerance – optional
    smooth: true, // smooth scroll – optional
    content: messages, // re-evaluate when messages change
  })

  return (
    <div
      ref={scrollRef}
      onWheel={disableAutoScroll} // user scrolled – stop auto mode
      className="overflow-y-auto h-96"
    >
      {messages.map(m => <p key={m.id}>{m.text}</p>)}
      {!isAtBottom && <button onClick={() => scrollToBottom()}>Scroll ↓</button>}
    </div>
  )
}
```

### Return Value

| Field               | Type                          | Description                                    |
|---------------------|-------------------------------|------------------------------------------------|
| `scrollRef`         | `RefObject<HTMLDivElement>`   | Attach to the container you want to auto-scroll|
| `isAtBottom`        | `boolean`                     | `true` if the user is scrolled to bottom       |
| `autoScrollEnabled` | `boolean`                     | Internal flag                                  |
| `scrollToBottom()`  | `() => void`                  | Imperatively scroll to bottom                  |
| `disableAutoScroll` | `() => void`                  | Disable auto mode when user interacts         |

---

## `useChat()`

High-level abstraction for interacting with **`/api/chat`**.

```ts
import { useChat } from "@/components/hooks/use-chat"

export default function Assistant() {
  const { messages, isLoading, sendMessage } = useChat()

  return (
    <div>
      {messages.map(m => <p key={m.id}>{m.content}</p>)}
      <button onClick={() => sendMessage("Hello!")}>Send</button>
      {isLoading && <p>Thinking…</p>}
    </div>
  )
}
```

### Return Value

| Field          | Type              | Description                         |
|----------------|-------------------|-------------------------------------|
| `messages`     | `Message[]`       | Conversation ordered oldest → newest|
| `isLoading`    | `boolean`         | `true` while awaiting API response  |
| `sendMessage`  | `(text) => Promise<void>` | Helper that adds user message, hits API, appends AI reply |

---

> New hooks should live next to the features that own them (domain-driven design). Keep them small and composable! 🎣