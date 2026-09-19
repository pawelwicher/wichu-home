import { EnvironmentProviders, provideExperimentalWebMcpTools } from '@angular/core';
import { homeLinks } from '../models/home-links';

/** Usuwa polskie znaki diakrytyczne, zeby "wroclaw" trafial w "Wroclaw". */
function normalize(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

function assertString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Parametr "${field}" musi byc niepustym tekstem, otrzymano: ${JSON.stringify(value)}`);
  }
  return value;
}

/**
 * Narzedzia WebMCP wystawiajace zawartosc strony startowej agentowi AI.
 *
 * Zwracane sa zwykle stringi - `execute` moze zwrocic dowolna wartosc, ktora zostanie
 * zserializowana dla agenta. Angular NIE waliduje argumentow wzgledem `inputSchema`,
 * dlatego kazda funkcja sprawdza je sama.
 *
 * Funkcja opakowuje `provideExperimentalWebMcpTools`, bo literaly schematow musza byc
 * przekazane w miejscu wywolania - inaczej TypeScript rozszerzy je do `string` i straci
 * wnioskowanie typow argumentow w `execute`.
 */
export function provideLinkWebMcpTools(): EnvironmentProviders {
  return provideExperimentalWebMcpTools([
    {
      name: 'listLinkCategories',
      description:
        'Zwraca liste kategorii zakladek dostepnych na stronie startowej wraz z liczba linkow w kazdej z nich.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      execute: () =>
        homeLinks
          .map((group) => `${group.name} (${group.links.length} linkow)`)
          .join('\n'),
    },
    {
      name: 'searchLinks',
      description:
        'Wyszukuje zakladki po nazwie lub adresie URL. Zwraca pasujace linki wraz z kategoria. ' +
        'Uzyj, gdy uzytkownik pyta gdzie znajdzie dana strone, np. "gdzie mam link do banku".',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Szukana fraza, dopasowywana do nazwy linku i adresu URL.' },
          category: { type: 'string', description: 'Opcjonalne zawezenie do jednej kategorii, np. "Finanse i bankowosc".' },
          maxResults: { type: 'number', description: 'Maksymalna liczba wynikow. Domyslnie 10.' },
        },
        required: ['query'],
        additionalProperties: false,
      },
      execute: ({ query, category, maxResults }) => {
        // Argumenty od agenta sa typowane jako `unknown` - to my musimy je zwezic.
        if (maxResults !== undefined && typeof maxResults !== 'number') {
          throw new Error(`Parametr "maxResults" musi byc liczba, otrzymano: ${JSON.stringify(maxResults)}`);
        }

        const needle = normalize(assertString(query, 'query'));
        const categoryNeedle = category === undefined ? undefined : normalize(assertString(category, 'category'));
        const limit = maxResults ?? 10;

        const matches = homeLinks
          .filter((group) => categoryNeedle === undefined || normalize(group.name).includes(categoryNeedle))
          .flatMap((group) =>
            group.links
              .filter((link) => normalize(link.label).includes(needle) || normalize(link.url).includes(needle))
              .map((link) => `${link.label} - ${link.url} [${group.name}]`),
          );

        if (matches.length === 0) {
          return `Brak zakladek pasujacych do "${query}".`;
        }

        const shown = matches.slice(0, limit);
        const suffix = matches.length > shown.length ? `\n(... ${matches.length - shown.length} wiecej)` : '';
        return shown.join('\n') + suffix;
      },
    },
    {
      name: 'openLink',
      description:
        'Otwiera zakladke o podanej nazwie w nowej karcie przegladarki. ' +
        'Nazwe najlepiej najpierw potwierdzic narzedziem searchLinks.',
      inputSchema: {
        type: 'object',
        properties: {
          label: { type: 'string', description: 'Dokladna nazwa zakladki, np. "mBank".' },
        },
        required: ['label'],
        additionalProperties: false,
      },
      execute: ({ label }) => {
        const needle = normalize(assertString(label, 'label'));
        const found = homeLinks.flatMap((group) => group.links).filter((link) => normalize(link.label) === needle);

        if (found.length === 0) {
          return `Nie znaleziono zakladki o nazwie "${label}". Uzyj searchLinks, aby poznac dostepne nazwy.`;
        }
        if (found.length > 1) {
          return `Nazwa "${label}" jest niejednoznaczna - pasuje ${found.length} zakladek: ${found.map((l) => l.url).join(', ')}`;
        }

        const opened = window.open(found[0].url, '_blank', 'noopener');
        if (!opened) {
          return `Przegladarka zablokowala otwarcie okna. Adres do otwarcia recznie: ${found[0].url}`;
        }
        return `Otwarto "${found[0].label}" pod adresem ${found[0].url}.`;
      },
    },
  ]);
}
