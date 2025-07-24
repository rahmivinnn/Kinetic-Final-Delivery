"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Home,
  Activity,
  Users,
  MessageSquare,
  BarChart2,
  FileText,
  User,
  Settings,
  Search,
  Plus,
  Eye,
  MoreVertical,
  Play,
  LogOut,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { VideoModal } from "@/components/video-modal"

export default function VideoLibraryPage() {
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("my-submissions")
  
  // Video modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalVideoUrl, setModalVideoUrl] = useState('')
  const [modalPosterUrl, setModalPosterUrl] = useState('')
  const [modalFeedbackText, setModalFeedbackText] = useState('')
  
  // Loading and status states
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const openVideoModal = (title: string, videoUrl: string = '', posterUrl: string = '', feedbackText: string = '') => {
    setModalTitle(title)
    setModalVideoUrl(videoUrl)
    setModalPosterUrl(posterUrl)
    setModalFeedbackText(feedbackText)
    setIsModalOpen(true)
  }

  const closeVideoModal = () => {
    setIsModalOpen(false)
  }

  // Handler functions
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsLoading(true)
      console.log('Searching for:', searchQuery)
      // Simulate search functionality
      setTimeout(() => {
        setIsLoading(false)
        alert(`Searching for videos: "${searchQuery}"`)
      }, 800)
    }
  }

  const handleUploadVideo = () => {
    setIsUploading(true)
    
    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      
      if (progress >= 100) {
        clearInterval(interval)
        setIsUploading(false)
        setUploadProgress(0)
        window.location.href = '/video-library/upload'
      }
    }, 300)
  }

  const handleViewVideo = (videoTitle: string) => {
    setIsLoading(true)
    console.log('Viewing video:', videoTitle)
    
    // Simulate loading the video
    setTimeout(() => {
      setIsLoading(false)
      // Menggunakan URL video yang valid
      openVideoModal(
        videoTitle, 
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        '/placeholder.svg'
      )
    }, 800)
  }

  // State to track videos that have been deleted
  const [deletedVideos, setDeletedVideos] = useState<string[]>([])

  const handleDeleteVideo = (videoTitle: string) => {
    if (confirm(`Are you sure you want to delete "${videoTitle}"?`)) {
      setIsLoading(true)
      console.log('Deleting video:', videoTitle)
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
        // Add the deleted video to our tracking array
        setDeletedVideos(prev => [...prev, videoTitle])
        alert(`Video "${videoTitle}" has been deleted`)
      }, 800)
    }
  }

  const handleViewFeedback = (videoTitle: string) => {
    setIsLoading(true)
    console.log('Viewing feedback for:', videoTitle)
    
    // Simulate loading the feedback
    setTimeout(() => {
      setIsLoading(false)
      openVideoModal(
        `${videoTitle} - Feedback`, 
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        '/placeholder.svg',
        'Good form overall. Try to maintain a slower, more controlled movement on the return phase.\n\nSpecific Feedback Points:\n• Your form is improving with each session\n• Pay attention to your breathing pattern during the exercise\n• Try to maintain a consistent pace throughout the movement'
      )
    }, 800)
  }

  const handleDownloadVideo = (videoTitle: string) => {
    setIsLoading(true)
    console.log('Downloading video:', videoTitle)
    
    // Simulate download
    setTimeout(() => {
      setIsLoading(false)
      alert(`Downloading video: ${videoTitle}`)
    }, 800)
  }

  const handleViewAnalysis = (videoTitle: string) => {
    setIsLoading(true)
    console.log('Viewing analysis for:', videoTitle)
    
    // Simulate loading the analysis
    setTimeout(() => {
      setIsLoading(false)
      // Menampilkan analisis tanpa video
      openVideoModal(
        `${videoTitle} - Analysis`, 
        '', // Tidak ada URL video
        '/placeholder.svg',
        'Analysis Score: 78%. Good stability and form. Areas for improvement: Knee alignment could be better during the exercise.\n\nDetailed Analysis:\n• Range of Motion: 85%\n• Form Accuracy: 82%\n• Stability: 75%\n• Consistency: 70%\n\nRecommendations:\n1. Focus on maintaining proper knee alignment throughout the exercise\n2. Try to keep a more consistent pace during repetitions\n3. Engage your core muscles to improve stability'
      )
    }, 800)
  }

  const handleWatchDemo = (exerciseTitle: string) => {
    setIsLoading(true)
    console.log('Watching demo:', exerciseTitle)
    
    // Simulate loading the demo
    setTimeout(() => {
      setIsLoading(false)
      openVideoModal(
        `${exerciseTitle} - Demo`, 
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        '/placeholder.svg',
        'This is a demonstration of the proper technique for this exercise. Pay attention to the form and movement pattern.'
      )
    }, 800)
  }

  const handleViewAll = (section: string) => {
    setIsLoading(true)
    console.log('Viewing all:', section)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert(`Opening all ${section}`)
    }, 800)
  }

  const handleViewDetailedReport = () => {
    setIsLoading(true)
    console.log('Viewing detailed report')
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert('Opening detailed submission report')
    }, 800)
  }

  const handleViewDetails = (videoTitle: string) => {
    setIsLoading(true)
    console.log('Viewing details for:', videoTitle)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert(`Opening details for: ${videoTitle}`)
    }, 800)
  }

  const handleViewAllMessages = () => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = '/messages'
    }, 800)
  }

  const handleWatchFeedbackVideo = (videoTitle: string) => {
    setIsLoading(true)
    console.log('Watching feedback video:', videoTitle)
    
    // Simulate loading the feedback video
    setTimeout(() => {
      setIsLoading(false)
      openVideoModal(
        `${videoTitle} - Feedback`, 
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        '/placeholder.svg',
        'Your stability has improved. Focus on keeping your core engaged throughout the exercise.\n\nDetailed Feedback:\n• Your range of motion is excellent\n• Continue to work on maintaining proper alignment\n• Try to incorporate the breathing techniques we discussed in your last session'
      )
    }, 800)
  }

  return (
    <div className="flex h-screen bg-[#f0f4f9] overflow-hidden">
      {/* Video Modal */}
      {isModalOpen && (
        <VideoModal
          isOpen={isModalOpen}
          onClose={closeVideoModal}
          title={modalTitle}
          videoUrl={modalVideoUrl}
          posterUrl={modalPosterUrl}
          feedbackText={modalFeedbackText}
        />
      )}
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-center mt-2">Loading...</p>
          </div>
        </div>
      )}
      
      {/* Upload Progress Indicator */}
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-3">Uploading Video</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-right mt-1 text-sm text-gray-600">{uploadProgress}%</p>
          </div>
        </div>
      )}
      
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
            className="w-10 h-10 rounded-xl bg-[#7e58f4] bg-opacity-20 flex items-center justify-center text-white"
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
            <span className="text-gray-700">Video Library</span>
          </div>

          <h1 className="text-3xl font-bold text-[#111827] mb-6">Video Library</h1>

          {/* Tabs */}
          <Tabs defaultValue="my-submissions" className="mb-6">
            <TabsList className="bg-transparent border-b border-gray-200 w-full justify-start rounded-none p-0 h-auto">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent px-4 py-2 text-gray-500 hover:text-gray-700 data-[state=active]:border-[#7e58f4] data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="exercises"
                className="rounded-none border-b-2 border-transparent px-4 py-2 text-gray-500 hover:text-gray-700 data-[state=active]:border-[#7e58f4] data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              >
                Exercises
              </TabsTrigger>
              <TabsTrigger
                value="appointments"
                className="rounded-none border-b-2 border-transparent px-4 py-2 text-gray-500 hover:text-gray-700 data-[state=active]:border-[#7e58f4] data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              >
                Appointments
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="rounded-none border-b-2 border-transparent px-4 py-2 text-gray-500 hover:text-gray-700 data-[state=active]:border-[#7e58f4] data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              >
                Messages
              </TabsTrigger>
              <TabsTrigger
                value="progress"
                className="rounded-none border-b-2 border-transparent px-4 py-2 text-gray-500 hover:text-gray-700 data-[state=active]:border-[#7e58f4] data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              >
                Progress
              </TabsTrigger>
              <TabsTrigger
                value="my-submissions"
                className="rounded-none border-b-2 border-transparent px-4 py-2 text-gray-500 hover:text-gray-700 data-[state=active]:border-[#7e58f4] data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent font-medium"
              >
                My Submissions
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search and Upload */}
          <div className="flex justify-between items-center mb-8">
            <form onSubmit={handleSearch} className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search videos..."
                className="pl-10 py-2 bg-white border-gray-200 rounded-md w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading}
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="animate-spin h-4 w-4 border-2 border-b-0 border-r-0 rounded-full border-blue-500"></span>
                </div>
              )}
            </form>
            <Button 
              onClick={handleUploadVideo} 
              className="bg-[#7e58f4] hover:bg-[#6a48d0]"
              disabled={isLoading || isUploading}
            >
              {isUploading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-1 h-4 w-4 border-2 border-b-0 border-r-0 rounded-full"></span>
                  Uploading...
                </span>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" /> Upload New Video
                </>
              )}
            </Button>
          </div>

          {/* Recent Submissions */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-[#111827]">Recent Submissions</h2>
              <Button onClick={() => handleViewAll('submissions')} variant="link" className="text-[#7e58f4] p-0 h-auto font-medium">View All</Button>
            </div>
            <p className="text-sm text-gray-500 mb-4">AI analysis usually completes within 24 hours</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Submission 1 */}
              {!deletedVideos.includes('Knee Extension') && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <Play className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">MAY 16, 2023</div>
                  <h3 className="text-lg font-semibold mb-1">Knee Extension</h3>
                  <p className="text-sm text-gray-500 mb-4">Submitted for review - Awaiting feedback</p>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleViewVideo('Knee Extension')} variant="outline" size="sm" className="text-xs font-medium" disabled={isLoading}>
                      {isLoading ? (
                        <span className="flex items-center">
                          <span className="animate-spin mr-1 h-4 w-4 border-2 border-b-0 border-r-0 rounded-full"></span>
                          Loading...
                        </span>
                      ) : (
                        "View Video"
                      )}
                    </Button>
                    <Button onClick={() => handleDeleteVideo('Knee Extension')} variant="outline" size="sm" className="text-xs text-gray-500 border-gray-300 font-medium" disabled={isLoading}>
                      Delete
                    </Button>
                  </div>
                </div>
              )}

              {/* Submission 2 */}
              {!deletedVideos.includes('Hamstring Curl') && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                      <Play className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">MAY 14, 2023</div>
                  <h3 className="text-lg font-semibold mb-1">Hamstring Curl</h3>
                  <p className="text-sm text-gray-500 mb-4">Feedback received from your physiotherapist</p>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleViewFeedback('Hamstring Curl')} variant="outline" size="sm" className="text-xs font-medium" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-1 h-4 w-4 border-2 border-b-0 border-r-0 rounded-full"></span>
                        Loading...
                      </span>
                    ) : (
                      "View Feedback"
                    )}
                  </Button>
                  <Button onClick={() => handleDeleteVideo('Hamstring Curl')} variant="outline" size="sm" className="text-xs text-gray-500 border-gray-300 font-medium" disabled={isLoading}>
                    Delete
                  </Button>
                  </div>
                </div>
              )}

              {/* Submission 3 */}
              {!deletedVideos.includes('Balance Training') && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                      <Play className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">MAY 12, 2023</div>
                  <h3 className="text-lg font-semibold mb-1">Balance Training</h3>
                  <div className="flex items-center mb-4">
                    <Badge className="bg-green-100 text-green-800 mr-2 font-medium">Good form</Badge>
                    <span className="text-xs text-gray-500">/ Needs improvement</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleViewAnalysis('Balance Training')} variant="outline" size="sm" className="text-xs font-medium" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-1 h-4 w-4 border-2 border-b-0 border-r-0 rounded-full"></span>
                        Loading...
                      </span>
                    ) : (
                      "View Analysis"
                    )}
                  </Button>
                  <Button onClick={() => handleDeleteVideo('Balance Training')} variant="outline" size="sm" className="text-xs text-gray-500 border-gray-300 font-medium" disabled={isLoading}>
                    Delete
                  </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Exercise Videos */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#111827]">Recommended Exercise Videos</h2>
              <Button onClick={() => handleViewAll('recommended exercises')} variant="link" className="text-[#7e58f4] p-0 h-auto font-medium" disabled={isLoading}>
                {isLoading ? "Loading..." : "View All"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Exercise 1 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 mb-2 font-medium">BEGINNER</Badge>
                <h3 className="text-lg font-semibold mb-1">Seated Leg Raises</h3>
                <p className="text-sm text-gray-500 mb-4">Recommended by your physiotherapist for your recovery plan</p>
                <Button onClick={() => handleWatchDemo('Seated Leg Raises')} variant="outline" size="sm" className="text-xs font-medium" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-1 h-4 w-4 border-2 border-b-0 border-r-0 rounded-full"></span>
                      Loading...
                    </span>
                  ) : (
                    "Watch Demo"
                  )}
                </Button>
              </div>

              {/* Exercise 2 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 mb-2 font-medium">INTERMEDIATE</Badge>
                <h3 className="text-lg font-semibold mb-1">Standing Balance</h3>
                <p className="text-sm text-gray-500 mb-4">Next progression in your balance training series</p>
                <Button onClick={() => handleWatchDemo('Standing Balance')} variant="outline" size="sm" className="text-xs font-medium">
                  Watch Demo
                </Button>
              </div>

              {/* Exercise 3 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                </div>
                <Badge className="bg-red-100 text-red-800 mb-2 font-medium">ADVANCED</Badge>
                <h3 className="text-lg font-semibold mb-1">Single Leg Squat</h3>
                <p className="text-sm text-gray-500 mb-4">Future goal exercise - save for later stages</p>
                <Button onClick={() => handleWatchDemo('Single Leg Squat')} variant="outline" size="sm" className="text-xs font-medium">
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>

          {/* Video Submission History */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#111827]">Video Submission History</h2>
              <Button onClick={handleViewDetailedReport} variant="link" className="text-[#7e58f4] p-0 h-auto font-medium" disabled={isLoading}>
                {isLoading ? "Loading..." : "View Detailed Report"}
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead>Exercise Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>AI Score</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!deletedVideos.includes('Knee Extension') && (
                    <TableRow>
                      <TableCell className="font-medium">May 16, 2023</TableCell>
                      <TableCell>Knee Extension</TableCell>
                      <TableCell>1:24</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">
                          Pending Review
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-blue-600">In Progress</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Button onClick={() => handleViewVideo('Knee Extension')} variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails('Knee Extension')} disabled={isLoading}>
                                {isLoading ? (
                                  <span className="flex items-center">
                                    <span className="animate-spin mr-1 h-3 w-3 border-2 border-b-0 border-r-0 rounded-full"></span>
                                    Loading...
                                  </span>
                                ) : (
                                  "View Details"
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadVideo('Knee Extension')} disabled={isLoading}>Download</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteVideo('Knee Extension')} className="text-red-600" disabled={isLoading}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {!deletedVideos.includes('Hamstring Curl') && (
                    <TableRow>
                      <TableCell className="font-medium">May 14, 2023</TableCell>
                      <TableCell>Hamstring Curl</TableCell>
                      <TableCell>2:05</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                          Reviewed
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">87%</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Button onClick={() => handleViewVideo('Hamstring Curl')} variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails('Hamstring Curl')}>View Details</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadVideo('Hamstring Curl')}>Download</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteVideo('Hamstring Curl')} className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {!deletedVideos.includes('Balance Training') && (
                    <TableRow>
                      <TableCell className="font-medium">May 12, 2023</TableCell>
                      <TableCell>Balance Training</TableCell>
                      <TableCell>1:47</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                          Reviewed
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">78%</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Button onClick={() => handleViewVideo('Balance Training')} variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails('Balance Training')}>View Details</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadVideo('Balance Training')}>Download</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteVideo('Balance Training')} className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {!deletedVideos.includes('Gait Training') && (
                    <TableRow>
                      <TableCell className="font-medium">May 10, 2023</TableCell>
                      <TableCell>Gait Training</TableCell>
                      <TableCell>3:12</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                          Reviewed
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">85%</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Button onClick={() => handleViewVideo('Gait Training')} variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails('Gait Training')}>View Details</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadVideo('Gait Training')}>Download</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteVideo('Gait Training')} className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Therapist Feedback */}
          <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#111827]">Therapist Feedback</h2>
                <Button 
                  onClick={handleViewAllMessages} 
                  variant="link" 
                  className="text-[#7e58f4] p-0 h-auto font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "View All Messages"}
                </Button>
              </div>

            <div className="space-y-4">
                {!deletedVideos.includes('Hamstring Curl') && (
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                         <Image src="/caring-doctor.png" alt="Physiotherapist" width={40} height={40} className="rounded-full" />
                       </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium">Hamstring Curl Feedback</h3>
                          <span className="text-xs text-gray-500">May 14, 2023</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Good form overall. Try to maintain a slower, more controlled movement on the return phase.
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">your physiotherapist</span>
                          <Button 
                            onClick={() => handleWatchFeedbackVideo('Hamstring Curl')} 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 flex items-center text-xs text-[#7e58f4]"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <span className="flex items-center">
                                <span className="animate-spin mr-1 h-3 w-3 border-2 border-b-0 border-r-0 rounded-full"></span>
                                Loading...
                              </span>
                            ) : (
                              <>
                                <Play className="h-3 w-3 mr-1" /> Watch Video
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!deletedVideos.includes('Balance Training') && (
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                         <Image src="/caring-doctor.png" alt="Physiotherapist" width={40} height={40} className="rounded-full" />
                       </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium">Balance Training Feedback</h3>
                          <span className="text-xs text-gray-500">May 12, 2023</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Your stability has improved. Focus on keeping your core engaged throughout the exercise.
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">your physiotherapist</span>
                          <Button 
                            onClick={() => handleWatchFeedbackVideo('Balance Training')} 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 flex items-center text-xs text-[#7e58f4]"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <span className="flex items-center">
                                <span className="animate-spin mr-1 h-3 w-3 border-2 border-b-0 border-r-0 rounded-full"></span>
                                Loading...
                              </span>
                            ) : (
                              <>
                                <Play className="h-3 w-3 mr-1" /> Watch Video
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}
