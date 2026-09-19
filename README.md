# WichuHome

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Deploying to GitHub Pages

To deploy your Angular app to GitHub Pages, run:

```bash
npm run deploy
```

This will build the project and publish the contents of `dist/angular-playground/browser` to the `gh-pages` branch using [angular-cli-ghpages](https://github.com/angular-schule/angular-cli-ghpages).

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## WebMCP (eksperyment)

Aplikacja wystawia swoje zakladki agentom AI przez [WebMCP](https://angular.dev/ai/webmcp).
Zamiast klikac po DOM, agent wywoluje narzedzia zarejestrowane przez Angulara.

Narzedzia (`src/app/webmcp/link-tools.ts`, podpiete w `app.config.ts`):

| Narzedzie | Opis |
| --- | --- |
| `listLinkCategories` | lista kategorii zakladek |
| `searchLinks` | szukanie zakladek po nazwie/URL, z opcjonalna kategoria i limitem |
| `openLink` | otwarcie zakladki w nowej karcie |

Uwagi implementacyjne:

- API Angulara (`provideExperimentalWebMcpTools`, `declareExperimentalWebMcpTool`) jest
  oznaczone jako **experimental** - moze sie zmienic poza majorami.
- Angular **nie waliduje** argumentow wzgledem `inputSchema` i typuje je jako `unknown`;
  kazde `execute` sprawdza je samodzielnie.
- Rejestracja jest pomijana podczas SSR, a w przegladarce bez WebMCP konczy sie cicho -
  dlatego `src/app/webmcp/model-context.ts` instaluje wlasna atrape `document.modelContext`
  (tylko gdy przegladarka nie dostarcza prawdziwej implementacji).

### Panel testowy

Trasa `/webmcp` listuje zarejestrowane narzedzia i pozwala wywolac je recznie z argumentami
w formacie JSON - czyli zagrac role agenta bez zadnego modelu AI.
