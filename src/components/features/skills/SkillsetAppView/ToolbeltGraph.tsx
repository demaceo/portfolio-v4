"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { buildToolbeltTree, type ToolbeltToolDatum, type ToolbeltTreeNode } from "@/lib/utils/toolbeltTree";
import styles from "./ToolbeltGraph.module.css";

interface ToolbeltGraphProps {
  tools: ToolbeltToolDatum[];
  orderedCategories: string[];
  signatureStack: string[];
  /** Whether the Toolbelt tab is currently shown. The graph only lays out /
   *  simulates while visible; hidden it pauses to spare CPU on the Services tab. */
  active: boolean;
}

interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  depth: number;
  rootIndex: number;
  hasChildren: boolean;
  isSignature?: boolean;
  icon?: IconDefinition;
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
const ROOT_HUE_START = 21; // --noir-accent's own hue (#d4845a)
const ROOT_SATURATION = 0.48;
const ROOT_LIGHTNESS = 0.6;
const RESIZE_DEBOUNCE_MS = 150;

function nodeId(path: string[]): string {
  return path.join(" / ");
}

function iconPathData(icon: IconDefinition): string {
  const d = icon.icon[4];
  return Array.isArray(d) ? d[0] : d;
}

function truncateLabel(name: string, depth: number): string {
  const max = depth === 0 ? 20 : 11;
  return name.length > max ? `${name.slice(0, max)}…` : name;
}

interface NodeDatum {
  id: string;
  name: string;
  depth: number;
  rootIndex: number;
  hasChildren: boolean;
  isSignature?: boolean;
  icon?: IconDefinition;
}

// Flatten the tree into node descriptors + links (by id). Collapsed roots don't
// recurse into their children. Positions are NOT set here — the update effect
// reconciles these descriptors against persistent SimNode objects.
function flatten(tree: ToolbeltTreeNode[], collapsed: Set<string>) {
  const nodes: NodeDatum[] = [];
  const links: SimLink[] = [];

  function visit(item: ToolbeltTreeNode, path: string[], depth: number, rootIndex: number) {
    const id = nodeId(path);
    nodes.push({
      id,
      name: item.name,
      depth,
      rootIndex,
      hasChildren: Boolean(item.children?.length),
      isSignature: item.isSignature,
      icon: item.icon,
    });
    if (path.length > 1) {
      links.push({ source: nodeId(path.slice(0, -1)), target: id });
    }
    if (item.children && !collapsed.has(id)) {
      item.children.forEach((child) => visit(child, [...path, child.name], depth + 1, rootIndex));
    }
  }

  tree.forEach((root, i) => visit(root, [root.name], 0, i));
  return { nodes, links };
}

// Roots pinned in two staggered rows instead of the pen's single line of 4 —
// 9 categories crowd badly on one line. Generalizes to any N.
function computeRootPositions(count: number, width: number, height: number) {
  const topCount = Math.ceil(count / 2);
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const inTopRow = i < topCount;
    const row = inTopRow ? topCount : count - topCount;
    const indexInRow = inTopRow ? i : i - topCount;
    positions.push({
      x: ((indexInRow + 1) / (row + 1)) * width,
      y: height * (inTopRow ? 0.32 : 0.72),
    });
  }
  return positions;
}

function rootColor(index: number, count: number): string {
  const hue = (ROOT_HUE_START + index * (360 / count)) % 360;
  return d3.hsl(hue, ROOT_SATURATION, ROOT_LIGHTNESS).formatHex();
}

function radiusFor(depth: number): number {
  return RADIUS_BY_DEPTH[Math.min(depth, RADIUS_BY_DEPTH.length - 1)];
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
 * changes (search, expand/collapse, resize) flow through an incremental update
 * that reuses persistent SimNode objects — so existing nodes keep their
 * positions/velocities and only the changed nodes animate, instead of the whole
 * graph tearing down and re-heating on every keystroke.
 */
const ToolbeltGraph: React.FC<ToolbeltGraphProps> = ({
  tools,
  orderedCategories,
  signatureStack,
  active,
}) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
  const linkLayerRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const nodeLayerRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const linkSelRef = useRef<d3.Selection<SVGLineElement, SimLink, SVGGElement, unknown> | null>(null);
  const nodeSelRef = useRef<d3.Selection<SVGGElement, SimNode, SVGGElement, unknown> | null>(null);
  // Persistent node objects keyed by id — the crux of incremental updates:
  // reusing the same object across updates carries d3's mutated x/y/vx/vy over.
  const nodesRef = useRef(new Map<string, SimNode>());

  const [toolQuery, setToolQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(
    () => new Set(buildToolbeltTree(tools, orderedCategories, signatureStack).map((root) => root.name))
  );
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

  const filteredTools = useMemo(() => {
    const q = toolQuery.trim().toLowerCase();
    if (!q) return tools;
    return tools.filter(
      (t) => t.tooltip.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    );
  }, [tools, toolQuery]);

  const tree = useMemo(
    () => buildToolbeltTree(filteredTools, orderedCategories, signatureStack),
    [filteredTools, orderedCategories, signatureStack]
  );

  const isSearching = toolQuery.trim().length > 0;
  // Categories with zero matches are already absent from `tree` (buildToolbeltTree
  // only creates roots for categories present in its input), so expanding
  // everything currently in the tree is exactly "expand everything that matched."
  const effectiveCollapsed = useMemo(
    () => (isSearching ? new Set<string>() : collapsed),
    [isSearching, collapsed]
  );

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
        d3.forceLink<SimNode, SimLink>().id((d) => d.id).distance(90).strength(0.7)
      )
      .force("charge", d3.forceManyBody().strength(-90))
      .force("collide", d3.forceCollide<SimNode>((d) => radiusFor(d.depth) + 6))
      // Centers are set to the real half-width/height in the update effect.
      .force("x", d3.forceX<SimNode>(0).strength(0.03))
      .force("y", d3.forceY<SimNode>(0).strength(0.03))
      .stop();
    simulationRef.current = simulation;

    simulation.on("tick", () => {
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
  }, [prefersReducedMotion]);

  // ── Incremental update: reconcile nodes/links, re-join, gently re-heat ──
  useEffect(() => {
    const svgEl = svgRef.current;
    const wrapEl = wrapRef.current;
    const simulation = simulationRef.current;
    const linkLayer = linkLayerRef.current;
    const nodeLayer = nodeLayerRef.current;
    if (!svgEl || !wrapEl || !simulation || !linkLayer || !nodeLayer) return;

    const width = wrapEl.clientWidth;
    const height = wrapEl.clientHeight;
    // Hidden panel (or not yet laid out) — pause the sim and wait for the
    // ResizeObserver / `active` to report real dimensions.
    if (!active || width === 0 || height === 0) {
      simulation.stop();
      return;
    }

    d3.select(svgEl).attr("viewBox", `0 0 ${width} ${height}`);
    (simulation.force("x") as d3.ForceX<SimNode>).x(width / 2);
    (simulation.force("y") as d3.ForceY<SimNode>).y(height / 2);

    const rootPositions = computeRootPositions(tree.length, width, height);
    const { nodes: descriptors, links } = flatten(tree, effectiveCollapsed);

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
        return existing;
      }
      // New node: seed near its category root so it fans out rather than flying
      // in from the origin.
      const root = rootPositions[desc.rootIndex] ?? { x: width / 2, y: height / 2 };
      const jitter = () => (Math.random() - 0.5) * 40;
      const created: SimNode = {
        ...desc,
        x: root.x + (desc.depth === 0 ? 0 : jitter()),
        y: root.y + (desc.depth === 0 ? 0 : jitter()),
      };
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
        g.append("circle");
        g.append("svg").attr("class", styles.nodeIcon).append("path");
        g.append("title");
        g.append("text").attr("text-anchor", "middle");

        g.on("click", (_event, d) => {
          if (!d.hasChildren) return;
          setCollapsed((prev) => {
            const next = new Set(prev);
            if (next.has(d.id)) next.delete(d.id);
            else next.add(d.id);
            return next;
          });
        });

        g.call(
          d3
            .drag<SVGGElement, SimNode>()
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
    nodeSel.classed(styles.hasHiddenChildren, (d) => effectiveCollapsed.has(d.id));

    nodeSel
      .select<SVGCircleElement>("circle")
      .attr("r", (d) => radiusFor(d.depth))
      .attr("fill", (d) => {
        const base = d3.hsl(rootColor(d.rootIndex, tree.length));
        base.l = Math.min(0.85, base.l + d.depth * 0.14);
        return base.formatHex();
      });

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
    nodeSel
      .select("text")
      .text((d) => truncateLabel(d.name, d.depth))
      .attr("dy", (d) => radiusFor(d.depth) + 10);

    // Gentle re-heat: existing nodes are already near equilibrium so they barely
    // move; only new/changed nodes settle. alphaDecay makes reduced-motion snap.
    simulation.alpha(0.3).restart();
  }, [tree, effectiveCollapsed, resizeTick, active, prefersReducedMotion]);

  return (
    <div ref={wrapRef} className={styles.stage}>
      <label className={styles.search}>
        <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} aria-hidden="true" />
        <input
          type="search"
          value={toolQuery}
          onChange={(event) => setToolQuery(event.target.value)}
          placeholder="Search tools or categories"
          aria-label="Search tools or categories"
        />
      </label>

      <p className={styles.hint}>Click a category to expand or collapse it. Drag any node to reposition it.</p>

      <div className={styles.legend}>
        {tree.map((root, i) => (
          <span key={root.name} className={styles.legendItem}>
            <span
              className={styles.legendSwatch}
              style={{ background: rootColor(i, tree.length) }}
              aria-hidden="true"
            />
            {root.name}
          </span>
        ))}
      </div>

      <svg ref={svgRef} className={styles.svg} />
    </div>
  );
};

export default ToolbeltGraph;
