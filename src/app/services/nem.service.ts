import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs';
import { State } from '@ngrx/store';
import { accountHttp, formatValue, joda } from '@app/constants';
import { Address, TransferTransaction, MultisigTransaction, ImportanceTransferTransaction, Transaction, PlainMessage, ImportanceMode, EncryptedMessage, AccountHarvestInfo } from 'nem-library';
import { TransactionOutput } from '@app/classes/TransactionOutput';
import nem from 'nem-sdk';
import { HarvestingOutput } from '@app/classes/HarvestingOutput';

export interface Supernode {
    active: boolean;
    alias: string;
    freeSlots: number;
    host: string;
    slotsAvailable: number;
    slotsUsed: number;
    syncDate: number;
}

@Injectable()
export class NemService {
    private baseUrl: string;
    private pathRegisterHarvesting: string;
    private pathGetSupernodes: string;

    supernodes: Observable<Supernode[]>;
    transactions: Observable<any>;
    harvestingTransactions: Observable<any>;
    private _supernodes: BehaviorSubject<Supernode[]>;
    private _transactions: BehaviorSubject<any>;
    private _harvestingTransactions: BehaviorSubject<any>;
    private dataStore: {
        supernodes: Supernode[]
        transactions: any[];
        harvestingTransactions: any[];
    };

    constructor(private http:HttpClient, private state: State<any>) {
        this.baseUrl = 'https://nem-services.herokuapp.com/';
        this.pathRegisterHarvesting = "harvesting/register";
        this.pathGetSupernodes = "supernodes";

        this.dataStore = {
            supernodes: [],
            transactions: [],
            harvestingTransactions: []
        };

        this._supernodes = <BehaviorSubject<Supernode[]>>new BehaviorSubject([]);
        this.supernodes = this._supernodes.asObservable();

        this._transactions = new BehaviorSubject([]);
        this.transactions = this._transactions.asObservable();

        this._harvestingTransactions = new BehaviorSubject([]);
        this.harvestingTransactions = this._harvestingTransactions.asObservable();
    }

    init() {
        this.loadSupernodes();
    }

    registerForHarvesting(email: string, publicKeyDelegated: string, privateKeyDelegated: string): Observable<Object> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
            params: new HttpParams()
                        .set('email', email)
                        .set('publicKeyDelegated', publicKeyDelegated)
                        .set('privateKeyDelegated', privateKeyDelegated)
        };
        return this.http.post(this.baseUrl + this.pathRegisterHarvesting, null, httpOptions);
    }

    loadSupernodes() {
        console.log("loading supernodes");
        this.http.get<Supernode[]>(`${this.baseUrl + this.pathGetSupernodes}`).subscribe(data => {
            this.dataStore.supernodes = data;
            this._supernodes.next(Object.assign({}, this.dataStore).supernodes);
        }, error => console.log(error));
    }

    loadLastTransactions() {
        console.log("loading last transactions");
        let skippedTransactions: Transaction[] = [];
        let address = new Address(this.getNemAddress());
        accountHttp.allTransactions(address, {pageSize: 25}).subscribe(x => {
            x.forEach((tx) => {
                if (!this.handleTransaction(tx)) {
                    skippedTransactions.push(tx);
                }
            });
        }, err => {
            console.log(err);
        }, () => {
            this._transactions.next(Object.assign({}, this.dataStore).transactions);
            console.log(this.dataStore.transactions.length + " transactions loaded");
            console.log(skippedTransactions.length + " transactions skipped (type currently not supported)");
            console.log(skippedTransactions);
        });
        console.log("loading last harvesting transactions");
        accountHttp.getHarvestInfoDataForAnAccount(address).subscribe(x => {
            x.forEach((element) => {
                // console.log(element);
                this.dataStore.harvestingTransactions.push(this.transformHarvestedTransaction(element));
            });
        }, err => {
            console.log(err);
        }, () => {
            this._harvestingTransactions.next(Object.assign({}, this.dataStore).harvestingTransactions);
            console.log(this.dataStore.harvestingTransactions.length +  " harvesting-transactions loaded");
        });
    }

    loadAllTransactions() {
        console.log("loading all transactions");
        let skippedTransactions: Transaction[] = [];
        let address = new Address(this.getNemAddress());
        let pagedTransactions = accountHttp.allTransactionsPaginated(address);
        pagedTransactions.subscribe(x => {
            x.forEach((tx) => {
                if (!this.handleTransaction(tx)) {
                    skippedTransactions.push(tx);
                }
            });
            pagedTransactions.nextPage();
        }, err => {
            console.log(err);
        }, () => {
            this._transactions.next(Object.assign({}, this.dataStore).transactions);
            console.log(skippedTransactions.length + " transactions skipped (type currently not supported)");
            console.log(skippedTransactions);
        });
        console.log("loading all harvesting transactions");
        let pagedHarvestingTransactions = accountHttp.getHarvestInfoDataForAnAccountPaginated(address);
        pagedHarvestingTransactions.subscribe( x => {
            x.forEach((element) => {
                // console.log(element);
                this.dataStore.harvestingTransactions.push(this.transformHarvestedTransaction(element));
            });
            pagedHarvestingTransactions.nextPage();
        }, err => {
            console.log(err);
        }, () => {
            this._harvestingTransactions.next(Object.assign({}, this.dataStore).harvestingTransactions);
            console.log(this.dataStore.harvestingTransactions.length +  " harvesting-transactions loaded");
        });
    }

    private handleTransaction(tx:Transaction) {
        if (tx.isConfirmed()) {
            if (tx instanceof TransferTransaction) {
                this.dataStore.transactions.push(this.transformTransaction(tx));
            } else if (tx instanceof MultisigTransaction) {
                if (tx.otherTransaction instanceof TransferTransaction) {
                    this.dataStore.transactions.push(this.transformTransaction(tx.otherTransaction));
                } else {
                    console.info("MultisigTransaction with type " + tx.constructor.name );
                    console.info(tx);
                    return false;
                }
            } else if ( tx instanceof ImportanceTransferTransaction ) {
                this.dataStore.transactions.push(this.transformTransaction(tx));
            } else {
                console.info(tx);
                return false;
            }
        }
        return true;
    }

    resetTransactions() {
        this.dataStore.transactions.length = 0;
        this.dataStore.harvestingTransactions.length = 0;
    }

    prettyPrintTimestamp = (timestamp:string) => {
        var date_past:any = new Date(timestamp);
        var date_now:any = new Date();
        
        var seconds = Math.floor((date_now - (date_past))/1000);
        var minutes = Math.floor(seconds/60);
        var hours = Math.floor(minutes/60);
        var days = Math.floor(hours/24);
            
        var hours = hours-(days*24);
        var minutes = minutes-(days*24*60)-(hours*60);
        var seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);
        
        if(days > 0) {
            if (hours > 0) {
            return this.formatUnitString(days," day") + this.formatUnitString(hours," hr") + "ago";
            } else {
            return this.formatUnitString(days," day") + this.formatUnitString(minutes," min") + "ago";
            }
        } else if (hours > 0) {
            if (minutes > 0) {
            return this.formatUnitString(hours," hr") + this.formatUnitString(minutes," min") + "ago";
            }
            return this.formatUnitString(hours," hr") + this.formatUnitString(seconds," sec") + " ago";
        } else if (minutes > 0) {
            if (seconds > 0) {
            return this.formatUnitString(minutes," min") + this.formatUnitString(seconds," sec") + "ago";
            }
            return this.formatUnitString(minutes," min") + "ago";
        } else {
            return this.formatUnitString(seconds," sec") + "ago";
        }
    }

    getFormattedDate(timestamp) {
        return new Date(timestamp).toUTCString();
        //return new Date(timestamp).toString();
    }

    get

    private formatUnitString(unit, singleString) {
        if(unit > 1) {
            return unit + singleString + "(s) ";
        }
        return unit + singleString + " ";
    }

    private transformTransaction(transaction: Transaction) {
        // console.log(transaction);
        let transformedTx = new TransactionOutput();
        transformedTx.block = transaction.getTransactionInfo().height.toString();
        transformedTx.sender = transaction.signer.address.pretty();
        if ( transaction instanceof TransferTransaction ) {
            transformedTx.type = "TransferTransaction";
            try {
            transformedTx.xem = transaction.xem().amount.toString();
            } catch (err) {
            // console.log(transaction);
            transformedTx.mosaics = '';
            transaction.mosaics().forEach( (mosaic) => {
                transformedTx.mosaics += formatValue(mosaic.quantity) + " (" + mosaic.mosaicId.namespaceId +':' + mosaic.mosaicId.name  + ')\n';
            });
            }
            transformedTx.recipient = transaction.recipient.pretty();
            if ( transaction.message instanceof PlainMessage ) {
                transformedTx.message = nem.utils.format.hexToUtf8(transaction.message.payload);
            }
            else if ( transaction.message instanceof EncryptedMessage ) {
                transformedTx.message = '[***encrypted***]'
            }
        }
        if ( transaction instanceof ImportanceTransferTransaction ) {
            transformedTx.type = "ImportanceTransferTransaction";
            transformedTx.recipient = transaction.remoteAccount.address.pretty();
            transformedTx.mode = this.getStringForImportanceMode(transaction.mode);
        }
        transformedTx.timestamp = joda.convert(transaction.timeWindow.timeStamp).toEpochMilli();
        transformedTx.date = transaction.timeWindow.timeStamp.toString();
        transformedTx.fee = formatValue(transaction.fee);
        transformedTx.hash = transaction.getTransactionInfo().hash.data;
        return transformedTx;
    }

    private transformHarvestedTransaction(harvestedBlock: AccountHarvestInfo) {
        // console.log(harvestedBlock);
        let transformedHarvestTx: HarvestingOutput = new HarvestingOutput();
        transformedHarvestTx.block = harvestedBlock.height;
        transformedHarvestTx.timestamp = this.getRealTimestamp(harvestedBlock.timeStamp);
        transformedHarvestTx.date = joda.LocalDateTime.ofInstant(joda.Instant.ofEpochMilli(transformedHarvestTx.timestamp)).toString();
        transformedHarvestTx.amount = formatValue(harvestedBlock.totalFee);
        transformedHarvestTx.recipient = this.getNemAddress();
        return transformedHarvestTx;
    }

    private getStringForImportanceMode(mode:ImportanceMode) {
        if (mode === ImportanceMode.Activate) {
          return "ACTIVATE";
        }
        return "DEACTIVATE";
      }

    formatXemAndOtherMosaics(xem:string, mosaics:string) {
        if ( xem !== undefined && xem !== "" ) {
          var formattedXem = xem + " (nem:xem)";
          if ( mosaics !== undefined && mosaics !== "" ) {
            return formattedXem + "\n" + mosaics;
          } else {
            return formattedXem;
          }
        } else if ( mosaics !== undefined && mosaics !== "" ) {
          return mosaics;
        }
        return "";
    }

    getRealTimestamp(secondsSinceNemesis) {
        // console.log(secondsSinceNemesis);
        let nemesis = Date.UTC(2015, 2, 29, 0, 6, 25);
        let o = secondsSinceNemesis;
        let t = nemesis + o * 1000;
        return t;
    }

    getNemAddress() {
        return this.state.getValue().settings.nemAddress;
    }
    
    isAddressConfigured() {
        return this.getNemAddress() !== null && this.getNemAddress() !== '';
    }
}