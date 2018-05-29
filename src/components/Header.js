import React, { Component } from 'react'

const roleHeader = {
    0: '',
    1: ' for you',
    2: ' companies',
    3: '',
}

class Header extends Component {

    render() {
        return (
            <nav className="navbar pure-menu pure-menu-horizontal">
                <a href="#" className="pure-menu-heading pure-menu-link">trad(e){roleHeader[this.props.currentRole]}</a>
            </nav>
        )
    }
}

export default Header