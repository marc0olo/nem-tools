import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { toast } from 'angular2-materialize';

import 'rxjs/add/operator/map';

import { Account } from 'nem-library';

import { ValidationService } from './../services/validation.service';
import { HarvestingService } from './../services/harvesting.service';

@Component({
  selector: 'app-harvesting',
  templateUrl: './harvesting.component.html',
  styleUrls: ['./harvesting.component.css']
})
export class HarvestingComponent implements OnInit {

  harvestingForm: FormGroup;

  constructor(private _harvestingService: HarvestingService) {}

  ngOnInit() {
    this.harvestingForm = new FormGroup({
        email: new FormControl(null, [Validators.required, ValidationService.emailValidator]),
        privateKeyDelegated: new FormControl(null, [Validators.required, ValidationService.privateKeyValidator]),
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
    this._harvestingService.registerForHarvesting(email, publicKeyDelegated, privateKeyDelegated)
              .map(response => console.debug(response))
              .subscribe(
                data => console.debug(data),
                err => this.openErrorToast(err.error),
                () => this.openSuccessToast()
              );
  }
  
  private getPublicKey(privateKeyDelegated: string): string {
    let publicKey = Account.createWithPrivateKey(privateKeyDelegated).publicKey;
    return publicKey;
  }

  private openSuccessToast() {
    toast('success. please check your mails to confirm subscription.', 5000, 'green rounded');
  }

  private openErrorToast(msg: string) {
    toast(msg, 5000, 'red rounded');
  }
}
