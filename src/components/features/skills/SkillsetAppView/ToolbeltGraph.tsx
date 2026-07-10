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

function flatten(tree: ToolbeltTreeNode[], collapsed: Set<string>) {
  const nodes: SimNode[] = [];
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

/**
 * Collapsible force-directed graph replacing the Toolbelt tab's old
 * search+filter+grid, adapted from codepenz's "force-directed-node-tree"
 * pen. Categories are root nodes (pinned, collapsed by default); tools are
 * free-simulated leaf children revealed on click.
 */
const ToolbeltGraph: React.FC<ToolbeltGraphProps> = ({ tools, orderedCategories, signatureStack }) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const positionsRef = useRef(new Map<string, { x: number; y: number }>());

  const [toolQuery, setToolQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(
    () => new Set(buildToolbeltTree(tools, orderedCategories, signatureStack).map((root) => root.name))
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [resizeTick, setResizeTick] = useState(0);

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

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

  useEffect(() => {
    const svgEl = svgRef.current;
    const wrapEl = wrapRef.current;
    if (!svgEl || !wrapEl) return;

    const width = wrapEl.clientWidth;
    const height = wrapEl.clientHeight;
    const svg = d3.select(svgEl).attr("viewBox", `0 0 ${width} ${height}`);

    // Organizational group layers; the per-child .link/.node classes carry the
    // actual styling, so these wrappers need no class of their own.
    const linkLayer = svg.append("g");
    const nodeLayer = svg.append("g");

    const simulation = d3
      .forceSimulation<SimNode>()
      .alphaDecay(prefersReducedMotion ? 0.3 : 0.0228)
      .force(
        "link",
        d3.forceLink<SimNode, SimLink>().id((d) => d.id).distance(90).strength(0.7)
      )
      .force("charge", d3.forceManyBody().strength(-90))
      .force(
        "collide",
        d3.forceCollide<SimNode>((d) => RADIUS_BY_DEPTH[Math.min(d.depth, RADIUS_BY_DEPTH.length - 1)] + 6)
      )
      .force("x", d3.forceX(width / 2).strength(0.03))
      .force("y", d3.forceY(height / 2).strength(0.03));

    const rootPositions = computeRootPositions(tree.length, width, height);

    const { nodes, links } = flatten(tree, effectiveCollapsed);

    nodes.forEach((n) => {
      const saved = positionsRef.current.get(n.id);
      if (saved) {
        n.x = saved.x;
        n.y = saved.y;
      }
      if (n.depth === 0) {
        n.fx = rootPositions[n.rootIndex]?.x ?? width / 2;
        n.fy = rootPositions[n.rootIndex]?.y ?? height / 2;
      }
    });

    simulation.nodes(nodes);
    (simulation.force("link") as d3.ForceLink<SimNode, SimLink>).links(links);
    simulation.alpha(0.7).restart();

    const link = linkLayer
      .selectAll<SVGLineElement, SimLink>("line")
      .data(
        links,
        (d) =>
          `${typeof d.source === "string" ? d.source : d.source.id}->${
            typeof d.target === "string" ? d.target : d.target.id
          }`
      )
      .join("line")
      .attr("class", styles.link);

    const node = nodeLayer
      .selectAll<SVGGElement, SimNode>("g")
      .data(nodes, (d) => d.id)
      .join((enter) => {
        const g = enter.append("g").attr("class", styles.node).style("cursor", "pointer");
        g.append("circle");
        g.append("svg").attr("class", styles.nodeIcon).append("path");
        g.append("title");
        g.append("text").attr("text-anchor", "middle");
        return g;
      });

    node.classed(
      styles.signature,
      (d) => Boolean(d.isSignature)
    );
    node.classed(styles.hasHiddenChildren, (d) => effectiveCollapsed.has(d.id));

    node
      .select("circle")
      .attr("r", (d) => RADIUS_BY_DEPTH[Math.min(d.depth, RADIUS_BY_DEPTH.length - 1)])
      .attr("fill", (d) => {
        const base = d3.hsl(rootColor(d.rootIndex, tree.length));
        base.l = Math.min(0.85, base.l + d.depth * 0.14);
        return base.formatHex();
      });

    const iconSvg = node.select<SVGSVGElement>("svg");
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

    node.select("title").text((d) => d.name);

    node
      .select("text")
      .text((d) => truncateLabel(d.name, d.depth))
      .attr("dy", (d) => RADIUS_BY_DEPTH[Math.min(d.depth, RADIUS_BY_DEPTH.length - 1)] + 10);

    node.on("click", (_event, d) => {
      if (!d.hasChildren) return;
      setCollapsed((prev) => {
        const next = new Set(prev);
        if (next.has(d.id)) next.delete(d.id);
        else next.add(d.id);
        return next;
      });
    });

    node.call(
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

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as SimNode).x ?? 0)
        .attr("y1", (d) => (d.source as SimNode).y ?? 0)
        .attr("x2", (d) => (d.target as SimNode).x ?? 0)
        .attr("y2", (d) => (d.target as SimNode).y ?? 0);

      node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);

      nodes.forEach((n) => {
        if (n.x !== undefined && n.y !== undefined) {
          positionsRef.current.set(n.id, { x: n.x, y: n.y });
        }
      });
    });

    return () => {
      simulation.stop();
      svg.selectAll("*").remove();
    };
  }, [tree, effectiveCollapsed, prefersReducedMotion, resizeTick]);

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
