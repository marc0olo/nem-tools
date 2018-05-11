import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';
import { CoreModule } from '@app/core';

import { StaticModule } from './static';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SettingsModule } from '@app/settings';
import { AccountComponent, NemAddressDialogComponent, Safe } from '@app/nem-components/account/account.component';
import { ChangellyComponent } from '@app/nem-components/changelly/changelly.component';
import { SupernodesComponent } from '@app/nem-components/supernodes/supernodes.component';
import { TransactionsComponent } from '@app/nem-components/transactions/transactions.component';
import { HarvestingComponent } from '@app/nem-components/harvesting/harvesting.component';
import { AutomatedRestartComponent } from '@app/nem-components/harvesting/automated-restart/automated-restart.component';
import { CalculatorComponent } from '@app/nem-components/harvesting/calculator/calculator.component';
import { GuestbookComponent } from '@app/nem-components/guestbook/guestbook.component';
import { TransactionDetailDialogComponent } from '@app/nem-components/dialogs/transaction-detail-dialog/transaction-detail-dialog.component';
import { VestedBalanceDialogComponent } from '@app/nem-components/dialogs/vested-balance-dialog/vested-balance-dialog.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    // angular
    BrowserAnimationsModule,
    BrowserModule,

    // core & shared
    CoreModule,
    SharedModule,

    // features
    StaticModule,
    SettingsModule,

    // re-captcha
    RecaptchaModule.forRoot(),

    // forms
    ReactiveFormsModule,

    ClipboardModule,
    ChartsModule,

    // app
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    AccountComponent,
    ChangellyComponent,
    TransactionsComponent,
    SupernodesComponent,
    HarvestingComponent,
    AutomatedRestartComponent,
    CalculatorComponent,
    GuestbookComponent,

    TransactionDetailDialogComponent,
    VestedBalanceDialogComponent,
    NemAddressDialogComponent,

    Safe
  ],
  entryComponents: [
    TransactionDetailDialogComponent,
    VestedBalanceDialogComponent,
    NemAddressDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
