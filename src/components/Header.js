import React, { Component } from 'react'

const roleHeader = {
    0: '',
    1: ' for you',
    2: ' for business',
    3: '',
}

class Header extends Component {

    render() {
        return (
            <nav className="navbar navbar-default navbar-fixed-top navbar-header h1 text-centre">
                <div class="container">
                    <div class="navbar-header">
                        <a href="" className="pure-menu-heading navbar-header pure-menu-link">trad(e){roleHeader[this.props.currentRole]}</a>
                    </div>
                </div>
            </nav>
        )
    }
}

export default Header