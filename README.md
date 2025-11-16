# Minimum Spanning Trees | Prim & Kruskal (Visualizer + Performance Analyzer)
Final Project – Design & Analysis of Algorithms

This project implements and visualizes **Minimum Spanning Tree (MST)** algorithms:

- Prim’s Algorithm  
- Kruskal’s Algorithm  

It includes an interactive MST visualizer and a performance comparison page using Chart.js.

---

## 📁 Project Structure

```
/
├── index.html                → Main page
├── visualizer.html           → MST visualizer (Prim + Kruskal)
├── compare.html              → Performance chart experiments
│
├── css/
│   └── styles.css            → Global styles, canvas theme, modal styling
│
├── js/
│   ├── visualizer.js         → Visualizer controller
│   ├── compare.js            → Performance experiment logic + Chart.js
│   ├── graph.js              → Graph generation (random/manual)
│   ├── drawing.js            → Canvas drawing (nodes, edges, MST)
│   ├── mst_prim.js           → Prim’s algorithm
│   ├── mst_kruskal.js        → Kruskal’s algorithm
│   ├── history.js            → Optional history tracking
│   └── utils.js              → Modal + helper utilities
│
└── README.md
```


---

## How to Run

### **1. Open Directly (Simple)**  
Double-click:

```
index.html
```

Project works immediately in any modern browser.

> If modules fail to load, use Live Server.

---

### **2. VS Code Live Server (Recommended)**

1. Open folder in VS Code  
2. Install extension: **Live Server**  
3. Right-click `index.html` → **Open with Live Server**

This automatically launches:

```
http://localhost:5500/
```

---

### **3. Local Web Server (Optional)**

**Python:**
```sh
python3 -m http.server
python -m http.server 8000
```


Open: http://localhost:8000/

**Node:**
```sh
npx http-server .
```

---

##  MST Visualizer (`visualizer.html`)

Features:

- Random graph generator  
- Manual edge creation (`u, v, weight`)  
- Adjustable:
  - Nodes (n)
  - Edges (m)
  - Weight range  
  - Input mode (Random / Manual)
- Side-by-side MST visualization  
- Runs both Prim & Kruskal
- Shows:
  - MST edges  
  - Total weight  
  - Runtime (ms)
- Comparison button  
- Run history table  
- Statistics (average time, best time)
- Line chart using Chart.js

---

##  Performance Analyzer (`compare.html`)

Allows you to measure runtime performance.

Steps:

1. Enter:
   - Nodes (n)
   - Edges (m)
   - Algorithm (Prim / Kruskal)
2. Click **Run Experiment**

Each run:

- Generates a random graph  
- Runs both algorithms  
- Measures runtime using `performance.now()`  
- Displays results in a modal  
- Adds data to a Chart.js line graph  

---

##  Algorithms

### **Prim’s MST — `mst_prim.js`**
- Adjacency list  
- Priority queue via sorted array  
- Time Complexity: **O((n + m) log n)**  
- Returns:
  - MST edges  
  - Total weight  
  - Runtime (ms)

### **Kruskal’s MST — `mst_kruskal.js`**
- Uses Union-Find (DSU) with path compression  
- Sorts edges by weight  
- Time Complexity: **O(m log m)**  
- Returns:
  - MST edges  
  - Total weight  
  - Runtime (ms)

---

##  Canvas Renderer (`drawing.js`)
Handles:

- Drawing nodes  
- Drawing edges  
- Weight labels  
- Highlighting MST edges  
- Responsive resizing  

---

##  Graph Generator (`graph.js`)
Includes:

- Random connected graph generation  
- Manual edge storage  
- Node position generation  
- Switching between random/manual modes  

---

##  Utilities (`utils.js`)
Contains:

- Modal creation  
- Random number generator  
- Helper functions  

---

##  MST History (`history.js`)
Stores:

- Algorithm  
- n, m  
- Weight  
- Runtime  
- Timestamp  


---

## End of README

