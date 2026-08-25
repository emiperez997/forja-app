import { Injectable, signal } from '@angular/core';
import { NodeItem } from './models/node.model';

@Injectable({ providedIn: 'root' })
export class SelectionService {
  selectedNode = signal<NodeItem | null>(null);

  select(node: NodeItem) {
    this.selectedNode.set(node);
  }

  clear() {
    this.selectedNode.set(null);
  }
}
