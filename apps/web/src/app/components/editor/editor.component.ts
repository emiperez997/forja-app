import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

@Component({
  selector: 'app-editor',
  standalone: true,
  template: `<div #editorContainer class="prose max-w-none font-serif"></div>`,
})
export class EditorComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('editorContainer') editorContainer!: ElementRef<HTMLDivElement>;
  @Input() content: unknown = {};
  @Output() contentChange = new EventEmitter<unknown>();

  private editor?: Editor;

  ngAfterViewInit() {
    this.editor = new Editor({
      element: this.editorContainer.nativeElement,
      extensions: [StarterKit, Image],
      content: this.content as any,
      onUpdate: ({ editor }) => {
        this.contentChange.emit(editor.getJSON());
      },
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // si cambia la nota seleccionada, reseteamos el contenido del editor
    if (changes['content'] && this.editor && !changes['content'].firstChange) {
      this.editor.commands.setContent(this.content as any, { emitUpdate: false });
    }
  }

  ngOnDestroy() {
    this.editor?.destroy();
  }

  insertImage(url: string) {
    this.editor?.chain().focus().setImage({ src: url }).run();
  }
}
