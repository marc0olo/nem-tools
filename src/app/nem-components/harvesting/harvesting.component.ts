import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import 'rxjs/add/operator/map';

import { Account, Address } from 'nem-library';

import { ValidationService } from '../../services/validation.service';
import { NemService } from '../../services/nem.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { accountHttp, formatValue } from '@app/constants';
import { VestedBalanceDialogComponent } from '@app/nem-components/dialogs/vested-balance-dialog/vested-balance-dialog.component';

@Component({
  selector: 'app-harvesting',
  templateUrl: './harvesting.component.html',
  styleUrls: ['./harvesting.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HarvestingComponent implements OnInit {

  tabLinks: {label: string, link: string}[] = [
    {label: 'Automated restarts of delegated harvesting', link: 'automated-restart'},
    {label: 'Vested XEM Calculator', link: 'calculator'}
  ];

  constructor() {}

  ngOnInit() {
  }
}
