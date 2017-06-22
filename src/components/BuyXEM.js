import React, { Component } from 'react'
import CryptoCompare from './CryptoCompare'

class BuyXEM extends Component {
    render() {
        return (
            <div className="buyXem">
                <div id="changelly">
                    <h3>Buy via Changelly at the best rates</h3>
                    <iframe src="https://changelly.com/widget/v1?auth=email&from=ETH&to=XEM&merchant_id=2a2088ecb91a&address=&amount=1&ref_id=2a2088ecb91a&color=2f3632"
                        width="600"
                        height="500"
                        className="changelly"
                        scrolling="no"
                        title="changellyWidget"> Can't load widget
                    </iframe>
                </div>
                <div id="cryptoCompare">
                    <h3>Exchange Rate (CryptoCompare)</h3>
                </div>
                <CryptoCompare />
            </div>
        );
    }
}
export default BuyXEM;
