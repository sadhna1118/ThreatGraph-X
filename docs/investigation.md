# ThreatGraph X - Investigation Workbench & Case Management

## 1. Investigation Architecture
An Investigation in ThreatGraph X is a stateful analytical workspace that aggregates all context surrounding a potential security incident:
- **Root Entities**: Seed indicators (compromised user, suspicious IP, patient zero host).
- **Subgraphs & Attack Paths**: Visualized relationship topology showing lateral movement.
- **Unified Timeline**: Chronological, normalized sequence of events and correlated alerts.
- **Forensic Evidence Vault**: Attached artifact files with SHA-256 integrity verification.
- **Analyst Hypothesis & Notes**: Collaborative analytical log with tagged observables.
- **Deterministic Security Story**: Auto-generated evidence-grounded incident summary.

## 2. Evidence Integrity Vault
All uploaded or attached forensic evidence undergoes:
- Automatic SHA-256 cryptographic hashing.
- File-type and MIME sanitization.
- Sandboxed storage in non-executable partitions (`/data/evidence_vault`).
- Immutable audit linking to the collector analyst.

## 3. Incident Lifecycle Progression
Investigations can be escalated into formal Incidents with strict workflow statuses:
`OPEN` -> `INVESTIGATING` -> `CONTAINED` -> `RECOVERY` -> `CLOSED`
