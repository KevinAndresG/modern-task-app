import { Component, input, output } from '@angular/core';

/**
 * Application header: logo block, task count pill, theme toggle.
 * Sticky header spanning full viewport width.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent {
  /** Total task count displayed in the pill */
  readonly taskCount = input.required<number>();

  /** Whether dark mode is active — drives toggle icon */
  readonly isDark = input.required<boolean>();

  /** Fires when user clicks theme toggle */
  readonly themeToggle = output<void>();
}
