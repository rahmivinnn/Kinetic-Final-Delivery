"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, Home, Activity, Users, MessageSquare, BarChart2, FileText, Settings, LogOut, Video, Edit, Trash2, ArrowLeft } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export default function AppointmentDetailsPage({ params }: { params: { id: string } }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const appointmentId = params.id
  
  // In a real app, this would fetch appointment data from an API
  // For demo purposes, we'll use mock data
  const appointment = {
    id: appointmentId,
    date: "May 19, 2023",
    time: "10:30 AM",
    duration: "45 minutes",
    type: "Follow-up Session",
    format: "In-person",
    status: "Confirmed",
    location: "Kinetic Rehab Center, 123 Health St, Suite 101",
    therapist: {
      name: "Dr. Sarah Miller",
      specialty: "Physical Therapist",
      image: "/avatars/sarah-miller.jpg"
    },
    notes: "Patient reports improvement in knee mobility. Continue with current exercise regimen and assess progress.",
    insuranceVerified: true,
    previousAppointment: "May 5, 2023",
    nextSteps: [
      "Complete pre-appointment questionnaire",
      "Bring exercise journal",
      "Wear comfortable clothing"
    ]
  }

  const handleCancelAppointment = () => {
    // In a real app, this would send a cancellation request to the backend
    console.log(`Cancelling appointment ${appointmentId}`)
    
    // Navigate back to appointments page
    router.push('/appointments')
  }

  const handleRescheduleAppointment = () => {
    // Navigate to reschedule page
    router.push(`/appointments/reschedule/${appointmentId}`)
  }

  return (
    <div className="flex h-screen bg-[#f0f4f9]">
      {/* Sidebar */}
      <div className="w-[78px] bg-gradient-to-b from-[#001a41] to-[#003366] flex flex-col items-center py-6">
        <div className="mb-8">
          <div className="w-[60px] h-[60px] flex items-center justify-center">
            <Image 
              src="/kinetic-logo.png" 
              alt="Kinetic Logo" 
              width={60} 
              height={60}
              style={{
                objectFit: "contain",
                objectPosition: "center",
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
                aspectRatio: "1/1"
              }}
            />
          </div>
        </div>

        <nav className="flex flex-col items-center space-y-6 flex-1">
          <Link
            href="/dashboard"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Home className="w-5 h-5" />
          </Link>
          <Link
            href="/exercises"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Activity className="w-5 h-5" />
          </Link>
          <Link
            href="/appointments"
            className="w-10 h-10 rounded-xl bg-[#7e58f4] bg-opacity-20 flex items-center justify-center text-white"
          >
            <Users className="w-5 h-5" />
          </Link>
          <Link
            href="/messages"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <MessageSquare className="w-5 h-5" />
          </Link>
          <Link
            href="/progress"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <BarChart2 className="w-5 h-5" />
          </Link>
          <Link
            href="/video-library"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <FileText className="w-5 h-5" />
          </Link>
        </nav>

        <div className="mt-auto flex flex-col items-center space-y-6">
          <Link
            href="/profile"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <User className="w-5 h-5" />
          </Link>
          <Link
            href="/settings"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Settings className="w-5 h-5" />
          </Link>
          <button
            onClick={logout}
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link href="/dashboard" className="hover:text-gray-700">
              Home
            </Link>
            <span className="mx-2">›</span>
            <Link href="/appointments" className="hover:text-gray-700">
              Appointments
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700">Appointment Details</span>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2" 
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-[#111827]">Appointment Details</h1>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex items-center" 
                onClick={handleRescheduleAppointment}
              >
                <Edit className="mr-2 h-4 w-4" />
                Reschedule
              </Button>
              <Button 
                variant="destructive" 
                className="flex items-center" 
                onClick={handleCancelAppointment}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Cancel Appointment
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main appointment info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Appointment Information</h2>
                  <Badge className={`
                    ${appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : ''}
                    ${appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {appointment.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{appointment.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium">{appointment.time} ({appointment.duration})</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Appointment Type</p>
                      <p className="font-medium">{appointment.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    {appointment.format === 'In-person' ? (
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                    ) : (
                      <Video className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Format</p>
                      <p className="font-medium">{appointment.format}</p>
                    </div>
                  </div>
                </div>
                
                {appointment.format === 'In-person' && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{appointment.location}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {appointment.format === 'Virtual' && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button className="bg-[#014585] hover:bg-[#013a70]">
                      <Video className="mr-2 h-4 w-4" />
                      Join Video Call
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">The video call will be available 5 minutes before the appointment time.</p>
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Appointment Notes</h2>
                <p className="text-gray-700">{appointment.notes}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
                <ul className="space-y-2">
                  {appointment.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-center">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-xs text-blue-600 font-medium">{index + 1}</span>
                      </div>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Therapist</h2>
                <div className="flex items-center">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
                    <Image 
                      src={appointment.therapist.image || "/avatars/default-avatar.png"}
                      alt={appointment.therapist.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{appointment.therapist.name}</h3>
                    <p className="text-sm text-gray-500">{appointment.therapist.specialty}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Button className="w-full bg-[#014585] hover:bg-[#013a70]">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message Therapist
                  </Button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Insurance</h2>
                <div className="flex items-center">
                  {appointment.insuranceVerified ? (
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">Verification Pending</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {appointment.insuranceVerified 
                    ? "Your insurance coverage has been verified for this appointment." 
                    : "We're currently verifying your insurance coverage for this appointment."}
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Related Appointments</h2>
                {appointment.previousAppointment && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Previous Appointment</p>
                    <p className="font-medium">{appointment.previousAppointment}</p>
                    <Link href="#" className="text-sm text-blue-600 hover:text-blue-800">
                      View details
                    </Link>
                  </div>
                )}
                <Button className="w-full" variant="outline">
                  Schedule Follow-up
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}