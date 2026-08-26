export interface NodeItem {
  id: string;
  userId: string;
  parentId: string | null;
  type: 'folder' | 'note';
  title: string;
  content: unknown | null;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface TreeNode extends NodeItem {
  children: TreeNode[];
}
