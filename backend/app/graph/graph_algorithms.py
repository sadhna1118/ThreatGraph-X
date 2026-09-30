from typing import List, Dict, Any, Optional
from app.graph.in_memory_graph import InMemoryGraphEngine, in_memory_graph
from app.schemas.graph import AttackPath, GraphNode, GraphEdge


class GraphAlgorithms:
    """Graph intelligence algorithms for attack-chain analysis, blast-radius, and centrality."""

    @staticmethod
    def detect_attack_path(source_entity_id: str, target_entity_id: str, engine: Optional[InMemoryGraphEngine] = None) -> Optional[AttackPath]:
        """Detects potential security-relevant path between two entities and reconstructs the attack chain."""
        graph_eng = engine or in_memory_graph
        path_nodes = graph_eng.find_shortest_path(source_entity_id, target_entity_id)
        if not path_nodes:
            return None

        nodes: List[GraphNode] = []
        edges: List[GraphEdge] = []
        evidence_events: List[str] = []
        stages: List[str] = []

        for i, nid in enumerate(path_nodes):
            node_obj = graph_eng.get_node(nid)
            if node_obj:
                nodes.append(node_obj)

            if i < len(path_nodes) - 1:
                next_nid = path_nodes[i + 1]
                edge_data = graph_eng.graph.get_edge_data(nid, next_nid)
                if edge_data:
                    first_key = next(iter(edge_data))
                    rel_info = edge_data[first_key]
                    rel_type = rel_info.get("relation_type", "RELATED_TO")
                    props = rel_info.get("properties", {})

                    edges.append(GraphEdge(
                        id=f"path-edge-{i}",
                        source=nid,
                        target=next_nid,
                        relation_type=rel_type,
                        properties=props
                    ))

                    if "event_id" in props:
                        evidence_events.append(props["event_id"])

                    if "LOGGED" in rel_type or "AUTH" in rel_type:
                        stages.append("INITIAL_ACCESS")
                    elif "EXECUTED" in rel_type:
                        stages.append("EXECUTION")
                    elif "ACCESSED_FILE" in rel_type or "RESOURCE" in rel_type:
                        stages.append("COLLECTION")
                    elif "CONNECTED" in rel_type or "RESOLVES" in rel_type:
                        stages.append("NETWORK_ACTIVITY")
                    else:
                        stages.append("DISCOVERY")

        confidence = min(0.95, 0.5 + (len(evidence_events) * 0.1) + (len(path_nodes) * 0.05))
        risk_score = min(100, int(confidence * 100))

        return AttackPath(
            path_id=f"path-{source_entity_id[:8]}-{target_entity_id[:8]}",
            nodes=nodes,
            edges=edges,
            confidence=round(confidence, 2),
            risk_score=risk_score,
            stage_progression=stages if stages else ["POTENTIAL_CORRELATION"],
            evidence_event_ids=evidence_events,
            description=f"Potential attack path tracing from {source_entity_id} to {target_entity_id} across {len(path_nodes)} entities."
        )

    @staticmethod
    def calculate_blast_radius(entity_id: str, depth: int = 2, engine: Optional[InMemoryGraphEngine] = None) -> Dict[str, Any]:
        """Calculates the potential blast radius (all directly/indirectly accessible assets) from a compromised entity."""
        graph_eng = engine or in_memory_graph
        subgraph = graph_eng.get_neighborhood(entity_id, depth=depth, max_nodes=50)
        users = [n for n in subgraph.nodes if n.label.lower() == "user"]
        hosts = [n for n in subgraph.nodes if n.label.lower() == "host"]
        ips = [n for n in subgraph.nodes if n.label.lower() == "ip"]
        files = [n for n in subgraph.nodes if n.label.lower() == "file"]

        return {
            "root_entity": entity_id,
            "total_impacted_entities": len(subgraph.nodes),
            "users_count": len(users),
            "hosts_count": len(hosts),
            "ips_count": len(ips),
            "files_count": len(files),
            "subgraph": subgraph
        }


graph_algorithms = GraphAlgorithms()
