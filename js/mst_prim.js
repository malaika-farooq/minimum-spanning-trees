/*   Prim's MST Algorithm 

   PSEUDOCODE:
   1. Pick any start node (0 by default unless user chooses).
   2. Mark it as visited.
   3. Push all its edges into a min-heap (priority queue).
   4. While heap not empty:
    - Extract edge with minimum weight.
     - If the new node is not visited:
        - Add edge to MST
        - Mark node visited
        - Push all adjacent edges of this node
   5. End when MST has (n-1) edges or heap is empty.

   Time Complexity:
       O((n + m) log n)*/

export function primMST(n, edges, startNode = 0) {

    const adj = Array.from({ length: n }, () => []);

    // Build adjacency list
    for (const [u, v, w] of edges) {
        adj[u].push({ node: v, weight: w });
        adj[v].push({ node: u, weight: w });
    }

    const visited = new Array(n).fill(false);
    const pq = []; // min-heap implemented manual
    const mst = [];

    const startTime = performance.now();

    // Push all edges of startNode
    visited[startNode] = true;
    for (const edge of adj[startNode]) {
        pq.push([edge.weight, startNode, edge.node]);
    }

    // Heapify once
    pq.sort((a, b) => a[0] - b[0]);

    while (pq.length > 0 && mst.length < n - 1) {
        const [w, u, v] = pq.shift(); // extract-min

        if (visited[v]) continue;

        visited[v] = true;
        mst.push([u, v, w]);

        // Add new edges connected to v
        for (const next of adj[v]) {
            if (!visited[next.node]) {
                pq.push([next.weight, v, next.node]);
            }
        }

        // re-sort heap 
        pq.sort((a, b) => a[0] - b[0]);
    }

    const endTime = performance.now();

    return {
        mst,
        totalWeight: mst.reduce((s, e) => s + e[2], 0),
        timeMs: endTime - startTime
    };
}
