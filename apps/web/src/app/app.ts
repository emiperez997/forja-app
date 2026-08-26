import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalComponent } from './components/modal/modal';
import { ContextMenuComponent } from './components/context-menu/context-menu';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ModalComponent, ContextMenuComponent, ConfirmModalComponent],
  template: `
    <router-outlet />
    <app-modal />
    <app-context-menu />
    <app-confirm-modal />
  `,
})
export class App {}
