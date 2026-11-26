# DAA Project: Master Method Analyzer — Interactive Recurrence Complexity Tool

**Course:** Design and Analysis of Algorithms (DAA)  
**Section:** Sec-Q (AIML)  
**Institution:** SRM University-AP  
**Faculty Guide:** N Nihar Ranjan Pradhan (`niharranjan.p@srmap.edu.in`)  
**Project Group:** Group 6

---

## 👥 Group 6 Members
1. **K. Niharika** — `AP25110070345` (`niharika_kantipudi@srmap.edu.in`) (Project Lead & Frontend/Visualizer Architecture)
2. **N. Likhita** — `AP25110070522` (`likhita_narla@srmap.edu.in`) (Empirical Analysis & Testing)
3. **J. Vaishnavi** — `AP25110070509` (`Vaishnavi_jarugula@srmap.edu.in`) (Theoretical Complexity & Recurrence Proofs)
4. **A. Varshini** — `AP25110070572` (`varshini_adapa@srmap.edu.in`) (Real-World Scenarios & Documentation)

---

## 📋 Problem Statement
> **"Use the Master Method to analyze the time complexity of recursive algorithms (e.g., the Merge Sort algorithm). Provide examples where the Master Theorem applies and discuss cases where it does not. Write down the real time Scenarios where this problem statement can be applicable."**

This companion project answers all three parts through a polished, interactive single-page web application:

1. **Analysis** — an interactive Master Method Lab computes `log_b a`, compares it with `f(n)` and returns the applicable case and Θ-bound with a step-by-step derivation.
2. **Applicability** — eight canonical worked examples (Merge Sort, Binary Search, Karatsuba, …) plus a recursion-tree visualizer that shows *why* each case wins.
3. **Non-applicability** — seven carefully chosen counterexamples explain when the theorem breaks and which alternative method (iteration, substitution, Akra–Bazzi, characteristic roots) to use instead.
4. **Real-time scenarios** — eight industry situations where this analysis directly drives engineering decisions.

---

## 📐 The Master Method — Theory

For a divide-and-conquer recurrence

```
T(n) = a · T(n / b) + f(n),        a ≥ 1,  b > 1,
```

with `f(n) = Θ(n^p · log^k n)` and `c = log_b a` (the **critical exponent**), let `r = a / b^p` be the geometric ratio of work between consecutive recursion-tree levels.

| Case | Condition | Θ-bound | Interpretation |
| :--- | :--- | :--- | :--- |
| **1** | `f(n) = O(n^(c−ε))`, i.e. `p < c` | `Θ(n^c)` | Leaves dominate (`r > 1`) |
| **2** | `f(n) = Θ(n^c)`, i.e. `p = c` | `Θ(n^c log n)` | Every level costs the same (`r = 1`) |
| **2 (generalized)** | `f(n) = Θ(n^c log^k n)`, `k ≥ 0` | `Θ(n^c log^(k+1) n)` | Adds one logarithm per level |
| **3** | `f(n) = Ω(n^(c+ε))`, i.e. `p > c`, **and** regularity `a·f(n/b) ≤ c'·f(n)`, `c' < 1` | `Θ(f(n))` | Root dominates (`r < 1`) |

For `f(n) = n^p log^k n` with `p > c`, regularity always holds because `a/b^p < 1`.

### Worked example — Merge Sort (Case 2)
```
T(n) = 2 T(n/2) + Θ(n)
a = 2, b = 2, f(n) = Θ(n), log_2 2 = 1
f(n) = Θ(n^1) = Θ(n^(log_b a))  →  Case 2
T(n) = Θ(n log n)   [best = average = worst]
```

---

## ✅ Where the Master Theorem Applies

| Algorithm / Recurrence | a | b | c = log_b a | Case | Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Merge Sort — `2T(n/2)+n` | 2 | 2 | 1 | 2 | Θ(n log n) |
| Binary Search — `T(n/2)+1` | 1 | 2 | 0 | 2 | Θ(log n) |
| `2T(n/2)+1` | 2 | 2 | 1 | 1 | Θ(n) |
| `8T(n/2)+n²` | 8 | 2 | 3 | 1 | Θ(n³) |
| `2T(n/2)+n²` | 2 | 2 | 1 | 3 | Θ(n²) |
| Karatsuba multiplication — `3T(n/2)+n` | 3 | 2 | 1.585 | 1 | Θ(n^1.585) |
| `3T(n/4)+n log n` | 3 | 4 | 0.793 | 3 | Θ(n log n) |
| `4T(n/2)+n² log n` | 4 | 2 | 2 | 2 (generalized) | Θ(n² log² n) |

---

## ❌ Where It Does Not Apply

| Recurrence | Why it fails | Correct method / result |
| :--- | :--- | :--- |
| `T(n)=T(n−1)+n` | Subtractive shrink, not `n/b` | Iteration → Θ(n²) |
| `T(n)=T(n/3)+T(2n/3)+n` | Unequal subproblem sizes | Akra–Bazzi → Θ(n log n) |
| `T(n)=2T(n/2)+n/log n` | Sub-polynomial gap; even `log^k`, `k≥0` fails | Akra–Bazzi → Θ(n log log n) |
| `T(n)=T(n−1)+T(n−2)+Θ(1)` | Two different sizes; `b` undefined | Characteristic roots → Θ(φⁿ) |
| `T(n)=n·T(n/2)+n²` | `a` is not a constant | Direct unrolling |
| `f(n)=n(1−2 sin n)` | Toll not asymptotically positive | Substitution with bounds |
| `T(n)=2T(n/2)+n log log n` | `f` not of form `n^c log^k n` | Recursion tree → Θ(n log n log log n) |

**Checklist:** the theorem requires constant `a`, constant `b > 1`, asymptotically positive `f`, equally sized subproblems, and a polynomial gap (or a `log^k` factor with `k ≥ 0`).

---

## 🌍 Real-Time Scenarios Where This Problem Statement Applies

1. **External sorting in databases & data lakes** — PostgreSQL merge joins, Hadoop/Spark shuffle and LSM-tree compaction use merge-style passes. Case 2 predicts the Θ(n log n) pass count for I/O capacity planning.
2. **Standard-library sorting & worst-case guarantees** — Introsort switches to heapsort past `2·log n` recursion depth; Master analysis explains why balanced splits give Θ(n log n) and unbalanced ones Θ(n²).
3. **Binary search & decision-tree algorithms** — every halving step with O(1) work is Case 2 (a=1, b=2, log₂1=0) → Θ(log n); predicts lookup cost in B-trees, router tables and autocomplete tries.
4. **Fast multiplication (Karatsuba / Strassen)** — Case 1 recurrences; the theorem tells designers whether extra recursive calls beat classical Θ(n²) multiplication.
5. **Parallel & distributed divide-and-conquer** — MapReduce, parallel prefix scans and fork/join sorts; `log_b a` estimates speedup and task depth before work becomes sequential.
6. **ML data structures** — kd-tree / decision-tree construction and hierarchical clustering; the bound predicts build time and depth for large feature stores.
7. **Resource & stack-depth budgeting** — balanced recursion depth is Θ(log_b n) but Θ(n) when degenerate; used to set stack sizes, thread pools and timeouts.
8. **Compiler & algorithm design decisions** — fast asymptotic screening between two divide-and-conquer strategies before implementation; a standard DAA code-review tool.

---

## 🌟 Key Application Features

1. **⚡ Master Method Lab** — enter `a`, `b`, `p`, `k`; get the case, the comparison of `p` against `log_b a`, the geometric ratio, a balance-scale visual, a step-by-step derivation and the Θ-bound. Includes quick presets and a clear standard-vs-generalized indicator.
2. **🌳 Recursion Tree Visualizer** — draws the first levels of the recursion tree, a level-by-level work table and a Chart.js bar chart of work per level; highlights whether the root, the levels or the leaves dominate.
3. **📚 Worked Examples Gallery** — eight canonical recurrences, each loadable directly into the lab.
4. **⚠️ When It Fails Gallery** — seven counterexamples with the reason and the correct alternative method.
5. **🌍 Real-World Scenarios** — eight industry situations tied directly to the analysis.
6. **💻 Reference Implementations** — a Master Theorem classifier plus Merge Sort in Python, C++ and Java, with one-click copy.
7. **🎤 Viva Prep** — five curated Master-Method viva questions with answers, plus a ready-to-post LinkedIn draft.

---

## 💻 How to Run Locally

```bash
cd "DAA-MASTER-THEOREM"
python -m http.server 3000
```
Open 👉 `http://localhost:3000`.

Run the standalone Python classifier:
```bash
python3 src/master_theorem_solver.py
python3 src/master_theorem_solver.py 3 2 1 0     # Karatsuba
```

---

## 🚀 Deploy on Vercel

1. Push this folder to a new GitHub repository.
2. In Vercel, **Add New Project → Import Git Repository**, select the repo.
3. Framework Preset: **Other** (static web app, no build step).
4. Click **Deploy** — your live URL appears in seconds.

`vercel.json` is already included.

---

## 📁 Project Structure

```
DAA-MASTER-THEOREM/
├── index.html                      # Single-page app (7 tabs)
├── css/styles.css                  # Hand-written plain light stylesheet
├── js/
│   ├── master-engine.js            # Pure classifier, recursion tree, example data
│   ├── master-lab.js               # Lab + tree visualizer controllers
│   └── app.js                      # Tabs, lists, code snippets, copy, viva
├── src/
│   └── master_theorem_solver.py    # CLI reference implementation
├── presentation/
│   └── PRESENTATION_SLIDES.md      # 10-slide talk track with speaker notes
├── DAA_Master_Method_Analyzer_Report.docx  # Formal project report
├── vercel.json
└── README.md
```

---

## ✅ Submission Checklist
- [x] Master Method Lab with step-by-step derivation
- [x] Recursion Tree Visualizer with Chart.js graph
- [x] Worked examples where the theorem applies
- [x] Counterexamples where it does not apply + alternative methods
- [x] Real-time industry scenarios
- [x] Python / C++ / Java reference implementations
- [x] Viva Q&A cheatsheet and LinkedIn post draft
- [x] 10-slide presentation with speaker notes
- [x] Formal Word (.docx) project report
- [x] Vercel deployment configuration
