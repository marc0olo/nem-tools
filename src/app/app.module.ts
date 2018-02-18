import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterializeModule} from "angular2-materialize";
import {RouterModule, Routes} from '@angular/router';
import {
  AccountHttp,
  AccountListener,
  BlockchainListener,
  BlockHttp,
  ChainHttp,
  ConfirmedTransactionListener,
  MosaicHttp,
  NamespaceHttp,
  NEMLibrary,
  NetworkTypes,
  NodeHttp,
  TransactionHttp,
  UnconfirmedTransactionListener
} from "nem-library";
import {Angulartics2Module} from 'angulartics2';
import {Angulartics2GoogleAnalytics} from 'angulartics2/ga';
import {RecaptchaModule} from 'ng-recaptcha';

import {BlockchainListenerProvider} from "./providers/BlockchainListenerProvider";
import {UnconfirmedTransactionListenerProvider} from "./providers/UnconfirmedTransactionListenerProvider";
import {AccountHttpProvider} from "./providers/AccountHttpProvider";


import {AppComponent} from './app.component';
import {AccountListenerProvider} from "./providers/AccountListenerProvider";
import {BlockHttpProvider} from "./providers/BlockHttpProvider";
import {ChainHttpProvider} from "./providers/ChainHttpProvider";
import {ConfirmedTransactionListenerProvider} from "./providers/ConfirmedTransactionListenerProvider";
import {MosaicHttpProvider} from "./providers/MosaicHttpProvider";
import {NamespaceHttpProvider} from "./providers/NamespaceHttpProvider";
import {NodeHttpProvider} from "./providers/NodeHttpProvider";
import {TransactionHttpProvider} from "./providers/TransactionHttpProvider";
import {TransactionsComponent} from './transactions/transactions.component';
import {AppRoutingModule} from './app-routing.module';
import {SupernodesComponent} from './supernodes/supernodes.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HarvestingComponent} from './harvesting/harvesting.component';
import { HarvestingService } from './services/harvesting.service';

NEMLibrary.bootstrap(NetworkTypes.MAIN_NET);

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterializeModule,
    AppRoutingModule,
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ]),
    RecaptchaModule.forRoot()
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    TransactionsComponent,
    SupernodesComponent,
    HarvestingComponent
  ],
  providers: [
    HarvestingService,
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }