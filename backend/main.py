from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

# Allow CORS for frontend (default localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

def is_dag(nodes, edges):
    # Build adjacency list and indegree map
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
    data = await request.json()
    nodes = data.get('nodes', [])
    edges = data.get('edges', [])
    if not isinstance(nodes, list) or not isinstance(edges, list):
        raise HTTPException(status_code=400, detail='Invalid payload')
    num_nodes = len(nodes)
    num_edges = len(edges)
    dag = is_dag(nodes, edges)
    return JSONResponse(content={'num_nodes': num_nodes, 'num_edges': num_edges, 'is_dag': dag})
