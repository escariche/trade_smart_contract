import React, { Component } from 'react'
import '../App.css'
import '../css/bootstrap.min.css'
import dataMarket from "../utils/dataMarket";

class Card extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            error: null,
            existingSubscription: false
        }
        this.isClient = this.isClient.bind(this)
        this.isSupplier= this.isSupplier.bind(this)
        this.checkSubscription = this.checkSubscription.bind(this)
    }

    componentDidMount() {
        this.setState({isLoading: true})
        this.checkSubscription()
        this.cardHeading = this.cardHeading.bind(this)
        this.cardBody = this.cardBody.bind(this)
    }

    checkSubscription() {
        const component = this
        if(this.props.currentRole === '1'){
            component.isClient(this.props.address, {from:this.props.currentAccount})
        }else if(this.props.currentRole === '2'){
            component.isSupplier(this.props.address, {from:this.props.currentAccount})
        }
    }

    isClient(_address){
        dataMarket.then(contract => {
            return contract.isClient(_address, {from : this.props.currentAccount})
        }).then(res => {
            console.log('isClient from card', res)
            this.setState({isLoading: false})
            this.setState({existingSubscription: res})

        })
    }

    isSupplier(_address){
        dataMarket.then(contract => {
            return contract.isSupplier(_address, {from : this.props.currentAccount})
        }).then(res => {
            console.log('isClient from card', res)
            this.setState({isLoading: false})
            this.setState({existingSubscription: res})
        })
    }

    cardHeading(){
        var toRender = []

        switch(this.props.currentRole) {
            case '1':
                if (this.state.existingSubscription) {
                    toRender.push(<p className="panel-title">{this.props.address} <div className="btn btn-danger" type="button" onClick={() =>this.props.unSubscribe(this.props.address)}>Cancel</div>
                    </p>)
                } else {
                    toRender.push(<p className="panel-title">{this.props.address} <div className="btn btn-default" type="button" onClick={() => this.props.subscribe(this.props.address)}>Accept subscription</div>
                    </p>)
                }
                break
            case '2':
                if (this.state.existingSubscription) {
                    toRender.push(<p className="panel-title">
                        {this.props.address} <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.25 17.292l-4.5-4.364 1.857-1.858 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.643z"/></svg>
                    </p>)
                } else {
                    toRender.push(<p className="panel-title">
                        {this.props.address} <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z"/></svg>
                    </p>)
                }
                break
            default:
                break
        }

        return toRender
    }

    cardBody(){
        var toRender = []
        switch(this.props.currentRole){
            case '1':
                if(this.state.existingSubscription){
                    toRender.push(
                        <div className={'panel-body'}>
                            <div className="btn btn-default" type="button" onClick={() => this.props.postData('e.g. value')}>Post data</div>
                        </div>)
                }
                break
            case '2':
                if(this.state.existingSubscription){
                    toRender.push(
                        <div className={'panel-body'}>
                            <div className="btn btn-default" type="button" onClick={() => this.props.retrieveData(this.props.address)}>Retrieve data</div>
                        </div>)
                }
                break
            default:
                break
        }
        return toRender
    }


    render(){
        return(
            <div className="panel agentPanel panel-default">
                <div className={'panel-heading'}>
                    {this.cardHeading()}
                </div>
                {this.cardBody()}

            </div>
        )
    }

}
export default Card