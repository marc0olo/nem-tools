import { Account } from 'nem-library';

export class ValidationService {

    static emailValidator(control) {
        if (control.value == null) {
            return null;
        }
        // RFC 2822 compliant regex
        else if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return {valid: false};
        }
    }

    static privateKeyValidator(control) {
        if (control.value == null) {
            return null;
        } else {
            let account: Account;
            try {
                account = Account.createWithPrivateKey(control.value);
            } catch(err) {
                console.error(err)
                return {valid: false};
            }
            if(account.hasPublicKey()) {
                console.debug(account.publicKey);
                console.debug(account.address);
                return null;
            }
        }
        return {valid: false};
    }
}
