import React, {Component} from 'react'
import { NavDropdown, Navbar, NavItem, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import Donation from './Donation'

class Navigation extends Component {

    constructor() {
        super();
        this.state = {
            showDonation: false
        }

        this.toggleDonationModal = this.toggleDonationModal.bind(this);
    }

    toggleDonationModal() {
        this.setState({
            showDonation: !this.state.showDonation
        });
    }

    // workaround because of https://github.com/react-bootstrap/react-bootstrap/issues/2365
    openExternalURL(someURL) {
        window.open(someURL);
    }

    render() {
        return (
            <Navbar inverse collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#">NEM-tools</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavDropdown eventKey={0} title="Harvesting" id="basic-nav-dropdown">
                            <LinkContainer to="/harvesting">
                            <NavItem eventKey={0.1}>Automated restart of delegated harvesting</NavItem>
                            </LinkContainer>
                            <LinkContainer to="/calculator">
                                <NavItem eventKey={0.2}>Vested XEM calculator</NavItem>
                            </LinkContainer>
                        </NavDropdown>
                        <LinkContainer to="/transactions">
                            <NavItem eventKey={1}>Transactions</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/account">
                            <NavItem eventKey={2}>Account</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/supernodes">
                            <NavItem eventKey={3}>Supernodes</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/buy">
                            <NavItem eventKey={4}>Buy XEM</NavItem>
                        </LinkContainer>
                        <NavDropdown eventKey={5} title="Work in progress" id="basic-nav-dropdown">
                            <LinkContainer to="/paperwallet">
                            <NavItem eventKey={5.1}>Paperwallet</NavItem>
                            </LinkContainer>
                            <LinkContainer to="/supplychain">
                                <NavItem eventKey={5.2}>SupplyChain (postponed)</NavItem>
                            </LinkContainer>
                        </NavDropdown>
                        <LinkContainer to="/links">
                            <NavItem eventKey={6}>Link Collection</NavItem>
                        </LinkContainer>
                    </Nav>
                    <Nav pullRight>
                        <NavItem onClick={() => this.openExternalURL("https://forum.nem.io/t/new-project-nem-tools/5648")}>Forum discussion</NavItem>
                        <NavItem onClick={() => this.toggleDonationModal()}>Donate</NavItem>1
                        <Donation show={this.state.showDonation} onHide={this.toggleDonationModal} />
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Navigation;
