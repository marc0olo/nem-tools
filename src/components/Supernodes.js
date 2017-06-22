import React, {Component} from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import nem from 'nem-sdk'

class Supernodes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            supernodes: []
        };
        nem.com.requests.supernodes.all().then((res) => {
            this.setState({
                supernodes: res.nodes,
            });
        }).catch(error => {
            console.error(error);
        });
    }

    render() {
        return (
            <div className="supernodes">
                NEM supernodes in total: <b>{this.state.supernodes.length}</b>
                <br /><br />
                <BootstrapTable data={this.state.supernodes} pagination ignoreSinglePage striped hover condensed exportCSV csvFileName='nem-supernodes.csv'>
                    <TableHeaderColumn dataField='id' isKey>#</TableHeaderColumn>
                    <TableHeaderColumn dataField='alias'>Alias</TableHeaderColumn>
                    <TableHeaderColumn dataField='ip'>IP / Hostname</TableHeaderColumn>
                    <TableHeaderColumn dataField='latitude'>Latitude</TableHeaderColumn>
                    <TableHeaderColumn dataField='longitude'>Longitude</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}
export default Supernodes;