"use client";

import {
  TreeExpander,
  TreeIcon,
  TreeLabel,
  TreeNode,
  TreeNodeContent,
  TreeNodeTrigger,
  TreeProvider,
  TreeView,
} from "@/components/kibo-ui/tree";

type TreeItem = {
  id: string;
  label: string;
  comment?: string;
  children?: TreeItem[];
};

function renderTree(items: TreeItem[], level = 0, parentPath: boolean[] = []) {
  return items.map((item, index) => {
    const isLast = index === items.length - 1;
    const hasChildren = !!item.children?.length;

    return (
      <TreeNode
        key={item.id}
        nodeId={item.id}
        level={level}
        isLast={isLast}
        parentPath={parentPath}
      >
        <TreeNodeTrigger>
          <TreeExpander hasChildren={hasChildren} />
          <TreeIcon hasChildren={hasChildren} />
          <TreeLabel>{item.label}</TreeLabel>
          {item.comment && (
            <span className="ml-3 text-xs text-muted-foreground truncate">
              {item.comment}
            </span>
          )}
        </TreeNodeTrigger>
        {hasChildren && (
          <TreeNodeContent hasChildren>
            {renderTree(
              item.children!,
              level + 1,
              [...parentPath, isLast],
            )}
          </TreeNodeContent>
        )}
      </TreeNode>
    );
  });
}

type DocsProjectTreeProps = {
  items: TreeItem[];
  defaultExpandedIds?: string[];
};

export function DocsProjectTree({
  items,
  defaultExpandedIds = [],
}: DocsProjectTreeProps) {
  return (
    <div className="border border-border rounded-xl overflow-hidden my-4 bg-muted/30">
      <TreeProvider defaultExpandedIds={defaultExpandedIds} indent={16}>
        <TreeView>{renderTree(items)}</TreeView>
      </TreeProvider>
    </div>
  );
}
