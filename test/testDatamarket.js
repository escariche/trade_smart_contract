const assert = require('assert');
const expect = require('chai').expect;
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
const web3 = new Web3(provider);

const DataMarket = artifacts.require('../contracts/DataMarket.sol');

let dm
let accounts

contract ('DataMarket', () => {

    beforeEach(async () => {
        dm = await DataMarket.new()
        accounts = await web3.eth.getAccounts(
            function(err, res){
                //console.log(res);
                return res});
    });


    it('deploys a contract', async () => {
        let dama = await DataMarket.deployed();
        //console.log('Contract Address', dama.address);
        assert.ok(dama.address);
    });

    it('gets accounts', async () => {
        web3.eth.getAccounts(function(err, accounts){
            //console.log('Test user: ', accounts[9])
            //console.log('Test comp: ', accounts[8])
            assert.equal(accounts.length, 10, 'Accounts not retrieved correctly');
        });
    });

    it('new User', async () => {
        web3.eth.getAccounts(function(err, accounts){
            DataMarket.deployed().then(dama => {
                //console.log('DAMA', dama)
                return dama.addUser({from:accounts[9]})
            }).then(res => {
                assert.equal(res.receipt.status, 1, 'User not added');
            });
        });
    });

    it('new Company', async () => {
        web3.eth.getAccounts(function(err, accounts){
            DataMarket.deployed().then(dama => {
                //console.log('DAMA', dama)
                return dama.addCompany({from:accounts[8]})
            }).then(res => {
                assert.equal(res.receipt.status, 1, 'User not added');
            });
        });
    });

    it('check Roles', async () => {
        let user
        let company
        let undef
        web3.eth.getAccounts(function(err, accounts){
            user = accounts [9]
            company = accounts [8]
            undef = accounts [7]

            //USER
            DataMarket.deployed().then(dama => {
                return dama.getMyRole({from: user})
            }).then(role => {
                //console.log ('Get user role: ', role.valueOf())
                assert.equal(role.valueOf(), 1, 'User Role not good')
            });
            //COMPANY
            DataMarket.deployed().then(dama => {
                return dama.getMyRole({from: company })
            }).then(role => {
                //console.log ('Get user role: ', role.valueOf())
                assert.equal(role.valueOf(), 2, 'Comp Role not good')
            });
            //UNDEFINED
            DataMarket.deployed().then(dama => {
                return dama.getMyRole({from: undef })
            }).then(role => {
                //console.log ('Get user role: ', role.valueOf())
                assert.equal(role.valueOf(), 0, 'Undefined Role not good')
            });
        });
    });

    it('check users', async () => {
        web3.eth.getAccounts(function(err, accounts){

            DataMarket.deployed().then(dama => {
                return dama.getAllUsers({from:accounts[8]})
            }).then(user => {
                //console.log ('Get user: ', user)
                assert.equal(user, accounts[9], 'Did not get all users')
            });
        });
    });

    it('check companies', async () => {
        web3.eth.getAccounts(function(err, accounts){
            DataMarket.deployed().then(dama => {
                return dama.getAllCompanies({from:accounts[9]})
            }).then(company => {
                //console.log ('Get comp: ', company)
                assert.equal(company, accounts[8], 'Did not get all companies')
            });
        });
    });

    it('set subscription', async () => {
        let usr
        let cmp
        web3.eth.getAccounts(function(err, accounts){
            usr = accounts[9]
            cmp = accounts[8]
            DataMarket.deployed().then(dama => {
                return dama.setSubs(cmp, {from:accounts[9]})
            }).then(res => {
                //console.log ('SET SUBS: ', res)
                assert.equal(res.receipt.status, 1, 'User not added');
            });
        });
    });

    it('check subscription', async () => {
        let usr
        let cmp
        web3.eth.getAccounts(function(err, accounts){
            usr = accounts[9]
            cmp = accounts[8]

            DataMarket.deployed().then(dama => {
                return dama.isClient(cmp, {from:accounts[9]})
            }).then(res => {
                assert.equal(res, true, 'Is client did not work');
            });

            DataMarket.deployed().then(dama => {
                return dama.isSupplier(usr, {from:accounts[8]})
            }).then(res => {
                assert.equal(res, true, 'Is supplier did not work');
            });
        });
    });

    it('check cancel subscription', async () => {
        let usr
        let cmp
        web3.eth.getAccounts(function(err, accounts){
            usr = accounts[9]
            cmp = accounts[8]

            DataMarket.deployed().then(dama => {
                return dama.cancelSubs(cmp, {from:usr})
            }).then(res => {
                assert.equal(res.receipt.status, true, 'Cancel subs did not work');
            });

            DataMarket.deployed().then(dama => {
                return dama.isSupplier(usr, {from: cmp})
            }).then(res => {
                assert.equal(res, false, 'Is supplier did not work');
            });
        });
    });

    it('change of role', async () => {
        let agent
        web3.eth.getAccounts(function(error, accounts){
            agent = accounts[5]

            //Check role undef
            DataMarket.deployed().then(dama => {
                return dama.getMyRole({from : agent})
            }).then(role => {
                assert.equal(role, 0, 'Get role 0 in change of role did not work')
            })

            //Add user
            DataMarket.deployed().then(dama => {
                return dama.addUser({from : agent})
            }).then(res => {
                assert.equal(res.receipt.status, 1, 'Add user in change of role did not work')
            })

            //Check role user
            DataMarket.deployed().then(dama => {
                return dama.getMyRole({from : agent})
            }).then(role => {
                assert.equal(role.valueOf(), 1, 'Get role 1 in change of role did not work')
            })

            //Add company
            DataMarket.deployed().then(dama => {
                return dama.addCompany({from : agent})
            }).then(res => {
                assert.equal(res.receipt.status, 1, 'Add company in change of role did not work')
            })

            //Check role company
            DataMarket.deployed().then(dama => {
                return dama.getMyRole({from : agent})
            }).then(role => {
                assert.equal(role, 2, 'Get role 2 in change of role did not work')
            })
        })
    })


});
