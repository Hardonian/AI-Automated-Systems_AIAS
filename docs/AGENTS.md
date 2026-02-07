# AI Agents

The AIAS Platform uses a multi-agent architecture to handle complex business workflows.

## Sandboxed Demo Agent

For the [Live Demo](/demo), we use a specialized sandboxed agent designed for data reconciliation.

### Capabilities

- **Data Fetching**: Simulates retrieving data from multiple sources (e.g., Shopify, Wave).
- **Reconciliation**: Compares datasets to identify discrepancies, missing records, or anomalies.
- **Executive Reporting**: Generates human-readable Markdown summaries for business stakeholders.
- **Evidence Generation**: Produces structured JSON evidence for technical audit trails.

### Logic & Thresholds

The agent includes deterministic threshold logic:

- **Automatic Reconciliation**: If discrepancies are below a certain threshold (e.g., < 2%), the agent automatically reconciles the data.
- **Human-in-the-Loop**: If discrepancies exceed the threshold, the agent flags the issue for human review, providing a detailed summary of the conflict.

## Production Agents

Production agents are configured via the `agents` table in Supabase and executed using the `AgentExecutor`.

### Planning Styles

- **Sequential**: Steps executed in a fixed order.
- **Parallel**: Independent steps executed simultaneously.
- **Hierarchical**: Master agent delegating to sub-agents.
- **Reactive**: Responding to real-time events and triggers.
