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
import Highlight from '@tiptap/extension-highlight';
import { BubbleMenu } from '@tiptap/extension-bubble-menu';
import {
  LucideAngularModule,
  Image as ImageIcon,
  Bold,
  Italic,
  Strikethrough,
  Highlighter,
  Heading1,
  Heading2,
  Quote,
  List,
  ListOrdered,
} from 'lucide-angular';
import { UploadService } from '../../core/upload.service';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="flex items-center gap-1 mb-2 border-b border-border pb-2">
      <button
        type="button"
        (click)="triggerImagePicker()"
        title="Insertar imagen"
        class="p-1.5 rounded hover:bg-border/50 text-ink/70"
      >
        <lucide-icon [img]="ImageIcon" class="w-4 h-4" />
      </button>
      <input
        #fileInput
        type="file"
        accept="image/*"
        class="hidden"
        (change)="onFileSelected($event)"
      />
    </div>

    <div #editorContainer class="prose max-w-none font-serif"></div>

    <div
      #bubbleMenu
      class="flex items-center gap-0.5 bg-ink text-white rounded-md shadow-lg p-1"
      style="visibility: hidden;"
    >
      <button type="button" (click)="toggleBold()" title="Negrita" class="p-1.5 rounded hover:bg-white/20">
        <lucide-icon [img]="Bold" class="w-3.5 h-3.5" />
      </button>
      <button type="button" (click)="toggleItalic()" title="Cursiva" class="p-1.5 rounded hover:bg-white/20">
        <lucide-icon [img]="Italic" class="w-3.5 h-3.5" />
      </button>
      <button type="button" (click)="toggleStrike()" title="Tachado" class="p-1.5 rounded hover:bg-white/20">
        <lucide-icon [img]="Strikethrough" class="w-3.5 h-3.5" />
      </button>
      <button type="button" (click)="toggleHighlight()" title="Resaltar" class="p-1.5 rounded hover:bg-white/20">
        <lucide-icon [img]="Highlighter" class="w-3.5 h-3.5" />
      </button>
      <div class="w-px h-4 bg-white/20 mx-0.5"></div>
      <button type="button" (click)="toggleHeading(1)" title="Título 1" class="p-1.5 rounded hover:bg-white/20">
        <lucide-icon [img]="Heading1" class="w-3.5 h-3.5" />
      </button>
      <button type="button" (click)="toggleHeading(2)" title="Título 2" class="p-1.5 rounded hover:bg-white/20">
        <lucide-icon [img]="Heading2" class="w-3.5 h-3.5" />
      </button>
      <button type="button" (click)="toggleQuote()" title="Cita" class="p-1.5 rounded hover:bg-white/20">
        <lucide-icon [img]="Quote" class="w-3.5 h-3.5" />
      </button>
      <button type="button" (click)="toggleBulletList()" title="Lista" class="p-1.5 rounded hover:bg-white/20">
        <lucide-icon [img]="List" class="w-3.5 h-3.5" />
      </button>
      <button type="button" (click)="toggleOrderedList()" title="Lista numerada" class="p-1.5 rounded hover:bg-white/20">
        <lucide-icon [img]="ListOrdered" class="w-3.5 h-3.5" />
      </button>
    </div>
  `,
})
export class EditorComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('editorContainer') editorContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('bubbleMenu') bubbleMenuEl!: ElementRef<HTMLDivElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Input() content: unknown = {};
  @Output() contentChange = new EventEmitter<unknown>();

  readonly ImageIcon = ImageIcon;
  readonly Bold = Bold;
  readonly Italic = Italic;
  readonly Strikethrough = Strikethrough;
  readonly Highlighter = Highlighter;
  readonly Heading1 = Heading1;
  readonly Heading2 = Heading2;
  readonly Quote = Quote;
  readonly List = List;
  readonly ListOrdered = ListOrdered;

  private editor?: Editor;

  constructor(private uploadService: UploadService) {}

  ngAfterViewInit() {
    this.editor = new Editor({
      element: this.editorContainer.nativeElement,
      extensions: [
        StarterKit,
        Image,
        Highlight,
        BubbleMenu.configure({
          element: this.bubbleMenuEl.nativeElement,
          shouldShow: ({ state }) => !state.selection.empty,
        }),
      ],
      content: this.normalizeContent(this.content),
      editorProps: {
        handlePaste: (_view, event) => this.handleImageFiles(event.clipboardData?.files, event),
        handleDrop: (_view, event) => this.handleImageFiles(event.dataTransfer?.files, event),
      },
      onUpdate: ({ editor }) => {
        this.contentChange.emit(editor.getJSON());
      },
    });
  }

  private normalizeContent(content: unknown) {
    if (!content || (typeof content === 'object' && Object.keys(content).length === 0)) {
      return ''; // Tiptap acepta string vacío como documento en blanco
    }
    return content as any;
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

  triggerImagePicker() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.uploadAndInsert(file);
    (event.target as HTMLInputElement).value = '';
  }

  private handleImageFiles(files: FileList | null | undefined, event: ClipboardEvent | DragEvent): boolean {
    const images = Array.from(files ?? []).filter((f) => f.type.startsWith('image/'));
    if (!images.length) return false;

    event.preventDefault();
    images.forEach((file) => this.uploadAndInsert(file));
    return true;
  }

  private uploadAndInsert(file: File) {
    this.uploadService.uploadImage(file).subscribe({
      next: ({ url }) => this.insertImage(url),
      error: (err) => console.error('Error al subir la imagen:', err),
    });
  }

  toggleBold() {
    this.editor?.chain().focus().toggleBold().run();
  }

  toggleItalic() {
    this.editor?.chain().focus().toggleItalic().run();
  }

  toggleStrike() {
    this.editor?.chain().focus().toggleStrike().run();
  }

  toggleHighlight() {
    this.editor?.chain().focus().toggleHighlight().run();
  }

  toggleHeading(level: 1 | 2) {
    this.editor?.chain().focus().toggleHeading({ level }).run();
  }

  toggleQuote() {
    this.editor?.chain().focus().toggleBlockquote().run();
  }

  toggleBulletList() {
    this.editor?.chain().focus().toggleBulletList().run();
  }

  toggleOrderedList() {
    this.editor?.chain().focus().toggleOrderedList().run();
  }
}
