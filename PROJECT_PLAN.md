# Executive Energy Intelligence Platform — Project Plan

> **Purpose:** This document is the single source of truth for Claude Code to build a luxury, executive-grade web application for electric utility leadership. It defines every page, component, visual, interaction, and style decision.

-----

## 1. Product Overview

**What it is:** A self-service executive dashboard that gives utility leadership instant access to rates, load forecasting, revenue forecasting, actual-vs-forecast performance, national/peer benchmarking, and data center analytics — all in a single, premium web experience.

**Who it's for:** C-suite and VP-level executives at an electric utility who need to scan for quick takeaways in 30 seconds *and* drill into granular data when needed.

**Core UX principles:**

- **Scan → Drill → Export.** Every surface supports all three modes.
- **Information density without clutter.** Dense data, generous whitespace.
- **Dark-mode-first luxury.** The app should feel like a Bloomberg terminal meets a Porsche cockpit.

-----

## 2. Design System & Style Guide

### 2.1 Color Palette (NextEra Energy–Inspired)

|Token             |Hex      |Usage                                |
|------------------|---------|-------------------------------------|
|`--nex-green`     |`#78C239`|Primary accent, positive trends, CTAs|
|`--nex-blue`      |`#0097DA`|Secondary accent, links, info states |
|`--nex-green-dim` |`#5A9E2B`|Hover/active states on green elements|
|`--nex-blue-dim`  |`#007AB8`|Hover/active states on blue elements |
|`--surface-900`   |`#0B0F19`|App background (deepest layer)       |
|`--surface-800`   |`#111827`|Card/panel backgrounds               |
|`--surface-700`   |`#1E293B`|Elevated cards, modals, hover states |
|`--surface-600`   |`#334155`|Borders, dividers, subtle separators |
|`--text-primary`  |`#F1F5F9`|Headlines, primary values            |
|`--text-secondary`|`#94A3B8`|Labels, descriptions, axis labels    |
|`--text-muted`    |`#64748B`|Timestamps, footnotes                |
|`--positive`      |`#78C239`|Up trends, on-target, favorable      |
|`--negative`      |`#EF4444`|Down trends, off-target, unfavorable |
|`--warning`       |`#F59E0B`|Caution, approaching threshold       |
|`--chart-series-1`|`#78C239`|First data series in any chart       |
|`--chart-series-2`|`#0097DA`|Second data series                   |
|`--chart-series-3`|`#A78BFA`|Third data series (violet)           |
|`--chart-series-4`|`#F59E0B`|Fourth data series (amber)           |
|`--chart-series-5`|`#EC4899`|Fifth data series (pink)             |

### 2.2 Typography

|Element          |Font          |Weight|Size|
|-----------------|--------------|------|----|
|App title / Logo |Inter         |700   |20px|
|Page title       |Inter         |600   |28px|
|Section header   |Inter         |600   |18px|
|Card title       |Inter         |500   |14px|
|KPI value (large)|Inter         |700   |36px|
|KPI value (small)|Inter         |600   |24px|
|Body / labels    |Inter         |400   |14px|
|Caption / muted  |Inter         |400   |12px|
|Monospace values |JetBrains Mono|500   |14px|

### 2.3 Spacing & Layout

- **Grid:** 12-column CSS grid with 24px gutters.
- **Card padding:** 24px internal padding; 16px between cards.
- **Border radius:** 12px on cards, 8px on buttons/inputs, 6px on chips/badges.
- **Shadows:** No drop shadows — use 1px `--surface-600` borders for depth. Subtle `box-shadow: 0 0 0 1px rgba(255,255,255,0.04)` for glass effect.

### 2.4 Component Conventions

- **KPI Cards:** Value top-left in large monospace, delta badge (▲/▼ + %) top-right, sparkline below, label at bottom in `--text-secondary`.
- **Charts:** Dark background (`--surface-800`), no gridline fills, subtle dashed gridlines in `--surface-600`. Tooltips are floating glass panels. Axis labels in `--text-muted`.
- **Tables:** Zebra-striped with `--surface-800` / `--surface-700` alternating. Sticky headers. Row hover highlight in `--surface-700`.
- **Buttons:** Primary = `--nex-green` fill, white text. Secondary = transparent with `--surface-600` border. Ghost = text only.
- **Tabs / Navigation:** Underline-style active indicator in `--nex-green`, no background fills.
- **Badges/Chips:** Pill shape, 6px radius, semi-transparent background tinted with the status color.
- **Loading states:** Skeleton shimmer using a gradient sweep from `--surface-700` to `--surface-800`.
- **Transitions:** All hover/state transitions 150ms ease-out.
- **Scrollbars:** Thin, styled with `--surface-600` thumb on `--surface-800` track.

### 2.5 Chart Library

Use **Recharts** for all visualizations. Consistent config:

- `<ResponsiveContainer>` on every chart.
- Rounded line strokes with `strokeWidth={2}`.
- Area fills use a gradient from the series color at 30% opacity to transparent.
- Bar charts use 8px border-radius on top corners.
- Consistent tooltip component across the app — glass panel, no border, backdrop blur.

### 2.6 Iconography

Use **Lucide React** for all icons. 20px default size, `strokeWidth={1.5}`, colored with `--text-secondary` unless interactive.

-----

## 3. App Architecture

### 3.1 Tech Stack

- **Framework:** React (single-page app)
- **Styling:** Tailwind CSS utility classes
- **Charts:** Recharts
- **Icons:** Lucide React
- **State:** React hooks (`useState`, `useReducer`, `useContext`)
- **Data:** Mock JSON datasets (structured for easy API replacement later)

### 3.2 Navigation

**Left sidebar** — collapsed by default (icon-only, 64px wide), expandable to 240px on hover/click.

Sidebar items (top to bottom):

1. Executive Summary (default landing)
2. Rates
3. Load Forecasting
4. Revenue Forecasting
5. Actual vs Forecast
6. Peer & National Comparison
7. Data Centers

Bottom of sidebar:

- Settings (date range, units, export preferences)
- Profile avatar/initials

**Top bar:** Minimal — contains the current page title (left), global date-range selector (center), and notification bell + export button (right).

-----

## 4. Page-by-Page Specification

-----

### 4.1 Executive Summary (Default Landing)

**Purpose:** 30-second scan of everything that matters. No clicking required for a high-level read.

**Layout (top to bottom):**

#### Row 1 — KPI Strip (full width, 6 cards)

A horizontal row of 6 equally-spaced KPI cards:

|Card             |Primary Value|Delta         |Sparkline          |
|-----------------|-------------|--------------|-------------------|
|Avg Retail Rate  |¢/kWh        |vs prior year |12-month trend     |
|System Peak Load |MW           |vs forecast   |30-day trend       |
|Revenue MTD      |$M           |vs budget     |Current month daily|
|Forecast Accuracy|%            |vs prior month|6-month trend      |
|Peer Rank        |#X of Y      |change        |4-quarter trend    |
|Data Center Load |MW           |vs capacity   |30-day trend       |

#### Row 2 — Two-Column Split

- **Left (8 cols):** "Revenue vs Forecast" area chart — 12-month view.
- **Right (4 cols):** "Rate Composition" stacked horizontal bar chart.

#### Row 3 — Two-Column Split

- **Left (6 cols):** "Load Forecast — Next 7 Days" line chart with confidence band.
- **Right (6 cols):** "Peer Comparison — Key Metrics" radar/spider chart.

#### Row 4 — Full Width Table

"Alerts & Insights" — a compact table (max 5 rows) showing auto-generated takeaways.

-----

### 4.2 Rates

Deep-dive into rate structures, trends, and comparisons. 4 KPI cards, rate trend charts, component breakdowns, peer comparison bars, and a sortable detail table.

### 4.3 Load Forecasting

Current and projected demand, weather impacts, and forecast accuracy. 4 KPI cards, load forecast vs actual chart, load duration curve, temperature scatter, customer class breakdown, peak day analysis, and forecast performance log.

### 4.4 Revenue Forecasting

Revenue performance against plan and projections. 4 KPI cards, actual vs forecast vs budget chart, revenue by class, variance waterfall, revenue per MWh trend, seasonal heatmap, and detail table.

### 4.5 Actual vs Forecast Performance

Cross-functional accuracy view. 3 KPI cards, accuracy by category bar chart, accuracy trend, bias analysis, and variance detail table.

### 4.6 Peer & National Comparison

Benchmarking against similar utilities. 4 KPI cards, radar chart scorecard, rate ranking lollipop chart, performance trend, and peer comparison matrix.

### 4.7 Data Centers

Data center load segment tracking. 4 KPI cards, load growth combo chart, revenue donut, capacity vs demand, geographic distribution, growth projections, and portfolio table.

-----

## 5. Interactions & Self-Service Features

- Global date range selector (MTD, QTD, YTD, Last 12 Months, Custom)
- Drill-down slide panels on chart click
- Per-chart and per-table CSV/Excel export
- Granularity toggles (Hourly/Daily/Monthly/Quarterly/Annual)
- Filter chips for category slicing
- Glass-panel tooltips on hover

-----

## 6. Data Structure

Mock JSON files in `/data`: rates.json, load.json, revenue.json, actuals-vs-forecast.json, peers.json, datacenters.json, alerts.json. Each with 24 months of realistic data.

-----

## 7. Build Sequence

- **Phase 1:** Foundation (scaffolding, tokens, layout shell, routing)
- **Phase 2:** Data & Components (mock data, reusable components)
- **Phase 3:** Pages (one at a time, all 7)
- **Phase 4:** Polish (drill-down, export, skeletons, responsive, QA)

-----

## 8. Quality Checklist

- All KPI cards show value, delta, and sparkline
- All charts use design system colors (no defaults)
- All charts have custom glass-panel tooltips
- All tables are sortable with export buttons
- Typography matches the type scale exactly
- Card borders are 1px --surface-600, radius 12px
- No default gridlines — custom dashed lines
- Hover states on all interactive elements
- Positive/negative deltas color-coded correctly
- Smooth page transitions, no layout shift
- Sidebar highlights active page
