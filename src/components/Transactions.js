import React, {Component} from 'react'
import { Tabs, Tab, FormGroup, FormControl, Button, ControlLabel, HelpBlock } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import Loader from 'react-loader-advanced'
import nem from 'nem-sdk'
import {
    AccountHttp, Address, NEMLibrary, NetworkTypes, TransferTransaction, ImportanceTransferTransaction, PlainMessage, EncryptedMessage, MultisigTransaction
} from 'nem-library'
const joda = require('js-joda')
NEMLibrary.bootstrap(NetworkTypes.MAIN_NET);
// const accountHttp = new AccountHttp();
const accountHttp = new AccountHttp({
    protocol: "http",
    domain: "hugealice.nem.ninja",
    port: "7890"
});

class Transactions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            endpoint: nem.model.objects.create("endpoint")("http://hugealice.nem.ninja", 7890), // https://nis.wnsl.biz (spizzerb)
            address: '',
            formErrors: {address: ''},
            harvestLoading: false,
            transactionLoading: false,
            transferTransactions: [],
            harvestedTransactions: []
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateField = this.validateField.bind(this);
        this.loadTransactions = this.loadTransactions.bind(this);
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
        var isValid = false;
        switch(name) {
            case 'address':
                isValid = nem.model.address.isValid(this.state.address);
                fieldValidationErrors.address = isValid ? '' : 'address is invalid';
                break;
            default:
                break;
        }
        this.setState({formErrors: fieldValidationErrors});
    }

    loadTransactions(showAll) {
        this.setState({
            transactionLoading: true,
            harvestLoading: true
        });
        const address = new Address(this.state.address);
        let allTransactions = [];
        let allHarvestingTransactions = [];
        if ( showAll ) {
            let pagedTransactions = accountHttp.allTransactionsPaginated(address, undefined, 100);
            pagedTransactions.subscribe(x => {
                x.forEach((element) => {
                    // show only confirmed transactions
                    if (element.isConfirmed()) {
                        if (element instanceof TransferTransaction) {
                            allTransactions.push(this.transformTransferTransaction(element));
                        } else if (element instanceof MultisigTransaction) {
                            if (element.otherTransaction instanceof TransferTransaction) {
                                allTransactions.push(this.transformTransferTransaction(element.otherTransaction));
                            }
                        }
                        else {
                            // console.log(element);
                        }
                    }
                });
                pagedTransactions.nextPage();
            }, err => {
                console.log(err);
            }, () => {
                // console.log("all transactions loaded");
                // console.log(allTransactions);
                this.setState({
                    transferTransactions: allTransactions,
                    transactionLoading: false
                });
            });
            let pagedHarvestingTransactions = accountHttp.getHarvestInfoDataForAnAccountPaginated(address);
            pagedHarvestingTransactions.subscribe( x => {
                x.forEach((element) => {
                    allHarvestingTransactions.push(this.transformHarvestedTransaction(element));
                });
                pagedHarvestingTransactions.nextPage();
            }, err => {
                console.log(err);
            }, () => {
                // console.log("all harvesting-transactions loaded");
                // console.log(allHarvestingTransactions);
                this.setState({
                    harvestedTransactions: allHarvestingTransactions,
                    harvestLoading: false
                });
            });
        } else {
            accountHttp.allTransactions(address).subscribe(x => {
                x.forEach((element) => {
                    // show only confirmed transactions
                    if (element.isConfirmed()) {
                        if (element instanceof TransferTransaction) {
                            allTransactions.push(this.transformTransferTransaction(element));
                        } else if (element instanceof MultisigTransaction) {
                            if (element.otherTransaction instanceof TransferTransaction) {
                                allTransactions.push(this.transformTransferTransaction(element.otherTransaction));
                            }
                        }
                        else {
                            // console.log(element);
                        }
                    }
                });
            }, err => {
                console.log(err);
            }, () => {
                this.setState({
                    transferTransactions: allTransactions,
                    transactionLoading: false
                });
            });
            accountHttp.getHarvestInfoDataForAnAccount(address).subscribe(x => {
                x.forEach((element) => {
                    allHarvestingTransactions.push(this.transformHarvestedTransaction(element));
                });
            }, err => {
                console.log(err);
            }, () => {
                this.setState({
                    harvestedTransactions: allHarvestingTransactions,
                    harvestLoading: false
                });
            });
        }
    }

    isNumber (o) {
        return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
    }

    formatValue(value) {
        return value !== undefined && this.isNumber(value) ? value / 1000000 : '';
    }

    getRealTimestamp(secondsSinceNemesis) {
        // console.log(secondsSinceNemesis);
        let nemesis = Date.UTC(2015, 2, 29, 0, 6, 25);
        let o = secondsSinceNemesis;
        let t = nemesis + o * 1000;
        return t;
    }

    getFormattedDate(timestamp) {
        return new Date(timestamp).toUTCString();
    }

    transformTransferTransaction(transaction) {
        let transformedTx = {};
        // let response = this.getHistoricalPrice(this.getRealTimestamp(transaction.timeStamp));
        transformedTx.amount = this.formatValue(transaction.amount);
        // transformedTx.xemRateUSD = response.XEM.USD;
        // transformedTx.xemRateEUR = response.XEM.EUR;
        // transformedTx.totalValueUSD = response.XEM.USD * Number(transformedTx.amount);
        // transformedTx.totalValueEUR = response.XEM.EUR * Number(transformedTx.amount);
        // transformedTx.timestamp = this.getRealTimestamp(transaction.timeStamp);
        // transformedTx.date = this.getFormattedDate(transformedTx.timestamp);
        transformedTx.timestamp = joda.convert(transaction.timeWindow.timeStamp).toEpochMilli();
        transformedTx.date = transaction.timeWindow.timeStamp.toString();
        transformedTx.sender = transaction.signer.address.pretty();
        transformedTx.recipient = transaction.recipient.pretty();
        if ( transaction.message instanceof PlainMessage ) {
            // transformedTx.message = <PlainMessage>transaction.message).plain()
            transformedTx.message = nem.utils.format.hexToUtf8(transaction.message.payload);
        }
        else if ( transaction.message instanceof EncryptedMessage ) {
            transformedTx.message = '[***encrypted***]'
        }
        if ( transaction.mosaics !== undefined ) {
            transformedTx.mosaics = '';
            transaction.mosaics.forEach( (mosaic) => {
                transformedTx.mosaics += mosaic.mosaicId.namespaceId +':' + mosaic.mosaicId.name  + ' (' + this.formatValue(mosaic.quantity) + ')'
            });
        }
        //transformedTx.mosaics = transaction.mosaics;
        transformedTx.fee = this.formatValue(transaction.fee);
        // transformedTx.message = nem.utils.format.hexMessage(transaction.message);
        // transformedTx.mode = nem.utils.format.importanceTransferMode(transaction.mode);
        return transformedTx;
    }

    transformHarvestedTransaction(harvestedBlock) {
        let transformedHarvestTx = {};
        // let response = this.getHistoricalPrice(this.getRealTimestamp(harvestedBlock.timeStamp));
        transformedHarvestTx.totalFee = this.formatValue(harvestedBlock.totalFee);
        // transformedHarvestTx.xemRateUSD = response.XEM.USD;
        // transformedHarvestTx.xemRateEUR = response.XEM.EUR;
        // transformedHarvestTx.totalProfitUSD = response.XEM.USD * Number(transformedHarvestTx.totalFee);
        // transformedHarvestTx.totalProfitEUR = response.XEM.EUR * Number(transformedHarvestTx.totalFee);
        transformedHarvestTx.timestamp = this.getRealTimestamp(harvestedBlock.timeStamp);
        // transformedHarvestTx.date = this.getFormattedDate(transformedHarvestTx.timestamp);
        transformedHarvestTx.date = joda.LocalDateTime.ofInstant(joda.Instant.ofEpochMilli(transformedHarvestTx.timestamp)).toString();
        transformedHarvestTx.block = harvestedBlock.height;
        return transformedHarvestTx;
    }
    
    getHistoricalPrice(timestamp) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "https://min-api.cryptocompare.com/data/pricehistorical?fsym=XEM&tsyms=USD,EUR&ts=" + timestamp + "&extraParams=nem_tools", false);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send();
        var response = JSON.parse(xhttp.responseText);
        return response;
    }

    render() {
        function mosaicFormatter(cell, row) {
            /*
            var output = ''
            if( cell !== undefined ) {
                cell.forEach((mosaic) => {
                    output += mosaic.mosaicId.namespaceId +':' + mosaic.mosaicId.name  + ' (' + mosaic.quantity / 1000000 + ') <br />'
                });
            }
            return (
                output
            );
            */
            var output = '';
            if ( cell !== undefined ) {
                output = cell.replace(new RegExp("\\)","g"), ")<br />")
            }
            return output
        }
        return (
            <div className="transactions">
                <h3>View and export your transactions to csv</h3>
                Here you can view your (harvesting) transactions to and export them to csv.<br />
                <b>Current limitations</b>
                <ul>
                    <li>not all transaction-types are displayed</li>
                        <ul>
                            <li>only <a href="https://nemlibrary.com/documentation/transaction/#transfertransaction" target="_blank" rel="noopener noreferrer"><b>TransferTransactions</b></a> are included</li>
                        </ul>
                    <li>rate in $ and € is missing</li>
                    <ul>
                        <li>might be added in future</li>
                    </ul>
                </ul>
                <FormGroup controlId="address" className={this.state.formErrors['address'].length > 0 ? 'has-error' : ''}>
                    <ControlLabel>Public Address</ControlLabel>
                    <FormControl id="address" name="address"
                        type="text"
                        value={this.state.address || ''}
                        onChange={this.handleInputChange} />
                    <HelpBlock disabled={!this.state.formErrors['address'].length > 0}>{this.state.formErrors['address']}</HelpBlock>
                </FormGroup>
                <Button onClick={() => this.loadTransactions(false)} disabled={ this.state.formErrors['address'].length > 0 || this.state.address.length === 0}
                    style={{marginRight:'5px'}}>
                    Last transactions
                </Button>
                <Button onClick={() => this.loadTransactions(true)} disabled={ this.state.formErrors['address'].length > 0 || this.state.address.length === 0}>
                    All transactions
                </Button>
                <br /><br />
                <Loader show={this.state.harvestLoading || this.state.transactionLoading} message={'loading'}>
                    <Tabs defaultActiveKey={1} id="transactionsTab">
                        <Tab eventKey={1} title="Transfer Transactions">
                            <br />
                            <BootstrapTable data={this.state.transferTransactions} pagination ignoreSinglePage striped hover condensed exportCSV csvFileName='nem-transactions.csv'>
                                <TableHeaderColumn dataField='timestamp' isKey dataSort width='110'>Timestamp</TableHeaderColumn>
                                <TableHeaderColumn dataField='date' width='130'>Date</TableHeaderColumn>
                                <TableHeaderColumn dataField='sender' width='365'>Sender</TableHeaderColumn>
                                <TableHeaderColumn dataField='recipient' width='365'>Recipient</TableHeaderColumn>
                                <TableHeaderColumn dataField='message' width='200' expandable>Message</TableHeaderColumn>
                                <TableHeaderColumn dataField='fee' width='55'>Fee</TableHeaderColumn>
                                <TableHeaderColumn dataField='amount' width='150'>XEM</TableHeaderColumn>
                                <TableHeaderColumn dataField='mosaics' width='200' dataFormat={mosaicFormatter}>Mosaics (quantity)</TableHeaderColumn>
                                {/*
                                <TableHeaderColumn dataField='xemRateUSD'>Rate in $</TableHeaderColumn>
                                <TableHeaderColumn dataField='xemRateEUR'>Rate in €</TableHeaderColumn>
                                <TableHeaderColumn dataField='totalValueUSD'>Total in $</TableHeaderColumn>
                                <TableHeaderColumn dataField='totalValueEUR'>Total in €</TableHeaderColumn>
                                <TableHeaderColumn dataField='mode' width='95'>Importance</TableHeaderColumn>
                                */}
                            </BootstrapTable>
                        </Tab>
                        <Tab eventKey={3} title="Harvesting Transactions">
                            <br />
                            <BootstrapTable data={this.state.harvestedTransactions} pagination ignoreSinglePage striped hover condensed exportCSV csvFileName='nem-harvested-fees.csv'>
                                <TableHeaderColumn dataField='timestamp' isKey dataSort>Timestamp</TableHeaderColumn>
                                <TableHeaderColumn dataField='date'>Date</TableHeaderColumn>
                                <TableHeaderColumn dataField='block' >Block</TableHeaderColumn>
                                <TableHeaderColumn dataField='totalFee'>Fees earned</TableHeaderColumn>
                                {/*
                                <TableHeaderColumn dataField='xemRateUSD'>Rate in $</TableHeaderColumn>
                                <TableHeaderColumn dataField='xemRateEUR'>Rate in €</TableHeaderColumn>
                                <TableHeaderColumn dataField='totalProfitUSD'>Total in $</TableHeaderColumn>
                                <TableHeaderColumn dataField='totalProfitEUR'>Total in €</TableHeaderColumn>
                                */}
                            </BootstrapTable>
                        </Tab>
                    </Tabs>
                </Loader>
            </div>
        );
    }
}
export default Transactions;