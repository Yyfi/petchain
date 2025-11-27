"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Upload, Loader2, ImageIcon, Trash2, CheckCircle2, Circle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"

interface MomentUploadProps {
  walletAddress: string
  onMomentUploaded?: () => void
}

interface PetNFT {
  id: string
  petName: string
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

export function MomentUpload({ walletAddress, onMomentUploaded }: MomentUploadProps) {
  const { language } = useLanguage()
  const t = translations[language]

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [petId, setPetId] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [moments, setMoments] = useState<PetMoment[]>([])
  const [pets, setPets] = useState<PetNFT[]>([])
  const [selectedMoments, setSelectedMoments] = useState<Set<string>>(new Set())
  const [isDeleteMode, setIsDeleteMode] = useState(false)

  useEffect(() => {
    const loadData = () => {
      const savedPets = localStorage.getItem("mintedPets")
      if (savedPets) {
        try {
          setPets(JSON.parse(savedPets))
        } catch (error) {
          console.error("Error loading pets:", error)
        }
      }

      const savedMoments = localStorage.getItem("petMoments")
      if (savedMoments) {
        try {
          setMoments(JSON.parse(savedMoments))
        } catch (error) {
          console.error("Error loading moments:", error)
        }
      }
    }

    loadData()
    const interval = setInterval(loadData, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadMoment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !petId || !image) {
      alert(t.pleaseSelectPetAndFillFields)
      return
    }

    setIsUploading(true)
    try {
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        const timeout = setTimeout(() => {
          reject(new Error("File reading timeout"))
        }, 5000)

        reader.onloadend = () => {
          clearTimeout(timeout)
          resolve(reader.result as string)
        }
        reader.onerror = () => {
          clearTimeout(timeout)
          reject(new Error("Failed to read file"))
        }
        reader.readAsDataURL(image)
      })

      const newMoment = {
        id: `moment-${Date.now()}`,
        petId,
        title,
        description,
        imageData,
        createdAt: new Date().toISOString(),
        walletAddress,
      }

      const savedMoments = localStorage.getItem("petMoments")
      const allMoments = savedMoments ? JSON.parse(savedMoments) : []
      allMoments.push(newMoment)
      localStorage.setItem("petMoments", JSON.stringify(allMoments))

      setMoments(allMoments)
      setUploadSuccess(true)

      setTitle("")
      setDescription("")
      setPetId("")
      setImage(null)
      setPreview("")

      if (onMomentUploaded) {
        onMomentUploaded()
      }

      setTimeout(() => setUploadSuccess(false), 3000)
    } catch (error) {
      console.error("Error uploading moment:", error)
      alert(t.failedToUploadMoment)
    } finally {
      setIsUploading(false)
    }
  }

  const toggleMomentSelection = (momentId: string) => {
    const newSelected = new Set(selectedMoments)
    if (newSelected.has(momentId)) {
      newSelected.delete(momentId)
    } else {
      newSelected.add(momentId)
    }
    setSelectedMoments(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedMoments.size === moments.length) {
      setSelectedMoments(new Set())
    } else {
      setSelectedMoments(new Set(moments.map((m) => m.id)))
    }
  }

  const deleteSelectedMoments = () => {
    if (selectedMoments.size === 0) {
      alert(t.noMomentsSelected)
      return
    }

    if (!confirm(t.deleteMomentsConfirm)) {
      return
    }

    const updated = moments.filter((m) => !selectedMoments.has(m.id))
    setMoments(updated)
    localStorage.setItem("petMoments", JSON.stringify(updated))
    setSelectedMoments(new Set())
    setIsDeleteMode(false)
  }

  const deleteAllMoments = () => {
    if (moments.length === 0) {
      alert(t.noMomentsUploaded)
      return
    }

    if (!confirm(t.deleteAllConfirm)) {
      return
    }

    localStorage.setItem("petMoments", JSON.stringify([]))
    setMoments([])
    setSelectedMoments(new Set())
    setIsDeleteMode(false)
  }

  const deleteSingleMoment = (momentId: string) => {
    const updated = moments.filter((m) => m.id !== momentId)
    setMoments(updated)
    localStorage.setItem("petMoments", JSON.stringify(updated))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{t.shareAPetMoment}</h2>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-amber-200 p-6">
          <form onSubmit={handleUploadMoment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.pet} *</label>
              {pets.length === 0 ? (
                <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{t.noPetsFound}</p>
                </div>
              ) : (
                <select
                  value={petId}
                  onChange={(e) => setPetId(e.target.value)}
                  disabled={isUploading}
                  className="mt-1 block w-full rounded-md border border-amber-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="">{t.chooseAPet}</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.petName}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t.momentTitle} *</label>
              <Input
                type="text"
                placeholder={t.momentTitle}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isUploading}
                className="mt-1 border-amber-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t.momentDescription}</label>
              <textarea
                placeholder={t.momentDescription}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isUploading}
                rows={3}
                className="mt-1 w-full rounded-md border border-amber-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t.image} *</label>
              <label className="mt-2 flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 px-6 py-10 transition-colors hover:bg-amber-100">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-8 w-8 text-amber-400" />
                  <p className="mt-2 text-sm text-amber-600">{t.clickToUploadOrDragDrop}</p>
                  <p className="text-xs text-amber-500">{t.dragDropDescription}</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>

            <Button type="submit" disabled={isUploading} className="w-full gap-2 bg-amber-600 hover:bg-amber-700">
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.uploading}
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  {t.uploadMomentBtn}
                </>
              )}
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          {preview && (
            <Card className="border-amber-200 p-4">
              <p className="text-sm font-medium text-gray-700">{t.preview}</p>
              <div className="mt-2 rounded-lg overflow-hidden bg-gray-100">
                <img src={preview || "/placeholder.svg"} alt="Moment preview" className="h-auto w-full object-cover" />
              </div>
            </Card>
          )}

          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
            <h3 className="font-semibold text-gray-900">{t.aboutMoments}</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="text-amber-600">•</span>
                <span>{t.storeMemoriesOfYourPet}</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-600">•</span>
                <span>{t.imagesUploadedToIPFS}</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-600">•</span>
                <span>{t.createTimelineOfYourPetLife}</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-600">•</span>
                <span>{t.shareYourPetMoments}</span>
              </li>
            </ul>

            {uploadSuccess && (
              <div className="mt-6 rounded-lg bg-green-50 p-4">
                <p className="text-sm font-medium text-green-900">{t.uploadSuccess}</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{t.petMomentsById}</h3>
          <div className="flex gap-2">
            {moments.length > 0 && (
              <>
                <Button
                  onClick={() => setIsDeleteMode(!isDeleteMode)}
                  className={`gap-2 ${isDeleteMode ? "bg-red-600 hover:bg-red-700" : "bg-gray-600 hover:bg-gray-700"}`}
                >
                  <Trash2 className="h-4 w-4" />
                  {t.deleteMoments}
                </Button>
              </>
            )}
          </div>
        </div>

        {isDeleteMode && moments.length > 0 && (
          <Card className="border-red-200 bg-red-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button onClick={toggleSelectAll} variant="outline" className="gap-2 bg-transparent">
                  {selectedMoments.size === moments.length ? t.deselectAll : t.selectAll}
                </Button>
                <span className="text-sm text-gray-600">
                  {t.selectedCount.replace("{count}", selectedMoments.size.toString())}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={deleteSelectedMoments}
                  disabled={selectedMoments.size === 0}
                  className="gap-2 bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  {t.deleteSelected}
                </Button>
                <Button onClick={deleteAllMoments} variant="outline" className="gap-2 bg-transparent">
                  {t.deleteAll}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {moments.length === 0 ? (
          <Card className="border-amber-200 p-6 text-center">
            <p className="text-gray-600">{t.noMomentsUploaded}</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {Array.from(new Set(moments.map((m) => m.petId))).map((currentPetId) => {
              const petMoments = moments.filter((m) => m.petId === currentPetId)
              const pet = pets.find((p) => p.id === currentPetId)
              return (
                <Card key={currentPetId} className="border-amber-200 p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">{pet?.petName || currentPetId}</h4>
                  <div className="space-y-2">
                    {petMoments.map((moment) => (
                      <Card key={moment.id} className="border-amber-200 p-3 bg-amber-50">
                        <div className="flex gap-3">
                          {isDeleteMode && (
                            <button
                              onClick={() => toggleMomentSelection(moment.id)}
                              className="flex-shrink-0 text-amber-600"
                            >
                              {selectedMoments.has(moment.id) ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : (
                                <Circle className="h-5 w-5" />
                              )}
                            </button>
                          )}
                          <img
                            src={moment.imageData || "/placeholder.svg"}
                            alt={moment.title}
                            className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-900">{moment.title}</h5>
                            <p className="text-sm text-gray-600 line-clamp-2">{moment.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(moment.createdAt).toLocaleString()}</p>
                          </div>
                          {!isDeleteMode && (
                            <button
                              onClick={() => deleteSingleMoment(moment.id)}
                              className="flex-shrink-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
