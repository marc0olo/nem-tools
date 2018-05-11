import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';

import nem from 'nem-sdk';

import {
  selectorSettings,
  SettingsState,
  ActionSettingsPersist,
  ActionSettingsChangeNemAddress
} from '../settings.reducer';

import { accountHttp } from '@app/constants';
import { NEMAddress } from '@app/classes/NEMAddress';
import { Address, AccountInfoWithMetaData } from 'nem-library';

@Component({
  selector: 'anms-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  settings: SettingsState;

  themes = [
    { value: 'DEFAULT-THEME', label: 'Blue' },
    { value: 'LIGHT-THEME', label: 'Light' },
    { value: 'BLACK-THEME', label: 'Dark' }
  ];

  constructor(public snackBar: MatSnackBar, private store: Store<any>) {
    store
      .select(selectorSettings)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(settings => (this.settings = settings));
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onNemAddressSelect({ value: nemAddress }) {
    if ( nemAddress === null || nemAddress === '') {
      this.store.dispatch(new ActionSettingsChangeNemAddress( { nemAddress: null }));
      this.store.dispatch(new ActionSettingsPersist({ settings: this.settings }));
      this.openSnackBar("NEM-Address successfully removed", "");
    } else if ( nem.model.address.isValid(nemAddress) ) {
      this.store.dispatch(new ActionSettingsChangeNemAddress( { nemAddress: nem.utils.format.address(nemAddress) }));
      this.store.dispatch(new ActionSettingsPersist({ settings: this.settings }));
      this.openSnackBar("NEM-Address successfully saved", "");
    } else {
      this.openSnackBar("Invalid NEM-Address, please check and try again.", "");
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
