# Button Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.20.

# This project was created with the following steps:
- Bootstrap multi-tenant project:
    ```
    ng new button-frontend --createApplication=false --directory=button-frontend --interactive=false
    cd button-frontend
    ng generate application app --style=scss --routing=true
    ```
- I didn't enable `ivy` since it's not supported `ng xi18n` in Angular8 yet:
- Override default schematics in `angular.json`:
    ```
    "schematics": {
            "@schematics/angular:component": {
              "flat": true,
              "style": "scss",
              "inlineTemplate": true,
              "inlineStyle": true,
              "viewEncapsulation": "None",
              "spec": false
            },
            "@schematics/angular:service": {
              "properties": {
                "spec": false,
                "skipTests": false
              }
            }
          },
    ```
- Add LazyLoaded modules
    ```
    ng generate module account --route account --module app.module
    ng generate module wyre --route wyre --module app.module
    ng generate module send --route send --module app.module
    ```
- Add example of lazy loaded js script in into `send` module `example.js`.
- Generated separate library for `hd-wallet` logic `ng generate library hd-wallet`
- Support translations:
    ```
    ng add @ngx-i18nsupport/tooling --i18nLocale=en --languages en,ru
    
    ng xi18n app --i18n-format xlf2 --output-path i18n --out-file messages.en.xlf --i18n-locale en
    ng xi18n app --i18n-format xlf2 --output-path i18n --out-file messages.ru.xlf --i18n-locale ru
    ```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
