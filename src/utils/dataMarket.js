import DataMarketContract from '../../build/contracts/DataMarket.json'
//import getWeb3 from './getWeb3'
import web3 from './web3'

const contract = require('truffle-contract')
const dataMarket = contract(DataMarketContract)


dataMarket.setProvider(web3.currentProvider)
//dataMarket.defaults({ from : web3.eth.accounts[0] })

export default dataMarket.deployed().then((instance) => {
//const dataMarketInstance = dataMarket.deployed().then((instance) => {
    //console.log('Inside dataMarketInstance, instance', instance)
    //console.log('Inside dataMarketInstance, contract', instance.contract)
    return instance
});

//export default dataMarketInstance;

