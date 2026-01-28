# Vercel Deployment Instructions

I have configured your Django backend for deployment on Vercel. Here are the steps you need to follow to get it running:

## 1. Push Changes to GitHub
Commit and push the changes I made to your repository:
- `vercel.json` (Configuration for Vercel)
- `requirements.txt` (Added `whitenoise`)
- `daystar_sdg/settings.py` (Configured `ALLOWED_HOSTS` and Static files)
- `daystar_sdg/wsgi.py` (Exposed `app` alias)

## 2. Vercel Project Settings
Go to your Vercel Project Dashboard for the backend (`sdg-backend-nine`) and ensure the following **Environment Variables** are set:

| Variable Name | Value |
|h|h|
| `DJANGO_SETTINGS_MODULE` | `daystar_sdg.settings` |
| `SECRET_KEY` | *(Your random secret key)* |
| `DEBUG` | `False` |
| `DATABASE_URL` | *(Your PostgreSQL connection string - e.g. from Supabase/Neon)* |

> **Note on Database:** Vercel is serverless and **cannot** use the local `db.sqlite3` file permanently. You **must** connect to an external PostgreSQL database (like Supabase, Neon, or Vercel Postgres) for your data to persist.

## 3. Redeploy
- Go to the **Deployments** tab in Vercel.
- Click **Redeploy** on the latest commit (or push a new commit to trigger it).

## 4. Verify
After deployment, check:
- `https://sdg-backend-nine.vercel.app/api/sdg/` - Should return a JSON list of SDGs.
- `https://sdg-backend-nine.vercel.app/admin/` - Should show the Django admin login.

## Troubleshooting 404s
If you still see 404s:
1. Check the **Functions** tab in Vercel logs to see if the Python application is starting correctly.
2. Ensure your `requirements.txt` installed successfully during the build.
3. If using a database, ensure the migration command ran. You can run migrations from your local machine connected to the remote DB.
