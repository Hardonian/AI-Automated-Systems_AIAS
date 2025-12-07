# Migration Guardian Log

This log is maintained by the Migration Guardian agent.


---
## Run: run-2025-12-06T18-43-02
**Timestamp:** 2025-12-06T18:43:02.949Z (UTC) / Sat Dec 06 2025 18:43:02 GMT+0000 (Coordinated Universal Time) (Local)

### Environment & Database
- **Env file used:** process.env
- **DB host:** N/A
- **MODE:** UNKNOWN

### Pre-run Status
- **Status:** error
- **Pending migrations:** None

### Commands Executed

### Apply Results
- **Success:** ❌ No

### Redis Connectivity
- **Status:** NO CONFIG FOUND (skipped)

### Reality Verification (GO-LIVE CHECK)
- **Prisma status:** ❌ FAILED
- **DB connectivity:** ❌ FAILED
- **Schema checks:** ❌ FAILED
- **Health queries:** ❌ FAILED

**Details:**

### Outcome
**STATE:** FAILED – SEE ERRORS ABOVE

### Errors
```
No DATABASE_URL or SUPABASE_DB_URL found in environment
```

---
## Run: go-live-migration-2025-12-06T23-00-48
**Timestamp:** 2025-12-06T23:00:48Z (UTC) / 2025-12-06 23:00:48 UTC (Local)

### Environment & Database
- **Env file used:** Environment variable (DATABASE_URL provided directly)
- **DB host:** db.pegqwxcukwqzbjuinwmf.supabase.co
- **Database name:** postgres
- **Connection string format:** postgresql://postgres:***@db.pegqwxcukwqzbjuinwmf.supabase.co:5432/postgres?sslmode=require

### Pre-run Status
- **Prisma migrate status:** ❌ FAILED - Connection error
- **Pending migrations:** Unknown (cannot connect to check)
- **Migrations directory:** Not found (apps/web/prisma/migrations/ does not exist)
- **Schema file:** Exists at apps/web/prisma/schema.prisma

### Commands Executed
1. `pnpm prisma migrate status` - FAILED
   - Error: P1001: Can't reach database server at `db.pegqwxcukwqzbjuinwmf.supabase.co:5432`
2. `pnpm prisma migrate deploy` - FAILED  
   - Error: P1001: Can't reach database server at `db.pegqwxcukwqzbjuinwmf.supabase.co:5432`

### Connection Issues
- **Network connectivity:** Cannot reach Supabase database server from this environment
- **Possible causes:**
  - Firewall/network restrictions blocking outbound connections
  - IP whitelist restrictions on Supabase project
  - Network configuration in remote environment
- **Attempted solutions:**
  - Added `?sslmode=require` to connection string
  - Tried connection pooler port (6543)
  - Verified DATABASE_URL format is correct

### Apply Results
- **Success:** ❌ No - Cannot establish database connection
- **Migrations applied:** 0 (connection failed before execution)
- **Migration IDs applied:** N/A

### Reality Verification (GO-LIVE CHECK)
- **Prisma status:** ❌ FAILED - Cannot connect
- **DB connectivity:** ❌ FAILED - Network error
- **Schema checks:** ❌ SKIPPED - Cannot connect
- **Health queries:** ❌ SKIPPED - Cannot connect

### Archive
- **Archive path:** N/A (no migrations were applied)
- **Migrations archived:** 0

### Outcome
**STATE:** FAILED – NETWORK CONNECTION ERROR

**Error Details:**
```
Error: P1001: Can't reach database server at `db.pegqwxcukwqzbjuinwmf.supabase.co:5432`

Please make sure your database server is running at `db.pegqwxcukwqzbjuinwmf.supabase.co:5432`.
```

**Recommendations:**
1. Verify network connectivity from this environment to Supabase
2. Check Supabase project IP whitelist settings
3. Ensure firewall rules allow outbound connections to port 5432
4. Consider running migrations from an environment with network access to Supabase
5. Verify DATABASE_URL credentials are correct and account has necessary permissions

