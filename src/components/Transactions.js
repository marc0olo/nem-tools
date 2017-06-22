import React, {Component} from 'react'
import { Tabs, Tab, FormGroup, FormControl, Button, ControlLabel, HelpBlock } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import Loader from 'react-loader-advanced'
import nem from 'nem-sdk'

class Transactions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            endpoint: nem.model.objects.create("endpoint")("https://" + san.nem.ninja, 7891), // https://nis.wnsl.biz (spizzerb)
            address: '',
            formErrors: {address: ''},
            harvestLoading: false,
            transactionLoading: false,
            regularTransactions: [],
            harvestedTransactions: []
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateField = this.validateField.bind(this);
        this.loadTransactions = this.loadTransactions.bind(this);
        /*
        nem.com.requests.supernodes.all().then((res) => {
            this.setState({
                endpoint: nem.model.objects.create("endpoint")("http://" + res.nodes[0].ip, nem.model.nodes.defaultPort)
            });
        }).catch(error => {
            console.error(error);
        });
        */
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

    loadTransactions() {
        this.setState({
            transactionLoading: true,
            harvestLoading: true
        });
        nem.com.requests.account.harvestedBlocks(this.state.endpoint, this.state.address.replace(/-/g, "")).then((res) => {
            let harvestedBlocks = [];
            res.forEach((element) => {
                harvestedBlocks.push(this.transformHarvestedTransaction(element));
            });
            this.setState({
                harvestedTransactions: harvestedBlocks,
                harvestLoading: false
            });
        }, function(err) {
            console.error(err);
        });
        nem.com.requests.account.allTransactions(this.state.endpoint, this.state.address.replace(/-/g, "")).then((res) => {
            let transactions = [];
            res.forEach((element) => {
                transactions.push(this.transformTransaction(element.transaction));
            });
            this.setState({
                regularTransactions: transactions,
                transactionLoading: false
            });
        }, function(err) {
            console.error(err);
        });
    }

    isNumber (o) {
        return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
    }

    formatValue(value) {
        return value !== undefined && this.isNumber(value) ? value / 1000000 : '';
    }

    getRealTimestamp(secondsSinceNemesis) {
        let nemesis = Date.UTC(2015, 2, 29, 0, 6, 25);
        let o = secondsSinceNemesis;
        let t = nemesis + o * 1000;
        return t;
    }

    getFormattedDate(timestamp) {
        return new Date(timestamp).toUTCString();
    }

    transformTransaction(transaction) {
        let transformedTx = {};
        // let response = this.getHistoricalPrice(this.getRealTimestamp(transaction.timeStamp));
        transformedTx.amount = this.formatValue(transaction.amount);
        // transformedTx.xemRateUSD = response.XEM.USD;
        // transformedTx.xemRateEUR = response.XEM.EUR;
        // transformedTx.totalValueUSD = response.XEM.USD * Number(transformedTx.amount);
        // transformedTx.totalValueEUR = response.XEM.EUR * Number(transformedTx.amount);
        transformedTx.timestamp = this.getRealTimestamp(transaction.timeStamp);
        transformedTx.date = this.getFormattedDate(transformedTx.timestamp);
        transformedTx.sender = nem.utils.format.pubToAddress(transaction.signer, nem.model.network.data.mainnet.id);
        transformedTx.recipient = transaction.recipient;
        transformedTx.message = nem.utils.format.hexMessage(transaction.message);
        transformedTx.fee = this.formatValue(transaction.fee);
        transformedTx.mode = nem.utils.format.importanceTransferMode(transaction.mode);
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
        transformedHarvestTx.date = this.getFormattedDate(transformedHarvestTx.timestamp);
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
        return (
            <div className="transactions">
                <h3>View and export your transactions to csv</h3>
                <b>Current limitations (will be added in future)</b>
                <ul>
                    <li>Mosaics-Transfers are currently not displayed</li>
                    <li>rate in $ and € is missing</li>
                    <ul>
                        <li>here I hope that cryptocompare will change its API so that one can get the total price-history of a specific currency</li>
                        <li>at this time we would have to run an API call for each timestamp</li>
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
                <Button onClick={() => this.loadTransactions()} disabled={this.state.endpoint == null || this.state.formErrors['address'].length > 0 || this.state.address.length === 0}>
                    Load transactions
                </Button>
                <br /><br />
                <Loader show={this.state.harvestLoading || this.state.transactionLoading} message={'loading'}>
                    <Tabs defaultActiveKey={1} id="transactionsTab">
                        <Tab eventKey={1} title="Regular Transactions">
                            <br />
                            <BootstrapTable data={this.state.regularTransactions} pagination ignoreSinglePage striped hover condensed exportCSV csvFileName='nem-transactions.csv'>
                                <TableHeaderColumn dataField='timestamp' isKey dataSort width='110'>Timestamp</TableHeaderColumn>
                                <TableHeaderColumn dataField='date' width='210'>Date</TableHeaderColumn>
                                <TableHeaderColumn dataField='sender' width='365'>Sender</TableHeaderColumn>
                                <TableHeaderColumn dataField='recipient' width='365'>Recipient</TableHeaderColumn>
                                <TableHeaderColumn dataField='message' width='200' expandable>Message</TableHeaderColumn>
                                <TableHeaderColumn dataField='fee' width='55'>Fee</TableHeaderColumn>
                                <TableHeaderColumn dataField='amount' width='200'>Amount (XEM)</TableHeaderColumn>
                                {/*
                                <TableHeaderColumn dataField='xemRateUSD'>Rate in $</TableHeaderColumn>
                                <TableHeaderColumn dataField='xemRateEUR'>Rate in €</TableHeaderColumn>
                                <TableHeaderColumn dataField='totalValueUSD'>Total in $</TableHeaderColumn>
                                <TableHeaderColumn dataField='totalValueEUR'>Total in €</TableHeaderColumn>
                                */}
                                <TableHeaderColumn dataField='mode' width='95'>Importance</TableHeaderColumn>
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