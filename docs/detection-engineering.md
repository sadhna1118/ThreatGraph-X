# ThreatGraph X - Detection Engineering Specification

## 1. Overview
ThreatGraph X features a declarative, YAML-based detection engine capable of evaluating single-event filters, sliding-window thresholds, group-by aggregates, and multi-stage sequence correlation.

## 2. Rule Schema Structure
Each detection rule adheres to the standard schema:
```yaml
id: DET-AUTH-001
name: Repeated Authentication Failures
severity: high
event_type: authentication
condition:
  action: login_failed
threshold:
  count: 5
  window_minutes: 5
group_by:
  - source_ip
  - user
mitre:
  tactic: Credential Access
  technique_id: T1110
  technique_name: Brute Force
description: Detects repeated failed authentication attempts against accounts within a brief time window.
```

## 3. Catalog of Core Detection Rules (25+ Rules)

### Authentication
- `DET-AUTH-001`: Repeated Failed Authentication (Brute Force / Password Spray)
- `DET-AUTH-002`: Success After Repeated Failures (Possible Credential Compromise)
- `DET-AUTH-003`: Multiple Users Targeted From Single Source IP
- `DET-AUTH-004`: Unusual Login Time Deviation (Off-Hours Access)

### Execution
- `DET-EXEC-001`: Suspicious Process Execution (e.g., cmd/powershell spawned unexpectedly)
- `DET-EXEC-002`: Unexpected Parent-Child Process Relationship
- `DET-EXEC-003`: Encoded Command Line Indicator (Base64 execution)
- `DET-EXEC-004`: Living-off-the-Land Binary (LOLBIN) Invocation

### Privilege Escalation
- `DET-PRIV-001`: Unexpected Privilege Change / Token Elevation
- `DET-PRIV-002`: High-Risk Administrative Action by Standard Account
- `DET-PRIV-003`: Privilege Escalation Sequence Following Initial Access

### Discovery
- `DET-DISC-001`: Network Scanning Pattern (Multiple Port Probes)
- `DET-DISC-002`: Host & Account Discovery Pattern (whoami, net user, ipconfig)
- `DET-DISC-003`: Security Software Discovery / Tampering Probe

### Collection & Access
- `DET-COL-001`: Sensitive File Access (passwords.txt, shadow, SAM, secrets)
- `DET-COL-002`: Unusual File Access Volume in Short Duration
- `DET-COL-003`: Archive Creation / Staging in Temporary Folders

### Network & Exfiltration
- `DET-NET-001`: Repeated Outbound Connections to Unknown External IP
- `DET-NET-002`: New High-Risk Destination Domain / Fast-Flux Indicator
- `DET-NET-003`: Unusual Network Egress Volume Spike
- `DET-NET-004`: Non-Standard Port Communication

### Multi-Stage Attack Chains
- `DET-MULTI-001`: Initial Authentication Failure -> Success -> Process Execution
- `DET-MULTI-002`: Process Execution -> Privilege Elevation -> Discovery
- `DET-MULTI-003`: Privilege Elevation -> Sensitive File Access
- `DET-MULTI-004`: Collection -> Outbound Network Egress
- `DET-MULTI-005`: Full Multi-Stage Cyber Kill-Chain Sequence

## 4. False Positive Management & Tuning
Security analysts can mark alerts as `FALSE_POSITIVE` with an audited justification (e.g., "Authorized Penetration Test", "IT Backup Automation"). These flags automatically feed the rule tuning telemetry to adjust thresholds and maintain high signal-to-noise ratio.
