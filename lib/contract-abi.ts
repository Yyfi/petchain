// PetIdentity Contract ABI
export const PETIDENTITY_ABI = [
  {
    inputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "breed", type: "string" },
      { internalType: "string", name: "uri", type: "string" },
    ],
    name: "mintPet",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
]

// PetMoments Contract ABI
export const PETMOMENTS_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "petId", type: "uint256" },
      { internalType: "string", name: "momentURI", type: "string" },
    ],
    name: "recordMoment",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "petId", type: "uint256" },
      { internalType: "uint256", name: "momentId", type: "uint256" },
    ],
    name: "getMoment",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
]

export const PETIDENTITY_ADDRESS = "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8"
export const PETMOMENTS_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138"
