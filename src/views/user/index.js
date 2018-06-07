import React, { Component } from 'react'
import axios from 'axios'

//import DataMarketContract from '../../../build/contracts/DataMarket.json';
import Card from '../../components/Card'
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
        this.subscribe = this.subscribe.bind(this)
        this.unsubscribe = this.unsubscribe.bind(this)
    }

    componentDidMount() {
        //let component = this;

        this.setState({isLoading: true})

        dataMarket.then(contract => {
            console.log('Contract', contract)
            return contract.getAllCompanies.call({from:this.props.currentAccount})
        }).then(companies => {
            console.log('contract.getAllCompanies.call() with duplicates', companies)
            //check for duplicates
            var i,
                len = companies.length,
                companiesNoDuplicates = [],
                obj = {};
            for (i=0; i<len; i++){
                obj[companies[i]]=0;
            }
            for (i in obj) {
                companiesNoDuplicates.push(i);
            }
            console.log('contract.getAllCompanies.call() without duplicates', companiesNoDuplicates)

            this.updateCompanies(companiesNoDuplicates)
            this.checkClients(companiesNoDuplicates)
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
                <Card
                    key={i}
                    cardKey={i}
                    currentRole={this.props.currentRole}
                    currentAccount={this.props.currentAccount}
                    address={this.state.results.companies.list[i]}
                    subscribe={(companyAddress) => {this.subscribe(companyAddress)}}
                    unSubscribe={(companyAddress) => {this.unsubscribe(companyAddress)}}
                    postData={(_content) => {this.postData(_content)}}
                />)
        }
        return toRender
    }

    subscribe(companyAddress){
        dataMarket.then(contract => {
            return contract.setSubs(companyAddress, {from: this.props.currentAccount})
        }).then(result => {
            console.log('Result of subscription', result)
        })
    }

    unsubscribe(companyAddress){
        dataMarket.then(contract => {
            return contract.cancelSubs(companyAddress, {from: this.props.currentAccount})
        }).then(result => {
            console.log('Result of unsubscription', result)
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

    logOut(){
        this.setState({isLoading: true})
        dataMarket.then(contract => {
            return contract.removeUser({from:this.props.currentAccount})
        }).then(result => {
            console.log(result)
            this.checkRole()
        })
    }

    postData(_content){
        console.log('Data to post: ', _content)
        const topicURL = 'http://ec2-18-219-179-167.us-east-2.compute.amazonaws.com:3000/'
        const topicName = this.props.currentAccount
        let data = JSON.stringify(
            {topic: topicName,
                value: _content}
        )
        console.log('Data to post json :', data)
        const _data = {topic : topicName,
            value: _content
        }
        axios.post(topicURL,_data).then(response =>{
                console.log('Repsonse - Retrieve data from: ', response)
                if(response.status === 200){
                    alert('Your data was successfully posted to your subscriber!')
                }
            }
        )
    }

    render() {
        return(
            <div className="container-fluid">
                <p>COMPANIES</p>
                <div className={'row'}>
                    { this.state.error != null && <p> Error: {this.state.error }</p>}
                    {this.state.results.companies === null ? <p> No companies to show </p> :
                        this.state.results.companies.total === 0 ? <p>No companies for now</p>:
                            this.listCompanies()
                    }
                </div>
                {this.state.results.companies != null && <p>Total companies on trad(e): {this.state.results.companies.total}</p>}
                <div className='btn btn-danger' onClick={() => this.logOut()}> <p>Stop enjoying trad(e)</p></div>
            </div>
        )
    }

}

//<div onClick={() => changeView('JAivi')}><p>Component A {name}{age}</p></div>
export default UserView