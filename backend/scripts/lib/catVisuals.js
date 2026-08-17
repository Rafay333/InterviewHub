/**
 * Compact visual builders for category question packs.
 */
function steps(title, pairs, footer) {
  return {
    title,
    kind: "steps",
    steps: pairs.map(([h, line]) => ({ h, lines: Array.isArray(line) ? line : [line] })),
    footer,
  };
}

function compare(title, left, right, footer) {
  return {
    title,
    kind: "compare",
    left: { h: left[0], lines: left.slice(1) },
    right: { h: right[0], lines: right.slice(1) },
    footer,
  };
}

function hub(title, center, nodes, footer) {
  return {
    title,
    kind: "hub",
    hub: center,
    nodes: nodes.map(([h, line]) => ({ h, lines: [line] })),
    footer,
  };
}

function layers(title, items, footer) {
  return {
    title,
    kind: "layers",
    layers: items.map(([h, line]) => ({ h, lines: Array.isArray(line) ? line : [line] })),
    footer,
  };
}

function timeline(title, items, footer) {
  return {
    title,
    kind: "timeline",
    events: items.map(([h, line]) => ({ h, lines: [line] })),
    footer,
  };
}

function cycle(title, center, items, footer) {
  return {
    title,
    kind: "cycle",
    center,
    items: items.map(([h, line]) => ({ h, lines: [line] })),
    footer,
  };
}

function code(title, file, lines, notes, footer) {
  return {
    title,
    kind: "code",
    code: {
      file,
      code: lines,
      notes: (notes || []).map(([h, text]) => ({ h, text })),
    },
    footer,
  };
}

function Q(q, a, e, visual) {
  return { q, a, e, visual };
}

module.exports = { steps, compare, hub, layers, timeline, cycle, code, Q };
