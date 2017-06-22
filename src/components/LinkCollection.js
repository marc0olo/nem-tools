import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'

class LinkCollection extends Component {
    render() {
        return (
            <div className="linkCollection">
                <h2>Link Collection</h2>
                Here you will find all the stuff you need to learn about the New Economy Movement :-)
                <h3>General Stuff</h3>
                <li><a href="https://forum.nem.io/" target="_blank" rel="noopener noreferrer">NEM-Forum</a></li>
                <li><a href="https://blog.nem.io/faq-en/" target="_blank" rel="noopener noreferrer">FAQ</a></li>
                <li><a href="https://blog.nem.io/nem-tutorial-list/" target="_blank" rel="noopener noreferrer">Tutorials</a>
                    <ul>
                        <li><a href="https://blog.nem.io/the-beginners-guide-to-nem/" target="_blank" rel="noopener noreferrer">Intro Guide for Beginners</a></li>
                        <li><a href="https://blog.nem.io/nanowallet-tutorial/" target="_blank" rel="noopener noreferrer">How to use NanoWallet</a></li>
                    </ul>
                </li>
                <li><a href="http://chain.nem.ninja/" target="_blank" rel="noopener noreferrer">Nembex (Blockexplorer)</a></li>
                <h3>Get XEM (the currency / main-mosaic of NEM)</h3>
                    <LinkContainer to="/buy">
                        <li><a href="">Buy XEM via Changelly</a></li>
                    </LinkContainer>
                    <li><a href="https://blog.nem.io/how-or-where-to-do-i-get-xem/" target="_blank" rel="noopener noreferrer">Other Possibilities (Bounties, Faucets, Funds, Exchanges)</a></li>
                <h3>Stay connected</h3>
                <li><a href="https://nemflash.io/" target="_blank" rel="noopener noreferrer">NEMFLASH (Newspage)</a></li>
                <li><a href="https://twitter.com/NEMofficial" target="_blank" rel="noopener noreferrer">NEM on Twitter</a></li>
                <li><a href="https://www.facebook.com/ourNEM/" target="_blank" rel="noopener noreferrer">NEM on Facebook</a></li>
                <li><a href="https://t.me/nemred" target="_blank" rel="noopener noreferrer">NEM on Telegram</a></li>
                <h3>For Developers</h3>
                <li><a href="https://www.nem.io/ApostilleWhitePaper.pdf" target="_blank" rel="noopener noreferrer">Apostille Whitepaper (Current NEM-Release)</a></li>
                <li><a href="https://nem.io/catapultwhitepaper.pdf" target="_blank" rel="noopener noreferrer">Catapult Whitepaper (Future NEM-Release)</a></li>
                <li><a href="https://www.nem.io/NEM_techRef.pdf" target="_blank" rel="noopener noreferrer">Technical Reference</a></li>
                <li><a href="https://github.com/NemProject" target="_blank" rel="noopener noreferrer">Quellcode</a></li>
                <li><a href="http://bob.nem.ninja/docs/" target="_blank" rel="noopener noreferrer">NIS API's</a></li>
                <li><a href="https://www.nem.io/ncc/index.html" target="_blank" rel="noopener noreferrer">NCC API's</a></li>
                <li><a href="https://rb2nem.github.io/nem-dev-guide/" target="_blank" rel="noopener noreferrer">RB2's Developer Guide</a></li>
                <li><a href="https://github.com/rb2nem/nem-docker" target="_blank" rel="noopener noreferrer">RB2's NEM Docker</a></li>
                <li><a href="https://github.com/QuantumMechanics/NEM-sdk" target="_blank" rel="noopener noreferrer">NEM-sdk</a></li>
                <li><a href="https://github.com/NemProject/NanoWallet" target="_blank" rel="noopener noreferrer">NanoWallet</a></li>
            </div>
        );
    }
}
export default LinkCollection;