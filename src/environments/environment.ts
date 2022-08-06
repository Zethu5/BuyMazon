// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
};

export const socket_port = 3210
export const socket_connection = `localhost:${socket_port}`

export const api_port = 3000
export const api_base = `http://localhost:${api_port}/api`

export const bing_api_key = 'AjgXD_JjhGykkDr6qICNbqtqQVuIttmBOO-ElRwrPrNGDaKi1VTVCg-Du2vaJVA2'

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
