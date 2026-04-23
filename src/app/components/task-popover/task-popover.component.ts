import {
  Component, inject, input, output, signal, effect,
  PLATFORM_ID, ElementRef, viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';
import { PopoverState } from '../../app';

@Component({
  selector: 'app-task-popover',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-popover.component.html',
  styleUrl: './task-popover.component.scss',
})
export class TaskPopoverComponent {
  private readonly fb          = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly toast       = inject(ToastService);
  private readonly platformId  = inject(PLATFORM_ID);

  readonly state        = input<PopoverState | null>(null);
  readonly taskCreated  = output<void>();
  readonly closed       = output<void>();
  readonly moreOptions  = output<string>();

  readonly isVisible   = signal<boolean>(false);
  readonly posTop      = signal<number>(0);
  readonly posLeft     = signal<number>(0);
  readonly openUpward  = signal<boolean>(false);

  readonly isSubmitting = signal<boolean>(false);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      date:  ['', Validators.required],
    });

    effect(() => {
      const s = this.state();
      if (s) {
        this.form.patchValue({ date: s.date, title: '' });
        this.form.markAsUntouched();
        this.computePosition(s.rect);
        this.isVisible.set(true);
      } else {
        this.isVisible.set(false);
      }
    });
  }

  private computePosition(rect: DOMRect): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const popoverH = 260;
    const popoverW = 300;
    const margin   = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const spaceBelow = vh - rect.bottom;
    const goUp = spaceBelow < popoverH + margin && rect.top > popoverH + margin;
    this.openUpward.set(goUp);

    const top = goUp
      ? rect.top - popoverH - margin
      : rect.bottom + margin;

    let left = rect.left;
    if (left + popoverW > vw - margin) {
      left = vw - popoverW - margin;
    }
    if (left < margin) left = margin;

    this.posTop.set(top);
    this.posLeft.set(left);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isSubmitting.set(true);

    const { title, date } = this.form.getRawValue();

    this.taskService.addTask({
      title,
      description: title,
      dueDate:     date,
      completed:   false,
      notes:       [],
    });

    this.toast.success('Task created');
    this.taskCreated.emit();
    this.isSubmitting.set(false);
  }

  openMore(): void {
    const date = this.form.getRawValue().date;
    this.moreOptions.emit(date);
  }

  close(): void { this.closed.emit(); }

  get titleCtrl() { return this.form.get('title'); }
}
