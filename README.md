# NEM-tools
- http://nem-tools.com
- http://marc0olo.github.io/nem-tools

## provided tools
- automated restart of delegated harvesting
  - [read more](https://steemit.com/nem/@marc0o/nem-tools-automated-restart-of-delegated-harvesting)
- calculator for vested XEM balance
- transaction overview (incl. harvested blocks and csv-export)
- account information
- list of all supernodes
  - and show which ones have free slots ;-)
- buying XEM via changelly
- collection of useful links

## feel free to give me a few XEM or other mosaics :-)
- NBEZ5S43KR7KXPPLW26TK4JPKC6U2GFM6AI6XF6U

## components used

- [NEMLibrary.com](https://nemlibrary.com):
- [Angular](https://angular.io/):
- [Materialize](http://materializecss.com/):

## development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

To get help on the Angular Material, checkout the [official docs](https://material.angular.io)

## publish into github pages

Dev dependencies

`npm install -g angular-cli-ghpages`

Build the application
`ng build --prod --aot --base-href "https://nem-tools.com"`

Upload to github pages
`ngh`
