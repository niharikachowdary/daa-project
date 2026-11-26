# Project Video Script — Master Method Analyzer

**Duration:** ~6 minutes  
**Group:** Group 6, Sec-Q AIML, SRM University-AP  
**Faculty Guide:** N Nihar Ranjan Pradhan  
**Recording tip:** Record the web app at 1280×720 or higher. Keep one speaker on screen at a time; cut to the browser tab when the script says "screen:". Speak at a normal pace — each block below is roughly 45–75 seconds.

## Cast

| Speaker | Role in the video |
| :--- | :--- |
| K. Niharika | Introduction, problem statement, tool overview and live lab demo |
| N. Likhita | Theory: the three cases, recursion tree and empirical verification |
| J. Vaishnavi | Worked examples, Merge Sort derivation and failure cases |
| A. Varshini | Real-world scenarios, conclusion and closing |

---

## 0:00–0:45 — Introduction (Niharika)

**Screen:** Slide 1 (title and group details), then cut to the app header.

> "Hi everyone, we are Group 6 from Sec-Q AIML, SRM University-AP. Our DAA project is the **Master Method Analyzer** — a working tool that takes a divide-and-conquer recurrence, identifies which case of the Master Theorem applies, and returns the asymptotic bound with a full derivation. Our faculty guide is N Nihar Ranjan Pradhan. In this video we'll walk through the problem statement, the theory, a live demonstration, the cases where the theorem fails, and the real systems where this analysis is used."

---

## 0:45–1:30 — Problem statement (Niharika)

**Screen:** Slide 2, then the problem-statement block at the top of the web app.

> "Our problem statement has three parts. First, use the Master Method to analyze recursive algorithms such as Merge Sort. Second, give examples where the theorem applies and discuss where it does not. Third, write down real-time scenarios where this analysis is applicable. The web app addresses all three in one place: a lab for analysis, a recursion-tree view for intuition, worked examples and failure cases, and a tab of industry scenarios."

---

## 1:30–2:30 — Theory and recursion tree (N. Likhita)

**Screen:** Slides 3 and 7; then the Recursion Tree tab with a=2, b=2, p=1, n=64.

> "The Master Theorem solves recurrences of the form T of n equals a times T of n over b plus f of n. Here a is the number of subproblems, b is the shrink factor, and f of n is the work done outside the recursive calls. We define the critical exponent c as log base b of a, and write the toll as n to the power p times log to the k. Case 1 applies when p is less than c — the leaves dominate, giving theta of n to the c. Case 2 applies when p equals c — every level costs the same, giving theta of n to the c log n; with a log-to-the-k factor it becomes theta of n to the c log to the k plus one. Case 3 applies when p is greater than c and regularity holds — the root dominates, giving theta of f of n.
>
> The recursion tree explains why. At level i there are a to the i nodes of size n over b to the i, so the level's work is a to the i times f of n over b to the i. Consecutive levels scale by a over b to the p. On screen, with Merge Sort parameters a equals two, b equals two, p equals one, every level processes exactly 64 units of work — that is Case 2."

---

## 2:30–3:30 — Worked example: Merge Sort (Vaishnavi)

**Screen:** Slide 4; then the Lab tab. Type a=2, b=2, p=1, k=0 and press **Analyze**.

> "Let's solve the main example from the problem statement. Merge Sort splits the array into two halves, sorts each recursively, and merges them with a linear pass. Its recurrence is T of n equals two T of n over two plus theta of n. So a is two, b is two, f of n is theta of n, and log base two of two is one. Since f of n is theta of n to the one, which equals n to the log base b of a, this is Case 2. The result is theta of n log n — the same in best, average and worst cases, because Merge Sort always splits evenly. Notice the derivation list in the lab: it shows each step, from identifying the constants to applying the case."

---

## 3:30–4:20 — More examples and where it fails (Vaishnavi)

**Screen:** Slides 5 and 6; then the Worked Examples and Where It Fails tabs.

> "The theorem covers many classic recurrences. Binary Search is Case 2 with a equals one, giving theta of log n. Two T of n over two plus one is Case 1, theta of n. Karatsuba multiplication uses three half-size calls, so log base two of three is about 1.585, which is greater than one — Case 1, theta of n to the 1.585, better than classical multiplication.
>
> But the theorem has strict conditions. It fails when subproblems are unequal, as in T of n over three plus T of two n over three — that needs Akra–Bazzi and gives theta of n log n. It fails for decrease-and-conquer like T of n minus one plus n, where iteration gives theta of n squared. And a sub-polynomial gap such as n over log n falls outside even the log-to-the-k extension. Our failure tab lists each of these with the correct alternative method."

---

## 4:20–5:20 — Live demo (Niharika)

**Screen:** Lab tab with presets, then Recursion Tree tab, then Worked Examples tab.

> "Let me show the tool quickly. I'll load the Binary Search preset — a equals one, b equals two, p equals zero — and the lab returns Case 2, theta of log n. Now Karatsuba — three, two, one — returns Case 1, theta of n to the 1.585. In the Recursion Tree tab I can build the tree for Merge Sort with n equals 64: the work column is identical on every level, which is the signature of Case 2. If I change p to two, the first row dominates — Case 3, theta of n squared. Any worked example can be opened directly in the lab, so the theory and the tool agree."

---

## 5:20–6:00 — Real-world scenarios and conclusion (Varshini)

**Screen:** Slides 8 and 10; then the Applications tab.

> "Finally, where is this used? External sorting in databases uses merge-style passes; Case 2 predicts the theta of n log n pass count used for planning disk I/O. Standard libraries use Introsort, which switches to heap sort when recursion gets too deep — Master analysis explains why balanced splits give theta of n log n but unbalanced ones give theta of n squared. Binary search in B-trees and router tables is theta of log n. Karatsuba and Strassen decide whether extra recursive calls beat classical multiplication. Parallel MapReduce jobs and kd-tree construction use the same bounds, and recursion depth estimates are used to set stack sizes and timeouts in production services.
>
> So the takeaway is simple: the Master Method gives an asymptotic bound in a few lines — but only when its conditions hold. Knowing when it fails is just as important. Thank you, and we're happy to take questions."

---

## Optional 90-second short version

If the submission limits video length, keep only these blocks:
1. **0:00–0:20** — Niharika: intro and problem statement (shortened).
2. **0:20–0:45** — Likhita: the three cases and the a/b^p comparison.
3. **0:45–1:05** — Vaishnavi: Merge Sort derivation, Case 2, theta(n log n).
4. **1:05–1:20** — Niharika: live demo of lab and recursion tree.
5. **1:20–1:30** — Varshini: two real scenarios and conclusion.
