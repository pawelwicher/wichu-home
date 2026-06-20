import { Component, OnDestroy, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-clock',
  template: `
    <div class="watch-wrap">
      <div class="watch">
        <img class="case-img" src="gshock-watch.jpg" alt="Casio G-Shock GW-M5610" draggable="false" />
        <div class="overlay day-box">
          <span class="dseg seg14 day-txt"><i class="ghost">~~</i>{{ day() }}</span>
        </div>
        <div class="overlay date-box">
          <span class="dseg seg7 date-txt"><i class="ghost">{{ dateGhost() }}</i>{{ date() }}</span>
        </div>
        <div class="overlay time-box">
          <span class="dseg seg7 time-txt"><i class="ghost">88:88</i>{{ time() }}</span>
        </div>
        <div class="overlay secs-box">
          <span class="dseg seg7 secs-txt"><i class="ghost">88</i>{{ seconds() }}</span>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .watch-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      /* 100vh minus naglowek, stopka, marginesy i padding main */
      min-height: calc(100vh - 140px);
    }
    .watch {
      position: relative;
      width: 450px;
    }
    .case-img {
      display: block;
      width: 100%;
      user-select: none;
    }
    .overlay {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    /* procenty odpowiadaja wymazanym obszarom zdjecia 635x1000 */
    .day-box  { left: 38.58%; top: 40.30%; width:  8.82%; height: 3.90%; }
    .date-box { left: 50.08%; top: 40.30%; width: 18.11%; height: 3.90%; }
    .time-box { left: 32.28%; top: 47.30%; width: 25.04%; height: 6.40%; }
    .secs-box { left: 59.37%; top: 48.90%; width:  9.13%; height: 4.80%; }
    /* godzina i sekundy wyrownane do wspolnego dolu (53.70%) */
    .time-box, .secs-box { align-items: flex-end; }
    .time-txt, .secs-txt { transform-origin: bottom; }
    .dseg {
      position: relative;
      line-height: 1;
      font-style: italic;
      color: #20231e;
      text-shadow: 1px 1px 1px rgba(0,0,0,.15);
      white-space: nowrap;
    }
    .seg7  { font-family: 'DSEG7-Classic', monospace; }
    .seg14 { font-family: 'DSEG14-Classic', monospace; }
    .day-txt  { font-size: 26px;   font-weight: 700; transform: scaleY(1.06); }
    .date-txt { font-size: 25px;   font-weight: 700; transform: scaleY(1.06); }
    .time-txt { font-size: 33.5px; font-weight: 700; transform: scaleY(1.35); }
    .secs-txt { font-size: 25px;   font-weight: 700; transform: scaleY(1.2); }
    .ghost {
      position: absolute;
      left: 0;
      top: 0;
      opacity: .07;
      font-style: inherit;
      pointer-events: none;
      user-select: none;
      text-shadow: none;
    }
  `
})
export class Clock implements OnInit, OnDestroy {
  protected time = signal('');
  protected seconds = signal('');
  protected day = signal('');
  protected date = signal('');
  protected dateGhost = signal('');
  private sub: Subscription | undefined;

  private static readonly DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

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
    this.seconds.set(now.getSeconds().toString().padStart(2, '0'));
    this.day.set(Clock.DAYS[now.getDay()]);
    const date = `${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')}`;
    this.date.set(date);
    this.dateGhost.set(date.replace(/\d/g, '8'));
  }
}
