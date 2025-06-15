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
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
      padding: 2rem 2rem;
      min-width: 220px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .dashboard-title {
      font-size: 1.1rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
      color: #222;
    }
    .dashboard-value {
      font-size: 5rem;
      color: #0d4e8e;
      min-height: 5rem;
      font-family: 'Consolas', monospace;
      letter-spacing: 0.05em;
    }
    .dashboard-date {
      font-size: 1.5rem;
      color: #222;
      margin-bottom: 1.2rem;
      font-weight: 500;
    }
  `,
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
