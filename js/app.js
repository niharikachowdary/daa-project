





import { FAILURE_EXAMPLES, REAL_SCENARIOS } from "./master-engine.js";

const CODE_SNIPPETS = {
  python: {
    solver: `import math

def master_theorem(a, b, p, k=0):
    """Classify T(n) = aT(n/b) + Theta(n^p log^k n)."""
    if a < 1 or b <= 1 or p < 0 or k < 0:
        raise ValueError("need a>=1, b>1, p>=0, k>=0")
    c = math.log(a, b)          # critical exponent log_b(a)
    ratio = a / (b ** p)        # work ratio a / b^p

    if p < c - 1e-9:            # CASE 1: leaves dominate
        return 1, f"Theta(n^{c:.3f})"
    if abs(p - c) <= 1e-9:      # CASE 2: balanced (generalized)
        return 2, f"Theta(n^{c:.3f} log^{k+1} n)"
    if ratio >= 1:              # CASE 3 needs regularity
        raise ValueError("regularity condition a*f(n/b) <= c*f(n) fails")
    return 3, f"Theta(n^{p} log^{k} n)"

for args in [(2,2,1,0), (1,2,0,0), (3,2,1,0), (2,2,2,0), (4,2,2,1)]:
    print(args, "->", master_theorem(*args))`,
    algo: `def merge_sort(arr):
    """Merge Sort: T(n) = 2T(n/2) + Theta(n) = Theta(n log n)."""
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])     # a = 2 recursive calls
    right = merge_sort(arr[mid:])    # each on n/2 elements
    return merge(left, right)        # linear combine: f(n) = Theta(n)

def merge(left, right):
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    return out + left[i:] + right[j:]`,
  },
  cpp: {
    solver: `#include <cmath>
#include <iostream>
#include <stdexcept>
#include <string>

struct Result { int caseNo; std::string bound; };

Result masterTheorem(double a, double b, double p, int k = 0) {
    if (a < 1 || b <= 1 || p < 0 || k < 0)
        throw std::invalid_argument("need a>=1, b>1, p>=0, k>=0");
    double c = std::log(a) / std::log(b);       // log_b(a)
    double ratio = a / std::pow(b, p);          // a / b^p

    if (p < c - 1e-9)
        return {1, "Theta(n^" + std::to_string(c) + ")"};
    if (std::fabs(p - c) <= 1e-9)
        return {2, "Theta(n^" + std::to_string(c) +
                   " log^" + std::to_string(k + 1) + " n)"};
    if (ratio >= 1)
        throw std::runtime_error("regularity condition fails");
    return {3, "Theta(n^p log^k n)"};
}`,
    algo: `// Merge Sort: T(n) = 2T(n/2) + Theta(n) = Theta(n log n)
#include <vector>
using namespace std;

void merge(vector<int>& a, int l, int m, int r) {
    vector<int> tmp;
    int i = l, j = m + 1;
    while (i <= m && j <= r)
        tmp.push_back(a[i] <= a[j] ? a[i++] : a[j++]);
    while (i <= m) tmp.push_back(a[i++]);
    while (j <= r) tmp.push_back(a[j++]);
    for (int t = 0; t < (int)tmp.size(); ++t) a[l + t] = tmp[t];
}

void mergeSort(vector<int>& a, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(a, l, m);          // a = 2
    mergeSort(a, m + 1, r);      // b = 2
    merge(a, l, m, r);           // f(n) = Theta(n)
}`,
  },
  java: {
    solver: `public class MasterTheorem {
    static class Result {
        final int caseNo; final String bound;
        Result(int c, String b) { caseNo = c; bound = b; }
    }

    static Result solve(double a, double b, double p, int k) {
        if (a < 1 || b <= 1 || p < 0 || k < 0)
            throw new IllegalArgumentException("need a>=1, b>1, p>=0, k>=0");
        double c = Math.log(a) / Math.log(b);   // log_b(a)
        double ratio = a / Math.pow(b, p);      // a / b^p

        if (p < c - 1e-9)
            return new Result(1, "Theta(n^" + c + ")");
        if (Math.abs(p - c) <= 1e-9)
            return new Result(2, "Theta(n^" + c + " log^" + (k + 1) + " n)");
        if (ratio >= 1)
            throw new IllegalStateException("regularity condition fails");
        return new Result(3, "Theta(n^p log^k n)");
    }
}`,
    algo: `// Merge Sort: T(n) = 2T(n/2) + Theta(n) = Theta(n log n)
import java.util.Arrays;

public class MergeSort {
    static void mergeSort(int[] a, int l, int r) {
        if (l >= r) return;
        int m = l + (r - l) / 2;
        mergeSort(a, l, m);          // a = 2
        mergeSort(a, m + 1, r);      // b = 2
        int[] tmp = Arrays.copyOfRange(a, l, r + 1);
        int i = 0, j = m - l + 1, k = l;
        while (i <= m - l && j <= r - l)
            a[k++] = tmp[i] <= tmp[j] ? tmp[i++] : tmp[j++];
        while (i <= m - l) a[k++] = tmp[i++];
    }
}`,
  },
};

document.addEventListener("DOMContentLoaded", () => {
  
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");
      tabButtons.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.add("hidden"));
      btn.classList.add("active");
      const content = document.getElementById(`tab-${target}`);
      if (content) content.classList.remove("hidden");
      window.dispatchEvent(new CustomEvent("daa:tabshown", { detail: target }));
    });
  });

  
  const failsGrid = document.getElementById("fails-grid");
  if (failsGrid) {
    failsGrid.innerHTML = FAILURE_EXAMPLES.map(
      (ex) => `
        <div class="item">
          <div class="item-head">${ex.name}</div>
          <div class="item-body">
            <p><b>Why it fails.</b> ${ex.why}</p>
            <p><b>Use instead.</b> ${ex.workaround}</p>
          </div>
        </div>`,
    ).join("");
  }

  
  const scenariosGrid = document.getElementById("scenarios-grid");
  if (scenariosGrid) {
    scenariosGrid.innerHTML = REAL_SCENARIOS.map(
      (s, i) => `
        <div class="item">
          <div class="item-head">${i + 1}. ${s.title}</div>
          <div class="item-body"><p>${s.detail}</p></div>
        </div>`,
    ).join("");
  }

  
  const langButtons = document.querySelectorAll(".code-lang-btn");
  const solverBlock = document.getElementById("code-display-solver");
  const algoBlock = document.getElementById("code-display-algo");
  function updateCode(lang) {
    if (solverBlock) solverBlock.textContent = CODE_SNIPPETS[lang]?.solver || "";
    if (algoBlock) algoBlock.textContent = CODE_SNIPPETS[lang]?.algo || "";
  }
  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      langButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      updateCode(lang);
    });
  });
  updateCode("python");

  
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.copyTarget);
      if (!target) return;
      navigator.clipboard.writeText(target.textContent || target.value || "");
      const original = btn.textContent;
      btn.textContent = "Copied";
      setTimeout(() => {
        btn.textContent = original;
      }, 1500);
    });
  });

  
  const linkedinBox = document.getElementById("linkedin-post-content");
  if (linkedinBox) {
    linkedinBox.value = `DAA course project at SRM University-AP — Master Method Analyzer.

A working tool that classifies divide-and-conquer recurrences with the Master Theorem: enter a, b, p and k, and it returns the case, the derivation and the Theta bound. It also includes a recursion-tree view, worked examples (Merge Sort, Binary Search, Karatsuba), a catalogue of recurrences where the theorem fails, and the real systems where this analysis is used.

Group 6, Sec-Q AIML
K. Niharika (AP25110070345)
N. Likhita (AP25110070522)
J. Vaishnavi (AP25110070509)
A. Varshini (AP25110070572)

Guided by N Nihar Ranjan Pradhan

#Algorithms #DAA #SRMUniversity #MasterTheorem #Recurrence`;
  }
});
