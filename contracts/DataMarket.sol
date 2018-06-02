pragma solidity ^0.4.19;


contract DataMarket {

    enum Role {

    Undefined,
    //Individual (or IoT devices) who sells data
    User,
    //Buyer of DataStreams
    Company,
    //SuperUser is allowed to see all the information
    SuperUser
    }

    //Owner of the Smart Contract
    address owner;
    //Hardcoded ethereum account used for testing UI of dapp
    address public superUser = 0x0c0889Af5D699e8596775b30b9AE15B61F488441;
    //Historic of candidates user or companies. Array so that we can return them.
    address[] public userCandidates;
    address[] public companyCandidates;
    //The bool will be used as validation
    mapping(address => bool) users;
    mapping(address => bool) companies;

    //Subscription records
    struct Clients{
    //Which contains a map of Ethereum addresses: clients with a bool to validate the subscription.
    mapping (address => bool) subscribers;
    }

    //Then a mapping is created to engage an address to an array of addresses:
    // address-of-user -> [address-of-company1, address-of-company2, ...]
    mapping (address => Clients) subscriptions;

//Constructor
constructor() public{
owner = msg.sender;
}

//Modifiers to handle different Roles

modifier isUser() {
assert(users[msg.sender] || superUser == msg.sender);
_;
}

modifier isCompany() {
assert(companies[msg.sender] || superUser == msg.sender);
_;
}

modifier isSuperUser() {
assert(superUser == msg.sender);
_;
}

//Adding a new user to the MarketPlace
//function addUser(address newUser) public{
function addUser() public{
assert(!companies[msg.sender] && !users[msg.sender]);
users[msg.sender] = true;
userCandidates.push(msg.sender) -1;
}

//Removing a user to the MarketPlace
function removeUser() public isUser{
users[msg.sender] = false;
}

//Adding a new company to the MarketPlace
//function addCompany(address newCompany) public{
function addCompany() public{
assert(!companies[msg.sender] && !users[msg.sender] );
companies[msg.sender] = true;
companyCandidates.push(msg.sender) -1;
}

//Removing a user to the MarketPlace
function removeCompany() public isCompany{
companies[msg.sender] = false;
}

//Get the role of the account I'm using
function getMyRole() public view returns (uint) {
//if(superUser == msg.sender) {
if(superUser == msg.sender) {
return uint(Role.SuperUser);
}
else if(users[msg.sender]) {
return uint(Role.User);
}
else if(companies[msg.sender]) {
return uint(Role.Company);
}
return uint(Role.Undefined);
}

//Adds an address (client) to the end of the array mapped to another address (user)
function setSubs(address companyAddr) public isUser{
require(companies[companyAddr]);
subscriptions[msg.sender].subscribers[companyAddr] = true;
}

//Remove an association between two addresses: user and company
function cancelSubs(address companyAddr) public isUser{
require(companies[companyAddr]);
subscriptions[msg.sender].subscribers[companyAddr] = false;
}

//Checks if a client is supplier of a company
function isSupplier(address askedUser) public view isCompany returns (bool) {
require(users[askedUser]);
return subscriptions[askedUser].subscribers[msg.sender];
}

//Checks if a company is a client of a user
function isClient(address company) public view isUser returns (bool) {
assert(companies[company]);
return subscriptions[msg.sender].subscribers[company];
}

//Returns userCandidates Array
function getAllUsers() public view isCompany returns (address[]){
return (userCandidates);
}

//Returns companyCandidates Array
function getAllCompanies() public view isUser returns (address[]){
return (companyCandidates);
}
}
