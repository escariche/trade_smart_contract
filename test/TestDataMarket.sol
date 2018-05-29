pragma solidity ^0.4.19;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/DataMarket.sol";

contract TestDataMarket {
  DataMarket dataMarket = DataMarket(DeployedAddresses.DataMarket());

  function testUser() public {

    dataMarket.addUser(tx.origin);

    bool got = dataMarket.isUserActive();

    Assert.isTrue(got,"It should say true");
  }

  function testCompany() public {
    DataMarket dataMarket = DataMarket(DeployedAddresses.DataMarket());

    dataMarket.addCompany(tx.origin);

    bool expected = true;

    bool got = dataMarket.isCompanyActive();

    Assert.isTrue(got,"It should say true");
  }

}
