import { generateRandomGraph } from "./utils.js";
import { primMST } from "./mst_prim.js";
import { kruskalMST } from "./mst_kruskal.js";
import { showModal } from "./utils.js";

window.addEventListener("DOMContentLoaded", () => {

    const nInput = document.getElementById("cmpNodes");
    const mInput = document.getElementById("cmpEdges");
    const algoSelect = document.getElementById("cmpAlgo");
    const runBtn = document.getElementById("cmpRunBtn");

    const chartCanvas = document.getElementById("compareChart");
    const ctx = chartCanvas.getContext("2d");

    let labels = [];
    let primTimes = [];
    let kruskalTimes = [];

    // line chart
    const chart = new Chart(ctx, {
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
                    tension: 0.3,
                    pointRadius: 6,
                    pointStyle: "circle",
                    pointBackgroundColor: "#3b82f6"
                },
                {
                    label: "Kruskal (ms)",
                    data: kruskalTimes,
                    borderColor: "#22c55e",
                    backgroundColor: "rgba(34,197,94,0.15)",
                    borderWidth: 3,
                    tension: 0.3,
                    pointRadius: 6,
                    pointStyle: "circle",
                    pointBackgroundColor: "#22c55e"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 500 },
            scales: {
                x: {
                    title: { display: true, text: "Experiment Index" },
                    ticks: { color: "#374151" }
                },
                y: {
                    title: { display: true, text: "Time (ms)" },
                    beginAtZero: true,
                    ticks: { color: "#374151" }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: "#374151",
                        font: { size: 14 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.dataset.label}: ${ctx.raw} ms`
                    }
                }
            }
        }
    });

    // run the experiment bugtton
    runBtn.addEventListener("click", () => {

        const n = parseInt(nInput.value, 10);
        const m = parseInt(mInput.value, 10);
        const algo = algoSelect.value;

        if (Number.isNaN(n) || n < 2) {
            return showModal("Invalid Input", "Please enter a valid number of nodes (≥ 2).");
        }

        if (Number.isNaN(m) || m < n - 1) {
            return showModal("Invalid Input", "Edges must be at least n - 1.");
        }

        //generating random graph
        const graph = generateRandomGraph(n, m, 1, 20);

        // always run BOTH algorithms for comparison
        const prim = primMST(n, graph.edges);
        const kruskal = kruskalMST(n, graph.edges);

        // push results
        labels.push(labels.length + 1);
        primTimes.push(Number(prim.timeMs.toFixed(3)));
        kruskalTimes.push(Number(kruskal.timeMs.toFixed(3)));

        chart.update();

        showModal(
            "Experiment Complete",
            `Prim: ${prim.timeMs.toFixed(3)} ms\nKruskal: ${kruskal.timeMs.toFixed(3)} ms`
        );
    });

});
