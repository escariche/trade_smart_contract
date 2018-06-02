import React, { Component } from 'react'
import dataMarket from './utils/dataMarket'
/*
import { Router } from 'react-router-dom'
import DataMarketContract from '../build/contracts/DataMarket.json'
import getWeb3 from './utils/getWeb3'
import ContextPanel from './components/ContextPanel'
*/
import web3 from './utils/web3'
import Header from './components/Header'
import InfoPanel from './components/InfoPanel'
import Footer from './components/Footer'
import rolesPath from './rolesPath'

import OwnerView from './views/owner/index'
import UndefinedView from './views/undefined/index'
import UserView from './views/user/index'
import CompanyView from './views/company/index'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'



class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            error: null,
            results: {
                role: -1,
                account: null,
                owner: null,
                contract: null
            },
            currentView: '',
        }
        this.updateAccount = this.updateAccount.bind(this)
        this.updateRole = this.updateRole.bind(this)
        this.updateOwner = this.updateOwner.bind(this)
        this.getOwner = this.getOwner.bind(this)
        this.updateContract= this.updateContract.bind(this)
        this.setView = this.setView.bind(this)
        this.renderView = this.renderView.bind(this)
    }

    componentDidMount() {
        let component = this;

        this.setState({isLoading: true})

        web3.eth.getAccounts(function(error, result) {
            if(error) {
                component.setState({isLoading: false, error: error})
                console.log('Error', error)
            }
            //console.log('Account', result[0])
            component.updateAccount(result[0])

            dataMarket.then(contract => {
                component.updateContract(contract.address)
                component.getOwner(contract, result[0])
                return contract.getMyRole({from:result[0]})
            }).then(role => {
                component.updateRole(role.valueOf())
            })
        })
    }

    getOwner(_contract, _sender){
        //console.log('getOwner Params ', _contract, _sender.toString())
        _contract.superUser.call().then(owner => {
            //console.log('getOwner ', owner)
            return this.updateOwner(owner)
        })
    }

    updateAccount(_account){
        this.setState({isLoading: false})
        this.setState(function(prevState) {
            return {
                results: {
                    ...prevState.results,
                    account: _account,
                }
            }
        });
    }

    updateRole(_role){
        console.log('update role was called', _role)
        this.setState({isLoading: false})
        this.setState(function(prevState)  {
            return {
                results: {
                    ...prevState.results,
                    role: _role,
                }
            }
        })
        this.setView(rolesPath[_role].toString())
    }

    updateOwner(_owner){
        this.setState({isLoading: false})
        this.setState(function(prevState)  {
            return {
                results: {
                    ...prevState.results,
                    owner: _owner,
                }
            }
        });
    }

    updateContract(_contract){
        this.setState({isLoading: false})
        this.setState(function(prevState)  {
            return {
                results: {
                    ...prevState.results,
                    contract: _contract,
                }
            }
        })
    }

    setView(nextView){
        console.log('Next View: ', nextView)
        this.setState({currentView: nextView})
    }

    renderView(){
        //console.log('Render View', this.state.currentView)
        switch(this.state.currentView) {
            case 'undefined':
                return <UndefinedView
                    contractAddress={this.state.results.contract}
                    currentAccount={this.state.results.account}
                    currentRole={this.state.results.role}
                    modifyRole={(newRole) => {this.updateRole(newRole)}}
                    //modifiewView={(view)=>{this.setState({currentView: view})}}
                    //currentView={this.state.currentView}
                />
                //break
            case 'user':
                return <UserView
                    currentAccount={this.state.results.account}
                    currentRole={this.state.results.role}
                    modifyRole={(newRole) => {this.updateRole(newRole)}}
                />
                //break
            case 'company':
                return <CompanyView
                    currentAccount={this.state.results.account}
                    currentRole={this.state.results.role}
                    modifyRole={(newRole) => {this.updateRole(newRole)}}
                />
                //break
            case 'owner':
                return <OwnerView />
                //break
            default:
                return <p>Not found</p>
                //break
        }
    }

    render() {
        //console.log(this.state)
        return (
            <div className="App">
                <Header
                    className={'text-center'}
                    currentRole={this.state.results.role}
                />
                <main className="">
                    <div className="pure-g">
                        <div className="pure-u-1-1">
                            <InfoPanel error={this.state.error}
                                       isLoading={this.state.isLoading}
                                       results={this.state.results}
                                       account={this.state.results.account}
                                       role={this.state.results.role}/>


                            <div>
                                { this.renderView() }
                            </div>
                        </div>
                    </div>
                </main>
                <Footer owner={this.state.results.owner} contract={this.state.results.contract}/>
            </div>
        );
    }
}

/*
                return <UndefinedView name={this.state.name} age='76' changeView={ (newName) => this.setState({name: newName})} />

<div onClick={() => this.setView('A')}>Hello A</div>
                            <div onClick={() => this.setView('B')}>Hello B</div>
                            <div onClick={() => this.setView('C')}>Hello C</div>

 */


export default App
