# TODO Application (Django)

This is a minimal Django TODO application scaffold implementing the features from `requirements.md`:

- Task model with title, description, due date, priority, status, timestamps and soft-delete
- CRUD views (create, edit, delete, resolve)
- Weekly dashboard with charts (Chart.js)

Setup (development)

```bash
cd /workspaces/ai-dev-tools/TODO\ Application
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Open http://127.0.0.1:8000/ to view the app. The admin is available at `/admin/`.

Notes
- This is a development scaffold. For production, set SECRET_KEY, DEBUG=False, configure allowed hosts and use a production DB (Postgres).
- Chart.js and Tailwind are included via CDN in templates for quick setup.
