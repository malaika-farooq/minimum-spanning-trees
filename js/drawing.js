/*    drawing.js
   Handles ALL canvas drawing:
   - nodes
   - edges
   - weight labels
   - MST highlighting
   - game drawing*/

export function clearCanvas(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
}

//draw graph nodes
export function drawNodes(ctx, positions) {
    ctx.lineWidth = 2;

    for (let i = 0; i < positions.length; i++) {
        const { x, y } = positions[i];

        ctx.beginPath();
        ctx.fillStyle = "#0ea5e9";      
        ctx.strokeStyle = "#0369a1";    
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#1e293b";
        ctx.font = "14px Inter";
        ctx.fillText(i, x - 4, y + 5);
    }
}
 // draw the edges
export function drawEdges(ctx, edges, positions) {
    ctx.strokeStyle = "#94a3b8"; // slate-400
    ctx.lineWidth = 2;

    edges.forEach(([u, v, w]) => {
        const a = positions[u];
        const b = positions[v];

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        drawWeight(ctx, a, b, w);
    });
}

// draw mst edges
export function drawMSTEdges(ctx, edges, positions) {
    ctx.strokeStyle = "#16a34a"; // green-600
    ctx.lineWidth = 4;

    edges.forEach(([u, v, w]) => {
        const a = positions[u];
        const b = positions[v];

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        drawWeight(ctx, a, b, w, true);
    });
}

function drawWeight(ctx, a, b, weight, bold = false) {
    const x = (a.x * 0.75 + b.x * 0.25);
    const y = (a.y * 0.75 + b.y * 0.25);

    ctx.fillStyle = bold ? "#16a34a" : "#1e293b";
    ctx.font = bold ? "bold 16px Inter" : "14px Inter";

    ctx.fillText(weight, x, y - 4);
}

export function highlightStart(ctx, pos) {
    ctx.beginPath();
    ctx.fillStyle = "#22c55e";
    ctx.strokeStyle = "#15803d";
    ctx.lineWidth = 3;
    ctx.arc(pos.x, pos.y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

export function highlightEnd(ctx, pos) {
    ctx.beginPath();
    ctx.fillStyle = "#ffa4a4ff";
    ctx.strokeStyle = "#ff9b9bff";
    ctx.lineWidth = 3;
    ctx.arc(pos.x, pos.y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}
