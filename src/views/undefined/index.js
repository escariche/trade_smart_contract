import React, { Component } from 'react';
/*
import DataMarketContract from '../../../build/contracts/DataMarket.json';
import getWeb3 from '../../utils/getWeb3';
import ContextPanel from '../../components/ContextPanel'
import web3 from "../../utils/web3";
import App from '../../App'
import rolesPath from "../../rolesPath";
*/
import dataMarket from "../../utils/dataMarket";



class UndefinedView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            error: null,
        }

        this.checkRole= this.checkRole.bind(this)
        /*
        this.updateRole = this.updateRole.bind(this)
        this.updateAccount = this.updateAccount.bind(this)
        this.setView = this.setView.bind(this)
        this.renderView = this.renderView.bind(this)
        this.updateOwner = this.updateOwner.bind(this)
        this.getOwner = this.getOwner.bind(this)
        this.updateContract= this.updateContract.bind(this)
*/
    }

    componentDidMount() {
        this.setState({isLoading: true})
        this.checkRole()
    }

    becomeUser () {
        console.log('becomeUser')
        //let component = this;

        this.setState({isLoading: true})

        dataMarket.then(contract => {
            //console.log('Contract', contract)
            //console.log(result[0])
            //component.updateAccount(result[0])
            return contract.addUser({from: this.props.currentAccount})
        }).then(result => {
            console.log('adduser result', result)
            this.checkRole()
        })
    }

    becomeCompany () {
        console.log('becomeCompany')

        this.setState({isLoading: true})

        dataMarket.then(contract => {
            //console.log('Contract', contract)
            return contract.addCompany({from: this.props.currentAccount})
        }).then(result => {
            console.log('addCompany result', result)
            this.checkRole()
        })
    }

    checkRole () {
        dataMarket.then(contract => {
            console.log('checkRole() - account', this.props.currentAccount)
            console.log('checkRole() - contract', contract)

            return contract.getMyRole({from: this.props.currentAccount})
        }).then(role => {
            console.log('Get my role', role)
            console.log('Get my role.valuOf()', role.valueOf())
            this.props.modifyRole(role.valueOf())
        })
    }

    render () {
        return(
            <div>
                <div className={'block'}>
                    <p>Choose your role: </p>
                    <div className='btn btn-default' onClick={() => this.becomeUser()}> <p>Become user</p></div>
                    <div className='btn btn-default' onClick={() => this.becomeCompany()}> <p>Become company</p></div>
                </div>
            </div>
        )

    }
}

export default UndefinedView