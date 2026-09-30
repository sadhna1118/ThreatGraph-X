# ThreatGraph X - Testing Strategy & Quality Assurance

## 1. Testing Pyramid
ThreatGraph X maintains strict automated testing across:
- **Unit Tests**:
  - Normalization engine & schema validation
  - Entity extraction & deterministic ID generation
  - Detection rule evaluations (positive, negative, and threshold edge cases)
  - Correlation logic and attack-chain detection
  - Multi-factor risk calculation
  - Behavioral statistical anomaly algorithms
  - AI evidence grounding & refusal guardrails
- **Integration Tests**:
  - End-to-end event ingestion API
  - Dual-store synchronization (PostgreSQL & Graph)
  - Threat hunting query engine
  - Investigation workbench workflow
  - Multi-stage attack simulation scenarios
- **Security Tests**:
  - Role-Based Access Control (RBAC) endpoint enforcement
  - Parameterized Cypher/SQL injection immunity
  - Evidence file safety & SHA-256 hash verification
  - Authentication token expiration & tampering resistance

## 2. Running the Test Suites
```bash
# Run all tests
pytest -v

# Run unit tests
pytest backend/tests/unit/ -v

# Run security & RBAC tests
pytest backend/tests/security/ -v

# Run integration tests
pytest backend/tests/integration/ -v
```
