import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface ToolbeltToolDatum {
  icon: IconDefinition;
  tooltip: string;
  category: string;
  /** Core stack: drawn in copper in the graph and the phone list. */
  signature?: boolean;
  /** Other spellings of this tool in project stacks / service tags. */
  aliases?: string[];
}

export interface ToolbeltTreeNode {
  name: string;
  children?: ToolbeltTreeNode[];
  /** Leaf-only: highlights a tool as part of the signature stack. */
  isSignature?: boolean;
  /** Leaf-only: the tool's real icon, rendered as a native SVG path in ToolbeltGraph. */
  icon?: IconDefinition;
}

/** Categories in the order their first tool appears in the data. */
export function toolbeltCategories(tools: ToolbeltToolDatum[]): string[] {
  return Array.from(new Set(tools.map((t) => t.category)));
}

/**
 * Reshapes the flat toolbelt data into a 2-level tree (category root -> tool
 * leaf) for the force-directed graph, keeping the data's own order.
 */
export function buildToolbeltTree(tools: ToolbeltToolDatum[]): ToolbeltTreeNode[] {
  return toolbeltCategories(tools).map((category) => ({
    name: category,
    children: tools
      .filter((t) => t.category === category)
      .map((t) => ({
        name: t.tooltip,
        isSignature: Boolean(t.signature),
        icon: t.icon,
      })),
  }));
}
