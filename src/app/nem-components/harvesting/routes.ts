import { AutomatedRestartComponent } from "@app/nem-components/harvesting/automated-restart/automated-restart.component";
import { CalculatorComponent } from "@app/nem-components/harvesting/calculator/calculator.component";
import { Routes } from "@angular/router";

export const HARVESTING_ROUTES: Routes = [
    { path: '', redirectTo: 'automated-restart', pathMatch: 'full' },
    { path: 'automated-restart', component: AutomatedRestartComponent },
    { path: 'calculator', component: CalculatorComponent }
];