import React, {Component} from 'react'
import { Table, FormGroup, FormControl, Button, ControlLabel, HelpBlock } from 'react-bootstrap'
import nem from 'nem-sdk'

class AccountInfo extends Component {

  constructor(props) {
        super(props);
        this.state = {
            endpoint: null,
            address: '',
            formErrors: {address: ''},
            calculated: false,
            accountInfo: { address: '', poiScore: '', balance: '', balanceVested: '', harvestedBlocks: '', remoteStatus: '', status: '' }
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateField = this.validateField.bind(this);
        this.showAccountInfo = this.showAccountInfo.bind(this);
        nem.com.requests.supernodes.all().then((res) => {
            this.setState({
                endpoint: nem.model.objects.create("endpoint")("http://" + res.nodes[0].ip, nem.model.nodes.defaultPort)
            });
        }).catch(error => {
            console.error(error);
        });
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

  showAccountInfo() {
    nem.com.requests.account.data(this.state.endpoint, this.state.address.replace(/-/g, "")).then((res) => {
      let accountInfo = this.state.accountInfo;
      accountInfo.address = this.state.address;
      accountInfo.poiScore = nem.utils.format.nemImportanceScore(res.account.importance) + " * 10^-4";
      accountInfo.balance = res.account.balance / 1000000;
      accountInfo.balanceVested = res.account.vestedBalance / 1000000;
      accountInfo.harvestedBlocks = res.account.harvestedBlocks;
      accountInfo.remoteStatus = res.meta.remoteStatus;
      accountInfo.status = res.meta.status;
      this.setState({
        accountInfo: accountInfo,
        calculated: true
      });
    }, function(err) {
      console.error(err);
    });
  }

  render() {
    return (
      <div className="account">
        <form>
          <h3>Account-Information</h3>
          <FormGroup controlId="address" className={this.state.formErrors['address'].length > 0 ? 'has-error' : ''}>
            <ControlLabel>Public Address</ControlLabel>
            <FormControl id="address" name="address"
                type="text"
                value={this.state.address || ''}
                onChange={this.handleInputChange} />
            <HelpBlock disabled={!this.state.formErrors['address'].length > 0}>{this.state.formErrors['address']}</HelpBlock>
          </FormGroup>
          <Button onClick={() => this.showAccountInfo()} disabled={this.state.endpoint == null || this.state.formErrors['address'].length > 0 || this.state.address.length === 0}>
              Load account information
          </Button>
          <br /><br />
          <Table responsive>
            <tbody>
              <tr>
                <td><b>Address</b></td>
                <td>{this.state.accountInfo['address']}</td>
              </tr>
              <tr>
                <td><b>POI-Score</b></td>
                <td>{this.state.accountInfo['poiScore']}</td>
              </tr>
              <tr>
                <td><b>Balance</b></td>
                <td>{this.state.accountInfo['balance']}</td>
              </tr>
              <tr>
                <td><b>Balance (vested)</b></td>
                <td>{this.state.accountInfo['balanceVested']}</td>
              </tr>
              <tr>
                <td><b>Harvested Blocks</b></td>
                <td>{this.state.accountInfo['harvestedBlocks']}</td>
              </tr>
              <tr>
                <td><b>Remote Status</b></td>
                <td>{this.state.accountInfo['remoteStatus']}</td>
              </tr>
              <tr>
                <td><b>Status</b></td>
                <td>{this.state.accountInfo['status']}</td>
              </tr>
            </tbody>
          </Table>
        </form>
      </div>
    );
  }
}

export default AccountInfo;
