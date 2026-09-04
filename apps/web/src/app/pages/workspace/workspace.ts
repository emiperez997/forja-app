import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  LucideTrash2,
  LucideLogOut,
  LucideFolderPlus,
  LucideFilePlus,
  LucideSearch,
  LucideHouse,
} from '@lucide/angular';
import { NodesService } from '../../core/nodes.service';
import { SelectionService } from '../../core/selection.service';
import { AuthService } from '../../core/auth.service';
import { ModalService } from '../../core/modal.service';
import { TreeComponent } from '../../components/tree/tree.component';
import { EditorComponent } from '../../components/editor/editor.component';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TreeComponent,
    EditorComponent,
    LucideTrash2,
    LucideLogOut,
    LucideFolderPlus,
    LucideFilePlus,
    LucideSearch,
    LucideHouse,
  ],
  templateUrl: './workspace.html',
})
export class WorkspaceComponent implements OnInit {
  private contentChange$ = new Subject<unknown>();

  constructor(
    public nodesService: NodesService,
    public selectionService: SelectionService,
    public authService: AuthService,
    private modalService: ModalService,
  ) {
    this.contentChange$.pipe(debounceTime(800)).subscribe((content) => {
      const node = this.selectionService.selectedNode();
      if (node) this.nodesService.updateContent(node.id, content);
    });
  }

  ngOnInit() {
    this.nodesService.load();
  }

  onContentChange(content: unknown) {
    this.contentChange$.next(content);
  }

  onDropToRoot(event: DragEvent) {
    event.preventDefault();
    const draggedId = event.dataTransfer?.getData('text/plain');
    if (draggedId) this.nodesService.move(draggedId, null);
  }

  createRootFolder() {
    this.modalService.open({
      title: 'Nueva carpeta',
      placeholder: 'Nombre de la carpeta',
      confirmLabel: 'Crear',
      onConfirm: (title) => this.nodesService.create('folder', title),
    });
  }

  createRootNote() {
    this.modalService.open({
      title: 'Nueva nota',
      placeholder: 'Título de la nota',
      confirmLabel: 'Crear',
      onConfirm: (title) => this.nodesService.create('note', title),
    });
  }
}
