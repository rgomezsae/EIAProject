# CLAUDE.md — Instructions for Claude Code

This file tells Claude Code how to work on this project. Claude reads this
automatically every time it starts a session.

## Project Overview

Executive Energy Intelligence Platform — a luxury, dark-mode-first executive
dashboard for electric utility leadership. Built with React + Tailwind CSS +
Recharts. See `PROJECT_PLAN.md` for the full specification.

### Quick Start

```bash
npm install
npm run dev
```

## Security Rules (MANDATORY)

These rules must ALWAYS be followed. No exceptions.

- **NEVER write secrets, passwords, API keys, or tokens directly into code.**
  Always use environment variables loaded from `.env` files.
- **NEVER commit `.env` files or any file containing credentials.** The
  `.gitignore` is configured to block these — do not override it.
- **NEVER install packages or dependencies without first explaining what they
  do and why they are needed.** Always wait for user approval before adding
  dependencies.
- **NEVER run commands that download or execute remote scripts** (e.g.,
  `curl | bash`, `wget | sh`) without explicit user approval.
- **Check for known vulnerabilities** before recommending any third-party
  package. Prefer well-known, actively maintained packages with large user
  bases.
- **Do not expose ports, services, or APIs to the public internet** without
  explicit user approval.
- **Sanitize all user inputs** when writing code that accepts external data.

## Code Style & Preferences

- Write clean, readable code with meaningful variable names
- Keep functions small and focused on a single task
- Add comments only where the logic isn't self-evident
- Prefer simple solutions over clever ones
- Follow the conventions of whatever language/framework is being used

## Git Practices

- Write clear, descriptive commit messages
- Make small, focused commits (one logical change per commit)
- Never force-push without explicit approval
- Always check `git status` before committing to avoid including unintended files

## When Adding Dependencies

Before installing any package, always:
1. State the package name and what it does
2. Explain why it's needed
3. Confirm it's actively maintained (check last update date)
4. Wait for user approval

## Testing

- Write tests when creating new functionality
- Run existing tests before committing to avoid regressions
- Don't skip failing tests — fix them or flag them

## File Structure

Update this section as the project grows to document the directory layout.

```
EIAProject/
├── .gitignore              # Files git should ignore (security critical)
├── CLAUDE.md               # Instructions for Claude Code (this file)
├── PROJECT_PLAN.md         # Full product specification
├── README.md               # Project documentation
├── LICENSE                 # MIT License
├── SECURITY.md             # Security vulnerability reporting
├── index.html              # App entry HTML
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite + Tailwind configuration
└── src/
    ├── main.jsx            # App entry point (font imports, CSS)
    ├── App.jsx             # Root component (routing + layout)
    ├── app.css             # Tailwind imports + design token bridge
    ├── tokens/
    │   └── design-tokens.css   # CSS custom properties (colors, spacing, etc.)
    ├── components/
    │   ├── layout/         # AppShell, Sidebar, TopBar, ContentArea
    │   └── ui/             # Card, Button, Badge, DateRangeSelector
    ├── pages/              # 7 page components (one per dashboard section)
    ├── hooks/              # useNavigation (state-based routing)
    ├── constants/          # Navigation item definitions
    └── data/               # Mock JSON data (added in Phase 2)
```
