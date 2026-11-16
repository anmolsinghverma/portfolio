# Personal Portfolio (Node.js + Express + MongoDB)

## Run locally
```bash
npm install
cp .env.example .env      # set MONGODB_URI (local Mongo or Atlas)
npm run seed              # loads sample profile, projects, skills
npm run dev               # http://localhost:3000
```
Edit `src/seed/seed.js` with your real details and re-run `npm run seed`.

## Architecture
`routes → middleware (validation, rate limit) → controllers → models / services`
- `src/models` Mongoose schemas (Profile, Project, Skill, Message)
- `src/controllers` request handlers; `src/services/mail.service.js` Nodemailer
- `public/` mobile-first static frontend that renders from the API

## API
| Method | Path | Purpose |
|---|---|---|
| GET | /api/profile, /api/projects, /api/skills | Portfolio data |
| POST | /api/contact | `{name, email, subject?, message}`; validated, saved, emailed |
| GET | /api/health | Liveness check |

## Security
Secrets live only in `.env` (git-ignored). Helmet headers + CSP, 10 kb body limit, contact rate limit (5 per 15 min per IP), validation, honeypot field, plain-text emails, and no HTML injection on the client.

## Deploy
- **Docker:** `docker compose up -d --build`, then `docker compose exec app npm run seed`.
- **Render / Railway:** create a Web Service from the repo, build `npm install`, start `npm start`, add the `.env` variables in the dashboard, and use a MongoDB Atlas URI. Health check path: `/api/health`.
- Put HTTPS in front (the platforms above do this for you) and allow the host's IP in Atlas network access.
