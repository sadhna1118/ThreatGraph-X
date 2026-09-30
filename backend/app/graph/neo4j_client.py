from typing import Dict, Any, List, Optional
import logging
from neo4j import GraphDatabase, AsyncGraphDatabase, AsyncDriver
from app.config import settings
from app.schemas.graph import GraphNode, GraphEdge, SubGraph
from app.graph.in_memory_graph import in_memory_graph

logger = logging.getLogger("threatgraph.graph.neo4j")


class Neo4jClient:
    def __init__(self):
        self.driver: Optional[AsyncDriver] = None
        self.use_in_memory = settings.USE_IN_MEMORY_GRAPH

    async def connect(self):
        if self.use_in_memory:
            logger.info("Operating in In-Memory Security Graph mode.")
            return

        try:
            self.driver = AsyncGraphDatabase.driver(
                settings.NEO4J_URI,
                auth=(settings.NEO4J_USERNAME, settings.NEO4J_PASSWORD)
            )
            # Verify connectivity
            async with self.driver.session() as session:
                result = await session.run("RETURN 1 as test")
                record = await result.single()
                if record and record["test"] == 1:
                    logger.info("Successfully established connection to Neo4j Security Graph database.")
        except Exception as e:
            logger.warning(f"Neo4j connection failed: {e}. Falling back to In-Memory Security Graph.")
            self.use_in_memory = True

    async def close(self):
        if self.driver:
            await self.driver.close()

    async def merge_node(self, label: str, node_id: str, properties: Dict[str, Any]):
        """Idempotently creates or updates a node using parameterized Cypher."""
        # Always update in-memory graph for lightning fast hybrid queries
        in_memory_graph.add_or_update_node(node_id, label, properties)

        if not self.use_in_memory and self.driver:
            query = f"""
            MERGE (n:`{label}` {{id: $node_id}})
            ON CREATE SET n += $props, n.created_at = timestamp()
            ON MATCH SET n += $props, n.updated_at = timestamp()
            """
            try:
                async with self.driver.session() as session:
                    await session.run(query, node_id=node_id, props=properties)
            except Exception as e:
                logger.error(f"Error merging Neo4j node {node_id}: {e}")

    async def merge_relationship(
        self,
        source_id: str,
        target_id: str,
        relation_type: str,
        properties: Dict[str, Any]
    ):
        """Idempotently creates or updates a relationship using parameterized Cypher."""
        in_memory_graph.add_or_update_edge(source_id, target_id, relation_type, properties)

        if not self.use_in_memory and self.driver:
            query = f"""
            MATCH (a {{id: $source_id}})
            MATCH (b {{id: $target_id}})
            MERGE (a)-[r:`{relation_type}`]->(b)
            ON CREATE SET r += $props, r.weight = 1
            ON MATCH SET r += $props, r.weight = coalesce(r.weight, 1) + 1
            """
            try:
                async with self.driver.session() as session:
                    await session.run(query, source_id=source_id, target_id=target_id, props=properties)
            except Exception as e:
                logger.error(f"Error merging Neo4j relationship {source_id}->{target_id}: {e}")

    async def get_neighborhood(self, node_id: str, depth: int = 1, max_nodes: int = 100) -> SubGraph:
        """Fetches k-hop neighborhood from graph."""
        return in_memory_graph.get_neighborhood(node_id, depth=depth, max_nodes=max_nodes)


neo4j_client = Neo4jClient()
