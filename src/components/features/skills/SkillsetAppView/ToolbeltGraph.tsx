"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { buildToolbeltTree, type ToolbeltToolDatum, type ToolbeltTreeNode } from "@/lib/utils/toolbeltTree";
import { buildToolUsageIndex } from "@/lib/utils/toolUsage";
import { pushOverlay, popOverlay, isTopmostOverlay } from "@/lib/utils/overlayStack";
import type { Service, Project } from "@/lib/types";
import styles from "./ToolbeltGraph.module.css";

interface ToolbeltGraphProps {
  tools: ToolbeltToolDatum[];
  orderedCategories: string[];
  signatureStack: string[];
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
  category: string;
  depth: number;
  rootIndex: number;
  hasChildren: boolean;
  isSignature?: boolean;
  icon?: IconDefinition;
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

  function visit(item: ToolbeltTreeNode, path: string[], depth: number, rootIndex: number) {
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

// Minimum horizontal room (px) a pinned category root needs so its full label
// clears its neighbour's. Below this per-column budget we shed a column and add
// a row instead. `forceCollide` only knows circle radii, so column spacing is
// the only thing keeping the (wider) labels from colliding.
const MIN_ROOT_SLOT = 116;

// Roots are pinned into a grid. Wide screens keep the original balanced two-row
// layout; narrow screens (phones / small tablets) get more rows and fewer
// columns so labels stop overlapping and the rows fill the height instead of
// clustering into two thin bands with an empty gap between them. Generalizes to
// any N.
function computeRootPositions(count: number, width: number, height: number) {
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
    return positions;
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
 * changes (expand/collapse, resize) flow through an incremental update
 * that reuses persistent SimNode objects — so existing nodes keep their
 * positions/velocities and only the changed nodes animate, instead of the whole
 * graph tearing down and re-heating on every keystroke.
 */
const ToolbeltGraph: React.FC<ToolbeltGraphProps> = ({
  tools,
  orderedCategories,
  signatureStack,
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

  const [collapsed, setCollapsed] = useState<Set<string>>(
    () => new Set(buildToolbeltTree(tools, orderedCategories, signatureStack).map((root) => root.name))
  );
  const [selectedTool, setSelectedTool] = useState<SelectedTool | null>(null);
  const toolUsage = useMemo(() => buildToolUsageIndex(services, projects), [services, projects]);
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
  useEffect(() => {
    if (!selectedTool) return;
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
  }, [selectedTool]);

  const tree = useMemo(
    () => buildToolbeltTree(tools, orderedCategories, signatureStack),
    [tools, orderedCategories, signatureStack]
  );

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

    d3.select(svgEl).attr("viewBox", `0 0 ${width} ${height}`);
    (simulation.force("x") as d3.ForceX<SimNode>).x(width / 2);
    (simulation.force("y") as d3.ForceY<SimNode>).y(height / 2);

    const rootPositions = computeRootPositions(tree.length, width, height);
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
      .attr("r", (d) => Math.max(radiusFor(d.depth), 22));

    nodeSel
      .select<SVGCircleElement>(`.${styles.mainCircle}`)
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
  }, [tree, collapsed, resizeTick, active, prefersReducedMotion, toggleCategory]);

  // Ring-highlight the selected leaf. Kept separate from the layout effect
  // above so opening the details card never re-heats/re-jiggles the graph.
  useEffect(() => {
    nodeSelRef.current?.classed(styles.selected, (d) => d.id === selectedTool?.id);
  }, [selectedTool]);

  const usage = selectedTool ? toolUsage.get(selectedTool.name) : undefined;

  return (
    <div ref={wrapRef} className={styles.stage}>
      <div className={styles.controlsRow}>
        {tree.length > 0 && (
          <button
            type="button"
            className={styles.expandToggle}
            onClick={toggleAllCategories}
            aria-pressed={allExpanded}
          >
            {allExpanded ? "Collapse all" : "Expand all"}
          </button>
        )}
      </div>

      <p className={styles.hint}>
        Click a category to expand or collapse it. Click a tool for details. Drag any node to reposition it.
      </p>

      <svg
        ref={svgRef}
        className={styles.svg}
        role="group"
        aria-label="Toolbelt skills graph"
      />

      {selectedTool && (
        <div className={styles.toolCard} role="dialog" aria-label={`${selectedTool.name} details`}>
          <div className={styles.toolCardHeader}>
            {selectedTool.icon && (
              <span className={styles.toolCardIcon} aria-hidden="true">
                <FontAwesomeIcon icon={selectedTool.icon} />
              </span>
            )}
            <div className={styles.toolCardHeading}>
              <span className={styles.toolCardTitle}>{selectedTool.name}</span>
              <span className={styles.toolCardCategory}>{selectedTool.category}</span>
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

          {!usage?.services.length && !usage?.projects.length && (
            <p className={styles.toolCardEmpty}>Part of the {selectedTool.category} toolkit.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ToolbeltGraph;
