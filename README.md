# AI Financial Dashboard

A production-quality financial analytics dashboard that lets you upload CSV or JSON datasets, analyzes them with **Google Gemini 2.5 Flash**, and renders dynamic charts with KPI cards — all in a Bloomberg-inspired dark UI.

![Dashboard Preview](https://img.shields.io/badge/status-active-brightgreen) ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript) ![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?logo=google)

---

## Features

- **Upload CSV / JSON** — drag-and-drop or file picker, up to 10 MB, instant data preview
- **AI Analysis** — Gemini 2.5 Flash generates an executive summary and recommends the best chart types for your data
- **Dynamic Charts** — Line, Bar, Scatter, and Pie charts rendered automatically; no manual axis selection needed
- **Local KPI Cards** — Average, Range, Std Deviation, and Growth % computed in-browser with zero API calls
- **Data Assistant** — chat panel for asking natural-language questions about your dataset
- **Export PNG** — download any chart as a high-resolution image
- **Export PDF** — download the AI summary as a branded PDF report
- **In-memory caching** — the same dataset is never sent to Gemini twice (30-minute TTL)
- **Retry logic** — automatic exponential backoff on Gemini rate-limit or server errors
- **Skeleton loaders** — shimmer placeholders during analysis
- **Responsive layout** — works on desktop and tablet

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Charts | Recharts |
| AI | Google Gemini 2.5 Flash (`@google/genai`) |
| PDF | jsPDF |
| PNG export | html2canvas |
| CSV parsing | PapaParse |
| Backend | Node.js, Express |
| HTTP client | Axios |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A free [Google AI Studio](https://aistudio.google.com) API key (`GEMINI_API_KEY`)

### 1. Clone

```bash
git clone https://github.com/<your-username>/finance-dashboard.git
cd finance-dashboard
```

### 2. Backend

```bash
cd server
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=your_key_here
npm install
npm run dev
```

The API server starts on `http://localhost:3001`.

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

The app opens at `http://localhost:5173`.

---

## Environment Variables

### `server/.env`

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Express server port |
| `CLIENT_ORIGIN` | `http://localhost:5173` | CORS allowed origin |
| `GEMINI_API_KEY` | — | **Required.** From [aistudio.google.com](https://aistudio.google.com) |

---

## Project Structure

```
finance-dashboard/
├── client/                  # React + TypeScript frontend
│   └── src/
│       ├── api/             # Axios API clients (analyze, chat)
│       ├── components/
│       │   ├── chat/        # ChatPanel
│       │   ├── dashboard/   # DynamicChart, KPICard, SummaryCard
│       │   ├── layout/      # Sidebar, Navbar
│       │   ├── ui/          # Skeleton loaders
│       │   └── upload/      # UploadCard, DataPreview
│       ├── pages/           # DashboardPage, UploadPage
│       ├── types/           # Shared TypeScript types
│       └── utils/           # kpi.ts, parseFile.ts, exportChart.ts, exportPdf.ts
└── server/                  # Node.js + Express backend
    └── src/
        ├── lib/             # gemini.js, cache.js, retry.js
        ├── middleware/      # validatePayload.js
        └── routes/          # analyze.js, chat.js
```

---

## API Endpoints

| Method | Path | Body | Response |
|---|---|---|---|
| `POST` | `/analyze` | `{ columns, rows }` | `{ summary, charts[] }` |
| `POST` | `/chat` | `{ question, columns, rows }` | `{ answer }` |
| `GET` | `/health` | — | `{ status: "ok" }` |

---

## Sample Data

An `AAPL_prices.csv` file is included in the repo root for quick testing. Upload it from the **Upload Data** page.

---

## License

MIT
