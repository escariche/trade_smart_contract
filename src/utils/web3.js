//import getWeb3 from './getWeb3'
import Web3 from 'web3'


let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    // We are in the browser and metamask is running.
    web3 = new Web3(window.web3.currentProvider);
    //console.log('web3', web3)

} else {
    // We are on the server *OR* the user is not running metamask
    var provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')

    web3 = new Web3(provider)
    //console.log('web3', web3)
}


export default web3;

