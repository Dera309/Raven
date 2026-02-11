# Raven - Development Guidelines

## Working with the Task Checklist

### Task Status Markers
- `[ ]` - Task not yet started
- `[/]` - Task currently in progress
- `[x]` - Task completed

### Workflow Instructions

1. **Before starting a task:**
   - Mark the task as `[/]` in `docs/tasks.md`
   - Verify all dependent tasks from earlier phases are completed

2. **While working on a task:**
   - Reference the linked Plan item in `docs/plan.md` for implementation details
   - Reference the linked Requirement in `docs/requirements.md` for acceptance criteria
   - Keep code consistent with established patterns

3. **After completing a task:**
   - Mark the task as `[x]` in `docs/tasks.md`
   - Test the feature against acceptance criteria
   - Commit with a message referencing the task ID (e.g., "feat: implement 1.3.1 - auth routes")

### Adding New Tasks
- Maintain numerical order within phases
- Always link to both Plan and Requirement sections
- Place in the appropriate phase
- Keep formatting consistent (bullet point with checkbox)

### Phase Dependencies
Complete phases in order, as each builds upon the previous:
1. **Phase 1** must be complete before any other phase
2. **Phase 2** requires Phase 1 (database models, auth)
3. **Phase 3** requires Phase 2 (profiles must exist for booking)
4. **Phase 4** requires Phase 3 (bookings flow for testing payments)
5. **Phases 5-7** can partially overlap

---

## Code Standards

### Backend (Express/TypeScript)
```
server/
├── src/
│   ├── controllers/    # Route handlers
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express route definitions
│   ├── middleware/     # Auth, validation, etc.
│   ├── services/       # Business logic
│   ├── utils/          # Helper functions
│   └── config/         # Database, env config
```

### Frontend (Next.js/TypeScript)
```
client/
├── app/                # Next.js 14 app router
├── components/         # Reusable UI components
├── lib/                # Utilities, API client
├── hooks/              # Custom React hooks
├── context/            # React context providers
└── types/              # TypeScript interfaces
```

### Naming Conventions
- **Files:** kebab-case (e.g., `user-profile.tsx`)
- **Components:** PascalCase (e.g., `UserProfile`)
- **Functions:** camelCase (e.g., `getUserById`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)

### Git Commit Format
```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Example: feat(auth): implement JWT token refresh
```
