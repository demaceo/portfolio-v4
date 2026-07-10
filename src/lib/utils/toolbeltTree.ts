import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface ToolbeltToolDatum {
  icon: IconDefinition;
  tooltip: string;
  category: string;
}

export interface ToolbeltTreeNode {
  name: string;
  children?: ToolbeltTreeNode[];
  /** Leaf-only — highlights a tool as part of the signature stack. */
  isSignature?: boolean;
  /** Leaf-only — the tool's real icon, rendered as a native SVG path in ToolbeltGraph. */
  icon?: IconDefinition;
}

/**
 * Reshapes the flat { icon, tooltip, category } toolbelt data into a
 * 2-level tree (category root -> tool leaf) for the force-directed graph.
 * Categories are ordered by `orderedCategories` first, then any
 * undiscovered categories alphabetically — same ordering rule the old
 * grid used.
 */
export function buildToolbeltTree(
  tools: ToolbeltToolDatum[],
  orderedCategories: string[],
  signatureStack: string[]
): ToolbeltTreeNode[] {
  const discovered = Array.from(new Set(tools.map((t) => t.category)));
  const prioritized = orderedCategories.filter((c) => discovered.includes(c));
  const remaining = discovered
    .filter((c) => !prioritized.includes(c))
    .sort((a, b) => a.localeCompare(b));
  const categories = [...prioritized, ...remaining];

  return categories.map((category) => ({
    name: category,
    children: tools
      .filter((t) => t.category === category)
      .map((t) => ({
        name: t.tooltip,
        isSignature: signatureStack.includes(t.tooltip),
        icon: t.icon,
      })),
  }));
}
