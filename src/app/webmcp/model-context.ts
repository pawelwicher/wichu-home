import { signal } from '@angular/core';

/**
 * Minimalny opis narzedzia WebMCP - odpowiednik `WebMcpToolDescriptor` z @angular/core,
 * powtorzony lokalnie, bo typ generyczny schematu nie jest publicznie eksportowany.
 */
export interface RegisteredTool {
  name: string;
  description: string;
  inputSchema: JsonSchema;
  execute: (args: never, client: { signal: AbortSignal }) => unknown;
}

export interface JsonSchema {
  type?: string;
  description?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  additionalProperties?: boolean;
}

interface ModelContext {
  registerTool(tool: RegisteredTool, options?: { signal?: AbortSignal }): { unregister(): void };
}

const tools = signal<RegisteredTool[]>([]);

/** Lista narzedzi zarejestrowanych w mocku - zrodlo danych dla panelu /webmcp. */
export const registeredTools = tools.asReadonly();

/**
 * Instaluje atrape `document.modelContext` / `navigator.modelContext`.
 *
 * Angular rejestruje narzedzia przez `document.modelContext ?? navigator.modelContext`
 * i po cichu nic nie robi, gdy tego obiektu nie ma - bez tej atrapy demo byloby niewidoczne.
 * Nie nadpisujemy prawdziwej implementacji, gdyby przegladarka juz ja dostarczala.
 */
export function installMockModelContext(): void {
  if (typeof document === 'undefined') {
    return; // SSR / prerender - Angular i tak pomija rejestracje na serwerze
  }
  const host = document as Document & { modelContext?: ModelContext };
  const nav = navigator as Navigator & { modelContext?: ModelContext };
  if (host.modelContext || nav.modelContext) {
    return;
  }

  const modelContext: ModelContext = { registerTool };
  host.modelContext = modelContext;
  nav.modelContext = modelContext;
}

function registerTool(tool: RegisteredTool, options?: { signal?: AbortSignal }): { unregister(): void } {
  if (tools().some((registered) => registered.name === tool.name)) {
    throw new Error(`WebMCP: narzedzie o nazwie "${tool.name}" jest juz zarejestrowane.`);
  }

  tools.update((list) => [...list, tool]);
  const unregister = () => tools.update((list) => list.filter((registered) => registered !== tool));

  // Angular przekazuje AbortSignal powiazany z DestroyRef injectora - stad automatyczne sprzatanie.
  options?.signal?.addEventListener('abort', unregister, { once: true });

  return { unregister };
}

/** Wywoluje narzedzie tak, jak zrobilby to agent. Uzywane przez panel /webmcp. */
export async function callRegisteredTool(name: string, args: unknown): Promise<unknown> {
  const tool = tools().find((registered) => registered.name === name);
  if (!tool) {
    throw new Error(`WebMCP: nie znaleziono narzedzia "${name}".`);
  }

  const controller = new AbortController();
  return await tool.execute(args as never, { signal: controller.signal });
}
