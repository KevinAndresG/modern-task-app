import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

interface DonutSlice {
  state: string;
  label: string;
  count: number;
  color: string;
  glowColor: string;
  path: string;
  pct: number;
}

const STATE_META: Record<string, { label: string; color: string; glowColor: string }> = {
  new:      { label: 'New',      color: '#818cf8', glowColor: 'rgba(129,140,248,0.5)' },
  active:   { label: 'Active',   color: '#fbbf24', glowColor: 'rgba(251,191,36,0.5)'  },
  resolved: { label: 'Resolved', color: '#34d399', glowColor: 'rgba(52,211,153,0.5)'  },
  closed:   { label: 'Closed',   color: '#94a3b8', glowColor: 'rgba(148,163,184,0.5)' },
};

const STATES = ['new', 'active', 'resolved', 'closed'];

@Component({
  selector: 'app-task-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-stats.component.html',
  styleUrl: './task-stats.component.scss',
})
export class TaskStatsComponent {
  private readonly taskService = inject(TaskService);

  readonly hoveredState = signal<string | null>(null);

  private getTaskState(task: Task): string {
    const h = task.stateHistory;
    return h.length > 0 ? h[h.length - 1].state : 'new';
  }

  readonly statCounts = computed(() => {
    const counts: Record<string, number> = { new: 0, active: 0, resolved: 0, closed: 0 };
    for (const task of this.taskService.tasks()) {
      const state = this.getTaskState(task);
      if (state in counts) counts[state]++;
      else counts['new']++;
    }
    return counts;
  });

  readonly total = computed(() => this.taskService.tasks().length);

  readonly completionRate = computed(() => {
    const t = this.total();
    if (t === 0) return 0;
    const done = (this.statCounts()['resolved'] || 0) + (this.statCounts()['closed'] || 0);
    return Math.round((done / t) * 100);
  });

  readonly dueToday = computed(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return this.taskService.tasks().filter(t => {
      const state = this.getTaskState(t);
      return t.dueDate === todayStr && state !== 'resolved' && state !== 'closed';
    }).length;
  });

  readonly overdue = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.taskService.tasks().filter(t => {
      const state = this.getTaskState(t);
      if (state === 'resolved' || state === 'closed') return false;
      const due = new Date(t.dueDate + 'T00:00:00');
      return due < today;
    }).length;
  });

  readonly donutSlices = computed((): DonutSlice[] => {
    const total = this.total();
    const counts = this.statCounts();
    const cx = 70, cy = 70, r = 52, innerR = 34;
    let angle = -Math.PI / 2;
    const gap = 0.04;

    return STATES.map(state => {
      const meta = STATE_META[state];
      const count = counts[state] || 0;
      const pct = total > 0 ? count / total : 0;
      const sweep = pct * 2 * Math.PI;

      if (pct < 0.001) {
        return { state, ...meta, count, path: '', pct: 0 };
      }

      const startAngle = angle + gap / 2;
      const endAngle   = angle + sweep - gap / 2;
      angle += sweep;

      const x1  = cx + r * Math.cos(startAngle);
      const y1  = cy + r * Math.sin(startAngle);
      const x2  = cx + r * Math.cos(endAngle);
      const y2  = cy + r * Math.sin(endAngle);
      const ix1 = cx + innerR * Math.cos(startAngle);
      const iy1 = cy + innerR * Math.sin(startAngle);
      const ix2 = cx + innerR * Math.cos(endAngle);
      const iy2 = cy + innerR * Math.sin(endAngle);
      const largeArc = sweep - gap > Math.PI ? 1 : 0;

      const path = `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${ix2.toFixed(2)} ${iy2.toFixed(2)} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1.toFixed(2)} ${iy1.toFixed(2)} Z`;

      return { state, ...meta, count, path, pct: Math.round(pct * 100) };
    });
  });

  readonly statCards = computed(() =>
    STATES.map(state => ({
      state,
      ...STATE_META[state],
      count: this.statCounts()[state] || 0,
    }))
  );

  hoverSlice(state: string | null): void {
    this.hoveredState.set(state);
  }
}
