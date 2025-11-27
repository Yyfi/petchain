"use client"

import { useState, useEffect } from "react"
import { WalletConnect } from "@/components/wallet-connect"
import { MintPetForm } from "@/components/mint-pet-form"
import { MomentUpload } from "@/components/moment-upload"
import { PetProfile } from "@/components/pet-profile"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"
import { PawPrint, Heart, Shield, Sparkles } from "lucide-react"

interface PetNFT {
  id: string
  petName: string
  breed: string
  description: string
  photoData: string
  txHash: string
  createdAt: string
  walletAddress: string
}

export default function Home() {
  const { language } = useLanguage()
  const t = translations[language]

  const [currentPage, setCurrentPage] = useState<"mint" | "moments" | "profile">("mint")
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [mintedPets, setMintedPets] = useState<PetNFT[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [momentRefreshTrigger, setMomentRefreshTrigger] = useState(0)

  useEffect(() => {
    const loadPets = () => {
      const savedPets = localStorage.getItem("mintedPets")
      if (savedPets) {
        try {
          setMintedPets(JSON.parse(savedPets))
        } catch (error) {
          console.error("Error loading pets:", error)
        }
      }
    }

    loadPets()
    const interval = setInterval(loadPets, 500)
    return () => clearInterval(interval)
  }, [refreshTrigger])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Header */}
      <header className="border-b border-amber-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PawPrint className="h-8 w-8 text-amber-600" />
              <h1 className="text-2xl font-bold text-amber-900">{t.appTitle}</h1>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <WalletConnect
                onConnect={(address) => {
                  setWalletAddress(address)
                  setIsConnected(true)
                }}
                onDisconnect={() => {
                  setWalletAddress("")
                  setIsConnected(false)
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {!isConnected ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-8 md:p-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6">
                <PawPrint className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-4">{t.productIntroTitle}</h2>
              <p className="text-amber-800 max-w-2xl mx-auto leading-relaxed text-lg">{t.productIntroDesc}</p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-xl bg-white border border-amber-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-amber-900 mb-2">{t.feature1Title}</h3>
                <p className="text-amber-700 text-sm">{t.feature1Desc}</p>
              </div>
              <div className="rounded-xl bg-white border border-orange-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-orange-900 mb-2">{t.feature2Title}</h3>
                <p className="text-orange-700 text-sm">{t.feature2Desc}</p>
              </div>
              <div className="rounded-xl bg-white border border-rose-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="mx-auto w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-rose-500" />
                </div>
                <h3 className="font-semibold text-rose-900 mb-2">{t.feature3Title}</h3>
                <p className="text-rose-700 text-sm">{t.feature3Desc}</p>
              </div>
            </div>

            {/* Connect Wallet Prompt */}
            <div className="rounded-lg border-2 border-dashed border-amber-300 bg-amber-50/50 p-8 text-center">
              <PawPrint className="mx-auto h-10 w-10 text-amber-400" />
              <h2 className="mt-4 text-xl font-semibold text-amber-900">{t.connectYourWallet}</h2>
              <p className="mt-2 text-amber-700">{t.pleaseConnectWallet}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Navigation */}
            <nav className="flex gap-2 border-b border-amber-200">
              <button
                onClick={() => setCurrentPage("mint")}
                className={`px-4 py-2 font-medium transition-colors ${
                  currentPage === "mint"
                    ? "border-b-2 border-amber-600 text-amber-600"
                    : "text-gray-600 hover:text-amber-600"
                }`}
              >
                {t.myPets}
              </button>
              <button
                onClick={() => setCurrentPage("moments")}
                className={`px-4 py-2 font-medium transition-colors ${
                  currentPage === "moments"
                    ? "border-b-2 border-amber-600 text-amber-600"
                    : "text-gray-600 hover:text-amber-600"
                }`}
              >
                {t.uploadMoment}
              </button>
              <button
                onClick={() => setCurrentPage("profile")}
                className={`px-4 py-2 font-medium transition-colors ${
                  currentPage === "profile"
                    ? "border-b-2 border-amber-600 text-amber-600"
                    : "text-gray-600 hover:text-amber-600"
                }`}
              >
                {t.petProfile}
              </button>
            </nav>

            {/* Page Content */}
            <div className="space-y-6">
              {currentPage === "mint" && (
                <MintPetForm walletAddress={walletAddress} onPetMinted={() => setRefreshTrigger((prev) => prev + 1)} />
              )}

              {currentPage === "moments" && (
                <MomentUpload
                  walletAddress={walletAddress}
                  onMomentUploaded={() => setMomentRefreshTrigger((prev) => prev + 1)}
                />
              )}

              {currentPage === "profile" && <PetProfile refreshTrigger={momentRefreshTrigger} />}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
