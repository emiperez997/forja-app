import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmConfig, ConfirmService } from '../../core/confirm';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (confirmService.config(); as config) {
      <div
        class="fixed inset-0 bg-ink/30 flex items-center justify-center z-50"
        (click)="confirmService.close()"
      >
        <div
          class="bg-white rounded-lg shadow-lg w-full max-w-sm p-5"
          (click)="$event.stopPropagation()"
        >
          <h3 class="font-serif text-lg text-ink mb-2">{{ config.title }}</h3>
          <p class="text-sm text-ink/70 mb-5">{{ config.message }}</p>
          <div class="flex justify-end gap-2">
            <button
              (click)="confirmService.close()"
              class="px-3 py-1.5 text-sm rounded-md text-ink/60 hover:bg-border/50 transition"
            >
              Cancelar
            </button>
            <button
              (click)="confirm(config)"
              class="px-3 py-1.5 text-sm rounded-md text-white transition"
              [class.bg-terracotta]="!config.danger"
              [class.bg-red-600]="config.danger"
              [class.hover:opacity-90]="true"
            >
              {{ config.confirmLabel || 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmModalComponent {
  confirmService = inject(ConfirmService);

  confirm(config: ConfirmConfig | { onConfirm: () => void }) {
    config.onConfirm();
    this.confirmService.close();
  }
}
