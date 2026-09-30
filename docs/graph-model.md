# ThreatGraph X - Security Graph Model & Schema Specification

## 1. Graph Overview
The security graph models the digital topology and operational activities occurring across an enterprise lab. Nodes represent discrete cyber entities, while directed edges represent observed behavioral interactions.

## 2. Graph Node Labels
- **`:User`**: Human or service accounts (`id: "user:alice"`, `name: "alice"`, `risk_score: 45`)
- **`:Host`**: Endpoints and servers (`id: "host:LAB-PC-01"`, `hostname: "LAB-PC-01"`, `ip: "10.10.10.25"`)
- **`:IP`**: IPv4 and IPv6 network addresses (`id: "ip:10.10.10.50"`, `address: "10.10.10.50"`, `is_internal: true`)
- **`:Domain`**: DNS domain names (`id: "domain:c2-test.lab"`, `domain_name: "c2-test.lab"`)
- **`:URL`**: Full HTTP/HTTPS URLs (`id: "url:http://c2-test.lab/payload.bin"`)
- **`:Process`**: Running executable instances (`id: "proc:powershell.exe:4920"`, `name: "powershell.exe"`, `pid: 4920`)
- **`:File`**: File system artifacts (`id: "file:c:/users/alice/passwords.txt"`, `path: "..."`, `hash: "..."`)
- **`:Hash`**: Cryptographic fingerprints (`id: "hash:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"`)
- **`:Resource`**: Cloud/database assets (`id: "res:aws-s3-prod-secrets"`, `name: "aws-s3-prod-secrets"`)
- **`:Event`**: Atomic security telemetry instance (`id: "evt-001"`, `event_type: "authentication"`, `action: "login_failed"`)
- **`:Alert`**: Detection engine match (`id: "alt-001"`, `rule_id: "DET-AUTH-001"`, `severity: "high"`)
- **`:Incident`**: Formal investigation case entity (`id: "inc-001"`, `severity: "critical"`)

## 3. Directed Edge Schema
| Edge Type | Source Node | Target Node | Key Edge Properties |
| :--- | :--- | :--- | :--- |
| `LOGGED_FROM_IP` | `User` | `IP` | `timestamp`, `method`, `status` |
| `ACCESSED_HOST` | `User` | `Host` | `timestamp`, `logon_type`, `elevated` |
| `ACCESSED_RESOURCE` | `User` | `Resource` | `timestamp`, `action`, `permission` |
| `EXECUTED_PROCESS` | `Host` | `Process` | `timestamp`, `pid`, `command_line` |
| `PARENT_OF` | `Process` | `Process` | `timestamp`, `parent_pid` |
| `ACCESSED_FILE` | `Process` | `File` | `timestamp`, `access_mode` (read/write) |
| `CONNECTED_TO_IP` | `Process` / `Host` | `IP` | `timestamp`, `dest_port`, `protocol` |
| `RESOLVES_TO_DOMAIN`| `IP` | `Domain` | `timestamp`, `query_type` |
| `REFERENCED_BY_URL` | `Domain` | `URL` | `timestamp` |
| `HAS_HASH` | `File` | `Hash` | `algorithm` |
| `INVOLVES_ENTITY` | `Event` | `*` | `role` (source, target, subject) |
| `TRIGGERED_ALERT` | `Event` | `Alert` | `timestamp`, `confidence` |
| `BELONGS_TO_INCIDENT`| `Alert` | `Incident` | `timestamp` |

## 4. Key Graph Algorithms
1. **Neighborhood Extraction**: Expand $k$-degree connections from an IOC or compromised host.
2. **Shortest Attack Path**: Find the minimum traversal distance between an external IP and sensitive resources.
3. **Time-Constrained Path Finding**: Verify that edge timestamps strictly increase chronologically along the path.
4. **Graph Centrality**: Calculate PageRank and Betweenness Centrality to pinpoint pivot hosts and compromised accounts.
