export const address = '0xC99da431F7f6E9901D1Fe40Fe7F4574b70Dc746a';
export const abi = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "paymentReceipts",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "DOMAIN_NAME_COST_SHORT_ADDITION",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "DOMAIN_NAME_COST",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "domainNames",
    "outputs": [
      {
        "name": "name",
        "type": "bytes32"
      },
      {
        "name": "tld",
        "type": "bytes12"
      },
      {
        "name": "owner",
        "type": "address"
      },
      {
        "name": "expires",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "DOMAIN_NAME_EXPENSIVE_LENGTH",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "DOMAIN_NAME_MIN_LENGTH",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "DOMAIN_EXPIRATION_DATE",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "isOwner",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "addressDomains",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "bytes32"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "domainTLD",
    "outputs": [
      {
        "name": "",
        "type": "bytes12"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "receiptDetails",
    "outputs": [
      {
        "name": "amountPaid",
        "type": "uint256"
      },
      {
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "name": "expires",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "BYTES_DEFAULT_VALUE",
    "outputs": [
      {
        "name": "",
        "type": "bytes1"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "TLD_MIN_LENGTH",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "domainName",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "tld",
        "type": "bytes12"
      }
    ],
    "name": "DomainNameRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "domainName",
        "type": "bytes"
      },
      {
        "indexed": false,
        "name": "tld",
        "type": "bytes12"
      },
      {
        "indexed": true,
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "DomainNameRenewed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "domainName",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "tld",
        "type": "bytes12"
      },
      {
        "indexed": false,
        "name": "newIp",
        "type": "bytes32"
      }
    ],
    "name": "DomainNameEdited",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "domainName",
        "type": "bytes"
      },
      {
        "indexed": false,
        "name": "tld",
        "type": "bytes12"
      },
      {
        "indexed": true,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "DomainNameTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "_owner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "PurchaseChangeReturned",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "domainName",
        "type": "bytes"
      },
      {
        "indexed": false,
        "name": "amountInWei",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "expires",
        "type": "uint256"
      }
    ],
    "name": "ReceiptSaved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "previousOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipRenounced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "domain",
        "type": "bytes"
      }
    ],
    "name": "getPrice",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "domain",
        "type": "bytes32"
      },
      {
        "name": "topLevel",
        "type": "bytes12"
      }
    ],
    "name": "getDomainHash",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "domain",
        "type": "bytes32"
      }
    ],
    "name": "getDomainNameHash",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "domain",
        "type": "bytes32"
      },
      {
        "name": "tld",
        "type": "bytes12"
      },
      {
        "name": "ip",
        "type": "bytes32"
      },
      {
        "name": "rType",
        "type": "bytes32"
      }
    ],
    "name": "register",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "domain",
        "type": "bytes32"
      },
      {
        "name": "tld",
        "type": "bytes12"
      },
      {
        "name": "ip",
        "type": "bytes32"
      },
      {
        "name": "rType",
        "type": "bytes32"
      }
    ],
    "name": "addTldToDomain",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "domain",
        "type": "bytes32"
      },
      {
        "name": "tld",
        "type": "bytes12"
      },
      {
        "name": "newIp",
        "type": "bytes32"
      },
      {
        "name": "rType",
        "type": "bytes32"
      }
    ],
    "name": "edit",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "domain",
        "type": "bytes32"
      },
      {
        "name": "tld",
        "type": "bytes12"
      },
      {
        "name": "rType",
        "type": "bytes32"
      }
    ],
    "name": "getIp",
    "outputs": [
      {
        "name": "outArr",
        "type": "bytes32[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "getDomainsForAddress",
    "outputs": [
      {
        "name": "",
        "type": "bytes32[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "domain",
        "type": "bytes32"
      }
    ],
    "name": "getTldForDomain",
    "outputs": [
      {
        "name": "",
        "type": "bytes12[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "domain",
        "type": "bytes32"
      },
      {
        "name": "tld",
        "type": "bytes12"
      },
      {
        "name": "newIp",
        "type": "bytes32"
      },
      {
        "name": "key",
        "type": "uint256"
      },
      {
        "name": "rType",
        "type": "bytes32"
      }
    ],
    "name": "editDomain",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];