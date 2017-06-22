import React, {Component} from 'react'
import { FormGroup, FormControl, Button, ControlLabel, HelpBlock, Modal } from 'react-bootstrap'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import nem from 'nem-sdk'

class VestedCalculation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            address: undefined,
            xemBalance: undefined,
            vestedBalance: undefined,
            targetVestedBalance: 10000,
            supernodes: [],
            endpoint: nem.model.objects.create("endpoint")("https://san.nem.ninja", 7891), // https://nis.wnsl.biz (spizzerb)
            isLoadingData: false,
            formErrors: {address: '', xemBalance: '', vestedBalance: '', targetVestedBalance: ''},
            formValid: false,
            chartData: [],
            daysToReachTarget: undefined
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.loadData = this.loadData.bind(this);
        this.closeResult = this.closeResult.bind(this);
        this.validateField = this.validateField.bind(this);
        /*
        nem.com.requests.supernodes.all().then((res) => {
            this.setState({
                supernodes: res.nodes,
            });
            this.setState({
                endpoint: nem.model.objects.create("endpoint")("http://" + this.state.supernodes[0].ip, nem.model.nodes.defaultPort)
            });
        }).catch(error => {
            console.error(error);
        });
        */
    }

    isNumber (o) {
        return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
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

    validateField(name, value) {
        let fieldValidationErrors = this.state.formErrors;
        let addressValid = this.state.addressValid;
        let xemBalanceValid = this.state.xemBalanceValid;
        let vestedBalanceValid = this.state.vestedBalanceValid;
        let targetVestedBalanceValid = this.state.targetVestedBalanceValid;

        switch(name) {
            case 'address':
                addressValid = nem.model.address.isValid(this.state.address);
                fieldValidationErrors.address = addressValid ? '' : ' is invalid';
                break;
            case 'xemBalance':
                if ( !this.isNumber(value) ) {
                    fieldValidationErrors.xemBalance = ' must be a number';
                    xemBalanceValid = false;
                } else if ( Number(value) <= 10000 ) {
                    fieldValidationErrors.xemBalance = ' must be greater than 10000';
                    xemBalanceValid = false;
                } else {
                    fieldValidationErrors.xemBalance = '';
                    xemBalanceValid = true;
                }
                break;
            case 'vestedBalance':
                if ( !this.isNumber(value) ) {
                    fieldValidationErrors.vestedBalance = ' must be a number';
                    vestedBalanceValid = false;
                } else if ( Number(value) > Number(this.state.xemBalance) ) {
                    fieldValidationErrors.vestedBalance = ' cannot be greater than your current balance';
                    vestedBalanceValid = false;
                } else {
                    fieldValidationErrors.vestedBalance = '';
                    vestedBalanceValid = true;
                }
                break;
            case 'targetVestedBalance':
                if ( !this.isNumber(value) ) {
                    fieldValidationErrors.targetVestedBalance = ' must be a number';
                    targetVestedBalanceValid = false;
                } else if ( Number(value) < 10000 ) {
                    fieldValidationErrors.targetVestedBalance = ' should be >= 10000';
                    targetVestedBalanceValid = false;
                } else if ( Number(this.state.vestedBalance) >= Number(value) ) {
                    fieldValidationErrors.targetVestedBalance = ' cannot be less than or equal to the vested balance';
                    targetVestedBalanceValid = false;
                } else if ( Number(this.state.xemBalance) <= Number(value) ) {
                    fieldValidationErrors.targetVestedBalance = ' cannot be greater than or equal to the balance';
                    targetVestedBalanceValid = false;
                }
                else {
                    fieldValidationErrors.targetVestedBalance = '';
                    targetVestedBalanceValid = true;
                }
                break;
            default:
                break;
        }
        this.setState({formErrors: fieldValidationErrors,
                        addressValid: addressValid,
                        xemBalanceValid: xemBalanceValid,
                        vestedBalanceValid: vestedBalanceValid,
                        targetVestedBalanceValid: targetVestedBalanceValid
                        }, this.validateForm);
    }

    validateForm() {
        if ( this.state.xemBalanceValid && this.state.vestedBalanceValid && this.state.targetVestedBalanceValid ) {
            let fieldValidationErrors = this.state.formErrors;
            let xemBalanceValid = this.state.xemBalanceValid;
            let vestedBalanceValid = this.state.vestedBalanceValid;
            let targetVestedBalanceValid = this.state.targetVestedBalanceValid;

            // check xemBalance again
            if ( !this.isNumber(this.state.xemBalance) ) {
                fieldValidationErrors.xemBalance = ' must be a number';
                xemBalanceValid = false;
            } else if ( Number(this.state.xemBalance) <= 10000 ) {
                fieldValidationErrors.xemBalance = ' must be greater than 10000';
                xemBalanceValid = false;
            } else {
                fieldValidationErrors.xemBalance = '';
                xemBalanceValid = true;
            }

            // check vested again
            if ( !this.isNumber(this.state.vestedBalance) ) {
                fieldValidationErrors.vestedBalance = ' must be a number';
                vestedBalanceValid = false;
            } else if ( Number(this.state.vestedBalance) > Number(this.state.xemBalance) ) {
                fieldValidationErrors.vestedBalance = ' cannot be greater than your current balance';
                vestedBalanceValid = false;
            } else {
                fieldValidationErrors.vestedBalance = '';
                vestedBalanceValid = true;
            }
            // check targetVested again
            if ( !this.isNumber(this.state.targetVestedBalance) ) {
                fieldValidationErrors.targetVestedBalance = ' must be a number';
                targetVestedBalanceValid = false;
            } else if ( Number(this.state.targetVestedBalance) < 10000 ) {
                fieldValidationErrors.targetVestedBalance = ' should be >= 10000';
                targetVestedBalanceValid = false;
            } else if ( Number(this.state.vestedBalance) >= Number(this.state.targetVestedBalance) ) {
                fieldValidationErrors.targetVestedBalance = ' cannot be less than or equal to the vested balance';
                targetVestedBalanceValid = false;
            } else if ( Number(this.state.xemBalance) <= Number(this.state.targetVestedBalance) ) {
                fieldValidationErrors.targetVestedBalance = ' cannot be greater than or equal to the balance';
                targetVestedBalanceValid = false;
            }
            else {
                fieldValidationErrors.targetVestedBalance = '';
                targetVestedBalanceValid = true;
            }
            this.setState({formErrors: fieldValidationErrors,
                            xemBalanceValid: xemBalanceValid,
                            vestedBalanceValid: vestedBalanceValid,
                            targetVestedBalanceValid: targetVestedBalanceValid,
                            formValid: xemBalanceValid && targetVestedBalanceValid && vestedBalanceValid
                            });
        } else {
            this.setState({
                formValid: false
            });
        }
    }

    errorClass(error) {
        return(error.length === 0 ? '' : 'has-error');
    }

    calculate() {
        const xemBalance = this.state.xemBalance;
        var vestedBalance = this.state.vestedBalance;
        var targetBalance = this.state.targetVestedBalance;
        var unvestedBalance = xemBalance - vestedBalance;

        var chartData = [];
        var dayCounter = 0;

        chartData.push({
                "day" : "Day " + dayCounter,
                "vested" : vestedBalance,
                "unvested" : unvestedBalance
        });
        while ( Number(targetBalance) >= Number(vestedBalance) ) {
            var vesting = unvestedBalance * 0.1;
            vestedBalance = Number(vestedBalance) + Number(vesting);
            unvestedBalance = Number(unvestedBalance) - Number(vesting);
            dayCounter = dayCounter + 1;
            chartData.push({
                "day" : "Day" + dayCounter,
                "vested" : vestedBalance,
                "unvested" : unvestedBalance
            });
        }
        this.setState({
            daysToReachTarget: dayCounter,
            chartData: chartData
        });
    }

    loadData() {
        this.setState({
            isLoadingData: true
        });
        nem.com.requests.account.data(this.state.endpoint, this.state.address.replace(/-/g, "")).then(res => {
            var balance = res.account.balance / 1000000;
            var vestedBalance = res.account.vestedBalance / 1000000;
            this.setState({
                xemBalance: balance,
                vestedBalance: vestedBalance,
                isLoadingData: false
            }, this.validateField('xemBalance',balance),
                this.validateField('vestedBalance',vestedBalance)
            );
            this.validateField('targetVestedBalance',this.state.targetVestedBalance);
        }).catch(error => {
            console.error(error);
            alert('error while loading data');
            this.setState({
                isLoadingData: false
            });
        });
    }

    closeResult() {
        this.setState({
            chartData: [],
            daysToReachTarget: undefined
        })
    }

    render() {
        return (
            <div className="calculator">
                <div id="vestedDescription">
                    <h3>Vested XEM Calculator</h3>
                    Many people starting research about NEM are asking "what does vested balance mean?" and "how long does it take to get my XEM vested?".
                    <ul>
                        <li>NEM requires a vested balance of <b>minimum 10000 XEM</b> in order to be able to activate (delegated) harvesting</li>
                        <li>your unvested balance will automatically be vested at a rate of 10% each day</li>
                        <li>you will <b>only</b> be able to activate harvesting if your balance is > 10000 XEM</li>
                        <li>the less XEM are in your balance, the longer it will take to get your balance vested</li>
                    </ul>
                    With this tool you can easily calculate how much time it will take to get an amount of 10000 XEM <b>vested</b>
                    <ul>
                        <li>of course the targeted vested amount can be changed!</li>
                    </ul>
                    <b>Note:</b> You can either load your current data by providing your address or enter the values manually
                    <br/><br />
                </div>
                <div id="vestedForm">
                    <form>
                        <div className="addressInput">
                            <FormGroup controlId="address" className={this.errorClass(this.state.formErrors.address)}>
                                <ControlLabel>Public Address</ControlLabel>
                                <FormControl id="address" name="address"
                                    type="text"
                                    value={this.state.address || ''}
                                    onChange={this.handleInputChange} />
                                <HelpBlock disabled={this.state.formErrors['address'].length === 0}>{this.state.formErrors['address']}</HelpBlock>
                            </FormGroup>
                            <FormGroup controlId="loadData">
                                <Button onClick={() => this.loadData()} disabled={this.state.endpoint == null || !this.state.addressValid}>
                                    {this.state.isLoadingData ? 'Loading data ...' : 'Load Data'}
                                </Button>
                            </FormGroup>
                        </div>
                        <FormGroup controlId="xemBalance" className={this.errorClass(this.state.formErrors.xemBalance)}>
                            <ControlLabel>XEM-Balance</ControlLabel>
                            <FormControl id="xemBalance" name="xemBalance"
                                type="text"
                                value={this.state.xemBalance || ''}
                                onChange={this.handleInputChange} />
                            <HelpBlock disabled={this.state.formErrors['xemBalance'].length === 0}>{this.state.formErrors['xemBalance']}</HelpBlock>
                        </FormGroup>
                        <FormGroup controlId="vestedBalance" className={this.errorClass(this.state.formErrors.vestedBalance)}>
                            <ControlLabel>Vested-Balance (current)</ControlLabel>
                            <FormControl id="vestedBalance" name="vestedBalance"
                                type="text"
                                value={this.state.vestedBalance || ''}
                                onChange={this.handleInputChange} />
                            <HelpBlock disabled={this.state.formErrors['vestedBalance'].length === 0}>{this.state.formErrors['vestedBalance']}</HelpBlock>
                        </FormGroup>
                        <FormGroup controlId="targetVestedBalance" className={this.errorClass(this.state.formErrors.targetVestedBalance)}>
                            <ControlLabel>Vested-Balance (target)</ControlLabel>
                            <FormControl id="targetVestedBalance" name="targetVestedBalance"
                                type="text"
                                value={this.state.targetVestedBalance}
                                onChange={this.handleInputChange} />
                            <HelpBlock disabled={this.state.formErrors['targetVestedBalance'].length === 0}>{this.state.formErrors['targetVestedBalance']}</HelpBlock>
                        </FormGroup>
                        <Button onClick={() => this.calculate()} disabled={!this.state.formValid}>
                            Calculate
                        </Button>
                        <Modal show={this.state.chartData.length > 0} onHide={this.closeResult}>
                            <Modal.Header closeButton>
                                <Modal.Title>Calculation Result</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div id="chart">
                                    <p>You will reach your target vested balance in <b>{this.state.daysToReachTarget} days</b></p>
                                    <AreaChart width={500} height={300} data={this.state.chartData}
                                                margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                                        <XAxis dataKey="day"/>
                                        <YAxis/>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <Tooltip/>
                                        <Area type="monotone" dataKey="vested" stackId="1" stroke="#82ca9d" fill='#82ca9d'/>
                                        <Area type="monotone" dataKey="unvested" stackId="2" stroke="#8884d8" fill='#8884d8'/>
                                    </AreaChart>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={this.closeResult}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                    </form>
                </div>
            </div>
        );
    }
}
export default VestedCalculation;
