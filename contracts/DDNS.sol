pragma solidity >=0.4.22 <0.6.0;

import "./common/Ownable.sol";
import "./libs/SafeMath.sol";

contract DDNS is Ownable {
    using SafeMath for uint256;

    constructor() public {
        register("google", "com", "56.58.159.26", "A");
        edit("google", "com", "142.65.69.159", "A");
        edit("google", "com", "2404:6800:4003:803::200e", "AAAA");
        addTldToDomain("google", "lk", "55.45.32.95", "A");
        edit("google", "lk", "78.65.14.14", "A");

        register("wikipedia", "com", "65.158.128.35", "A");
        edit("wikipedia", "com", "15.26.114.193", "A");
        edit("wikipedia", "com", "15.26.114.193", "A");
        edit("wikipedia", "com", "3515:7911:5114:904::311d", "AAAA");
        addTldToDomain("wikipedia", "lk", "65.45.45.85", "A");
        edit("wikipedia", "lk", "14.25.65.88", "A");        
    }

    /** === STRUCTS START === */

    // struct to hold the domain record
    struct DomainRecord {
        bytes32 name;
        bytes12 tld;
        address owner;
        bytes32[] aRecords;
        bytes32[] aaaaRecords;
        uint expires;
    }

    struct DomainTLD{
        bytes32 name;
        bytes12[] tlds;
    }

    // struct to hold the receipt to track payments made
    struct Receipt {
        uint amountPaid; // in wei
        uint timestamp;
        uint expires;
    }

    /** === STRUCTS END === */

    /** === CONTRACT VARIABLES AND CONSTANTS START === */

    // Constants
    uint constant public DOMAIN_NAME_COST = 1 ether;
    uint constant public DOMAIN_NAME_COST_SHORT_ADDITION = 1 ether;
    uint constant public DOMAIN_EXPIRATION_DATE = 365 days;
    uint8 constant public DOMAIN_NAME_MIN_LENGTH = 5;
    uint8 constant public DOMAIN_NAME_EXPENSIVE_LENGTH = 8;
    uint8 constant public TLD_MIN_LENGTH = 1;
    bytes1 constant public BYTES_DEFAULT_VALUE = bytes1(0x00);

    // Contract Variables
    mapping (bytes32 => DomainRecord) public domainNames; // mapping domain record to a domain hash
    mapping (address => bytes32[]) public paymentReceipts; // mapping all the receipt hashes to an addres
    mapping (bytes32 => Receipt) public receiptDetails; // mapping a receipt to the receipt Hash
    mapping (address => bytes32[]) public addressDomains; // mapping to keep domains owned by address
    mapping (bytes32 => bytes12[]) public domainTLD; // mapping to keep tld's per domain

    bytes32[] public domains = new bytes32[](100);

    /** === CONTRACT VARIABLES AND CONSTANTS END === */

    /** === MODIFIERS START */

    // check if domain is available
    modifier isAvailable(bytes32 domain, bytes12 tld) {
        bytes32 domainHash = getDomainHash(domain, tld);
        require(
            domainNames[domainHash].expires < block.timestamp,
            "Domain Name is not available"
        );
        _;
    }

    // check if amount paid sufficient to aquire domain
    modifier verifyDomainNamePayment(bytes memory domain) {
        uint domainPrice = getPrice(domain);
        require(
            msg.value >= domainPrice,
            "Insufficient amount"
        );
        _;
    }

    // check if initiator is owner of domain when required
    modifier isDomainOwner(bytes32 domain, bytes12 tld) {
        bytes32 domainHash = getDomainHash(domain, tld);
        require(
            domainNames[domainHash].owner == msg.sender,
            "Transaction initiator is not domain owner"
        );
        _;
    }

    // check if domain length is greater than minimum length
    modifier isDomainLengthValid(bytes32 domain) {
        require(
            domain.length >= DOMAIN_NAME_MIN_LENGTH,
            "Domain name is too short"
        );
        _;
    }

    // check if required TLD is of valid length
    modifier isTldAllowed(bytes12 tld) {
        require(
            tld.length >= TLD_MIN_LENGTH,
            "Required TLD is too short"
        );
        _;
    }

    /** === MODIFIERS END === */

    /** === EVENTS START === */

    // event to signify registration of a new domain
    event DomainNameRegistered(
        uint indexed timestamp,
        bytes32 domainName, 
        bytes12 tld
    );

    // event to signify renewal of an expired/expiring domain
    event DomainNameRenewed(
        uint indexed timestamp,
        bytes domainName,
        bytes12 tld,
        address indexed owner
    );

    // event to signify a change in the IP of a domain
    event DomainNameEdited(
        uint indexed timestamp,
        bytes32 domainName,
        bytes12 tld,
        bytes32 newIp
    );

    // event to signify transfer of a domain to a new owner
    event DomainNameTransferred(
        uint indexed timestamp,
        bytes domainName,
        bytes12 tld,
        address indexed owner,
        address newOwner
    );

    // event to signify returning of change to transaction initiator
    event PurchaseChangeReturned(
        uint indexed timestamp,
        address indexed _owner,
        uint amount
    );

    // event to signify the saving of a receipt
    event ReceiptSaved(
        uint indexed timestamp,
        bytes domainName,
        uint amountInWei,
        uint expires
    );

    /** === EVENTS END === */

    /** === FUNCTIONS START === */

    function getPrice(bytes memory domain) public pure returns (uint){
        if(domain.length < DOMAIN_NAME_EXPENSIVE_LENGTH) {
            return DOMAIN_NAME_COST + DOMAIN_NAME_COST_SHORT_ADDITION;
        }

        return DOMAIN_NAME_COST;
    }

    function getDomainHash(bytes32 domain, bytes12 topLevel) public pure returns(bytes32){
        return keccak256(abi.encodePacked(domain, topLevel));
    }

    function getDomainNameHash(bytes32 domain) public pure returns(bytes32){
        return keccak256(abi.encodePacked(domain));
    }

    function register(bytes32 domain, bytes12 tld, bytes32 ip, bytes32 rType) public payable isDomainLengthValid(domain) isAvailable(domain, tld) {
        bytes32 domainHash = getDomainHash(domain, tld);
        bytes32[] memory aAddresses = new bytes32[](1);
        bytes32[] memory aaaaAddresses = new bytes32[](1);
        DomainRecord memory newDomain;
        if(rType == "A") {
            aAddresses[0] = ip;
            newDomain.aRecords = aAddresses;
        } else {
            aaaaAddresses[0] = ip;
            newDomain.aaaaRecords = aaaaAddresses;
        }
        newDomain.name = domain;
        newDomain.tld = tld;
        newDomain.owner = msg.sender;
        newDomain.expires = block.timestamp + DOMAIN_EXPIRATION_DATE;
        domainNames[domainHash] = newDomain;

        addressDomains[msg.sender].push(domain);

        domainTLD[domain].push(tld);

        domains.push(domain);

        emit DomainNameRegistered(block.timestamp, domain, tld);
    }

    function addTldToDomain(bytes32 domain, bytes12 tld, bytes32 ip, bytes32 rType) public payable isDomainLengthValid(domain) isAvailable(domain, tld) {
        bytes32 domainHash = getDomainHash(domain, tld);
        bytes32[] memory aAddresses = new bytes32[](1);
        bytes32[] memory aaaaAddresses = new bytes32[](1);
        DomainRecord memory newDomain;
        if(rType == "A") {
            aAddresses[0] = ip;
            newDomain.aRecords = aAddresses;
        } else {
            aaaaAddresses[0] = ip;
            newDomain.aaaaRecords = aaaaAddresses;
        }
        newDomain.name = domain;
        newDomain.tld = tld;
        newDomain.owner = msg.sender;
        newDomain.expires = block.timestamp + DOMAIN_EXPIRATION_DATE;
        domainNames[domainHash] = newDomain;

        domainTLD[domain].push(tld);

        // emit DomainNameRegistered(block.timestamp, domain, tld);
    }

    function edit(bytes32 domain, bytes12 tld, bytes32 newIp, bytes32 rType) public isDomainOwner(domain, tld) {
        bytes32 domainHash = getDomainHash(domain, tld);
        if(rType == "A") {
            domainNames[domainHash].aRecords.push(newIp);
        } else {
            domainNames[domainHash].aaaaRecords.push(newIp);
        }
        
        emit DomainNameEdited(block.timestamp, domain, tld, newIp);
    }

    function getIp(bytes32 domain, bytes12 tld, bytes32 rType) public view returns (bytes32[] memory outArr) {
        bytes32 domainHash = getDomainHash(domain, tld);
        // bytes15[] outArr;
        // return domainNames[domainHash].ipAddress;
        if(rType == "A") {
            return domainNames[domainHash].aRecords;
        } else {
            return domainNames[domainHash].aaaaRecords;
        }
    }

    function getDomainsForAddress(address sender) public view returns (bytes32[] memory){
        return addressDomains[sender];
    }

    function getTldForDomain(bytes32 domain) public view returns (bytes12[] memory) {
        return domainTLD[domain];
    }

    function editDomain(bytes32 domain, bytes12 tld, bytes32 newIp, uint key, bytes32 rType) public {
        bytes32 domainHash = getDomainHash(domain, tld);
        if(rType == "A") {
            domainNames[domainHash].aRecords[key] = newIp;
        } else {
            domainNames[domainHash].aaaaRecords[key] = newIp;
        }

    }

    function getAllDomains() public view returns (bytes32[] memory) {
        return domains;
    }

    /** === FUNCTIONS END === */
}