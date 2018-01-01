import Request from 'request'
import React, { Component } from 'react'
import { FormGroup, FormControl, Button, ControlLabel, HelpBlock } from 'react-bootstrap'
import ReCAPTCHA  from 'react-google-recaptcha'
import nem from 'nem-sdk'
import qrCode from '../assets/qr_donation.png'

let urlEncodedHeader = {
	'Content-Type': 'application/x-www-form-urlencoded'
}

class Harvesting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: undefined,
            publicKeyDelegated: undefined,
            privateKeyDelegated: undefined,
            captchaDone: false,
            formComplete: false,
            formErrors: {email: '', publicKeyDelegated: '', privateKeyDelegated: ''}
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateField = this.validateField.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.captchaSuccess = this.captchaSuccess.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        },
            () => { this.validateField(name, value)
        });
    }

    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    validateField(name, value) {
        let fieldValidationErrors = this.state.formErrors;
        switch(name) {
            case 'email':
                let emailValid = this.validateEmail(value);
                fieldValidationErrors.email = emailValid ? '' : ' is not a mail-address'
                break;
            case 'publicKeyDelegated':
                let publicKeyDelegatedValid = nem.utils.helpers.isPublicKeyValid(value);
                fieldValidationErrors.publicKeyDelegated = publicKeyDelegatedValid ? '' : ' is invalid';
                break;
            case 'privateKeyDelegated':
                let privateKeyDelegatedValid = nem.utils.helpers.isPrivateKeyValid(value);
                fieldValidationErrors.privateKeyDelegated = privateKeyDelegatedValid ? '' : ' is invalid';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors
        });
        this.validateForm();
    }

    errorClass(error) {
        return(error.length === 0 ? '' : 'has-error');
    }

    validateForm() {
        let complete = this.state.formErrors.email === '' && typeof this.state.email !== 'undefined'
            && this.state.formErrors.privateKeyDelegated === '' && typeof this.state.privateKeyDelegated !== 'undefined'
            && this.state.formErrors.publicKeyDelegated === '' && typeof this.state.publicKeyDelegated !== 'undefined'
            && this.state.captchaDone;
        this.setState({
            formComplete: complete
        });
    }

    captchaSuccess() {
        this.setState({
            captchaDone: true
        });
        this.validateForm();
    }

    register(){
        return new Promise((resolve, reject) => {
            var options = {
                url: 'https://nem-services.herokuapp.com/harvesting/register',
                method: 'POST',
                headers: urlEncodedHeader,
                qs: {'email': this.state.email, 'publicKeyDelegated': this.state.publicKeyDelegated, 'privateKeyDelegated': this.state.privateKeyDelegated}
            }

            // Start the request
            Request(options, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    resolve(body);
                } else {
                    reject(error);
                }
            });
        });
    }

    handleSubmit() {
        this.register().then((res) => {
                alert("Successfully registered. E-Mail to confirm your request was sent.");
        }).catch(error => {
            alert("Error while trying to register. Either your address is already registered or you have not submitted a wrong public key. Make sure that you provide the public key of your delegated account!");
        });
    }

    closeDonationDialog() {
        this.setState({ showModal: false });
      }
    
    openDonationDialog() {
        this.setState({ showModal: true });
    }

    render() {
        return (
            <div className="harvesting">
                <div id="harvestingDescription">
                    <h3>Automated restart of delegated harvesting</h3>
                    <b>Regular headaches</b>
                    <ul>
                        <li>delegated harvesting stops when a node is getting rebooted for some reason</li>
                        <li>you need to manually search for a node with free slots (can be frustrating using NanoWallet)</li>
                        <li>maybe you are on vacation and you cannot afford to restart harvesting</li>
                        <li>you miss the chance to harvest new blocks</li>
                    </ul>
                    <b>Solution</b>
                    <ul>
                        <li>we provide a service that <b>automatically</b> restarts delegated harvesting for you!</li>
                        <li>a scheduled task runs every 5 minutes, first determines free slots of all supernodes and then checks whether delegated harvesting for your account is still active</li>
                        <li>you will get notified via mail when delegated harvesting was restartet including the information about the host it is running on</li>
                    </ul>
                    <b>What's needed?</b>
                    <ul>
                        <li><a href="https://medium.com/@walz.marco/nem-tools-automated-restart-of-delegated-harvesting-aa00708dfabe" target="_blank" rel="noopener noreferrer"><b>blog-entry</b></a> (detailed explanation how the service works and what you have to do)</li>
                        <ul>
                            <li>it's recommended to read this blog-entry before you start using this service</li>
                        </ul>
                        <li>first of all you need to have delegated harvesting <b>activated</b></li>
                        <ul>
                            <li><a href="https://blog.nem.io/how-to-activate-start-delegated-harvesting-in-nanowallet/" target="_blank" rel="noopener noreferrer"><b>tutorial</b></a> (how to activate & start delegated harvesting in NanoWallet)</li>
                            <li><a href="https://www.youtube.com/watch?v=_m7rvXiEFpo" target="_blank" rel="noopener noreferrer"><b>video-tutorial</b></a> (also explains how to use this service)</li>
                        </ul>
                        <li>when this is done we need 3 types of information from you</li>
                        <ol>
                            <li>your e-mail address</li>
                            <li>public key of your <b>delegated account</b></li>
                            <li>private key of you <b>delegated account</b></li>
                            <ul>
                                <li><b>Note:</b> the funds in your regular account cannot be accessed by providing the private key of your delegated account</li>
                            </ul>
                        </ol>
                    </ul>
                    <b>Donation</b> (XEM or other mosaics :-))
                    <ul>
                        <li>NBEZ5S43KR7KXPPLW26TK4JPKC6U2GFM6AI6XF6U</li>
                    </ul>
                    <br/>
                </div>
                <div id="harvestingForm">
                    <form>
                        <FormGroup controlId="email" className={this.errorClass(this.state.formErrors.email)}>
                            <ControlLabel>E-Mail</ControlLabel>
                            <FormControl id="email" name="email"
                                type="text"
                                value={this.state.email || ''}
                                onChange={this.handleInputChange} />
                            <HelpBlock disabled={this.state.formErrors['email'].length === 0}>{this.state.formErrors['email']}</HelpBlock>
                        </FormGroup>
                        <FormGroup controlId="publicKeyDelegated" className={this.errorClass(this.state.formErrors.publicKeyDelegated)}>
                            <ControlLabel>Public key (delegated account)</ControlLabel>
                            <FormControl id="publicKeyDelegated" name="publicKeyDelegated"
                                type="text"
                                value={this.state.publicKeyDelegated || ''}
                                onChange={this.handleInputChange} />
                            <HelpBlock disabled={this.state.formErrors['publicKeyDelegated'].length === 0}>{this.state.formErrors['publicKeyDelegated']}</HelpBlock>
                        </FormGroup>
                        <FormGroup controlId="privateKeyDelegated" className={this.errorClass(this.state.formErrors.privateKeyDelegated)}>
                            <ControlLabel>Private key (delegated account)</ControlLabel>
                            <FormControl id="privateKeyDelegated" name="privateKeyDelegated"
                                type="text"
                                value={this.state.privateKeyDelegated || ''}
                                onChange={this.handleInputChange} />
                            <HelpBlock disabled={this.state.formErrors['privateKeyDelegated'].length === 0}>{this.state.formErrors['privateKeyDelegated']}</HelpBlock>
                        </FormGroup>
                        <FormGroup controlId="recaptcha">
                            <ReCAPTCHA
                                ref="recaptcha"
                                sitekey="6LdLNiwUAAAAAAQKoN6B7Zp6IDueryC7A4OLhYy9"
                                onChange={this.captchaSuccess}
                            />
                        </FormGroup>
                        <Button onClick={() => this.handleSubmit()} disabled={!this.state.formComplete}>
                            Submit
                        </Button>
                    </form>
                </div>
            </div>
        );
    }
}
export default Harvesting;