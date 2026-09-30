# ThreatGraph X - Threat Hunting & Query Engine

## 1. Overview
The Threat Hunting Query Engine enables proactive discovery of subtle, stealthy adversary techniques that may evade standalone threshold detection.

## 2. Query Language & Capabilities
The query engine supports:
- **Exact Field Matching**: `source_ip = "10.10.10.50"`, `user = "admin"`
- **Boolean Operators**: `AND`, `OR`, `NOT`
- **Time Range Windows**: `last_hours = 24`, `start_time = "2026-09-29T00:00:00Z"`
- **Comparison Operators**: `severity >= "high"`, `risk_score > 70`
- **Substring & Prefix Matching**: `file_path CONTAINS "AppData/Local/Temp"`
- **Safe Regex Matching**: `process_name MATCHES "^(powershell|cmd|pwsh)\.exe$"`

## 3. Threat Hunting Pivoting Workflow
When an anomaly is identified, analysts perform interactive pivoting across related entities:
```
IP Observable
    ↓ (Show related events)
User Account
    ↓ (Show authenticated hosts)
Host Endpoint
    ↓ (Show executed processes)
Process Instance
    ↓ (Show file modifications)
File Hash
    ↓ (Query IOC database)
Investigation Case
```

## 4. Case Assembly & Saved Searches
Hunters can bookmark recurring DSL queries and bundle suspicious entities into an active Investigation Workbench with a single click.
