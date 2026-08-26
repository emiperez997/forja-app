import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodesService } from '../../core/nodes.service';
import { SelectionService } from '../../core/selection.service';
import { AuthService } from '../../core/auth';
import { TreeComponent } from '../../components/tree/tree.component';
import { EditorComponent } from '../../components/editor/editor.component';
import { Subject, debounceTime } from 'rxjs';

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
    const title = prompt('Nombre de la carpeta:');
    if (title) this.nodesService.create('folder', title);
  }

  createRootNote() {
    const title = prompt('Título de la nota:');
    if (title) this.nodesService.create('note', title);
  }
}
