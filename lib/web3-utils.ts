declare global {
  interface Window {
    ethereum?: any
  }
}

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask or another Web3 wallet")
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  })

  return accounts[0]
}

export async function getContract(address: string, abi: any[]) {
  if (!window.ethereum) {
    throw new Error("Web3 provider not found")
  }

  // This is a simplified version - in production, use ethers.js or web3.js
  return {
    address,
    abi,
  }
}

export function getContractAddresses() {
  return {
    petIdentity: "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8",
    petMoments: "0xd9145CCE52D386f254917e481eB44e9943F39138",
  }
}
