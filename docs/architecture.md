# ThreatGraph X - Architecture Specification

## Executive Summary
ThreatGraph X is a next-generation defensive cybersecurity intelligence platform that transforms high-volume, isolated security telemetry into actionable, connected attack chains.

## Dual-Store Architecture

ThreatGraph X employs a purpose-fit dual-store paradigm:
- **PostgreSQL**: Serves as the immutable system of record for telemetry logs, normalized events, detection rule specifications, generated alerts, incident records, forensic evidence hashes, audit trails, and user management.
- **Neo4j / In-Memory Graph**: Serves as the high-speed graph topology engine for multi-hop entity traversal, neighborhood clustering, cyclic attack paths, and entity blast radius analysis.

```
                    ┌─────────────────────────┐
                    │ Raw Security Telemetry  │
                    │ JSON / NDJSON / CSV     │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ Normalization Engine    │
                    │ Standardized Schema     │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ Entity Extraction Engine│
                    │ Identity Deduplication  │
                    └────────────┬────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       ┌───────────────────┐           ┌───────────────────┐
       │ PostgreSQL Store  │           │ Neo4j Graph Store │
       │ Events & Alerts   │           │ Nodes & Edges     │
       └─────────┬─────────┘           └─────────┬─────────┘
                 │                               │
                 └───────────────┬───────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │ Real-time Detection     │
                    │ YAML Rules + MITRE TTPs │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ Correlation & Attack-   │
                    │ Chain Reconstruction    │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ Investigation Workbench │
                    │ & Grounded AI Assistant │
                    └─────────────────────────┘
```

## Security Event Lifecycle
1. **Ingestion**: Raw events received via REST API (`POST /api/events`, `POST /api/events/bulk`) or synthetic lab stream.
2. **Normalization**: Standardized timestamp, field names, severity calculation, action categorization.
3. **Entity Extraction**: Deterministic extraction of atomic entities (`IP`, `User`, `Host`, `Process`, `File`, `Domain`).
4. **Graph Construction**: Creation/merging of graph nodes and relationship edges.
5. **Detection Evaluation**: Windowed and threshold detection rules evaluated against incoming events.
6. **Correlation & Chain Analysis**: Multi-stage event sequences linked by shared entities, time proximity, and MITRE progression.
7. **Scoring**: Dynamic multi-factor risk score (0-100) assigned to entities, alerts, and investigations.
8. **Analyst Workflow**: Threat hunting queries, graph exploration, forensic case building, evidence management, and reporting.
