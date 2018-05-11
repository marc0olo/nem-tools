import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule} from '@angular/material/table';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import {
  AccountHttp,
  AccountListener,
  BlockchainListener,
  BlockHttp,
  ChainHttp,
  ConfirmedTransactionListener,
  HttpEndpoint,
  MosaicHttp,
  NamespaceHttp,
  NEMLibrary,
  NetworkTypes,
  NodeHttp,
  Protocol,
  TransactionHttp,
  UnconfirmedTransactionListener
} from "nem-library";

import { AccountHttpProvider } from "../providers/AccountHttpProvider";
import { AccountListenerProvider } from "../providers/AccountListenerProvider";
import { BlockHttpProvider } from "../providers/BlockHttpProvider";
import { BlockchainListenerProvider } from "../providers/BlockchainListenerProvider";
import { ChainHttpProvider } from "../providers/ChainHttpProvider";
import { ConfirmedTransactionListenerProvider } from "../providers/ConfirmedTransactionListenerProvider";
import { MosaicHttpProvider } from "../providers/MosaicHttpProvider";
import { NamespaceHttpProvider } from "../providers/NamespaceHttpProvider";
import { NodeHttpProvider } from "../providers/NodeHttpProvider";
import { TransactionHttpProvider } from "../providers/TransactionHttpProvider";
import { UnconfirmedTransactionListenerProvider } from "../providers/UnconfirmedTransactionListenerProvider";

import { NemService } from '../services/nem.service';

export function initNemService(nemService: NemService) {
  return () => nemService.init();
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatButtonModule,
    MatToolbarModule,
    MatSelectModule,
    MatTabsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatCardModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  declarations: [
  ],
  providers: [
    {provide: AccountHttp, useFactory: AccountHttpProvider},
    {provide: AccountListener, useFactory: AccountListenerProvider},
    {provide: BlockchainListener, useFactory: BlockchainListenerProvider},
    {provide: BlockHttp, useFactory: BlockHttpProvider},
    {provide: ChainHttp, useFactory: ChainHttpProvider},
    {provide: ConfirmedTransactionListener, useFactory: ConfirmedTransactionListenerProvider},
    {provide: MosaicHttp, useFactory: MosaicHttpProvider},
    {provide: NamespaceHttp, useFactory: NamespaceHttpProvider},
    {provide: NodeHttp, useFactory: NodeHttpProvider},
    {provide: TransactionHttp, useFactory: TransactionHttpProvider},
    {provide: UnconfirmedTransactionListener, useFactory: UnconfirmedTransactionListenerProvider},
    
    NemService,
    {provide: APP_INITIALIZER, useFactory: initNemService, deps:[NemService], multi: true}
  ],
  exports: [
    CommonModule,
    FormsModule,

    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
    MatChipsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatProgressBarModule,
    MatSnackBarModule,
  ]
})
export class SharedModule {}
