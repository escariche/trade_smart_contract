import React, { Component } from 'react';
//import DataMarketContract from '../../../build/contracts/DataMarket.json';
//import ContextPanel from '../../components/ContextPanel'
import dataMarket from "../../utils/dataMarket";
//import web3 from "../../utils/web3";
import '../../App.css'

//({name, age, changeView}) => {
class UserView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            error: null,
            results: {
                companies: {
                    list: null,
                    total: null
                },
                clients: null
            }
        }
        this.updateCompanies = this.updateCompanies.bind(this)
        this.listCompanies = this.listCompanies.bind(this)
        this.updateClients= this.updateClients.bind(this)
        this.checkClients = this.checkClients.bind(this)
        this.checkRole = this.checkRole.bind(this)
        this.logOut = this.logOut.bind(this)
    }

    componentDidMount() {
        //let component = this;

        this.setState({isLoading: true})

        dataMarket.then(contract => {
            console.log('Contract', contract)
            return contract.getAllCompanies.call({from:this.props.currentAccount})
        }).then(companies => {
            console.log('contract.getAllCompanies.call()', companies)
            this.updateCompanies(companies)
            this.checkClients(companies)
        })
        //console.log('App DM', dataMarket)

    }

    updateCompanies(newCompanies){
        this.setState({isLoading: false})
        this.setState(function(prevState)  {
            return {
                results: {
                    ...prevState.results,
                    companies: { list: newCompanies,
                        total: newCompanies.length
                    }
                }
            }
        })
    }

    checkClients(companies) {
        //var component = this
        var clients = []
        for ( var i in companies) {
            dataMarket.then(contract => {
                return contract.isClient(companies[i])
            }).then(isClient => {
                if (isClient) {
                    console.log('client of nah?', isClient)
                    clients.push(companies[i])
                    return
                }
                return
            })
        }
        this.updateClients(clients)
    }

    updateClients(newClients){
        this.setState({isLoading: false})
        this.setState(function(prevState)  {
            return {
                results: {
                    ...prevState.results,
                    clients: newClients,
                }
            }
        })
    }

    listCompanies() {
        var toRender = []
        for ( var i in this.state.results.companies.list) {
            toRender.push(
                <p key={i} className={'agentPanel'}>
                    {this.state.results.companies.list[i]}
                </p>)
        }
        return toRender
    }

    logOut(){
        this.setState({isLoading: true})
        dataMarket.then(contract => {
            return contract.removeUser({from:this.props.currentAccount})
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
                <div className="block">
                    COMPANIES
                    <div>
                        { this.state.error != null && <p> Error: {this.state.error }</p>}
                        {this.state.results.companies != null && <p>Total: {this.state.results.companies.total}</p>}
                        {this.state.results.companies === null ? <p> No companies to show </p> :
                            this.state.results.companies.total === 0 ? <p>No companies for now</p>:
                                <div>Companies available:
                                    <ul>
                                        {this.listCompanies()}
                                    </ul>
                                </div>}
                        {this.state.results.clients === null ? <p> No clients to show </p> :
                            this.state.results.clients.length === 0 ? <p>No clients for now</p>:
                                <div>My Clients:
                                    <ul>
                                        {this.listClients()}
                                    </ul>
                                </div>}
                    </div>
                </div>
                <div className='block' onClick={() => this.logOut()}> <p>Stop enjoying trad(e)</p></div>

            </div>
        )
    }

}

//<div onClick={() => changeView('JAivi')}><p>Component A {name}{age}</p></div>
export default UserView