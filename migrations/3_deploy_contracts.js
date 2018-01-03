var Adoption = artifacts.require("Adoption");
var Subscription = artifacts.require("Subscription");
module.exports = function(deployer) {
    deployer.deploy(Adoption);
    deployer.deploy(Subscription);
};