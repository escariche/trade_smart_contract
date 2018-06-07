import React, { Component } from 'react'
import axios from 'axios'

//import DataMarketContract from '../../../build/contracts/DataMarket.json';
//import getWeb3 from '../../utils/getWeb3';
//import ContextPanel from '../../components/ContextPanel'
//import web3 from "../../utils/web3";
import dataMarket from "../../utils/dataMarket";
import Card from '../../components/Card'
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
        this.retrieveData = this.retrieveData.bind(this)
    }

    componentDidMount()  {
        let component = this;

        this.setState({isLoading: true})

        dataMarket.then(contract => {
            console.log('Contract', contract)
            return contract.getAllUsers.call({from:this.props.currentAccount})
        }).then(users => {
            //check for duplicates
            var i,
                len = users.length,
                usersNoDuplicates = [],
                obj = {};
            for (i=0; i<len; i++){
                obj[users[i]]=0;
            }
            for (i in obj) {
                usersNoDuplicates.push(i);
            }
            console.log('contract.getAllUsers.call() without duplicates', usersNoDuplicates)

            component.updateUsers(usersNoDuplicates)
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
                <Card
                    key={i}
                    currentRole={this.props.currentRole}
                    currentAccount={this.props.currentAccount}
                    address={this.state.results.users.list[i]}
                    retrieveData={(_address) => {this.retrieveData(_address)}}
                />
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
            if(result.receipt.status === 1){

                this.checkRole()
            }
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

    retrieveData(_address){
        console.log('Retrieve data from: ', _address)
        const topicURL = 'http://ec2-18-219-179-167.us-east-2.compute.amazonaws.com:3000/' + _address
        axios.get(topicURL).then(response => {
                console.log('Repsonse - Retrieve data from: ', response)
                if (response.status === 200){
                    console.log(response.data)
                    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(response.data));
                    var dlAnchorElem = document.getElementById('downloadBtn');
                    dlAnchorElem.setAttribute("href",     dataStr);
                    dlAnchorElem.setAttribute("download", response.data.topic + ".json");
                    dlAnchorElem.click();
                }
            }
        )
    }

    render() {
        return(
            <div>
                <p>USERS</p>
                <div>
                    { this.state.error != null && <p> Error: {this.state.error}</p>}
                    {this.state.results.users === null ? <p> No users to show </p> :
                        this.state.results.users.total === 0 ? <p>No users for now</p>:
                            <div className={'row'}>
                                {this.listUsers()}
                            </div>}
                    {/*this.state.results.suppliers === null ? <p> No suppliers to show </p> :
                        this.state.results.suppliers.length === 0 ? <p>No suppliers for now</p>:
                            <div>My suppliers:
                                <div className={'panel-default'}>
                                    {this.listSuppliers()}
                                </div>
                            </div>*/}
                    {this.state.results.users != null && <p>Total users on trad(e): {this.state.results.users.total}</p>}
                </div>
                <div className='btn btn-danger' onClick={() => this.logOut()}> <p>Stop enjoying trad(e)</p></div>
            </div>
        )
    }

}
export default CompanyView