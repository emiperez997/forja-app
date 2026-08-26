import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodesService } from '../../core/nodes.service';
import { SelectionService } from '../../core/selection.service';
import { AuthService } from '../../core/auth';
import { TreeComponent } from '../../components/tree/tree.component';
import { EditorComponent } from '../../components/editor/editor.component';
import { Subject, debounceTime } from 'rxjs';
import { ModalService } from '../../core/modal';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, TreeComponent, EditorComponent],
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
    // autoguardado con debounce de 800ms
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
