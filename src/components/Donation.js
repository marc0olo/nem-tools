import React, { Component } from 'react'
import {Modal, Button} from 'react-bootstrap'
import qrCode from '../assets/qr_donation.png'

class Donation extends Component {
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Thank you! :-)</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="qrCode">
                        <img src={qrCode} alt=""/>
                    </div>
                    <div className="address">
                        NBEZ5S43KR7KXPPLW26TK4JPKC6U2GFM6AI6XF6U
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
export default Donation;
