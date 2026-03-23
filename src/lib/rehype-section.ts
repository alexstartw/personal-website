/**
 * rehype-section
 *
 * Wraps headings (h2/h3/h4) and their following content into
 * <div class="prose-section prose-section-N"> containers, creating
 * a properly nested structure for progressive indentation.
 */

import type { Root, Element, ElementContent } from "hast";

function getHeadingLevel(node: ElementContent): number | null {
  if (node.type !== "element") return null;
  const m = (node as Element).tagName.match(/^h([2-4])$/);
  return m ? parseInt(m[1], 10) : null;
}

function makeSection(level: number, children: ElementContent[]): Element {
  return {
    type: "element",
    tagName: "div",
    properties: { className: ["prose-section", `prose-section-${level}`] },
    children,
  };
}

/**
 * Recursively group flat nodes into sections starting at `level`.
 */
function sectionize(nodes: ElementContent[], level: number): ElementContent[] {
  if (level > 4) return nodes;

  const result: ElementContent[] = [];
  let i = 0;

  while (i < nodes.length) {
    const node = nodes[i];
    const nodeLevel = getHeadingLevel(node);

    if (nodeLevel === level) {
      // Collect this heading + all following nodes until next same/higher heading
      const sectionChildren: ElementContent[] = [node];
      i++;

      while (i < nodes.length) {
        const next = nodes[i];
        const nextLevel = getHeadingLevel(next);
        if (nextLevel !== null && nextLevel <= level) break;
        sectionChildren.push(next);
        i++;
      }

      // Recursively process children for deeper nesting
      const processed = sectionize(sectionChildren, level + 1);
      result.push(makeSection(level, processed));
    } else {
      result.push(node);
      i++;
    }
  }

  return result;
}

const rehypeSection = () => (tree: Root) => {
  tree.children = sectionize(tree.children as ElementContent[], 2);
};

export default rehypeSection;
