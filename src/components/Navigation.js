import React, {Component} from 'react'
import { Navbar, NavItem, Nav } from 'react-bootstrap'
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

    render() {
        return (
            <Navbar inverse collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/">NEM-tools</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <LinkContainer to="/transactions">
                            <NavItem eventKey={0}>Transactions</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/account">
                            <NavItem eventKey={1}>Account</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/calculator">
                            <NavItem eventKey={2}>Vested XEM Calculator</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/supernodes">
                            <NavItem eventKey={3}>Supernodes</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/buy">
                            <NavItem eventKey={4}>Buy XEM</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/links">
                            <NavItem eventKey={5}>Link Collection</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/supplychain">
                            <NavItem eventKey={6}>SupplyChain *WIP*</NavItem>
                        </LinkContainer>
                    </Nav>
                    <Nav pullRight>
                        <NavItem onClick={() => this.toggleDonationModal()}>Donate</NavItem>
                        <Donation show={this.state.showDonation} onHide={this.toggleDonationModal} />
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Navigation;
