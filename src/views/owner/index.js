import React, { Component } from 'react';
//import DataMarketContract from '../../../build/contracts/DataMarket.json';
//import getWeb3 from '../../utils/getWeb3';

import UndefinedView from '../undefined/index'
import CompanyView from '../company/index'
import UserView from '../user/index'

class OwnerView extends Component {

    render() {
        return(
            <div>
                <UndefinedView />
                <UserView />
                <CompanyView />
            </div>
        )
    }
}

export default OwnerView