// visualizer.js
// MST Visualizer (Prim + Kruskal)(with  rand and manual input logic)

import {
    resetManualEdges,
    addManualEdge,
    getFinalEdges,
    generateNodePositions
} from "./graph.js";

import {
    clearCanvas,
    drawNodes,
    drawEdges,
    drawMSTEdges
} from "./drawing.js";

import { primMST } from "./mst_prim.js";
import { kruskalMST } from "./mst_kruskal.js";
import { showModal } from "./utils.js";

window.addEventListener("DOMContentLoaded", () => {

    const nodesInput = document.getElementById("visNodes");
    const edgesInput = document.getElementById("visEdges");
    const minWInput = document.getElementById("visMinWeight");
    const maxWInput = document.getElementById("visMaxWeight");
    const modeInput = document.getElementById("visInputMode");

    const manualContainer = document.getElementById("manualInputContainer");
    const mU = document.getElementById("mU");
    const mV = document.getElementById("mV");
    const mW = document.getElementById("mW");
    const addManualEdgeBtn = document.getElementById("addManualEdgeBtn");

    // BUTTONS
    const buildBtn = document.getElementById("generateGraphBtn");
    const clearBtn = document.getElementById("clearGraphBtn");
    const runMSTBtn = document.getElementById("runMSTBtn");
    const compareBtn = document.getElementById("compareBtn");

    //CANVASES
    const primCanvas = document.getElementById("primCanvas");
    const primCtx = primCanvas.getContext("2d");

    const kruskalCanvas = document.getElementById("kruskalCanvas");
    const kruskalCtx = kruskalCanvas.getContext("2d");


    // CHART + HISTORY + STATS
    const historyBody = document.getElementById("visHistoryBody");
    const statsPrimAvg = document.getElementById("statsPrimAvg");
    const statsPrimBest = document.getElementById("statsPrimBest");
    const statsKruskalAvg = document.getElementById("statsKruskalAvg");
    const statsKruskalBest = document.getElementById("statsKruskalBest");

    const chartCanvas = document.getElementById("visCompareChart");
    const chartCtx = chartCanvas.getContext("2d");

    let labels = [];
    let primTimes = [];
    let kruskalTimes = [];

    const chart = new Chart(chartCtx, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Prim (ms)",
                    data: primTimes,
                    borderColor: "#3b82f6",
                    backgroundColor: "rgba(59,130,246,0.15)",
                    borderWidth: 3,
                    tension: 0.25,
                    pointRadius: 3
                },
                {
                    label: "Kruskal (ms)",
                    data: kruskalTimes,
                    borderColor: "#f43f5e",
                    backgroundColor: "rgba(244,63,94,0.15)",
                    borderWidth: 3,
                    tension: 0.25,
                    pointRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            animation: false,
            scales: {
                x: { title: { display: true, text: "Experiment #" } },
                y: {
                    title: { display: true, text: "Time (ms)" },
                    beginAtZero: true
                }
            }
        }
    });

    // INTERNAL STATE
    let state = {
        n: 0,
        m: 0,
        minW: 1,
        maxW: 20,
        mode: "random",
        edges: [],
        positions: [],
        primRes: null,
        kruskalRes: null
    };

    let history = [];

    //CANVAS RESIZE HANDLING
    function resizeCanvases() {
        [primCanvas, kruskalCanvas].forEach(canvas => {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        });
        // keep drawing consistent after resize
        redrawBaseGraph();
    }
    resizeCanvases();
    window.addEventListener("resize", resizeCanvases);

    // REDRAW BASE GRAPH (NO MST)
    function redrawBaseGraph() {
        if (!state.positions.length) return;

        clearCanvas(primCtx, primCanvas.width, primCanvas.height);
        clearCanvas(kruskalCtx, kruskalCanvas.width, kruskalCanvas.height);

        if (state.edges.length) {
            drawEdges(primCtx, state.edges, state.positions);
            drawEdges(kruskalCtx, state.edges, state.positions);
        }

        drawNodes(primCtx, state.positions);
        drawNodes(kruskalCtx, state.positions);
    }

    // MODE HANDLING
    modeInput.addEventListener("change", () => {
        state.mode = modeInput.value;

        if (state.mode === "manual") {
            manualContainer.classList.remove("hidden");
            resetManualEdges();
            // For manual mode we can build edges incrementally,
            // so state.edges will be filled as user adds edges.
            state.edges = [];
            redrawBaseGraph();
        } else {
            manualContainer.classList.add("hidden");
            resetManualEdges();
            state.edges = [];
            redrawBaseGraph();
        }
    });

    // MANUAL EDGE HANDLER
    addManualEdgeBtn.addEventListener("click", () => {
        const u = parseInt(mU.value, 10);
        const v = parseInt(mV.value, 10);
        const w = parseInt(mW.value, 10);

        if ([u, v, w].some(x => Number.isNaN(x))) {
            return showModal("Invalid Edge", "Please enter numeric u, v, and weight.");
        }

        if (state.n <= 0) {
            return showModal("Set Nodes First", "Enter number of nodes and build graph first.");
        }

        // valid range: 0..n-1
        if (u < 0 || u >= state.n || v < 0 || v >= state.n) {
            return showModal(
                "Out of Range",
                `u and v must be between 0 and ${state.n - 1}.`
            );
        }

        if (u === v) {
            return showModal("Invalid Edge", "u and v must be different nodes.");
        }

        if (w <= 0) {
            return showModal("Invalid Weight", "Weight must be positive.");
        }

        // store edge for MST (graph.js keeps its own manual list)
        addManualEdge(u, v, w);

        // refresh local edge list from graph.js (includes all manual edges now)
        state.edges = getFinalEdges(
            state.n,
            state.m,
            state.mode,
            state.minW,
            state.maxW
        );

        // immediately redraw on both Prim & Kruskal canvases
        redrawBaseGraph();

        // clear inputs
        mU.value = "";
        mV.value = "";
        mW.value = "";
    });

    //BUILD GRAPH (RANDOM or MANUAL)
    buildBtn.addEventListener("click", () => {
        const n = parseInt(nodesInput.value, 10);
        let m = parseInt(edgesInput.value, 10);
        let minW = parseInt(minWInput.value, 10);
        let maxW = parseInt(maxWInput.value, 10);

        if (Number.isNaN(n) || n < 2) {
            return showModal("Invalid Nodes", "Please enter n ≥ 2.");
        }

        if (Number.isNaN(m)) m = n + Math.floor(n / 2);
        if (Number.isNaN(minW)) minW = 1;
        if (Number.isNaN(maxW)) maxW = minW + 10;

        if (minW > maxW) {
            return showModal("Invalid Weights", "Min weight must be ≤ Max weight.");
        }

        state.n = n;
        state.m = m;
        state.minW = minW;
        state.maxW = maxW;
        state.mode = modeInput.value;

        resizeCanvases();

        // generate node positions once
        state.positions = generateNodePositions(
            n,
            primCanvas.width,
            primCanvas.height
        );

        // edges:
        // random mode -> generate random edges
        // manual mode -> whatever has already been added; if none yet, edges = []
        state.edges = getFinalEdges(n, m, state.mode, minW, maxW);

        state.primRes = null;
        state.kruskalRes = null;

        redrawBaseGraph();
        showModal("Graph Ready", "Graph generated successfully.");
    });

    //CLEAR GRAPH
    clearBtn.addEventListener("click", () => {
        state = {
            n: 0,
            m: 0,
            minW: 1,
            maxW: 20,
            mode: modeInput.value,
            edges: [],
            positions: [],
            primRes: null,
            kruskalRes: null
        };
        resetManualEdges();

        clearCanvas(primCtx, primCanvas.width, primCanvas.height);
        clearCanvas(kruskalCtx, kruskalCanvas.width, kruskalCanvas.height);
    });

    function ensureGraph() {
        if (!state.edges.length || !state.positions.length) {
            showModal("No Graph", "Build the graph first (and add edges in manual mode).");
            return false;
        }
        return true;
    }

    //RUN MST (PRIM + KRUSKAL TOGETHER)
    runMSTBtn.addEventListener("click", () => {
        if (!ensureGraph()) return;

        // Prim
        const primRes = primMST(state.n, state.edges);
        state.primRes = primRes;

        clearCanvas(primCtx, primCanvas.width, primCanvas.height);
        drawEdges(primCtx, state.edges, state.positions);
        drawNodes(primCtx, state.positions);
        drawMSTEdges(primCtx, primRes.mst, state.positions);

        // Kruskal
        const kruskalRes = kruskalMST(state.n, state.edges);
        state.kruskalRes = kruskalRes;

        clearCanvas(kruskalCtx, kruskalCanvas.width, kruskalCanvas.height);
        drawEdges(kruskalCtx, state.edges, state.positions);
        drawNodes(kruskalCtx, state.positions);
        drawMSTEdges(kruskalCtx, kruskalRes.mst, state.positions);

        showModal(
            "MST Completed",
            `Prim → ${primRes.totalWeight.toFixed(2)} (${primRes.timeMs.toFixed(
                3
            )} ms)\n` +
            `Kruskal → ${kruskalRes.totalWeight.toFixed(
                2
            )} (${kruskalRes.timeMs.toFixed(3)} ms)`
        );
    });

    // COMPARE BUTTON (uses LAST run)
    compareBtn.addEventListener("click", () => {
        if (!state.primRes || !state.kruskalRes) {
            return showModal("No MST Yet", "Run MST first, then compare.");
        }

        const record = {
            n: state.n,
            m: state.m,
            minW: state.minW,
            maxW: state.maxW,
            primTime: state.primRes.timeMs,
            kruskalTime: state.kruskalRes.timeMs,
            primWeight: state.primRes.totalWeight,
            kruskalWeight: state.kruskalRes.totalWeight
        };

        history.push(record);

        labels.push(history.length);
        primTimes.push(record.primTime);
        kruskalTimes.push(record.kruskalTime);
        chart.update();

        renderHistory();
        updateStats();
    });

    //HISTORY TABLE
    function renderHistory() {
        historyBody.innerHTML = "";
        history.forEach((h, i) => {
            const tr = document.createElement("tr");
            tr.className = "border-t";
            tr.innerHTML = `
                <td class="py-1 pr-4">${i + 1}</td>
                <td class="py-1 pr-4">${h.n}</td>
                <td class="py-1 pr-4">${h.m}</td>
                <td class="py-1 pr-4">[${h.minW}, ${h.maxW}]</td>
                <td class="py-1 pr-4">${h.primTime.toFixed(3)}</td>
                <td class="py-1 pr-4">${h.kruskalTime.toFixed(3)}</td>
                <td class="py-1 pr-4">${h.primWeight.toFixed(2)}</td>
                <td class="py-1 pr-4">${h.kruskalWeight.toFixed(2)}</td>
            `;
            historyBody.appendChild(tr);
        });
    }

    //STATISTICS 
    function updateStats() {
        const prim = history.map(h => h.primTime);
        const kruskal = history.map(h => h.kruskalTime);

        if (prim.length) {
            const avg = prim.reduce((a, b) => a + b, 0) / prim.length;
            const best = Math.min(...prim);
            statsPrimAvg.textContent = avg.toFixed(3);
            statsPrimBest.textContent = best.toFixed(3);
        }

        if (kruskal.length) {
            const avg = kruskal.reduce((a, b) => a + b, 0) / kruskal.length;
            const best = Math.min(...kruskal);
            statsKruskalAvg.textContent = avg.toFixed(3);
            statsKruskalBest.textContent = best.toFixed(3);
        }
    }
});
