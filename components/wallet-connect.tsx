"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"

interface WalletConnectProps {
  onConnect: (address: string) => void
  onDisconnect: () => void
}

export function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const connectWallet = async () => {
    setIsLoading(true)
    try {
      // Check if window.ethereum exists (MetaMask, etc.)
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        const selectedAddress = accounts[0]
        setAddress(selectedAddress)
        setIsConnected(true)
        onConnect(selectedAddress)
      } else {
        alert("Please install MetaMask or another Web3 wallet")
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      alert("Failed to connect wallet")
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setAddress("")
    setIsConnected(false)
    onDisconnect()
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-900">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <Button onClick={disconnectWallet} variant="outline" size="sm" className="gap-2 bg-transparent border-amber-300 text-amber-700 hover:bg-amber-50">
          <LogOut className="h-4 w-4" />
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={connectWallet} disabled={isLoading} className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md">
      <Wallet className="h-4 w-4" />
      {isLoading ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
