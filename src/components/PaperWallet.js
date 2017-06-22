import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import comingSoon from '../assets/coming-soon.png'

class PaperWallet extends Component {
    render() {
        return (
            <div id="paperwallet">
                <div>
                    <img src={comingSoon} alt=""/>
                </div>
            </div>
        );
    }
}
export default PaperWallet;