"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format, isBefore, addHours, set } from "date-fns"
import { CalendarIcon, Check, Clock, MapPin, Upload } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import CircularTimePicker from "./circular-time-picker"

// Generate time slots for 24 hours in 30-minute increments
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
      const ampm = hour < 12 ? "AM" : "PM"
      const minuteStr = minute === 0 ? "00" : minute.toString()
      slots.push(`${hour12}:${minuteStr} ${ampm}`)
    }
  }
  return slots
}

const timeSlots = generateTimeSlots()

// Facilities data with updated addresses
const facilities = [
  {
    id: 1,
    name: "Ngọc Thụy",
    location: "Hà Nội",
    address: "59, Ngõ 344 Ngọc Thụy, Long Biên, Hà Nội",
    description: "Modern workspace in the heart of Hanoi with excellent transportation links",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    name: "Himlam",
    location: "Bắc Ninh",
    address: "CL7-3, đường D2, KĐT Himlam Greenpark, Đại Phúc, Bắc Ninh",
    description: "Spacious facility with state-of-the-art meeting rooms and amenities",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    name: "BigC",
    location: "Bắc Giang",
    address: "đường Tây Ninh, khu đô thị phía Nam",
    description: "Convenient location with ample parking and nearby shopping options",
    image: "/placeholder.svg?height=200&width=300",
  },
]

// Updated rooms data by facility with pricing details
const roomsByFacility = {
  "Ngọc Thụy - Hà Nội": [
    {
      id: 1,
      name: "Aurora",
      description: "Comfortable room with modern amenities",
      capacity: "2 people",
      basePrice: 150000,
      baseDuration: 2,
      extraHourPrice: 50000,
      extraHourWeekendPrice: 80000,
      extraPersonPrice: 100000,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      name: "Daisy",
      description: "Cozy room with natural lighting",
      capacity: "2 people",
      basePrice: 150000,
      baseDuration: 2,
      extraHourPrice: 50000,
      extraHourWeekendPrice: 80000,
      extraPersonPrice: 100000,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      name: "Chablis",
      description: "Elegant room with premium furnishings",
      capacity: "2 people",
      basePrice: 150000,
      baseDuration: 2,
      extraHourPrice: 50000,
      extraHourWeekendPrice: 80000,
      extraPersonPrice: 100000,
      image: "/placeholder.svg?height=200&width=300",
    },
  ],
  "Himlam - Bắc Ninh": [
    {
      id: 4,
      name: "Jasmine",
      description: "Spacious room with garden view",
      capacity: "2 people",
      basePrice: 150000,
      baseDuration: 2,
      extraHourPrice: 50000,
      extraHourWeekendPrice: 80000,
      extraPersonPrice: 100000,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 5,
      name: "Camellia",
      description: "Bright room with modern design",
      capacity: "2 people",
      basePrice: 150000,
      baseDuration: 2,
      extraHourPrice: 50000,
      extraHourWeekendPrice: 80000,
      extraPersonPrice: 100000,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 6,
      name: "Lily",
      description: "Tranquil room with minimalist decor",
      capacity: "2 people",
      basePrice: 150000,
      baseDuration: 2,
      extraHourPrice: 50000,
      extraHourWeekendPrice: 80000,
      extraPersonPrice: 100000,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 7,
      name: "Rosy",
      description: "Romantic room with soft lighting",
      capacity: "2 people",
      basePrice: 150000,
      baseDuration: 2,
      extraHourPrice: 50000,
      extraHourWeekendPrice: 80000,
      extraPersonPrice: 100000,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 8,
      name: "Hibiscus",
      description: "Vibrant room with colorful accents",
      capacity: "2 people",
      basePrice: 150000,
      baseDuration: 2,
      extraHourPrice: 50000,
      extraHourWeekendPrice: 80000,
      extraPersonPrice: 100000,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 9,
      name: "Blossom",
      description: "Serene room with peaceful ambiance",
      capacity: "2 people",
      basePrice: 150000,
      baseDuration: 2,
      extraHourPrice: 50000,
      extraHourWeekendPrice: 80000,
      extraPersonPrice: 100000,
      image: "/placeholder.svg?height=200&width=300",
    },
  ],
  "BigC - Bắc Giang": [
    {
      id: 10,
      name: "201",
      description: "Standard room on the 2nd floor",
      capacity: "2 people",
      basePrice: 150000,
      baseDuration: 2,
      extraHourPrice: 50000,
      extraHourWeekendPrice: 80000,
      extraPersonPrice: 100000,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 11,
      name: "202",
      description: "Standard room on the 2nd floor",
      capacity: "2 people",
      basePrice: 150000,
      baseDuration: 2,
      extraHourPrice: 50000,
      extraHourWeekendPrice: 80000,
      extraPersonPrice: 100000,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 12,
      name: "301",
      description: "Standard room on the 3rd floor",
      capacity: "2 people",
      basePrice: 150000,
      baseDuration: 2,
      extraHourPrice: 50000,
      extraHourWeekendPrice: 80000,
      extraPersonPrice: 100000,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 13,
      name: "302",
      description: "Standard room on the 3rd floor",
      capacity: "2 people",
      basePrice: 150000,
      baseDuration: 2,
      extraHourPrice: 50000,
      extraHourWeekendPrice: 80000,
      extraPersonPrice: 100000,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 14,
      name: "401",
      description: "Standard room on the 4th floor",
      capacity: "2 people",
      basePrice: 150000,
      baseDuration: 2,
      extraHourPrice: 50000,
      extraHourWeekendPrice: 80000,
      extraPersonPrice: 100000,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 15,
      name: "402",
      description: "Standard room on the 4th floor",
      capacity: "2 people",
      basePrice: 150000,
      baseDuration: 2,
      extraHourPrice: 50000,
      extraHourWeekendPrice: 80000,
      extraPersonPrice: 100000,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 16,
      name: "501",
      description: "Standard room on the 5th floor",
      capacity: "2 people",
      basePrice: 150000,
      baseDuration: 2,
      extraHourPrice: 50000,
      extraHourWeekendPrice: 80000,
      extraPersonPrice: 100000,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 17,
      name: "502",
      description: "Standard room on the 5th floor",
      capacity: "2 people",
      basePrice: 150000,
      baseDuration: 2,
      extraHourPrice: 50000,
      extraHourWeekendPrice: 80000,
      extraPersonPrice: 100000,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 18,
      name: "601",
      description: "Standard room on the 6th floor",
      capacity: "2 people",
      basePrice: 150000,
      baseDuration: 2,
      extraHourPrice: 50000,
      extraHourWeekendPrice: 80000,
      extraPersonPrice: 100000,
      image: "/placeholder.svg?height=200&width=300",
    },
  ],
}

// Helper function to format currency in VND
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}

// Helper function to convert time string to Date object
const timeStringToDate = (timeStr: string, baseDate: Date) => {
  const [time, period] = timeStr.split(" ")
  const [hourStr, minuteStr] = time.split(":")

  let hour = Number.parseInt(hourStr)
  const minute = Number.parseInt(minuteStr)

  // Convert to 24-hour format
  if (period === "PM" && hour !== 12) hour += 12
  if (period === "AM" && hour === 12) hour = 0

  return set(baseDate, { hours: hour, minutes: minute, seconds: 0, milliseconds: 0 })
}

export default function BookingForm() {
  const [step, setStep] = useState(1)
  const [checkinDate, setCheckinDate] = useState<Date>()
  const [checkinTime, setCheckinTime] = useState<string>()
  const [checkoutDate, setCheckoutDate] = useState<Date>()
  const [checkoutTime, setCheckoutTime] = useState<string>()
  const [selectedFacility, setSelectedFacility] = useState<string>()
  const [selectedRoom, setSelectedRoom] = useState<string>()
  const [guestCount, setGuestCount] = useState<number>(2)
  const [idCardImage, setIdCardImage] = useState<File | null>(null)
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    notes: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showCheckinTimePicker, setShowCheckinTimePicker] = useState(false)
  const [showCheckoutTimePicker, setShowCheckoutTimePicker] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Reset checkout date when checkin date changes
  useEffect(() => {
    if (checkinDate) {
      setCheckoutDate(checkinDate)
    }
  }, [checkinDate])

  // Validate checkout time is at least 2 hours after checkin time
  useEffect(() => {
    if (checkinDate && checkoutDate && checkinTime && checkoutTime) {
      const checkinDateTime = timeStringToDate(checkinTime, checkinDate)
      const checkoutDateTime = timeStringToDate(checkoutTime, checkoutDate)

      // If checkout date is same as checkin date, ensure checkout time is at least 2 hours later
      if (
        format(checkinDate, "yyyy-MM-dd") === format(checkoutDate, "yyyy-MM-dd") &&
        isBefore(checkoutDateTime, addHours(checkinDateTime, 2))
      ) {
        setValidationError("Checkout time must be at least 2 hours after checkin time")
      } else {
        setValidationError(null)
      }
    }
  }, [checkinDate, checkoutDate, checkinTime, checkoutTime])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleIdCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setIdCardImage(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setIdCardPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    // Here you would typically send the data to your backend
    console.log({
      checkinDate,
      checkinTime,
      checkoutDate,
      checkoutTime,
      facility: selectedFacility,
      room: selectedRoom,
      guestCount,
      idCardImage: idCardImage?.name,
      ...formData,
    })
  }

  const goToNextStep = () => {
    if (step === 1 && checkinDate && checkinTime && checkoutDate && checkoutTime && !validationError) {
      setStep(2)
    } else if (step === 2 && selectedFacility) {
      setStep(3)
    } else if (step === 3 && selectedRoom) {
      setStep(4)
    }
  }

  const goToPreviousStep = () => {
    if (step === 2) {
      setStep(1)
    } else if (step === 3) {
      setStep(2)
    } else if (step === 4) {
      setStep(3)
    }
  }

  // Get available rooms based on selected facility
  const getAvailableRooms = () => {
    if (!selectedFacility) return []
    return roomsByFacility[selectedFacility as keyof typeof roomsByFacility] || []
  }

  // Calculate total price based on room price, duration, and guest count
  const calculateTotalPrice = (room: any) => {
    if (!checkinDate || !checkoutDate || !checkinTime || !checkoutTime) return room.basePrice

    const checkinDateTime = timeStringToDate(checkinTime, checkinDate)
    const checkoutDateTime = timeStringToDate(checkoutTime, checkoutDate)

    // Calculate duration in hours
    const durationMs = checkoutDateTime.getTime() - checkinDateTime.getTime()
    const durationHours = Math.max(2, durationMs / (1000 * 60 * 60))

    // Base price covers first 2 hours
    let totalPrice = room.basePrice

    // Add extra hours if applicable
    if (durationHours > 2) {
      const extraHours = durationHours - 2
      const isWeekend = [0, 6].includes(checkinDate.getDay()) // 0 = Sunday, 6 = Saturday
      const extraHourPrice = isWeekend ? room.extraHourWeekendPrice : room.extraHourPrice
      totalPrice += extraHours * extraHourPrice
    }

    // Add extra person fee if applicable
    if (guestCount > 2) {
      totalPrice += (guestCount - 2) * room.extraPersonPrice
    }

    return totalPrice
  }

  if (isSubmitted) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Booking Confirmed</CardTitle>
          <CardDescription>Your reservation has been scheduled.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center rounded-full bg-green-100 p-2 w-12 h-12 mx-auto">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-center space-y-1">
            <p className="font-medium">Thank you, {formData.name}!</p>
            <p className="text-muted-foreground">
              Your reservation is scheduled from {checkinDate && format(checkinDate, "EEEE, MMMM do, yyyy")} at{" "}
              {checkinTime}
            </p>
            <p className="text-muted-foreground">
              to {checkoutDate && format(checkoutDate, "EEEE, MMMM do, yyyy")} at {checkoutTime}
            </p>
            <p className="text-muted-foreground">
              Location: {selectedFacility}, Room: {selectedRoom}, Guests: {guestCount}
            </p>
            <p className="text-muted-foreground">A confirmation SMS has been sent to {formData.phone}.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => {
              setIsSubmitted(false)
              setStep(1)
              setCheckinDate(undefined)
              setCheckinTime(undefined)
              setCheckoutDate(undefined)
              setCheckoutTime(undefined)
              setSelectedFacility(undefined)
              setSelectedRoom(undefined)
              setGuestCount(2)
              setIdCardImage(null)
              setIdCardPreview(null)
              setFormData({
                name: "",
                phone: "",
                notes: "",
              })
            }}
          >
            Book Another Room
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {step === 1
            ? "Select Check-in & Check-out"
            : step === 2
              ? "Choose a Facility"
              : step === 3
                ? "Choose a Room"
                : "Your Information"}
        </CardTitle>
        <CardDescription>
          {step === 1
            ? "Choose your check-in and check-out dates and times"
            : step === 2
              ? "Select a facility location for your booking"
              : step === 3
                ? "Select a room for your booking"
                : "Please provide your contact details"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="checkinDate">Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkinDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkinDate ? format(checkinDate, "PPP") : "Select check-in date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkinDate}
                    onSelect={setCheckinDate}
                    initialFocus
                    disabled={(date) => {
                      // Disable dates in the past
                      const now = new Date()
                      now.setHours(0, 0, 0, 0)
                      return date < now
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkinTime">Check-in Time</Label>
              <Popover open={showCheckinTimePicker} onOpenChange={setShowCheckinTimePicker}>
                <PopoverTrigger asChild>
                  <Button
                    id="checkinTime"
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkinTime && "text-muted-foreground",
                    )}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {checkinTime || "Select check-in time"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="start">
                  <CircularTimePicker
                    value={checkinTime}
                    onChange={(newTime) => {
                      setCheckinTime(newTime)
                      setShowCheckinTimePicker(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkoutTime">Check-out Time</Label>
              <Popover open={showCheckoutTimePicker} onOpenChange={setShowCheckoutTimePicker}>
                <PopoverTrigger asChild>
                  <Button
                    id="checkoutTime"
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkoutTime && "text-muted-foreground",
                    )}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {checkoutTime || "Select check-out time"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="start">
                  <CircularTimePicker
                    value={checkoutTime}
                    onChange={(newTime) => {
                      setCheckoutTime(newTime)
                      setShowCheckoutTimePicker(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkoutDate">Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkoutDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkoutDate ? format(checkoutDate, "PPP") : "Select check-out date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkoutDate}
                    onSelect={setCheckoutDate}
                    initialFocus
                    disabled={(date) => {
                      // Disable dates before check-in date
                      return checkinDate ? isBefore(date, checkinDate) : true
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {validationError && <div className="text-sm font-medium text-destructive">{validationError}</div>}
          </div>
        ) : step === 2 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {facilities.map((facility) => (
                <div
                  key={facility.id}
                  className={cn(
                    "cursor-pointer rounded-lg border p-4 transition-colors hover:bg-muted/50",
                    selectedFacility === `${facility.name} - ${facility.location}`
                      ? "border-2 border-primary"
                      : "border-border",
                  )}
                  onClick={() => setSelectedFacility(`${facility.name} - ${facility.location}`)}
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3">
                      <div className="aspect-video w-full overflow-hidden rounded-md">
                        <img
                          src={facility.image || "/placeholder.svg"}
                          alt={facility.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">
                        {facility.name} - {facility.location}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {facility.address}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{facility.description}</p>
                      <div className="mt-2">
                        <span className="text-sm font-medium">
                          {roomsByFacility[`${facility.name} - ${facility.location}` as keyof typeof roomsByFacility]
                            ?.length || 0}{" "}
                          rooms available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : step === 3 ? (
          <div className="space-y-4">
            <div className="mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>Selected facility: {selectedFacility}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <Label htmlFor="guestCount">Number of Guests:</Label>
              <Select value={guestCount.toString()} onValueChange={(value) => setGuestCount(Number.parseInt(value))}>
                <SelectTrigger id="guestCount" className="w-24">
                  <SelectValue placeholder="Guests" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "guest" : "guests"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {guestCount > 2 && (
                <span className="text-sm text-muted-foreground">
                  (Extra guest fee: {formatCurrency(100000)}/person)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getAvailableRooms().map((room) => (
                <div
                  key={room.id}
                  className={cn(
                    "cursor-pointer rounded-lg border p-4 transition-colors hover:bg-muted/50",
                    selectedRoom === room.name ? "border-2 border-primary" : "border-border",
                  )}
                  onClick={() => setSelectedRoom(room.name)}
                >
                  <div className="aspect-video w-full overflow-hidden rounded-md">
                    <img
                      src={room.image || "/placeholder.svg"}
                      alt={room.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="mt-2">
                    <h3 className="font-medium">{room.name}</h3>
                    <p className="text-sm text-muted-foreground">{room.description}</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Capacity: {room.capacity}</span>
                        <span className="font-medium">
                          {formatCurrency(room.basePrice)}/{room.baseDuration}h
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Extra hour: {formatCurrency(room.extraHourPrice)}/h (weekday),{" "}
                        {formatCurrency(room.extraHourWeekendPrice)}/h (weekend)
                      </div>
                      <div className="font-medium text-sm mt-2">Total: {formatCurrency(calculateTotalPrice(room))}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>
                  {selectedFacility}, Room: {selectedRoom}, Guests: {guestCount}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idCard">Căn cước công dân</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-32 flex flex-col items-center justify-center border-dashed"
                  onClick={() => document.getElementById("idCardUpload")?.click()}
                >
                  {idCardPreview ? (
                    <img
                      src={idCardPreview || "/placeholder.svg"}
                      alt="ID Card Preview"
                      className="max-h-28 max-w-full object-contain"
                    />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Upload ID Card Image</span>
                    </>
                  )}
                </Button>
                <input
                  id="idCardUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleIdCardUpload}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any special requests or information"
                className="resize-none"
              />
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step === 1 ? (
          <Button
            className="w-full"
            onClick={goToNextStep}
            disabled={!checkinDate || !checkinTime || !checkoutDate || !checkoutTime || !!validationError}
          >
            Continue
          </Button>
        ) : step === 2 ? (
          <div className="flex w-full gap-2">
            <Button variant="outline" onClick={goToPreviousStep}>
              Back
            </Button>
            <Button className="flex-1" onClick={goToNextStep} disabled={!selectedFacility}>
              Continue
            </Button>
          </div>
        ) : step === 3 ? (
          <div className="flex w-full gap-2">
            <Button variant="outline" onClick={goToPreviousStep}>
              Back
            </Button>
            <Button className="flex-1" onClick={goToNextStep} disabled={!selectedRoom}>
              Continue
            </Button>
          </div>
        ) : (
          <div className="flex w-full gap-2">
            <Button variant="outline" onClick={goToPreviousStep}>
              Back
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={!formData.name || !formData.phone || !idCardImage}
            >
              Confirm Booking
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
