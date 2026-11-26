





import {
  classify,
  buildRecursionTree,
  formatPower,
  formatLog,
  WORKED_EXAMPLES,
} from "./master-engine.js";

let workChart = null;

const $ = (id) => document.getElementById(id);

function readLab() {
  return {
    a: Number($("lab-a").value),
    b: Number($("lab-b").value),
    p: Number($("lab-p").value),
    k: Number($("lab-k").value),
    n: Number($("lab-n").value),
  };
}

function updatePreview() {
  const { a, b, p, k } = readLab();
  const el = $("lab-recurrence-preview");
  if (el) el.textContent = `T(n) = ${a} T(n/${b}) + ${formatPower(p)}${formatLog(k) || " · 1"}`;
}


export function renderResult(res) {
  const container = $("lab-result");
  if (!container) return;

  if (!res.valid) {
    container.innerHTML = `
      <p class="label">Invalid parameters</p>
      <ul class="steps">${res.errors.map((e) => `<li><span class="step-val">${e}</span></li>`).join("")}</ul>`;
    return;
  }

  const caseTitle =
    res.caseNumber === 1
      ? "Case 1 · leaves dominate"
      : res.caseNumber === 2
        ? "Case 2 · levels balanced"
        : "Case 3 · root dominates";

  const stepsHtml = res.steps
    .map(
      (s) => `
        <li>
          <span class="step-label">${s.label}</span>
          <span class="step-val">${s.value}</span>
        </li>`,
    )
    .join("");

  container.innerHTML = `
    <div class="output-head">
      <span class="tag">${caseTitle}</span>
      <span class="${res.generalizedOnly ? "generalized" : "fine"}">
        ${res.generalizedOnly ? "generalized form" : "standard CLRS"}
      </span>
    </div>
    <p class="bound">T(n) = ${res.result}</p>
    <p class="compare">
      log<sub>b</sub> a = ${res.c.toFixed(4)} &nbsp;·&nbsp; p = ${$("lab-p").value}
      &nbsp;·&nbsp; a / b<sup>p</sup> = ${res.ratio.toFixed(4)}
      &nbsp;→&nbsp; ${res.relation}
    </p>
    <p class="note">${res.note}</p>
    <h3>Derivation</h3>
    <ol class="steps">${stepsHtml}</ol>
  `;
}

function analyze() {
  renderResult(classify(readLab()));
}


export function loadExample(ex) {
  [
    ["lab-a", ex.a],
    ["lab-b", ex.b],
    ["lab-p", ex.p],
    ["lab-k", ex.k],
  ].forEach(([id, value]) => {
    const el = $(id);
    if (el) el.value = value;
  });
  updatePreview();
  analyze();
  const tab = document.querySelector('.tab-btn[data-tab="lab"]');
  if (tab) tab.click();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderTree(tree) {
  const canvas = $("tree-canvas");
  if (!canvas) return;

  const html = tree.levels
    .map((lvl, idx) => {
      const shown = Math.min(lvl.nodes, 10);
      const nodes = Array.from(
        { length: shown },
        () => `<span class="tnode ${idx === 0 ? "root" : idx === tree.levels.length - 1 ? "leaf" : ""}">${lvl.nodeLabel}</span>`,
      ).join("");
      const extra =
        lvl.nodes > shown
          ? `<span class="tnode-more">+${lvl.nodes - shown}</span>`
          : "";
      const work =
        lvl.levelWork >= 1000
          ? lvl.levelWork.toExponential(1)
          : Number(lvl.levelWork.toFixed(0));
      return `
        <div class="tree-row">
          <span class="tree-level-label">L${idx}</span>
          <span class="tree-nodes">${nodes}${extra}</span>
          <span class="tree-work">${work}</span>
        </div>`;
    })
    .join("");

  canvas.innerHTML = html || '<p class="placeholder">No levels to display.</p>';
}

function renderTable(tree) {
  const body = $("tree-table-body");
  if (!body) return;

  const fmt = (n) => (n >= 1000 ? n.toExponential(2) : Number(n.toFixed(2)));
  body.innerHTML = tree.levels
    .map(
      (l) => `
        <tr>
          <td>${l.level}</td>
          <td>${l.nodes.toLocaleString()}</td>
          <td>${Number(l.subSize.toFixed(3))}</td>
          <td>${fmt(l.workPerNode)}</td>
          <td>${fmt(l.levelWork)}</td>
        </tr>`,
    )
    .join("");

  const totalRow = document.createElement("tr");
  totalRow.innerHTML = `<td colspan="4">Total (bounded levels)</td><td>${fmt(tree.totalWork)}</td>`;
  body.appendChild(totalRow);
}

function renderChart(tree) {
  const ctx = $("tree-work-chart");
  if (!ctx) return;

  const labels = tree.levels.map((l) => `L${l.level}`);
  const data = tree.levels.map((l) => Number(l.levelWork.toPrecision(4)));

  if (workChart) workChart.destroy();
  workChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Work at level",
          data,
          backgroundColor: "#374151",
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: (c) => `Work: ${c.parsed.y.toLocaleString()}` },
        },
      },
      scales: {
        x: { ticks: { color: "#6b7280" }, grid: { display: false } },
        y: {
          ticks: {
            color: "#6b7280",
            callback: (v) => (v >= 1e6 ? v / 1e6 + "M" : v),
          },
          grid: { color: "#e5e7eb" },
          beginAtZero: true,
        },
      },
    },
  });
}

function buildTree() {
  const params = {
    a: Number($("tree-a").value),
    b: Number($("tree-b").value),
    n: Number($("tree-n").value),
    p: Number($("tree-p").value),
    k: Number($("tree-k").value),
  };
  const res = classify(params);
  const dominance = $("tree-dominance");
  if (!res.valid) {
    if (dominance) dominance.textContent = res.errors.join(" ");
    return;
  }

  const tree = buildRecursionTree(params);
  renderTree(tree);
  renderTable(tree);
  renderChart(tree);

  if (dominance) {
    const label =
      res.caseNumber === 1
        ? "leaves dominate"
        : res.caseNumber === 2
          ? "levels balanced"
          : "root dominates";
    dominance.textContent = `Case ${res.caseNumber} · ${label} · T(n) = ${res.result}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ["lab-a", "lab-b", "lab-p", "lab-k"].forEach((id) => {
    const el = $(id);
    if (el) el.addEventListener("input", updatePreview);
  });

  const analyzeBtn = $("lab-analyze-btn");
  if (analyzeBtn) analyzeBtn.addEventListener("click", analyze);

  document.querySelectorAll(".preset").forEach((btn) => {
    btn.addEventListener("click", () => {
      $("lab-a").value = btn.dataset.a;
      $("lab-b").value = btn.dataset.b;
      $("lab-p").value = btn.dataset.p;
      $("lab-k").value = btn.dataset.k;
      updatePreview();
      analyze();
    });
  });

  const buildBtn = $("tree-build-btn");
  if (buildBtn) buildBtn.addEventListener("click", buildTree);

  const loadBtn = $("tree-load-lab");
  if (loadBtn) {
    loadBtn.addEventListener("click", () => {
      const v = readLab();
      $("tree-a").value = v.a;
      $("tree-b").value = v.b;
      $("tree-n").value = v.n;
      $("tree-p").value = v.p;
      $("tree-k").value = v.k;
      buildTree();
    });
  }

  const examplesGrid = $("examples-grid");
  if (examplesGrid) {
    examplesGrid.innerHTML = WORKED_EXAMPLES.map(
      (ex, i) => `
        <div class="item">
          <div class="item-head">
            ${ex.name}
            <span class="item-meta">${ex.tag}</span>
          </div>
          <div class="item-body">
            <p>T(n) = ${ex.a}T(n/${ex.b}) + n^${ex.p}${ex.k ? ` log^${ex.k} n` : ""} → ${ex.result}</p>
            <p>${ex.desc}</p>
            <button class="text-btn example-load" data-index="${i}">Open in lab →</button>
          </div>
        </div>`,
    ).join("");

    examplesGrid.querySelectorAll(".example-load").forEach((btn) => {
      btn.addEventListener("click", () =>
        loadExample(WORKED_EXAMPLES[Number(btn.dataset.index)]),
      );
    });
  }

  window.addEventListener("daa:tabshown", (event) => {
    if (event.detail === "tree" && workChart) workChart.resize();
  });

  updatePreview();
  analyze();
  buildTree();
});
