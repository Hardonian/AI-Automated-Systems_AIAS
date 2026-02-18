# AIAS STRIDE Threat Model

## Scope and assumptions

This threat model evaluates the current public AIAS site architecture as implemented in this repository: static-first Next.js routes, a client-side intake form, optional client-side webhook forwarding, and no first-party backend/API routes in the app directory.

## System inventory

- **Public web routes**: marketing pages, pricing, case studies, blog, FAQ, legal pages.
- **Contact and intake workflow**: `/contact` route, multi-step `IntakeForm`, client-side classification logic, optional `NEXT_PUBLIC_INTAKE_WEBHOOK_URL` submission.
- **Automation demo**: `/automation-demo` static walkthrough that uses mock content and no privileged actions.
- **External integrations**: calendly link, optional intake webhook URL, Vercel analytics/speed insights packages.
- **Content editing surface**: code-managed content via `src/content/site.ts` and repository-controlled docs.

## Trust boundaries

1. **Unauthenticated public browser → static site assets**.
2. **Browser client runtime → optional third-party webhook endpoint**.
3. **Maintainer/editor commit access → published static content and legal copy**.
4. **External social/scheduling destinations** (mailto, Calendly, social links) outside AIAS control.

---

## STRIDE analysis by surface

### 1) Contact forms and intake workflows

**Assets**
- Inquiry metadata (org type, problem category, urgency, scope, budget, optional email).
- Classification outcome and rationale.
- Brand trust in intake and follow-up handling.

**Entry points**
- Form fields in `IntakeForm`.
- Optional webhook endpoint set by `NEXT_PUBLIC_INTAKE_WEBHOOK_URL`.

**Potential abuse scenarios**
- **Spoofing**: attacker submits fake leads with victim email addresses.
- **Tampering**: client manipulates request payload prior to webhook send.
- **Repudiation**: no server-side audit trail in default static-only mode.
- **Information disclosure**: browser console output and downloaded JSON artifacts can leak sensitive user-entered context on shared devices.
- **DoS**: no built-in rate limiting if webhook is enabled to a weak downstream endpoint.
- **Prompt injection**: malicious free-text input is currently low because fields are mostly bounded selects and optional email only.

**Injection and leakage vectors**
- JSON payload to webhook can carry attacker-controlled strings (`email`) and classification combinations.
- No server-side sanitization because no server.
- Browser console logging fallback can expose payload to local observers.

**Mitigation status**
- Strong client schema validation (`zod`) and bounded enums for most inputs.
- Honeypot field blocks simplistic bots.
- Graceful degradation avoids hard failures and keeps UX predictable.

**Residual risk**: **Medium** when webhook is configured; **Low-Medium** in pure static mode.

### 2) API routes

**Assets**
- N/A (no implemented first-party API routes found in the current app).

**Entry points**
- None in repository runtime path.

**Potential abuse scenarios**
- Drift risk: future contributors may add routes without auth/rate limiting controls.

**Mitigation status**
- Static-first checks exist in verification scripts, but no explicit API route policy test.

**Residual risk**: **Low currently**, **Medium if architecture drift occurs**.

### 3) Demo flows (`/automation-demo` and workflow sandbox narratives)

**Assets**
- Perceived capabilities of AIAS automation approach.
- Prospect trust and interpretation of demo boundaries.

**Entry points**
- Public route access and user interpretation of showcased flow steps.

**Potential abuse scenarios**
- **Social engineering**: attacker references demo language to impersonate AIAS delivery certainty.
- **Tampering by narrative**: prospects may assume demo implies production guarantees.
- **DoS**: static page has negligible server-side DoS exposure.

**Mitigation status**
- Route copy states static/safe walkthrough behavior.
- No privileged execution path or data mutation from demo.

**Residual risk**: **Low** technical risk, **Medium** reputational/expectation risk.

### 4) Client data handling

**Assets**
- Contact email, intake preference data, engagement details.
- Consulting communications and legal trust obligations.

**Entry points**
- Contact form, mailto links, scheduling flow, optional webhook.

**Potential abuse scenarios**
- **Information disclosure** through insecure downstream webhook endpoint.
- **Repudiation** if client disputes submitted data and no durable server log exists.
- **Compliance drift** if claims imply certifications not formally achieved.

**Mitigation status**
- Privacy and terms copy exists in site content.
- Public site avoids server-side persistence by default.

**Residual risk**: **Medium** due to third-party handling dependencies and process-level controls outside code.

### 5) External integrations

**Assets**
- Lead flow continuity, brand integrity, analytics metadata.

**Entry points**
- Calendly link, social links, optional webhook URL, analytics libraries.

**Potential abuse scenarios**
- Redirect/phishing confusion if external links are spoofed by attackers off-site.
- Supply-chain exposure via third-party package compromise.

**Mitigation status**
- Minimal integration count and static rendering reduce attack complexity.
- Dependency version pinning/overrides provide partial hardening.

**Residual risk**: **Medium** (external dependency and brand-impersonation risk).

### 6) Admin panels

No admin panel or authenticated back-office surface is implemented in this repo.

**Residual risk**: **Low in current architecture**.

### 7) CMS/content editing surfaces

**Assets**
- Core legal text, claims, trust badges, and service descriptions.

**Entry points**
- Git commits to `src/content/site.ts` and docs.

**Potential abuse scenarios**
- Marketing overstatement introduced by content edits.
- Inconsistent legal language across pages and docs.

**Mitigation status**
- Typed content model and validation schema reduce malformed content risk.
- Messaging contract discourages absolute claims.

**Residual risk**: **Medium** (governance/process risk more than exploit risk).

---

## Cross-cutting STRIDE matrix

| Threat | Most exposed surfaces | Current posture | Residual |
|---|---|---|---|
| Spoofing | Intake identity, brand impersonation | No auth on intake (expected), public email/links | Medium |
| Tampering | Client-side payload before webhook | No server trust anchor; bounded fields help | Medium |
| Repudiation | Intake events | No first-party immutable event log in static mode | Medium |
| Information Disclosure | Webhook forwarding, downloaded artifacts, browser console | Limited collected fields, but local/third-party exposure remains | Medium |
| Denial of Service | Optional webhook target, public routes | Static pages resilient; webhook depends on downstream limits | Low-Medium |
| Elevation of Privilege | App runtime | No auth/admin/API layers in current app | Low |

## Priority hardening recommendations

1. Add explicit intake data-handling notice near submit button (what is transmitted, retention expectation, and no sensitive data request).
2. If webhook is used in production, require downstream auth (signed requests), server-side validation, and rate limiting.
3. Remove payload-level `console.info` in production builds or gate behind dev flag.
4. Add anti-automation controls on intake (time-based honeypot check or challenge) without breaking static-first behavior.
5. Add a repository check preventing unreviewed introduction of API routes/server actions.
6. Add a documented incident-response contact and abuse-report process to reduce social-engineering impact.
