pragma solidity ^0.4.17;


contract Subscription {
    /*  We've defined a single variable: producers.
        This is an array of Ethereum addresses.
        Arrays contain one type and can have a fixed or variable length.
        In this case the type is address and the length is 16.

        You'll also notice producers is public.
        Public variables have automatic getter methods,
        but in the case of arrays a key is required and will only return a single value.
        Later, we'll write a function to return the whole array for use in our UI.

        ¿?
        For trad(e)
        address[2] public companies; //This would only allow 2 companies per stream
    */

    address[2] public producers;
    //Hereby we find the URLs used to establish the communication through Apache Kafka
    string private kafka_consumer = "http://ec2-13-59-190-223.us-east-2.compute.amazonaws.com:3000/";
    string private kafka_producer = "http://ec2-18-217-106-184.us-east-2.compute.amazonaws.com:3000/";

    // Subscribing a company
    /*
    In Solidity the types of both the function parameters and output must be specified.
    In this case we'll be taking in a companyId (integer) and returning an integer.

    We are checking to make sure companyId is in range of our array.
    Arrays in Solidity are indexed from 0, so the ID value will need to be between 0 and 15.
    We use the require() statement to ensure the the ID is within range.

    If the ID is in range, we then add the address that made the call to our producers array.
    The address of the person or smart contract who called this function is denoted by msg.sender.
    */
    function subscribe(uint companyId) public returns (uint) {
        require(companyId >= 0 && companyId <= 1);

        producers[companyId] = msg.sender;

        return companyId;
    }

    // Unsubscribing a company
    /*
    In Solidity the types of both the function parameters and output must be specified.
    In this case we'll be taking in a companyId (integer) and returning an integer.

    We are checking to make sure companyId is in range of our array.
    Arrays in Solidity are indexed from 0, so the ID value will need to be between 0 and 15.
    We use the require() statement to ensure the the ID is within range.

    If the ID is in range, we then delete the address that made the call from our array of subscribers.
    The address of the person or smart contract who called this function is denoted by msg.sender.
    */
    function Unsubscribe(uint companyId) public returns (uint) {
        require(companyId >= 0 && companyId <= 1);

        producers[companyId] = 0x0000000000000000000000000000000000000000;

        return companyId;
    }

    // Retrieving the producers
    /*
    Since producers is already declared, we can simply return it.
    Be sure to specify the return type (in this case, the type for producers) as address[16].
    */
    function getProducers() public view returns (address[2]) {
        return producers;
    }

    //Retrieving the Kafka Consumer (URL)
    function getKafkaConsumer() public view returns (string) {
        return kafka_consumer;
    }

    //Retrieving the Kafka Producer (URL)
    function getKafkaProducer() public view returns (string) {
        return kafka_consumer;
    }
}
