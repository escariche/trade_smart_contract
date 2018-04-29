pragma solidity ^0.4.19;


contract Subscription {

    //We've defined a custom structure: Clients.
    struct Clients{
        //Which contains an array of Ethereum addresses: clients.
        address[] clients;
        mapping (address => uint) index;
    }

    //Then a mapping is created to engage an address to an array of addresses:
    // address-of-user -> [address-of-company1, address-of-company2, ...]
    mapping (address => Clients) subscriptions;

    //Adds an address (client) to the end of the array mapped to another address (user)
    function setSubs(address userAddr, address companyAddr) public{
        require(userAddr == msg.sender);
        if(!isClient(userAddr, companyAddr)){
            var c = subscriptions[userAddr];
            c.clients.push(companyAddr) -1;
            c.index[companyAddr] = getNumberOfClients(userAddr);
        }
    }

    //Remove an association between two addresses: user and company
    function cancelSubs(address userAddr, address companyAddr) public{
        require(userAddr == msg.sender);
        if(isClient(userAddr, companyAddr)){
            var c = subscriptions[userAddr];
            var iter = c.clients.length;
            for (uint i = c.index[companyAddr]; i < iter; i++){
                if(i <= c.clients.length -1){
                    c.clients[i] = c.clients[i + 1];
                    c.index[c.clients[i]] = i;
                }
            }
            delete subscriptions[userAddr].clients[subscriptions[userAddr].clients.length];
        }
    }

    //Remove all the associations with an address (user)
    //TODO

    //Returns the address in the specified index
    function getClientList(address userAddr) view public returns (address[]) {
        require(userAddr == msg.sender);
        var c = subscriptions[userAddr];
        return c.clients;
    }

    //Check if the relation already exists
    function isClient(address userAddr, address companyAddr) public view returns (bool){
        if (companyAddr != 0x0 && subscriptions[userAddr].index[companyAddr] > 0){
            return true;
        }else{
            return false;
        }
    }

    //Returns the number of addresses associated to another address
    function getNumberOfClients(address userAddr) view public returns (uint){
        require(userAddr == msg.sender);
        var c = subscriptions[userAddr];
        return c.clients.length;
    }


    //Hereby we find the URLs used to establish the communication through Apache Kafka
    //string private kafka_consumer = "http://ec2-13-59-190-223.us-east-2.compute.amazonaws.com:3000/";
    //string private kafka_client = "http://ec2-18-217-106-184.us-east-2.compute.amazonaws.com:3000/";

    // Subscribing a company
    /*
    In Solidity the types of both the function parameters and output must be specified.
    In this case we'll be taking in a companyId (integer) and returning an integer.

    We are checking to make sure companyId is in range of our array.
    Arrays in Solidity are indexed from 0, so the ID value will need to be between 0 and 15.
    We use the require() statement to ensure the the ID is within range.

    If the ID is in range, we then add the address that made the call to our clients array.
    The address of the person or smart contract who called this function is denoted by msg.sender.
    */
  /**  function subscribe(uint companyId) public view returns (address user) {
    require(companyId >= 0 && companyId <= 1);
        clients[companyId] = msg.sender;
        return msg.sender;
    }
*/
    // Unsubscribing a company
    /**
    In Solidity the types of both the function parameters and output must be specified.
    In this case we'll be taking in a companyId (integer) and returning an integer.

    We are checking to make sure companyId is in range of our array.
    Arrays in Solidity are indexed from 0, so the ID value will need to be between 0 and 15.
    We use the require() statement to ensure the the ID is within range.

    If the ID is in range, we then delete the address that made the call from our array of subscribers.
    The address of the person or smart contract who called this function is denoted by msg.sender.
    */
  /**  function unsubscribe(uint companyId) public view returns (address user) {
        require(companyId >= 0 && companyId <= 1);
        require(clients[companyId] == msg.sender);
        clients[companyId] = 0x0000000000000000000000000000000000000000;
        return msg.sender;
    }*/

    // Retrieving the clients
    /*
    Since clients is already declared, we can simply return it.
    Be sure to specify the return type (in this case, the type for clients) as address[2].
    So the returned element is an address array
    */
    /**function getClients(address account) public view returns (address[2]) {
        require(account == msg.sender);
        return clients;
    }*/

    /**
    //Retrieving the balance of the account
    function getBalance(address account) public view returns (address) {
        require(account == msg.sender);
        return account;
    }

    function send(address receiver, uint amount){
        if (balances[msg.sender] < amount) return;
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
    }



    //Query the balance of the address in method
    function queryBalance(address addr) constant returns (uint balance) {
        require(addr == msg.sender);
        return balances[addr];
    }


    //Retrieving the Kafka Consumer (URL)
    function getKafkaConsumer() public view returns (string) {
        return kafka_consumer;
    }

    //Retrieving the Kafka client (URL)
    function getKafkaclient() public view returns (string) {
        return kafka_consumer;
    }
    */
}
