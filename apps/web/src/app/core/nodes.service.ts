import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NodeItem, TreeNode } from './models/node.model';

@Injectable({ providedIn: 'root' })
export class NodesService {
  private flatNodes = signal<NodeItem[]>([]);

  tree = computed(() => this.buildTree(this.flatNodes()));

  constructor(private http: HttpClient) {}

  load() {
    this.http.get<NodeItem[]>('/api/nodes').subscribe((nodes) => this.flatNodes.set(nodes));
  }

  create(type: 'folder' | 'note', title: string, parentId?: string) {
    return this.http
      .post<NodeItem>('/api/nodes', { type, title, parentId })
      .subscribe((node) => this.flatNodes.update((list) => [...list, node]));
  }

  rename(id: string, title: string) {
    this.http.patch<NodeItem>(`/api/nodes/${id}`, { title }).subscribe((updated) => {
      this.flatNodes.update((list) => list.map((n) => (n.id === id ? updated : n)));
    });
  }

  updateContent(id: string, content: unknown) {
    this.http.patch<NodeItem>(`/api/nodes/${id}`, { content }).subscribe((updated) => {
      this.flatNodes.update((list) => list.map((n) => (n.id === id ? updated : n)));
    });
  }

  move(id: string, parentId: string | null) {
    this.http.patch<NodeItem>(`/api/nodes/${id}`, { parentId }).subscribe((updated) => {
      this.flatNodes.update((list) => list.map((n) => (n.id === id ? updated : n)));
    });
  }

  remove(id: string) {
    this.http.delete(`/api/nodes/${id}`).subscribe(() => {
      this.flatNodes.update((list) => list.filter((n) => n.id !== id && n.parentId !== id));
    });
  }

  private buildTree(flat: NodeItem[]): TreeNode[] {
    const map = new Map<string, TreeNode>();
    flat.forEach((n) => map.set(n.id, { ...n, children: [] }));

    const roots: TreeNode[] = [];
    map.forEach((node) => {
      if (node.parentId && map.has(node.parentId)) {
        map.get(node.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }
}
