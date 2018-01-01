import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route, Redirect } from 'react-router-dom'
import Navigation from './components/Navigation'
import AccountInfo from './components/AccountInfo'
import BuyXEM from './components/BuyXEM'
import VestedCalculation from './components/VestedCalculation'
import Harvesting from './components/Harvesting'
import Donation from './components/Donation'
import SupplyChain from './components/SupplyChain'
import SuperNodes from './components/Supernodes'
import Transactions from './components/Transactions'
import LinkCollection from './components/LinkCollection'
import PaperWallet from './components/PaperWallet'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

ReactDOM.render(
    <HashRouter>
        <div>
            <Navigation />
            <Route exact path="/" render={() => (<Redirect to="/harvesting"/>)} />
            <Route path="/harvesting" component={Harvesting} />
            <Route path="/calculator" component={VestedCalculation} />
            <Route path="/account" component={AccountInfo} />
            <Route path="/transactions" component={Transactions} />
            <Route path="/buy" component={BuyXEM} />
            <Route path="/supernodes" component={SuperNodes} />
            <Route path="/links" component={LinkCollection} />
            <Route path="/paperwallet" component={PaperWallet} />
            <Route path="/supplychain" component={SupplyChain} />
            <Route path="/donate" component={Donation} />
        </div>
    </HashRouter>, document.getElementById("root"));
registerServiceWorker();
