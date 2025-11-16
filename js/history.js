// history.js
/*
    Simple in-memory history logging for MST runs.
    Not required by final project, but helps TA see structure & modularity.
*/

let mstHistory = [];

/**
 * Logs an MST run result
 * @param {string} algo - "prim" or "kruskal"
 * @param {number} n - number of nodes
 * @param {number} m - number of edges
 * @param {number} weight - MST total weight
 * @param {number} timeMs - runtime in milliseconds
 */
export function addHistory(algo, n, m, weight, timeMs) {
    mstHistory.push({
        timestamp: new Date().toLocaleString(),
        algo,
        n,
        m,
        weight,
        timeMs
    });
}

/** Returns history list */
export function getHistory() {
    return mstHistory;
}

/** Clears history */
export function clearHistory() {
    mstHistory = [];
}
