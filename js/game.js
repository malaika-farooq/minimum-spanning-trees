// game.js
import { generateRandomGraph, generateNodePositions } from "./graph.js";
import {
    clearCanvas,
    drawNodes,
    drawEdges,
    drawMSTEdges,
    highlightStart,
    highlightEnd
} from "./drawing.js";
import { primMST } from "./mst_prim.js";
import { kruskalMST } from "./mst_kruskal.js";
import { showModal } from "./utils.js";

window.addEventListener("DOMContentLoaded", () => {
    const modeSelect = document.getElementById("gameMode");
    const nodesInput = document.getElementById("gameNodes");
    const algoSelect = document.getElementById("gameAlgo");
    const startInput = document.getElementById("gameStart");
    const endInput = document.getElementById("gameEnd");

    const startBtn = document.getElementById("startGameBtn");
    const resetBtn = document.getElementById("resetGameBtn");

    const mapContainer = document.getElementById("mapContainer");
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const statusEl = document.getElementById("gameStatus");

    let state = {
        n: 0,
        edges: [],
        positions: [],
        mst: [],
        start: null,
        end: null
    };

    function resizeCanvas() {
        const rect = mapContainer.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function setBackground() {
        const mode = modeSelect.value;
        if (mode === "island") {
            mapContainer.style.backgroundImage = "url('assets/island.png')";
        } else {
            mapContainer.style.backgroundImage = "url('assets/city.png')";
        }
    }
    setBackground();
    modeSelect.addEventListener("change", setBackground);

    function drawGame() {
        clearCanvas(ctx, canvas.width, canvas.height);

        if (!state.edges.length || !state.positions.length) return;

        drawEdges(ctx, state.edges, state.positions);
        drawNodes(ctx, state.positions);

        if (state.mst.length) {
            drawMSTEdges(ctx, state.mst, state.positions);
        }

        if (state.start !== null) {
            highlightStart(ctx, state.positions[state.start]);
        }
        if (state.end !== null) {
            highlightEnd(ctx, state.positions[state.end]);
        }
    }

    function buildAdjListFromMST() {
        const adj = Array.from({ length: state.n }, () => []);
        for (const [u, v, w] of state.mst) {
            adj[u].push({ v, w });
            adj[v].push({ v: u, w });
        }
        return adj;
    }

    // Find unique path between start and end in MST using BFS
    function findPathCostInMST() {
        if (state.start === null || state.end === null) return null;
        const adj = buildAdjListFromMST();
        const q = [state.start];
        const parent = Array(state.n).fill(-1);
        const visited = Array(state.n).fill(false);
        visited[state.start] = true;

        while (q.length) {
            const u = q.shift();
            if (u === state.end) break;

            for (const { v } of adj[u]) {
                if (!visited[v]) {
                    visited[v] = true;
                    parent[v] = u;
                    q.push(v);
                }
            }
        }

        if (!visited[state.end]) return null;

        let pathNodes = [];
        let cur = state.end;
        while (cur !== -1) {
            pathNodes.push(cur);
            cur = parent[cur];
        }
        pathNodes.reverse();

        // Sum weights along this path
        let cost = 0;
        for (let i = 0; i < pathNodes.length - 1; i++) {
            const a = pathNodes[i];
            const b = pathNodes[i + 1];
            const neighbors = adj[a];
            for (const { v, w } of neighbors) {
                if (v === b) {
                    cost += w;
                    break;
                }
            }
        }
        return cost;
    }

    startBtn.addEventListener("click", () => {
        const n = parseInt(nodesInput.value, 10);
        const algo = algoSelect.value;
        const s = parseInt(startInput.value, 10);
        const e = parseInt(endInput.value, 10);

        if (Number.isNaN(n) || n < 3 || n > 20) {
            return showModal("Invalid Nodes", "Please enter nodes between 3 and 20.");
        }
        if (Number.isNaN(s) || Number.isNaN(e)) {
            return showModal("Missing Nodes", "Enter start and destination nodes.");
        }
        if (s < 0 || s >= n || e < 0 || e >= n) {
            return showModal("Out of Range", `Nodes must be between 0 and ${n - 1}.`);
        }
        if (s === e) {
            return showModal("Invalid Selection", "Start and destination must be different.");
        }

        state.n = n;
        state.start = s;
        state.end = e;

        // approx edges: between n-1 and ~2n
        const m = Math.max(n - 1, n + Math.floor(n / 2));
        state.edges = generateRandomGraph(n, m);

        resizeCanvas();
        state.positions = generateNodePositions(n, canvas.width, canvas.height);

        let mstRes;
        if (algo === "prim") {
            mstRes = primMST(n, state.edges);
        } else {
            mstRes = kruskalMST(n, state.edges);
        }
        state.mst = mstRes.mst;

        drawGame();

        const pathCost = findPathCostInMST();
        if (pathCost == null) {
            statusEl.textContent = `Algorithm built an MST, but start and end are not connected (unexpected).`;
        } else {
            statusEl.textContent = `MST built using ${algo.toUpperCase()}. Path cost from ${s} to ${e}: ${pathCost}`;
        }
    });

    resetBtn.addEventListener("click", () => {
        state = { n: 0, edges: [], positions: [], mst: [], start: null, end: null };
        clearCanvas(ctx, canvas.width, canvas.height);
        statusEl.textContent = "";
    });
});
