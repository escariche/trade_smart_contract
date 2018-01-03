App = {
    web3Provider: null,
    contracts: {},

    init: function() {
        // Load users.
        $.getJSON('../users.json', function(data) {
            var usersRow = $('#usersRow');
            var userTemplate = $('#userTemplate');

            for (i = 0; i < data.length; i ++) {
                userTemplate.find('.panel-title').text(data[i].name);
                userTemplate.find('img').attr('src', data[i].picture);
                userTemplate.find('.user-data-type').text(data[i].dataType);
                userTemplate.find('.user-age').text(data[i].age);
                userTemplate.find('.user-location').text(data[i].location);
                userTemplate.find('.btn-subs').attr('data-id', data[i].id);
                userTemplate.find('.btn-cancel').attr('data-id', data[i].id);

                usersRow.append(userTemplate.html());
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

            // Use our contract to retrieve and mark the subscribed users
            return App.markSubscribed();
        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', '.btn-subs', App.handleSubscription);
        $(document).on('click', '.btn-cancel', App.handleUnsubscription);
        $(document).on('click', '.btn-prod', App.handleProducers);
    },

    markSubscribed: function(producers, account) {
        var subscriptionInstance;

        App.contracts.Subscription.deployed().then(function(instance) {
            subscriptionInstance = instance;

            return subscriptionInstance.getProducers.call();
        }).then(function(producers) {
            for (i = 0; i < producers.length; i++) {
                if (producers[i] !== '0x0000000000000000000000000000000000000000') {
                    $('.panel-user').eq(i).find('button.btn-default').text('Already a subscriber').attr('disabled', true);
                    $('.panel-user').eq(i).find('button.btn-danger').attr('disabled', false);
                }
            }
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    markUnsubscribed: function(producers, account) {
        var subscriptionInstance;

        App.contracts.Subscription.deployed().then(function(instance) {
            subscriptionInstance = instance;

            return subscriptionInstance.getProducers.call();
        }).then(function(producers) {
            for (i = 0; i < producers.length; i++) {
                if (producers[i] == '0x0000000000000000000000000000000000000000') {
                    $('.panel-user').eq(i).find('button.btn-default').text('Subscribe').attr('disabled', false);
                    $('.panel-user').eq(i).find('button.btn-danger').attr('disabled', true);

                }
            }
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    handleSubscription: function(event) {
        event.preventDefault();

        var userId = parseInt($(event.target).data('id'));

        var subscriptionInstance;

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }
            console.log("This are the accounts: " + accounts);
            var account = accounts[0];
            console.log("This is my account[0]: " + account);

            App.contracts.Subscription.deployed().then(function(instance) {
                subscriptionInstance = instance;

                // Execute subscribe as a transaction by sending account
                return subscriptionInstance.subscribe(userId, {from: account});
            }).then(function(result) {
                console.log("Result of subscription: " + result);
                $.post('http://ec2-13-59-190-223.us-east-2.compute.amazonaws.com:3000/inbox/subscription' + account +"FROM"+ userId , {});
                return App.markSubscribed();
            }).catch(function(err) {
                console.log(err.message);
            });
        });
    },

    handleUnsubscription: function(event) {
        event.preventDefault();

        var userId = parseInt($(event.target).data('id'));

        var subscriptionInstance;

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }
            console.log("This are the accounts: " + accounts);
            var account = accounts[0];
            console.log("This is my account[0]: " + account);

            App.contracts.Subscription.deployed().then(function(instance) {
                subscriptionInstance = instance;

                // Execute unsubscribe as a transaction by sending account
                console.log("Prior to .unsubscribe() " + account + " from " + userId);
                return subscriptionInstance.Unsubscribe(userId, {from: account});
            }).then(function(result) {
                console.log("Result of unsubscription: " + result);
                $.post('http://ec2-13-59-190-223.us-east-2.compute.amazonaws.com:3000/inbox/unsubscription' + account +"FROM"+ userId , {});
                return App.markUnsubscribed();
            }).catch(function(err) {
                console.log(err.message);
            });
        });
    },

    handleProducers: function(event) {
        event.preventDefault();

        //var userId = parseInt($(event.target).data('id'));

        var subscriptionInstance;

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }
            console.log("Accounts: \n");
            for (i = 0; i < accounts.length; i++) {
                console.log(i + ": " +  accounts[i] + '\n');
            }

            App.contracts.Subscription.deployed().then(function(instance) {
                subscriptionInstance = instance;
                // Execute unsubscribe as a transaction by sending account
                return subscriptionInstance.getProducers();
            }).then(function(result) {
                console.log("getProducers() result: " + result);
            }).catch(function(err) {
                console.log(err.message);
            });
        });
    },

};

$(function() {
    $(window).load(function() {
        console.log("App.init()");
        App.init();
    });
});
