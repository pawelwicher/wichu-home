import { ChangeDetectionStrategy, Component, ElementRef, computed, signal, viewChild } from '@angular/core';
import { JsonSchema, RegisteredTool, callRegisteredTool, registeredTools } from '../webmcp/model-context';

@Component({
  selector: 'app-webmcp-panel',
  // Lista narzedzi powstaje dopiero po starcie aplikacji w przegladarce, wiec prerenderowany
  // HTML rozni sie od klienckiego - pomijamy hydratacje tego poddrzewa.
  host: { ngSkipHydration: '' },
  template: `
    <div class="panel">
      <h2>Panel WebMCP</h2>
      <p class="hint">
        Narzedzia zarejestrowane przez Angulara w <code>document.modelContext</code>.
        Ten panel wywoluje je recznie - tak, jak zrobilby to agent AI.
      </p>

      @if (tools().length === 0) {
        <p class="empty">Brak zarejestrowanych narzedzi. Sprawdz, czy atrapa modelContext zostala zainstalowana.</p>
      } @else {
        <div class="layout">
          <ul class="tool-list">
            @for (tool of tools(); track tool.name) {
              <li>
                <button type="button" [class.active]="tool.name === selectedName()" (click)="select(tool)">
                  {{ tool.name }}
                </button>
              </li>
            }
          </ul>

          <div class="detail">
            @if (selected(); as tool) {
              <p class="description">{{ tool.description }}</p>
              <label for="args">Argumenty (JSON)</label>
              <textarea id="args" #argsBox rows="8" spellcheck="false" [value]="argsSkeleton()"></textarea>
              <button type="button" class="invoke" [disabled]="busy()" (click)="invoke()">
                {{ busy() ? 'Wywoluje...' : 'Wywolaj narzedzie' }}
              </button>

              @if (error()) {
                <pre class="error">{{ error() }}</pre>
              }
              @if (result()) {
                <pre class="result">{{ result() }}</pre>
              }

              <details>
                <summary>inputSchema</summary>
                <pre class="schema">{{ schemaJson() }}</pre>
              </details>
            } @else {
              <p class="empty">Wybierz narzedzie z listy po lewej.</p>
            }
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .panel {
      padding: 1rem 0;
      max-width: 60rem;
    }
    h2 {
      color: var(--color-text-blue);
      margin: 0 0 0.5rem;
    }
    .hint {
      color: var(--color-calendar-header);
      margin: 0 0 1.5rem;
    }
    code {
      background: var(--color-calendar-cell-bg);
      padding: 0.1rem 0.3rem;
      border-radius: 3px;
    }
    .layout {
      display: grid;
      grid-template-columns: minmax(12rem, auto) 1fr;
      gap: 2rem;
      align-items: start;
    }
    .tool-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .tool-list button {
      width: 100%;
      text-align: left;
      font-family: inherit;
      font-size: inherit;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      background: var(--color-calendar-cell-bg);
      color: var(--color-text-dark);
      cursor: pointer;
    }
    .tool-list button:hover {
      border-color: var(--color-accent);
      color: var(--color-text-blue);
    }
    .tool-list button.active {
      background: var(--color-text-blue);
      border-color: var(--color-text-blue);
      color: var(--color-text-light);
    }
    .detail {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .description {
      margin: 0;
    }
    label {
      font-weight: bold;
      color: var(--color-calendar-header);
    }
    textarea {
      font-family: inherit;
      font-size: inherit;
      padding: 0.5rem;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      resize: vertical;
    }
    .invoke {
      align-self: start;
      font-family: inherit;
      font-size: inherit;
      padding: 0.5rem 1.25rem;
      border: none;
      border-radius: 4px;
      background: var(--color-accent);
      color: var(--color-text-light);
      cursor: pointer;
    }
    .invoke:disabled {
      opacity: 0.6;
      cursor: default;
    }
    pre {
      margin: 0;
      padding: 0.75rem;
      border-radius: 4px;
      white-space: pre-wrap;
      word-break: break-all;
      background: var(--color-calendar-cell-bg);
      border-left: 4px solid var(--color-border);
    }
    pre.result {
      border-left-color: var(--color-accent);
    }
    pre.error {
      border-left-color: #c62828;
      color: #c62828;
    }
    .empty {
      color: var(--color-calendar-header);
    }
    summary {
      cursor: pointer;
      color: var(--color-calendar-header);
    }
  `,
})
export class WebMcpPanel {
  private readonly argsBox = viewChild<ElementRef<HTMLTextAreaElement>>('argsBox');

  protected readonly tools = registeredTools;
  protected readonly selectedName = signal<string | null>(null);
  protected readonly busy = signal(false);
  protected readonly result = signal('');
  protected readonly error = signal('');

  protected readonly selected = computed(
    () => this.tools().find((tool) => tool.name === this.selectedName()) ?? null,
  );

  protected readonly schemaJson = computed(() => JSON.stringify(this.selected()?.inputSchema ?? {}, null, 2));

  /**
   * Szkielet argumentow zbudowany ze schematu. Zwiazany z `[value]` textarea, ale zmienia sie
   * tylko przy zmianie narzedzia - dzieki temu pisanie w polu nie przestawia kursora.
   */
  protected readonly argsSkeleton = computed(() => {
    const properties = this.selected()?.inputSchema.properties ?? {};
    const draft: Record<string, unknown> = {};
    for (const [key, schema] of Object.entries(properties)) {
      draft[key] = defaultForSchema(schema);
    }
    return JSON.stringify(draft, null, 2);
  });

  protected select(tool: RegisteredTool): void {
    this.selectedName.set(tool.name);
    this.result.set('');
    this.error.set('');
  }

  protected async invoke(): Promise<void> {
    const tool = this.selected();
    if (!tool) {
      return;
    }

    this.result.set('');
    this.error.set('');

    let args: unknown;
    try {
      args = JSON.parse(this.argsBox()?.nativeElement.value ?? '{}');
    } catch (cause) {
      this.error.set(`Niepoprawny JSON w argumentach: ${describe(cause)}`);
      return;
    }

    this.busy.set(true);
    try {
      const value = await callRegisteredTool(tool.name, args);
      this.result.set(typeof value === 'string' ? value : JSON.stringify(value, null, 2));
    } catch (cause) {
      this.error.set(describe(cause));
    } finally {
      this.busy.set(false);
    }
  }
}

function defaultForSchema(schema: JsonSchema): unknown {
  switch (schema.type) {
    case 'number':
    case 'integer':
      return 0;
    case 'boolean':
      return false;
    case 'array':
      return [];
    case 'object':
      return {};
    default:
      return '';
  }
}

function describe(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}
