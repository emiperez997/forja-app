import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNode } from '../../core/models/node.model';
import { NodesService } from '../../core/nodes.service';

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ul class="pl-3">
      @for (node of nodes; track node.id) {
        <li>
          <div
            class="flex items-center gap-1 py-1 px-2 rounded hover:bg-border cursor-pointer text-sm"
            (click)="onNodeClick(node)"
          >
            <span>{{ node.type === 'folder' ? '📁' : '📝' }}</span>
            <span>{{ node.title }}</span>
          </div>
          @if (node.children.length > 0) {
            <app-tree [nodes]="node.children" />
          }
        </li>
      }
    </ul>
  `,
})
export class TreeComponent {
  @Input() nodes: TreeNode[] = [];

  constructor(private nodesService: NodesService) {}

  onNodeClick(node: TreeNode) {
    if (node.type === 'note') {
      // acá disparás la selección de la nota para mostrarla en el editor
      // (podés usar un signal compartido en un servicio, o un output/router)
    }
  }
}
