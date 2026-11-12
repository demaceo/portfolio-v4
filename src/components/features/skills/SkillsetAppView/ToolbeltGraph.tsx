"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import {
  buildToolbeltTree,
  type ToolbeltToolDatum,
  type ToolbeltTreeNode,
} from "@/lib/utils/toolbeltTree";
import { buildToolUsageIndex, usageForTool } from "@/lib/utils/toolUsage";
import { useMediaQuery } from "@/hooks";
import { pushOverlay, popOverlay, isTopmostOverlay } from "@/lib/utils/overlayStack";
import type { Service, Project } from "@/lib/types";
import styles from "./ToolbeltGraph.module.css";

interface ToolbeltGraphProps {
  tools: ToolbeltToolDatum[];
  services: Service[];
  projects: Project[];
  /** Whether the Toolbelt tab is currently shown. The graph only lays out /
   *  simulates while visible; hidden it pauses to spare CPU on the Services tab. */
  active: boolean;
  /** Jumps the Services tab to the given service — wired up from a tool's
   *  "used in" chip in the details card. */
  onSelectService: (serviceId: string) => void;
}

interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  category: string;
  depth: number;
  rootIndex: number;
  hasChildren: boolean;
  isSignature?: boolean;
  icon?: IconDefinition;
  /** Leaf's slot among its siblings (0..siblingCount-1), for the ring layout. */
  slot: number;
  siblingCount: number;
  fx?: number | null;
  fy?: number | null;
}

interface SimLink {
  source: string | SimNode;
  target: string | SimNode;
}

// Only 2 depth levels exist here (category root -> tool leaf), unlike the
// codepenz "force-directed-node-tree" pen's up-to-3-level coffee flavor wheel.
const RADIUS_BY_DEPTH = [26, 13];
const RESIZE_DEBOUNCE_MS = 150;

function nodeId(path: string[]): string {
  return path.join(" / ");
}

function iconPathData(icon: IconDefinition): string {
  const d = icon.icon[4];
  return Array.isArray(d) ? d[0] : d;
}

// Splits a multi-word category name across two lines at the space nearest its
// midpoint (e.g. "Package Management" → "Package" / "Management") instead of
// truncating it. Used only for root labels in the narrow grid layout, where a
// single line would collide with the neighbouring column's label.
function wrapRootLabel(name: string): string[] {
  let splitAt = -1;
  let bestDelta = Infinity;
  for (let i = 0; i < name.length; i++) {
    if (name[i] === " ") {
      const delta = Math.abs(i - name.length / 2);
      if (delta < bestDelta) {
        bestDelta = delta;
        splitAt = i;
      }
    }
  }
  return splitAt === -1 ? [name] : [name.slice(0, splitAt), name.slice(splitAt + 1)];
}

interface NodeDatum {
  id: string;
  name: string;
  category: string;
  depth: number;
  rootIndex: number;
  hasChildren: boolean;
  isSignature?: boolean;
  icon?: IconDefinition;
  slot: number;
  siblingCount: number;
}

interface SelectedTool {
  id: string;
  name: string;
  category: string;
  icon?: IconDefinition;
}

// Flatten the tree into node descriptors + links (by id). Collapsed roots don't
// recurse into their children. Positions are NOT set here — the update effect
// reconciles these descriptors against persistent SimNode objects.
function flatten(tree: ToolbeltTreeNode[], collapsed: Set<string>) {
  const nodes: NodeDatum[] = [];
  const links: SimLink[] = [];

  function visit(
    item: ToolbeltTreeNode,
    path: string[],
    depth: number,
    rootIndex: number,
    slot = 0,
    siblingCount = 1
  ) {
    const id = nodeId(path);
    nodes.push({
      id,
      name: item.name,
      category: path[0],
      depth,
      rootIndex,
      hasChildren: Boolean(item.children?.length),
      isSignature: item.isSignature,
      icon: item.icon,
      slot,
      siblingCount,
    });
    if (path.length > 1) {
      links.push({ source: nodeId(path.slice(0, -1)), target: id });
    }
    if (item.children && !collapsed.has(id)) {
      const count = item.children.length;
      item.children.forEach((child, i) =>
        visit(child, [...path, child.name], depth + 1, rootIndex, i, count)
      );
    }
  }

  tree.forEach((root, i) => visit(root, [root.name], 0, i));
  return { nodes, links };
}

// Minimum horizontal room (px) a pinned category root needs so its full label
// clears its neighbour's. Below this per-column budget we shed a column and add
// a row instead. `forceCollide` only knows circle radii, so column spacing is
// the only thing keeping the (wider) labels from colliding.
// Not the label width alone: each category also needs room for its fanned-out
// tools (Frontend has 11), or neighbouring clusters interleave.
const MIN_ROOT_SLOT = 170;

// Below this width the graph canvas (beside the details panel) is too small
// for ~40 labelled tools, so tablets and phones get the grouped list instead.
const LIST_MEDIA_QUERY = "(max-width: 1300px)";

// Roots are pinned into a grid. Wide screens keep the original balanced two-row
// layout; narrow screens (phones / small tablets) get more rows and fewer
// columns so labels stop overlapping and the rows fill the height instead of
// clustering into two thin bands with an empty gap between them. Generalizes to
// any N.
// `narrow` tells the label renderer whether it used the tight multi-row grid
// branch below — root labels wrap to two lines there (see wrapRootLabel)
// instead of running single-line, since a column this tight is exactly where
// neighbouring labels start to collide.
function computeRootPositions(
  count: number,
  width: number,
  height: number
): {
  positions: { x: number; y: number }[];
  narrow: boolean;
  /** Distance between neighbouring roots, which bounds each leaf ring. */
  colSpacing: number;
  rowSpacing: number;
} {
  const positions: { x: number; y: number }[] = [];
  const fitCols = Math.max(2, Math.floor(width / MIN_ROOT_SLOT));

  // Enough width for the original two-row split → keep desktop exactly as-is.
  if (fitCols >= Math.ceil(count / 2)) {
    const topCount = Math.ceil(count / 2);
    for (let i = 0; i < count; i++) {
      const inTopRow = i < topCount;
      const row = inTopRow ? topCount : count - topCount;
      const indexInRow = inTopRow ? i : i - topCount;
      positions.push({
        x: ((indexInRow + 1) / (row + 1)) * width,
        y: height * (inTopRow ? 0.32 : 0.72),
      });
    }
    return { positions, narrow: false, colSpacing: width / (topCount + 1), rowSpacing: height * 0.4 };
  }

  // Narrow: balanced multi-row grid (e.g. 9 → 3/3/3, not 4/4/1), spread down the
  // full height so each label gets width/(itemsInRow+1) of room and no dead band
  // is left below the bubbles.
  const cols = Math.min(count, fitCols);
  const rows = Math.ceil(count / cols);
  const perRow = Math.ceil(count / rows);
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / perRow);
    const startOfRow = row * perRow;
    const itemsInRow = Math.min(perRow, count - startOfRow);
    const indexInRow = i - startOfRow;
    const yFrac = rows === 1 ? 0.5 : 0.16 + (0.66 * row) / (rows - 1);
    positions.push({
      x: ((indexInRow + 1) / (itemsInRow + 1)) * width,
      y: yFrac * height,
    });
  }
  return {
    positions,
    narrow: true,
    colSpacing: width / (perRow + 1),
    rowSpacing: rows === 1 ? height : (0.66 * height) / (rows - 1),
  };
}

function radiusFor(depth: number): number {
  return RADIUS_BY_DEPTH[Math.min(depth, RADIUS_BY_DEPTH.length - 1)];
}

// Same floor the invisible `.hitArea` circle uses (~44px touch target) —
// reused by the boundary clamp below so a node's tap target never lands
// off-canvas even when its visible circle is smaller.
function touchRadiusFor(depth: number): number {
  return Math.max(radiusFor(depth), 22);
}

// Distance a node's center must stay from the SVG edge so neither its touch
// circle nor its label (rendered below/around it) gets clipped by the SVG's
// own overflow: hidden. Roots carry the longest labels (up to 20 chars,
// possibly wrapped to two lines — see wrapRootLabel), so they get more room.
function edgeClearanceFor(depth: number): number {
  return touchRadiusFor(depth) + (depth === 0 ? 26 : 20);
}

// Where a leaf rests: an evenly spaced slot on an ellipse around its category
// root. The ellipse is wider than tall because labels are horizontal, and grows
// with the sibling count so 11 Frontend tools get as much room as 3 AI ones.
// Starts at the top-left so the category label (drawn below the root) stays
// clear: the bottom-center slot is skipped.
function ringOffset(
  slot: number,
  count: number,
  maxRx = Infinity,
  maxRy = Infinity
): { dx: number; dy: number } {
  const base = count > 8 ? 84 : count > 5 ? 74 : 64;
  const rx = Math.max(46, Math.min(base * 1.35, maxRx));
  // A ring squeezed narrower grows taller instead, keeping room for its labels.
  const ry = Math.max(40, Math.min(base * ((base * 1.35) / rx), maxRy));
  // count + 1 positions, leaving the one straight below the root empty.
  const step = (Math.PI * 2) / (count + 1);
  const angle = Math.PI / 2 + step * (slot + 1);
  return { dx: Math.cos(angle) * rx, dy: Math.sin(angle) * ry };
}

function linkKey(d: SimLink): string {
  const s = typeof d.source === "string" ? d.source : d.source.id;
  const t = typeof d.target === "string" ? d.target : d.target.id;
  return `${s}->${t}`;
}

/**
 * Collapsible force-directed graph replacing the Toolbelt tab's old
 * search+filter+grid, adapted from codepenz's "force-directed-node-tree" pen.
 * Categories are root nodes (pinned, collapsed by default); tools are
 * free-simulated leaf children revealed on click.
 *
 * The simulation, layers and drag/tick handlers are created once on mount; data
 * changes (expand/collapse, resize) flow through an incremental update
 * that reuses persistent SimNode objects — so existing nodes keep their
 * positions/velocities and only the changed nodes animate, instead of the whole
 * graph tearing down and re-heating on every keystroke.
 */
const ToolbeltGraph: React.FC<ToolbeltGraphProps> = ({
  tools,
  services,
  projects,
  active,
  onSelectService,
}) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
  const linkLayerRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const nodeLayerRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const linkSelRef = useRef<d3.Selection<SVGLineElement, SimLink, SVGGElement, unknown> | null>(null);
  const nodeSelRef = useRef<d3.Selection<SVGGElement, SimNode, SVGGElement, unknown> | null>(null);
  // Persistent node objects keyed by id — the crux of incremental updates:
  // reusing the same object across updates carries d3's mutated x/y/vx/vy over.
  const nodesRef = useRef(new Map<string, SimNode>());
  // Latest measured <svg> size, read by the tick handler's boundary clamp — a
  // ref (not state) because it's written from the same effect that already
  // re-runs the simulation; it must never itself trigger a re-render.
  const dimsRef = useRef({ width: 0, height: 0 });

  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());
  const [selectedTool, setSelectedTool] = useState<SelectedTool | null>(null);
  const toolUsage = useMemo(() => buildToolUsageIndex(services, projects), [services, projects]);
  const toolByName = useMemo(() => new Map(tools.map((t) => [t.tooltip, t])), [tools]);
  // Tablets and phones get a grouped list instead of the graph (see
  // LIST_MEDIA_QUERY), and the details become a bottom sheet.
  const isCompact = useMediaQuery(LIST_MEDIA_QUERY);
  // Read synchronously so there is no post-mount state flip (which used to force
  // an extra full rebuild).
  const [prefersReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [resizeTick, setResizeTick] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const observer = new ResizeObserver(() => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => setResizeTick((t) => t + 1), RESIZE_DEBOUNCE_MS);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  // Esc closes the details card; opening it moves focus to its close button
  // so keyboard/screen-reader users land somewhere sensible. Registered on
  // the same overlayStack the enclosing AppView uses for its own Escape
  // handler — otherwise both fire on one Escape press and closing the card
  // closes the whole Skillset window with it.
  // Desktop's details panel is not modal, so this only applies to the compact sheet.
  useEffect(() => {
    if (!selectedTool || !isCompact) return;
    const overlayId = Symbol("toolbelt-tool-card");
    pushOverlay(overlayId);
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isTopmostOverlay(overlayId)) {
        setSelectedTool(null);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      popOverlay(overlayId);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedTool, isCompact]);

  const tree = useMemo(() => buildToolbeltTree(tools), [tools]);

  const allExpanded = tree.length > 0 && collapsed.size === 0;
  const toggleAllCategories = useCallback(() => {
    setCollapsed((prev) => (prev.size === 0 ? new Set(tree.map((root) => root.name)) : new Set()));
  }, [tree]);

  // Shared by pointer click and keyboard (Enter/Space) on category nodes.
  const toggleCategory = useCallback((id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // ── Mount-once: create svg layers, simulation, and the tick/drag handlers ──
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const svg = d3.select(svgEl);
    const linkLayer = svg.append("g");
    const nodeLayer = svg.append("g");
    const nodesMap = nodesRef.current;
    linkLayerRef.current = linkLayer;
    nodeLayerRef.current = nodeLayer;

    const simulation = d3
      .forceSimulation<SimNode>()
      .alphaDecay(prefersReducedMotion ? 0.3 : 0.0228)
      .force(
        "link",
        // Weak: the ring targets (forceX/Y below) place leaves; links mostly
        // just draw the lines.
        d3.forceLink<SimNode, SimLink>().id((d) => d.id).distance(80).strength(0.05)
      )
      // No many-body repulsion: ring slots already space the leaves, and charge
      // pushed tools into neighbouring categories.
      // Leaf labels are drawn in full (no truncation), so a leaf's collision
      // radius also covers part of its label width (~2.2px per char at 10px).
      .force(
        "collide",
        d3.forceCollide<SimNode>((d) =>
          // Roots also reserve their uppercase label (drawn below the circle,
          // ~3.6px per char) so leaves can't land on "CLOUD & DATA".
          Math.max(radiusFor(d.depth) + 4, d.name.length * (d.depth === 0 ? 3.6 : 2.2))
        )
      )
      // Targets are set per node (its category root) in the update effect.
      .force("x", d3.forceX<SimNode>(0).strength(0.03))
      .force("y", d3.forceY<SimNode>(0).strength(0.03))
      .stop();
    simulationRef.current = simulation;

    simulation.on("tick", () => {
      // Boundary clamp: free (non-pinned) nodes are only pulled toward center
      // by a weak forceX/Y (strength 0.03), so charge + link forces can easily
      // push a leaf past the SVG edge — the svg clips to its viewBox, so that
      // leaf (and its label) just goes invisible. Roots are skipped: their
      // fx/fy pin from computeRootPositions is already kept in-bounds.
      const { width: boundsWidth, height: boundsHeight } = dimsRef.current;
      if (boundsWidth > 0 && boundsHeight > 0) {
        for (const n of simulation.nodes()) {
          if (n.fx != null) continue;
          const clearance = edgeClearanceFor(n.depth);
          const maxX = Math.max(clearance, boundsWidth - clearance);
          const maxY = Math.max(clearance, boundsHeight - clearance);
          n.x = Math.min(maxX, Math.max(clearance, n.x ?? 0));
          n.y = Math.min(maxY, Math.max(clearance, n.y ?? 0));
        }
      }

      const link = linkSelRef.current;
      const node = nodeSelRef.current;
      link
        ?.attr("x1", (d) => (d.source as SimNode).x ?? 0)
        .attr("y1", (d) => (d.source as SimNode).y ?? 0)
        .attr("x2", (d) => (d.target as SimNode).x ?? 0)
        .attr("y2", (d) => (d.target as SimNode).y ?? 0);
      node?.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => {
      simulation.on("tick", null);
      simulation.stop();
      svg.selectAll("*").remove();
      simulationRef.current = null;
      linkLayerRef.current = null;
      nodeLayerRef.current = null;
      linkSelRef.current = null;
      nodeSelRef.current = null;
      nodesMap.clear();
    };
    // isCompact: the <svg> only exists in the wide layout, so rebuild when it (re)appears.
  }, [prefersReducedMotion, isCompact]);

  // ── Incremental update: reconcile nodes/links, re-join, gently re-heat ──
  useEffect(() => {
    const svgEl = svgRef.current;
    const wrapEl = wrapRef.current;
    const simulation = simulationRef.current;
    const linkLayer = linkLayerRef.current;
    const nodeLayer = nodeLayerRef.current;
    if (!svgEl || !wrapEl || !simulation || !linkLayer || !nodeLayer) return;

    // Measured from the <svg> itself, not the .stage wrapper: .stage also
    // contains the controls row and hint above it, so its clientHeight is
    // taller than the svg's actual flex:1 share. Sizing the viewBox off the
    // wrapper made the viewBox aspect ratio not match the svg's own — the
    // browser's default preserveAspectRatio then uniformly downscaled and
    // pillarboxed everything to fit (observed ~72% of true size on a phone
    // viewport), silently shrinking every node's real touch target along
    // with it.
    const width = svgEl.clientWidth;
    const height = svgEl.clientHeight;
    // Hidden panel (or not yet laid out) — pause the sim and wait for the
    // ResizeObserver / `active` to report real dimensions.
    if (!active || width === 0 || height === 0) {
      simulation.stop();
      return;
    }
    dimsRef.current = { width, height };

    d3.select(svgEl).attr("viewBox", `0 0 ${width} ${height}`);
    const {
      positions: rootPositions,
      narrow: narrowRootLayout,
      colSpacing,
      rowSpacing,
    } = computeRootPositions(
      tree.length,
      width,
      height
    );

    // Pull each leaf toward its own category root (not the canvas center), so
    // dense categories don't spill into their neighbours' clusters.
    // Neighbouring rings share the gap between their roots, so each gets just
    // under half of it (minus room for labels) and clusters never interleave.
    const maxRx = colSpacing / 2 - 32;
    const maxRy = rowSpacing / 2 - 24;
    const ring = (d: SimNode | NodeDatum) =>
      d.depth === 0 ? { dx: 0, dy: 0 } : ringOffset(d.slot, d.siblingCount, maxRx, maxRy);
    const rootX = (d: SimNode) => (rootPositions[d.rootIndex]?.x ?? width / 2) + ring(d).dx;
    const rootY = (d: SimNode) => (rootPositions[d.rootIndex]?.y ?? height / 2) + ring(d).dy;
    (simulation.force("x") as d3.ForceX<SimNode>).x(rootX).strength(0.35);
    (simulation.force("y") as d3.ForceY<SimNode>).y(rootY).strength(0.35);
    const { nodes: descriptors, links } = flatten(tree, collapsed);

    // Reconcile descriptors against persistent node objects.
    const map = nodesRef.current;
    const nextIds = new Set(descriptors.map((d) => d.id));
    for (const id of Array.from(map.keys())) {
      if (!nextIds.has(id)) map.delete(id);
    }
    const nodes: SimNode[] = descriptors.map((desc: NodeDatum) => {
      const existing = map.get(desc.id);
      if (existing) {
        // Refresh mutable display fields (stable per id, but cheap to sync).
        existing.name = desc.name;
        existing.depth = desc.depth;
        existing.rootIndex = desc.rootIndex;
        existing.hasChildren = desc.hasChildren;
        existing.isSignature = desc.isSignature;
        existing.icon = desc.icon;
        existing.slot = desc.slot;
        existing.siblingCount = desc.siblingCount;
        return existing;
      }
      // New node: seed near its category root so it fans out rather than flying
      // in from the origin.
      const root = rootPositions[desc.rootIndex] ?? { x: width / 2, y: height / 2 };
      const offset = ring(desc);
      const created: SimNode = { ...desc, x: root.x + offset.dx, y: root.y + offset.dy };
      map.set(desc.id, created);
      return created;
    });

    // Re-pin roots to their computed slots; free leaves.
    nodes.forEach((n) => {
      if (n.depth === 0) {
        n.fx = rootPositions[n.rootIndex]?.x ?? width / 2;
        n.fy = rootPositions[n.rootIndex]?.y ?? height / 2;
      }
    });

    simulation.nodes(nodes);
    (simulation.force("link") as d3.ForceLink<SimNode, SimLink>).links(links);

    // Links join (keyed by id-pair so lines persist across updates).
    const linkSel = linkLayer
      .selectAll<SVGLineElement, SimLink>("line")
      .data(links, linkKey)
      .join("line")
      .attr("class", styles.link);
    linkSelRef.current = linkSel;

    // Nodes join (keyed by id). Enter builds the sub-tree and binds click/drag
    // once; updates keep their handlers.
    const nodeSel = nodeLayer
      .selectAll<SVGGElement, SimNode>("g")
      .data(nodes, (d) => d.id)
      .join((enter) => {
        const g = enter.append("g").attr("class", styles.node).style("cursor", "pointer");
        // Larger invisible circle under the visible one so small leaf nodes
        // still meet a ~44px touch target without changing how dense the
        // graph looks.
        g.append("circle").attr("class", styles.hitArea);
        g.append("circle").attr("class", styles.mainCircle);
        g.append("svg").attr("class", styles.nodeIcon).append("path");
        g.append("title");
        g.append("text").attr("text-anchor", "middle");

        const activate = (d: SimNode) => {
          if (d.hasChildren) {
            toggleCategory(d.id);
          } else {
            setSelectedTool({ id: d.id, name: d.name, category: d.category, icon: d.icon });
          }
        };

        g.on("click", (_event, d) => activate(d));
        g.on("keydown", (event, d) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            activate(d);
          }
        });

        g.call(
          d3
            .drag<SVGGElement, SimNode>()
            // Without a click-distance threshold, any sub-pixel finger
            // movement during a tap is captured as a drag and swallows the
            // click — the default is 0px, which is unusable on touchscreens.
            .clickDistance(6)
            .on("start", (event, d) => {
              if (!prefersReducedMotion && !event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            })
            .on("drag", (event, d) => {
              d.fx = event.x;
              d.fy = event.y;
            })
            .on("end", (event, d) => {
              if (!prefersReducedMotion && !event.active) simulation.alphaTarget(0);
              if (d.depth !== 0) {
                d.fx = null;
                d.fy = null;
              }
            })
        );
        return g;
      });
    nodeSelRef.current = nodeSel;

    nodeSel.classed(styles.signature, (d) => Boolean(d.isSignature));
    nodeSel.classed(styles.hasHiddenChildren, (d) => collapsed.has(d.id));

    // Every node is a keyboard-operable button now: category roots toggle
    // expand/collapse, leaves open the details card. aria-expanded only
    // applies to roots; aria-expanded refreshes on every update.
    nodeSel
      .attr("tabindex", 0)
      .attr("role", "button")
      .attr("aria-label", (d) => (d.hasChildren ? d.name : `${d.name}, show details`))
      .attr("aria-expanded", (d) =>
        d.hasChildren ? String(!collapsed.has(d.id)) : null
      );

    // Larger, invisible circle so leaf nodes get a ~44px tap target without
    // growing visually — see the comment on `.hitArea` in the enter block.
    nodeSel
      .select<SVGCircleElement>(`.${styles.hitArea}`)
      .attr("r", (d) => touchRadiusFor(d.depth));

    nodeSel
      .select<SVGCircleElement>(`.${styles.mainCircle}`)
      .attr("r", (d) => radiusFor(d.depth));
    nodeSel.classed(styles.root, (d) => d.depth === 0);
    // Paint category roots last (on top) so their labels are never covered by a
    // neighbouring tool's circle.
    nodeSel.sort((a, b) => b.depth - a.depth);

    const iconSvg = nodeSel.select<SVGSVGElement>("svg");
    iconSvg
      .attr("x", -8)
      .attr("y", -8)
      .attr("width", 16)
      .attr("height", 16)
      .attr("viewBox", (d) => (d.icon ? `0 0 ${d.icon.icon[0]} ${d.icon.icon[1]}` : "0 0 1 1"))
      .style("display", (d) => (d.icon ? null : "none"));
    iconSvg
      .select("path")
      .attr("d", (d) => (d.icon ? iconPathData(d.icon) : ""))
      .attr("fill", "currentColor");

    nodeSel.select("title").text((d) => d.name);
    // Root labels wrap to two lines in the narrow grid layout (see
    // wrapRootLabel) instead of truncating; tspans are rebuilt on every
    // update, which is cheap at this node count.
    nodeSel.select("text").each(function (d) {
      const text = d3.select(this);
      text.selectAll("tspan").remove();
      const lines =
        d.depth === 0 && narrowRootLayout ? wrapRootLabel(d.name) : [d.name];
      const baseDy = radiusFor(d.depth) + 10;
      lines.forEach((line, i) => {
        text
          .append("tspan")
          .attr("x", 0)
          .attr("dy", i === 0 ? baseDy : "1.15em")
          .text(line);
      });
    });

    // Gentle re-heat: existing nodes are already near equilibrium so they barely
    // move; only new/changed nodes settle. alphaDecay makes reduced-motion snap.
    simulation.alpha(0.3).restart();
  }, [tree, collapsed, resizeTick, active, prefersReducedMotion, toggleCategory, isCompact]);

  // Ring-highlight the selected leaf. Kept separate from the layout effect
  // above so opening the details card never re-heats/re-jiggles the graph.
  useEffect(() => {
    nodeSelRef.current?.classed(styles.selected, (d) => d.id === selectedTool?.id);
  }, [selectedTool]);

  const selectTool = (name: string, category: string) => {
    const tool = toolByName.get(name);
    setSelectedTool({ id: nodeId([category, name]), name, category, icon: tool?.icon });
  };

  const selectedDatum = selectedTool ? toolByName.get(selectedTool.name) : undefined;
  const usage = selectedTool
    ? usageForTool(toolUsage, selectedTool.name, selectedDatum?.aliases)
    : undefined;
  const signatureTools = tools.filter((t) => t.signature);

  // Shared by the desktop side panel and the phone bottom sheet.
  const details = selectedTool && (
    <>
      <div className={styles.toolCardHeader}>
        {selectedTool.icon && (
          <span
            className={`${styles.toolCardIcon} ${selectedDatum?.signature ? styles.toolCardIconCore : ""}`}
            aria-hidden="true"
          >
            <FontAwesomeIcon icon={selectedTool.icon} />
          </span>
        )}
        <div className={styles.toolCardHeading}>
          <span className={styles.toolCardTitle}>{selectedTool.name}</span>
          <span className={styles.toolCardCategory}>
            {selectedTool.category}
            {selectedDatum?.signature && <span className={styles.coreBadge}>Core stack</span>}
          </span>
        </div>
        <button
          type="button"
          ref={closeButtonRef}
          className={styles.toolCardClose}
          onClick={() => setSelectedTool(null)}
          aria-label="Close tool details"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>

      {usage?.projects.length ? (
        <div className={styles.toolCardSection}>
          <span className={styles.toolCardSectionLabel}>Shipped in</span>
          <div className={styles.toolCardChips}>
            {usage.projects.map((project) => (
              <a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.toolCardChip}
              >
                {project.name}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {usage?.services.length ? (
        <div className={styles.toolCardSection}>
          <span className={styles.toolCardSectionLabel}>Used in</span>
          <div className={styles.toolCardChips}>
            {usage.services.map((service) => (
              <button
                key={service.id}
                type="button"
                className={styles.toolCardChip}
                onClick={() => onSelectService(service.id)}
              >
                {service.title}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {!usage?.services.length && !usage?.projects.length && (
        <p className={styles.toolCardEmpty}>Part of the {selectedTool.category} toolkit.</p>
      )}
    </>
  );

  if (isCompact) {
    return (
      <div ref={wrapRef} className={styles.stage}>
        <p className={styles.legend}>
          <span className={styles.legendDot} aria-hidden="true" />
          Core stack
          <span className={`${styles.legendDot} ${styles.legendDotPlain}`} aria-hidden="true" />
          Also in the kit
        </p>
        <div className={styles.list}>
          {tree.map((category) => (
            <section key={category.name} className={styles.listGroup} aria-label={category.name}>
              <h3 className={styles.listHeading}>
                {category.name}
                <span className={styles.listCount}>{category.children?.length ?? 0}</span>
              </h3>
              <ul className={styles.listChips}>
                {category.children?.map((tool) => (
                  <li key={tool.name}>
                    <button
                      type="button"
                      className={`${styles.listChip} ${tool.isSignature ? styles.listChipCore : ""}`}
                      onClick={() => selectTool(tool.name, category.name)}
                      aria-haspopup="dialog"
                    >
                      {tool.icon && <FontAwesomeIcon icon={tool.icon} aria-hidden="true" />}
                      {tool.name}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {selectedTool && (
          <div className={styles.toolCard} role="dialog" aria-label={`${selectedTool.name} details`}>
            {details}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={`${styles.stage} ${styles.stageDesktop}`}>
      <svg ref={svgRef} className={styles.svg} role="group" aria-label="Toolbelt skills graph" />

      <aside className={styles.panel} aria-live="polite">
        {selectedTool ? (
          <div className={styles.panelDetails}>{details}</div>
        ) : (
          <div className={styles.panelIntro}>
            <p className={styles.panelEyebrow}>Toolbelt</p>
            <h3 className={styles.panelTitle}>What I build with</h3>
            <p className={styles.panelText}>
              {tools.length} tools across {tree.length} areas. Pick any tool to see where it has
              shipped; drag nodes to rearrange.
            </p>
            <p className={styles.legend}>
              <span className={styles.legendDot} aria-hidden="true" />
              Core stack
              <span className={`${styles.legendDot} ${styles.legendDotPlain}`} aria-hidden="true" />
              Also in the kit
            </p>
            <div className={styles.toolCardSection}>
              <span className={styles.toolCardSectionLabel}>Core stack</span>
              <div className={styles.toolCardChips}>
                {signatureTools.map((t) => (
                  <button
                    key={t.tooltip}
                    type="button"
                    className={`${styles.toolCardChip} ${styles.toolCardChipCore}`}
                    onClick={() => selectTool(t.tooltip, t.category)}
                  >
                    <FontAwesomeIcon icon={t.icon} aria-hidden="true" />
                    {t.tooltip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tree.length > 0 && (
          <button
            type="button"
            className={styles.expandToggle}
            onClick={toggleAllCategories}
            aria-pressed={allExpanded}
          >
            {allExpanded ? "Collapse all categories" : "Expand all categories"}
          </button>
        )}
      </aside>
    </div>
  );
};

export default ToolbeltGraph;
