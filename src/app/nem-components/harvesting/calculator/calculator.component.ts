import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NemService } from '@app/services/nem.service';
import { VestedBalanceDialogComponent } from '@app/nem-components/dialogs/vested-balance-dialog/vested-balance-dialog.component';
import { formatValue, accountHttp } from '@app/constants';
import { ValidationService } from '@app/services/validation.service';
import { Address } from 'nem-library';

@Component({
  selector: 'anms-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {

  calculatorForm: FormGroup;

  constructor(public dialog: MatDialog, private fb: FormBuilder, private _nemService: NemService) { }

  ngOnInit() {
    this.createCalculatorForm();

    if (this._nemService.getNemAddress() !== null && this._nemService.getNemAddress() !== '') {
      let address = new Address(this._nemService.getNemAddress());
      accountHttp.getFromAddress(address).subscribe(accInfo => {
        this.calculatorForm.setValue({
          xemBalance: formatValue(accInfo.balance.balance),
          vestedBalance: formatValue(accInfo.balance.vestedBalance),
          targetBalance: null
        });
      }, err => {
          console.log(err);
      }, () => {
          console.log("account info loaded");
      });
    }
  }

  createCalculatorForm() {
    this.calculatorForm = this.fb.group({
      xemBalance: new FormControl(null, [Validators.required, ValidationService.numberValidator]),
      vestedBalance: new FormControl(null, [Validators.required, ValidationService.numberValidator]),
      targetBalance: new FormControl(null, [Validators.required, ValidationService.numberValidator])
    },
    {
      updateOn: 'blur',
      validator: ValidationService.calculatorValidator
    });
  }

  formatValue(value: any) {
    return formatValue(value);
  }

  public calculate() {
    console.log("calculated");
    let xemBalance = this.calculatorForm.get('xemBalance').value;
    let vestedBalance = this.calculatorForm.get('vestedBalance').value;
    let targetBalance = this.calculatorForm.get('targetBalance').value;
    let unvestedBalance = xemBalance - vestedBalance;

    let lineChartLabels = [];

    let vestedValues = [];
    let unvestedValues = [];

    let dayCounter = 0;

    lineChartLabels.push("Day " + dayCounter);
    vestedValues.push(vestedBalance);
    unvestedValues.push(unvestedBalance);

    while ( Number(targetBalance) >= Number(vestedBalance) ) {
        var vesting = unvestedBalance * 0.1;
        vestedBalance = Number(vestedBalance) + Number(vesting);
        unvestedBalance = Number(unvestedBalance) - Number(vesting);
        dayCounter = dayCounter + 1;

        lineChartLabels.push("Day " + dayCounter);
        vestedValues.push(vestedBalance);
        unvestedValues.push(unvestedBalance);
    }

    let lineChartData = [
      {data: vestedValues, label: 'Vested Balance'},
      {data: unvestedValues, label: 'Unvested Balance'}
    ];

    this.showCalculcationResult(lineChartData, lineChartLabels, targetBalance, dayCounter);
  }

  showCalculcationResult(lineChartData: any, lineChartLabels: any, targetBalance: any, daysToReachTarget: any) {
    const dialogRef = this.dialog.open(VestedBalanceDialogComponent, {
      data: {
        lineChartData: lineChartData,
        lineChartLabels: lineChartLabels,
        targetBalance: targetBalance,
        daysToReachTarget: daysToReachTarget
      }
    });
  }
}
