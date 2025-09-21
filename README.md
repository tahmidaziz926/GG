
# Lab Manager - React Frontend 

This frontend is tailored to the FastAPI backend.

## Quick start

1. unzip the project, open the folder
2. Install deps:
   ```bash
   npm install
   ```
3. Create `.env` (optional):
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```
4. Run:
   ```bash
   npm run dev
   ```

## Notes / mapping to your backend

- Login: `POST /login/` (send `{ user_id, password }`)
- Register: `POST /register/` (send `{ email, name, password, role, ... }`)
- Axios auto-injects `X-User-Id` and `X-User-Role` from `localStorage`.
- Update services in `src/services/*.js` if you change backend routes.
- Pages included: Projects, Papers, Datasets, Reviews, Admin, Profile, Login, Register



## v2 Features
- CRUD create forms for projects, papers, datasets
- Data tables with client-side sorting and pagination
- Role-specific dashboards and quick analytics
- Improved responsive theme


v4 features:
- Edit & delete operations wired to PUT/DELETE (frontend)
- Client-side search/filter on lists
- Modal edit forms, inline icons, subtle animation, compact mobile nav
- Note: backend must expose PUT/DELETE endpoints for full functionality; otherwise delete/update will fail with 404.
