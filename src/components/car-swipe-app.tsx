'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Heart, Warehouse, Trash2, Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react"

interface CarData {
  id: number;
  image: string;
  model: string;
  trim: string;
  year: number;
  price: string;
  bodyStyle: string;
  rangeOrMpg: string;
  horsepower: number;
}

const carData: CarData[] = [
  { id: 1, image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Porsche%20911%20GTS%20UK%20001_otx6j7-RHCeG51EPlB14BDxXmVjJfAdRV7f6H.jpg", model: "Porsche 911", trim: "Targa 4", year: 2021, price: "$152,200", bodyStyle: "Coupe", rangeOrMpg: "20 mpg", horsepower: 379 },
  { id: 2, image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tesla_Model_S_2021-01@2x-ItGDqtlkGATL7tOTRbhu2pW9eihgeG.jpg", model: "Tesla Model S", trim: "Plaid", year: 2022, price: "$124,000", bodyStyle: "Sedan", rangeOrMpg: "396 miles", horsepower: 1020 },
  { id: 3, image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zfmb01-snWSzHSQxGUq9sqMyN3izn9hlHJoHD.webp", model: "Ford Mustang", trim: "GT", year: 2023, price: "$55,565", bodyStyle: "Coupe", rangeOrMpg: "24 mpg", horsepower: 450 },
  { id: 4, image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/P90304842-the-new-bmw-m3-cs-05-2018-600px-2SX8rwgJqUV7w9JQFWmBtznxkDZdiP.jpg", model: "BMW M3", trim: "Competition", year: 2022, price: "$76,000", bodyStyle: "Sedan", rangeOrMpg: "19 mpg", horsepower: 503 },
  { id: 5, image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AudiRS6Avant%20performance_Dewsilver_matt069-S2BZbU3V2EXLFPB7whPzVhMh5YcHe5.jpg", model: "Audi RS6", trim: "Avant", year: 2023, price: "$125,800", bodyStyle: "Wagon", rangeOrMpg: "18 mpg", horsepower: 591 },
  { id: 6, image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/https___hypebeast.com_image_2024_07_25_2025-chevrolet-corvette-zr1-release-info-tw%20(1)-1HTpYqQ0Auumldh8yJF9iv29lxdjmw.jpeg", model: "Chevrolet Corvette", trim: "ZR1", year: 2025, price: "$180,000", bodyStyle: "Coupe", rangeOrMpg: "15 mpg", horsepower: 850 },
]

export function CarSwipeApp() {
  const [dragX, setDragX] = useState(0)
  const [startX, setStartX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [likedCars, setLikedCars] = useState<CarData[]>([])
  const [dislikedCars, setDislikedCars] = useState<CarData[]>([])
  const [showGarage, setShowGarage] = useState(false)
  const [opacity, setOpacity] = useState(1)
  const [totalSwipes, setTotalSwipes] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleDragStart = (clientX: number) => {
    if (showGarage) return
    setStartX(clientX)
    setIsDragging(true)
  }

  const handleDragMove = (clientX: number) => {
    if (isDragging && !showGarage) {
      const newDragX = clientX - startX
      setDragX(newDragX)
    }
  }

  const handleDragEnd = () => {
    if (showGarage) return
    setIsDragging(false)
    if (Math.abs(dragX) > 100) {
      // Swipe threshold
      const direction = dragX > 0 ? 'right' : 'left'
      handleSwipe(direction)
    } else {
      setDragX(0) // Reset if not swiped far enough
    }
  }

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentCar = carData[currentCardIndex]
    if (direction === 'right') {
      setLikedCars(prev => [...prev, currentCar])
    } else {
      setDislikedCars(prev => [...prev, currentCar])
    }
    
    // Start fade out effect
    setOpacity(0)
    
    // After fade out, move to next card and reset opacity
    setTimeout(() => {
      setCurrentCardIndex(prev => (prev + 1) % carData.length)
      setDragX(0)
      setOpacity(1)
      setTotalSwipes(prev => prev + 1)
    }, 300) // This should match the transition duration in the style
  }

  const removeCar = (id: number) => {
    setLikedCars(prev => prev.filter(car => car.id !== id))
  }

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const onTouchStart = (e: TouchEvent) => handleDragStart(e.touches[0].clientX)
    const onTouchMove = (e: TouchEvent) => handleDragMove(e.touches[0].clientX)
    const onTouchEnd = () => handleDragEnd()

    const onMouseDown = (e: MouseEvent) => handleDragStart(e.clientX)
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientX)
    const onMouseUp = () => handleDragEnd()

    card.addEventListener('touchstart', onTouchStart)
    card.addEventListener('touchmove', onTouchMove)
    card.addEventListener('touchend', onTouchEnd)
    card.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      card.removeEventListener('touchstart', onTouchStart)
      card.removeEventListener('touchmove', onTouchMove)
      card.removeEventListener('touchend', onTouchEnd)
      card.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [isDragging, dragX, showGarage])

  const dragPercentage = (dragX / (cardRef.current?.offsetWidth || 1)) * 100
  const rotationAngle = dragPercentage * 0.1 // Adjust this value to change rotation intensity

  const renderCard = (car: CarData, index: number) => {
    const isCurrentCard = index === currentCardIndex
    const isNextCard = index === (currentCardIndex + 1) % carData.length
    const cardStyle = isCurrentCard
      ? {
          transform: `translateX(${dragX}px) rotate(${rotationAngle}deg)`,
          opacity: opacity,
          zIndex: 2,
          transition: 'transform 300ms ease-out, opacity 300ms ease-out, box-shadow 300ms ease-out',
          boxShadow: dragX !== 0 
            ? `0 0 0 3px ${dragX > 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'}` 
            : 'none',
        }
      : isNextCard
      ? {
          transform: 'scale(0.95)',
          opacity: 1,
          zIndex: 1,
        }
      : {
          display: 'none',
        }

    return (
      <Card
        key={`${car.id}-${totalSwipes}`}
        ref={isCurrentCard ? cardRef : null}
        className="w-full max-w-md rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 absolute top-0 left-0"
        style={cardStyle}
      >
        <CardContent className="p-0 relative select-none">
          <div className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold dark:text-white font-racing-sans-one">
                {car.model} {car.trim}
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">{car.year}</span>
            </div>
          </div>
          <div className="relative">
            <img
              src={car.image}
              alt={car.model}
              className="w-full h-64 object-cover bg-gray-100 dark:bg-gray-700 pointer-events-none"
            />
            {isCurrentCard && Math.abs(dragX) > 20 && (
              <div 
                className={`absolute inset-0 flex items-center justify-center`}
              >
                <div className={`
                  flex items-center justify-center
                  w-24 h-24 rounded-full
                  ${dragX > 0 ? 'bg-green-500' : 'bg-red-500'}
                  transition-all duration-300 ease-in-out
                `}>
                  <span className="text-white text-2xl font-bold drop-shadow-lg">
                    {dragX > 0 ? 'LIKE' : 'NOPE'}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              <Pill label="Price" value={car.price} />
              <Pill label="Body" value={car.bodyStyle} />
              <Pill label="Range/MPG" value={car.rangeOrMpg} />
              <Pill label="HP" value={`${car.horsepower}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const Pill = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-sm flex items-center">
      <span className="font-semibold text-gray-500 dark:text-gray-400 mr-2">{label}:</span>
      <span className="font-bold dark:text-white">{value}</span>
    </div>
  )

  const renderCarousel = () => {
    const allCars = [...likedCars, ...dislikedCars]
    const visibleCars = allCars.slice(carouselIndex, carouselIndex + 5)

    return (
      <div className="mt-4 relative w-full max-w-md">
        <div className="flex justify-center items-center space-x-2 overflow-x-auto py-2">
          {visibleCars.map((car, index) => (
            <div key={`${car.id}-${index}`} className="relative flex-shrink-0">
              <img
                src={car.image}
                alt={car.model}
                className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
              />
              <div className={`absolute top-0 right-0 w-6 h-6 rounded-full flex items-center justify-center ${likedCars.includes(car) ? 'bg-green-500' : 'bg-red-500'}`}>
                {likedCars.includes(car) ? (
                  <Heart className="w-4 h-4 text-white" />
                ) : (
                  <X className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
          ))}
        </div>
        {carouselIndex > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2"
            onClick={() => setCarouselIndex(prev => Math.max(0, prev - 1))}
          >
            <ChevronLeft className="h-6 w-6 text-black dark:text-white" />
          </Button>
        )}
        {carouselIndex + 5 < allCars.length && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2"
            onClick={() => setCarouselIndex(prev => Math.min(allCars.length - 5, prev + 1))}
          >
            <ChevronRight className="h-6 w-6 text-black dark:text-white" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'dark' : ''}`}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Racing+Sans+One&display=swap');
        .font-racing-sans-one {
          font-family: 'Racing Sans One', cursive;
        }
      `}</style>
      <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-sm">
          <div className="h-8 w-32 relative">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logos-zYvHRjPOmUhhN7PPyrZckmDisgXF0a.png"
              alt="MotorTrend Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowGarage(!showGarage)}>
              <Warehouse className="h-6 w-6" />
              <span className="sr-only">My Garage</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-hidden p-4">
          {showGarage ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold dark:text-white font-racing-sans-one">My Liked Vehicles ({likedCars.length})</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 overflow-y-auto max-h-[calc(100vh-12rem)]">
                {likedCars.map((car, index) => (
                  <Card key={`${car.id}-${index}`} className="w-full rounded-xl overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4 flex items-center space-x-4">
                      <img
                        src={car.image}
                        alt={car.model}
                        className="w-20 h-20 object-cover bg-gray-100 dark:bg-gray-700 rounded-lg"
                      />
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold dark:text-white font-racing-sans-one">{car.model} {car.trim}</h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{car.year}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400">{car.price}</p>
                          <Button variant="destructive" size="sm" className="text-[10px] font-semibold py-0 px-2 h-6">
                            BUY NOW
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCar(car.id)}
                        className="text-gray-300 hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Trash2 className="h-5 w-5" />
                        <span className="sr-only">Remove {car.model}</span>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-full max-w-md h-[600px] relative">
                {carData.map((car, index) => renderCard(car, index))}
              </div>
              {renderCarousel()}
            </div>
          )}
        </main>

        {!showGarage && (
          <footer className="flex justify-between items-center p-4 bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600"
                onClick={() => handleSwipe('left')}
              >
                <X className="h-6 w-6 text-red-500" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600"
                onClick={() => handleSwipe('right')}
              >
                <Heart className="h-6 w-6 text-green-500" />
              </Button>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Swipes: {totalSwipes} | Disliked: {dislikedCars.length} | Liked: {likedCars.length}
            </div>
          </footer>
        )}
      </div>
    </div>
  )
}