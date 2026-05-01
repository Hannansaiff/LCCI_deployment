# LCCI Deployment Fix & Completion TODO

## Approved Plan Implementation Steps

### Phase 1: File Edits & Config Updates
- [x] Create/update TODO.md with step tracking
- [x] Update vercel-production.env: Set NEXT_PUBLIC_API_URL to https://lcci-production.up.railway.app, remove unused MySQL DB vars
- [x] Update railway-production.env: Add Vercel preview/prod domains to ALLOWED_ORIGINS
- [x] Edit lcci-site/backend-python/main.py: Re-enabled Base.metadata.create_all(bind=engine) for Railway init
- [ ] Edit lcci-site/backend-python/app/config.py: No change needed (env override handles)

### Phase 2: Commit & PR
- [x] Committed & pushed fixes to PR #1
- [x] Merged PR #1 to main (76efe12), deleted branch

### Phase 3: Verification
- [ ] Check Railway logs: Tables created? /health OK?
- [ ] Check Vercel redeploy on main
- [ ] Test frontend API calls (browser console)
- [ ] Complete deployment ✅

Next step: Update environment files.

