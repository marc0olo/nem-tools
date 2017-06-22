import React, {Component} from 'react'
import comingSoon from '../assets/coming-soon.png'

class SupplyChain extends Component {
    render() {
        return (
            <div id="supplychain">
                <div>
                    <b>Concept:</b> <a href="https://docs.google.com/document/d/1O3uOqGY0krN6_Nw4iZNBu7YIO_36YZbicxmYClrKj6s/edit?usp=sharing" target="_blank" rel="noopener noreferrer">https://docs.google.com/document/d/1O3uOqGY0krN6_Nw4iZNBu7YIO_36YZbicxmYClrKj6s/edit?usp=sharing</a>
                </div>
                <br /><br />
                <div>
                    <img src={comingSoon} alt=""/>
                </div>
            </div>
        );
    }
}
export default SupplyChain;