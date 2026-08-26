import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNode } from '../../core/models/node.model';
import { SelectionService } from '../../core/selection.service';
import { ContextMenuService } from '../../core/context-menu';
import { NodesService } from '../../core/nodes.service';

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ul class="pl-3">
      @for (node of nodes; track node.id) {
        <li
          draggable="true"
          (dragstart)="onDragStart($event, node)"
          (dragover)="onDragOver($event)"
          (drop)="onDrop($event, node)"
        >
          <div
            class="flex items-center gap-1 py-1 px-2 rounded hover:bg-border cursor-pointer text-sm"
            [class.bg-border]="selectionService.selectedNode()?.id === node.id"
            (click)="onNodeClick(node)"
            (contextmenu)="contextMenu.open(node, $event)"
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

  selectionService = inject(SelectionService);
  contextMenu = inject(ContextMenuService);
  private nodesService = inject(NodesService);

  onNodeClick(node: TreeNode) {
    if (node.type === 'note') {
      this.selectionService.select(node);
    }
  }

  onDragStart(event: DragEvent, node: TreeNode) {
    event.dataTransfer?.setData('text/plain', node.id);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); // necesario para permitir el drop
  }

  onDrop(event: DragEvent, target: TreeNode) {
    event.preventDefault();
    event.stopPropagation(); // evita que el drop también dispare en un <li> padre
    const draggedId = event.dataTransfer?.getData('text/plain');
    if (!draggedId || draggedId === target.id) return;

    // Solo permitimos soltar DENTRO de una carpeta
    if (target.type === 'folder') {
      this.nodesService.move(draggedId, target.id);
    }
  }
}
