// components/booking-calendar.tsx
"use client"

import { useState, useMemo } from "react"
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

type Booking = {
  id: string
  customer_name: string
  service_name: string
  booking_date: string
  booking_time: string
  status: string
  customer_phone: string
  customer_email?: string
  notes?: string
}

type BookingCalendarProps = {
  bookings: Booking[]
  onSlotClick: (date: Date, time: string) => void
  onEventClick: (booking: Booking) => void
}

const timeSlots = [
  "09:00", "09:15", "09:30", "09:45",
  "10:00", "10:15", "10:30", "10:45",
  "11:00", "11:15", "11:30", "11:45",
  "12:00", "12:15", "12:30", "12:45",
  "13:00", "13:15", "13:30", "13:45",
  "14:00", "14:15", "14:30", "14:45",
  "15:00", "15:15", "15:30", "15:45",
  "16:00", "16:15", "16:30", "16:45",
  "17:00", "17:15", "17:30", "17:45"
]

export function BookingCalendar({ bookings, onSlotClick, onEventClick }: BookingCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))

  // Generate week days
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i))
  }, [currentWeek])

  // Get bookings for a specific date and time
  const getBookingForSlot = (date: Date, time: string) => {
    return bookings.find(booking => {
      const bookingDate = parseISO(booking.booking_date)
      const bookingTime = booking.booking_time.split(' ')[0].substring(0, 5)
      return isSameDay(bookingDate, date) && bookingTime === time
    })
  }

  const goToPreviousWeek = () => {
    setCurrentWeek(prev => addDays(prev, -7))
  }

  const goToNextWeek = () => {
    setCurrentWeek(prev => addDays(prev, 7))
  }

  const goToToday = () => {
    setCurrentWeek(startOfWeek(new Date(), { weekStartsOn: 1 }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-yellow-500'
    }
  }

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <Button onClick={goToToday} variant="outline" size="sm">
            Today
          </Button>
          <div className="flex items-center gap-1">
            <Button onClick={goToPreviousWeek} variant="ghost" size="icon">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button onClick={goToNextWeek} variant="ghost" size="icon">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <span className="font-semibold text-lg">
            {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          {/* Day Headers */}
          <div className="grid grid-cols-8 border-b bg-gray-50">
            <div className="p-4 text-sm font-medium text-gray-500">Time</div>
            {weekDays.map((day, index) => {
              const isToday = isSameDay(day, new Date())
              return (
                <div key={index} className="p-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className={cn(
                      "w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg transition-colors",
                      isToday 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "bg-gray-100 text-gray-700"
                    )}>
                      {format(day, 'd')}
                    </div>
                    <div className={cn(
                      "text-sm font-medium",
                      isToday ? "text-primary" : "text-gray-600"
                    )}>
                      {format(day, 'EEEE')}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Time Slots Grid */}
          <div className="divide-y">
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-8 hover:bg-gray-50/50 transition-colors">
                {/* Time Label */}
                <div className="p-3 text-sm text-gray-500 font-medium border-r">
                  {time}
                </div>

                {/* Day Cells */}
                {weekDays.map((day, dayIndex) => {
                  const booking = getBookingForSlot(day, time)
                  
                  return (
                    <div
                      key={dayIndex}
                      className={cn(
                        "relative border-r min-h-[60px] group",
                        isSameDay(day, new Date()) && "bg-primary/5"
                      )}
                    >
                      {booking ? (
                        <button
                          onClick={() => onEventClick(booking)}
                          className={cn(
                            "absolute inset-0 m-1 p-2 rounded-md text-left text-xs font-medium text-white",
                            "hover:opacity-90 transition-all",
                            getStatusColor(booking.status)
                          )}
                        >
                          <div className="truncate font-semibold">
                            {booking.customer_name}
                          </div>
                          <div className="truncate opacity-90">
                            {booking.service_name}
                          </div>
                        </button>
                      ) : (
                        <button
                          onClick={() => onSlotClick(day, time)}
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <div className="absolute inset-0 m-1 flex items-center justify-center bg-primary/10 rounded-md border-2 border-dashed border-primary/30">
                            <Plus className="w-4 h-4 text-primary" />
                          </div>
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
