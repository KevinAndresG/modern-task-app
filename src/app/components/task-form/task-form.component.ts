import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly toast = inject(ToastService);

  readonly taskCreated = output<void>();
  readonly prefillDate = input<{ date: string; seq: number } | null>(null);
  readonly isSubmitting = signal<boolean>(false);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      notes: this.fb.array([this.fb.control('', Validators.required)], {
        validators: [Validators.minLength(1)],
      }),
    });

    toObservable(this.prefillDate)
      .pipe(filter((d): d is { date: string; seq: number } => !!d))
      .subscribe(({ date }) => {
        this.form.patchValue({ dueDate: date });
        this.toast.info(`Due date set to ${date}`);
      });
  }

  get title() {
    return this.form.get('title');
  }
  get description() {
    return this.form.get('description');
  }
  get dueDate() {
    return this.form.get('dueDate');
  }
  get notes() {
    return this.form.get('notes') as FormArray;
  }

  addNote(): void {
    this.notes.push(this.fb.control('', Validators.required));
  }
  removeNote(i: number): void {
    if (this.notes.length > 1) this.notes.removeAt(i);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const v = this.form.getRawValue();

    this.taskService.addTask({
      title: v.title,
      description: v.description,
      dueDate: v.dueDate,
      completed: false,
      notes: v.notes.filter((n: string) => n.trim() !== ''),
    });

    this.toast.success('Task created');
    this.taskCreated.emit();
    this.resetForm();
    this.isSubmitting.set(false);
  }

  resetForm(): void {
    this.form.reset({ notes: [''] });
    this.form.markAsUntouched();
  }
}
