pragma solidity >=0.4.22 <0.6.0;

import "./common/Ownable.sol";
import "./libs/SafeMath.sol";

contract DDNS is Ownable {
    using SafeMath for uint256;

    constructor() public {

    }

    /** === STRUCTS START === */

    // struct to hold the domain record
    struct DomainRecord {
        bytes name;
        bytes12 tld;
        address owner;
        bytes15 ipAddress;
        uint expires;
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

    /** === CONTRACT VARIABLES AND CONSTANTS END === */

    /** === MODIFIERS START */

    // check if domain is available
    modifier isAvailable(bytes memory domain, bytes12 tld) {
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
    modifier isDomainOwner(bytes memory domain, bytes12 tld) {
        bytes32 domainHash = getDomainHash(domain, tld);
        require(
            domainNames[domainHash].owner == msg.sender,
            "Transaction initiator is not domain owner"
        );
        _;
    }

    // check if domain length is greater than minimum length
    modifier isDomainLengthValid(bytes memory domain) {
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
        bytes domainName, 
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
        bytes domainName,
        bytes12 tld,
        bytes15 newIp
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

    /**
        * @dev getting the unique identifier for a domain
        * @param domain the domain
        * @param tld the tld
        * @return domainHash the domainHash 
     */
    function getDomainHash(bytes memory domain, bytes32 tld) public pure returns(bytes32) {
        return keccak256(abi.encode(domain, tld));
    }

    /**
        * @dev getting the unique identifier/key for a receipt
        * @param domain the domain
        * @param tld the tld
        * @return receiptKey the receiptKey
     */
    function getReceiptKey(bytes memory domain, bytes12 tld) public view returns(bytes32) {
        return keccak256(abi.encode(domain, tld, msg.sender, block.timestamp));
    }

    /**
        * @dev getting the price of a required domain
        * @param domain the domain
     */
    function getPrice(bytes memory domain) public pure returns(uint) {
        if(domain.length < DOMAIN_NAME_EXPENSIVE_LENGTH) {
            return (DOMAIN_NAME_COST + DOMAIN_NAME_COST_SHORT_ADDITION); // additional charges if domain size is smaller than 8 characters
        }

        return DOMAIN_NAME_COST;
    }

    /**
        * @dev registering a new domain
        * @param domain the domain
     */
    function register(bytes memory domain, bytes12 tld, bytes15 ip) 
    public payable
    isDomainLengthValid(domain)
    isTldAllowed(tld)
    isAvailable(domain, tld)
    verifyDomainNamePayment(domain)
    {
        bytes32 domainHash = getDomainHash(domain, tld); // getting domain hash for the domain
        DomainRecord memory newDomain = DomainRecord(
            {
                name: domain,
                tld: tld,
                owner: msg.sender,
                ipAddress: ip,
                expires: block.timestamp + DOMAIN_EXPIRATION_DATE
            }
        ); // creating a domain record
        domainNames[domainHash] = newDomain; // mapping the domain hash to the newly created domain record

        Receipt memory newReceipt = Receipt(
            {
               amountPaid: msg.value,
               timestamp: block.timestamp,
               expires: block.timestamp + DOMAIN_EXPIRATION_DATE
            }
        ); // creating a receipt
        bytes32 receiptKey = getReceiptKey(domain, tld); // getting a receipt key
        paymentReceipts[msg.sender].push(receiptKey); // saving the receipt key for the transaction initiator
        receiptDetails[receiptKey] = newReceipt; // mapping the receipt key to the receipt

        emit ReceiptSaved(
            block.timestamp,
            domain,
            DOMAIN_NAME_COST,
            block.timestamp + DOMAIN_EXPIRATION_DATE
        );

        emit DomainNameRegistered(
            block.timestamp,
            domain, 
            tld
        );
    }

    /** === FUNCTIONS END === */

    /** === GETTER FUNCTIONS START === */

    function getIp(bytes memory domain, bytes12 tld) public view returns(bytes15) {
        bytes32 domainHash = getDomainHash(domain, tld);
        return domainNames[domainHash].ipAddress;
    }

    function getReceiptList() public view returns(bytes32[] memory) {
        return paymentReceipts[msg.sender];
    }

    function getReceipt(bytes32 receiptKey) public view returns (uint, uint, uint) {
        return (
            receiptDetails[receiptKey].amountPaid,
            receiptDetails[receiptKey].timestamp,
            receiptDetails[receiptKey].expires
        );
    }

    /** === GETTER FUNCTIONS END === */

    /** === WITHDRAW FN START === */
    
    /**
        * @dev allows owner of DNS system to extract all funds
    */
    function withdraw() public onlyOwner {
        msg.sender.transfer(address(this).balance);
    }

    /** === WITHDRAW FN END === */
}