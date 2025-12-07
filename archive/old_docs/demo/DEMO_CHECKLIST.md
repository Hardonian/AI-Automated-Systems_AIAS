# Demo Checklist — AIAS Platform

**Purpose:** Pre-demo checklist and quick recovery tips  
**Last Updated:** 2025-01-31

---

## Pre-Demo Checklist

### Environment Setup

- [ ] **App Running:**
  - [ ] Local: `pnpm dev` running, no errors
  - [ ] OR Production: URL ready, no errors
  - [ ] Browser open to app URL

- [ ] **Environment Variables:**
  - [ ] `.env.local` exists (local) OR Vercel env vars set (production)
  - [ ] Supabase credentials configured
  - [ ] Test account credentials ready (if using existing account)

- [ ] **Database:**
  - [ ] Migrations applied (if needed)
  - [ ] Demo data seeded (if needed)
  - [ ] Test account exists (if using existing account)

---

### Demo Data

- [ ] **Test Account:**
  - [ ] Email: `demo@example.com` (or test email)
  - [ ] Password: `[secure password]`
  - [ ] Account created and verified

- [ ] **Test Workflows:**
  - [ ] Sample workflow created (if needed)
  - [ ] Test order exists (if testing Shopify automation)
  - [ ] Test data seeded (if needed)

---

### Browser Setup

- [ ] **Browser:**
  - [ ] Chrome or Firefox (recommended)
  - [ ] Browser cache cleared (if issues)
  - [ ] Dev tools closed (clean demo)
  - [ ] Full screen mode (if presenting)

---

### Backup Plans

- [ ] **Backup URLs:**
  - [ ] Production URL ready (if local fails)
  - [ ] Screenshots/videos ready (if app fails)
  - [ ] Test account credentials ready (if signup fails)

---

## Quick Recovery Tips

### App Not Loading

**Symptoms:** App doesn't load, blank page, errors

**Quick Fix:**
1. Check dev server: `pnpm dev` running?
2. Check browser console: Any errors?
3. Try production URL: `https://your-app.vercel.app`
4. Clear browser cache: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

**If Still Fails:**
- Use screenshots/videos as backup
- Explain: "Let me show you a quick video of how it works"

---

### Signup Fails

**Symptoms:** Signup form doesn't submit, errors on signup

**Quick Fix:**
1. Check browser console: Any errors?
2. Check Supabase credentials: `.env.local` configured?
3. Use test account: Skip signup, use existing account

**If Still Fails:**
- Use test account: `demo@example.com` / `[password]`
- Explain: "Let me use a test account to show you the workflow builder"

---

### Workflow Builder Not Loading

**Symptoms:** Workflow builder blank, errors, doesn't load

**Quick Fix:**
1. Check browser console: Any errors?
2. Try different browser: Chrome, Firefox
3. Use template: Skip custom workflow, use pre-built template
4. Refresh page: Cmd+R (Mac) or Ctrl+R (Windows)

**If Still Fails:**
- Use screenshots: Show workflow builder screenshot
- Explain: "Let me show you how the workflow builder works"

---

### Database Connection Fails

**Symptoms:** Can't save workflows, data not loading

**Quick Fix:**
1. Check Supabase credentials: `.env.local` configured?
2. Check Supabase project: Is it active?
3. Check network: Internet connection working?
4. Try production: Use production URL (if local fails)

**If Still Fails:**
- Use screenshots: Show workflow examples
- Explain: "Let me show you some example workflows"

---

### Slow Performance

**Symptoms:** App slow, workflows take time to load

**Quick Fix:**
1. Check network: Internet connection fast?
2. Clear cache: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
3. Use production: Production URL usually faster
4. Reduce demo scope: Skip less important steps

**If Still Fails:**
- Use screenshots: Show key features
- Explain: "Let me show you the key features"

---

## Common Issues

### Issue: Port 3000 Already in Use

**Fix:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 pnpm dev
```

---

### Issue: Environment Variables Not Loading

**Fix:**
1. Check `.env.local` exists (not `.env`)
2. Restart dev server
3. Verify variable names match exactly (case-sensitive)

---

### Issue: Supabase Connection Fails

**Fix:**
1. Verify Supabase credentials in `.env.local`
2. Check Supabase project is active
3. Verify `DATABASE_URL` format is correct

---

## Demo Best Practices

1. **Test Before Demo:**
   - Run through demo flow once before actual demo
   - Verify all steps work
   - Have backup plan ready

2. **Keep It Simple:**
   - Focus on one use case (Sarah's Shopify automation)
   - Skip less important steps if time is short
   - End with aha moment (workflow executes successfully)

3. **Have Backup:**
   - Screenshots/videos ready
   - Test account ready
   - Production URL ready

4. **Stay Calm:**
   - If something fails, use backup plan
   - Don't panic—explain what you're showing
   - Focus on value, not perfect demo

---

## Related Documents

- `demo/DEMO_PATH.md` — Exact demo steps
- `demo/DEMO_SCRIPT.md` — Founder's script
- `docs/SETUP_LOCAL.md` — Local setup guide

---

**Last Updated:** 2025-01-31  
**Next Review:** When demo setup changes
