











export function logBase(b, x) {
  return Math.log(x) / Math.log(b);
}


export function formatPower(c) {
  if (Math.abs(c - Math.round(c)) < 1e-7) {
    const r = Math.round(c);
    if (r === 0) return "1";
    if (r === 1) return "n";
    if (r === 2) return "n²";
    if (r === 3) return "n³";
    if (r === 4) return "n⁴";
    return `n^${r}`;
  }
  return `n^${Number(c.toFixed(3))}`;
}


export function formatLog(k) {
  return formatLogPower(k);
}


export function formatLogPower(m) {
  if (m === 0) return "";
  if (m === 1) return " log n";
  if (m === 2) return " log² n";
  if (m === 3) return " log³ n";
  return ` log^${m} n`;
}


export function formatTheta(p, k) {
  const base = formatPower(p);
  return `Θ(${base}${formatLog(k)})`;
}

const EPS = 1e-6;





export function classify({ a, b, p, k }) {
  a = Number(a);
  b = Number(b);
  p = Number(p);
  k = Number(k);

  const errors = [];
  if (!isFinite(a) || a < 1)
    errors.push("a must be ≥ 1 (number of subproblems).");
  if (!isFinite(b) || b <= 1) errors.push("b must be > 1 (shrink factor).");
  if (!isFinite(p) || p < 0)
    errors.push("p must be ≥ 0 (polynomial exponent).");
  if (!isFinite(k) || k < 0 || Math.floor(k) !== k)
    errors.push("k must be a non-negative integer (log exponent).");
  if (errors.length) return { valid: false, errors };

  const c = logBase(b, a); 
  const delta = p - c; 
  const ratio = a / Math.pow(b, p); 
  const regularity = ratio; 
  const regularityHolds = regularity < 1; 

  let caseNumber;
  let result;
  let relation;
  let standardApplies;
  let note;

  if (delta < -EPS) {
    caseNumber = 1;
    relation = "f(n) = O(n^(c−ε)) — the leaves dominate";
    result = formatTheta(c, 0);
    standardApplies = true;
    note =
      "The work at the leaves of the recursion tree dominates. The total is asymptotically the number of leaves.";
  } else if (Math.abs(delta) <= EPS) {
    caseNumber = 2;
    relation = "f(n) = Θ(n^c · log^k n) — work is balanced across levels";
    const baseText = formatPower(c);
    const logText = formatLogPower(k + 1);
    result =
      baseText === "1" ? `Θ(${logText.trim()})` : `Θ(${baseText}${logText})`;
    standardApplies = k === 0;
    note =
      k === 0
        ? "f(n) matches the leaf growth exactly. Every level does Θ(n^c) work and there are Θ(log n) levels."
        : `The plain (CLRS) Master Theorem does NOT cover log^${k} n here — the generalized version is used, adding one extra logarithm.`;
  } else {
    caseNumber = 3;
    relation = "f(n) = Ω(n^(c+ε)) — the root dominates";
    result = formatTheta(p, k);
    standardApplies = k === 0 && regularityHolds;
    note = regularityHolds
      ? `The work at the root dominates. Regularity holds because a/b^p = ${regularity.toFixed(3)} < 1.`
      : "Regularity condition a·f(n/b) ≤ c·f(n) is required for Case 3; verify it manually for non-polynomial f.";
  }

  
  const generalizedOnly =
    !standardApplies && (caseNumber === 2 || caseNumber === 3);

  const steps = buildSteps({
    a,
    b,
    p,
    k,
    c,
    delta,
    ratio,
    caseNumber,
    result,
    regularityHolds,
  });

  return {
    valid: true,
    caseNumber,
    c,
    delta,
    ratio,
    regularity,
    regularityHolds,
    relation,
    result,
    standardApplies,
    generalizedOnly,
    note,
    steps,
    recurrence: `T(n) = ${a}T(n/${b}) + ${formatPower(p)}${formatLog(k) || " · 1"}`,
  };
}

function buildSteps({
  a,
  b,
  p,
  k,
  c,
  delta,
  ratio,
  caseNumber,
  result,
  regularityHolds,
}) {
  const steps = [];
  steps.push({
    label: "Write the recurrence",
    value: `T(n) = ${a}T(n/${b}) + n^${p}${k ? ` log^${k} n` : ""}`,
  });
  steps.push({
    label: "Identify constants",
    value: `a = ${a}, b = ${b}, f(n) = n^${p}${k ? ` log^${k} n` : ""}`,
  });
  steps.push({
    label: "Compute the critical exponent",
    value: `log_b a = log_${b}(${a}) = ${c.toFixed(4)}`,
  });
  steps.push({
    label: "Compare with the polynomial exponent",
    value: `p = ${p} vs log_b a = ${c.toFixed(4)} → ${delta > 0 ? "p > log_b a" : delta < 0 ? "p < log_b a" : "p = log_b a"}`,
  });
  steps.push({
    label: "Geometric ratio (work per level)",
    value: `a / b^p = ${a} / ${b}^${p} = ${ratio.toFixed(4)} ${ratio < 1 ? "< 1 (shrinking)" : ratio > 1 ? "> 1 (growing)" : "= 1 (balanced)"}`,
  });
  if (caseNumber === 1) {
    steps.push({
      label: "Apply Case 1",
      value: `Since n^${p} grows polynomially slower than n^${c.toFixed(3)}, T(n) = ${result}`,
    });
  } else if (caseNumber === 2) {
    steps.push({
      label: "Apply Case 2" + (k ? " (generalized)" : ""),
      value: `f(n) = Θ(n^${c.toFixed(4)}${k ? ` log^${k} n` : ""}), so T(n) = ${result}`,
    });
  } else {
    steps.push({
      label: "Check Case 3 regularity",
      value: `a·f(n/b) / f(n) ≈ a/b^p = ${ratio.toFixed(4)} ${regularityHolds ? "< 1 ✓" : "— verify manually"}`,
    });
    steps.push({
      label: "Apply Case 3",
      value: `f(n) dominates; T(n) = ${result}`,
    });
  }
  return steps;
}





export function buildRecursionTree(
  { a, b, n, p, k },
  maxLevels = 12,
  cap = 1e15,
) {
  const levels = [];
  let subSize = n;
  let nodes = 1;
  const L = Math.min(
    maxLevels,
    Math.max(1, Math.ceil(logBase(b, Math.max(n, 1))) + 1),
  );

  for (let i = 0; i < L && subSize >= 1; i++) {
    const logTerm = k === 0 ? 1 : Math.pow(Math.max(1, Math.log2(subSize)), k);
    const workPerNode = Math.pow(subSize, p) * logTerm;
    const levelWork = Math.min(cap, nodes * workPerNode);
    levels.push({
      level: i,
      nodes,
      subSize,
      workPerNode,
      levelWork,
      nodeLabel: `${Number(subSize.toFixed(2))}`,
    });
    nodes = Math.min(cap, nodes * a);
    subSize = subSize / b;
  }

  const totalWork = levels.reduce((s, l) => s + l.levelWork, 0);
  const peak = Math.max(...levels.map((l) => l.levelWork), 1);
  return { levels, totalWork, peak };
}


export const WORKED_EXAMPLES = [
  {
    name: "Merge Sort",
    a: 2,
    b: 2,
    p: 1,
    k: 0,
    tag: "Case 2",
    result: "Θ(n log n)",
    desc: "Two halves sorted recursively, then a linear merge. The textbook Case 2 recurrence.",
  },
  {
    name: "Binary Search",
    a: 1,
    b: 2,
    p: 0,
    k: 0,
    tag: "Case 2",
    result: "Θ(log n)",
    desc: "One recursive call on half the array with O(1) work — note log_b a = log_2 1 = 0.",
  },
  {
    name: "Linear scan recurrence",
    a: 2,
    b: 2,
    p: 0,
    k: 0,
    tag: "Case 1",
    result: "Θ(n)",
    desc: "T(n) = 2T(n/2) + 1: leaves dominate, giving Θ(n^1) = Θ(n).",
  },
  {
    name: "Recurrence T(n)=8T(n/2)+n²",
    a: 8,
    b: 2,
    p: 2,
    k: 0,
    tag: "Case 1",
    result: "Θ(n³)",
    desc: "log_2 8 = 3 > 2, so leaf work dominates: Θ(n³).",
  },
  {
    name: "Quadratic combine",
    a: 2,
    b: 2,
    p: 2,
    k: 0,
    tag: "Case 3",
    result: "Θ(n²)",
    desc: "T(n) = 2T(n/2) + n²: root work dominates, regularity a/b^p = 1/2 < 1.",
  },
  {
    name: "Karatsuba multiplication",
    a: 3,
    b: 2,
    p: 1,
    k: 0,
    tag: "Case 1",
    result: "Θ(n^1.585)",
    desc: "Three recursive multiplications on half-size operands: log_2 3 ≈ 1.585 > 1.",
  },
  {
    name: "T(n)=3T(n/4)+n log n",
    a: 3,
    b: 4,
    p: 1,
    k: 1,
    tag: "Case 3",
    result: "Θ(n log n)",
    desc: "log_4 3 ≈ 0.79 < 1; regularity 3/4 < 1 ✓ — the root term wins.",
  },
  {
    name: "T(n)=4T(n/2)+n² log n",
    a: 4,
    b: 2,
    p: 2,
    k: 1,
    tag: "Case 2 (generalized)",
    result: "Θ(n² log² n)",
    desc: "Plain CLRS does not cover the log factor; the generalized theorem adds one logarithm.",
  },
];


export const FAILURE_EXAMPLES = [
  {
    name: "Decrease-and-conquer: T(n)=T(n−1)+n",
    why: "The subproblem shrinks by subtraction (n−1), not by division n/b with b > 1.",
    workaround: "Use the recursion tree / iteration method: T(n) = Θ(n²).",
  },
  {
    name: "Unequal splits: T(n)=T(n/3)+T(2n/3)+n",
    why: "Subproblems have different sizes, so the single (a, b) form is violated.",
    workaround: "Use the Akra–Bazzi method: T(n) = Θ(n log n).",
  },
  {
    name: "Sub-polynomial gap: T(n)=2T(n/2)+n/log n",
    why: "f(n) is neither O(n^(1−ε)), nor Θ(n), nor Ω(n^(1+ε)); even the log^k extension (k ≥ 0) fails.",
    workaround: "Akra–Bazzi gives T(n) = Θ(n log log n).",
  },
  {
    name: "Fibonacci: T(n)=T(n−1)+T(n−2)+Θ(1)",
    why: "Two subproblems of different sizes and a subtractive shrink; b is not defined.",
    workaround: "Solve the characteristic equation: T(n) = Θ(φ^n), φ ≈ 1.618.",
  },
  {
    name: "Non-constant branching: T(n)=n·T(n/2)+n²",
    why: "a = n depends on n, but the theorem requires a ≥ 1 to be a fixed constant.",
    workaround:
      "Unroll the recursion directly (the tree has super-exponential growth).",
  },
  {
    name: "Oscillating / non-positive toll: f(n)=n(1−2·sin n)",
    why: "The theorem requires f(n) to be asymptotically positive; an oscillating toll breaks it.",
    workaround:
      "Bound f(n) above and below, then apply substitution with care.",
  },
  {
    name: "Floating-log toll: T(n)=2T(n/2)+n·log log n",
    why: "f(n) is not of the form n^c·log^k n for a constant k, so no case matches.",
    workaround: "Recursion tree summation: T(n) = Θ(n log n log log n).",
  },
];


export const REAL_SCENARIOS = [
  {
    title: "External sorting in databases & data lakes",
    detail:
      "PostgreSQL merge joins, Hadoop/Spark shuffle phases and log-structured merge (LSM) trees rely on merge-style, divide-and-conquer passes. Master Case 2 predicts the Θ(n log n) I/O-pass count used for capacity planning.",
    icon: "database",
    tone: "sky",
  },
  {
    title: "Standard-library sorting & worst-case guarantees",
    detail:
      "Introsort (C++ std::sort) switches to heapsort when quicksort recursion grows past 2·log n. Master-method reasoning explains why balanced splits give Θ(n log n) while unbalanced ones give Θ(n²), motivating the depth guard.",
    icon: "cpu",
    tone: "amber",
  },
  {
    title: "Binary search & decision-tree algorithms",
    detail:
      "Every halving step with O(1) work is a Case 2 recurrence (a=1, b=2, log_b a = 0), yielding Θ(log n). This predicts lookup cost in B-trees, router tables and autocomplete tries.",
    icon: "search",
    tone: "emerald",
  },
  {
    title: "Fast multiplication: Karatsuba & Strassen",
    detail:
      "Karatsuba (a=3, b=2) and Strassen (a=7, b=2) are Case 1 recurrences. The Master Method tells algorithm designers whether the extra recursive calls beat the classical Θ(n²) algorithm.",
    icon: "sigma",
    tone: "purple",
  },
  {
    title: "Parallel & distributed divide-and-conquer",
    detail:
      "MapReduce jobs, parallel prefix scans and fork/join sorts split work into a branches of size n/b. The critical exponent log_b a estimates speedup and the minimum number of levels before tasks become sequential.",
    icon: "network",
    tone: "teal",
  },
  {
    title: "Machine-learning data structures",
    detail:
      "kd-tree / decision-tree construction, wavelet trees and hierarchical clustering recursively partition data. The recurrence bound predicts build time and tree depth, guiding indexing choices for large feature stores.",
    icon: "brain",
    tone: "rose",
  },
  {
    title: "Resource & stack-depth budgeting",
    detail:
      "Recursion depth is Θ(log_b n) for balanced recurrences but Θ(n) for degenerate ones. Engineers use this to set stack sizes, thread pools and timeouts, avoiding stack-overflow crashes in production services.",
    icon: "layers",
    tone: "indigo",
  },
  {
    title: "Compiler & algorithm design decisions",
    detail:
      "When choosing between two divide-and-conquer strategies, the Master Method gives a fast asymptotic estimate without implementing either. It is the standard screening tool taught in DAA courses and used in code reviews.",
    icon: "git-branch",
    tone: "orange",
  },
];
