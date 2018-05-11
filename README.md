# NEM-tools
- https://nem-tools.com
- https://marc0olo.github.io/nem-tools

# official thread in the NEM forum
- https://forum.nem.io/t/nem-tools-com-automated-delegated-harvesting-export-of-transactions-and-more

## provided tools
- account information
- full transaction history
  - ImportanceTransferTransactions
  - TransferTransactions (also those sent via MultiSig)
  - csv-export
- full harvesting history
  - csv-export
- harvesting
  - automated restart of delegated harvesting
    - [read more](https://steemit.com/nem/@marc0o/nem-tools-automated-restart-of-delegated-harvesting)
  - calculator for vested XEM balance
- list of all supernodes
  - and show which ones have free slots ;-)
- buying XEM
  - widget by changelly
- guestbook / wishing wall
  - widget by http://wishing-wall.surge.sh/
  - https://forum.nem.io/t/wishing-wall-donations-comments-ranked-by-amount-paid/

## feel free to give me a few XEM or other mosaics :-)
- NBEZ5S43KR7KXPPLW26TK4JPKC6U2GFM6AI6XF6U

## ... you can also leave some ETH or other ERC20s
- 0x7Ab1EF778d9fA0716E5F57f68B47529351D5eBaE

## built on Angular, ngrx and Angular Material Starter 
provided by [@tomastrajan](https://twitter.com/tomastrajan) and released under [![license](https://img.shields.io/github/license/tomastrajan/angular-ngrx-material-starter.svg)](https://github.com/tomastrajan/angular-ngrx-material-starter/blob/master/LICENSE)

## commands for development
  * `npm start` - starts a dev server and opens browser with running app
  * `npm run test` - runs lint and tests
  * `npm run watch` - runs tests in watch mode
  * `npm run prod` - runs full prod build and serves prod bundle
  * `npm run prettier` - runs prettier to format whole code base (`.ts` and `.scss`) 
  * `npm run analyze` - runs full prod build and `webpack-bundle-analyzer` to visualize how much code is shipped (dependencies & application)

## https nodes that could be used for connection-pool
### currently only using london.nemchina due to pagination issues with connection pool
- https://shibuya.supernode.me:7891/node/extended-info
- https://la.nemchina.com:7891/node/extended-info
- https://public.nemchina.com:7891/node/extended-info
- https://frankfurt.nemchina.com:7891/node/extended-info
- https://tokyo.nemchina.com:7891/node/extended-info
- https://london.nemchina.com:7891/node/extended-info