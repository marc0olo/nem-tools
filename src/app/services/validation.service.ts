import { Account, AccountInfoWithMetaData, Address } from 'nem-library';
import { accountHttp } from '@app/constants';
import { FormGroup } from '@angular/forms';

export class ValidationService {

    static email(control) {
        if (control.value == null) {
            return null;
        }
        // RFC 2822 compliant regex
        else if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return {email: true};
        }
    }

    static privateKey(control) {
        if (control.value == null) {
            return null;
        } else {
            let account: Account;
            try {
                account = Account.createWithPrivateKey(control.value);
            } catch(err) {
                console.error(err)
                return {privateKey: true};
            }
            if(account.hasPublicKey()) {
                console.debug(account.publicKey);
                console.debug(account.address);
                return null;
            }
        }
        return {privateKey: true};
    }

    static numberValidator(control) {
        if (control.value === null) {
            return null;
        }
        if (! isNaN (control.value-0) && control.value !== null && control.value !== "" && control.value !== false) {
            return null;
        }
        return {noNumber: true};
    }

    static calculatorValidator(group: FormGroup) {
        let xemBalance = group.get('xemBalance').value;
        let vestedBalance = group.get('vestedBalance').value;
        let targetBalance = group.get('targetBalance').value;
        // console.log(xemBalance + " - " + vestedBalance + " - " + targetBalance);
        if (xemBalance !== null && Number(xemBalance) <= 10000 ) {
            return { xemBalanceTooLow: true};
        }
        if (vestedBalance !== null && Number(vestedBalance) >= Number(xemBalance)) {
            return { vestedBalanceTooHigh: true};
        }
        if (targetBalance !== null && Number(targetBalance) <= Number(vestedBalance)) {
            return { targetBalanceTooLow: true};
        }
        if (targetBalance !== null && Number(targetBalance) >= Number(xemBalance)) {
            return { targetGreaterThanBalance: true};
        }
        return null;
    }
}
