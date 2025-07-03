# Component Catalogue

This guide groups **reusable React components** shipped with the project. You'll find prop-tables, visual examples, and links to source files for further reading.

> Components follow the [shadcn/ui](https://ui.shadcn.com) philosophy – composable primitives with sensible defaults. All paths are relative to `src/components`.

---

## 1. Layout

| Component | Source | Purpose |
|-----------|--------|---------|
| `Header`  | `layout/Header.tsx` | Sticky top navigation bar. Includes theme toggle and mobile menu. |
| `Footer`  | `layout/Footer.tsx` | Simple bottom area with copyright and links. |
| `ThemeProvider` | `ThemeProvider.tsx` | Wraps `next-themes` to provide dark / light mode. Must be mounted close to `<html>`. |

### Example Usage

```tsx
import { ThemeProvider } from "@/components/ThemeProvider"

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

## 2. Sections (Domain-Specific)

### `ResourcesSection`
* Located at **`sections/ResourcesSection.tsx`** – filterable grid of Drive files.
* Fetches data from **`/api/resources`** on mount.
* Combines `Tabs`, `Select`, and search `<Input>` for a rich UX.

```tsx
// pages/index.tsx (excerpt)
<section>
  <ResourcesSection />
</section>
```

### `OnlineClassRecordingsSection`
* Located at **`sections/OnlineClassRecordingsSection.tsx`** – YouTube playlist with lazy-loading thumbnails.
* Data source: **`/api/recordings`**.

### `ExpandableChatDemo`
* Showcase wrapper around `ExpandableChat` (see **UI «Chat»** below). Provides an end-to-end demo of the AI assistant.

---

## 3. UI Primitives (shadcn clones)

These live in **`ui/`** and mirror the API of their shadcn counterparts. Only noteworthy deviations are mentioned.

| Component | Notes |
|-----------|-------|
| `Button`  | Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`. Sizes: `default`, `sm`, `lg`, `icon`. |
| `Card`    | Wrapper with `CardHeader`, `CardContent`, `CardFooter`. |
| `Dialog`, `Sheet`, `Popover`, `Tabs`, `Select`, `DropdownMenu`, `Accordion`, `Tooltip`, `Table`, `Slider`, … | Behaviour identical to shadcn docs. |
| `Progress`, `Skeleton`, `Switch`, `Textarea`, `Input`, `Badge`, `Avatar`, `Menubar`, `Alert`, `AlertDialog` | – |

Refer to [shadcn/ui docs](https://ui.shadcn.com/docs/components) for full prop lists. The implementation here is copy-on-write so you can extend styling freely.

---

## 4. UI – Chat System

| Component | Role |
|-----------|------|
| `ExpandableChat` | Collapsible container (`position="bottom-right"`, sizes `sm|md|lg`). |
| `ChatMessageList` | Simple `<ul>` wrapper with auto-layout. |
| `ChatBubble` & friends | `ChatBubbleAvatar`, `ChatBubbleMessage` – styled message units supporting "sent" / "received" variants and loading skeleton. |
| `ChatInput` | Textarea with auto-height. |

### Minimal Chat Example

```tsx
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/expandable-chat"
import { ChatInput } from "@/components/ui/chat-input"
import { ChatMessageList } from "@/components/ui/chat-message-list"
import { useChat } from "@/components/hooks/use-chat"

export default function AssistantWidget() {
  const { messages, isLoading, sendMessage } = useChat()

  return (
    <ExpandableChat position="bottom-right">
      <ExpandableChatHeader>Ask me anything 👋</ExpandableChatHeader>
      <ExpandableChatBody>
        <ChatMessageList>
          {messages.map(m => <div key={m.id}>{m.content}</div>)}
          {isLoading && <div>Thinking…</div>}
        </ChatMessageList>
      </ExpandableChatBody>
      <ExpandableChatFooter>
        <ChatInput onSubmit={sendMessage} placeholder="Type your question…" />
      </ExpandableChatFooter>
    </ExpandableChat>
  )
}
```

---

## 5. UI – Visual Flair

### `NeonGradientCard`

> **Path:** `ui/neon-gradient-card.tsx`

A wrapper that adds an animated neon border using CSS custom properties.

```tsx
import { NeonGradientCard } from "@/components/ui/neon-gradient-card"

<NeonGradientCard
  borderRadius={12}
  neonColors={{ firstColor: "#00B4D8", secondColor: "#48CAE4" }}
>
  <h3 className="text-lg">Digital Signal Processing Notes</h3>
</NeonGradientCard>
```

| Prop          | Type            | Default | Description |
|---------------|-----------------|---------|-------------|
| `children`    | `ReactNode`     | –       | Card body   |
| `borderSize`  | `number`        | `2`     | Border width in `px` |
| `borderRadius`| `number`        | `20`    | Rounds outer & inner container |
| `neonColors`  | `{ firstColor: string; secondColor: string }` | Pink/Teal | Gradient endpoints |

---

## 6. Icons & Theme Toggle

* **`theme-toggle.tsx`** – small button that switches between `light` / `dark` / `system` modes.
* All icons come from **lucide-react** and are tree-shaken – import only what you need: `import { Book, Play } from "lucide-react"`.

---

> Looking for something else? Search the codebase `src/components/ui` to discover additional primitives. Each file is fully typed and contains inline JSDoc for quick IDE hover docs.