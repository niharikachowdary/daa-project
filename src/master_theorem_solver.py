#!/usr/bin/env python3
"""
Master Theorem Classifier — DAA Project, Group 6, SRM University-AP.

Classifies recurrences of the form

        T(n) = a * T(n / b) + Theta(n^p * log^k n),   a >= 1, b > 1

using the standard CLRS Master Theorem plus the common generalized Case 2
that allows a logarithmic factor log^k n with k >= 0.

Run:
    python3 master_theorem_solver.py
    python3 master_theorem_solver.py 3 2 1 0
"""

from __future__ import annotations

import math
import sys
from dataclasses import dataclass
from typing import List, Tuple


@dataclass
class Analysis:
    case: int
    c: float                 
    ratio: float             
    bound: str               
    standard: bool           
    regularity_ok: bool
    explanation: str


def classify(a: float, b: float, p: float, k: int = 0) -> Analysis:
    """Classify T(n) = aT(n/b) + Theta(n^p log^k n)."""
    if a < 1 or b <= 1 or p < 0 or k < 0 or int(k) != k:
        raise ValueError("Require a >= 1, b > 1, p >= 0 and integer k >= 0")

    c = math.log(a, b)              
    ratio = a / (b ** p)            
    regularity_ok = ratio < 1       

    if p < c - 1e-9:                
        return Analysis(1, c, ratio, f"Theta(n^{c:.4f})", True, regularity_ok,
                        "f(n) = O(n^(c-eps)); leaf work dominates.")
    if abs(p - c) <= 1e-9:          
        standard = (k == 0)
        bound = f"Theta(n^{c:.4f} log^{k + 1} n)"
        note = ("f(n) = Theta(n^c); work is balanced across levels."
                if standard else
                f"Plain CLRS excludes log^{k} n; generalized Case 2 adds one log.")
        return Analysis(2, c, ratio, bound, standard, regularity_ok, note)

    
    if not regularity_ok:
        raise ValueError("Case 3 regularity condition a*f(n/b) <= c*f(n) fails")
    return Analysis(3, c, ratio, f"Theta(n^{p} log^{k} n)", k == 0, True,
                    "f(n) = Omega(n^(c+eps)); root work dominates.")


def recursion_tree_levels(a: int, b: int, n: int, p: float, k: int = 0) -> List[Tuple[int, int, float, float]]:
    """Return (level, subproblems, subproblem_size, total_work) per level."""
    levels = []
    sub_size = float(n)
    nodes = 1
    while sub_size >= 1 and len(levels) < 12:
        log_term = 1 if k == 0 else max(1.0, math.log2(sub_size)) ** k
        work = nodes * (sub_size ** p) * log_term
        levels.append((len(levels), nodes, sub_size, work))
        nodes *= a
        sub_size /= b
    return levels


EXAMPLES = [
    ("Merge Sort",             (2, 2, 1, 0)),
    ("Binary Search",          (1, 2, 0, 0)),
    ("Linear T=2T(n/2)+1",     (2, 2, 0, 0)),
    ("T=8T(n/2)+n^2",          (8, 2, 2, 0)),
    ("Quadratic combine",      (2, 2, 2, 0)),
    ("Karatsuba",              (3, 2, 1, 0)),
    ("T=3T(n/4)+n log n",      (3, 4, 1, 1)),
    ("T=4T(n/2)+n^2 log n",    (4, 2, 2, 1)),
]


def main(argv: List[str]) -> None:
    if len(argv) >= 4:
        params = (float(argv[1]), float(argv[2]), float(argv[3]),
                  int(argv[4]) if len(argv) > 4 else 0)
        examples = [("Custom", params)]
    else:
        examples = EXAMPLES

    print("Master Theorem Analysis")
    print("=" * 64)
    for name, (a, b, p, k) in examples:
        analysis = classify(a, b, p, k)
        toll = f"n^{p:g}" + (f" log^{k} n" if k else "")
        print(f"\n{name}:  T(n) = {a:g}T(n/{b:g}) + {toll}")
        print(f"  log_b(a) = {analysis.c:.4f}   a/b^p = {analysis.ratio:.4f}")
        print(f"  Case {analysis.case}  ->  T(n) = {analysis.bound}")
        print(f"  {'Generalized form used' if not analysis.standard else 'Standard CLRS'}: {analysis.explanation}")

    
    print("\n" + "=" * 64)
    print("Recursion tree for Merge Sort, n = 32:")
    print(f"{'level':>5} {'nodes':>7} {'size':>8} {'level work':>12}")
    for level, nodes, size, work in recursion_tree_levels(2, 2, 32, 1):
        print(f"{level:>5} {nodes:>7} {size:>8.2f} {work:>12.2f}")


if __name__ == "__main__":
    main(sys.argv)
