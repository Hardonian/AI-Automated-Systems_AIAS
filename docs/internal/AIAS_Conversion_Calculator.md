# AIAS Conversion Calculator Logic

## Inputs
- Average monthly tokens
- Average monthly workflow runs
- Average monthly support hours
- Iteration intensity (1–5)

## Decision Rules
- If support hours are high OR iteration intensity is `>= 4` → recommend managed tier.
- If usage is low and there is a single workflow → recommend Foundation or Standalone.
- If month-over-month usage growth exceeds threshold → recommend a capacity band upgrade.

## Outputs
- Recommended engagement tier
- Suggested monthly retainer
- Suggested capacity band
- Upgrade trigger note
