# Mucaro Stack - shadcn/ui Styling Guidelines

**CRITICAL RULE**: NEVER use random colors. ALWAYS use shadcn/ui semantic color classes.

## 🚨 MANDATORY: shadcn/ui Design System Adherence

### **NEVER use random colors - ONLY semantic classes**

This project strictly follows shadcn/ui design system conventions. All colors must use semantic CSS variables and their corresponding Tailwind classes.

## Semantic Color System

### Core Semantic Colors

Use ONLY these semantic color classes:

#### Background Colors
```typescript
// ✅ ALWAYS use semantic background classes
"bg-background"           // Main background
"bg-card"                // Card backgrounds
"bg-popover"             // Popover backgrounds
"bg-primary"             // Primary actions
"bg-secondary"           // Secondary actions
"bg-muted"               // Muted backgrounds
"bg-accent"              // Accent backgrounds
"bg-destructive"         // Destructive actions (errors, delete)

// ✅ With opacity modifiers
"bg-primary/10"          // 10% opacity
"bg-destructive/5"       // 5% opacity
"bg-green-500/10"        // Only for semantic meanings (success)
"bg-yellow-500/10"       // Only for semantic meanings (warning)

// ❌ NEVER use arbitrary colors
"bg-blue-600"            // ❌ Use bg-primary instead
"bg-red-500"             // ❌ Use bg-destructive instead
"bg-gray-100"            // ❌ Use bg-muted instead
```

#### Text Colors
```typescript
// ✅ ALWAYS use semantic text classes
"text-foreground"        // Primary text
"text-muted-foreground"  // Secondary/muted text
"text-primary"           // Primary action text
"text-primary-foreground" // Text on primary backgrounds
"text-secondary-foreground" // Text on secondary backgrounds
"text-destructive"       // Error/destructive text
"text-accent-foreground" // Text on accent backgrounds

// ✅ For semantic color meanings only
"text-green-600 dark:text-green-400"   // Success states
"text-yellow-600 dark:text-yellow-400" // Warning states

// ❌ NEVER use arbitrary text colors
"text-blue-600"          // ❌ Use text-primary instead
"text-gray-500"          // ❌ Use text-muted-foreground instead
"text-red-600"           // ❌ Use text-destructive instead
```

#### Border Colors
```typescript
// ✅ ALWAYS use semantic border classes
"border-border"          // Standard borders
"border-input"           // Input borders
"border-primary"         // Primary borders
"border-destructive"     // Error borders
"border-muted"           // Muted borders

// ✅ With opacity for semantic meanings
"border-destructive/20"  // Light destructive border
"border-green-500/20"    // Success border (semantic only)
"border-yellow-500/20"   // Warning border (semantic only)

// ❌ NEVER use arbitrary border colors
"border-red-400"         // ❌ Use border-destructive instead
"border-gray-300"        // ❌ Use border-border instead
"border-blue-500"        // ❌ Use border-primary instead
```

### State-Based Color Usage

#### Success States
```typescript
// ✅ Success indicators
"text-green-600 dark:text-green-400"
"bg-green-500/10"
"border-green-500/20"

// ✅ Example usage
<div className="bg-green-500/5 border border-green-500/20 text-foreground">
  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
  <span>Success message</span>
</div>
```

#### Warning States
```typescript
// ✅ Warning indicators
"text-yellow-600 dark:text-yellow-400"
"bg-yellow-500/10"
"border-yellow-500/20"

// ✅ Example usage
<div className="bg-yellow-500/5 border border-yellow-500/20 text-foreground">
  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
  <span>Warning message</span>
</div>
```

#### Error/Destructive States
```typescript
// ✅ Error indicators (prefer semantic destructive)
"text-destructive"
"bg-destructive/10"
"border-destructive/20"
"bg-destructive/5"

// ✅ Example usage
<div className="bg-destructive/5 border border-destructive/20 text-foreground">
  <XCircle className="h-5 w-5 text-destructive" />
  <span className="text-destructive">Error message</span>
</div>
```

#### Info/Primary States
```typescript
// ✅ Info/primary indicators
"text-primary"
"bg-primary/10"
"border-primary/20"
"bg-primary/5"

// ✅ Example usage
<div className="bg-primary/5 border border-primary/20 text-foreground">
  <Info className="h-5 w-5 text-primary" />
  <span>Information message</span>
</div>
```

## Component-Specific Guidelines

### Priority/Status Indicators

```typescript
// ✅ CORRECT: Semantic priority colors
export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "medium":
      return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20 dark:text-yellow-400";
    case "low":
      return "bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

// ❌ WRONG: Random colors
export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200"; // ❌ Random red
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"; // ❌ Random yellow
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"; // ❌ Random gray
  }
};
```

### Interactive States

```typescript
// ✅ CORRECT: Semantic hover states
<Button 
  className="bg-primary text-primary-foreground hover:bg-primary/90"
  variant="default"
>
  Primary Action
</Button>

<Button
  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
  variant="destructive"
>
  Delete Action
</Button>

// ❌ WRONG: Custom hover colors
<button className="bg-blue-600 hover:bg-blue-700 text-white"> // ❌ Random blue
<button className="bg-red-600 hover:bg-red-700 text-white">   // ❌ Random red
```

### Layout and Structure

```typescript
// ✅ CORRECT: Semantic layout colors
<div className="bg-background text-foreground min-h-screen">
  <header className="bg-card border-b border-border">
    <nav className="text-foreground">Navigation</nav>
  </header>
  <main className="bg-background">
    <Card className="bg-card border border-border">
      <CardContent className="text-foreground">
        Content
      </CardContent>
    </Card>
  </main>
</div>

// ❌ WRONG: Random layout colors
<div className="bg-gray-50 text-gray-900 min-h-screen">     // ❌ Random grays
  <header className="bg-white border-b border-gray-200">    // ❌ Random colors
    <nav className="text-gray-900">Navigation</nav>         // ❌ Random text color
  </header>
</div>
```

## Dark Mode Considerations

### Automatic Dark Mode Support
Most semantic classes automatically support dark mode:

```typescript
// ✅ CORRECT: Automatic dark mode
"bg-background"           // Automatically switches for dark mode
"text-foreground"         // Automatically switches for dark mode
"border-border"           // Automatically switches for dark mode
```

### Manual Dark Mode Classes (Only When Needed)
```typescript
// ✅ CORRECT: Manual dark mode for semantic colors only
"text-green-600 dark:text-green-400"   // Success states
"text-yellow-600 dark:text-yellow-400" // Warning states
"text-purple-600 dark:text-purple-400" // Info states (when semantic)

// ❌ WRONG: Manual dark mode for arbitrary colors
"text-blue-600 dark:text-blue-400"     // ❌ Use text-primary instead
"bg-gray-100 dark:bg-gray-800"         // ❌ Use bg-muted instead
```

## Migration Guide: Replacing Random Colors

### Common Replacements

| ❌ Old Random Color | ✅ New Semantic Color |
|-------------------|---------------------|
| `bg-gray-50` | `bg-background` or `bg-muted` |
| `bg-gray-100` | `bg-muted` |
| `bg-white` | `bg-background` or `bg-card` |
| `text-gray-900` | `text-foreground` |
| `text-gray-600` | `text-muted-foreground` |
| `text-gray-500` | `text-muted-foreground` |
| `border-gray-300` | `border-border` |
| `border-gray-200` | `border-border` |
| `bg-blue-600` | `bg-primary` |
| `text-blue-600` | `text-primary` |
| `bg-red-600` | `bg-destructive` |
| `text-red-600` | `text-destructive` |
| `bg-red-50` | `bg-destructive/5` |
| `border-red-400` | `border-destructive` |

### Priority/Status Colors
| ❌ Old Random Color | ✅ New Semantic Color |
|-------------------|---------------------|
| `bg-red-100 text-red-800` | `bg-destructive/10 text-destructive` |
| `bg-yellow-100 text-yellow-800` | `bg-yellow-500/10 text-yellow-700 dark:text-yellow-400` |
| `bg-green-100 text-green-800` | `bg-green-500/10 text-green-700 dark:text-green-400` |

## CSS Variables Reference

The semantic color system is based on these CSS variables:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  /* ... etc */
}
```

## Enforcement Rules

### Code Review Checklist
- [ ] No arbitrary color classes (bg-blue-600, text-red-500, etc.)
- [ ] All colors use semantic classes (bg-primary, text-destructive, etc.)
- [ ] State colors use semantic meanings (success, warning, error)
- [ ] Dark mode is handled automatically or explicitly for semantic colors only
- [ ] Hover states use semantic color variations (/90, /80, etc.)

### Linting Rules
Configure your linter to catch non-semantic color usage:

```typescript
// ❌ These patterns should trigger linting errors
/(bg-|text-|border-)(red|blue|green|yellow|orange|purple|pink|indigo|gray|slate|zinc|neutral|stone)-\d+/

// ✅ These patterns are allowed
/(bg-|text-|border-)(background|foreground|card|primary|secondary|muted|accent|destructive|border|input|ring)/
/(text-green-\d+ dark:text-green-\d+)/ // Only for semantic success states
/(text-yellow-\d+ dark:text-yellow-\d+)/ // Only for semantic warning states
```

## Examples

### ✅ CORRECT: Todo Row with Semantic Colors
```typescript
<TableRow
  className={`${
    todo.completed ? "opacity-60" : ""
  } ${todoIsOverdue ? "border-destructive border-l-4 bg-destructive/5" : ""}`}
>
  <TableCell>
    <span className={todoIsOverdue ? "font-medium text-destructive" : ""}>
      {formatDate(todo.dueDate)}
    </span>
  </TableCell>
</TableRow>
```

### ❌ WRONG: Todo Row with Random Colors
```typescript
<TableRow
  className={`${
    todo.completed ? "opacity-60" : ""
  } ${todoIsOverdue ? "border-red-400 border-l-4 bg-red-50" : ""}`} // ❌ Random red
>
  <TableCell>
    <span className={todoIsOverdue ? "font-medium text-red-600" : ""}> {/* ❌ Random red */}
      {formatDate(todo.dueDate)}
    </span>
  </TableCell>
</TableRow>
```

### ✅ CORRECT: Stats Cards with Semantic Colors
```typescript
<Card>
  <CardContent className="p-4">
    <div className="flex items-center gap-3">
      <Target className="h-8 w-8 text-primary" />
      <div>
        <p className="font-medium text-muted-foreground text-sm">Total</p>
        <p className="font-bold text-2xl text-foreground">{stats.total}</p>
      </div>
    </div>
  </CardContent>
</Card>
```

### ❌ WRONG: Stats Cards with Random Colors
```typescript
<Card>
  <CardContent className="p-4">
    <div className="flex items-center gap-3">
      <Target className="h-8 w-8 text-blue-600" /> {/* ❌ Random blue */}
      <div>
        <p className="font-medium text-gray-600 text-sm">Total</p> {/* ❌ Random gray */}
        <p className="font-bold text-2xl text-gray-900">{stats.total}</p> {/* ❌ Random gray */}
      </div>
    </div>
  </CardContent>
</Card>
```

## Summary

**REMEMBER**: 
1. **NEVER use random colors** - Always use semantic classes
2. **Follow shadcn/ui conventions** - Use the design system variables
3. **Think semantically** - What does this color represent? (primary, destructive, success, warning)
4. **Use opacity modifiers** - `/5`, `/10`, `/20` for subtle variations
5. **Support dark mode** - Semantic classes handle this automatically
6. **State-based colors** - Use green for success, yellow for warning, destructive for errors

Always ask: "What semantic meaning does this color have?" instead of "What color looks good here?"
