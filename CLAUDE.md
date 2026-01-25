# Converty - Claude Configuration

Project context for Claude (AI assistant).

## Project Overview

Converty is a collection of **156+ calculators** built with Next.js 16, React 19, and TypeScript 5. Static site generation for GitHub Pages deployment.

## Quick Start

```bash
npm run dev          # Start at http://localhost:3000
npm run build        # Build static export
npm run check:fix    # Fix lint issues
npm run type-check   # TypeScript check
```

## Key Directories

| Path | Purpose |
|------|---------|
| `src/app/[locale]/` | Next.js pages with locale routing |
| `src/components/converter/` | Reusable calculator components |
| `src/lib/converters/` | Pure calculation functions |
| `src/lib/registry/` | Calculator metadata |
| `src/stores/` | Zustand state management |
| `src/messages/` | Translation files (en, fr, de, it) |

## Adding a Calculator

1. Create calculation logic in `src/lib/converters/[category]/[name].ts`
2. Register in `src/lib/registry/converters.ts`
3. Add translations to all 4 locale files in `src/messages/`
4. Create component in `src/app/[locale]/[category]/[name]/[name]-calculator.tsx`
5. Create page in `src/app/[locale]/[category]/[name]/page.tsx`

**Detailed guide:** [docs/CALCULATOR_GUIDE.md](docs/CALCULATOR_GUIDE.md)

## Categories

| Category | Slug | Count |
|----------|------|-------|
| Math | `math` | 38 |
| Health | `health` | 28 |
| Finance | `finance` | 24 |
| Photo | `photo` | 22 |
| Web | `web` | 10 |
| Video | `video` | 9 |
| DateTime | `datetime` | 8 |
| Network | `network` | 5 |
| Data | `data` | 3 |
| Physics | `physics` | 1 |
| Music | `music` | 1 |
| Color | `color` | 1 |

## Detailed Guides

| Guide | Content |
|-------|---------|
| [Calculator Guide](docs/CALCULATOR_GUIDE.md) | Step-by-step for adding calculators |
| [Code Style](docs/CODE_STYLE.md) | TypeScript, naming, linting |
| [I18N Guide](docs/I18N_GUIDE.md) | Internationalization patterns |
| [Architecture](.planning/codebase/ARCHITECTURE.md) | System design |
| [grepai Reference](docs/GREPAI.md) | Semantic code search tool |
| [Serena Reference](docs/SERENA.md) | Semantic code editing toolkit |

## Important Notes

1. **Static Export** - No server-side features (`output: "export"`)
2. **URL State** - Calculators sync state to URL for shareability
3. **Zustand** - All calculators use `createCalculatorStore` factory
4. **i18n** - All user-facing text uses `useTranslations()`
5. **No `any` types** - Strict TypeScript enforced

## Linting

```bash
npm run check:fix  # Fix issues
npm run format     # Format code
```

Common issues: unused imports, missing return types, `let` instead of `const`

## Tool Selection Guide: grepai vs Serena vs Standard Tools

**Quick Decision Matrix:**

| Task | Use | Why |
|------|-----|-----|
| "Where is authentication handled?" | **grepai** | Semantic understanding of intent |
| "Find the `calculateROI` function" | **Serena** `find_symbol` | Precise symbol lookup |
| "Find all uses of `useTranslations`" | **Serena** `find_referencing_symbols` | Impact analysis |
| "Replace entire function body" | **Serena** `replace_symbol_body` | Symbol-level precision |
| "Change variable name everywhere" | **Serena** `rename_symbol` | LSP-aware refactoring |
| "Fix typo in one line" | **Edit** tool | Simple text change |
| "Find files named `*-calculator.tsx`" | **Glob** | File path patterns |
| "Find exact string `import React`" | **Grep** | Exact text matching |
| "Understand codebase structure" | **grepai** | Exploratory discovery |

### Use grepai When:

✅ **Exploring unfamiliar code**
- "How is state management done here?"
- "Where are API calls made?"
- "Find error handling patterns"

✅ **Intent-based discovery**
- "Where is user authentication validated?"
- "How does the app handle payments?"
- "Find database query logic"

✅ **Broad conceptual searches**
- "Show me all calculator implementations"
- "Find i18n translation usage"
- "Locate form validation code"

### Use Serena When:

✅ **Working with known symbols**
- Finding specific classes/functions by name
- Getting file structure overview
- Finding all references to a symbol

✅ **Refactoring code**
- Renaming symbols across codebase
- Replacing entire function/method bodies
- Adding new methods to classes

✅ **Impact analysis**
- "What will break if I change this function?"
- "Where is this class used?"
- "Find all callers of this method"

✅ **Precise code insertion**
- Adding methods to classes
- Inserting imports at file start
- Adding code after specific symbols

### Use Standard Tools When:

✅ **Grep** - Exact text matching
- Finding specific import statements
- Locating exact variable names
- Searching for specific strings

✅ **Glob** - File path patterns
- Finding all `*.test.ts` files
- Locating files in specific directories
- Matching file naming patterns

✅ **Read** - Reading specific files
- You already know the file path
- Reading configuration files
- Viewing documentation

✅ **Edit** - Small text changes
- Fixing typos
- Changing single lines
- Simple find/replace within known context

### Complete Workflow Example

**Task: Add error handling to all percentage calculators**

```typescript
// 1. DISCOVER with grepai
grepai_search("percentage calculation logic")
// → Finds: src/lib/converters/math/percentage.ts

// 2. UNDERSTAND with Serena
get_symbols_overview(relative_path="src/lib/converters/math/percentage.ts")
// → Shows: calculatePercentage, calculatePercentageIncrease, etc.

// 3. ANALYZE IMPACT with Serena
find_referencing_symbols(
    relative_path="src/lib/converters/math/percentage.ts",
    name_path="calculatePercentage"
)
// → Shows: 12 references across 5 files

// 4. MODIFY with Serena
replace_symbol_body(
    name_path="calculatePercentage",
    new_body=`export function calculatePercentage(value: number, total: number): number {
  if (total === 0) {
    throw new Error('Total cannot be zero');
  }
  if (!isFinite(value) || !isFinite(total)) {
    throw new Error('Values must be finite numbers');
  }
  return (value / total) * 100;
}`
)
```

### Decision Flowchart

```
Start
  ↓
Do you know the exact file/symbol name?
  ├─ NO → Use grepai for semantic search
  └─ YES → Continue
       ↓
  Are you modifying entire functions/classes?
       ├─ YES → Use Serena symbol operations
       └─ NO → Continue
            ↓
       Is it a small text change (1-3 lines)?
            ├─ YES → Use Edit tool
            └─ NO → Use Serena for complex changes
```

## grepai - Semantic Code Search

**grepai** searches your codebase using natural language queries and vector embeddings. It understands code meaning, not just exact text.

**When to use:** Exploring unfamiliar code, intent-based searches, call graph analysis
**Full documentation:** [docs/GREPAI.md](docs/GREPAI.md)

### Quick Reference

```bash
# Semantic search
grepai search "calculator state management" --json --compact

# Find callers (before modifying)
grepai trace callers "createCalculatorStore" --json

# Find callees (understand dependencies)
grepai trace callees "processPayment" --json

# Complete call graph
grepai trace graph "useTranslations" --depth 2 --json
```

### MCP Tools Available

- `mcp__grepai__grepai_search` - Semantic code search
- `mcp__grepai__grepai_trace_callers` - Find who calls a symbol
- `mcp__grepai__grepai_trace_callees` - Find what symbol calls
- `mcp__grepai__grepai_trace_graph` - Build call graph
- `mcp__grepai__grepai_index_status` - Check index health

### Best Practices

✅ Use English queries for best results
✅ Describe intent: "handles user login" not "func Login"
✅ Always use `--json --compact` for AI agents
✅ Check callers before refactoring functions

❌ Don't use for exact text matching (use Grep)
❌ Don't use vague queries ("code" vs "authentication middleware")

## Serena - Semantic Code Editing

**Serena** provides LSP-powered symbol-level operations for precise code manipulation.

**When to use:** Finding symbols, refactoring, renaming, impact analysis
**Full documentation:** [docs/SERENA.md](docs/SERENA.md)

### Quick Reference

```python
# Find symbol
find_symbol(name_path="calculatePercentage", include_body=True)

# Check references BEFORE modifying
find_referencing_symbols(
    relative_path="src/lib/converters/math/percentage.ts",
    name_path="calculatePercentage"
)

# Replace entire function body
replace_symbol_body(
    name_path="calculatePercentage",
    new_body="..."
)

# Rename across codebase (LSP-aware)
rename_symbol(
    name_path="calculatePercentage",
    new_name="computePercentage"
)

# Get file structure
get_symbols_overview(relative_path="src/stores/calculator-store.ts")
```

### Key MCP Tools

**Symbol Discovery:**
- `find_symbol` - Find by name path
- `get_symbols_overview` - Get file structure
- `find_referencing_symbols` - Find all references

**Symbol Editing:**
- `replace_symbol_body` - Replace entire function/method
- `rename_symbol` - Rename across codebase
- `insert_after_symbol` / `insert_before_symbol` - Add code

**File Operations:**
- `read_file` - Read with line ranges
- `search_for_pattern` - Regex search
- `replace_content` - Regex/literal replace

**Memory System:**
- `write_memory` - Persist project context
- `read_memory` - Retrieve context
- `list_memories` - List all memories

### Symbol Name Paths

- Simple: `"calculate"` - Matches any symbol
- Relative: `"MyClass/myMethod"` - Matches suffix
- Absolute: `"/MyClass/myMethod"` - Exact match
- Overloaded: `"MyClass/myMethod[0]"` - Specific overload

### Best Practices

✅ **Always** check references before modifying
✅ Use symbol operations for whole functions/classes
✅ Get overview before deep diving
✅ Use LSP for renames (guaranteed correctness)
✅ Document patterns in memory system

❌ Don't modify without checking references
❌ Don't use for small edits (use Edit tool)
❌ Don't use for exploratory searches (use grepai)
❌ Don't guess name paths (use substring matching)

## Common Workflows

### Refactoring a Function

```typescript
// 1. Find it
grepai_search("percentage calculation")

// 2. Get structure
get_symbols_overview(relative_path="src/lib/converters/math/percentage.ts")

// 3. Check impact
find_referencing_symbols(name_path="calculatePercentage")

// 4. Modify safely
replace_symbol_body(...)
```

### Adding a Calculator

```typescript
// 1. Find similar calculators
grepai_search("ROI calculator implementation")

// 2. Create new converter
create_text_file(relative_path="src/lib/converters/finance/new-calc.ts", ...)

// 3. Find registry structure
get_symbols_overview(relative_path="src/lib/registry/converters.ts")

// 4. Add registration (use Edit for array modification)
```

### Understanding Unfamiliar Code

```typescript
// 1. Semantic exploration
grepai_search("how are translations loaded")

// 2. Get file overview
get_symbols_overview(relative_path="path/from/results")

// 3. Find specific symbols
find_symbol(name_path="useTranslations", include_body=True)

// 4. Trace usage
find_referencing_symbols(...)
```
