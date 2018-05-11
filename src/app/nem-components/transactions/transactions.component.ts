import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import {
  Address,
  NEMLibrary,
  NetworkTypes,
  TransferTransaction,
  ImportanceTransferTransaction,
  PlainMessage,
  EncryptedMessage,
  MultisigTransaction,
  Mosaic,
  MosaicTransferable,
  XEM,
  ImportanceMode,
  Transaction,
  TransactionInfo,
  Protocol,
  AccountHttp
} from 'nem-library';
import nem from 'nem-sdk';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { accountHttp, joda, csvOptions, formatValue } from '@app/constants';
import { TransactionOutput } from '@app/classes/TransactionOutput';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { TransactionDetailDialogComponent } from '@app/nem-components/dialogs/transaction-detail-dialog/transaction-detail-dialog.component';
import { State } from '@ngrx/store';
import { NemService } from '@app/services/nem.service';
import { HarvestingOutput } from '@app/classes/HarvestingOutput';

@Component({
  selector: 'anms-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransactionsComponent implements OnInit, AfterViewInit, AfterViewChecked {

  transactionsArray: TransactionOutput[] = [];
  harvestingTransactionsArray: HarvestingOutput[] = [];
  displayedTransactionColumns = ['hash', 'block', 'date', 'from', 'in_out', 'to', 'amount', 'fee', 'message'];
  displayedHarvestingColumns = ['block', 'date', 'amount', 'recipient'];
  transactionTableOutput = new MatTableDataSource<TransactionOutput>();
  harvestingTableOutput = new MatTableDataSource<HarvestingOutput>();
  loading: boolean = false;
  harvestingLoading: boolean = false;
  transactionsLoading: boolean = false;

  @ViewChild('transactionPaginator') transactionPaginator: MatPaginator;
  @ViewChild('harvestingPaginator') harvestingPaginator: MatPaginator;

  constructor(public dialog: MatDialog, public _nemService: NemService, private cdr:ChangeDetectorRef) { }

  ngOnInit() {
    console.log(this._nemService.getNemAddress());
  }

  ngAfterViewInit() {
    this._nemService.transactions.subscribe( transactions => {
      this.transactionsArray = transactions;
      this.transactionTableOutput = new MatTableDataSource<TransactionOutput>(this.transactionsArray);
      this.transactionTableOutput.paginator = this.transactionPaginator;
      this.transactionsLoading = false;
      if (!this.harvestingLoading) {
        this.loading = false;
      }
      // console.log(JSON.stringify(this.transactionsArray));
    });
    this._nemService.harvestingTransactions.subscribe( harvestingTransactions => {
      this.harvestingTransactionsArray = harvestingTransactions;
      this.harvestingTableOutput = new MatTableDataSource<HarvestingOutput>(this.harvestingTransactionsArray);
      this.harvestingTableOutput.paginator = this.harvestingPaginator;
      this.harvestingLoading = false;
      if (!this.transactionsLoading) {
        this.loading = false;
      }
      // console.log(this.harvestingTransactionsArray);
      // console.log(JSON.stringify(this.harvestingTransactionsArray));
    });
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  _setDataSource(indexNumber) {
    setTimeout(() => {
      switch (indexNumber) {
        case 0:
          !this.transactionTableOutput.paginator ? this.transactionTableOutput.paginator = this.transactionPaginator : null;
          break;
        case 1:
          !this.harvestingTableOutput.paginator ? this.harvestingTableOutput.paginator = this.harvestingPaginator : null;
      }
    });
  }

  showDetail(transactionOutput: TransactionOutput) {
    const dialogRef = this.dialog.open(TransactionDetailDialogComponent, {
      data: {
        tx: transactionOutput
      }
    });
  }

  isRecipient(tx:TransactionOutput) {
    return this._nemService.getNemAddress() === tx.recipient;
  }

  getInOutText(tx:TransactionOutput) {
    if(tx.isImportanceTransaction()) {
      return tx.mode;
    } else {
      return this.isRecipient(tx) ? "IN" : "OUT";
    }
  }

  startLoading() {
    this.loading = true;
    this.harvestingLoading = true;
    this.transactionsLoading = true;
  }

  loadLastTransactions() {
    this.startLoading();
    this._nemService.resetTransactions();
    this._nemService.loadLastTransactions();
  }

  loadAllTransactions() {
    this.startLoading();
    this._nemService.resetTransactions();
    this._nemService.loadAllTransactions();
  }

  resetTransactions() {
    this._nemService.resetTransactions();
    this.transactionTableOutput = new MatTableDataSource<TransactionOutput>(this.transactionsArray);
    this.harvestingTableOutput = new MatTableDataSource<HarvestingOutput>(this.harvestingTransactionsArray);
    this.transactionTableOutput.paginator = this.transactionPaginator;
    this.harvestingTableOutput.paginator = this.harvestingPaginator;
  }

  getShortenedString(origString:string) {
    let length = 30;
    let shortenedString = origString.length > length ? origString.substring(0, length - 3) + "..." : origString;
    return shortenedString;
  }

  replaceLineBreaks(inputString: string) {
    return inputString.replace(/\n/g, "<br />");
  }

  exportTransactionHistory() {
    new Angular2Csv(JSON.parse(JSON.stringify(this.transactionsArray)), 'transaction-history', csvOptions);
  }

  exportHarvestingHistory() {
    new Angular2Csv(JSON.parse(JSON.stringify(this.harvestingTransactionsArray)), 'harvesting-history', csvOptions);
  }
}