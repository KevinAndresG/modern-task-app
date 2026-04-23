import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  readonly svc    = inject(ToastService);
  readonly toasts = this.svc.toasts;

  dismiss(id: number): void { this.svc.dismiss(id); }

  trackToast(_: number, toast: Toast): number { return toast.id; }
}
