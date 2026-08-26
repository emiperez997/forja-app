import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNode } from '../../core/models/node.model';
import { SelectionService } from '../../core/selection.service';

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
            [class.bg-border]="selectionService.selectedNode()?.id === node.id"
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

  constructor(public selectionService: SelectionService) {}

  onNodeClick(node: TreeNode) {
    if (node.type === 'note') {
      this.selectionService.select(node);
    }
  }
}
