"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload, X, Trash2 } from "lucide-react"

interface PetNFT {
  id: string
  petName: string
  species: string
  breed: string
  birthday: string
  traits: string
  city: string
  description: string
  photoData: string
  txHash: string
  createdAt: string
  walletAddress: string
}

interface MintPetFormProps {
  walletAddress: string
  onPetMinted?: () => void
}

function CatSprite({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [facingLeft, setFacingLeft] = useState(false)
  const [isWalking, setIsWalking] = useState(false)
  const [animFrame, setAnimFrame] = useState(0)

  useEffect(() => {
    const followMouse = () => {
      setPosition((prev) => {
        const dx = mousePosition.x - prev.x - 20
        const dy = mousePosition.y - prev.y - 20
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance > 5) {
          setIsWalking(true)
          setFacingLeft(dx < 0)
          const speed = Math.min(distance * 0.08, 15)
          return {
            x: prev.x + (dx / distance) * speed,
            y: prev.y + (dy / distance) * speed,
          }
        } else {
          setIsWalking(false)
          return prev
        }
      })
      
      setAnimFrame((f) => (f + 1) % 4)
    }

    const animationFrame = requestAnimationFrame(function animate() {
      followMouse()
      requestAnimationFrame(animate)
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [mousePosition])

  const bounceY = isWalking ? [0, -3, 0, -2][animFrame] : 0

  return (
    <div
      className="fixed pointer-events-none"
      style={{
        left: position.x,
        top: position.y + bounceY,
        zIndex: 99999,
        transform: `scaleX(${facingLeft ? -1 : 1})`,
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 120 80"
      >
        {/* 尾巴 - 长弯曲 */}
        <path
          d={isWalking
            ? (animFrame === 0 ? "M95 25 Q115 15 118 35" : animFrame === 1 ? "M95 28 Q118 10 120 32" : animFrame === 2 ? "M95 24 Q116 16 119 36" : "M95 26 Q117 12 119 34")
            : "M95 25 Q115 18 118 40"
          }
          stroke="#000000"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* 身体 - 长椭圆伸展形态 */}
        <ellipse cx="55" cy="35" rx="42" ry="20" fill="#000000" />
        
        {/* 头部 - 圆形 */}
        <circle cx="20" cy="32" r="14" fill="#000000" />
        
        {/* 左耳 - 小三角 */}
        <polygon points="12,18 8,25 15,23" fill="#000000" />
        
        {/* 右耳 - 小三角 */}
        <polygon points="28,18 32,25 25,23" fill="#000000" />
        
        {/* 左眼 - 白色圆点 */}
        <circle cx="15" cy="30" r="2.5" fill="white" />
        
        {/* 右眼 - 白色圆点 */}
        <circle cx="25" cy="30" r="2.5" fill="white" />
        
        {/* 须线 - 左 */}
        <line x1="8" y1="34" x2="0" y2="33" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="8" y1="37" x2="0" y2="38" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* 须线 - 右 */}
        <line x1="32" y1="34" x2="40" y2="33" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="32" y1="37" x2="40" y2="38" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* 前腿简化 */}
        <ellipse cx="30" cy="52" rx="5" ry="8" fill="#000000" />
        <ellipse cx="45" cy="53" rx="5" ry="7" fill="#000000" />
      </svg>
    </div>
  )
}

export function MintPetForm({ walletAddress, onPetMinted }: MintPetFormProps) {
  const [petName, setPetName] = useState("")
  const [species, setSpecies] = useState("")
  const [breed, setBreed] = useState("")
  const [birthday, setBirthday] = useState("")
  const [traits, setTraits] = useState("")
  const [city, setCity] = useState("")
  const [description, setDescription] = useState("")
  const [isMinting, setIsMinting] = useState(false)
  const [txHash, setTxHash] = useState("")
  const [petPhoto, setPetPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>("")
  const [mintedPets, setMintedPets] = useState<PetNFT[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    if (species === "Cat") {
      window.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [species])

  useEffect(() => {
    const savedPets = localStorage.getItem("mintedPets")
    if (savedPets) {
      try {
        setMintedPets(JSON.parse(savedPets))
      } catch (error) {
        console.error("Error loading pets:", error)
      }
    }

    const interval = setInterval(() => {
      const updated = localStorage.getItem("mintedPets")
      if (updated) {
        try {
          setMintedPets(JSON.parse(updated))
        } catch (error) {
          console.error("Error loading pets:", error)
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB")
        return
      }
      setPetPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setPetPhoto(null)
    setPhotoPreview("")
  }

  const deleteMintedPet = (petId: string) => {
    const updated = mintedPets.filter((pet) => pet.id !== petId)
    setMintedPets(updated)
    localStorage.setItem("mintedPets", JSON.stringify(updated))
  }

  const handleMintPet = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!petName || !species || !breed || !birthday || !city) {
      alert("Please fill in all required fields")
      return
    }

    if (!petPhoto) {
      alert("Please upload a pet photo")
      return
    }

    setIsMinting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newTxHash = "0x" + Math.random().toString(16).slice(2)
      setTxHash(newTxHash)

      const newPet: PetNFT = {
        id: Date.now().toString(),
        petName,
        species,
        breed,
        birthday,
        traits,
        city,
        description,
        photoData: photoPreview,
        txHash: newTxHash,
        createdAt: new Date().toISOString(),
        walletAddress,
      }

      const updated = [...mintedPets, newPet]
      setMintedPets(updated)
      localStorage.setItem("mintedPets", JSON.stringify(updated))

      if (onPetMinted) {
        onPetMinted()
      }

      setPetName("")
      setSpecies("")
      setBreed("")
      setBirthday("")
      setTraits("")
      setCity("")
      setDescription("")
      setPetPhoto(null)
      setPhotoPreview("")

      setTimeout(() => setTxHash(""), 3000)
    } catch (error) {
      console.error("Error minting pet:", error)
      alert("Failed to mint pet")
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <div className="space-y-6">
      {species === "Cat" && <CatSprite mousePosition={mousePosition} />}
      
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Mint Your Pet</h2>
          <Card className="border-amber-200 p-6">
            <form onSubmit={handleMintPet} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Pet Name *</label>
                <Input
                  type="text"
                  placeholder="e.g. Fluffy"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  disabled={isMinting}
                  className="mt-1 border-amber-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Species *</label>
                <Select
                  value={species}
                  onValueChange={setSpecies}
                  disabled={isMinting}
                >
                  <SelectTrigger className="mt-1 border-amber-200">
                    <SelectValue placeholder="Select species" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cat">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🐱</span>
                        <span>Cat</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Dog">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🐶</span>
                        <span>Dog</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {species === "Cat" && (
                  <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                    <span className="text-base">🐱</span>
                    A cute cat is now following your mouse!
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Breed *</label>
                <Input
                  type="text"
                  placeholder={species === "Cat" ? "e.g. British Shorthair" : species === "Dog" ? "e.g. Golden Retriever" : "e.g. Golden Retriever"}
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  disabled={isMinting}
                  className="mt-1 border-amber-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Birthday *</label>
                  <Input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    disabled={isMinting}
                    className="mt-1 border-amber-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City *</label>
                  <Input
                    type="text"
                    placeholder="e.g. New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={isMinting}
                    className="mt-1 border-amber-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Traits</label>
                <Input
                  type="text"
                  placeholder="e.g. Playful, Friendly, Smart"
                  value={traits}
                  onChange={(e) => setTraits(e.target.value)}
                  disabled={isMinting}
                  className="mt-1 border-amber-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  placeholder="Tell us about your pet..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isMinting}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-amber-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Pet Photo *</label>
                <div className="mt-2">
                  {!photoPreview ? (
                    <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 px-6 py-8 transition hover:border-amber-400 hover:bg-amber-100">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        disabled={isMinting}
                        className="hidden"
                      />
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-amber-600" />
                        <p className="mt-2 text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    </label>
                  ) : (
                    <div className="relative rounded-lg border border-amber-200 overflow-hidden">
                      <img
                        src={photoPreview || "/placeholder.svg"}
                        alt="Pet preview"
                        className="h-48 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        disabled={isMinting}
                        className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={isMinting} className="w-full gap-2 bg-amber-600 hover:bg-amber-700">
                {isMinting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Minting...
                  </>
                ) : (
                  "Mint Pet NFT"
                )}
              </Button>
            </form>
          </Card>

          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
            <h3 className="font-semibold text-gray-900">About Minting</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="text-amber-600">•</span>
                <span>Create a unique NFT for your pet on the PetIdentity contract</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-600">•</span>
                <span>Your pet will be stored on the blockchain forever</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-600">•</span>
                <span>You can share moments and memories with your pet</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-600">•</span>
                <span>Each mint costs a small amount of gas fee</span>
              </li>
            </ul>

            {txHash && (
              <div className="mt-6 rounded-lg bg-green-50 p-4">
                <p className="text-sm font-medium text-green-900">Pet minted successfully!</p>
                <p className="mt-1 break-all text-xs text-green-700">TX: {txHash}</p>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Pets</h2>
          {mintedPets.length === 0 ? (
            <Card className="border-amber-200 bg-white p-8 text-center">
              <p className="text-gray-600">Your pet collection will appear here once you mint your first pet</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {mintedPets.map((pet) => (
                <div
                  key={pet.id}
                  className="rounded-lg border border-amber-200 overflow-hidden bg-white shadow hover:shadow-lg transition"
                >
                  <div className="relative w-full h-40 overflow-hidden bg-gray-100">
                    <img
                      src={pet.photoData || "/placeholder.svg"}
                      alt={pet.petName}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-lg">
                      {pet.species === "Cat" ? "🐱" : pet.species === "Dog" ? "🐶" : "🐾"}
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{pet.petName}</h3>
                      <div className="grid grid-cols-2 gap-2 mt-1 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Species:</span> {pet.species}
                        </div>
                        <div>
                          <span className="font-medium">Breed:</span> {pet.breed}
                        </div>
                        <div>
                          <span className="font-medium">Birthday:</span> {new Date(pet.birthday).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">City:</span> {pet.city}
                        </div>
                      </div>
                      {pet.traits && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium text-gray-700">Traits:</span>
                          <p className="text-gray-600">{pet.traits}</p>
                        </div>
                      )}
                      {pet.description && <p className="mt-2 text-sm text-gray-500 line-clamp-2">{pet.description}</p>}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="text-xs">
                        <p className="truncate text-amber-600 font-mono">TX: {pet.txHash}</p>
                        <p className="text-gray-400">{new Date(pet.createdAt).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => deleteMintedPet(pet.id)}
                        className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-sm font-medium transition flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
