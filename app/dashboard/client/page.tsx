"use client"

import { useState, useEffect } from "react"
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
  LogOut,
  Camera,
  Video,
  FileCheck,
  Pill,
  CalendarClock,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useSocket } from "@/lib/socket-provider"
import { NotificationSystem } from "@/components/notification-system"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"

export default function ClientDashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { socket, isConnected } = useSocket()

  // Redirect if not a patient
  useEffect(() => {
    if (user && user.role !== "patient") {
      if (user.role === "provider") {
        router.push("/dashboard/provider")
      } else if (user.role === "admin") {
        router.push("/dashboard/admin")
      }
    }
  }, [user, router])

  // Listen for socket events
  useEffect(() => {
    if (isConnected) {
      // Listen for appointment updates
      const handleAppointmentUpdate = (event) => {
        setNotificationMessage("Jadwal janji temu Anda telah diperbarui");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        setUpcomingAppointments(generateAppointments());
      };
      
      // Listen for exercise updates
      const handleExerciseUpdate = (event) => {
        setNotificationMessage("Program latihan Anda telah diperbarui");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        setRecentExercises(generateExercises());
      };
      
      // Listen for progress updates
      const handleProgressUpdate = (event) => {
        setNotificationMessage("Data progres Anda telah diperbarui");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        setProgressMetrics(generateProgressMetrics());
      };
      
      // Listen for video call initiations
      const handleVideoCallInitiated = (event) => {
        const { appointmentId, sessionId } = event.detail;
        setNotificationMessage("Panggilan video masuk. Mengalihkan ke halaman panggilan...");
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
          router.push(`/appointments/${appointmentId}/video-call?session=${sessionId}`);
        }, 2000);
      };
      
      // Add event listeners
      window.addEventListener("appointment_update", handleAppointmentUpdate);
      window.addEventListener("exercise_update", handleExerciseUpdate);
      window.addEventListener("progress_update", handleProgressUpdate);
      window.addEventListener("video_call_initiated", handleVideoCallInitiated);
      
      // Remove event listeners on cleanup
      return () => {
        window.removeEventListener("appointment_update", handleAppointmentUpdate);
        window.removeEventListener("exercise_update", handleExerciseUpdate);
        window.removeEventListener("progress_update", handleProgressUpdate);
        window.removeEventListener("video_call_initiated", handleVideoCallInitiated);
      };
    }
  }, [isConnected, router])

  // Generate dynamic data for appointments
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
      const therapistIndex = Math.floor(Math.random() * therapists.length);
      appointments.push({
        id: i + 1,
        therapistName: therapists[therapistIndex].name,
        therapistImage: therapists[therapistIndex].image,
        date: dates[Math.floor(Math.random() * dates.length)],
        time: times[Math.floor(Math.random() * times.length)],
        type: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
      });
    }

    return appointments;
  };

  // Generate dynamic data for exercises
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

  // Generate dynamic data for messages
  const generateMessages = () => {
    const senders = [
      { name: "Dr. Sarah Johnson", image: "/caring-doctor.png" },
      { name: "Reception", image: "/friendly-receptionist.png" },
      { name: "Dr. Michael Chen", image: "/athletic-man-short-hair.png" },
      { name: "Appointment System", image: "/kinetic-logo.png" }
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

  // Generate dynamic data for progress metrics
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

  // Generate dynamic data for medications
  const generateMedications = () => {
    const medicationNames = [
      "Ibuprofen",
      "Acetaminophen",
      "Naproxen",
      "Cyclobenzaprine",
      "Diclofenac",
      "Meloxicam"
    ];

    const dosages = ["400mg", "500mg", "10mg", "20mg", "50mg", "100mg"];
    const frequencies = ["Once daily", "Twice daily", "Three times daily", "Every 4-6 hours", "As needed"];

    // Generate 2-3 random medications
    const count = Math.floor(Math.random() * 2) + 2;
    const medications = [];

    for (let i = 0; i < count; i++) {
      medications.push({
        id: i + 1,
        name: medicationNames[Math.floor(Math.random() * medicationNames.length)],
        dosage: dosages[Math.floor(Math.random() * dosages.length)],
        frequency: frequencies[Math.floor(Math.random() * frequencies.length)],
        nextDose: ["In 2 hours", "In 4 hours", "Tonight", "Tomorrow morning"][Math.floor(Math.random() * 4)],
        refillDate: ["June 15", "June 30", "July 10", "July 25"][Math.floor(Math.random() * 4)],
      });
    }

    return medications;
  };

  // State with dynamic data
  const [upcomingAppointments, setUpcomingAppointments] = useState(generateAppointments());
  const [recentExercises, setRecentExercises] = useState(generateExercises());
  const [messages, setMessages] = useState(generateMessages());
  const [progressMetrics, setProgressMetrics] = useState(generateProgressMetrics());
  const [medications, setMedications] = useState(generateMedications());
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // Handler for scheduling a new appointment
  const handleScheduleAppointment = () => {
    // Menampilkan notifikasi bahwa kita sedang mengalihkan ke halaman jadwal
    setNotificationMessage("Mengalihkan ke halaman penjadwalan...");
    setShowNotification(true);
    
    // Simulasi API call untuk memeriksa ketersediaan jadwal
    setTimeout(() => {
      setShowNotification(false);
      router.push("/appointments/schedule");
    }, 1000);
  };

  // Handler for viewing exercise details
  const handleViewExercise = (exerciseId) => {
    // Simulasi API call untuk mendapatkan detail latihan
    setNotificationMessage("Memuat detail latihan...");
    setShowNotification(true);
    
    // Simulasi API call
    setTimeout(() => {
      setShowNotification(false);
      router.push(`/exercises/detail?id=${exerciseId}`);
    }, 800);
  };

  // Handler for starting a video consultation
  const handleStartVideoConsultation = (appointmentId) => {
    // Simulasi API call untuk memulai sesi video
    setNotificationMessage("Mempersiapkan sesi video konsultasi...");
    setShowNotification(true);
    
    // Simulasi API call ke backend
    setTimeout(() => {
      // Simulasi respons dari server
      const sessionId = `session-${Date.now()}`;
      
      // Jika socket tersedia, kirim event untuk memulai panggilan video
      if (socket && isConnected) {
        socket.emit("video_call_initiated", {
          appointmentId,
          sessionId,
          userId: user?.id || "current-user-id",
        });
      }
      
      setShowNotification(false);
      router.push(`/appointments/${appointmentId}/video-call?session=${sessionId}`);
    }, 1500);
  };

  // Handler for messaging a provider
  const handleMessageProvider = (providerId) => {
    // Simulasi API call untuk memeriksa riwayat pesan
    setNotificationMessage("Memuat riwayat pesan...");
    setShowNotification(true);
    
    // Simulasi API call
    setTimeout(() => {
      // Jika socket tersedia, bergabung dengan room chat
      if (socket && isConnected) {
        const roomId = `chat-${user?.id || "current-user-id"}-${providerId}`;
        socket.emit("join_room", roomId);
      }
      
      setShowNotification(false);
      router.push(`/messages/${providerId}`);
    }, 1000);
  };

  // Handler for viewing progress details
  const handleViewProgress = (metricId) => {
    // Simulasi API call untuk mendapatkan data progres
    setNotificationMessage("Memuat data progres...");
    setShowNotification(true);
    
    // Simulasi API call
    setTimeout(() => {
      // Simulasi respons dari server dengan data progres
      const progressData = {
        id: metricId,
        history: Array.from({ length: 10 }, (_, i) => ({
          date: new Date(Date.now() - (9 - i) * 24 * 60 * 60 * 1000),
          value: Math.floor(Math.random() * 40) + 60
        }))
      };
      
      // Simpan data di localStorage untuk digunakan di halaman progres
      localStorage.setItem(`progress-${metricId}`, JSON.stringify(progressData));
      
      setShowNotification(false);
      router.push(`/progress/${metricId}`);
    }, 1000);
  };

  // Handler for starting pose estimation session
  const handleStartPoseEstimation = () => {
    setNotificationMessage("Mempersiapkan sesi pose estimation...");
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
      router.push("/pose-estimation");
    }, 1000);
  };

  // Handler for starting physiotherapy session
  const handleStartPhysiotherapy = () => {
    setNotificationMessage("Mempersiapkan sesi physiotherapy...");
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
      router.push("/physiotherapy");
    }, 1000);
  };

  // Handler for viewing medication details
  const handleViewMedication = (medicationId) => {
    // Simulasi API call untuk mendapatkan detail obat
    setNotificationMessage("Memuat detail obat...");
    setShowNotification(true);
    
    // Simulasi API call
    setTimeout(() => {
      // Simulasi respons dari server
      const medicationDetails = medications.find(med => med.id === medicationId);
      
      if (medicationDetails) {
        // Tampilkan detail obat dalam notifikasi
        setNotificationMessage(`${medicationDetails.name} ${medicationDetails.dosage}: ${medicationDetails.frequency}. Dosis berikutnya: ${medicationDetails.nextDose}`);
        setTimeout(() => setShowNotification(false), 3000);
      } else {
        setNotificationMessage("Detail obat tidak ditemukan");
        setTimeout(() => setShowNotification(false), 3000);
      }
    }, 800);
  };

  // Handler for starting OpenPose analysis
  const handleStartOpenPose = () => {
    // Simulasi API call untuk memeriksa ketersediaan OpenPose
    setNotificationMessage("Memeriksa ketersediaan OpenPose AI...");
    setShowNotification(true);
    
    // Simulasi API call
    setTimeout(() => {
      // Simulasi respons dari server
      const isAvailable = true;
      
      if (isAvailable) {
        setShowNotification(false);
        router.push("/pose-estimation");
      } else {
        setNotificationMessage("OpenPose AI sedang dalam pemeliharaan. Silakan coba lagi nanti.");
        setTimeout(() => setShowNotification(false), 3000);
      }
    }, 1000);
  };

  // Handler for viewing recovery journey
  const handleViewRecoveryJourney = () => {
    // Simulasi API call untuk mendapatkan data perjalanan pemulihan
    setNotificationMessage("Memuat data perjalanan pemulihan...");
    setShowNotification(true);
    
    // Simulasi API call
    setTimeout(() => {
      // Simulasi respons dari server dengan data perjalanan pemulihan
      const journeyData = {
        startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        milestones: [
          { date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), title: "Awal Terapi", description: "Memulai program rehabilitasi" },
          { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), title: "Peningkatan Mobilitas", description: "Peningkatan 20% dalam rentang gerak" },
          { date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), title: "Pengurangan Nyeri", description: "Tingkat nyeri berkurang dari 7/10 menjadi 4/10" },
        ],
        currentStatus: "Dalam Progres",
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };
      
      // Simpan data di localStorage untuk digunakan di halaman perjalanan pemulihan
      localStorage.setItem("recovery_journey", JSON.stringify(journeyData));
      
      setShowNotification(false);
      router.push("/recovery-journey");
    }, 1200);
  };

  // Fungsi untuk memperbarui data secara berkala
  useEffect(() => {
    // Hanya jalankan jika pengguna sudah login
    if (user) {
      // Simulasi pembaruan data dari server setiap 30 detik
      const dataUpdateInterval = setInterval(() => {
        // 20% kemungkinan mendapatkan pembaruan
        if (Math.random() < 0.2) {
          // Pilih acak jenis pembaruan
          const updateTypes = ['appointment', 'exercise', 'message', 'progress'];
          const updateType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
          
          // Perbarui data berdasarkan jenis
          switch (updateType) {
            case 'appointment':
              setUpcomingAppointments(generateAppointments());
              setNotificationMessage("Jadwal janji temu Anda telah diperbarui");
              break;
            case 'exercise':
              setRecentExercises(generateExercises());
              setNotificationMessage("Program latihan Anda telah diperbarui");
              break;
            case 'message':
              setMessages(generateMessages());
              setNotificationMessage("Anda memiliki pesan baru");
              break;
            case 'progress':
              setProgressMetrics(generateProgressMetrics());
              setNotificationMessage("Data progres Anda telah diperbarui");
              break;
          }
          
          // Tampilkan notifikasi
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        }
      }, 30000);
      
      return () => clearInterval(dataUpdateInterval);
    }
  }, [user]);

  return (
    <div className="flex-1 overflow-auto bg-[#f0f4f9]">
      {showNotification && <NotificationSystem message={notificationMessage} />}
      
      <div className="p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#111827]">Welcome back, {user?.name || "Alex"}</h1>
          <p className="text-gray-500">Here's an overview of your recovery journey</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-[#014585] to-[#0070c0] text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Next Appointment</CardTitle>
                <CardDescription className="text-blue-100">
                  {upcomingAppointments.length > 0
                    ? `${upcomingAppointments[0].date}, ${upcomingAppointments[0].time}`
                    : "No upcoming appointments"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  {upcomingAppointments.length > 0 ? (
                    <div className="flex items-center">
                      <div className="relative w-8 h-8 mr-2 rounded-full overflow-hidden">
                        <Image
                          src={upcomingAppointments[0].therapistImage}
                          alt={upcomingAppointments[0].therapistName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span>{upcomingAppointments[0].therapistName}</span>
                    </div>
                  ) : (
                    <span>Schedule your next session</span>
                  )}
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white text-[#014585] hover:bg-blue-100 hover:text-[#014585]"
                    onClick={handleScheduleAppointment}
                  >
                    {upcomingAppointments.length > 0 ? "View Details" : "Schedule"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-[#7e58f4] to-[#5a3dc8] text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Exercise Plan</CardTitle>
                <CardDescription className="text-purple-100">
                  {recentExercises.length} exercises assigned
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-purple-200" />
                    <span>View today's routine</span>
                  </div>
                  <Link href="/exercises">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white text-[#7e58f4] hover:bg-purple-100 hover:text-[#5a3dc8]"
                    >
                      Start Exercises
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recovery Progress</CardTitle>
                <CardDescription>
                  {progressMetrics[0].change} improvement this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <BarChart2 className="mr-2 h-5 w-5 text-[#014585]" />
                    <span>View detailed metrics</span>
                  </div>
                  <Link href="/progress">
                    <Button size="sm" className="bg-[#014585] hover:bg-[#013a70]">
                      View Progress
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pose Estimation</CardTitle>
                <CardDescription>Real-time movement tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Camera className="mr-2 h-5 w-5 text-[#014585]" />
                    <span>Analyze movement</span>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-[#014585] hover:bg-[#013a70]"
                    onClick={handleStartPoseEstimation}
                  >
                    Start Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-[#53d08a] to-[#3fb370] text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Physiotherapy Session</CardTitle>
                <CardDescription className="text-green-100">
                  Interactive therapy with AI guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-green-200" />
                    <span>Start guided session</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="bg-white text-[#53d08a] hover:bg-green-100 hover:text-[#3fb370]"
                    onClick={handleStartPhysiotherapy}
                  >
                    Start Session
                  </Button>
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
                    <Button
                      variant="ghost" 
                      className="h-8 text-[#014585] hover:bg-blue-50 hover:text-[#013a70] transition-colors"
                      onClick={handleScheduleAppointment}
                    >
                      Schedule New
                    </Button>
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
                                  className={`text-xs ${appointment.status === "confirmed" ? "text-green-500" : "text-amber-500"}`}
                                >
                                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              {appointment.type.includes("Video") && (
                                <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-[#014585] hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                onClick={() => handleStartVideoConsultation(appointment.id)}
                              >
                                <Video className="h-3 w-3 mr-1" /> Join
                              </Button>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-[#014585] hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                onClick={() => handleMessageProvider(appointment.id)}
                              >
                                <MessageSquare className="h-3 w-3 mr-1" /> Message
                              </Button>
                              <Link href={`/appointments/${appointment.id}`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No upcoming appointments</p>
                      <Button 
                        className="mt-4 bg-[#014585] hover:bg-[#013a70] transition-colors transform hover:scale-105 duration-200"
                        onClick={handleScheduleAppointment}
                      >
                        Schedule an Appointment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Exercise Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Exercise Progress</CardTitle>
                    <Link href="/exercises">
                      <Button variant="ghost" className="h-8 text-[#014585] hover:bg-blue-50 hover:text-[#013a70] transition-colors">
                        View All Exercises
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
                          <span className="text-xs text-gray-500">Last performed: {exercise.lastPerformed}</span>
                        </div>
                        <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
                          <span>{exercise.sets} sets × {exercise.reps} reps</span>
                          <span>{exercise.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="flex-1 mr-4">
                            <Progress value={exercise.progress} className="h-2" />
                          </div>
                          <span className="text-sm font-medium">{exercise.progress}%</span>
                        </div>
                        <div className="flex justify-end mt-3">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-[#014585] hover:bg-blue-50 hover:border-blue-300 transition-colors"
                            onClick={() => handleViewExercise(exercise.id)}
                          >
                            View Details
                          </Button>
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
            {/* Progress Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Recovery Metrics</CardTitle>
                    <Link href="/progress">
                      <Button variant="ghost" className="h-8 text-[#014585] hover:bg-blue-50 hover:text-[#013a70] transition-colors">
                        View All
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {progressMetrics.map((metric) => (
                      <div 
                        key={metric.id} 
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer"
                        onClick={() => handleViewProgress(metric.id)}
                      >
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{metric.name}</h3>
                          <div className="flex items-center">
                            <span className="text-xl font-semibold mr-1">
                              {metric.current}
                              {metric.unit || ""}
                            </span>
                            {metric.target && (
                              <span className="text-xs text-gray-500">
                                / {metric.target}
                                {metric.unit || ""}
                              </span>
                            )}
                          </div>
                        </div>
                        <div
                          className={`flex items-center ${metric.trend === "up" ? (metric.name === "Pain Level" ? "text-red-500" : "text-green-500") : (metric.name === "Pain Level" ? "text-green-500" : "text-red-500")}`}
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
                      <Button variant="ghost" className="h-8 text-[#014585] hover:bg-blue-50 hover:text-[#013a70] transition-colors">
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
                            className={`p-3 rounded-lg ${message.unread ? "bg-blue-50 border-l-2 border-[#014585]" : "bg-gray-50"}`}
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

            {/* Medications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Medications</CardTitle>
                </CardHeader>
                <CardContent>
                  {medications.length > 0 ? (
                    <div className="space-y-3">
                      {medications.map((medication) => (
                        <div 
                          key={medication.id} 
                          className="p-3 bg-gray-50 rounded-lg cursor-pointer"
                          onClick={() => handleViewMedication(medication.id)}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              <Pill className="h-4 w-4 text-[#014585] mr-2" />
                              <h3 className="font-medium text-gray-900">{medication.name}</h3>
                            </div>
                            <span className="text-sm font-medium text-gray-600">{medication.dosage}</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{medication.frequency}</span>
                            <div className="flex items-center">
                              <CalendarClock className="h-3 w-3 mr-1" />
                              <span>Next: {medication.nextDose}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="text-right mt-2">
                        <Button 
                          variant="link" 
                          className="text-[#014585] p-0 h-auto hover:text-[#013a70] transition-colors"
                          onClick={() => {
                            setNotificationMessage("Jadwal pengobatan akan tersedia dalam pembaruan berikutnya");
                            setShowNotification(true);
                            setTimeout(() => setShowNotification(false), 3000);
                          }}
                        >
                          View Medication Schedule
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No medications</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-between text-[#014585] hover:text-[#013a70] bg-blue-50 hover:bg-blue-100 transition-colors transform hover:scale-[1.02] duration-200"
                      onClick={handleStartOpenPose}
                    >
                      OpenPose Movement Analysis
                      <Camera className="ml-2 h-4 w-4" />
                    </Button>
                    <Link href="/video-library/exercise-demos">
                      <Button
                        variant="outline"
                        className="w-full justify-between text-[#014585] hover:text-[#013a70] hover:bg-blue-50 transition-colors transform hover:scale-[1.02] duration-200"
                      >
                        Exercise Demonstrations
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-[#014585] hover:text-[#013a70] hover:bg-blue-50 transition-colors transform hover:scale-[1.02] duration-200"
                      onClick={handleViewRecoveryJourney}
                    >
                      Recovery Journey
                      <FileCheck className="ml-2 h-4 w-4" />
                    </Button>
                    <Link href="/profile/billing">
                      <Button
                        variant="outline"
                        className="w-full justify-between text-[#014585] hover:text-[#013a70] hover:bg-blue-50 transition-colors transform hover:scale-[1.02] duration-200"
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
  )
}