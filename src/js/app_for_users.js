App = {
    web3Provider: null,
    contracts: {},
    companies: [],
    clients: [],

    init: function() {
        // Load companies.
        $.getJSON('../companies.json', function(data) {
            var companiesRow = $('#companiesRow');
            var companyTemplate = $('#companyTemplate');

            for (i = 0; i < data.length; i ++) {
                companyTemplate.find('.panel-company').attr('id', 'panel-company-'+i);
                companyTemplate.find('.panel-title').text(data[i].name);
                companyTemplate.find('img').attr('src', data[i].picture);
                companyTemplate.find('.company-address').text(data[i].eth_account.toLowerCase());
                companyTemplate.find('.company-location').text(data[i].location);
                companyTemplate.find('.btn-subs').attr('data-id', data[i].id);
                companyTemplate.find('.btn-cancel').attr('data-id', data[i].id);
                App.companies[i]= data[i].eth_account.toLowerCase();
                companiesRow.append(companyTemplate.html());
            }
        });
        return App.initWeb3();
    },

    initWeb3: function() {
        // Is there an injected web3 instance?
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
        } else {
            // If no injected web3 instance is detected, fall back to Ganache
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract: function() {

        $.getJSON('Subscription.json', function(data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            var SubscriptionArtifact = data;
            App.contracts.Subscription = TruffleContract(SubscriptionArtifact);

            // Set the provider for our contract
            App.contracts.Subscription.setProvider(App.web3Provider);

            // Use our contract to retrieve and mark the subscribed companies
            return App.markSubscribed();
        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', '.btn-subs', App.handleSubscription);
        $(document).on('click', '.btn-cancel', App.handleUnsubscription);
        $(document).on('click', '.btn-clients', App.handleClients);
    },

    markSubscribed: function(){
        event.preventDefault();

        var subscriptionInstance;

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }
            //console.log("These are the accounts: " + accounts);
            //User account
            var account = accounts[0];

            App.contracts.Subscription.deployed().then(function(instance){
                subscriptionInstance = instance;
                return subscriptionInstance.getClientList(account);
            }).then(function (result) {
                var res_companies = result;
                //console.log("TODO MarkSubscribed: study this response: " + res_companies);

                for (i = 0; i < res_companies.length; i++){
                    for (j = 0; j < App.companies.length; j++){
                        var companyAddr = App.companies[j];
                        //console.log(i + '' + j);
                        if (res_companies[i].toLowerCase() == companyAddr){
                            var panelId = '#panel-company-'+j;
                            var panelCompany = $(panelId);
                            var addressInHTML = panelCompany.find('.company-address')[0].innerHTML;
                            //console.log(panelCompany.find('.company-address')[0].innerHTML);
                            if(addressInHTML == companyAddr){
                                //console.log("eureka");
                                panelCompany.find('button.btn-default').text('Already a subscriber').attr('disabled', true);
                                panelCompany.find('button.btn-danger').attr('disabled', false);
                            }else{
                                panelCompany.find('button.btn-default').text('Subscribe').attr('disabled', false);
                                panelCompany.find('button.btn-danger').attr('disabled', true);
                            }
                        }
                    }
                }
            }).catch(function(err){
                console.log(err);
            });
        });

        /**for (i = 0; i < App.clients.length; i++){
            for (j = 0; j < App.companies.length; j++){
                if (App.clients[i] == App.companies[j]){
                console.log("checking subs: App.companies["+ j + "]:" + App.companies[j]);
                console.log("checking subs: App.clients["+ i + "]:" + App.clients[i]);
                $('.panel-company').eq(i).find('button.btn-default').text('Already a subscriber').attr('disabled', true);
                $('.panel-company').eq(i).find('button.btn-danger').attr('disabled', false);
                }
            }
        }*/
    },

    handleSubscription: function(event) {

        event.preventDefault();

        var companyId = parseInt($(event.target).data('id'));

        var subscriptionInstance;

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }
            console.log("These are the accounts: " + accounts);
            //User account
            var account = accounts[0];
            //Company account
            var companyAcc = App.companies[companyId];

            App.contracts.Subscription.deployed().then(function(instance){
                subscriptionInstance = instance;
                // Execute subscribe as a transaction by sending account
                console.log("Company account: " + companyAcc);
                console.log("User account: " + account);
                return subscriptionInstance.setSubs(account, companyAcc, {from: account});
            }).then(function (result) {
                console.log("TODO: study this response: " + result);
            }).catch(function(err){
                console.log(err);
            });
        });
        App.markSubscribed();
    },

    handleUnsubscription: function(event) {
        event.preventDefault();

        var companyId = parseInt($(event.target).data('id'));

        var subscriptionInstance;

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }
            console.log("These are the accounts: " + accounts);
            //User account
            var account = accounts[0];
            //Company account
            var companyAcc = accounts[companyId+1];

            App.contracts.Subscription.deployed().then(function(instance) {
                subscriptionInstance = instance;
                // Execute unsubscribe as a transaction by sending account
                console.log("Company account: " + companyAcc);
                console.log("User account: " + account);
                return subscriptionInstance.cancelSubs(account, companyAcc, {from: account});
            }).then(function(result) {
                console.log("Result of unsubscription: " + result.valueOf());
                console.log("POST: STOP TRANSMISSION IN KAFKA");
                //$.post('http://ec2-13-59-190-223.us-east-2.compute.amazonaws.com:3000/inbox/unsubscription' + account +"FROM"+ companyId , {});
                return App.markSubscribed();
            }).catch(function(err) {
                console.log(err.message);
            });
        });
        App.markSubscribed();
    },

    handleClients: function(event){
        event.preventDefault();
        var subscriptionInstance;
        web3.eth.getAccounts(function(error, accounts){
            if(error){
                console.log(error);
            }
            var account = accounts[0];
            App.contracts.Subscription.deployed().then(function (instance) {
                subscriptionInstance = instance;
                return subscriptionInstance.getClientList(account,{from: account});
            }).then(function (result){

                console.log("Result of getClients: " + result);
                console.log("Number of clients: " + result.length);
                var clientTemplate= $('#clientTemplate');
                var clientRow = $('#clientRow');
                clientRow.empty();
                clientTemplate.find('.panel-body').find('.client-value').empty();
                if (result.length == 0){
                    clientTemplate.find('.panel-body').find('.client-value').text("You have no clients yet");
                }else{
                    for (i = 0; i < result.length; i++){
                        clientTemplate.find('.panel-body').find('.client-value').append("Client " + i + " : "+ result[i] + "\n");
                    }
                }
                clientRow.append(clientTemplate.html());
            }).catch(function(err) {
                console.log(err);
            });
        });
    }
};

$(function() {
    $(window).load(function() {
        App.init();
        console.log("App.init()");
    });
});
