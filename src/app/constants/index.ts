import { Protocol, AccountHttp, BlockHttp, ChainHttp, MosaicHttp, NamespaceHttp, NodeHttp, NEMLibrary, NetworkTypes } from "nem-library";
import { MatSnackBar } from "@angular/material";

NEMLibrary.bootstrap(NetworkTypes.MAIN_NET);

const https:Protocol = "https";

const httpsServerConfig = [
  /**
  {protocol: https, domain: "shibuya.supernode.me", port: 7891},
  {protocol: https, domain: "la.nemchina.com", port: 7891},
  {protocol: https, domain: "public.nemchina.com", port: 7891},
  {protocol: https, domain: "frankfurt.nemchina.com", port: 7891},
  {protocol: https, domain: "tokyo.nemchina.com", port: 7891},
  */
  {protocol: https, domain: "london.nemchina.com", port: 7891}
]

export const accountHttp = new AccountHttp(httpsServerConfig);
export const blockHttp = new BlockHttp(httpsServerConfig);
export const chainHttp = new ChainHttp(httpsServerConfig);
export const mosaicHttp = new MosaicHttp(httpsServerConfig);
export const namespaceHttp = new NamespaceHttp(httpsServerConfig);
export const nodeHttp = new NodeHttp(httpsServerConfig);

export const joda = require('js-joda');

export const csvOptions = { 
  fieldSeparator: ',',
  quoteStrings: '"',
  decimalseparator: '.',
  showLabels: true, 
  showTitle: false,
  useBom: true,
  noDownload: false,
  headers: ["tx-type", "block","importance-mode", "xem-fee", "xem-amount", "mosaic (amount)", "sender", "recipient", "message", "date", "timestamp", "hash"]
};

export const csvOptionsHarvesting = { 
  fieldSeparator: ',',
  quoteStrings: '"',
  decimalseparator: '.',
  showLabels: true, 
  showTitle: false,
  useBom: true,
  noDownload: false,
  headers: ["block", "timestamp","date", "xem-amount", "recipient"]
};

export const isNumber = (o) => {
  return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
}

export const formatValue = (value: any) => {
  return value !== undefined && isNumber(value) ? (value / 1000000).toString() : '';
}

export const snackBarMsg = (instance: MatSnackBar, msg: string, action: string) => {
  instance.open(msg, action, {
    duration: 3000
  });
}