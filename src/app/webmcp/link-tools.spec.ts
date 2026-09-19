import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { callRegisteredTool, installMockModelContext, registeredTools } from './model-context';
import { provideLinkWebMcpTools } from './link-tools';

describe('narzedzia WebMCP', () => {
  beforeEach(() => {
    installMockModelContext();
    TestBed.configureTestingModule({ providers: [provideLinkWebMcpTools()] });
    // Wymusza utworzenie environment injectora, a wraz z nim rejestracje narzedzi.
    TestBed.inject(Injector);
  });

  it('rejestruje narzedzia w modelContext', () => {
    expect(registeredTools().map((tool) => tool.name)).toEqual([
      'listLinkCategories',
      'searchLinks',
      'openLink',
    ]);
  });

  it('listLinkCategories zwraca kategorie', async () => {
    const result = (await callRegisteredTool('listLinkCategories', {})) as string;
    expect(result).toContain('Finanse i bankowosc');
  });

  it('searchLinks znajduje link po nazwie', async () => {
    const result = (await callRegisteredTool('searchLinks', { query: 'mbank' })) as string;
    expect(result).toContain('https://online.mbank.pl/pl/Login');
    expect(result).toContain('[Finanse i bankowosc]');
  });

  it('searchLinks ignoruje polskie znaki diakrytyczne', async () => {
    const result = (await callRegisteredTool('searchLinks', { query: 'wroclaw' })) as string;
    expect(result).toContain('Radio Wroc');
  });

  it('searchLinks zaweza wyniki przez category', async () => {
    const result = (await callRegisteredTool('searchLinks', { query: 'http', category: 'Muzyka' })) as string;
    expect(result).toContain('YouTube Music');
    expect(result).not.toContain('mBank');
  });

  it('searchLinks respektuje maxResults', async () => {
    const result = (await callRegisteredTool('searchLinks', { query: 'http', maxResults: 3 })) as string;
    expect(result).toContain('(...');
  });

  it('searchLinks odrzuca bledny typ argumentu', async () => {
    await expectAsync(callRegisteredTool('searchLinks', { query: 42 })).toBeRejectedWithError(/niepustym tekstem/);
  });

  it('openLink zglasza nieznana nazwe', async () => {
    const result = (await callRegisteredTool('openLink', { label: 'nie-ma-takiego' })) as string;
    expect(result).toContain('Nie znaleziono');
  });
});
