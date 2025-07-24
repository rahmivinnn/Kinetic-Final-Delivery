"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Clock, User, Home, Activity, Users, MessageSquare, BarChart2, FileText, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export default function ScheduleNewAppointmentPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null)
  const [appointmentType, setAppointmentType] = useState<string>("") 
  const [appointmentFormat, setAppointmentFormat] = useState<string>("") 
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string>("") 
  const [notes, setNotes] = useState<string>("") 

  const handleConfirmAppointment = () => {
    // In a real app, this would send data to the backend
    console.log({
      therapist: selectedTherapist,
      type: appointmentType,
      format: appointmentFormat,
      date,
      time,
      notes
    })
    
    // Navigate to appointments page after successful booking
    router.push('/appointments')
  }

  return (
    <div className="flex h-screen bg-[#f0f4f9]">
      {/* Sidebar */}
      <div className="w-[78px] bg-gradient-to-b from-[#001a41] to-[#003366] flex flex-col items-center py-6">
        <div className="mb-8">
          <Image src="/kinetic-logo.png" alt="Kinetic Logo" width={40} height={40} />
          
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
            <span className="text-gray-700">Schedule New</span>
          </div>

          <h1 className="text-2xl font-bold text-[#111827] mb-4">Schedule New Appointment</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6">Select Therapist</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">Dr. Sarah Miller</h3>
                <p className="text-gray-500 mb-2">Shoulder Specialist • Available Mon-Thu</p>
                <Button 
                  variant={selectedTherapist === "sarah" ? "default" : "outline"}
                  className={selectedTherapist === "sarah" ? "bg-[#014585] hover:bg-[#013a70]" : ""}
                  onClick={() => setSelectedTherapist("sarah")}
                >
                  Select
                </Button>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-4">
                  <User className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold">Dr. James Wilson</h3>
                <p className="text-gray-500 mb-2">Physical Therapist • Available Tue-Fri</p>
                <Button 
                  variant={selectedTherapist === "james" ? "default" : "outline"}
                  className={selectedTherapist === "james" ? "bg-[#014585] hover:bg-[#013a70]" : ""}
                  onClick={() => setSelectedTherapist("james")}
                >
                  Select
                </Button>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-4">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold">Dr. Emily Chen</h3>
                <p className="text-gray-500 mb-2">Rehabilitation Expert • Available Wed-Sat</p>
                <Button 
                  variant={selectedTherapist === "emily" ? "default" : "outline"}
                  className={selectedTherapist === "emily" ? "bg-[#014585] hover:bg-[#013a70]" : ""}
                  onClick={() => setSelectedTherapist("emily")}
                >
                  Select
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6">Appointment Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
                <Select onValueChange={setAppointmentType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="initial-assessment">Initial Assessment</SelectItem>
                    <SelectItem value="follow-up">Follow-up Session</SelectItem>
                    <SelectItem value="therapy-session">Therapy Session</SelectItem>
                    <SelectItem value="progress-evaluation">Progress Evaluation</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <Select onValueChange={setTime}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9:00">9:00 AM</SelectItem>
                    <SelectItem value="10:30">10:30 AM</SelectItem>
                    <SelectItem value="11:15">11:15 AM</SelectItem>
                    <SelectItem value="13:00">1:00 PM</SelectItem>
                    <SelectItem value="14:30">2:30 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Format</label>
                <Select onValueChange={setAppointmentFormat}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="In-person or Virtual" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-person">In-person</SelectItem>
                    <SelectItem value="virtual">Virtual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes for therapist (optional)</label>
                <Textarea 
                  placeholder="Add any specific concerns or questions"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6">Available Time Slots</h2>
            <div className="space-y-2">
              <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                <div className="flex-shrink-0 mr-4">
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">May 19, 2023</p>
                  <p className="text-sm text-gray-500">9:00 AM</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <p className="text-sm font-medium">Dr. Sarah Miller</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <p className="text-sm font-medium">30 min</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <p className="text-sm text-green-600 font-medium">Available</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <Button size="sm" className="bg-[#014585] hover:bg-[#013a70] rounded-full w-8 h-8 p-0">
                    +
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                <div className="flex-shrink-0 mr-4">
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">May 19, 2023</p>
                  <p className="text-sm text-gray-500">10:30 AM</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <p className="text-sm font-medium">Dr. Sarah Miller</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <p className="text-sm font-medium">30 min</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <p className="text-sm text-green-600 font-medium">Available</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <Button size="sm" className="bg-[#014585] hover:bg-[#013a70] rounded-full w-8 h-8 p-0">
                    +
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                <div className="flex-shrink-0 mr-4">
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">May 17, 2023</p>
                  <p className="text-sm text-gray-500">2:00 PM</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <p className="text-sm font-medium">Dr. Sarah Miller</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <p className="text-sm font-medium">30 min</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <p className="text-sm text-green-600 font-medium">Available</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <Button size="sm" className="bg-[#014585] hover:bg-[#013a70] rounded-full w-8 h-8 p-0">
                    +
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                <div className="flex-shrink-0 mr-4">
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">May 19, 2023</p>
                  <p className="text-sm text-gray-500">11:15 AM</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <p className="text-sm font-medium">Dr. Sarah Miller</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <p className="text-sm font-medium">45 min</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <p className="text-sm text-green-600 font-medium">Available</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <Button size="sm" className="bg-[#014585] hover:bg-[#013a70] rounded-full w-8 h-8 p-0">
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Link href="/appointments">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button 
              className="bg-[#014585] hover:bg-[#013a70]"
              onClick={handleConfirmAppointment}
            >
              Confirm Appointment
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}