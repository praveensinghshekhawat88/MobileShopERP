import { useMemo } from 'react';

import type { FormSelectOption } from '@/components/inputs/FormSelect';
import { useCategoryTree } from '@/modules/category/hooks/useCategoryTree';
import type { CategoryTreeNode } from '@/modules/category/types/Category';

interface CategoryOptionsResult {
  readonly options: readonly FormSelectOption[];
  readonly nameById: ReadonlyMap<number, string>;
  readonly isLoading: boolean;
}

interface FlatNode {
  readonly id: number;
  readonly name: string;
  readonly depth: number;
}

function flatten(nodes: readonly CategoryTreeNode[], depth: number): FlatNode[] {
  return nodes.flatMap((node) => [
    { id: node.id, name: node.name, depth },
    ...flatten(node.children, depth + 1),
  ]);
}

function collectDescendantIds(node: CategoryTreeNode): number[] {
  return node.children.flatMap((child) => [child.id, ...collectDescendantIds(child)]);
}

function findNode(nodes: readonly CategoryTreeNode[], id: number): CategoryTreeNode | undefined {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    const found = findNode(node.children, id);
    if (found) {
      return found;
    }
  }
  return undefined;
}

/**
 * Builds "Parent Category" select options (depth-indented, root first) plus
 * an id → name lookup for the flat table's "Parent" column. `excludeId` is
 * the category currently being edited — it and all of its descendants are
 * removed from the options client-side to pre-empt the backend's
 * `CircularCategoryReferenceException` (see `CategoryService#validateParent`)
 * with immediate UI feedback instead of a round-trip error.
 */
export function useCategoryOptions(excludeId?: number): CategoryOptionsResult {
  const treeQuery = useCategoryTree();
  const tree = treeQuery.data;

  return useMemo(() => {
    const flat = flatten(tree ?? [], 0);
    const nameById = new Map(flat.map((node) => [node.id, node.name]));

    const excludedNode = excludeId !== undefined ? findNode(tree ?? [], excludeId) : undefined;
    const invalidIds =
      excludeId !== undefined
        ? new Set([excludeId, ...(excludedNode ? collectDescendantIds(excludedNode) : [])])
        : new Set<number>();

    const options: FormSelectOption[] = flat
      .filter((node) => !invalidIds.has(node.id))
      .map((node) => ({ value: String(node.id), label: `${'— '.repeat(node.depth)}${node.name}` }));

    return { options, nameById, isLoading: treeQuery.isLoading };
  }, [tree, excludeId, treeQuery.isLoading]);
}
