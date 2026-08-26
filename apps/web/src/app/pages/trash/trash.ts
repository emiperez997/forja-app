import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  ArrowLeft,
  Folder,
  FileText,
  RotateCcw,
  Trash2,
} from 'lucide-angular';
import { NodesService } from '../../core/nodes.service';

@Component({
  selector: 'app-trash',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <div class="max-w-2xl mx-auto px-8 py-10">
      <div class="flex items-center justify-between mb-6">
        <h1 class="font-serif text-2xl text-ink">Papelera</h1>
        <a routerLink="/" class="flex items-center gap-1.5 text-sm text-terracotta hover:underline">
          <lucide-icon [img]="ArrowLeft" class="w-4 h-4" /> Volver
        </a>
      </div>

      @if (nodesService.trashNodes().length === 0) {
        <p class="text-ink/50 text-sm">La papelera está vacía.</p>
      }

      <ul class="space-y-1">
        @for (node of nodesService.trashNodes(); track node.id) {
          <li class="flex items-center justify-between py-2 px-3 rounded-md hover:bg-border/40">
            <span class="flex items-center gap-2 text-sm text-ink">
              <lucide-icon
                [img]="node.type === 'folder' ? Folder : FileText"
                class="w-4 h-4 opacity-60"
              />
              {{ node.title }}
            </span>
            <div class="flex gap-3">
              <button
                (click)="nodesService.restore(node.id)"
                class="flex items-center gap-1 text-xs text-terracotta hover:underline"
              >
                <lucide-icon [img]="RotateCcw" class="w-3.5 h-3.5" /> Restaurar
              </button>
              <button
                (click)="onDeletePermanent(node.id)"
                class="flex items-center gap-1 text-xs text-red-600 hover:underline"
              >
                <lucide-icon [img]="Trash2" class="w-3.5 h-3.5" /> Eliminar para siempre
              </button>
            </div>
          </li>
        }
      </ul>
    </div>
  `,
})
export class TrashComponent implements OnInit {
  nodesService = inject(NodesService);

  readonly ArrowLeft = ArrowLeft;
  readonly Folder = Folder;
  readonly FileText = FileText;
  readonly RotateCcw = RotateCcw;
  readonly Trash2 = Trash2;

  ngOnInit() {
    this.nodesService.loadTrash();
  }

  onDeletePermanent(id: string) {
    // acá podés engancharlo a tu ConfirmService, igual que en el menú contextual
    this.nodesService.removePermanent(id);
  }
}
