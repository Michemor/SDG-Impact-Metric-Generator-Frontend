# Daystar SDG Impact and Evidence Dashboard

## About

The Daystar SDG Impact Dashboard & Evidence Generator is an automated platform that tracks and communicates the university’s progress toward the UN Sustainable Development Goals. By analyzing research, curriculum, and community activities, it generates real-time indicators and longitudinal data to benchmark performance against other institutions. Ultimately, the system simplifies strategic planning and reporting by providing one-click, evidence-based reports for donors and accreditation bodies.

## Features

• Automated SDG classification of projects and publications
• Real-time impact metrics and visualizations
• Drill-down views linking SDGs to specific activities
• Exportable reports for accreditation and donor reporting

## Tech Stack

Frontend: React.js/Vite

## Development

### Install dependencies

```bash
# Frontend
cd sdg-impact-dashboard
npm install

# Backend API
cd ../server
npm install
```

### Run the stack locally

```bash
# Terminal 1 - start the API (default port 4000)
npm run dev

# Terminal 2 - start the Vite dev server (proxies /api to 4000)
cd ../sdg-impact-dashboard
npm run dev
```

Set `VITE_API_BASE_URL` if the API exposes a different base URL.

## Application features

- Reports page with exportable PDF and CSV views, plus SDG-level drill-down to projects and publications.
- Record metadata panel that surfaces linked departments, researchers, and SDGs.
- Add Project/Publication form with client and server validation, automatic SDG, department, and researcher linkage.

## API overview

Base URL: `/api`

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/metadata` | Lists SDGs, departments, and researchers for form dropdowns. |
| GET | `/reports/summary` | Returns aggregate counts for each SDG plus global totals. |
| GET | `/reports/sdg/:sdgId` | Returns drill-down data (projects, publications, researchers, departments) for a specific SDG. |
| GET | `/records/:recordId` | Retrieves a single project or publication with enriched metadata. |
| POST | `/records` | Creates a new project or publication and returns the enriched record plus refreshed summary data. |

### Record payload schema

```json
{
	"title": "string (min 3 chars)",
	"description": "string (min 20 chars)",
	"type": "project | publication",
	"sdgIds": [1, 5],
	"departmentId": "dept-1",
	"researcherIds": ["res-1", "res-2"],
	"year": 2024
}
```

Validation occurs on both the frontend and backend; invalid submissions return HTTP 400 with field-level feedback.

## Getting Started

### Prerequisites

### Installation

### Project Structure

### API and Data integration

### Authors

Michelle Jemator | (https://github.com/Michemor)
Vivian Njoroge | (username)
