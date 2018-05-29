var DataMarket = artifacts.require("./DataMarket.sol");

contract('DataMarket', function(accounts) {

  it("Add new user", function() {
    return DataMarket.deployed().then(function(instance) {
        dataMarketInstance = instance;
      return dataMarketInstance.addUser(accounts[0]);
    }).then(function() {
      return dataMarketInstance.isUserActive.call();
    }).then(function(result) {
        assert.equal(result, true, "The value 89 was not stored.");
    });
  });

});
