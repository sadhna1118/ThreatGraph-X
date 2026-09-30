# THREATGRAPH X
## Threat Hunting, Security Graph & Attack-Chain Intelligence Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Python](https://img.shields.io/badge/python-3.12%2B-blue.svg)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-teal.svg)]()
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)]()
[![Neo4j](https://img.shields.io/badge/Neo4j-5.18-008cc1.svg)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 1. Executive Problem & Platform Differentiator

Traditional Security Operations Center (SOC) dashboards and legacy SIEMs drown security analysts in thousands of disconnected, atomic log events. When an adversary moves across a corporate environment, they leave fragments across authentication logs, process trees, network flows, and file modifications. 

**ThreatGraph X** bridges the analytical gap by transforming raw, multi-source security telemetry into connected entity graphs, dynamically correlating multi-stage attacker actions into directed attack chains, and grounding incident investigation findings in verifiable forensic evidence.

```
RAW SECURITY EVENTS
        ↓
ENTITY EXTRACTION & DEDUPLICATION
        ↓
RELATIONSHIP GRAPH (Neo4j / NetworkX)
        ↓
BEHAVIORAL BASELINE & STATISTICAL PROFILING
        ↓
EVENT & ALERT CORRELATION
        ↓
ATTACK-CHAIN RECONSTRUCTION
        ↓
THREAT HUNTING QUERY ENGINE
        ↓
INVESTIGATION WORKBENCH
        ↓
INCIDENT INTELLIGENCE & GROUNDED AI COPILOT
```

---

## 2. Core Architectural Highlights

```
                 ┌─────────────────────────────────────────┐
                 │          ThreatGraph X UI               │
                 │   React 19 + TypeScript + Tailwind      │
                 │ Interactive Canvas Graph + Workbench    │
                 └───────────────────┬─────────────────────┘
                                     │ (REST + JSON / JWT)
                                     ▼
                 ┌─────────────────────────────────────────┐
                 │             FastAPI API                 │
                 │  Dependency Injection + Pydantic v2     │
                 └───────────────────┬─────────────────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              ▼                      ▼                      ▼
        Event Engine          Threat Hunter           Investigation
      Ingestion & Norm         Query Engine           Case Workbench
              │                      │                      │
              ▼                      ▼                      ▼
      Entity Extractor        DSL Evaluator          Security Story
              │                      │                  Generator
              ▼                      ▼                      │
     Relationship Engine     Saved Hunt History             ▼
              │                      │               Evidence Vault
       ┌──────┴──────────────┐       │                 (SHA-256)
       ▼                     ▼       │                      │
  PostgreSQL               Neo4j     │                      ▼
 Telemetry Events      Entity Graph  │               Grounded AI Layer
 Detection Alerts      Attack Paths  │               Evidence-Locked
 Case Investigations   Centrality    │               Zero Hallucination
 Audit Logs            Blast Radius  │
              │                      │
              ▼                      ▼
        Correlation & Detection Rule Engine (26 YAML Rules)
              │
              ▼
   Behavioral Baseline & Anomaly Profiling Engine (Z-Scores)
              │
              ▼
   Local Threat Intelligence & IOC Correlation Provider
```

### PostgreSQL vs. Neo4j Responsibilities
| Capability | PostgreSQL (Relational Engine) | Neo4j / NetworkX (Graph Engine) |
| :--- | :--- | :--- |
| **Telemetry Storage** | High-throughput normalized raw log events (`events` table) | Not stored in graph (prevents graph database bloat) |
| **Transactional Records** | Alerts, Investigations, Incidents, Case Notes, Audit Trails | Read-only references to Investigation & Alert IDs |
| **Entity State** | Asset metadata, risk scores, criticality ranking | Node representations with label indexing (`User`, `Host`, `IP`, `Process`) |
| **Topology & Kill-Chains** | Foreign-key adjacency (expensive multi-join queries) | Native index-free adjacency graph traversals (`-[:CONNECTED_TO]->`) |
| **Path Finding** | Impractical for variable-length chains | Native BFS shortest path, blast radius, cycle detection, attack-chain depth |

---

## 3. Project Structure

```
threatgraph-x/
├── .github/workflows/ci.yml           # GitHub Actions CI pipeline
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI root application & lifecycle
│   │   ├── config.py                  # Pydantic Settings & environment parsing
│   │   ├── dependencies.py            # RBAC, JWT Auth, Database sessions, Graph engine
│   │   ├── api/                       # 16 Specialized REST Endpoints
│   │   │   ├── auth.py                # JWT registration, login, profile (/api/auth)
│   │   │   ├── events.py              # Ingestion, bulk streaming, search (/api/events)
│   │   │   ├── entities.py            # Correlated asset inventory (/api/entities)
│   │   │   ├── graph.py               # Graph stats, neighborhood, attack paths (/api/graph)
│   │   │   ├── detections.py          # Detection rule lifecycle & testing (/api/detections)
│   │   │   ├── alerts.py              # Alert triage & false-positive auditing (/api/alerts)
│   │   │   ├── hunting.py             # Threat hunting DSL engine (/api/hunting)
│   │   │   ├── behavior.py            # Behavioral baselines & anomaly stats (/api/behavior)
│   │   │   ├── iocs.py                # Threat intelligence indicator feed (/api/iocs)
│   │   │   ├── mitre.py               # ATT&CK tactic & technique coverage (/api/mitre)
│   │   │   ├── investigations.py      # Case workbench, notes, evidence (/api/investigations)
│   │   │   ├── incidents.py           # Incident response lifecycle (/api/incidents)
│   │   │   ├── scenarios.py           # Scenario simulation runner (/api/scenarios)
│   │   │   ├── ai.py                  # Grounded AI Copilot assistant (/api/ai)
│   │   │   ├── reports.py             # Markdown, JSON, CSV report generation (/api/reports)
│   │   │   └── dashboard.py           # Executive SOC summary metrics (/api/dashboard)
│   │   ├── models/                    # SQLAlchemy 2.0 Database Models (14 tables)
│   │   ├── schemas/                   # Pydantic v2 Request/Response Schemas
│   │   ├── services/                  # Business Logic & Core Processing Engines
│   │   │   ├── normalization.py       # Event schema normalizer
│   │   │   ├── entity_extractor.py    # Deterministic entity & edge extraction
│   │   │   ├── graph_builder.py       # Graph synchronization engine
│   │   │   ├── ingestion.py           # High-speed event pipeline
│   │   │   ├── detection.py           # YAML rule evaluator
│   │   │   ├── correlation.py         # Multi-stage event correlation engine
│   │   │   ├── risk.py                # 0-100 multi-factor risk scoring
│   │   │   ├── behavior.py            # Statistical baseline & anomaly detection
│   │   │   ├── threat_intel.py        # Local IOC correlation provider
│   │   │   ├── timeline.py            # Investigation timeline builder
│   │   │   ├── investigation.py       # Case workbench & security story generator
│   │   │   ├── scenario_runner.py     # Attack scenario simulation engine
│   │   │   └── reporting.py           # Multi-format report compiler
│   │   ├── graph/                     # Dual Graph Layer
│   │   │   ├── graph_engine.py        # In-Memory NetworkX MultiDiGraph engine
│   │   │   ├── neo4j_client.py        # Async Neo4j Bolt driver with Cypher queries
│   │   │   └── graph_algorithms.py    # Path traversal, blast radius, degree centrality
│   │   ├── ai/                        # Grounded AI & Anti-Hallucination Layer
│   │   │   ├── prompts.py             # Strict defensive prompts with injection filters
│   │   │   ├── retrieval.py           # Grounded evidence & subgraph context retriever
│   │   │   ├── provider.py            # LLM provider abstraction
│   │   │   └── investigation_assistant.py # Evidence citation & verification engine
│   │   └── database/
│   │       ├── database.py            # Async engine, sessionmaker, table init
│   │       └── migrations/            # Database schema migration configuration
│   └── tests/                         # 34 Automated Unit, Integration & Security Tests
├── frontend/
│   ├── src/
│   │   ├── App.tsx                    # React router & Cyber Dark layout shell
│   │   ├── main.tsx                   # React 19 DOM mount
│   │   ├── components/
│   │   │   ├── layout/                # Cyber Navbar & Sidebar
│   │   │   ├── graph/                 # Interactive Canvas Graph Visualizer
│   │   │   └── timeline/              # Chronological Forensic Timeline
│   │   ├── pages/                     # 13 Production SOC Pages
│   │   │   ├── Dashboard.tsx          # Real-time metrics & triage overview
│   │   │   ├── ThreatHunting.tsx      # Query builder, DSL search & pivot history
│   │   │   ├── GraphExplorer.tsx      # Interactive entity neighborhood explorer
│   │   │   ├── Entities.tsx           # Asset inventory & risk dossier
│   │   │   ├── Alerts.tsx             # Alert queue & audited false positive workflow
│   │   │   ├── Investigations.tsx     # Case management list & creator
│   │   │   ├── InvestigationDetail.tsx# Comprehensive Case Workbench
│   │   │   ├── Incidents.tsx          # Confirmed incident response tracker
│   │   │   ├── MitreMatrix.tsx        # ATT&CK heatmap & coverage matrix
│   │   │   ├── Scenarios.tsx          # 1-click attack simulation runner
│   │   │   ├── TrainingMode.tsx       # Blue team exercises & score calculation
│   │   │   ├── IOCs.tsx               # Threat intel indicators & lookup
│   │   │   ├── Behavior.tsx           # Behavioral baselines & anomaly stats
│   │   │   └── Reports.tsx            # Multi-format forensic report generator
│   │   ├── services/                  # Typed API Client
│   │   └── types/                     # TypeScript interfaces
├── detection-rules/                   # 26 Declarative YAML Detection Rules
│   ├── authentication/                # DET-AUTH-001 to DET-AUTH-004
│   ├── execution/                     # DET-EXEC-001 to DET-EXEC-003
│   ├── privilege/                     # DET-PRIV-001 to DET-PRIV-003
│   ├── discovery/                     # DET-DISC-001 to DET-DISC-002
│   ├── collection/                    # DET-COL-001 to DET-COL-002
│   ├── network/                       # DET-NET-001 to DET-NET-003
│   └── multi-stage/                   # DET-MULTI-001 to DET-MULTI-005
├── scenarios/                         # 6 Attack Emulation Scenarios (YAML)
├── scripts/
│   ├── seed.py                        # Synthetic lab data generator (20,000 events)
│   ├── run_scenario.py                # Command-line scenario simulator
│   ├── rebuild_graph.py               # Graph database synchronization tool
│   └── health_check.py                # Full-stack operational diagnostics
├── docs/                              # 11 Comprehensive Engineering & Security Docs
├── docker-compose.yml                 # Multi-container orchestration
├── Makefile                           # Automated build, test, seed & run targets
├── README.md                          # Master documentation
└── LICENSE                            # MIT License
```

---

## 4. Detection Engineering Catalog (26 YAML Rules)

| Rule ID | Category | Name | Severity | MITRE Tactic / Technique |
| :--- | :--- | :--- | :--- | :--- |
| `DET-AUTH-001` | Authentication | Repeated Failed Authentication Attempts | High | Credential Access / T1110 (Brute Force) |
| `DET-AUTH-002` | Authentication | Successful Authentication Following Multiple Failures | High | Credential Access / T1110 (Brute Force) |
| `DET-AUTH-003` | Authentication | Single Source Targeting Multiple User Accounts | High | Credential Access / T1110.003 (Password Spraying) |
| `DET-AUTH-004` | Authentication | Unusual Off-Hours Authentication Sequence | Medium | Initial Access / T1078 (Valid Accounts) |
| `DET-EXEC-001` | Execution | Suspicious Process Binary Execution | High | Execution / T1059.001 (PowerShell) |
| `DET-EXEC-002` | Execution | Anomalous Parent-Child Process Relationship | High | Execution / T1059 (Command and Scripting Interpreter) |
| `DET-EXEC-003` | Execution | Base64 Obfuscated Command Line Execution | High | Defense Evasion / T1027 (Obfuscated Files or Information) |
| `DET-PRIV-001` | Privilege Escalation | Unexpected Security Token Privilege Modification | High | Privilege Escalation / T1548 (Abuse Elevation Mechanism) |
| `DET-PRIV-002` | Privilege Escalation | Sensitive Administrative Group Member Addition | Medium | Persistence / T1098 (Account Manipulation) |
| `DET-PRIV-003` | Privilege Escalation | Rapid Privilege Escalation Sequence Following Login | Critical | Privilege Escalation / T1068 (Exploitation for Privilege) |
| `DET-DISC-001` | Discovery | Internal Network Service Scanning Activity | Low | Discovery / T1046 (Network Service Discovery) |
| `DET-DISC-002` | Discovery | Rapid Domain & Host Account Enumeration | Medium | Discovery / T1087 (Account Discovery) |
| `DET-COL-001` | Collection | Sensitive Credential Vault File Read Access | High | Credential Access / T1003 (OS Credential Dumping) |
| `DET-COL-002` | Collection | High-Volume Rapid File Archive Creation | Medium | Collection / T1005 (Data from Local System) |
| `DET-NET-001` | Command & Control | Repeated Outbound Connection to Suspicious External IP | High | Command and Control / T1071 (Application Layer Protocol) |
| `DET-NET-002` | Command & Control | Initial Outbound Beaconing to Uncategorized Domain | Medium | Command and Control / T1573 (Encrypted Channel) |
| `DET-NET-003` | Exfiltration | Anomalous Outbound Network Egress Volume Spike | High | Exfiltration / T1048 (Exfiltration Over Alternative Protocol) |
| `DET-MULTI-001` | Multi-Stage | Credential Access Followed Directly by Script Execution | High | Initial Access → Execution |
| `DET-MULTI-002` | Multi-Stage | Script Execution Followed by Privilege Escalation | High | Execution → Privilege Escalation |
| `DET-MULTI-003` | Multi-Stage | Privilege Escalation Followed by Sensitive Vault Access | Critical | Privilege Escalation → Collection |
| `DET-MULTI-004` | Multi-Stage | Sensitive File Collection Followed by External Egress | Critical | Collection → Exfiltration |
| `DET-MULTI-005` | Multi-Stage | Full Attack Kill-Chain Sequence | Critical | Complete Kill-Chain (Access → C2) |
| `DET-ANOM-001` | Anomaly | Statistical Login Frequency Z-Score Anomaly | Medium | Behavioral Anomaly |
| `DET-ANOM-002` | Anomaly | First Time Endpoint Access for User Identity | Medium | Initial Access / T1078 |
| `DET-ANOM-003` | Anomaly | Rare Process Category Execution Deviation | High | Execution / T1204 |
| `DET-INTEL-001` | Threat Intel | Known Adversary IOC Network Match | Critical | Threat Intelligence Indicator |

---

## 5. Threat Hunting DSL & Query Examples

The ThreatGraph X Hunting Engine supports boolean logic (`AND`, `OR`, `NOT`), field comparison, time windows, and regex pattern matching:

```sql
-- 1. Find all high-severity authentication failures or PowerShell executions
severity = "high" AND (event_type = "authentication" OR process = "powershell.exe")

-- 2. Trace outbound beaconing from a specific lab host
host = "LAB-PC-01" AND event_type = "network" AND action = "outbound_connection"

-- 3. Search for privileged account actions by specific user
user = "admin" AND event_type = "privilege" AND action = "privilege_escalation"

-- 4. Detect sensitive file access across all Linux endpoints
file_path CONTAINS "/etc/shadow" OR file_path CONTAINS "SAM"
```

---

## 6. Quickstart & Installation

### Option A: Docker Compose (Full Stack)
```bash
# 1. Clone repository & configure environment
cp .env.example .env

# 2. Launch all microservices
docker compose up -d --build

# 3. Seed 20,000 synthetic security events
docker compose exec backend python scripts/seed.py --events 20000

# 4. Access Web Applications
# Frontend UI:         http://localhost:3000
# Backend Swagger API: http://localhost:8000/docs
# Neo4j Browser:       http://localhost:7474
```

### Option B: Local Standalone Development (Zero Dependency)
```bash
# 1. Backend Setup
cd backend
python -m venv venv
source venv/bin/activate # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# 2. Frontend Setup (Separate Terminal)
cd frontend
npm install
npm run dev

# 3. Run Scenario Simulation
python scripts/run_scenario.py --scenario multi-stage
```

---

## 7. Automated Test Suite

ThreatGraph X includes 34 automated unit, integration, and security tests covering the entire pipeline:

```bash
cd backend
pytest -v
```

```
============================= test session starts =============================
collected 34 items

tests/integration/test_events_api.py::test_single_event_ingestion_and_retrieval PASSED
tests/integration/test_events_api.py::test_bulk_event_ingestion PASSED
tests/integration/test_hunting_api.py::test_threat_hunt_dsl_query PASSED
tests/integration/test_main_api.py::test_health_endpoint PASSED
tests/integration/test_main_api.py::test_ready_endpoint PASSED
tests/integration/test_main_api.py::test_metrics_endpoint PASSED
tests/integration/test_scenarios.py::test_list_and_run_multi_stage_scenario PASSED
tests/integration/test_scenarios.py::test_training_mode_submission PASSED
tests/security/test_rbac.py::test_user_registration_and_jwt_auth PASSED
tests/unit/test_ai_grounding.py::test_ai_grounded_response_cites_evidence PASSED
tests/unit/test_ai_grounding.py::test_ai_prompt_injection_refusal PASSED
tests/unit/test_behavior.py::test_off_hours_behavior_anomaly PASSED
tests/unit/test_config.py::test_settings_initialization PASSED
tests/unit/test_config.py::test_cors_origins_parsing PASSED
tests/unit/test_database.py::test_create_user PASSED
tests/unit/test_database.py::test_create_normalized_event PASSED
tests/unit/test_database.py::test_create_entity_and_relationship PASSED
tests/unit/test_database.py::test_create_detection_rule_and_alert PASSED
tests/unit/test_database.py::test_create_investigation_and_evidence PASSED
tests/unit/test_detections.py::test_auth_brute_force_detection PASSED
tests/unit/test_detections.py::test_suspicious_process_detection PASSED
tests/unit/test_entity_extractor.py::test_extract_entities_from_multi_attribute_event PASSED
tests/unit/test_entity_extractor.py::test_extract_relationships_from_event PASSED
tests/unit/test_graph_engine.py::test_node_and_edge_management PASSED
tests/unit/test_graph_engine.py::test_neighborhood_traversal PASSED
tests/unit/test_graph_engine.py::test_attack_path_reconstruction PASSED
tests/unit/test_graph_engine.py::test_blast_radius_calculation PASSED
tests/unit/test_investigation_workbench.py::test_evidence_attachment_with_sha256 PASSED
tests/unit/test_investigation_workbench.py::test_security_story_generation PASSED
tests/unit/test_normalization.py::test_normalize_authentication_event PASSED
tests/unit/test_normalization.py::test_normalize_process_event PASSED
tests/unit/test_risk.py::test_low_risk_calculation PASSED
tests/unit/test_risk.py::test_critical_multi_stage_risk_calculation PASSED
tests/unit/test_threat_intel.py::test_ioc_lookup_hit_and_miss PASSED

======================= 34 passed in 5.52s ========================
```

---

## 8. 5-Minute Technical Demonstration Walkthrough

- **00:00 – 00:20 (Authentication & Access Control)**: Log into ThreatGraph X using role-based JWT credentials (`lead_hunter` or `admin`). Observe RBAC route protection.
- **00:20 – 00:40 (SOC Dashboard Overview)**: Review real-time KPIs: 20,000 ingested events, active high-severity alerts, MITRE tactic distribution, and entity risk rankings.
- **00:40 – 01:00 (Threat Hunting Execution)**: Navigate to `/hunting`. Execute DSL query `severity >= "high" AND host = "LAB-PC-01"`. View results table and pivot directly into the Graph Explorer.
- **01:00 – 01:30 (Simulating Multi-Stage Attack)**: Navigate to `/scenarios`. Click "Simulate Scenario" on *Multi-Stage Enterprise Intrusion Simulation*. Watch the live pipeline ingest telemetry, correlate actions, and trigger 5 correlated detection rules.
- **01:30 – 02:00 (Graph Explorer & Blast Radius)**: Open the generated graph at `/graph`. Expand the neighborhood around `HOST:LAB-PC-01`. Inspect the directed edges: `USER:testuser -> HOST:LAB-PC-01 -> PROCESS:powershell.exe -> FILE:/etc/shadow -> IP:198.51.100.25`.
- **02:00 – 03:00 (Investigation Workbench)**: Navigate to the generated case `/investigations/INV-001`. Examine the deterministic **Reconstructed Security Story**.
- **03:00 – 03:40 (Forensic Timeline & Evidence Vault)**: Filter the chronological timeline by entity and severity. Inspect the cryptographic evidence vault showing SHA-256 hashes of collected artifacts.
- **03:40 – 04:20 (Evidence-Grounded AI Copilot)**: In the workbench, ask the AI assistant: *"Summarize the attacker's execution vector and cite evidence."* Verify that the AI cites `evt-xxx` forensic IDs and refuses hallucinations or prompt injections.
- **04:20 – 04:45 (Forensic Report Export)**: Navigate to `/reports`. Generate a full markdown/JSON investigation dossier with one click.
- **04:45 – 05:00 (Architecture Breakdown)**: Explain the dual-store design (PostgreSQL for log durability + Neo4j/NetworkX for graph analytics).

---

## 9. 30 Technical Interview Questions & Answers

<details>
<summary><strong>1. Why did you build ThreatGraph X?</strong></summary>
Traditional SIEMs treat security logs as independent, tabular rows. This causes alert fatigue and makes multi-stage attack detection slow and manual. I built ThreatGraph X to transform raw, disconnected logs into directed relationship graphs, enabling automated attack-chain reconstruction, rapid blast-radius discovery, and evidence-grounded AI investigations.
</details>

<details>
<summary><strong>2. Why use a graph database for defensive cybersecurity?</strong></summary>
Attackers operate in graphs (moving from IP to user to host to process to file). Relational databases require expensive recursive multi-table JOINs to trace deep pivot paths. A graph database provides index-free adjacency, allowing $O(1)$ relationship traversals to uncover attack chains and asset blast radiuses in real time.
</details>

<details>
<summary><strong>3. What are the respective responsibilities of PostgreSQL vs. Neo4j in this architecture?</strong></summary>
PostgreSQL serves as the transactional source of truth for high-volume raw telemetry, alert records, investigation cases, case notes, and audit logs. Neo4j (or NetworkX) stores the entity topology (Users, Hosts, IPs, Processes, Files) and their directed relationships, handling shortest-path calculations and graph centrality without bloating under raw log volume.
</details>

<details>
<summary><strong>4. How do you model security entities to avoid graph duplication?</strong></summary>
Entities use deterministic, composite unique identifiers formatted as `TYPE:VALUE` (e.g. `USER:alice`, `HOST:LAB-PC-01`, `IP:10.10.10.50`, `PROCESS:LAB-PC-01|powershell.exe`). During ingestion, an upsert pattern updates `last_seen` timestamps and increments encounter frequencies while maintaining a single node in the graph.
</details>

<details>
<summary><strong>5. How does the Correlation Engine link seemingly independent security events?</strong></summary>
The Correlation Engine evaluates four correlation vectors: (1) shared root entity context (same host/user), (2) temporal proximity within a sliding time window (e.g. 15 minutes), (3) MITRE ATT&CK kill-chain stage progression (Initial Access → Execution → Privilege Escalation → Collection → Egress), and (4) directed graph path connectivity.
</details>

<details>
<summary><strong>6. How do you detect multi-stage attack chains with confidence scoring?</strong></summary>
Attack-chain detection maps triggered detections against a formal state machine representing kill-chain phases. Confidence is computed based on stage coverage (e.g. 5 distinct kill-chain stages), time compression, shared entity context, and detection rule confidence weights.
</details>

<details>
<summary><strong>7. What is a threat hunt, and how does your Query DSL work?</strong></summary>
Threat hunting is the proactive, hypothesis-driven searching through telemetry to detect adversaries that evaded automated alerts. ThreatGraph X provides an AST-based query evaluator supporting field comparisons (`severity = "high"`), boolean conjunctions (`AND`, `OR`, `NOT`), substring searches (`CONTAINS`), and time-window constraints.
</details>

<details>
<summary><strong>8. How is composite risk calculated across entities and cases?</strong></summary>
The Risk Engine uses a transparent, bounded 0–100 scoring model combining: (1) detection alert severity (0.35 weight), (2) rule confidence (0.20 weight), (3) entity asset criticality (0.15 weight), (4) behavioral baseline deviation (0.15 weight), and (5) attack-chain depth (0.15 weight).
</details>

<details>
<summary><strong>9. How do you prevent and manage false positives?</strong></summary>
ThreatGraph X provides a formal False Positive classification workflow. Analysts can classify alerts with mandatory audited justifications (`Expected admin activity`, `Known scanner`, `Lab automation`). Classifications feed detection tuning analytics to adjust thresholds or whitelist benign patterns.
</details>

<details>
<summary><strong>10. What is behavioral baseline profiling, and how does it avoid brittle machine learning?</strong></summary>
Rather than relying on opaque, non-deterministic black-box models, ThreatGraph X computes statistical baselines over a 14-day rolling window (normal login hours, known host associations, common process executions). Anomalies are flagged using standard deviations ($Z > 3.0\sigma$) and rare entity access algorithms.
</details>

<details>
<summary><strong>11. How do you map detection rules to MITRE ATT&CK?</strong></summary>
Every YAML detection rule specifies its corresponding MITRE ATT&CK Tactic (`Credential Access`) and Technique (`T1110`). The platform aggregates active detections into an interactive enterprise ATT&CK Matrix heatmap showing real-time defensive coverage.
</details>

<details>
<summary><strong>12. How does IOC correlation work in the pipeline?</strong></summary>
During event normalization, extracted IP addresses, domains, and SHA-256 hashes are queried against a local threat intelligence repository. Matches adjust entity risk scores and trigger high-priority alerts with attribution metadata.
</details>

<details>
<summary><strong>13. How does pivot analysis work in the Investigation Workbench?</strong></summary>
Every entity, event, and alert in the UI supports 1-click pivoting. Clicking an IP pivots to associated user sessions, which pivot to host endpoints, child processes, touched file paths, and network destinations, recording a breadcrumb pivot history.
</details>

<details>
<summary><strong>14. How does the Grounded AI Investigation Assistant operate?</strong></summary>
The AI Copilot operates within a strict retrieval-augmented generation (RAG) pipeline. It only receives verified case timeline events, alert details, and subgraph paths. It is barred from accessing external tools or arbitrary databases.
</details>

<details>
<summary><strong>15. How do you prevent AI hallucinations in security investigations?</strong></summary>
The system prompt enforces strict evidence grounding: the AI is instructed to refuse claims lacking supporting telemetry and must cite specific forensic Event IDs (`[EVT-001]`). If evidence is insufficient, it must respond: *"Insufficient evidence in current investigation."*
</details>

<details>
<summary><strong>16. How do you prevent prompt injection attacks originating from malicious log events?</strong></summary>
Security logs are treated as untrusted user data. Log payloads are sanitized, wrapped in structured XML isolation tags (`<evidence_log>`), and stripped of instruction-like patterns before being injected into the model's context window.
</details>

<details>
<summary><strong>17. How is graph data secured against Cypher injection?</strong></summary>
All Neo4j Cypher queries utilize parameterized inputs (`$node_id`, `$depth`, `$target_id`). Dynamic string concatenation of user-supplied queries into Cypher statements is strictly prohibited across the codebase.
</details>

<details>
<summary><strong>18. How is Role-Based Access Control (RBAC) implemented?</strong></summary>
RBAC is enforced via JWT claims and FastAPI dependency injection (`require_roles`). Roles include `ADMIN` (full control), `THREAT_HUNTER` (hunting & detections), `SOC_ANALYST` (alerts & case management), and `VIEWER` (read-only telemetry).
</details>

<details>
<summary><strong>19. How do you unit test detection rules?</strong></summary>
Detection rules are tested against positive (triggers alert), negative (below threshold), and edge-case (boundary timestamp) synthetic event streams using pytest fixtures, verifying threshold counts, grouping logic, and window cutoffs.
</details>

<details>
<summary><strong>20. How do you test graph construction and pathfinding?</strong></summary>
Graph test suites assert node creation, edge extraction, deduplication, neighborhood BFS expansions, shortest-path calculation, and blast-radius graph calculations using both in-memory NetworkX fixtures and Neo4j test containers.
</details>

<details>
<summary><strong>21. How does the system handle high-volume event ingestion (20,000+ events)?</strong></summary>
The ingestion engine leverages async batch ingestion (`/api/events/bulk`), bulk database transactions, and in-memory entity deduplication caches, processing tens of thousands of events in seconds.
</details>

<details>
<summary><strong>22. How would Apache Kafka improve this architecture in enterprise scale?</strong></summary>
Kafka would act as a distributed, durable event bus between endpoint collectors (Sysmon, Zeek) and the ingestion pipeline, providing consumer-group load balancing, backpressure management, and decoupled replayability.
</details>

<details>
<summary><strong>23. How would OpenSearch or Elasticsearch complement the graph engine?</strong></summary>
OpenSearch would handle high-volume, long-term full-text log search and raw log aggregation, while ThreatGraph X focuses on high-value entity extraction, graph relationships, and attack-chain correlation.
</details>

<details>
<summary><strong>24. How would you integrate Wazuh EDR telemetry?</strong></summary>
Wazuh JSON alerts would be ingested via a dedicated log normalization parser, mapping Wazuh manager alert fields (`agent.name`, `data.win.eventdata`, `rule.mitre`) directly into the ThreatGraph X normalized schema.
</details>

<details>
<summary><strong>25. How would you integrate Zeek network monitor logs?</strong></summary>
Zeek `conn.log`, `dns.log`, and `http.log` feeds would be normalized to extract `IP`, `DOMAIN`, and `URL` entities, linking host nodes to external IP nodes via `HOST_CONNECTED_TO_IP` relationships.
</details>

<details>
<summary><strong>26. What are the security boundaries regarding evidence file handling?</strong></summary>
Uploaded evidence files are stored outside executable web roots, validated for MIME type and file size, hashed using SHA-256 for cryptographic chain-of-custody verification, and never executed by backend services.
</details>

<details>
<summary><strong>27. What is the Deterministic Security Story Generator?</strong></summary>
It is an automated engine that compiles a human-readable investigation narrative directly from ordered forensic event records and triggered detections without relying on non-deterministic LLMs.
</details>

<details>
<summary><strong>28. What are current limitations of the platform?</strong></summary>
Currently, graph clustering uses in-memory and single-instance Neo4j deployments; enterprise scaling to billions of nodes would require a distributed graph cluster (e.g. Neo4j Fabric or AWS Neptune) and distributed stream workers (Celery/Kafka).
</details>

<details>
<summary><strong>29. What changes would be required for enterprise production deployment?</strong></summary>
Enabling mTLS between backend and database tiers, integrating with corporate SSO via SAML/OIDC, deploying behind an enterprise WAF, and setting up automated daily backups for Neo4j graph stores.
</details>

<details>
<summary><strong>30. Explain the complete lifecycle of an incident in ThreatGraph X from raw packet to closed case.</strong></summary>
(1) Telemetry arrives at `/api/events`, (2) Event is normalized and entities are extracted, (3) Nodes and edges are upserted into the Graph Engine, (4) YAML detection rules evaluate sliding windows, (5) Detections trigger alerts and correlation groups them into attack chains, (6) An Investigation is created with a deterministic security story and subgraph, (7) Analysts investigate via the Workbench and Grounded AI, and (8) Incident response actions (containment/resolution) are audited and exported as reports.
</details>

---

## 10. Professional Resume Description

**Threat Hunting & Graph Security Platform Engineer | ThreatGraph X**
- Designed and built **ThreatGraph X**, a full-stack cybersecurity threat hunting and attack-chain intelligence platform utilizing **FastAPI, React 19, TypeScript, PostgreSQL, and Neo4j**.
- Developed a dual-store graph security architecture enabling real-time entity correlation, multi-stage attack-chain reconstruction, and $O(1)$ blast-radius graph traversals across 20,000+ normalized events.
- Engineered 26 declarative YAML detection rules mapped to **MITRE ATT&CK** tactics and techniques covering initial access, execution, privilege escalation, collection, and network command-and-control.
- Implemented a custom Threat Hunting DSL query engine supporting boolean operations, regex, and sliding time-window constraints with sub-second response times.
- Built an evidence-grounded AI investigation copilot strictly locked to verified forensic telemetry and SHA-256 evidence hashes, completely eliminating hallucinations and adversarial prompt injection risks.
- Integrated role-based access control (RBAC), audited false-positive triage workflows, statistical behavioral anomaly profiling ($Z > 3.0\sigma$), and multi-format forensic reporting (Markdown, JSON, CSV).

---

## 11. Known Limitations & Future Roadmap

### Limitations
- **Graph Clustering**: Standalone Neo4j / In-Memory NetworkX graph engine designed for single-node SOC lab deployment.
- **Log Source Connectors**: Direct REST/JSON ingestion instead of native cloud log forwarder agents.

### Future Roadmap
- [ ] **Native Sysmon & Zeek Log Forwarder Agents**: Lightweight Go-based log shippers.
- [ ] **Sigma Rule Converter**: Automated transpiler converting Sigma rules into ThreatGraph X YAML definitions.
- [ ] **Distributed Stream Ingestion**: Apache Kafka & Apache Flink connector for enterprise 100,000+ EPS throughput.
- [ ] **STIX 2.1 / TAXII Threat Feed Ingestion**: Automated threat intelligence synchronization with MISP and AlienVault OTX.
- [ ] **SOAR Webhook Integrations**: Automated host containment webhooks (Active Directory disable user, firewall block IP).

---

## 12. Defensive Security Boundary Notice

ThreatGraph X is designed strictly for **defensive cybersecurity research, detection engineering, threat hunting, incident response, and educational training**. All simulated attack chains and telemetry are generated synthetically within controlled lab boundaries. The platform contains no offensive exploit capabilities.
