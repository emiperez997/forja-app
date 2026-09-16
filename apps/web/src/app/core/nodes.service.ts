import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NodeItem, TreeNode } from './models/node.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NodesService {
  private flatNodes = signal<NodeItem[]>([]);

  tree = computed(() => this.buildTree(this.flatNodes()));
  trashNodes = signal<NodeItem[]>([]);

  searchResults = signal<NodeItem[] | null>(null);

  constructor(private http: HttpClient) {}

  load() {
    this.http
      .get<NodeItem[]>(`${environment.apiUrl}/api/nodes`)
      .subscribe((nodes) => this.flatNodes.set(nodes));
  }

  loadTrash() {
    this.http
      .get<NodeItem[]>(`${environment.apiUrl}/api/nodes/trash/list`)
      .subscribe((nodes) => this.trashNodes.set(nodes));
  }

  search(query: string) {
    if (!query.trim()) {
      this.searchResults.set(null);
      return;
    }
    this.http
      .get<NodeItem[]>(`${environment.apiUrl}/api/nodes/search/query`, { params: { q: query } })
      .subscribe((results) => this.searchResults.set(results));
  }

  create(type: 'folder' | 'note', title: string, parentId?: string) {
    return this.http
      .post<NodeItem>(`${environment.apiUrl}/api/nodes`, { type, title, parentId })
      .subscribe((node) => this.flatNodes.update((list) => [...list, node]));
  }

  rename(id: string, title: string) {
    this.http
      .patch<NodeItem>(`${environment.apiUrl}/api/nodes/${id}`, { title })
      .subscribe((updated) => {
        this.flatNodes.update((list) => list.map((n) => (n.id === id ? updated : n)));
      });
  }

  restore(id: string) {
    this.http.post<NodeItem>(`${environment.apiUrl}/api/nodes/${id}/restore`, {}).subscribe(() => {
      this.trashNodes.update((list) => list.filter((n) => n.id !== id));
      this.load(); // refresca el árbol activo
    });
  }

  updateContent(id: string, content: unknown) {
    this.http
      .patch<NodeItem>(`${environment.apiUrl}/api/nodes/${id}`, { content })
      .subscribe((updated) => {
        this.flatNodes.update((list) => list.map((n) => (n.id === id ? updated : n)));
      });
  }

  move(id: string, parentId: string | null) {
    this.http.patch<NodeItem>(`${environment.apiUrl}/api/nodes/${id}`, { parentId }).subscribe({
      next: (updated) => {
        this.flatNodes.update((list) => list.map((n) => (n.id === id ? updated : n)));
      },
      error: (err) => console.error('Error al mover el nodo:', err),
    });
  }

  remove(id: string) {
    this.http.delete(`${environment.apiUrl}/api/nodes/${id}`).subscribe(() => {
      this.flatNodes.update((list) => list.filter((n) => n.id !== id));
    });
  }

  removePermanent(id: string) {
    this.http.delete(`${environment.apiUrl}/api/nodes/${id}/permanent`).subscribe(() => {
      this.trashNodes.update((list) => list.filter((n) => n.id !== id));
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

  clear() {
    this.flatNodes.set([]);
  }
}
