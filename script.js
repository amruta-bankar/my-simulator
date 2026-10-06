"use strict";

const INF = Infinity;

let routers = [];
let links = [];
let tables = {};
let round = 0;
let pathEdges = [];

const $ = id => document.getElementById(id);


/* ---------- Helpers ---------- */

const key = (a, b) =>
  [a, b].sort().join("-");

const findLink = (a, b) =>
  links.find(l => key(l.a, l.b) === key(a, b));

const neighbours = r =>
  links
    .filter(l => l.up && (l.a === r || l.b === r))
    .map(l => ({
      n: l.a === r ? l.b : l.a,
      w: l.w
    }));

const show = v =>
  v === INF ? "∞" : v;

function log(msg) {
  const p = $("log");
  p.innerHTML = msg + "<br>" + p.innerHTML;
}


/* ---------- Distance Vector Algorithm ---------- */

function initTables() {

  tables = {};

  routers.forEach(r => {

    tables[r] = {};

    routers.forEach(d => {

      tables[r][d] = {
        dist: d === r ? 0 : INF,
        next: d === r ? r : "-"
      };

    });

    neighbours(r).forEach(({ n, w }) => {

      tables[r][n] = {
        dist: w,
        next: n
      };

    });

  });

  round = 0;
  pathEdges = [];

  $("pathResult").textContent = "";
}


/* ---------- One Algorithm Round ---------- */

function step() {

  const old = JSON.parse(
    JSON.stringify(
      tables,
      (k, v) => (v === INF ? "INF" : v)
    )
  );

  const val = o =>
    o === "INF" ? INF : o;

  let changed = false;

  routers.forEach(x => {

    neighbours(x).forEach(({ n, w }) => {

      routers.forEach(d => {

        const nd = val(old[n][d].dist);

        if (nd === INF)
          return;

        if (
          w + nd <
          tables[x][d].dist
        ) {

          tables[x][d] = {
            dist: w + nd,
            next: n
          };

          changed = true;
        }

      });

    });

  });

  if (changed) {

    round++;

    log(
      "Round " +
      round +
      ": routing tables updated."
    );

  } else {

    log(
      "No change in round " +
      (round + 1) +
      ": tables are stable (converged)."
    );

  }

  return changed;
}


/* ---------- Run Until Stable ---------- */

function runUntilStable() {

  let guard = 0;

  while (
    step() &&
    guard++ < 100
  ) {

    // Continue until stable
  }
}


/* ---------- Shortest Path ---------- */

function getPath(s, d) {

  if (
    tables[s][d].dist === INF
  )
    return null;

  const path = [s];

  let cur = s;

  while (
    cur !== d &&
    path.length <= routers.length
  ) {

    cur =
      tables[cur][d].next;

    if (cur === "-")
      return null;

    path.push(cur);
  }

  return cur === d
    ? path
    : null;
}


/* ---------- Network Position ---------- */

function pos(i) {

  const n = routers.length;
  const cx = 300;
  const cy = 210;
  const r = 150;

  if (n === 1) {

    return {
      x: cx,
      y: cy
    };

  }

  const ang =
    (2 * Math.PI * i) / n -
    Math.PI / 2;

  return {
    x:
      cx +
      r *
      Math.cos(ang),

    y:
      cy +
      r *
      Math.sin(ang)
  };
}


/* ---------- Draw Network ---------- */

function drawGraph() {

  const svg = $("graph");

  let out = "";

  links.forEach(l => {

    const p =
      pos(routers.indexOf(l.a));

    const q =
      pos(routers.indexOf(l.b));

    const hot =
      pathEdges.includes(
        key(l.a, l.b)
      );

    const colour =
      !l.up
        ? "#c93030"
        : hot
        ? "#1a8f4c"
        : "#7d8896";

    out += `
      <line
        x1="${p.x}"
        y1="${p.y}"
        x2="${q.x}"
        y2="${q.y}"
        stroke="${colour}"
        stroke-width="${hot ? 5 : 2.5}"
        ${l.up ? "" :
          'stroke-dasharray="7 6"'}
      />
    `;

    out += `
      <text
        x="${(p.x + q.x) / 2}"
        y="${(p.y + q.y) / 2 - 6}"
        text-anchor="middle"
        font-size="14"
        fill="${colour}"
        style="
          paint-order:stroke;
          stroke:#fbfcfd;
          stroke-width:4px
        "
      >
        ${l.w}${l.up ? "" : " (down)"}
      </text>
    `;

  });


  routers.forEach((r, i) => {

    const p = pos(i);

    out += `
      <circle
        cx="${p.x}"
        cy="${p.y}"
        r="20"
        fill="#1f5fbf"
      />

      <text
        x="${p.x}"
        y="${p.y + 5}"
        text-anchor="middle"
        font-size="15"
        fill="#fff"
        font-weight="600"
      >
        ${r}
      </text>
    `;

  });

  svg.innerHTML = out;
}


/* ---------- Draw Routing Tables ---------- */

function drawTables() {

  $("tables").innerHTML =
    routers.map(r => {

      const rows =
        routers.map(d => `

          <tr>
            <td>${d}</td>
            <td>
              ${show(
                tables[r][d].dist
              )}
            </td>
            <td>
              ${tables[r][d].next}
            </td>
          </tr>

        `).join("");

      return `

        <table>

          <caption>
            Router ${r}
          </caption>

          <tr>
            <th>Destination</th>
            <th>Distance</th>
            <th>Next Hop</th>
          </tr>

          ${rows}

        </table>

      `;

    }).join("");
}


/* ---------- Draw Links ---------- */

function drawLinks() {

  $("linkList").innerHTML =
    links.map((l, i) => `

      <li class="link ${l.up ? "" : "down"}">

        <span>
          ${l.a} – ${l.b}
          (cost ${l.w})
        </span>

        <button
          class="${l.up ? "danger" : "alt"}"
          data-i="${i}"
        >
          ${l.up
            ? "Fail link"
            : "Restore link"}
        </button>

      </li>

    `).join("");


  document
    .querySelectorAll(
      "#linkList button"
    )
    .forEach(b => {

      b.onclick = () =>
        toggleLink(
          +b.dataset.i
        );

    });
}


/* ---------- Draw Select Options ---------- */

function drawSelects() {

  [
    "linkA",
    "linkB",
    "src",
    "dst"
  ].forEach(id => {

    const old =
      $(id).value;

    $(id).innerHTML =
      routers
        .map(
          r =>
            `<option>${r}</option>`
        )
        .join("");

    if (routers.includes(old))
      $(id).value = old;

  });


  if (
    routers.length > 1 &&
    $("linkB").value ===
      $("linkA").value
  ) {

    $("linkB")
      .selectedIndex = 1;

  }


  if (
    routers.length > 1 &&
    $("dst").value ===
      $("src").value
  ) {

    $("dst")
      .selectedIndex = 1;

  }

}


/* ---------- Refresh UI ---------- */

function refresh() {

  drawSelects();
  drawLinks();
  drawGraph();
  drawTables();

  $("status").textContent =
    "Round " + round;
}


/* ---------- Topology Changed ---------- */

function topologyChanged() {

  initTables();
  refresh();
}


/* ---------- Add Router ---------- */

$("addRouter").onclick = () => {

  if (routers.length >= 10) {

    log(
      "Maximum of 10 routers reached."
    );

    return;
  }

  const name =
    String.fromCharCode(
      65 + routers.length
    );

  routers.push(name);

  log(
    "Router " +
    name +
    " added."
  );

  topologyChanged();
};


/* ---------- Add Link ---------- */

$("addLink").onclick = () => {

  const a =
    $("linkA").value;

  const b =
    $("linkB").value;

  const w =
    parseInt(
      $("linkW").value,
      10
    );


  if (
    !a ||
    !b ||
    a === b
  ) {

    log(
      "Choose two different routers."
    );

    return;
  }


  if (!(w > 0)) {

    log(
      "Link cost must be a positive number."
    );

    return;
  }


  const existing =
    findLink(a, b);


  if (existing) {

    existing.w = w;

    log(
      "Link " +
      a +
      "–" +
      b +
      " cost changed to " +
      w +
      "."
    );

  } else {

    links.push({
      a: a,
      b: b,
      w: w,
      up: true
    });

    log(
      "Link " +
      a +
      "–" +
      b +
      " added with cost " +
      w +
      "."
    );

  }

  topologyChanged();
};


/* ---------- Link Failure / Restoration ---------- */

function toggleLink(i) {

  const l = links[i];

  l.up = !l.up;

  log(
    "Link " +
    l.a +
    "–" +
    l.b +
    (
      l.up
        ? " restored."
        : " failed."
    ) +
    " Recalculating routes..."
  );

  initTables();

  runUntilStable();

  refresh();
}


/* ---------- Next Round ---------- */

$("step").onclick = () => {

  step();

  refresh();
};


/* ---------- Run Until Stable ---------- */

$("run").onclick = () => {

  runUntilStable();

  refresh();
};


/* ---------- Reset Tables ---------- */

$("reset").onclick = () => {

  initTables();

  log(
    "Tables reset to direct-neighbour information."
  );

  refresh();
};


/* ---------- Find Shortest Path ---------- */

$("findPath").onclick = () => {

  const s =
    $("src").value;

  const d =
    $("dst").value;


  if (!s || !d)
    return;


  const path =
    getPath(s, d);


  if (s === d) {

    $("pathResult").textContent =
      "Source and destination are the same.";

    pathEdges = [];

  }

  else if (!path) {

    $("pathResult").textContent =
      "No route known from " +
      s +
      " to " +
      d +
      ". Run the algorithm, or the destination may be unreachable.";

    pathEdges = [];

  }

  else {

    $("pathResult").textContent =
      "Path: " +
      path.join(" → ") +
      "   |   Total distance: " +
      tables[s][d].dist;

    pathEdges =
      path
        .slice(1)
        .map(
          (r, i) =>
            key(path[i], r)
        );

  }

  drawGraph();
};


/* ---------- Load Sample Network ---------- */

$("sample").onclick = () => {

  routers = [
    "A",
    "B",
    "C",
    "D"
  ];

  links = [

    {
      a: "A",
      b: "B",
      w: 2,
      up: true
    },

    {
      a: "A",
      b: "C",
      w: 5,
      up: true
    },

    {
      a: "B",
      b: "C",
      w: 1,
      up: true
    },

    {
      a: "B",
      b: "D",
      w: 4,
      up: true
    },

    {
      a: "C",
      b: "D",
      w: 2,
      up: true
    }

  ];

  log(
    "Sample network loaded."
  );

  topologyChanged();
};


/* ---------- Clear Network ---------- */

$("clearAll").onclick = () => {

  routers = [];
  links = [];

  log(
    "Network cleared."
  );

  topologyChanged();
};


/* ---------- Initial Load ---------- */

topologyChanged();