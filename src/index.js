import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route, Redirect } from 'react-router-dom'
import Navigation from './components/Navigation'
import AccountInfo from './components/AccountInfo'
import BuyXEM from './components/BuyXEM'
import VestedCalculation from './components/VestedCalculation'
import Donation from './components/Donation'
import SupplyChain from './components/SupplyChain'
import SuperNodes from './components/Supernodes'
import Transactions from './components/Transactions'
import LinkCollection from './components/LinkCollection'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

ReactDOM.render(
    <HashRouter>
        <div>
            <Navigation />
            <Route exact path="/" render={() => (<Redirect to="/transactions"/>)} />
            <Route path="/transactions" component={Transactions} />
            <Route path="/account" component={AccountInfo} />
            <Route path="/calculator" component={VestedCalculation} />
            <Route path="/buy" component={BuyXEM} />
            <Route path="/supernodes" component={SuperNodes} />
            <Route path="/links" component={LinkCollection} />
            <Route path="/supplychain" component={SupplyChain} />
            <Route path="/donate" component={Donation} />
        </div>
    </HashRouter>, document.getElementById("root"));
registerServiceWorker();
