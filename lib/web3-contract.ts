import { ethers } from "ethers"

export const CONTRACT_ADDRESS = "0x055acbcD634EFb87FF6819084527200A64846a31"
export const PET_MOMENTS_ADDRESS = "0x514D64EB785724B932547BFE0ef8F12d3a533A47"

export const PET_ABI = [
  "function mintPet(string memory _name, string memory _species, string memory _breed, uint64 _birthday, string memory _traits, string memory _city, string memory _imageURI) external returns (uint256)",
  "function tokenURI(uint256) view returns (string)",
  "event PetMinted(uint256 indexed petId, address indexed owner)"
]

export const PET_MOMENTS_ABI = [
  "function addMoment(uint256 _petTokenId, string memory _imageURI, string memory _description) external",
  "function getMoments(uint256 _petTokenId) view returns (tuple(string imageURI, string description, uint64 timestamp)[])"
]

export async function uploadToPinata(file: File, pinataJwt: string): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${pinataJwt}`,
    },
    body: formData,
  })

  const data = await response.json()
  if (!data.IpfsHash) {
    throw new Error("Failed to upload to IPFS")
  }

  return `ipfs://${data.IpfsHash}`
}

export async function uploadMetadataToPinata(metadata: any, pinataJwt: string): Promise<string> {
  const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${pinataJwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(metadata),
  })

  const data = await response.json()
  if (!data.IpfsHash) {
    throw new Error("Failed to upload metadata to IPFS")
  }

  return `ipfs://${data.IpfsHash}`
}

export async function mintPetNFT(
  petName: string,
  species: string,
  breed: string,
  birthday: string,
  traits: string,
  city: string,
  imageURI: string,
  provider: any,
  signer: any
): Promise<{ tokenId: string; txHash: string }> {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, PET_ABI, signer)

    const birthdayTimestamp = Math.floor(new Date(birthday).getTime() / 1000)

    const tx = await contract.mintPet(
      petName,
      species,
      breed,
      birthdayTimestamp,
      traits,
      city,
      imageURI
    )

    const receipt = await tx.wait()

    const logs = receipt.logs
    let tokenId = "0"

    for (const log of logs) {
      try {
        const parsed = contract.interface.parseLog(log)
        if (parsed.name === "PetMinted") {
          tokenId = parsed.args.petId.toString()
          break
        }
      } catch (e) {
        continue
      }
    }

    return {
      tokenId,
      txHash: receipt.transactionHash,
    }
  } catch (error) {
    console.error("Error minting pet NFT:", error)
    throw error
  }
}

export async function addMomentNFT(
  petTokenId: string,
  imageURI: string,
  description: string,
  signer: any
): Promise<string> {
  try {
    const contract = new ethers.Contract(PET_MOMENTS_ADDRESS, PET_MOMENTS_ABI, signer)

    const tx = await contract.addMoment(petTokenId, imageURI, description)
    const receipt = await tx.wait()

    return receipt.transactionHash
  } catch (error) {
    console.error("Error adding moment NFT:", error)
    throw error
  }
}
