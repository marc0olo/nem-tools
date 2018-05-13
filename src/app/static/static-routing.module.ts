import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { HarvestingComponent } from '@app/nem-components/harvesting/harvesting.component';
import { SupernodesComponent } from '@app/nem-components/supernodes/supernodes.component';
import { AccountComponent } from '@app/nem-components/account/account.component';
import { TransactionsComponent } from '@app/nem-components/transactions/transactions.component';
import { ChangellyComponent } from '@app/nem-components/changelly/changelly.component';
import { GuestbookComponent } from '@app/nem-components/guestbook/guestbook.component';
import { AutomatedRestartComponent } from '@app/nem-components/harvesting/automated-restart/automated-restart.component';
import { CalculatorComponent } from '@app/nem-components/harvesting/calculator/calculator.component';
import { HARVESTING_ROUTES } from '@app/nem-components/harvesting/routes';

const routes: Routes = [
  { path: 'home', component: HomeComponent, data: { title: 'Home' } },
  { path: 'account', component: AccountComponent, data: { title: 'Account' } },
  { path: 'transactions', component: TransactionsComponent, data: { title: 'Transactions' } },
  { path: 'harvesting', component: HarvestingComponent, children: HARVESTING_ROUTES, data: { title: 'Harvesting' } },
  { path: 'supernodes', component: SupernodesComponent, data: { title: 'Supernodes' } },
  { path: 'buy-xem', component: ChangellyComponent, data: { title: 'Buy XEM' } },
  { path: 'guestbook', component: GuestbookComponent, data: { title: 'Guestbook' } },
  { path: 'calculator', redirectTo: 'harvesting/calculator', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticRoutingModule {}
