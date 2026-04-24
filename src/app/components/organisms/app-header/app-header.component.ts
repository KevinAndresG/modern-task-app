import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent {
  readonly taskCount = input.required<number>();

  readonly isDark = input.required<boolean>();

  readonly themeToggle = output<void>();
}
