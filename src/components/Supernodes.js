import Request from 'request'
import React, {Component} from 'react'
import { Tabs, Tab, FormGroup } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

const joda = require('js-joda')

class Supernodes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            supernodes: [],
            freeNodes: []
        };
        let getSupernodes = function(){
            return new Promise((resolve, reject) => {
                var options = {
                    url: 'https://nem-services.herokuapp.com/supernodes',
                    method: 'GET'
                }

                // Start the request
                Request(options, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        resolve(JSON.parse(body));
                    } else {
                        reject(error);
                    }
                });
            });
        };
        getSupernodes().then((allNodes) => {
            let filteredNodes = allNodes.filter(function (nodes) {
                                return nodes.freeSlots > 0;
                            });
            this.setState({
                supernodes: allNodes,
                freeNodes: filteredNodes
            });
        }).catch(error => {
            console.error(error);
        });
    }

    render() {
        function dateFormatter(cell, row) {
            var output = '';
            if ( cell !== undefined ) {
                // output = joda.LocalDateTime.ofInstant(joda.Instant.ofEpochMilli(cell)).toString();
                output = joda.LocalDateTime.ofInstant(joda.Instant.ofEpochMilli(cell)).until(joda.LocalDateTime.now(), joda.ChronoUnit.MINUTES) + ' minutes ago';
            }
            return output
        }

        return (
            <div className="supernodes">
                NEM supernodes in total: <b>{this.state.supernodes.length}</b>
                <br />
                NEM supernodes with free slots: <b>{this.state.freeNodes.length}</b>
                <br /><br />
                <Tabs defaultActiveKey={1} id="supernodesTab">
                    <Tab eventKey={1} title="All supernodes">
                        <br />
                        <BootstrapTable data={this.state.supernodes} pagination ignoreSinglePage striped hover condensed>
                            <TableHeaderColumn dataField='host' isKey>IP / Hostname</TableHeaderColumn>
                            <TableHeaderColumn dataField='alias'>Alias</TableHeaderColumn>
                            <TableHeaderColumn dataField='slotsAvailable'>Slots available</TableHeaderColumn>
                            <TableHeaderColumn dataField='slotsUsed'>Slots used</TableHeaderColumn>
                            <TableHeaderColumn dataField='freeSlots'>Slots free</TableHeaderColumn>
                            <TableHeaderColumn dataField='syncDate' dataFormat={dateFormatter}>Last synced</TableHeaderColumn>
                        </BootstrapTable>
                    </Tab>
                    <Tab eventKey={2} title="Supernodes with free harvesting slots">
                        <br />
                        <BootstrapTable data={this.state.freeNodes} pagination ignoreSinglePage striped hover condensed>
                            <TableHeaderColumn dataField='host' isKey>IP / Hostname</TableHeaderColumn>
                            <TableHeaderColumn dataField='alias'>Alias</TableHeaderColumn>
                            <TableHeaderColumn dataField='slotsAvailable'>Slots available</TableHeaderColumn>
                            <TableHeaderColumn dataField='slotsUsed'>Slots used</TableHeaderColumn>
                            <TableHeaderColumn dataField='freeSlots'>Slots free</TableHeaderColumn>
                            <TableHeaderColumn dataField='syncDate' dataFormat={dateFormatter}>Last synced</TableHeaderColumn>
                        </BootstrapTable>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}
export default Supernodes;