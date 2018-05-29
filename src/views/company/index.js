import React, { Component } from 'react';
//import DataMarketContract from '../../../build/contracts/DataMarket.json';
//import getWeb3 from '../../utils/getWeb3';
//import ContextPanel from '../../components/ContextPanel'
import dataMarket from "../../utils/dataMarket";
//import web3 from "../../utils/web3";
import '../../App.css'

class CompanyView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            error: null,
            results: {
                users: {
                    list: null,
                    total: null
                },
                suppliers: null
            }
        }
        this.updateUsers = this.updateUsers.bind(this)
        this.listUsers = this.listUsers.bind(this)
        this.logOut = this.logOut.bind(this)
    }

    componentDidMount() {
        let component = this;

        this.setState({isLoading: true})

        dataMarket.then(contract => {
            console.log('Contract', contract)
            return contract.getAllUsers.call({from:this.props.currentAccount})
        }).then(users => {
            component.updateUsers(users)
        })
    }

    updateUsers(newUsers){
        this.setState({isLoading: false})
        this.setState(function(prevState)  {
            return {
                results: {
                    ...prevState.results,
                    users: { list: newUsers,
                        total: newUsers.length
                    }
                }
            }
        })
    }

    listUsers() {
        var toRender = []
        for (var i in this.state.results.users.list){
            toRender.push(
                <p key={i} className='agentPanel'>
                    {this.state.results.users.list[i]}
                </p>
            )
        }
        return toRender
    }

    logOut(){
        this.setState({isLoading: true})
        dataMarket.then(contract => {
            return contract.removeCompany({from:this.props.currentAccount})
        }).then(result => {
            console.log(result)
            this.checkRole()
        })
    }

    checkRole () {
        dataMarket.then(contract => {
            return contract.getMyRole({from: this.props.currentAccount})
        }).then(role => {
            console.log('Get my role', role)
            this.props.modifyRole(role.valueOf())
        })
    }

    render() {
        return(
            <div>
                <div className='block'>
                    USERS
                    <div>
                        { this.state.error != null && <p> Error: {this.state.error }</p>}
                        {this.state.results.users != null && <p>Total: {this.state.results.users.total}</p>}
                        {this.state.results.users === null ? <p> No users to show </p> :
                            this.state.results.users.total === 0 ? <p>No users for now</p>:
                                <div>Users available:
                                    <ul>
                                        {this.listUsers()}
                                    </ul>
                                </div>}
                        {this.state.results.suppliers === null ? <p> No suppliers to show </p> :
                            this.state.results.suppliers.length === 0 ? <p>No suppliers for now</p>:
                                <div>My suppliers:
                                    <ul>
                                        {this.listSuppliers()}
                                    </ul>
                                </div>}
                    </div>
                </div>
                <div className='block' onClick={() => this.logOut()}> <p>Stop enjoying trad(e)</p></div>
            </div>
        )
    }

}
export default CompanyView