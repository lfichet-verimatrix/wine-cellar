### State Management
- Use `useActionState` for form state management with async actions (React 19)
- Use `useFormStatus` to access form submission status in child components (React 19)
- Use `useTransition` to manage pending states for async operations
- Separate concerns by using multiple `useEffect` hooks for different synchronization processes

### Data Fetching
- Use custom hooks to encapsulate data fetching logic
- Consider the `use` hook for sequential data fetching (future pattern)
- Implement proper cleanup in `useEffect` for subscriptions and connections

### Component Patterns
- Pass JSX as children instead of using factory functions for dynamic components
- Extract list item logic into separate components when using `useCallback`
- Use context with custom hooks to avoid prop drilling
- Keep components pure - avoid mutations of external variables during render

### Forms (React 19)
- Use Actions pattern with `useTransition` for automatic pending state management
- Leverage `useFormStatus` for submit button states
- Handle errors within transition callbacks

### Code Quality
- Ensure components are pure functions - same props should produce same output
- Local mutations within render are acceptable (e.g., creating and modifying local arrays)
- Use `<Profiler>` component to measure rendering performance
- Follow consistent response formats and error handling patterns
