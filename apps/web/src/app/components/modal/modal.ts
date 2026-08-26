import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../core/modal';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (modalService.config(); as config) {
      <div
        class="fixed inset-0 bg-ink/30 flex items-center justify-center z-50"
        (click)="modalService.close()"
      >
        <div
          class="bg-white rounded-lg shadow-lg w-full max-w-sm p-5"
          (click)="$event.stopPropagation()"
        >
          <h3 class="font-serif text-lg text-ink mb-3">{{ config.title }}</h3>
          <input
            #inputRef
            [(ngModel)]="value"
            [placeholder]="config.placeholder"
            (keyup.enter)="confirm(config)"
            (keyup.escape)="modalService.close()"
            class="w-full px-3 py-2 rounded-md border border-border bg-white text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/40 mb-4"
          />
          <div class="flex justify-end gap-2">
            <button
              (click)="modalService.close()"
              class="px-3 py-1.5 text-sm rounded-md text-ink/60 hover:bg-border/50 transition"
            >
              Cancelar
            </button>
            <button
              (click)="confirm(config)"
              class="px-3 py-1.5 text-sm rounded-md bg-terracotta text-white hover:opacity-90 transition"
            >
              {{ config.confirmLabel || 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  modalService = inject(ModalService);
  value = '';

  constructor() {
    effect(() => {
      const config = this.modalService.config();
      this.value = config?.initialValue || '';
    });
  }

  confirm(config: { onConfirm: (value: string) => void }) {
    if (!this.value.trim()) return;
    config.onConfirm(this.value.trim());
    this.modalService.close();
    this.value = '';
  }
}
