import { Injectable, signal } from '@angular/core';
import { TreeNode } from './models/node.model';

export interface ContextMenuState {
  node: TreeNode;
  x: number;
  y: number;
}

@Injectable({ providedIn: 'root' })
export class ContextMenuService {
  state = signal<ContextMenuState | null>(null);

  open(node: TreeNode, event: MouseEvent) {
    event.preventDefault();
    this.state.set({ node, x: event.clientX, y: event.clientY });
  }

  close() {
    this.state.set(null);
  }
}
