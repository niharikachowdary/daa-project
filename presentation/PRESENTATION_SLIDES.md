# Project Presentation: Master Method Analyzer

**Course:** Design and Analysis of Algorithms (DAA)  
**Section:** Sec-Q (AIML)  
**Institution:** SRM University-AP  
**Faculty Guide:** N Nihar Ranjan Pradhan (`niharranjan.p@srmap.edu.in`)  
**Group:** Group 6

---

## Slide 1: Title & Group Details

- **Title:** Master Method Analyzer — Analyzing Recursive Algorithm Complexity with the Master Theorem
- **Team Members:**
  1. K. Niharika (AP25110070345) — `niharika_kantipudi@srmap.edu.in` — Team Lead, Frontend & Visualizer
  2. N. Likhita (AP25110070522) — `likhita_narla@srmap.edu.in` — Empirical Analysis & Testing
  3. J. Vaishnavi (AP25110070509) — `Vaishnavi_jarugula@srmap.edu.in` — Theoretical Complexity & Recurrence Proofs
  4. A. Varshini (AP25110070572) — `varshini_adapa@srmap.edu.in` — Real-World Scenarios & Documentation
- **Faculty Guide:** N Nihar Ranjan Pradhan, SRM University-AP

*Speaker notes (≈1 min):* Introduce Group 6, the course and the guide. State that the project is a working tool, not just a report: it classifies recurrences, draws recursion trees and maps the theory to real systems.

---

## Slide 2: Problem Statement & Objectives

- **Problem Statement:** Use the Master Method to analyze the time complexity of recursive algorithms (e.g., Merge Sort). Provide examples where the Master Theorem applies and discuss cases where it does not. Write down the real-time scenarios where this problem statement can be applicable.
- **Objectives:**
  - State the three Master Theorem cases precisely, including the regularity condition.
  - Analyze Merge Sort and other divide-and-conquer recurrences with the method.
  - Separate recurrences the theorem covers from those requiring iteration, substitution or Akra–Bazzi.
  - Build an interactive web tool that demonstrates each case and its real-world use.

*Speaker notes (≈1 min):* Read the statement aloud, then point out its three tasks: analyze, contrast valid/invalid cases, and name real scenarios. Our deliverable addresses all three in one application.

---

## Slide 3: The Master Theorem

For a divide-and-conquer recurrence

$$
T(n) = a\,T(n/b) + f(n), \qquad a \ge 1,\; b > 1,
$$

let $c = \log_b a$ (the critical exponent) and $f(n) = \Theta(n^p \log^k n)$.

| Case | Condition | Result | Intuition |
| :--- | :--- | :--- | :--- |
| 1 | $p < c$ | $T(n) = \Theta(n^c)$ | Leaves dominate |
| 2 | $p = c$ | $T(n) = \Theta(n^c \log n)$ | Work is balanced across levels |
| 2 (generalized) | $p = c,\; k \ge 0$ | $T(n) = \Theta(n^c \log^{k+1} n)$ | One extra logarithm per level |
| 3 | $p > c$ and $a\,f(n/b) \le c' f(n)$ for $c' < 1$ | $T(n) = \Theta(f(n))$ | Root dominates |

*Speaker notes (≈2 min):* Emphasize that $c$ is the growth rate of the leaves and $f(n)$ is the toll paid at each node. Case 3 needs regularity so an oscillating toll cannot break the geometric-sum argument. The generalized row is the common extension found in practice; plain CLRS requires $f(n) = \Theta(n^c)$ exactly.

---

## Slide 4: Worked Example — Merge Sort (Case 2)

- **Principle:** Split the array into two halves, sort each recursively, then merge with a linear two-pointer pass.
- **Recurrence:** $T(n) = 2T(n/2) + \Theta(n)$
- **Parameters:** $a = 2$, $b = 2$, $f(n) = \Theta(n)$, $\log_2 2 = 1$.
- **Analysis:** $f(n) = \Theta(n^{1}) = \Theta(n^{\log_b a})$ → Case 2 → $T(n) = \mathbf{\Theta(n \log_2 n)}$.
- **Recursion tree:** each level processes $\Theta(n)$ elements and there are $\Theta(\log n)$ levels, so the total is $\Theta(n \log n)$ in best, average and worst cases.

*Speaker notes (≈1.5 min):* This is the main example requested in the problem statement. Show the lab result on screen: enter a=2, b=2, p=1, k=0 and point at the derivation list. Note that Merge Sort's bound is input-independent.

---

## Slide 5: More Examples Where It Applies

| Recurrence | $a$ | $b$ | $\log_b a$ | Case | Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| $T(n) = T(n/2) + 1$ (Binary Search) | 1 | 2 | 0 | 2 | $\Theta(\log n)$ |
| $T(n) = 2T(n/2) + 1$ | 2 | 2 | 1 | 1 | $\Theta(n)$ |
| $T(n) = 2T(n/2) + n^2$ | 2 | 2 | 1 | 3 | $\Theta(n^2)$ |
| $T(n) = 3T(n/2) + n$ (Karatsuba) | 3 | 2 | $1.585$ | 1 | $\Theta(n^{1.585})$ |
| $T(n) = 3T(n/4) + n\log n$ | 3 | 4 | $0.793$ | 3 | $\Theta(n\log n)$ |
| $T(n) = 4T(n/2) + n^2\log n$ | 4 | 2 | 2 | 2 (gen.) | $\Theta(n^2\log^2 n)$ |

*Speaker notes (≈1.5 min):* Highlight Binary Search: $\log_2 1 = 0$, so the toll $n^0 = 1$ matches the critical exponent and Case 2 yields $\Theta(\log n)$. Highlight Karatsuba as the practical reason Case 1 matters — three half-size multiplications beat classical $\Theta(n^2)$.

---

## Slide 6: Where the Master Theorem Fails

| Recurrence | What breaks | Correct method / result |
| :--- | :--- | :--- |
| $T(n) = T(n-1) + n$ | Shrinks by subtraction, not $n/b$ | Iteration → $\Theta(n^2)$ |
| $T(n) = T(n/3) + T(2n/3) + n$ | Unequal subproblem sizes | Akra–Bazzi → $\Theta(n\log n)$ |
| $T(n) = 2T(n/2) + n/\log n$ | Sub-polynomial gap; $\log^k$ extension ($k \ge 0$) fails | Akra–Bazzi → $\Theta(n\log\log n)$ |
| $T(n) = T(n-1) + T(n-2) + \Theta(1)$ | Two different sizes; $b$ undefined | Characteristic roots → $\Theta(\phi^n)$ |
| $T(n) = n\,T(n/2) + n^2$ | $a$ is not constant | Direct unrolling |
| $f(n) = n(1 - 2\sin n)$ | Toll not asymptotically positive | Substitution with upper/lower bounds |
| $T(n) = 2T(n/2) + n\log\log n$ | $f(n)$ is not $n^c\log^k n$ for constant $k$ | Recursion tree → $\Theta(n\log n\log\log n)$ |

*Speaker notes (≈2 min):* The theorem is a tool with strict preconditions, not a universal solver. Give the checklist: constant $a$, constant $b > 1$, equal splits, positive toll, polynomial separation from $n^{\log_b a}$. When one fails, name the replacement method.

---

## Slide 7: Recursion Tree Intuition

At level $i$ of $T(n) = aT(n/b) + f(n)$:

$$
\text{nodes at level } i = a^i, \qquad \text{subproblem size} = n/b^i, \qquad \text{work at level } i = a^i f(n/b^i).
$$

Consecutive levels scale by $a/b^p$:

- $a/b^p > 1$ → work grows toward the leaves → Case 1.
- $a/b^p = 1$ → every level costs the same → Case 2.
- $a/b^p < 1$ → work shrinks toward the leaves → Case 3 (root dominates).

*Speaker notes (≈1.5 min):* This slide explains *why* the cases work instead of just stating them. Demo the Recursion Tree tab with a=2, b=2, p=1, n=64: the work column stays at 64 on every level. Then switch p=2 and watch the first row dominate.

---

## Slide 8: Real-Time Scenarios

1. **External sorting in databases & data lakes** — merge-style passes in PostgreSQL, Hadoop/Spark and LSM compaction; Case 2 predicts the $\Theta(n\log n)$ pass count for I/O planning.
2. **Standard-library sorting and worst-case guarantees** — Introsort switches to heapsort past $2\log n$ depth; balanced splits give $\Theta(n\log n)$, unbalanced ones $\Theta(n^2)$.
3. **Binary search and decision-tree algorithms** — each halving with $O(1)$ work is Case 2 → $\Theta(\log n)$ lookups in B-trees and router tables.
4. **Fast multiplication (Karatsuba / Strassen)** — Case 1 recurrences decide whether extra recursive calls beat classical $\Theta(n^2)$ multiplication.
5. **Parallel and distributed divide-and-conquer** — MapReduce and fork/join sorts; $\log_b a$ estimates speedup and task depth.
6. **Machine-learning data structures** — kd-tree and decision-tree construction; the bound predicts build time for large feature stores.
7. **Resource and stack-depth budgeting** — balanced depth is $\Theta(\log_b n)$ but $\Theta(n)$ when degenerate; used to set stack sizes and timeouts.
8. **Compiler and algorithm design decisions** — fast asymptotic screening between two divide-and-conquer strategies before implementation.

*Speaker notes (≈2 min):* Connect scenarios to cases: 1 and 3 are Case 2, 4 is Case 1, and 2 contrasts balanced with unbalanced behavior. Scenario 7 shows why the failure cases matter — a $\Theta(n)$ depth recurrence can crash a service.

---

## Slide 9: The Tool & Live Demo

- **Stack:** plain HTML, a hand-written stylesheet and vanilla ES modules — no UI framework or icon library.
- **Modules:** `master-engine.js` (classifier + tree builder + data), `master-lab.js` (form, derivation, tree and chart), `app.js` (tabs, reference lists, code samples), plus `src/master_theorem_solver.py` as a CLI version of the same logic.
- **Demo sequence:**
  1. Lab — Merge Sort (a=2, b=2, p=1, k=0) → Case 2, $\Theta(n\log n)$, walk through the derivation steps.
  2. Presets — Binary Search → $\Theta(\log n)$; Karatsuba → $\Theta(n^{1.585})$, Case 1.
  3. Recursion tree — build n=64, show equal work per level; change p=2 to show root dominance.
  4. Worked examples / Where it fails — contrast the unequal-split recurrence with its Akra–Bazzi result.

*Speaker notes (≈2 min):* Keep the demo short and scripted. If time is tight, show steps 1 and 3 only — they directly answer "analyze Merge Sort with the Master Method."

---

## Slide 10: Conclusion, Viva & References

- **Conclusion:** The Master Method turns a recurrence into an asymptotic bound in seconds, provided its strict form conditions hold. Recognizing when it fails is equally important; then iteration, substitution or Akra–Bazzi takes over. This analysis underpins sorting, searching, multiplication, distributed computing and capacity planning in real systems.
- **Viva preparation:** five Master-Method questions with answers are in the **Team & Viva** tab of the web app.
- **References:**
  - Cormen, Leiserson, Rivest & Stein, *Introduction to Algorithms*, 3rd ed., Ch. 4 (Master Theorem).
  - Sedgewick & Wayne, *Algorithms*, 4th ed., divide-and-conquer analysis.
  - Akra & Bazzi, "A Method for the Analysis of Recursive Divide-and-Conquer Algorithms," *Theoretical Computer Science*, 1998.
  - SRM University-AP DAA course material, 2026.

*Speaker notes (≈1 min):* Close with the two takeaways — the theorem is fast but conditional — and invite questions.

**Thank you · Questions?**
