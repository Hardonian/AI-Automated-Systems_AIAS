# AIAS Internal Cost Model

## Variables
- `H` = Human contact hours
- `T_in` = Input tokens
- `T_out` = Output tokens
- `R` = Workflow runs
- `C_compute` = Compute hours
- `S` = Software/tooling pass-through
- `M_target` = Target gross margin (example: 70%)

## Cost Calculations
- Labor Cost = `H × blended internal rate`
- LLM Cost = `(T_in × rate_in) + (T_out × rate_out)`
- Ops Cost = Monitoring + support buffer
- Overhead = Fixed per-client allocation

## Pricing Structure
### Base Fee Covers
- Minimum labor
- Minimum usage band
- Overhead
- Margin

### Capacity Band Covers
- Expected tokens
- Runs
- Compute

## Upgrade Rule
If usage exceeds the included band for 2 consecutive billing cycles, mandate an upgrade to the next capacity band.

Include a goodwill spike buffer. Never expose token math publicly.
