pragma solidity ^0.4.17;


contract Adoption {
    /*  We've defined a single variable: adopters.
        This is an array of Ethereum addresses.
        Arrays contain one type and can have a fixed or variable length.
        In this case the type is address and the length is 16.

        You'll also notice adopters is public.
        Public variables have automatic getter methods,
        but in the case of arrays a key is required and will only return a single value.
        Later, we'll write a function to return the whole array for use in our UI.

        ¿?
        For trad(e)
        address[2] public companies; //This would only allow 5 companies per stream
    */
    address[16] public adopters;

    // Adopting a pet
    /*
    In Solidity the types of both the function parameters and output must be specified.
    In this case we'll be taking in a petId (integer) and returning an integer.

    We are checking to make sure petId is in range of our adopters array.
    Arrays in Solidity are indexed from 0, so the ID value will need to be between 0 and 15.
    We use the require() statement to ensure the the ID is within range.

    If the ID is in range, we then add the address that made the call to our adopters array.
    The address of the person or smart contract who called this function is denoted by msg.sender.
    */
    function adopt(uint petId) public returns (uint) {
        require(petId >= 0 && petId <= 15);

        adopters[petId] = msg.sender;

        return petId;
    }

    // Retrieving the adopters
    /*
    Since adopters is already declared, we can simply return it.
    Be sure to specify the return type (in this case, the type for adopters) as address[16].
    */
    function getAdopters() public view returns (address[16]) {
        return adopters;
    }
}
