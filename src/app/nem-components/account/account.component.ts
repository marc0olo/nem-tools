import { Component, OnInit, Inject, Pipe } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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
  AccountHttp,
  AccountInfoWithMetaData,
  AccountInfo
} from 'nem-library';
import nem from 'nem-sdk';
import { accountHttp, formatValue } from '@app/constants';
import { DomSanitizer } from '@angular/platform-browser';
import { NemService } from '@app/services/nem.service';

@Component({
  selector: 'anms-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss',],
})
export class AccountComponent implements OnInit {

  private accountInfo: AccountInfoWithMetaData;
  loading: boolean = false;

  constructor(public dialog: MatDialog, public _nemService: NemService) { }

  ngOnInit() {
    // console.log(this._nemService.getNemAddress());
    if (this._nemService.getNemAddress() === null || this._nemService.getNemAddress() === '') {
      this.openDialog();
    } else {
      this.loadAccountInfo();
    }
  }

  openDialog(): void {
    this.dialog.open(NemAddressDialogComponent);
  }

  loadAccountInfo() {
    this.loading = true;
    let address = new Address(this._nemService.getNemAddress());
    accountHttp.getFromAddress(address).subscribe(x => {
      this.accountInfo = x;
    }, err => {
        console.log(err);
    }, () => {
        // console.log("account info loaded");
        // console.log(this.accountInfo);
        this.loading = false;
    });
  }

  formatValue(value: any) {
    return formatValue(value);
  }

  formatImportanceScore(value: any) {
    return nem.utils.format.nemImportanceScore(value) + " * 10^-4";
  }

  formatCosignatories(value: AccountInfo[]) {
    if ( value.length === 0) {
      return ""
    }
    var formattedString = '<ul style="margin:0px;padding-left:0;">';
    value.forEach(cosignatory => {
      formattedString = formattedString + '<li style="list-style-type:none;">';
      formattedString = formattedString + cosignatory.publicAccount.address.pretty();
      formattedString = formattedString + '</li>';
    });
    formattedString = formattedString + '</ul>';
    return formattedString;
  }
}

@Component({
  selector: 'nem-address-dialog',
  templateUrl: 'nem-address-dialog.component.html',
})
export class NemAddressDialogComponent {

  constructor(public dialogRef: MatDialogRef<NemAddressDialogComponent>) {
  }

  close(): void {
    this.dialogRef.close();
  }

}

@Pipe({name: 'safeHtml'})
export class Safe {
  constructor(private sanitizer:DomSanitizer){}

  transform(style) {
    return this.sanitizer.bypassSecurityTrustHtml(style);
  }
}