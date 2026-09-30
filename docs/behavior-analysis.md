# ThreatGraph X - Behavioral Analytics & Statistical Anomaly Engine

## 1. Objective & Behavioral Baselines
ThreatGraph X establishes deterministic, rolling baselines for entities (Users and Hosts) without requiring brittle black-box machine learning models:
- **User Baselines**:
  - Typical login hours (hour-of-day distribution)
  - Common source IP subnets and hosts accessed
  - Normal daily event velocity and process creation patterns
- **Host Baselines**:
  - Regular daemon/service process signatures
  - Typical inbound and outbound destination subnets and ports
  - Normal event volume distribution ($\mu, \sigma$)

## 2. Statistical Anomaly Algorithms
1. **Frequency & Volume Deviations**: Z-Score calculation $Z = \frac{x - \mu}{\sigma}$ on rolling 7-day metrics.
2. **Time-of-Day Deviations**: Detection of off-hours administrative access compared against empirical user profiles.
3. **New Entity Anomalies**: First-time observation of an account logging into an unfamiliar domain controller or database server.
4. **Rare Process / Execution Anomalies**: Execution of binaries observed in $< 1\%$ of historical baseline host telemetry.

## 3. Defensive Non-Accusatory Classification
Anomalies are strictly classified as **"Observed behavioral deviation consistent with unusual activity"** rather than claiming confirmed malicious compromise without definitive forensic corroboration.
