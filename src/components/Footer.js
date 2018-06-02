import React from 'react'
import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'

const Footer = ({owner, contract}) => (
    <footer id="Footer" className={'Footer'}>

        <div className="">
            { contract != null && <p>DataMarket Contract's address: {contract}</p>}

        </div>

    </footer>
)
            /*{ owner != null && <p>DataMarket Contract's super user: {owner}</p>}*/

export default Footer