# Executive Energy Intelligence Platform

A luxury, dark-mode-first executive dashboard for electric utility leadership.
Provides instant access to rates, load forecasting, revenue forecasting,
peer benchmarking, and data center analytics.

## Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/rgomezsae/eiaproject.git
   cd eiaproject
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open the URL shown in your terminal (typically http://localhost:5173).

## Tech Stack

- **React** — UI framework
- **Tailwind CSS** — Utility-first styling
- **Recharts** — Charts and data visualization
- **Lucide React** — Icons
- **Vite** — Build tool and dev server

## Security Practices

- **No secrets in code** — all sensitive values are stored in `.env` files
  which are excluded from version control via `.gitignore`.
- **Dependency review** — all third-party packages are reviewed before
  installation.
- **Vulnerability reporting** — see [SECURITY.md](SECURITY.md) for how to
  report security issues.

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for
details.
