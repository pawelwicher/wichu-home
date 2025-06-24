import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-clock',
  template: `
    <div class="dashboard-section clock">
      <div class="dashboard-date">{{ date() }}</div>
      <div class="dashboard-value">{{ time() }}</div>
    </div>
  `,
  styles: `
    .dashboard-section {
      text-align: center;
    }
    .dashboard-title {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }
    .dashboard-value {
      font-size: 5rem;
      color: var(--color-text-blue);
      min-height: 5rem;
      letter-spacing: 0.05em;
    }
    .dashboard-date {
      font-size: 1.5rem;
      margin-bottom: 1.2rem;
    }
  `
})
export class Clock implements OnInit, OnDestroy {
  protected time = signal('');
  protected date = signal('');
  private sub: Subscription | undefined;

  public ngOnInit(): void {
    this.updateTime();
    this.sub = interval(1000).subscribe(() => this.updateTime());
  }

  public ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  private updateTime(): void {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const mins = now.getMinutes().toString().padStart(2, '0');
    this.time.set(`${hours}:${mins}`);
    this.date.set(now.toLocaleDateString('pl-PL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }
}
