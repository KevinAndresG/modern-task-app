import { Component, inject, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder, FormGroup, FormArray,
  ReactiveFormsModule, Validators,
} from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss',
})
export class TaskModalComponent {
  private readonly fb          = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly toast       = inject(ToastService);

  readonly prefillDate  = input<{ date: string; seq: number } | null>(null);
  readonly taskCreated  = output<void>();
  readonly closed       = output<void>();

  readonly isSubmitting = signal<boolean>(false);
  readonly isVisible    = signal<boolean>(false);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      title:       ['', Validators.required],
      description: ['', Validators.required],
      dueDate:     ['', Validators.required],
      notes: this.fb.array([this.fb.control('', Validators.required)]),
    });

    effect(() => {
      const d = this.prefillDate();
      if (d) {
        this.form.patchValue({ dueDate: d.date });
        this.isVisible.set(true);
      }
    });
  }

  get title()       { return this.form.get('title'); }
  get description() { return this.form.get('description'); }
  get dueDate()     { return this.form.get('dueDate'); }
  get notes()       { return this.form.get('notes') as FormArray; }

  addNote(): void             { this.notes.push(this.fb.control('', Validators.required)); }
  removeNote(i: number): void { if (this.notes.length > 1) this.notes.removeAt(i); }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.isSubmitting.set(true);
    const v = this.form.getRawValue();

    this.taskService.addTask({
      title:       v.title,
      description: v.description,
      dueDate:     v.dueDate,
      completed:   false,
      notes:       v.notes.filter((n: string) => n.trim() !== ''),
    });

    this.toast.success('Task created');
    this.taskCreated.emit();
    this.close();
    this.isSubmitting.set(false);
  }

  close(): void {
    this.isVisible.set(false);
    this.form.reset();
    this.resetNotes();
    this.form.markAsUntouched();
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close();
    }
  }

  private resetNotes(): void {
    while (this.notes.length > 1) this.notes.removeAt(1);
    this.notes.at(0).reset('');
  }
}
