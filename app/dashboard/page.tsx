"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
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
  LogOut,
  Camera,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { NotificationSystem } from "@/components/notification-system"
import { motion } from "framer-motion"

export default function DashboardPage() {
  const { user, logout } = useAuth()

  // Generate more varied and dynamic data
  const generateAppointments = () => {
    const therapists = [
      { name: "Dr. Sarah Johnson", image: "/caring-doctor.png" },
      { name: "Dr. Michael Chen", image: "/friendly-receptionist.png" },
      { name: "Dr. Emily Rodriguez", image: "/smiling-brown-haired-woman.png" },
      { name: "Dr. James Wilson", image: "/athletic-man-short-hair.png" },
      { name: "Dr. Lisa Thompson", image: "/older-man-glasses.png" }
    ];

    const appointmentTypes = [
      "Video Consultation",
      "In-Person Session",
      "Follow-up Evaluation",
      "Initial Assessment",
      "Progress Review",
      "Therapy Session",
      "Movement Analysis"
    ];

    const dates = ["Today", "Tomorrow", "May 25", "May 28", "June 2"];
    const times = ["9:00 AM", "10:30 AM", "1:15 PM", "2:30 PM", "4:00 PM", "5:15 PM"];
    const statuses = ["confirmed", "pending"];

    // Generate 2-4 random appointments
    const count = Math.floor(Math.random() * 3) + 2;
    const appointments = [];

    for (let i = 0; i < count; i++) {
      appointments.push({
        id: i + 1,
        therapistName: therapists[Math.floor(Math.random() * therapists.length)].name,
        therapistImage: therapists[Math.floor(Math.random() * therapists.length)].image,
        date: dates[Math.floor(Math.random() * dates.length)],
        time: times[Math.floor(Math.random() * times.length)],
        type: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
      });
    }

    return appointments;
  };

  const generateExercises = () => {
    const exerciseNames = [
      "Shoulder Mobility",
      "Knee Stability",
      "Core Strengthening",
      "Hip Flexor Stretch",
      "Balance Training",
      "Rotator Cuff Exercise",
      "Ankle Mobility",
      "Posture Correction",
      "Neck Stretches",
      "Lower Back Routine"
    ];

    const timeframes = ["Today", "Yesterday", "2 days ago", "3 days ago", "This morning"];
    const durations = ["10 min", "15 min", "20 min", "25 min", "30 min"];

    // Generate 3-5 random exercises
    const count = Math.floor(Math.random() * 3) + 3;
    const exercises = [];

    for (let i = 0; i < count; i++) {
      const sets = Math.floor(Math.random() * 3) + 2;
      const reps = Math.floor(Math.random() * 10) + 8;
      const progress = Math.floor(Math.random() * 60) + 40; // 40-100%

      exercises.push({
        id: i + 1,
        name: exerciseNames[Math.floor(Math.random() * exerciseNames.length)],
        lastPerformed: timeframes[Math.floor(Math.random() * timeframes.length)],
        duration: durations[Math.floor(Math.random() * durations.length)],
        sets,
        reps,
        progress,
      });
    }

    return exercises;
  };

  const generateMessages = () => {
    const senders = [
      { name: "Dr. Sarah Johnson", image: "/caring-doctor.png" },
      { name: "Reception", image: "/friendly-receptionist.png" },
      { name: "Dr. Michael Chen", image: "/athletic-man-short-hair.png" },
      { name: "Appointment System", image: "/placeholder-logo.png" }
    ];

    const messageTemplates = [
      "How are you feeling after yesterday's session? Any soreness or discomfort?",
      "Your insurance claim has been processed successfully. No further action needed.",
      "I've reviewed your progress data. Great improvement on your {exercise} exercises!",
      "Reminder: Your next appointment is scheduled for {date} at {time}.",
      "New exercise routine has been added to your program. Please review when you have time.",
      "Your recent assessment shows significant improvement in mobility. Keep up the good work!",
      "Please complete the feedback form for your last session when you have a moment."
    ];

    const timeframes = ["Just now", "5 minutes ago", "30 minutes ago", "1 hour ago", "2 hours ago", "Yesterday"];

    // Generate 2-4 random messages
    const count = Math.floor(Math.random() * 3) + 2;
    const messages = [];

    for (let i = 0; i < count; i++) {
      const sender = senders[Math.floor(Math.random() * senders.length)];
      let message = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];

      // Replace placeholders
      message = message.replace("{exercise}", ["shoulder", "knee", "core", "balance"][Math.floor(Math.random() * 4)]);
      message = message.replace("{date}", ["May 25", "May 28", "June 2"][Math.floor(Math.random() * 3)]);
      message = message.replace("{time}", ["9:00 AM", "2:30 PM", "4:15 PM"][Math.floor(Math.random() * 3)]);

      messages.push({
        id: i + 1,
        sender: sender.name,
        senderImage: sender.image,
        message,
        time: timeframes[Math.floor(Math.random() * timeframes.length)],
        unread: Math.random() > 0.5, // 50% chance of being unread
      });
    }

    return messages;
  };

  const generateProgressMetrics = () => {
    return [
      {
        id: 1,
        name: "Range of Motion",
        current: Math.floor(Math.random() * 40) + 80, // 80-120
        target: 120,
        unit: "degrees",
        change: `+${Math.floor(Math.random() * 8) + 2}`, // +2 to +10
        trend: "up",
      },
      {
        id: 2,
        name: "Pain Level",
        current: Math.floor(Math.random() * 4) + 1, // 1-5
        target: 0,
        unit: "/10",
        change: `-${Math.floor(Math.random() * 2) + 1}`, // -1 or -2
        trend: "down",
      },
      {
        id: 3,
        name: "Strength",
        current: Math.floor(Math.random() * 25) + 60, // 60-85
        target: 85,
        unit: "%",
        change: `+${Math.floor(Math.random() * 10) + 5}`, // +5 to +15
        trend: "up",
      },
    ];
  };

  // State with dynamic data
  const [upcomingAppointments, setUpcomingAppointments] = useState(generateAppointments());
  const [recentExercises, setRecentExercises] = useState(generateExercises());
  const [messages, setMessages] = useState(generateMessages());
  const [progressMetrics, setProgressMetrics] = useState(generateProgressMetrics());

  // Simulate real-time updates
  useEffect(() => {
    // Update data every 30 seconds to simulate real-time changes
    const interval = setInterval(() => {
      // 20% chance to update appointments
      if (Math.random() < 0.2) {
        setUpcomingAppointments(generateAppointments());
      }

      // 30% chance to update exercises
      if (Math.random() < 0.3) {
        setRecentExercises(generateExercises());
      }

      // 40% chance to update messages
      if (Math.random() < 0.4) {
        setMessages(generateMessages());
      }

      // 25% chance to update progress metrics
      if (Math.random() < 0.25) {
        setProgressMetrics(generateProgressMetrics());
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-[#f0f4f9]">
      {/* Sidebar */}
      <div className="w-[78px] bg-gradient-to-b from-[#001a41] to-[#003366] flex flex-col items-center py-6">
        <div className="mb-8">
          <Image src="/kinetic-new-logo.png" alt="Kinetic Logo" width={60} height={60} />
          <span className="text-white text-xs font-bold mt-1 block text-center">KINETIC</span>
        </div>

        <nav className="flex flex-col items-center space-y-6 flex-1">
          <Link
            href="/dashboard"
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white"
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
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
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
          {/* Header with Notifications */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">Welcome back, {user?.name || "User"}</h1>
              <p className="text-gray-500">Here's an overview of your rehabilitation journey</p>
            </div>
            <div className="flex items-center">
              <NotificationSystem />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-[#014585] to-[#0070c0] text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Schedule Appointment</CardTitle>
                  <CardDescription className="text-blue-100">Book your next session</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-blue-200" />
                      <span>Available slots</span>
                    </div>
                    <Link href="/appointments/schedule">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white text-[#014585] hover:bg-blue-100 hover:text-[#014585]"
                      >
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <Card className="bg-gradient-to-br from-[#7e58f4] to-[#5a3dc8] text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">OpenPose AI</CardTitle>
                  <CardDescription className="text-purple-100">Analyze your movement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Camera className="mr-2 h-5 w-5 text-purple-200" />
                      <span>Real-time analysis</span>
                    </div>
                    <Link href="/pose-estimation">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white text-[#7e58f4] hover:bg-purple-100 hover:text-[#5a3dc8]"
                      >
                        Start Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Today's Exercises</CardTitle>
                  <CardDescription>Complete your assigned routine</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Activity className="mr-2 h-5 w-5 text-[#014585]" />
                      <span>3 exercises pending</span>
                    </div>
                    <Link href="/exercises">
                      <Button size="sm" className="bg-[#014585] hover:bg-[#013a70]">
                        Start Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Track Progress</CardTitle>
                  <CardDescription>Monitor your rehabilitation journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <BarChart2 className="mr-2 h-5 w-5 text-[#014585]" />
                      <span>View your metrics</span>
                    </div>
                    <Link href="/progress">
                      <Button size="sm" className="bg-[#014585] hover:bg-[#013a70]">
                        View Stats
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Appointments */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle>Upcoming Appointments</CardTitle>
                      <Link href="/appointments">
                        <Button variant="ghost" className="h-8 text-[#014585]">
                          View All
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {upcomingAppointments.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center">
                              <div className="relative w-10 h-10 mr-3">
                                <Image
                                  src={appointment.therapistImage || "/placeholder.svg"}
                                  alt={appointment.therapistName}
                                  fill
                                  className="rounded-full object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{appointment.therapistName}</h3>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  <span className="mr-2">{appointment.date}</span>
                                  <Clock className="w-3 h-3 mr-1" />
                                  <span>{appointment.time}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="mr-4 text-right">
                                <span className="text-sm text-gray-600">{appointment.type}</span>
                                <div className="flex items-center justify-end">
                                  {appointment.status === "confirmed" ? (
                                    <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                                  ) : (
                                    <AlertCircle className="w-3 h-3 text-amber-500 mr-1" />
                                  )}
                                  <span
                                    className={`text-xs ${
                                      appointment.status === "confirmed" ? "text-green-500" : "text-amber-500"
                                    }`}
                                  >
                                    {appointment.status === "confirmed" ? "Confirmed" : "Pending"}
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
                        <p className="text-gray-500">No upcoming appointments</p>
                        <Link href="/appointments/schedule">
                          <Button className="mt-2 bg-[#014585] hover:bg-[#013a70]">Schedule Now</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Exercises */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle>Recent Exercises</CardTitle>
                      <Link href="/exercises">
                        <Button variant="ghost" className="h-8 text-[#014585]">
                          View All
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentExercises.map((exercise) => (
                        <div key={exercise.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium text-gray-900">{exercise.name}</h3>
                            <span className="text-sm text-gray-500">{exercise.lastPerformed}</span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-3 h-3 mr-1" />
                              <span className="mr-3">{exercise.duration}</span>
                              <span>
                                {exercise.sets} sets × {exercise.reps} reps
                              </span>
                            </div>
                            <Link href={`/exercises/detail/${exercise.id}`}>
                              <Button size="sm" variant="outline" className="h-7 text-[#014585]">
                                Details
                              </Button>
                            </Link>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#014585] h-2 rounded-full"
                              style={{ width: `${exercise.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">Progress</span>
                            <span className="text-xs font-medium">{exercise.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Progress Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle>Progress Summary</CardTitle>
                      <Link href="/progress">
                        <Button variant="ghost" className="h-8 text-[#014585]">
                          Details
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {progressMetrics.map((metric) => (
                        <div key={metric.id} className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{metric.name}</h3>
                            <div className="flex items-center">
                              <span className="text-xl font-semibold mr-1">
                                {metric.current}
                                {metric.unit}
                              </span>
                              <span className="text-xs text-gray-500">/ {metric.target + metric.unit} target</span>
                            </div>
                          </div>
                          <div
                            className={`flex items-center ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`}
                          >
                            <span className="text-lg font-medium">{metric.change}</span>
                            <ArrowRight
                              className={`h-4 w-4 ml-1 ${metric.trend === "up" ? "rotate-[-45deg]" : "rotate-45deg"}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Messages */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
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
              </motion.div>

              {/* OpenPose Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="pb-3 bg-gradient-to-r from-[#014585] to-[#0070c0] text-white">
                    <div className="flex justify-between items-center">
                      <CardTitle>OpenPose AI Analysis</CardTitle>
                      <Link href="/pose-estimation">
                        <Button variant="secondary" size="sm" className="bg-white text-[#014585] hover:bg-blue-100">
                          Open Tool
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="relative aspect-video bg-gray-900">
                      <Image
                        src="/movement-intelligence.png"
                        alt="OpenPose Analysis"
                        fill
                        className="object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                        <h3 className="text-white font-medium mb-1">Real-time Movement Analysis</h3>
                        <p className="text-white/80 text-sm">Track your form and get instant feedback on your exercises</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-900">Recent Analysis</h4>
                        <span className="text-xs text-gray-500">Last updated: Today</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span>Posture Accuracy</span>
                          </div>
                          <span className="font-medium">{Math.floor(Math.random() * 15) + 85}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            <span>Movement Fluidity</span>
                          </div>
                          <span className="font-medium">{Math.floor(Math.random() * 20) + 75}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                            <span>Exercise Completion</span>
                          </div>
                          <span className="font-medium">{Math.floor(Math.random() * 10) + 90}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Link href="/pose-estimation">
                        <Button
                          variant="outline"
                          className="w-full justify-between text-[#014585] hover:text-[#013a70] bg-blue-50"
                        >
                          OpenPose AI Analysis
                          <Camera className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href="/video-library/exercise-demos">
                        <Button
                          variant="outline"
                          className="w-full justify-between text-[#014585] hover:text-[#013a70]"
                        >
                          Exercise Demonstrations
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href="/progress/reports">
                        <Button
                          variant="outline"
                          className="w-full justify-between text-[#014585] hover:text-[#013a70]"
                        >
                          Progress Reports
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href="/profile/billing">
                        <Button
                          variant="outline"
                          className="w-full justify-between text-[#014585] hover:text-[#013a70]"
                        >
                          Billing & Insurance
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
