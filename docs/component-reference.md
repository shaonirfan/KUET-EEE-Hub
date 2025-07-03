# Component Reference Guide

This reference provides detailed documentation for every component in the KUET EEE Hub project, including complete prop interfaces, usage examples, and implementation details.

## Table of Contents

1. [UI Components](#ui-components)
2. [Layout Components](#layout-components)
3. [Section Components](#section-components)
4. [Theme Components](#theme-components)
5. [Chat Components](#chat-components)
6. [Advanced Components](#advanced-components)

---

## UI Components

### Button Component

**File:** `src/components/ui/button.tsx`

A flexible button component built on Radix UI primitives with multiple variants and sizes.

#### Props Interface

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
  className?: string;
}
```

#### Variants

- **default**: Primary button with filled background
- **destructive**: Red button for destructive actions
- **outline**: Button with border and transparent background
- **secondary**: Muted button for secondary actions
- **ghost**: Minimal button with hover effect
- **link**: Text link styled as button

#### Sizes

- **default**: Standard button size (h-10 px-4 py-2)
- **sm**: Small button (h-9 px-3)
- **lg**: Large button (h-11 px-8)
- **icon**: Square button for icons (h-10 w-10)

#### Usage Examples

```tsx
import { Button } from "@/components/ui/button";
import { Download, Trash2, Plus } from "lucide-react";

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Subtle action</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Plus className="h-4 w-4" /></Button>

// With icons
<Button>
  <Download className="mr-2 h-4 w-4" />
  Download
</Button>

// As child (renders button content in different element)
<Button asChild>
  <a href="/download">Download Link</a>
</Button>

// Event handling
<Button 
  onClick={() => console.log('Clicked')}
  disabled={isLoading}
>
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
```

---

### Card Components

**File:** `src/components/ui/card.tsx`

A flexible card container with multiple sub-components for structured content display.

#### Components

- **Card**: Main container
- **CardHeader**: Header section with padding
- **CardTitle**: Title text with styling
- **CardDescription**: Subtitle/description text
- **CardContent**: Main content area
- **CardFooter**: Footer section for actions

#### Props Interface

```typescript
// All card components extend HTMLDivElement
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
```

#### Usage Examples

```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Basic card
<Card>
  <CardContent>
    <p>Simple card content</p>
  </CardContent>
</Card>

// Full featured card
<Card className="w-full max-w-md">
  <CardHeader>
    <CardTitle>Course Material</CardTitle>
    <CardDescription>EEE 2101 - Circuit Analysis</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Comprehensive notes covering Kirchhoff's laws, node analysis, and mesh analysis techniques.</p>
    <div className="flex gap-2 mt-4">
      <span className="text-xs bg-secondary px-2 py-1 rounded">PDF</span>
      <span className="text-xs bg-secondary px-2 py-1 rounded">Notes</span>
    </div>
  </CardContent>
  <CardFooter className="flex gap-2">
    <Button variant="outline" size="sm">Preview</Button>
    <Button size="sm">Download</Button>
  </CardFooter>
</Card>

// Card grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {resources.map((resource) => (
    <Card key={resource.id}>
      <CardHeader>
        <CardTitle className="text-lg">{resource.name}</CardTitle>
        <CardDescription>{resource.courseCode}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {resource.teacherName}
        </p>
      </CardContent>
    </Card>
  ))}
</div>
```

---

### Input Components

**File:** `src/components/ui/input.tsx`

Standard input field with consistent styling.

#### Props Interface

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}
```

#### Usage Examples

```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

// Basic input
<Input placeholder="Enter text..." />

// With label
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email" 
    type="email" 
    placeholder="your@email.com" 
    required 
  />
</div>

// Search input with icon
<div className="relative">
  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
  <Input 
    placeholder="Search resources..." 
    className="pl-10"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>

// Controlled input with validation
<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
  className={cn(
    "transition-colors",
    error && "border-destructive focus-visible:ring-destructive"
  )}
  placeholder="Required field"
  aria-invalid={!!error}
  aria-describedby={error ? "error-message" : undefined}
/>
```

---

### Select Components

**File:** `src/components/ui/select.tsx`

Dropdown select component built on Radix UI.

#### Components

- **Select**: Root container
- **SelectTrigger**: Click target
- **SelectValue**: Display selected value
- **SelectContent**: Dropdown content
- **SelectItem**: Individual option
- **SelectLabel**: Group label
- **SelectSeparator**: Visual separator

#### Usage Examples

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Basic select
<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>

// Controlled select with state
<Select value={selectedYear} onValueChange={setSelectedYear}>
  <SelectTrigger>
    <SelectValue placeholder="Select year" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Years</SelectItem>
    <SelectItem value="1st">1st Year</SelectItem>
    <SelectItem value="2nd">2nd Year</SelectItem>
    <SelectItem value="3rd">3rd Year</SelectItem>
    <SelectItem value="4th">4th Year</SelectItem>
  </SelectContent>
</Select>

// Multiple selects in filter layout
<div className="flex flex-wrap gap-4">
  <Select value={filters.year} onValueChange={(value) => 
    setFilters(prev => ({ ...prev, year: value }))
  }>
    <SelectTrigger className="w-32">
      <SelectValue placeholder="Year" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All</SelectItem>
      {years.map(year => (
        <SelectItem key={year} value={year}>{year}</SelectItem>
      ))}
    </SelectContent>
  </Select>
  
  <Select value={filters.semester} onValueChange={(value) => 
    setFilters(prev => ({ ...prev, semester: value }))
  }>
    <SelectTrigger className="w-32">
      <SelectValue placeholder="Semester" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All</SelectItem>
      <SelectItem value="1st">1st Sem</SelectItem>
      <SelectItem value="2nd">2nd Sem</SelectItem>
    </SelectContent>
  </Select>
</div>
```

---

### Dialog Components

**File:** `src/components/ui/dialog.tsx`

Modal dialog component for overlays and forms.

#### Components

- **Dialog**: Root container
- **DialogTrigger**: Opens dialog
- **DialogContent**: Main content area
- **DialogHeader**: Header section
- **DialogTitle**: Dialog title
- **DialogDescription**: Description text
- **DialogFooter**: Footer for actions

#### Usage Examples

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Basic dialog
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Controlled dialog with form
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit Resource</DialogTitle>
      <DialogDescription>
        Make changes to the resource information.
      </DialogDescription>
    </DialogHeader>
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          value={resourceName}
          onChange={(e) => setResourceName(e.target.value)}
          className="col-span-3"
        />
      </div>
      <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
```

---

### Toast Components

**File:** `src/components/ui/toast.tsx` & `src/components/ui/toaster.tsx`

Toast notification system for user feedback.

#### Usage with useToast Hook

```tsx
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

function MyComponent() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        toast({
          title: "Success!",
          description: "Your file has been downloaded.",
        });
      }}
    >
      Show toast
    </Button>
  );
}

// Different toast variants
const showSuccessToast = () => {
  toast({
    title: "Success",
    description: "Operation completed successfully",
    variant: "default"
  });
};

const showErrorToast = () => {
  toast({
    title: "Error",
    description: "Something went wrong",
    variant: "destructive"
  });
};

const showToastWithAction = () => {
  toast({
    title: "Update available",
    description: "A new version is available for download",
    action: (
      <Button variant="outline" size="sm">
        Update
      </Button>
    ),
  });
};
```

---

## Layout Components

### Header Component

**File:** `src/components/layout/Header.tsx`

Main navigation header with theme toggle.

#### Usage

```tsx
import { Header } from "@/components/layout/Header";

// Basic usage
<Header />

// The header includes:
// - Logo/title
// - Navigation menu
// - Theme toggle button
// - Responsive design
```

### Footer Component

**File:** `src/components/layout/Footer.tsx`

Site footer with department information and links.

#### Usage

```tsx
import { Footer } from "@/components/layout/Footer";

// Basic usage
<Footer />

// The footer includes:
// - Department information
// - Contact details
// - Social media links
// - Copyright information
```

---

## Section Components

### HeroSection Component

**File:** `src/components/sections/HeroSection.tsx`

Landing page hero section with animated background.

#### Features

- Animated aurora background
- Responsive typography
- Call-to-action buttons
- Smooth scroll effects

#### Usage

```tsx
import { HeroSection } from "@/components/sections/HeroSection";

// Basic usage
<HeroSection />

// Features included:
// - Animated background
// - Department title and description
// - Navigation buttons
// - Responsive design
```

### ResourcesSection Component

**File:** `src/components/sections/ResourcesSection.tsx`

Interactive resource browser with advanced filtering.

#### Features

- Multi-level filtering (year, semester, course, teacher)
- Global search functionality
- Responsive grid layout
- Lazy loading with TanStack Query
- Export functionality

#### Usage

```tsx
import { ResourcesSection } from "@/components/sections/ResourcesSection";

// Basic usage
<ResourcesSection />

// The component handles:
// - Data fetching from /api/resources
// - Real-time filtering and searching
// - Resource card display
// - Download functionality
// - Error handling with toast notifications
```

### OnlineClassRecordingsSection Component

**File:** `src/components/sections/OnlineClassRecordingsSection.tsx`

YouTube video gallery with lazy loading and filtering.

#### Features

- Lazy loading YouTube embeds
- Multi-criteria filtering
- Responsive video grid
- Search functionality
- Performance optimized

#### Usage

```tsx
import { OnlineClassRecordingsSection } from "@/components/sections/OnlineClassRecordingsSection";

// Basic usage
<OnlineClassRecordingsSection />

// Features:
// - Fetches data from /api/recordings
// - LazyYouTube component integration
// - Advanced filtering system
// - Responsive grid layout
// - Search and filter persistence
```

---

## Chat Components

### ExpandableChat Component

**File:** `src/components/ui/expandable-chat.tsx`

Advanced expandable chat interface.

#### Props Interface

```typescript
interface ExpandableChatProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "bottom-right" | "bottom-left";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  icon?: React.ReactNode;
}
```

#### Component Structure

```tsx
import { 
  ExpandableChat, 
  ExpandableChatHeader, 
  ExpandableChatBody, 
  ExpandableChatFooter 
} from "@/components/ui/expandable-chat";

<ExpandableChat position="bottom-right" size="md">
  <ExpandableChatHeader>
    <h3>AI Assistant</h3>
  </ExpandableChatHeader>
  <ExpandableChatBody>
    {/* Message list */}
  </ExpandableChatBody>
  <ExpandableChatFooter>
    {/* Input area */}
  </ExpandableChatFooter>
</ExpandableChat>
```

### ExpandableChatDemo Component

**File:** `src/components/ui/expandable-chat-demo.tsx`

Complete chat implementation with message handling.

#### Features

- Real-time messaging
- Message state management
- API integration with /api/chat
- Typing indicators
- Message history
- Auto-scroll functionality

#### Usage

```tsx
import { ExpandableChatDemo } from "@/components/ui/expandable-chat-demo";

// Basic usage
<ExpandableChatDemo />

// The component includes:
// - Complete chat UI
// - Message state management
// - API integration
// - Error handling
// - Responsive design
```

---

## Advanced Components

### LazyYouTube Component

**File:** `src/components/ui/LazyYouTube.tsx`

Performance-optimized YouTube video embedding.

#### Props Interface

```typescript
interface LazyYouTubeProps {
  videoId: string;
  title: string;
  className?: string;
}
```

#### Usage

```tsx
import { LazyYouTube } from "@/components/ui/LazyYouTube";

// Basic usage
<LazyYouTube 
  videoId="dQw4w9WgXcQ" 
  title="Course Lecture 1" 
/>

// With custom styling
<LazyYouTube 
  videoId="dQw4w9WgXcQ" 
  title="Course Lecture 1"
  className="rounded-lg shadow-md"
/>

// In a grid layout
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {recordings.map((recording) => (
    <LazyYouTube
      key={recording.id}
      videoId={recording.videoId}
      title={recording.title}
      className="aspect-video"
    />
  ))}
</div>
```

### NeonGradientCard Component

**File:** `src/components/ui/neon-gradient-card.tsx`

Animated card with neon gradient effects.

#### Props Interface

```typescript
interface NeonGradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  borderSize?: number;
  borderRadius?: number;
  neonColors?: {
    firstColor: string;
    secondColor: string;
  };
}
```

#### Usage

```tsx
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";

// Basic usage
<NeonGradientCard>
  <div className="p-6">
    <h3 className="text-xl font-bold">Featured Content</h3>
    <p>Special announcement or highlighted content</p>
  </div>
</NeonGradientCard>

// Custom colors and properties
<NeonGradientCard
  borderSize={2}
  borderRadius={16}
  neonColors={{
    firstColor: "#00B4D8",
    secondColor: "#48CAE4"
  }}
  className="w-full max-w-md"
>
  <div className="p-8 text-center">
    <h2 className="text-2xl font-bold mb-4">Welcome to EEE Hub</h2>
    <p>Your gateway to academic excellence</p>
  </div>
</NeonGradientCard>
```

### TubelightNavbar Component

**File:** `src/components/ui/tubelight-navbar.tsx`

Animated navigation bar with tubelight effect.

#### Features

- Smooth scroll animations
- Active section highlighting
- Responsive design
- Glassmorphism effects

#### Usage

```tsx
import { TubelightNavbar } from "@/components/ui/tubelight-navbar";

// The navbar is typically used in the main layout
// It automatically handles:
// - Section detection
// - Smooth scrolling
// - Active state management
// - Responsive behavior
<TubelightNavbar />
```

---

## Best Practices

### Component Composition

```tsx
// Good: Compose components for complex layouts
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Resource Name</CardTitle>
      <Badge variant="secondary">{resource.type}</Badge>
    </div>
    <CardDescription>{resource.courseCode}</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <p className="text-sm">{resource.description}</p>
      <div className="flex gap-2">
        {resource.tags.map(tag => (
          <Badge key={tag} variant="outline">{tag}</Badge>
        ))}
      </div>
    </div>
  </CardContent>
  <CardFooter>
    <Button className="w-full">
      <Download className="mr-2 h-4 w-4" />
      Download
    </Button>
  </CardFooter>
</Card>
```

### Error Handling

```tsx
// Good: Handle loading and error states
function ResourceList() {
  const { data: resources, isLoading, error } = useQuery({
    queryKey: ['resources'],
    queryFn: fetchResources
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Failed to load resources</p>
          <Button onClick={() => refetch()} className="mt-2">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {resources?.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
}
```

### Responsive Design

```tsx
// Good: Use responsive utilities
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {items.map(item => (
    <Card key={item.id} className="w-full">
      {/* Card content */}
    </Card>
  ))}
</div>

// Good: Responsive component sizing
<Button 
  size={isMobile ? "sm" : "default"}
  className="w-full sm:w-auto"
>
  {isMobile ? "Download" : "Download Resource"}
</Button>
```

### Accessibility

```tsx
// Good: Proper ARIA labels and keyboard navigation
<Button
  aria-label={`Download ${resource.name}`}
  onClick={() => downloadResource(resource.id)}
  disabled={isDownloading}
>
  {isDownloading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Downloading...
    </>
  ) : (
    <>
      <Download className="mr-2 h-4 w-4" />
      Download
    </>
  )}
</Button>

// Good: Form accessibility
<div className="space-y-2">
  <Label htmlFor="search">Search Resources</Label>
  <Input
    id="search"
    type="search"
    placeholder="Enter search terms..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    aria-describedby="search-hint"
  />
  <p id="search-hint" className="text-sm text-muted-foreground">
    Search by course name, teacher, or keywords
  </p>
</div>
```

This component reference provides comprehensive documentation for implementing and using all components in the KUET EEE Hub project. Each component includes detailed prop interfaces, usage examples, and best practices for optimal implementation.