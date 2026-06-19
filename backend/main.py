from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

# CORS: locked to dev frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


def is_dag(nodes, edges):
    """Kahn's algorithm for cycle detection."""
    adj = {node['id']: [] for node in nodes}
    indegree = {node['id']: 0 for node in nodes}
    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        if source in adj and target in adj:
            adj[source].append(target)
            indegree[target] += 1
    # Kahn's algorithm
    stack = [n for n, d in indegree.items() if d == 0]
    visited = 0
    while stack:
        n = stack.pop()
        visited += 1
        for m in adj[n]:
            indegree[m] -= 1
            if indegree[m] == 0:
                stack.append(m)
    return visited == len(nodes)


@app.post('/pipelines/parse')
async def parse_pipeline(request: Request):
    # Parse JSON body safely
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail='Malformed JSON payload')

    nodes = data.get('nodes', [])
    edges = data.get('edges', [])

    # Validate types
    if not isinstance(nodes, list) or not isinstance(edges, list):
        raise HTTPException(status_code=400, detail='nodes and edges must be arrays')

    # Validate each node has an 'id' field
    for i, node in enumerate(nodes):
        if not isinstance(node, dict) or 'id' not in node:
            raise HTTPException(
                status_code=400,
                detail=f'Node at index {i} is invalid: must be an object with an "id" field'
            )

    # Build set of valid node IDs
    node_ids = {node['id'] for node in nodes}

    # Validate edge source/target reference existing node IDs
    for i, edge in enumerate(edges):
        if not isinstance(edge, dict):
            raise HTTPException(
                status_code=400,
                detail=f'Edge at index {i} is invalid: must be an object'
            )
        source = edge.get('source')
        target = edge.get('target')
        if not source or not target:
            raise HTTPException(
                status_code=400,
                detail=f'Edge at index {i} is missing source or target'
            )
        if source not in node_ids:
            raise HTTPException(
                status_code=400,
                detail=f'Edge at index {i}: source "{source}" does not reference a valid node'
            )
        if target not in node_ids:
            raise HTTPException(
                status_code=400,
                detail=f'Edge at index {i}: target "{target}" does not reference a valid node'
            )

    num_nodes = len(nodes)
    num_edges = len(edges)
    dag = is_dag(nodes, edges)

    return JSONResponse(
        content={'num_nodes': num_nodes, 'num_edges': num_edges, 'is_dag': dag}
    )
