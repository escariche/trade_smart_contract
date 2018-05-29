import React, { Component } from 'react'
import dataMarket from "../utils/dataMarket"
import web3 from "../utils/web3"
import '../App.css'

const Footer = ({owner, contract}) => (
    <footer id="Footer" className="Footer">

        <div className="listContainer">
            { owner != null && <p>DataMarket Contract's super user: {owner}</p>}
            { contract != null && <p>DataMarket Contract's address: {contract}</p>}

        </div>

    </footer>
)

export default Footer