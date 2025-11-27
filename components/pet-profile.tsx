"use client"

import { useState, useEffect } from "react"
import { 
  Heart, 
  Camera, 
  MapPin, 
  Star, 
  Sparkles, 
  Gift, 
  Cake, 
  Footprints,
  ArrowLeft,
  X,
  Calendar
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"
import { useContext } from "react"

interface PetNFT {
  id: string
  petName: string
  species: string
  breed: string
  birthday?: string
  traits?: string
  city?: string
  description: string
  photoData: string
  txHash: string
  createdAt: string
  walletAddress: string
}

interface PetMoment {
  id: string
  petId: string
  title: string
  description: string
  imageData: string
  createdAt: string
  walletAddress: string
}

interface PetProfileProps {
  refreshTrigger?: number
}

function PetIdentityCard({ 
  pet, 
  momentsCount, 
  onClick,
  language
}: { 
  pet: PetNFT
  momentsCount: number
  onClick: () => void
  language: "en" | "zh"
}) {
  const calculateAge = (birthday: string) => {
    const birth = new Date(birthday)
    const now = new Date()
    const years = now.getFullYear() - birth.getFullYear()
    const months = now.getMonth() - birth.getMonth()
    if (years > 0) return `${years} yr${years > 1 ? 's' : ''}`
    if (months > 0) return `${months} mo`
    return 'New'
  }

  return (
    <button
      onClick={onClick}
      className="w-full bg-gradient-to-br from-amber-100 to-orange-50 rounded-3xl p-5 border-4 border-amber-300 hover:shadow-xl transition-all duration-300 group text-left hover:border-amber-400"
    >
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-amber-300 group-hover:scale-105 transition-transform" style={{ borderWidth: '4px' }}>
            <img
              src={pet.photoData || "/placeholder.svg"}
              alt={pet.petName}
              className="w-full h-full object-cover"
            />
          </div>
          {pet.birthday && (
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-amber-100 border-3 border-amber-400 rounded-full flex items-center justify-center text-[8px] font-bold text-amber-900">
              {calculateAge(pet.birthday)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-amber-900 truncate group-hover:underline transition-all">
            {pet.petName}
          </h3>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className="bg-amber-50 text-amber-900 border-2 border-amber-300 px-2 py-0.5 rounded-full text-xs font-bold">
              {pet.species}
            </span>
            <span className="bg-amber-50 text-amber-900 border-2 border-amber-300 px-2 py-0.5 rounded-full text-xs font-bold">
              {pet.breed}
            </span>
            {pet.city && (
              <span className="bg-amber-50 text-amber-900 border-2 border-amber-300 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-0.5">
                <MapPin className="w-3 h-3" />
                {pet.city}
              </span>
            )}
          </div>
          {pet.description && (
            <p className="text-sm text-amber-800 mt-2 line-clamp-1">{pet.description}</p>
          )}
        </div>

        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-amber-100 border-3 border-amber-300 flex items-center justify-center">
            <Camera className="w-6 h-6 text-amber-600" />
          </div>
          <span className="text-xs font-bold text-amber-900">{momentsCount}</span>
          <span className="text-[10px] text-amber-700">{translations[language].moments}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center text-sm text-amber-700 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
        <span>{translations[language].viewMoments}</span>
        <Sparkles className="w-4 h-4 ml-1" />
      </div>
    </button>
  )
}

function MomentBadge({
  moment,
  index,
  position,
  onClick
}: {
  moment: PetMoment
  index: number
  position: { x: number; y: number }
  onClick: () => void
}) {
  const colors = [
    { border: 'border-amber-400', bg: 'bg-amber-400', shadow: 'shadow-amber-200' },
    { border: 'border-rose-400', bg: 'bg-rose-400', shadow: 'shadow-rose-200' },
    { border: 'border-sky-400', bg: 'bg-sky-400', shadow: 'shadow-sky-200' },
    { border: 'border-emerald-400', bg: 'bg-emerald-400', shadow: 'shadow-emerald-200' },
    { border: 'border-purple-400', bg: 'bg-purple-400', shadow: 'shadow-purple-200' },
    { border: 'border-orange-400', bg: 'bg-orange-400', shadow: 'shadow-orange-200' },
  ]
  const color = colors[index % colors.length]
  const sizes = ['w-16 h-16', 'w-20 h-20', 'w-14 h-14', 'w-18 h-18', 'w-16 h-16']
  const size = sizes[index % sizes.length]

  return (
    <button
      onClick={onClick}
      className={`absolute ${size} rounded-full overflow-hidden border-4 border-amber-300 shadow-lg hover:scale-110 hover:z-20 transition-all duration-300 cursor-pointer`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        animation: `float-${index % 3} 3s ease-in-out infinite`,
        animationDelay: `${index * 0.2}s`
      }}
    >
      <img
        src={moment.imageData || "/placeholder.svg"}
        alt={moment.title}
        className="w-full h-full object-cover"
      />
      <div className={`absolute -bottom-1 -right-1 w-5 h-5 bg-amber-100 border-2 border-amber-400 rounded-full flex items-center justify-center text-amber-900 text-[10px] font-bold`}>
        {index + 1}
      </div>
    </button>
  )
}

function PetMomentsDetailPage({
  pet,
  moments,
  onBack,
  language
}: {
  pet: PetNFT
  moments: PetMoment[]
  onBack: () => void
  language: "en" | "zh"
}) {
  const [selectedMoment, setSelectedMoment] = useState<PetMoment | null>(null)

  const calculateAge = (birthday: string) => {
    const birth = new Date(birthday)
    const now = new Date()
    const years = now.getFullYear() - birth.getFullYear()
    const months = now.getMonth() - birth.getMonth()
    if (years > 0) return `${years} yr${years > 1 ? 's' : ''}`
    if (months > 0) return `${months} mo`
    return 'New'
  }

  const generatePositions = (count: number) => {
    const positions: { x: number; y: number }[] = []
    const centerX = 50
    const centerY = 45
    const minRadius = 25
    const maxRadius = 42
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI - Math.PI / 2
      const radiusVariation = (i % 2 === 0) ? maxRadius : minRadius + 5
      const x = centerX + radiusVariation * Math.cos(angle)
      const y = centerY + radiusVariation * Math.sin(angle) * 0.7
      positions.push({ x: Math.max(10, Math.min(90, x)), y: Math.max(15, Math.min(75, y)) })
    }
    return positions
  }

  const momentPositions = generatePositions(moments.length)

  const decorativeIcons = [
    { Icon: Star, color: 'bg-amber-300', x: 8, y: 20, size: 'w-8 h-8' },
    { Icon: Heart, color: 'bg-rose-300', x: 92, y: 25, size: 'w-7 h-7' },
    { Icon: Sparkles, color: 'bg-purple-300', x: 10, y: 75, size: 'w-6 h-6' },
    { Icon: Gift, color: 'bg-emerald-300', x: 88, y: 70, size: 'w-7 h-7' },
    { Icon: Footprints, color: 'bg-orange-300', x: 15, y: 50, size: 'w-6 h-6' },
  ]

  return (
    <div className="min-h-[650px] rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border-4 border-amber-300 relative overflow-hidden">
      <style jsx>{`
        @keyframes float-0 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-8px); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px) rotate(0deg); }
          50% { transform: translate(-50%, -50%) translateY(-6px) rotate(3deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-10px); }
        }
        @keyframes pulse-ring {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.15; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
        }
        @keyframes icon-float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-5px) rotate(10deg); opacity: 0.5; }
        }
      `}</style>

      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-30 w-10 h-10 bg-amber-100 border-3 border-amber-300 rounded-full flex items-center justify-center hover:bg-amber-200 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-amber-700" />
      </button>

      <div className="absolute top-4 right-4 z-30 bg-amber-100 border-3 border-amber-300 px-3 py-1.5 rounded-full flex items-center gap-2">
        <Camera className="w-4 h-4 text-amber-700" />
        <span className="font-bold text-amber-900">{moments.length}</span>
        <span className="text-sm text-amber-700 font-medium">{translations[language].moments}</span>
      </div>

      {decorativeIcons.map(({ Icon, x, y, size }, index) => (
        <div
          key={index}
          className={`absolute ${size} bg-amber-100 border-2 border-amber-300 rounded-full flex items-center justify-center`}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            animation: `icon-float 4s ease-in-out infinite`,
            animationDelay: `${index * 0.5}s`
          }}
        >
          <Icon className="w-1/2 h-1/2 text-amber-700" />
        </div>
      ))}

      <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 z-10">
        <div
          className="absolute left-1/2 top-1/2 w-36 h-36 rounded-full border-3 border-amber-300"
          style={{ animation: 'pulse-ring 3s ease-in-out infinite' }}
        />
        <div
          className="absolute left-1/2 top-1/2 w-44 h-44 rounded-full border-2 border-amber-300"
          style={{ animation: 'pulse-ring 3s ease-in-out infinite 0.5s' }}
        />
        
        <div className="relative">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-amber-300">
            <img
              src={pet.photoData || "/placeholder.svg"}
              alt={pet.petName}
              className="w-full h-full object-cover"
            />
          </div>
          
          {pet.birthday && (
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-100 border-3 border-amber-400 rounded-full flex flex-col items-center justify-center">
              <Cake className="w-4 h-4 text-amber-700" />
              <span className="text-[8px] text-amber-900 font-bold">{calculateAge(pet.birthday)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute left-1/2 top-[70%] -translate-x-1/2 text-center z-10">
        <div className="bg-amber-100 border-4 border-amber-300 text-amber-900 px-6 py-2 rounded-full mb-2">
          <h2 className="text-xl font-bold">{pet.petName}</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="bg-amber-100 border-3 border-amber-300 px-3 py-1 rounded-full text-sm font-bold text-amber-900">
            {pet.species}
          </span>
          <span className="bg-amber-100 border-3 border-amber-300 px-3 py-1 rounded-full text-sm font-bold text-amber-900">
            {pet.breed}
          </span>
          {pet.city && (
            <span className="bg-amber-100 border-3 border-amber-300 px-3 py-1 rounded-full text-sm font-bold text-amber-900 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {pet.city}
            </span>
          )}
        </div>
      </div>

      {moments.length > 0 ? (
        moments.map((moment, index) => (
          <MomentBadge
            key={moment.id}
            moment={moment}
            index={index}
            position={momentPositions[index]}
            onClick={() => setSelectedMoment(moment)}
          />
        ))
      ) : (
        <div className="absolute left-1/2 top-[30%] -translate-x-1/2 text-center">
          <div className="bg-amber-100 border-4 border-amber-300 rounded-2xl p-6">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-amber-100 border-3 border-amber-300 flex items-center justify-center">
              <Camera className="w-8 h-8 text-amber-700" />
            </div>
            <p className="text-amber-900 font-bold">{translations[language].noMomentsYet}</p>
            <p className="text-sm text-amber-700">{translations[language].uploadMomentsToSeeThemHere}</p>
          </div>
        </div>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 border-3 border-amber-300 flex items-center justify-center">
            <Star className="w-6 h-6 text-amber-700" />
          </div>
          <span className="text-xs font-bold text-amber-900 mt-1">{moments.length}</span>
          <span className="text-[10px] text-amber-700">{translations[language].moments}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 border-3 border-amber-300 flex items-center justify-center">
            <Heart className="w-6 h-6 text-amber-700" />
          </div>
          <span className="text-xs font-bold text-amber-900 mt-1">NFT</span>
          <span className="text-[10px] text-amber-700">{translations[language].nftVerified}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 border-3 border-amber-300 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-amber-700" />
          </div>
          <span className="text-xs font-bold text-amber-900 mt-1">{translations[language].onChainIdentity}</span>
          <span className="text-[10px] text-amber-700">Identity</span>
        </div>
      </div>

      {selectedMoment && (
        <div 
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMoment(null)}
        >
          <div 
            className="bg-amber-50 border-4 border-amber-300 rounded-3xl max-w-md w-full overflow-hidden transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedMoment.imageData || "/placeholder.svg"}
                alt={selectedMoment.title}
                className="w-full aspect-square object-cover"
              />
              <button
                onClick={() => setSelectedMoment(null)}
                className="absolute top-3 right-3 w-10 h-10 bg-amber-100 border-3 border-amber-300 rounded-full flex items-center justify-center hover:bg-amber-200 transition-colors"
              >
                <X className="w-5 h-5 text-amber-700" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-amber-900/80 p-4">
                <h3 className="text-xl font-bold text-amber-50">{selectedMoment.title}</h3>
              </div>
            </div>
            <div className="p-5">
              <p className="text-amber-900">{selectedMoment.description}</p>
              <div className="flex items-center gap-2 mt-4 text-amber-900 font-bold">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(selectedMoment.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function PetProfile({ refreshTrigger = 0 }: PetProfileProps) {
  const [pets, setPets] = useState<PetNFT[]>([])
  const [moments, setMoments] = useState<PetMoment[]>([])
  const [selectedPet, setSelectedPet] = useState<PetNFT | null>(null)
  const { language } = useLanguage()

  useEffect(() => {
    const loadData = () => {
      const savedPets = localStorage.getItem("mintedPets")

      if (savedPets) {
        try {
          const parsedPets = JSON.parse(savedPets)
          setPets(parsedPets)
        } catch (error) {
          console.error("Error loading pets:", error)
        }
      }

      const savedMoments = localStorage.getItem("petMoments")

      if (savedMoments) {
        try {
          const parsedMoments = JSON.parse(savedMoments)
          setMoments(parsedMoments)
        } catch (error) {
          console.error("Error loading moments:", error)
        }
      }
    }

    loadData()
    const interval = setInterval(loadData, 500)
    return () => clearInterval(interval)
  }, [refreshTrigger])

  const getPetMoments = (petId: string) => {
    return moments.filter((moment) => moment.petId === petId)
  }

  if (pets.length === 0) {
    return (
      <div className="min-h-[400px] rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 p-8 flex flex-col items-center justify-center relative overflow-hidden border-4 border-dashed border-amber-300">
        <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-6 border-4 border-dashed border-amber-300">
          <Footprints className="w-12 h-12 text-amber-700" />
        </div>
        <p className="text-xl font-bold text-amber-900 text-center">{translations[language].noPetsYet}</p>
        <p className="text-amber-700 text-center mt-2 font-medium">{translations[language].goToMyPetsToMint}</p>
      </div>
    )
  }

  if (selectedPet) {
    return (
      <PetMomentsDetailPage
        pet={selectedPet}
        moments={getPetMoments(selectedPet.id)}
        onBack={() => setSelectedPet(null)}
        language={language}
      />
    )
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-2">
        <Footprints className="w-6 h-6 text-amber-700" />
        {translations[language].petProfiles}
      </h2>
      <p className="text-amber-700 text-sm font-medium">{translations[language].clickOnPetCard}</p>
      
      <div className="grid gap-4">
        {pets.map((pet) => (
          <PetIdentityCard
            key={pet.id}
            pet={pet}
            momentsCount={getPetMoments(pet.id).length}
            onClick={() => setSelectedPet(pet)}
            language={language}
          />
        ))}
      </div>
    </div>
  )
}
