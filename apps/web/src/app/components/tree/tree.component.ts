import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideFolder, LucideFileText } from '@lucide/angular';
import { TreeNode } from '../../core/models/node.model';
import { SelectionService } from '../../core/selection.service';
import { ContextMenuService } from '../../core/context-menu.service';
import { NodesService } from '../../core/nodes.service';

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [CommonModule, LucideFolder, LucideFileText],
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
            class="flex items-center gap-2 py-1 px-2 rounded hover:bg-border cursor-pointer text-sm"
            [class.bg-border]="selectionService.selectedNode()?.id === node.id"
            (click)="onNodeClick(node)"
            (contextmenu)="contextMenu.open(node, $event)"
          >
            <svg
              *ngIf="node.type === 'folder'"
              class="w-4 h-4 shrink-0"
              [class.text-terracotta]="node.type === 'folder'"
              [class.text-ink]="node.type === 'note'"
              [class.opacity-60]="node.type === 'note'"
            ></svg>
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
    if (node.type === 'note') this.selectionService.select(node);
  }

  onDragStart(event: DragEvent, node: TreeNode) {
    event.stopPropagation();
    event.dataTransfer?.setData('text/plain', node.id);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, target: TreeNode) {
    event.preventDefault();
    event.stopPropagation();
    const draggedId = event.dataTransfer?.getData('text/plain');
    if (!draggedId || draggedId === target.id) return;
    if (target.type === 'folder') this.nodesService.move(draggedId, target.id);
  }
}
