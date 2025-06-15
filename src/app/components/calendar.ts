import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule],
  template: `
    <div class="dashboard-section calendar">
      <div class="dashboard-title">Kalendarz</div>
      <div class="dashboard-value">{{ date() }}</div>
      <div class="calendar-year">
        @for (row of calendarRows; track row) {
          <div class="calendar-row">
            @for (cal of row; track cal.month) {
              <div class="calendar-month">
                <div class="calendar-month-title">{{ cal.month }}</div>
                <div class="calendar-grid">
                  @for (day of weekDays; track day) {
                    <div class="calendar-header">{{ day }}</div>
                  }
                  @for (_ of cal.padding; track $index) {
                    <div class="calendar-cell empty"></div>
                  }
                  @for (day of cal.days; track day) {
                    <div 
                      class="calendar-cell" 
                      [ngClass]="isToday(getMonthIndex(row, cal), day) ? 'calendar-today' : ''"
                    >
                      {{ day }}
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .dashboard-section {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.07);
      padding: 1.5rem 2rem;
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
      font-size: 1.5rem;
      color: #0d4e8e;
      min-height: 2.5rem;
      margin-bottom: 1rem;
    }
    .calendar-year {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      justify-content: center;
      margin-top: 1rem;
    }
    .calendar-row {
      display: flex;
      flex-wrap: nowrap;
      gap: 3.5rem;
      justify-content: center;
    }
    .calendar-month {
      min-width: 220px;
      margin-bottom: 2rem;
    }
    .calendar-month-title {
      font-weight: bold;
      color: #0d4e8e;
      margin-bottom: 0.3rem;
      text-align: center;
    }
    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 2.2rem);
      gap: 0.2rem;
      margin-top: 0.5rem;
    }
    .calendar-header {
      font-weight: bold;
      color: #555;
      font-size: 0.95rem;
      text-align: center;
    }
    .calendar-cell {
      background: #f5f5f5;
      border-radius: 4px;
      padding: 0.3rem 0;
      text-align: center;
      font-size: 1rem;
      color: #333;
    }
    .calendar-cell.empty {
      background: transparent;
      pointer-events: none;
    }
    .calendar-today {
      background: #0d4e8e !important;
      color: #fff !important;
      font-weight: bold;
      border: 2px solid #0d4e8e;
    }
  `,
})
export class Calendar {
  private monthsPL = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];

  protected weekDays = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'];
  protected yearCalendars = signal(this.generateYearCalendar());
  protected date = signal(this.getCurrentDateString());
  protected calendarRows = this.computeCalendarRows();

  // Generate the calendar for the current year
  private generateYearCalendar(): { month: string, days: number[], padding: undefined[] }[] {
    const now = new Date();
    const year = now.getFullYear();
    const calendars = [];
    for (let month = 0; month < 12; month++) {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      let startDay = firstDay.getDay();
      startDay = (startDay === 0) ? 6 : startDay - 1;
      const padding = Array(startDay).fill(undefined);
      const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      calendars.push({ month: this.monthsPL[month] + ' ' + year, days, padding });
    }
    return calendars;
  }

  // Get the current date string in Polish
  private getCurrentDateString(): string {
    const now = new Date();
    return now.toLocaleDateString('pl-PL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  private computeCalendarRows(): { month: string, days: number[], padding: undefined[] }[][] {
    const arr = this.yearCalendars();
    const rows = [];
    for (let i = 0; i < arr.length; i += 4) {
      rows.push(arr.slice(i, i + 4));
    }
    return rows;
  }

  public getMonthIndex(row: { month: string, days: number[], padding: undefined[] }[], cal: { month: string, days: number[], padding: undefined[] }): number {
    const arr = this.yearCalendars();
    return arr.findIndex(m => m.month === cal.month);
  }

  public isToday(monthIndex: number, day: number): boolean {
    const today = new Date();
    return (
      today.getFullYear() === new Date().getFullYear() &&
      today.getMonth() === monthIndex &&
      today.getDate() === day
    );
  }
}
