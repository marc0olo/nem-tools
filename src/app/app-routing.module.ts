import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransactionsComponent } from './transactions/transactions.component';
import { SupernodesComponent } from './supernodes/supernodes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HarvestingComponent} from './harvesting/harvesting.component';

const routes: Routes = [
  { path: '', redirectTo: '/harvesting', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'transactions', component: TransactionsComponent },
  { path: 'supernodes', component: SupernodesComponent},
  { path: 'harvesting', component: HarvestingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }