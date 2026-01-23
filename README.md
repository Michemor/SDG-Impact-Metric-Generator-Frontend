# Daystar SDG Impact and Evidence Dashboard

## About

The Daystar SDG Impact Dashboard & Evidence Generator is an automated platform that tracks and communicates the university’s progress toward the UN Sustainable Development Goals. By analyzing research, curriculum, and community activities, it generates real-time indicators and longitudinal data to benchmark performance against other institutions. Ultimately, the system simplifies strategic planning and reporting by providing one-click, evidence-based reports for donors and accreditation bodies.

## Features

• Automated SDG classification of projects and publications

• Real-time impact metrics and visualizations

• Drill-down views linking SDGs to specific activities

• Exportable reports for accreditation and donor reporting

## Tech Stack

- **Frontend:** React.js / Vite
- **Backend:** Django / Django REST Framework
- **Database:** PostgreSQL (configurable)

## Development

### Install dependencies

```bash
# Frontend
cd sdg-impact-dashboard
npm install

# Backend API (Django)
cd ../backend
pip install -r requirements.txt
```

### Run the stack locally

```bash
# Terminal 1 - start the Django API (default port 8000)
cd backend
python manage.py migrate
python manage.py runserver

# Terminal 2 - start the Vite dev server
cd sdg-impact-dashboard
npm run dev
```

Set `VITE_API_BASE_URL` in your environment to point to the Django backend (e.g., `http://localhost:8000/api`).

## Application features

- Reports page with exportable PDF and CSV views, plus SDG-level drill-down to projects and publications.
- Record metadata panel that surfaces linked departments, researchers, and SDGs.
- Add Project/Publication form with client and server validation, automatic SDG, department, and researcher linkage.

## Getting Started

### Prerequisites

Before running the dashboard, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Python** (v3.10 or higher) - [Download](https://python.org/)
- **pip** (comes with Python)
- **Git** - [Download](https://git-scm.com/)

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd "SDG Frontend"
```

#### 2. Install Frontend Dependencies

```bash
cd sdg-impact-dashboard
npm install
```

#### 3. Install Backend (Django) Dependencies

```bash
cd ../backend
pip install -r requirements.txt
```

#### 4. Set Up the Database

```bash
cd backend
python manage.py migrate
```

#### 5. (Optional) Create a Superuser

```bash
python manage.py createsuperuser
```

### Running the Application

You need to run **both** the Django backend and the frontend development server.

#### Step 1: Start the Django Backend

Open a terminal and run:

```bash
cd backend
python manage.py runserver
```

The Django API will start on **http://localhost:8000**

#### Step 2: Start the Frontend Development Server

Open a **new terminal** and run:

```bash
cd sdg-impact-dashboard
npm run dev
```

The frontend will start on **http://localhost:5173** (or the next available port)

#### Step 3: Access the Dashboard

Open your browser and navigate to:

```
http://localhost:5173
```

To access the Django admin panel, go to **http://localhost:8000/admin**

### Quick Start (Summary)

```bash
# Terminal 1 - Start Django Backend
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Terminal 2 - Start Frontend
cd sdg-impact-dashboard
npm install
npm run dev
```

### Environment Variables

#### Frontend

| Variable | Description | Default |
| -------- | ----------- | ------- |
| `VITE_API_BASE_URL` | Base URL for the Django API | `http://localhost:8000/api` |

#### Backend (Django)

Create a `.env` file in the `backend/` directory:

| Variable | Description | Example |
| -------- | ----------- | ------- |
| `SECRET_KEY` | Django secret key | `your-secret-key` |
| `DEBUG` | Debug mode | `True` |
| `DATABASE_URL` | Database connection string | `postgres://user:pass@localhost/dbname` |

### Project Structure

```
SDG Frontend/
├── sdg-impact-dashboard/    # React/Vite frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components (Dashboard, Projects, Reports, etc.)
│   │   ├── services/        # API client and data services
│   │   └── data/            # Mock data and static assets
│   └── package.json
├── backend/                 # Django REST API backend
│   ├── daystar_sdg/         # Django project settings
│   ├── impact_tracker/      # Main Django app (models, views, serializers)
│   ├── services/            # SDG classifier and business logic
│   └── requirements.txt
└── README.md
```

### Troubleshooting

| Issue | Solution |
| ----- | -------- |
| `npm install` fails | Ensure Node.js v18+ is installed. Try deleting `node_modules` and `package-lock.json`, then run `npm install` again. |
| `pip install` fails | Ensure Python 3.10+ is installed. Try using a virtual environment: `python -m venv venv` then activate it. |
| API connection error | Make sure the Django server is running on port 8000 before starting the frontend. |
| Database errors | Run `python manage.py migrate` to apply all migrations. |
| Port already in use | Kill the process using the port or change the port (e.g., `python manage.py runserver 8001`). |
| CORS errors | Ensure `django-cors-headers` is configured in `settings.py` and the frontend URL is allowed. |

### Building for Production

```bash
# Build the frontend
cd sdg-impact-dashboard
npm run build

# The built files will be in the dist/ folder
npm run preview  # Preview the production build locally
```

### Authors

Michelle Jemator | [GitHub](https://github.com/Michemor) | Frontend
Vivian Njoroge | [Github](https://github.com/Vivnjoroge) | Frontend
Cathy Matu | [Github](https://github.com/Cathy-matu) | Backend
Raphael Osindi | [Github](https://github.com/raphael4008) | Backend

