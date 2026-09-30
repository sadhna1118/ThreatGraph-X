# ThreatGraph X - Comprehensive Threat Model

## 1. Scope & System Assets
- **Protected Assets**: Forensic evidence vault, relational telemetry store, Neo4j security graph, detection rules, user credentials & session tokens, audit logs.
- **Trust Boundaries**:
  - Boundary 1: Untrusted Ingestion Clients -> FastAPI Ingestion Gateways.
  - Boundary 2: Authenticated UI Web Client -> Protected REST API Endpoints.
  - Boundary 3: Internal Services -> PostgreSQL & Neo4j Data Stores.
  - Boundary 4: Application Context -> LLM / AI Reasoning Pipeline.

## 2. STRIDE Assessment Matrix

| Threat Category | Potential Attack Vector | Applied Mitigation in ThreatGraph X |
| :--- | :--- | :--- |
| **Spoofing** | Forged session tokens, spoofed user IDs in log streams. | Cryptographic JWT verification, HMAC signing, strict event provenance metadata tagging. |
| **Tampering** | Cypher / SQL injection in query builder or hunt filter. | Parameterized Cypher queries via Neo4j driver; parameterized SQLAlchemy ORM queries; strict Pydantic model filtering. |
| **Repudiation** | Analyst altering detection rule thresholds or closing alerts without logging. | Append-only audit log table recording `actor`, `action`, `resource`, `timestamp`, and `client_ip`. |
| **Information Disclosure** | Unauthorized analysts reading confidential incident reports. | Fine-grained Role-Based Access Control (`ADMIN`, `THREAT_HUNTER`, `SOC_ANALYST`, `VIEWER`). |
| **Denial of Service** | Graph explosion via unbounded path queries or log flood. | Bounded traversal depth ($\le 3$), rate limiting middleware, async ingestion pipelines with batching. |
| **Elevation of Privilege**| Uploading malicious executable scripts disguised as evidence. | Hash calculation (SHA-256), isolated storage directory, file-type validation, strict non-execution file flags. |
