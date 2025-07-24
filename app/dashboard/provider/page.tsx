"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Home,
  Activity,
  Users,
  MessageSquare,
  BarChart2,
  FileText,
  User,
  Settings,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Search,
  Plus,
  LogOut,
  Camera,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function ProviderDashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  
  // Handler untuk berbagai aksi pada dashboard provider
  const handlePatientSearch = () => {
    router.push('/patients')
  }

  const handleAddNewPatient = () => {
    router.push('/patients/add')
  }

  const handleViewSchedule = () => {
    router.push('/appointments')
  }

  const handleOpenLibrary = () => {
    router.push('/video-library')
  }

  const handleStartPoseSession = () => {
    router.push('/pose-estimation')
  }

  const handleStartPhysiotherapy = () => {
    router.push('/physiotherapy')
  }
  
  const handlePatientReports = () => {
    router.push('/patients/reports')
  }
  
  const handleScheduleManagement = () => {
    router.push('/appointments/schedule')
  }
  const [todayAppointments, setTodayAppointments] = useState([
    {
      id: 1,
      patientName: "Alex Johnson",
      patientImage: "/smiling-brown-haired-woman.png",
      time: "9:00 AM",
      type: "Initial Assessment",
      status: "checked-in",
      duration: "45 min",
    },
    {
      id: 2,
      patientName: "Michael Smith",
      patientImage: "/athletic-man-short-hair.png",
      time: "10:30 AM",
      type: "Follow-up Session",
      status: "confirmed",
      duration: "30 min",
    },
    {
      id: 3,
      patientName: "Emily Davis",
      patientImage: "/older-man-glasses.png",
      time: "1:15 PM",
      type: "Video Consultation",
      status: "confirmed",
      duration: "20 min",
    },
    {
      id: 4,
      patientName: "Sarah Wilson",
      patientImage: "/smiling-brown-haired-woman.png",
      time: "3:00 PM",
      type: "Progress Evaluation",
      status: "pending",
      duration: "45 min",
    },
  ])

  const [patientUpdates, setPatientUpdates] = useState([
    {
      id: 1,
      patientName: "Alex Johnson",
      patientImage: "/smiling-brown-haired-woman.png",
      update: "Completed all assigned exercises with improved range of motion",
      time: "Yesterday",
      type: "Exercise Completion",
    },
    {
      id: 2,
      patientName: "Michael Smith",
      patientImage: "/athletic-man-short-hair.png",
      update: "Reported increased pain level (6/10) after last session",
      time: "2 days ago",
      type: "Pain Report",
      priority: "high",
    },
    {
      id: 3,
      patientName: "Emily Davis",
      patientImage: "/older-man-glasses.png",
      update: "Missed scheduled video session - needs rescheduling",
      time: "3 days ago",
      type: "Missed Appointment",
    },
  ])

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Alex Johnson",
      senderImage: "/smiling-brown-haired-woman.png",
      message: "Is it normal to feel a slight pulling sensation during the hamstring stretch?",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 2,
      sender: "Dr. Williams",
      senderImage: "/caring-doctor.png",
      message: "Patient referral sent for Michael Smith. Please review his medical history.",
      time: "Yesterday",
      unread: true,
    },
    {
      id: 3,
      sender: "Front Desk",
      senderImage: "/friendly-receptionist.png",
      message: "Your schedule for next week has been updated with two new patients.",
      time: "Yesterday",
      unread: false,
    },
  ])

  const [performanceMetrics, setPerformanceMetrics] = useState([
    {
      id: 1,
      name: "Patient Satisfaction",
      value: 4.8,
      total: 5,
      change: "+0.2",
      trend: "up",
    },
    {
      id: 2,
      name: "Recovery Rate",
      value: 92,
      unit: "%",
      change: "+3%",
      trend: "up",
    },
    {
      id: 3,
      name: "Avg. Treatment Duration",
      value: 5.2,
      unit: " weeks",
      change: "-0.5",
      trend: "down",
    },
  ])

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
            href="/dashboard/provider"
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white"
          >
            <Home className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard/provider/patients"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Users className="w-5 h-5" />
          </Link>
          <Link
            href="/appointments"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Calendar className="w-5 h-5" />
          </Link>
          <Link
            href="/messages"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <MessageSquare className="w-5 h-5" />
          </Link>
          <Link
            href="/analytics"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <BarChart2 className="w-5 h-5" />
          </Link>
          <Link
            href="/reports"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <FileText className="w-5 h-5" />
          </Link>
          <Link
            href="/pose-estimation"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Camera className="w-5 h-5" />
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
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#111827]">Welcome back, {user?.name || "Doctor"}</h1>
            <p className="text-gray-500">Here's an overview of your practice and patients</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-[#014585] to-[#0070c0] text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Patient Management</CardTitle>
                <CardDescription className="text-blue-100">Search or add patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Search className="mr-2 h-5 w-5 text-blue-200" />
                    <span>Find patient</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white text-[#014585] hover:bg-blue-100 hover:text-[#014585]"
                      onClick={handlePatientSearch}
                    >
                      <Search className="h-4 w-4 mr-1" /> Search
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white text-[#014585] hover:bg-blue-100 hover:text-[#014585]"
                      onClick={handleAddNewPatient}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add New
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#7e58f4] to-[#5a3dc8] text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pose Estimation</CardTitle>
                <CardDescription className="text-purple-100">Real-time pose detection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Camera className="mr-2 h-5 w-5 text-purple-200" />
                    <span>Patient analysis</span>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white text-[#7e58f4] hover:bg-purple-100 hover:text-[#5a3dc8]"
                    onClick={handleStartPoseSession}
                  >
                    Start Session
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#10b981] to-[#059669] text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Physiotherapy Session</CardTitle>
                <CardDescription className="text-green-100">Live therapy monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-green-200" />
                    <span>Live monitoring</span>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white text-[#10b981] hover:bg-green-100 hover:text-[#059669]"
                    onClick={handleStartPhysiotherapy}
                  >
                    Start Session
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Schedule Management</CardTitle>
                <CardDescription>View and manage your appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-[#014585]" />
                    <span>{todayAppointments.length} appointments today</span>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-[#014585] hover:bg-[#013a70]"
                    onClick={handleViewSchedule}
                  >
                    View Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Treatment Library</CardTitle>
                <CardDescription>Access exercise and treatment resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-[#014585]" />
                    <span>Browse resources</span>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-[#014585] hover:bg-[#013a70]"
                    onClick={handleOpenLibrary}
                  >
                    Open Library
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Appointments */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Today's Appointments</CardTitle>
                    <Button 
                      variant="ghost" 
                      className="h-8 text-[#014585]"
                      onClick={handleViewSchedule}
                    >
                      Full Schedule
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {todayAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {todayAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            <div className="relative w-10 h-10 mr-3">
                              <Image
                                src={appointment.patientImage || "/placeholder.svg"}
                                alt={appointment.patientName}
                                fill
                                className="rounded-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{appointment.patientName}</h3>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="w-3 h-3 mr-1" />
                                <span className="mr-2">{appointment.time}</span>
                                <span>({appointment.duration})</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="mr-4 text-right">
                              <span className="text-sm text-gray-600">{appointment.type}</span>
                              <div className="flex items-center justify-end">
                                {appointment.status === "checked-in" ? (
                                  <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                                ) : appointment.status === "confirmed" ? (
                                  <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                                ) : (
                                  <AlertCircle className="w-3 h-3 text-amber-500 mr-1" />
                                )}
                                <span
                                  className={`text-xs ${
                                    appointment.status === "checked-in"
                                      ? "text-green-600"
                                      : appointment.status === "confirmed"
                                        ? "text-green-500"
                                        : "text-amber-500"
                                  }`}
                                >
                                  {appointment.status === "checked-in"
                                    ? "Checked In"
                                    : appointment.status === "confirmed"
                                      ? "Confirmed"
                                      : "Pending"}
                                </span>
                              </div>
                            </div>
                            <Link href={`/appointments/${appointment.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No appointments scheduled for today</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Patient Updates */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Patient Updates</CardTitle>
                    <Button variant="ghost" className="h-8 text-[#014585]">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {patientUpdates.map((update) => (
                      <div
                        key={update.id}
                        className={`p-3 rounded-lg ${
                          update.priority === "high"
                            ? "bg-red-50 border-l-2 border-red-500"
                            : update.type === "Missed Appointment"
                              ? "bg-amber-50 border-l-2 border-amber-500"
                              : "bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <div className="relative w-8 h-8 mr-2">
                              <Image
                                src={update.patientImage || "/placeholder.svg"}
                                alt={update.patientName}
                                fill
                                className="rounded-full object-cover"
                              />
                            </div>
                            <h3 className="font-medium text-gray-900">{update.patientName}</h3>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-2">{update.time}</span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                update.type === "Pain Report"
                                  ? "bg-red-100 text-red-800"
                                  : update.type === "Missed Appointment"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {update.type}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{update.update}</p>
                        <div className="flex justify-end mt-2">
                          <Link href={`/patients/${update.id}`}>
                            <Button size="sm" variant="outline" className="h-7 text-[#014585]">
                              View Patient
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Performance Analytics */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Performance Analytics</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        Weekly
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs bg-blue-50">
                        Monthly
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        Quarterly
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Patient Satisfaction</h3>
                          <p className="text-2xl font-bold">{performanceMetrics[0].value}{performanceMetrics[0].unit || ""}%</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center text-green-600 mb-1">
                            <ArrowRight className="h-4 w-4 mr-1 rotate-[-45deg]" />
                            <span>{performanceMetrics[0].change}</span>
                          </div>
                          <span className="text-xs text-gray-500">vs last month</span>
                        </div>
                      </div>
                      <div className="w-full h-10 bg-gray-100 rounded-md overflow-hidden">
                        <div className="flex h-full">
                          <div className="bg-green-500 h-full" style={{ width: '35%' }}></div>
                          <div className="bg-green-400 h-full" style={{ width: '40%' }}></div>
                          <div className="bg-green-300 h-full" style={{ width: '15%' }}></div>
                          <div className="bg-gray-200 h-full" style={{ width: '10%' }}></div>
                        </div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>Very Satisfied (35%)</span>
                        <span>Satisfied (40%)</span>
                        <span>Neutral (15%)</span>
                        <span>Other (10%)</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Recovery Rate</h3>
                          <p className="text-2xl font-bold">{performanceMetrics[1].value}{performanceMetrics[1].unit || ""}%</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center text-green-600 mb-1">
                            <ArrowRight className="h-4 w-4 mr-1 rotate-[-45deg]" />
                            <span>{performanceMetrics[1].change}</span>
                          </div>
                          <span className="text-xs text-gray-500">vs last month</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="bg-blue-50 p-2 rounded-md">
                          <div className="text-xs text-gray-500">Knee</div>
                          <div className="text-sm font-medium">92%</div>
                        </div>
                        <div className="bg-blue-50 p-2 rounded-md">
                          <div className="text-xs text-gray-500">Shoulder</div>
                          <div className="text-sm font-medium">87%</div>
                        </div>
                        <div className="bg-blue-50 p-2 rounded-md">
                          <div className="text-xs text-gray-500">Back</div>
                          <div className="text-sm font-medium">78%</div>
                        </div>
                        <div className="bg-blue-50 p-2 rounded-md">
                          <div className="text-xs text-gray-500">Ankle</div>
                          <div className="text-sm font-medium">85%</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Avg. Treatment Duration</h3>
                          <p className="text-2xl font-bold">{performanceMetrics[2].value}{performanceMetrics[2].unit || ""}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center text-green-600 mb-1">
                            <ArrowRight className="h-4 w-4 mr-1 rotate-45deg" />
                            <span>{performanceMetrics[2].change}</span>
                          </div>
                          <span className="text-xs text-gray-500">vs last month</span>
                        </div>
                      </div>
                      <div className="relative pt-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="text-xs font-semibold inline-block text-blue-600">
                              Current Average
                            </span>
                          </div>
                          <div>
                            <span className="text-xs font-semibold inline-block text-gray-500">
                              Industry Average: 10.2 weeks
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                          <div style={{ width: `${(performanceMetrics[2].value / 12) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Messages */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Messages</CardTitle>
                    <Link href="/messages">
                      <Button variant="ghost" className="h-8 text-[#014585]">
                        View All
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <Link href={`/messages/${message.id}`} key={message.id}>
                          <div
                            className={`p-3 rounded-lg ${
                              message.unread ? "bg-blue-50 border-l-2 border-[#014585]" : "bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="relative w-8 h-8 mr-2">
                                  <Image
                                    src={message.senderImage || "/placeholder.svg"}
                                    alt={message.sender}
                                    fill
                                    className="rounded-full object-cover"
                                  />
                                </div>
                                <h3 className="font-medium text-gray-900">{message.sender}</h3>
                              </div>
                              <span className="text-xs text-gray-500">{message.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No messages</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Data Analysis Dashboard */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-3 bg-gradient-to-r from-[#014585] to-[#003366] text-white">
                  <div className="flex justify-between items-center">
                    <CardTitle>Data Analysis Dashboard</CardTitle>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="bg-white text-[#014585] hover:bg-blue-100"
                      onClick={handleStartPoseSession}
                    >
                      View Full Analytics
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-gray-900">
                    <Image
                      src="/movement-intelligence.png"
                      alt="Data Analysis Dashboard"
                      fill
                      className="object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                      <h3 className="text-white font-medium mb-1">Patient Movement Analytics</h3>
                      <p className="text-white/80 text-sm">Comprehensive data analysis for patient rehabilitation progress</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900">Performance Metrics</h4>
                      <span className="text-xs text-gray-500">Last updated: Today</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Form Accuracy</div>
                        <div className="text-lg font-semibold text-[#014585]">78%</div>
                        <div className="text-xs text-green-600">↑ 6% from last week</div>
                      </div>
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Range of Motion</div>
                        <div className="text-lg font-semibold text-[#014585]">65%</div>
                        <div className="text-xs text-green-600">↑ 5% from last week</div>
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-3">Recent Patient Analyses</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gray-200 rounded-full mr-2 flex items-center justify-center overflow-hidden">
                            <Image src="/athletic-man-short-hair.png" alt="Patient" width={24} height={24} />
                          </div>
                          <div>
                            <span className="font-medium">John D.</span>
                            <div className="text-xs text-gray-500">Knee Rehabilitation</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-right mr-3">
                            <div className="text-xs font-medium">Score: 82/100</div>
                            <div className="text-xs text-green-600">↑ 8 points</div>
                          </div>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Completed</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gray-200 rounded-full mr-2 flex items-center justify-center overflow-hidden">
                            <Image src="/smiling-brown-haired-woman.png" alt="Patient" width={24} height={24} />
                          </div>
                          <div>
                            <span className="font-medium">Sarah M.</span>
                            <div className="text-xs text-gray-500">Shoulder Recovery</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-right mr-3">
                            <div className="text-xs font-medium">Progress: 65%</div>
                            <div className="text-xs text-amber-600">Session 2/5</div>
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">In Progress</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gray-200 rounded-full mr-2 flex items-center justify-center overflow-hidden">
                            <Image src="/older-man-glasses.png" alt="Patient" width={24} height={24} />
                          </div>
                          <div>
                            <span className="font-medium">Robert K.</span>
                            <div className="text-xs text-gray-500">Lower Back Assessment</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-right mr-3">
                            <div className="text-xs font-medium">Scheduled</div>
                            <div className="text-xs text-gray-500">Tomorrow, 10:00 AM</div>
                          </div>
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">Pending</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full text-[#014585] border-[#014585] hover:bg-blue-50">
                        View All Patient Analytics
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Patient Analytics Dashboard */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Patient Analytics Dashboard</CardTitle>
                    <div className="w-[120px] h-8 text-xs border rounded-md px-3 py-1">
                      <select className="w-full bg-transparent outline-none">
                        <option value="day">Today</option>
                        <option value="week" selected>This Week</option>
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                      </select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Treatment Effectiveness */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Treatment Effectiveness by Condition</h3>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Knee Rehabilitation</span>
                              <span className="font-medium">87%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Shoulder Recovery</span>
                              <span className="font-medium">76%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Lower Back Pain</span>
                              <span className="font-medium">65%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-amber-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Ankle Sprain</span>
                              <span className="font-medium">92%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Patient Engagement */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Patient Engagement Metrics</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Exercise Adherence</div>
                          <div className="text-lg font-semibold text-[#014585]">78%</div>
                          <div className="text-xs text-green-600">↑ 5% from last period</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Session Completion</div>
                          <div className="text-lg font-semibold text-[#014585]">92%</div>
                          <div className="text-xs text-green-600">↑ 3% from last period</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">App Usage</div>
                          <div className="text-lg font-semibold text-[#014585]">4.2 days/week</div>
                          <div className="text-xs text-amber-600">↓ 0.3 from last period</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Feedback Rate</div>
                          <div className="text-lg font-semibold text-[#014585]">85%</div>
                          <div className="text-xs text-green-600">↑ 7% from last period</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          variant="outline" 
                          className="h-auto py-3 px-3 flex items-center justify-center space-x-2 text-[#014585] hover:bg-blue-50 hover:text-[#013a70]"
                          onClick={handlePatientReports}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          <span>Generate Reports</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="h-auto py-3 px-3 flex items-center justify-center space-x-2 text-[#014585] hover:bg-blue-50 hover:text-[#013a70]"
                          onClick={handleStartPoseSession}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          <span>New Analysis</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
