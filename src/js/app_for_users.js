
App2 = {
    web3Provider: null,
    contracts: {},

    init: function() {
        console.log("Beginning of function init")
        // Load companies.
        $.getJSON('../companies.json', function(data) {
            console.log(data);
            var companiesRow = $('#companiesRow');
            var companyTemplate = $('#companyTemplate');

            for (i = 0; i < data.length; i ++) {
                companyTemplate.find('.panel-title').text(data[i].name);
                companyTemplate.find('img').attr('src', data[i].picture);
                //companyTemplate.find('.company-data-type').text(data[i].dataType);
                //companyTemplate.find('.company-age').text(data[i].age);
                companyTemplate.find('.company-location').text(data[i].location);
                companyTemplate.find('.btn-subs').attr('data-id', data[i].id);

                companiesRow.append(companyTemplate.html());
            }
        });

        return App2.initWeb3();
    },

    initWeb3: function() {
        // Is there an injected web3 instance?
        if (typeof web3 !== 'undefined') {
            App2.web3Provider = web3.currentProvider;
        } else {
            // If no injected web3 instance is detected, fall back to Ganache
            App2.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App2.web3Provider);

        return App2.initContract();
    },

    initContract: function() {

        $.getJSON('Subscription.json', function(data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            var SubscriptionArtifact = data;
            App2.contracts.Subscription = TruffleContract(SubscriptionArtifact);

            // Set the provider for our contract
            App2.contracts.Subscription.setProvider(App2.web3Provider);

            // Use our contract to retrieve and mark the subscribed companies
            return App2.markSubscribed();
        });

        return App2.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', '.btn-subs', App2.handleAdopt);
    },

    markSubscribed: function(producers, account) {
        var subscriptionInstance;

        App2.contracts.Subscription.deployed().then(function(instance) {
            subscriptionInstance = instance;

            return subscriptionInstance.getProducers.call();
        }).then(function(producers) {
            console.log(producers)
            for (i = 0; i < producers.length; i++) {
                if (producers[i] !== '0x0000000000000000000000000000000000000000') {
                    $('.panel-company').eq(i).find('button').text('Already a subscriber').attr('disabled', true);
                }
            }
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    handleAdopt: function(event) {
        event.preventDefault();

        var companyId = parseInt($(event.target).data('id'));

        var subscriptionInstance;

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }
            console.log("accounts-> " + accounts);
            var account = accounts[0];

            App2.contracts.Subscription.deployed().then(function(instance) {
                subscriptionInstance = instance;

                // Execute subscribe as a transaction by sending account
                return subscriptionInstance.subscribe(companyId, {from: account});
            }).then(function(result) {
                return App2.markSubscribed();
            }).catch(function(err) {
                console.log(err.message);
            });
        });
    }

};

$(function() {
    $(window).load(function() {
        App2.init();
    });
});
