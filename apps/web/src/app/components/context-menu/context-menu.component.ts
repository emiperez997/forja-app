import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, FilePlus, FolderPlus, Pencil, Trash2 } from 'lucide-angular';
import { ContextMenuService } from '../../core/context-menu.service';
import { NodesService } from '../../core/nodes.service';
import { ModalService } from '../../core/modal.service';
import { ConfirmService } from '../../core/confirm.service';
import { SelectionService } from '../../core/selection.service';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    @if (menu.state(); as state) {
      <div
        class="fixed inset-0 z-40"
        (click)="menu.close()"
        (contextmenu)="$event.preventDefault(); menu.close()"
      ></div>
      <div
        class="fixed z-50 bg-white border border-border rounded-md shadow-lg py-1 text-sm min-w-[190px]"
        [style.left.px]="state.x"
        [style.top.px]="state.y"
      >
        @if (state.node.type === 'folder') {
          <button
            (click)="newNoteInside(state)"
            class="w-full flex items-center gap-2 text-left px-3 py-1.5 hover:bg-border/50"
          >
            <lucide-icon [img]="FilePlus" class="w-3.5 h-3.5" /> Nueva nota adentro
          </button>
          <button
            (click)="newFolderInside(state)"
            class="w-full flex items-center gap-2 text-left px-3 py-1.5 hover:bg-border/50"
          >
            <lucide-icon [img]="FolderPlus" class="w-3.5 h-3.5" /> Nueva carpeta adentro
          </button>
          <div class="border-t border-border my-1"></div>
        }
        <button
          (click)="rename(state)"
          class="w-full flex items-center gap-2 text-left px-3 py-1.5 hover:bg-border/50"
        >
          <lucide-icon [img]="Pencil" class="w-3.5 h-3.5" /> Renombrar
        </button>
        <button
          (click)="remove(state)"
          class="w-full flex items-center gap-2 text-left px-3 py-1.5 hover:bg-red-50 text-red-600"
        >
          <lucide-icon [img]="Trash2" class="w-3.5 h-3.5" /> Eliminar
        </button>
      </div>
    }
  `,
})
export class ContextMenuComponent {
  menu = inject(ContextMenuService);
  private nodesService = inject(NodesService);
  private modalService = inject(ModalService);
  private confirmService = inject(ConfirmService);
  private selectionService = inject(SelectionService);

  readonly FilePlus = FilePlus;
  readonly FolderPlus = FolderPlus;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;

  newNoteInside(state: { node: { id: string } }) {
    this.menu.close();
    this.modalService.open({
      title: 'Nueva nota',
      placeholder: 'Título de la nota',
      confirmLabel: 'Crear',
      onConfirm: (title) => this.nodesService.create('note', title, state.node.id),
    });
  }

  newFolderInside(state: { node: { id: string } }) {
    this.menu.close();
    this.modalService.open({
      title: 'Nueva carpeta',
      placeholder: 'Nombre de la carpeta',
      confirmLabel: 'Crear',
      onConfirm: (title) => this.nodesService.create('folder', title, state.node.id),
    });
  }

  rename(state: { node: { id: string; title: string } }) {
    this.menu.close();
    this.modalService.open({
      title: 'Renombrar',
      placeholder: 'Nuevo nombre',
      initialValue: state.node.title,
      confirmLabel: 'Guardar',
      onConfirm: (title) => this.nodesService.rename(state.node.id, title),
    });
  }

  remove(state: { node: { id: string; type: string; title: string } }) {
    this.menu.close();
    const isFolder = state.node.type === 'folder';

    this.confirmService.open({
      title: isFolder ? 'Eliminar carpeta' : 'Eliminar nota',
      message: isFolder
        ? `Se va a eliminar "${state.node.title}" y todo lo que tiene adentro. Esta acción no se puede deshacer.`
        : `Se va a eliminar "${state.node.title}". Esta acción no se puede deshacer.`,
      confirmLabel: 'Eliminar',
      danger: true,
      onConfirm: () => {
        this.nodesService.remove(state.node.id);
        if (this.selectionService.selectedNode()?.id === state.node.id) {
          this.selectionService.clear();
        }
      },
    });
  }
}
