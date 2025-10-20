// app/page.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Star, 
  Award,
  Users,
  Heart,
  Phone,
  Mail,
  Instagram,
  Facebook
} from "lucide-react"

export default function HomePage() {
  const BOOKING_URL = "https://www.fresha.com/book-now/barka-q099mh7p/all-offer?share=true&pId=2686876"

  const services = [
    {
      title: "Hair Styling",
      description: "Expert cuts, coloring, and styling for all hair types",
      icon: Sparkles,
    },
    {
      title: "Spa Treatments",
      description: "Relaxing massages and rejuvenating spa services",
      icon: Heart,
    },
    {
      title: "Beauty Services",
      description: "Professional makeup, nails, and skincare treatments",
      icon: Star,
    },
    {
      title: "Wellness",
      description: "Holistic treatments for mind and body wellness",
      icon: Award,
    },
  ]

  const features = [
    {
      icon: Users,
      title: "Expert Team",
      description: "Certified professionals with years of experience",
    },
    {
      icon: Award,
      title: "Premium Products",
      description: "Only the finest, trusted beauty brands",
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Open 7 days a week for your convenience",
    },
    {
      icon: Heart,
      title: "Personalized Care",
      description: "Tailored services for your unique needs",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "Amazing service! The staff is professional and the atmosphere is so relaxing. Highly recommend!",
    },
    {
      name: "Emily Davis",
      rating: 5,
      text: "Best salon experience I've ever had. They really care about their clients and the results are always perfect.",
    },
    {
      name: "Maria Garcia",
      rating: 5,
      text: "I've been coming here for months and I'm never disappointed. The team is talented and friendly!",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* CTA Booking Section */}
      <section className="py-20 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Look?</h2>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Book your appointment now and experience the luxury you deserve
          </p>
          
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <a 
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Book Your Appointment
            </a>
          </Button>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Instant Confirmation</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Convenient Location</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
