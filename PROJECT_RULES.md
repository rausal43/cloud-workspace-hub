# ARCHITECTURE & CODING GUIDELINES

## 🚨 MANDATORY RULE: MODULARITY & FILE SIZE LIMIT

1. **1 FILE = 1 MODULE**:
   - Each file MUST serve a single, clear responsibility (e.g. 1 service file for database API calls, 1 custom hook for data management, 1 component per UI feature/modal).
   - NEVER combine multiple heavy sub-systems or modals into a single mega-file.

2. **MAXIMUM 300 LINES PER FILE**:
   - No single source code file (`.jsx`, `.js`, `.ts`, `.css`) should exceed **300 lines of code**.
   - If a component or hook approaches 250-300 lines, it MUST be refactored and broken down into smaller sub-modules immediately.

3. **ENVIRONMENT VARIABLES FOR CREDENTIALS**:
   - ALL database keys, API endpoints, and secret credentials MUST strictly come from `.env` environment variables.
   - NEVER create UI input modals or main-page forms to input secret API keys.

4. **DYNAMIC GMAIL TEAM MEMBER INTEGRATION**:
   - ALL features requiring assignees, authors, or participants (Task Manager, Calendar, Standups, Messages, Files) MUST dynamically populate options from `activeProject.members` (invited Gmail team members).
   - NEVER hardcode static default names in forms; fallback to `currentUser.name` or the first member of `activeProject.members`.
