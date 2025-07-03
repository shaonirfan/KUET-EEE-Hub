# KUET EEE Hub - Comprehensive API Documentation

This document provides comprehensive documentation for all public APIs, functions, and components in the KUET EEE Hub project.

## Table of Contents

1. [Project Overview](#project-overview)
2. [API Routes](#api-routes)
3. [React Components](#react-components)
4. [Custom Hooks](#custom-hooks)
5. [Types and Interfaces](#types-and-interfaces)
6. [Utility Functions](#utility-functions)
7. [Configuration](#configuration)

---

## Project Overview

KUET EEE Hub is a Next.js TypeScript application built with modern React patterns and Tailwind CSS. The project follows a component-based architecture with:

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** + **shadcn/ui** for styling
- **Radix UI** primitives
- **TanStack Query** for data fetching
- **Framer Motion** for animations

---

## API Routes

### Resources API

**Endpoint:** `GET /api/resources`

Fetches academic resources from Google Sheets.

```typescript
// Response Type
interface Resource {
  id: string;
  mimeType: string;
  webViewLink: string;
  year: string;
  semester: string;
  courseName: string;
  courseCode: string;
  category?: string;
  teacherName: string;
  type: string;
  tags: string[];
  name: string;
  downloadUrl: string;
}

// Usage Example
const fetchResources = async (): Promise<Resource[]> => {
  const response = await fetch('/api/resources');
  if (!response.ok) throw new Error('Failed to fetch resources');
  return response.json();
};
```

**Environment Variables Required:**
- `GOOGLE_RESOURCES_SHEET_ID`: Google Sheet ID containing resources
- `GOOGLE_CLIENT_EMAIL`: Service account email
- `GOOGLE_PRIVATE_KEY`: Service account private key

### Recordings API

**Endpoint:** `GET /api/recordings`

Fetches online class recordings metadata from Google Sheets.

```typescript
// Usage Example
const fetchRecordings = async () => {
  const response = await fetch('/api/recordings');
  return response.json();
};
```

**Environment Variables Required:**
- `GOOGLE_SHEET_ID`: Google Sheet ID containing recordings data
- `GOOGLE_CLIENT_EMAIL`: Service account email  
- `GOOGLE_PRIVATE_KEY`: Service account private key

### Chat API

**Endpoint:** `POST /api/chat`

Processes chat messages through n8n webhook integration.

```typescript
// Request Body
interface ChatRequest {
  message: string;
  chat_id?: string;
}

// Usage Example
const sendChatMessage = async (message: string, chatId?: string) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, chat_id: chatId })
  });
  return response.json();
};
```

**Environment Variables Required:**
- `N8N_WEBHOOK_URL`: Webhook URL for chat processing

---

## React Components

### UI Components (src/components/ui/)

#### Button

Versatile button component with multiple variants and sizes.

```tsx
import { Button } from "@/components/ui/button";

// Props Interface
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

// Usage Examples
<Button variant="default" size="lg">Primary Button</Button>
<Button variant="outline" size="sm">Secondary Button</Button>
<Button variant="ghost" size="icon">
  <IconComponent />
</Button>
```

#### Card

Flexible card container with multiple sub-components.

```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";

// Usage Example
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### ExpandableChat

Advanced chat interface with expandable functionality.

```tsx
import { 
  ExpandableChat, 
  ExpandableChatHeader, 
  ExpandableChatBody, 
  ExpandableChatFooter 
} from "@/components/ui/expandable-chat";

// Props Interface
interface ExpandableChatProps {
  position?: "bottom-right" | "bottom-left";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  icon?: React.ReactNode;
}

// Usage Example
<ExpandableChat position="bottom-right" size="md">
  <ExpandableChatHeader>
    <h3>Chat Assistant</h3>
  </ExpandableChatHeader>
  <ExpandableChatBody>
    {/* Chat messages */}
  </ExpandableChatBody>
  <ExpandableChatFooter>
    {/* Chat input */}
  </ExpandableChatFooter>
</ExpandableChat>
```

#### Complete UI Component List

All UI components are fully typed and include:

- **Input Controls:** `input`, `textarea`, `checkbox`, `radio-group`, `select`, `slider`, `switch`
- **Navigation:** `menubar`, `dropdown-menu`, `tabs`
- **Layout:** `card`, `separator`, `sheet`, `sidebar`, `scroll-area`
- **Feedback:** `alert`, `alert-dialog`, `toast`, `tooltip`, `progress`
- **Data Display:** `table`, `badge`, `avatar`, `skeleton`
- **Overlays:** `dialog`, `popover`, `accordion`
- **Media:** `LazyYouTube` (custom lazy loading YouTube component)
- **Effects:** `aurora-background`, `neon-gradient-card`

### Layout Components (src/components/layout/)

#### Header

```tsx
import { Header } from "@/components/layout/Header";

// Simple navigation header with theme toggle
<Header />
```

#### Footer

```tsx
import { Footer } from "@/components/layout/Footer";

// Footer with department information and links
<Footer />
```

### Section Components (src/components/sections/)

#### HeroSection

```tsx
import { HeroSection } from "@/components/sections/HeroSection";

// Main landing page hero section
<HeroSection />
```

#### AboutSection

```tsx
import { AboutSection } from "@/components/sections/AboutSection";

// Department information section
<AboutSection />
```

#### ResourcesSection

```tsx
import { ResourcesSection } from "@/components/sections/ResourcesSection";

// Interactive resources browser with search and filters
<ResourcesSection />
```

#### OnlineClassRecordingsSection

```tsx
import { OnlineClassRecordingsSection } from "@/components/sections/OnlineClassRecordingsSection";

// YouTube recordings gallery with lazy loading
<OnlineClassRecordingsSection />
```

#### ContactSection

```tsx
import { ContactSection } from "@/components/sections/ContactSection";

// Contact information and links
<ContactSection />
```

### Theme Components

#### ThemeProvider

```tsx
import { ThemeProvider } from "@/components/ThemeProvider";

// Wrap your app for theme functionality
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <App />
</ThemeProvider>
```

#### ThemeToggle

```tsx
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Theme switcher button
<ThemeToggle />
```

---

## Custom Hooks

### useToast

Manages toast notifications with full state management.

```tsx
import { useToast } from "@/hooks/use-toast";

// Hook Interface
interface UseToastReturn {
  toasts: ToasterToast[];
  toast: (props: Toast) => { id: string; dismiss: () => void; update: (props: ToasterToast) => void };
  dismiss: (toastId?: string) => void;
}

// Usage Example
const { toast, dismiss } = useToast();

// Show success toast
toast({
  title: "Success",
  description: "Operation completed successfully",
  variant: "default"
});

// Show error toast
toast({
  title: "Error", 
  description: "Something went wrong",
  variant: "destructive"
});

// Dismiss specific toast
const { id, dismiss: dismissToast } = toast({ title: "Auto-dismiss" });
setTimeout(dismissToast, 3000);
```

### useMobile

Detects mobile screen size using media queries.

```tsx
import { useMobile } from "@/hooks/use-mobile";

// Usage Example
const MyComponent = () => {
  const isMobile = useMobile();
  
  return (
    <div className={isMobile ? "mobile-layout" : "desktop-layout"}>
      {isMobile ? <MobileNavigation /> : <DesktopNavigation />}
    </div>
  );
};
```

---

## Types and Interfaces

### Resource Interface

```typescript
// src/types/resource.ts
export interface Resource {
  id: string;                 // Unique identifier
  mimeType: string;          // File MIME type
  webViewLink: string;       // Google Drive view link
  year: string;              // Academic year
  semester: string;          // Semester number
  courseName: string;        // Full course name
  courseCode: string;        // Course code (e.g., "EEE 2101")
  category?: string;         // Optional category
  teacherName: string;       // Instructor name
  type: string;              // Resource type (PDF, PPT, etc.)
  tags: string[];            // Searchable tags
  name: string;              // Display name
  downloadUrl: string;       // Direct download link
}
```

### Component Prop Types

```typescript
// Button variant types
type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

// Chat component types
type ChatPosition = "bottom-right" | "bottom-left";
type ChatSize = "sm" | "md" | "lg" | "xl" | "full";

// Toast types
interface ToastProps {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
}
```

---

## Utility Functions

### cn (Class Name Utility)

```tsx
import { cn } from "@/lib/utils";

// Combines clsx and tailwind-merge for optimal class handling
// Usage Examples
<div className={cn("base-classes", conditionalClass && "conditional-classes", className)} />

// Merging Tailwind classes safely
const buttonClass = cn(
  "px-4 py-2 rounded",
  variant === "primary" && "bg-blue-500 text-white",
  variant === "secondary" && "bg-gray-200 text-gray-800",
  disabled && "opacity-50 cursor-not-allowed"
);
```

---

## Configuration

### Environment Variables

Create a `.env.local` file with the following required variables:

```env
# Google Sheets API
GOOGLE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_CONTENT\n-----END PRIVATE KEY-----\n"
GOOGLE_RESOURCES_SHEET_ID=your_google_sheet_id_for_resources
GOOGLE_SHEET_ID=your_google_sheet_id_for_recordings

# Chat Integration
N8N_WEBHOOK_URL=your-chat-webhook-from-n8n
```

### Tailwind Configuration

```typescript
// tailwind.config.ts - Key customizations
const config = {
  theme: {
    extend: {
      colors: {
        primary: "#00B4D8",     // Bright cyan blue
        secondary: "#48CAE4",   // Sky blue  
        background: "#CAF0F8",  // Pale cyan blue (light mode)
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
};
```

### Package Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbopack -p 9002",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "genkit:dev": "genkit start -- tsx src/ai/dev.ts",
    "genkit:watch": "genkit start -- tsx --watch src/ai/dev.ts"
  }
}
```

---

## Best Practices

### Component Usage

1. **Always use TypeScript interfaces** for component props
2. **Leverage the cn utility** for conditional class names
3. **Use forwardRef** for components that need ref access
4. **Implement proper loading states** with Skeleton components
5. **Handle errors gracefully** with Toast notifications

### API Integration

1. **Use TanStack Query** for data fetching with caching
2. **Implement proper error boundaries** for API failures
3. **Add loading indicators** for async operations
4. **Type all API responses** with TypeScript interfaces

### Performance

1. **Use lazy loading** for heavy components (LazyYouTube)
2. **Implement virtualization** for large lists
3. **Optimize images** with Next.js Image component
4. **Use React.memo** for expensive re-renders

### Accessibility

1. **All interactive elements** have proper ARIA labels
2. **Color contrast** meets WCAG guidelines
3. **Keyboard navigation** is fully supported
4. **Screen reader compatibility** through semantic HTML

---

## Quick Start Examples

### Creating a New Page

```tsx
// src/app/new-page/page.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>New Page</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Page content goes here</p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}
```

### Adding a New API Route

```tsx
// src/app/api/new-endpoint/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Your API logic here
    const data = { message: "Hello World" };
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}
```

### Creating a Custom Component

```tsx
// src/components/ui/custom-component.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface CustomComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "accent";
  size?: "sm" | "md" | "lg";
}

const CustomComponent = React.forwardRef<HTMLDivElement, CustomComponentProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "base-styles",
          variant === "default" && "default-styles",
          variant === "accent" && "accent-styles",
          size === "sm" && "small-styles",
          size === "md" && "medium-styles", 
          size === "lg" && "large-styles",
          className
        )}
        {...props}
      />
    );
  }
);

CustomComponent.displayName = "CustomComponent";

export { CustomComponent };
```

---

This documentation covers all public APIs, components, hooks, and utility functions in the KUET EEE Hub project. Each section includes practical examples and best practices for implementation.