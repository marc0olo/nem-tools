import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidationService } from '@app/services/validation.service';
import { MatSnackBar } from '@angular/material';
import { NemService } from '@app/services/nem.service';
import { Account } from 'nem-library';

@Component({
  selector: 'anms-automated-restart',
  templateUrl: './automated-restart.component.html',
  styleUrls: ['./automated-restart.component.scss'],
})
export class AutomatedRestartComponent implements OnInit {

  constructor(public snackBar: MatSnackBar, private _nemService: NemService) { }

  harvestingForm: FormGroup;

  ngOnInit() {
    this.harvestingForm = new FormGroup({
      email: new FormControl(null, [Validators.required, ValidationService.email]),
      privateKeyDelegated: new FormControl(null, [Validators.required, ValidationService.privateKey]),
      captcha: new FormControl(null, [Validators.required])
    }, { updateOn: 'blur' });
  }

  public resolved(captchaResponse: string) {
    this.harvestingForm.controls.captcha.setValue(captchaResponse);
    console.debug(`Resolved captcha with response ${captchaResponse}:`);
  }

  public submitForm() {
    this.register();
    return false;
  }

  private register(){
    let email = this.harvestingForm.controls.email.value;
    let privateKeyDelegated = this.harvestingForm.controls.privateKeyDelegated.value;
    let publicKeyDelegated = this.getPublicKey(privateKeyDelegated);
    this._nemService.registerForHarvesting(email, publicKeyDelegated, privateKeyDelegated)
              .map(response => console.debug(response))
              .subscribe(
                data => console.debug(data),
                err => this.openSnackBar(err.error, ""),
                () => this.openSnackBar("success - you will soon receive a confirmation mail - make sure to check your spam folder! ;-)", "")
              );
  }
  
  private getPublicKey(privateKeyDelegated: string): string {
    let publicKey = Account.createWithPrivateKey(privateKeyDelegated).publicKey;
    return publicKey;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
