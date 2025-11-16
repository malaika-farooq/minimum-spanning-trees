/* graph.js
   handles ALL graph creation (random + manual).
   shared by Visualizer, Compare pages.
*/

let manualEdges = [];

//Reset manual edges 
export function resetManualEdges() {
    manualEdges = [];
}

//Add a manual edge (visualizer uses this) 
export function addManualEdge(u, v, w) {
    manualEdges.push([u, v, w]);
}

//Random connected graph with weights in [minW, maxW] 
export function generateRandomGraph(n, m, minW = 1, maxW = 20) {
    const edges = [];

  
    const maxPossible = (n * (n - 1)) / 2;
    m = Math.min(m, maxPossible);

    //  connected by random spanning tree
    for (let i = 1; i < n; i++) {
        const parent = Math.floor(Math.random() * i);
        const w = randInt(minW, maxW);
        edges.push([parent, i, w]);
    }

    // add remaining edges
    while (edges.length < m) {
        const u = Math.floor(Math.random() * n);
        let v = Math.floor(Math.random() * n);
        if (u === v) continue;
        const w = randInt(minW, maxW);
        edges.push([u, v, w]);
    }

    return edges;
}

/* generate node positions (random, non-circular) */
export function generateNodePositions(n, width, height) {
    const positions = [];
    for (let i = 0; i < n; i++) {
        positions.push({
            x: Math.random() * (width - 60) + 30,
            y: Math.random() * (height - 60) + 30
        });
    }
    return positions;
}

//get edges for current mode 
export function getFinalEdges(n, m, mode, minW = 1, maxW = 20) {
    if (mode === "manual") {
        return [...manualEdges];
    }
    return generateRandomGraph(n, m, minW, maxW);
}

//helper 
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
