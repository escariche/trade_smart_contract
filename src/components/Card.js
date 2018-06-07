import React, { Component } from 'react'
import '../App.css'
import '../css/bootstrap.min.css'
import dataMarket from "../utils/dataMarket"
import axios from "axios/index";

class Card extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            error: null,
            existingSubscription: false,
            downloadReady: false,
            downloadData: null
        }
        this.isClient = this.isClient.bind(this)
        this.isSupplier= this.isSupplier.bind(this)
        this.checkSubscription = this.checkSubscription.bind(this)
        this.retrieveData = this.retrieveData.bind(this)
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
            component.isClient(this.props.address)
        }else if(this.props.currentRole === '2'){
            component.isSupplier(this.props.address)
        }
    }

    isClient(_address){
        this.setState({isLoading: false})
        dataMarket.then(contract => {
            return contract.isClient(_address, {from : this.props.currentAccount})
        }).then(res => {
            console.log('isClient from card', res)
            this.setState({existingSubscription: res})

        })
    }

    isSupplier(_address){
        this.setState({isLoading: false})
        dataMarket.then(contract => {
            return contract.isSupplier(_address, {from : this.props.currentAccount})
        }).then(res => {
            console.log('isSupplier from card', res)
            this.setState({existingSubscription: res})
        })
    }

    cardHeading(){
        var toRender = []
        switch(this.props.currentRole) {
            //for user
            case '1':
                if (this.state.existingSubscription) {
                    toRender.push(
                        <div className={"address-box"} key={this.props.cardKey}>
                            <p className={"address-box"}>{this.props.address}</p>
                            <div className="btn btn-danger" type="button" onClick={() => this.props.unSubscribe(this.props.address)}>
                                Cancel Subscription
                            </div>
                        </div>)
                } else {
                    toRender.push(
                        <div className={"address-box"} key={this.props.cardKey}>
                            <p className={"address-box"}>{this.props.address}</p>
                            <div className="btn btn-default" type="button" onClick={() => this.props.subscribe(this.props.address)}>
                                Accept subscription
                            </div>
                        </div>)
                }
                break
            //for company
            case '2':
                if (this.state.existingSubscription) {
                    toRender.push(
                        <div className="panel-heading" key={this.props.cardKey}>
                            <p className={"address-box"}>
                                {this.props.address}
                            </p>
                            <greenCheck>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.25 17.292l-4.5-4.364 1.857-1.858 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.643z"/></svg>
                            </greenCheck>
                        </div>)
                } else {
                    toRender.push(
                        <div className="panel-heading" key={this.props.cardKey}>
                            <p className={"address-box"}>
                                {this.props.address}
                            </p>
                            <redCheck>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z"/></svg>
                            </redCheck>
                        </div>)
                }
                break
            default:
                break
        }
        return toRender
    }

    cardBody(){
        var toRender = []
        var loremIpsum ="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam maximus lorem quis lacus interdum feugiat. Aenean tincidunt sapien quis nisi molestie, quis molestie metus varius. Integer sit amet metus vitae felis imperdiet condimentum eget at nisl. Etiam a ipsum nulla. Nam faucibus ante ut magna malesuada aliquet. Fusce porttitor aliquet justo ac molestie. Nulla facilisi. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Proin ut mauris odio. Aenean sed commodo lectus, at lobortis neque. Morbi eleifend venenatis malesuada. In sit amet urna porta, ornare tortor ut, facilisis ligula. Aliquam finibus odio at ex porta egestas. Mauris ac bibendum enim. Proin eget mauris id lorem tincidunt facilisis vel vitae urna.\n" +
            "\n" +
            "Pellentesque eu viverra quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla luctus, ipsum at aliquam facilisis, ante turpis dictum lacus, ut lacinia lectus magna in orci. Quisque eget metus tortor. Donec ac purus ut quam interdum tincidunt sed a sem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse luctus quam porta ornare feugiat. Pellentesque vestibulum, urna nec venenatis tempor, nunc erat luctus quam, eu blandit nulla diam non leo.\n" +
            "\n" +
            "Mauris vel vestibulum mauris. Sed eleifend, nulla non rutrum pulvinar, est neque porttitor erat, ut dapibus risus neque vitae ex. Nam quis massa quis mi luctus bibendum nec quis dui. Nunc placerat auctor nunc, at luctus dui semper non. Ut euismod magna sit amet augue congue, tristique scelerisque ante vehicula. Aliquam sit amet posuere sapien. Duis ac risus et ante tristique semper. Aenean et eros sed nisl semper aliquet. Donec facilisis eros ut vehicula volutpat. Sed id diam sed metus egestas hendrerit. Quisque sollicitudin leo vitae sem posuere, in ultricies dui consequat. Nam suscipit et arcu nec consectetur. Sed aliquam viverra ex vel commodo. Quisque varius tortor sit amet commodo bibendum.\n" +
            "\n" +
            "Duis gravida lacus non erat laoreet, quis condimentum risus vehicula. Nulla accumsan vitae dui eget lacinia. Donec sollicitudin felis nec sagittis ultrices. In congue ac tortor quis lacinia. Pellentesque nisi tellus, mattis non nulla at, gravida facilisis nunc. Morbi ut luctus libero, vel porta nisl. Nulla laoreet vehicula augue, et suscipit massa cursus sed.\n" +
            "\n" +
            "Mauris dignissim condimentum lacus at tristique. Aenean hendrerit ligula in sem lobortis egestas. Quisque vel tincidunt dui, at tempor nibh. Cras semper risus iaculis felis venenatis, id pretium ex venenatis. Ut luctus tincidunt tellus ultricies ultrices. In dignissim rhoncus justo, a fringilla nulla dictum id. Quisque cursus scelerisque enim pretium posuere. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam massa dui, ornare at tincidunt ac, tristique quis velit.\n" +
            "\n"
        switch(this.props.currentRole){
            case '1':
                if(this.state.existingSubscription){
                    toRender.push(
                        <div className="btn btn-default" type="button" onClick={() => this.props.postData(loremIpsum)}>
                            Post data
                        </div>)
                }else{
                    toRender.push(
                        <div>
                            This company is not your client yet.
                        </div>)
                }
                break
            case '2':
                if(this.state.existingSubscription && this.state.downloadReady){
                    var downloadJSON = this.props.address + '.json'
                    toRender.push(
                        <a download={downloadJSON} href={this.state.downloadData}>
                            <div className="btn btn-default" type="button" id="downloadBtn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16 11h5l-9 10-9-10h5v-11h8v11zm1 11h-10v2h10v-2z"/></svg>
                            </div>
                        </a>)
                }else if(this.state.existingSubscription){
                    toRender.push(
                        <div className="btn btn-default" type="button" onClick={() => this.retrieveData(this.props.address)}>
                            Retrieve data
                        </div>)
                }else{
                    toRender.push(
                        <div>
                            This user is not your supplier yet.
                        </div>)
                }
                break
            default:
                break
        }
        return toRender
    }

    retrieveData(_address){
        console.log('Retrieve data from: ', _address)
        const topicURL = 'http://ec2-18-219-179-167.us-east-2.compute.amazonaws.com:3000/' + _address
        axios.get(topicURL).then(response => {
                console.log('Repsonse - Retrieve data from: ', response)
                if (response.status === 200){
                    console.log(response.data)
                    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(response.data));
                    this.setState({downloadReady: true, downloadData: dataStr})

                }
            }
        )
    }

    render(){
        return(
            <div className="col-sm-4">
                <div className="panel panel-default text-center" key={this.props.cardKey}>
                    <div className=" panel-heading">
                        {this.state.isLoading ? <p>Loading...</p>:this.cardHeading()}
                    </div>
                    <div className={'panel-body'}>
                        {this.state.isLoading ? <p>Loading...</p>:this.cardBody()}
                    </div>
                </div>
            </div>
        )
    }

}
export default Card