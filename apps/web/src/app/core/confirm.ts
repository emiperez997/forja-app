import { Injectable, signal } from '@angular/core';

export interface ConfirmConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean; // true = botón rojo, para acciones destructivas
  onConfirm: () => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  config = signal<ConfirmConfig | null>(null);

  open(config: ConfirmConfig) {
    this.config.set(config);
  }

  close() {
    this.config.set(null);
  }
}
