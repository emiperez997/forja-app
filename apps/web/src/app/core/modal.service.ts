import { Injectable, signal } from '@angular/core';

export interface ModalConfig {
  title: string;
  placeholder: string;
  initialValue?: string;
  confirmLabel?: string;
  onConfirm: (value: string) => void;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  config = signal<ModalConfig | null>(null);

  open(config: ModalConfig) {
    this.config.set(config);
  }

  close() {
    this.config.set(null);
  }
}
