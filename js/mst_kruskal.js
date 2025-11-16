/*  Kruskal's MST Algorithm 
   
   PSEUDOCODE:
   1. Sort all edges by weight.
   2. Initialize Disjoint Set Union (Union-Find).
   3. For each edge (u, v, w):
        - If find(u) != find(v):
              - Add edge to MST
              - Union(u, v)
   4. Stop when MST has (n-1) edges.
   
   Time Complexity:
       O(m log m)
------------------------------------------------------------ */

// Disjoint Set (Union–Find)
class DSU {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = Array(n).fill(0);
    }

    find(x) {
        if (this.parent[x] !== x)
            this.parent[x] = this.find(this.parent[x]);
        return this.parent[x];
    }

    union(a, b) {
        let pa = this.find(a);
        let pb = this.find(b);
        if (pa === pb) return false;

        if (this.rank[pa] < this.rank[pb]) {
            this.parent[pa] = pb;
        } else if (this.rank[pb] < this.rank[pa]) {
            this.parent[pb] = pa;
        } else {
            this.parent[pb] = pa;
            this.rank[pa]++;
        }
        return true;
    }
}

export function kruskalMST(n, edges) {

    const startTime = performance.now();

    // Sort edges: weight asc
    const sorted = [...edges].sort((a, b) => a[2] - b[2]);

    const dsu = new DSU(n);
    const mst = [];

    for (const [u, v, w] of sorted) {
        if (dsu.union(u, v)) {
            mst.push([u, v, w]);
        }
        if (mst.length === n - 1) break;
    }

    const endTime = performance.now();

    return {
        mst,
        totalWeight: mst.reduce((s, e) => s + e[2], 0),
        timeMs: endTime - startTime
    };
}
