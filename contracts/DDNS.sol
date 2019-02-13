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
        uint amoutPaid; // in wei
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

    /** === EVENTS END === */


}