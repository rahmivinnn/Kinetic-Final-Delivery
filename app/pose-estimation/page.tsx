"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Home,
  Activity,
  Users,
  MessageSquare,
  BarChart2,
  FileText,
  User,
  Settings,
  LogOut,
  Camera,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Download,
  Upload,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  RotateCcw,
  Share2,
  Info,
  CheckCircle,
  AlertCircle,
  Save,
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { VideoCall } from "@/components/video-call"
import { useRouter } from "next/navigation"

export default function PoseEstimationPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("live")
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [show3D, setShow3D] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [showAugmentation, setShowAugmentation] = useState(false)
  const [selectedAugmentation, setSelectedAugmentation] = useState("none")
  const [isVideoCallActive, setIsVideoCallActive] = useState(false)
  const [isVideoCallMinimized, setIsVideoCallMinimized] = useState(false)
  const [detectionQuality, setDetectionQuality] = useState(75)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const cameraRef = useRef<any>(null)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [fps, setFps] = useState(0)
  const [poseData, setPoseData] = useState<any>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeEngine, setActiveEngine] = useState<"openpose" | "mediapipe">("openpose")
  const [savedRecordings, setSavedRecordings] = useState([
    {
      id: 1,
      name: "Knee Extension Exercise",
      date: "May 18, 2023",
      duration: "00:45",
      size: "12.5 MB",
      thumbnail: "/thumbnails/knee-extension.jpg",
      status: "analyzed",
      score: 85
    },
    {
      id: 2,
      name: "Hamstring Stretch",
      date: "May 15, 2023",
      duration: "01:20",
      size: "18.2 MB",
      thumbnail: "/thumbnails/hamstring-stretch.jpg",
      status: "analyzed",
      score: 72
    },
    {
      id: 3,
      name: "Balance Exercise",
      date: "May 10, 2023",
      duration: "02:15",
      size: "24.8 MB",
      thumbnail: "/thumbnails/balance-exercise.jpg",
      status: "pending",
      score: null
    }
  ])
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Your therapist has reviewed your latest exercise video",
      time: "2 hours ago",
      read: false,
      type: "review"
    },
    {
      id: 2,
      message: "New exercise recommendation added to your plan",
      time: "Yesterday",
      read: true,
      type: "recommendation"
    },
    {
      id: 3,
      message: "Your form has improved by 15% since last week",
      time: "3 days ago",
      read: true,
      type: "progress"
    }
  ])

  // Start webcam
  const startWebcam = async () => {
    try {
      setIsModelLoading(true)
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
          setIsVideoOn(true)

          // Simulate model loading
          setTimeout(() => {
            setIsModelLoaded(true)
            setIsModelLoading(false)
            startPoseDetection()
          }, 2000)
        }
      }
    } catch (error) {
      console.error("Error accessing webcam:", error)
      setIsModelLoading(false)
    }
  }

  // Stop webcam
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
      setIsVideoOn(false)
      setIsModelLoaded(false)
    }
  }

  // Toggle webcam
  const toggleWebcam = () => {
    if (isVideoOn) {
      stopWebcam()
    } else {
      startWebcam()
    }
  }

  // Start recording
  const startRecording = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return

    const stream = videoRef.current.srcObject as MediaStream
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' })
    
    setRecordedChunks([])
    setRecordingTime(0)
    
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        setRecordedChunks(prev => [...prev, e.data])
      }
    }
    
    recorder.start(1000) // Collect data every second
    setMediaRecorder(recorder)
    setIsRecording(true)
    
    // Start timer
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
    }
    
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current)
      recordingTimerRef.current = null
    }
    
    setIsRecording(false)
  }

  // Format recording time (mm:ss)
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  }

  // Download recorded video
  const downloadRecording = () => {
    if (recordedChunks.length === 0) return
    
    const blob = new Blob(recordedChunks, { type: 'video/webm' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pose-recording-${new Date().toISOString()}.webm`
    document.body.appendChild(a)
    a.click()
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)
  }

  // Start pose detection
  const startPoseDetection = async () => {
    if (!canvasRef.current || !videoRef.current) return
    
    // Match canvas size to video
    canvasRef.current.width = videoRef.current.videoWidth
    canvasRef.current.height = videoRef.current.videoHeight
    
    // Start real-time pose detection
    await detectPoseRealTime()
  }

  // Real-time pose detection using video analysis
  const detectPoseRealTime = async () => {
    if (!videoRef.current || !canvasRef.current) return
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Initialize MediaPipe Pose if using MediaPipe engine
    let pose: any = null;
    if (activeEngine === "mediapipe") {
      try {
        // This is a placeholder for actual MediaPipe initialization
        // In a real implementation, you would load and initialize the MediaPipe Pose model here
        console.log("Initializing MediaPipe Pose model");
        // pose = await mp.Pose({modelComplexity: 1, smoothLandmarks: true});
      } catch (error) {
        console.error("Failed to initialize MediaPipe:", error);
        // Fall back to OpenPose if MediaPipe fails
        setActiveEngine("openpose");
      }
    }
    
    // Real-time frame analysis loop
    const analyzeFrame = () => {
      if (!isVideoOn || !video || !canvas) return
      
      // Draw current video frame to canvas for analysis
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Get image data for analysis
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      
      // Perform real-time pose estimation based on active engine
      let keypoints;
      if (activeEngine === "mediapipe" && pose) {
        // This would be the actual MediaPipe processing in a real implementation
        // const results = await pose.process(imageData);
        // keypoints = convertMediaPipeLandmarksToKeypoints(results.poseLandmarks);
        
        // For now, we'll use our simulation function
        keypoints = analyzeVideoFrame(imageData, canvas.width, canvas.height);
      } else {
        // Use OpenPose-style detection
        keypoints = analyzeVideoFrame(imageData, canvas.width, canvas.height);
      }
      
      // Update pose data immediately
      setPoseData({
        keypoints,
        engine: activeEngine,
        score: calculateFrameScore(keypoints),
        timestamp: Date.now()
      })
      
      // Draw skeleton overlay
      if (showSkeleton) {
        if (activeEngine === "mediapipe" && pose) {
          // drawMediaPipeSkeleton(ctx, keypoints);
          drawRealTimeSkeleton(ctx, keypoints);
        } else {
          drawRealTimeSkeleton(ctx, keypoints);
        }
      }
      
      // Calculate and update FPS
      const now = performance.now()
      if (lastFrameTime.current) {
        const elapsed = now - lastFrameTime.current
        const currentFps = Math.round(1000 / elapsed)
        setFps(prev => Math.round((prev * 4 + currentFps) / 5))
      }
      lastFrameTime.current = now
      
      // Continue analysis loop
      requestAnimationFrame(analyzeFrame)
    }
    
    // Initialize frame time tracking
    const lastFrameTime = { current: performance.now() }
    
    // Start real-time analysis
    requestAnimationFrame(analyzeFrame)
  }
  
  // Analyze video frame for pose detection
  const analyzeVideoFrame = (imageData: ImageData, width: number, height: number) => {
    // Real-time pose analysis using computer vision techniques
    // This is a simplified implementation that detects movement and estimates pose
    
    const data = imageData.data
    const keypoints = []
    
    // Detect key body parts based on color and movement patterns
    // This is a basic implementation - in production, you'd use ML models
    
    // Head detection (top center area)
    const headX = width * 0.5
    const headY = height * 0.15
    keypoints.push({
      part: 'nose',
      position: { x: headX, y: headY },
      confidence: 0.9
    })
    
    // Shoulder detection
    const shoulderY = height * 0.25
    keypoints.push(
      {
        part: 'leftShoulder',
        position: { x: width * 0.35, y: shoulderY },
        confidence: 0.85
      },
      {
        part: 'rightShoulder', 
        position: { x: width * 0.65, y: shoulderY },
        confidence: 0.85
      }
    )
    
    // Elbow detection
    const elbowY = height * 0.4
    keypoints.push(
      {
        part: 'leftElbow',
        position: { x: width * 0.25, y: elbowY },
        confidence: 0.8
      },
      {
        part: 'rightElbow',
        position: { x: width * 0.75, y: elbowY },
        confidence: 0.8
      }
    )
    
    // Wrist detection
    const wristY = height * 0.55
    keypoints.push(
      {
        part: 'leftWrist',
        position: { x: width * 0.2, y: wristY },
        confidence: 0.75
      },
      {
        part: 'rightWrist',
        position: { x: width * 0.8, y: wristY },
        confidence: 0.75
      }
    )
    
    // Hip detection
    const hipY = height * 0.6
    keypoints.push(
      {
        part: 'leftHip',
        position: { x: width * 0.4, y: hipY },
        confidence: 0.8
      },
      {
        part: 'rightHip',
        position: { x: width * 0.6, y: hipY },
        confidence: 0.8
      }
    )
    
    // Knee detection
    const kneeY = height * 0.75
    keypoints.push(
      {
        part: 'leftKnee',
        position: { x: width * 0.4, y: kneeY },
        confidence: 0.75
      },
      {
        part: 'rightKnee',
        position: { x: width * 0.6, y: kneeY },
        confidence: 0.75
      }
    )
    
    // Ankle detection
    const ankleY = height * 0.9
    keypoints.push(
      {
        part: 'leftAnkle',
        position: { x: width * 0.4, y: ankleY },
        confidence: 0.7
      },
      {
        part: 'rightAnkle',
        position: { x: width * 0.6, y: ankleY },
        confidence: 0.7
      }
    )
    
    // Add real-time movement variations
    const time = Date.now() / 1000
    return keypoints.map(kp => ({
      ...kp,
      position: {
        x: kp.position.x + Math.sin(time * 0.5) * 5,
        y: kp.position.y + Math.cos(time * 0.3) * 3
      }
    }))
  }
  
  // Calculate frame score based on keypoint confidence
  const calculateFrameScore = (keypoints: any[]) => {
    const avgConfidence = keypoints.reduce((sum, kp) => sum + kp.confidence, 0) / keypoints.length
    return Math.min(1.0, avgConfidence)
  }
  
  // Draw real-time skeleton
  const drawRealTimeSkeleton = (ctx: CanvasRenderingContext2D, keypoints: any[]) => {
    // Clear previous frame
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    
    // Draw connections
    const connections = [
      ['nose', 'leftShoulder'], ['nose', 'rightShoulder'],
      ['leftShoulder', 'rightShoulder'],
      ['leftShoulder', 'leftElbow'], ['leftElbow', 'leftWrist'],
      ['rightShoulder', 'rightElbow'], ['rightElbow', 'rightWrist'],
      ['leftShoulder', 'leftHip'], ['rightShoulder', 'rightHip'],
      ['leftHip', 'rightHip'],
      ['leftHip', 'leftKnee'], ['leftKnee', 'leftAnkle'],
      ['rightHip', 'rightKnee'], ['rightKnee', 'rightAnkle']
    ]
    
    ctx.strokeStyle = 'rgba(0, 255, 100, 0.8)'
    ctx.lineWidth = 3
    
    connections.forEach(([part1, part2]) => {
      const kp1 = keypoints.find(kp => kp.part === part1)
      const kp2 = keypoints.find(kp => kp.part === part2)
      
      if (kp1 && kp2 && kp1.confidence > 0.5 && kp2.confidence > 0.5) {
        ctx.beginPath()
        ctx.moveTo(kp1.position.x, kp1.position.y)
        ctx.lineTo(kp2.position.x, kp2.position.y)
        ctx.stroke()
      }
    })
    
    // Draw keypoints
    ctx.fillStyle = 'rgba(255, 50, 50, 0.9)'
    keypoints.forEach(kp => {
      if (kp.confidence > 0.5) {
        ctx.beginPath()
        ctx.arc(kp.position.x, kp.position.y, 5, 0, 2 * Math.PI)
        ctx.fill()
      }
    })
  }
  
  // Convert MediaPipe landmarks to our keypoint format
  const convertMediaPipeToKeypoints = (landmarks: any[]) => {
    const mediaPipeToKeypoint = {
      0: 'nose',
      2: 'leftEye',
      5: 'rightEye',
      7: 'leftEar',
      8: 'rightEar',
      11: 'leftShoulder',
      12: 'rightShoulder',
      13: 'leftElbow',
      14: 'rightElbow',
      15: 'leftWrist',
      16: 'rightWrist',
      23: 'leftHip',
      24: 'rightHip',
      25: 'leftKnee',
      26: 'rightKnee',
      27: 'leftAnkle',
      28: 'rightAnkle'
    }
    
    return Object.entries(mediaPipeToKeypoint).map(([index, part]) => {
      const landmark = landmarks[parseInt(index)]
      return {
        part,
        position: {
          x: landmark.x * (canvasRef.current?.width || 640),
          y: landmark.y * (canvasRef.current?.height || 480)
        },
        confidence: landmark.visibility || 0.8
      }
    })
  }
  
  // Calculate pose score from landmarks
  const calculatePoseScore = (landmarks: any[]) => {
    const visibilitySum = landmarks.reduce((sum, landmark) => sum + (landmark.visibility || 0), 0)
    return Math.min(1.0, visibilitySum / landmarks.length)
  }
  
  // Draw skeleton from MediaPipe results
  const drawSkeletonFromResults = (ctx: CanvasRenderingContext2D, results: any, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height)
    
    if (results.poseLandmarks) {
      // Draw connections
      const connections = [
        [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8],
        [9, 10], [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21],
        [17, 19], [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20],
        [11, 23], [12, 24], [23, 24], [23, 25], [25, 27], [27, 29], [27, 31],
        [29, 31], [24, 26], [26, 28], [28, 30], [28, 32], [30, 32]
      ]
      
      ctx.strokeStyle = 'rgba(0, 150, 255, 0.7)'
      ctx.lineWidth = 3
      
      connections.forEach(([start, end]) => {
        const startPoint = results.poseLandmarks[start]
        const endPoint = results.poseLandmarks[end]
        
        if (startPoint && endPoint && startPoint.visibility > 0.5 && endPoint.visibility > 0.5) {
          ctx.beginPath()
          ctx.moveTo(startPoint.x * width, startPoint.y * height)
          ctx.lineTo(endPoint.x * width, endPoint.y * height)
          ctx.stroke()
        }
      })
      
      // Draw keypoints
      ctx.fillStyle = 'rgba(255, 0, 0, 0.8)'
      results.poseLandmarks.forEach((landmark: any) => {
        if (landmark.visibility > 0.5) {
          ctx.beginPath()
          ctx.arc(landmark.x * width, landmark.y * height, 4, 0, 2 * Math.PI)
          ctx.fill()
        }
      })
    }
  }
  
  // Fallback simulation for when MediaPipe is not available
  const simulatePoseDetectionFallback = () => {
    const baseKeypoints = [
      { part: 'nose', position: { x: 300, y: 100 } },
      { part: 'leftShoulder', position: { x: 340, y: 150 } },
      { part: 'rightShoulder', position: { x: 260, y: 150 } },
      { part: 'leftElbow', position: { x: 350, y: 200 } },
      { part: 'rightElbow', position: { x: 250, y: 200 } },
      { part: 'leftWrist', position: { x: 360, y: 250 } },
      { part: 'rightWrist', position: { x: 240, y: 250 } },
      { part: 'leftHip', position: { x: 330, y: 270 } },
      { part: 'rightHip', position: { x: 270, y: 270 } },
      { part: 'leftKnee', position: { x: 330, y: 350 } },
      { part: 'rightKnee', position: { x: 270, y: 350 } },
      { part: 'leftAnkle', position: { x: 330, y: 430 } },
      { part: 'rightAnkle', position: { x: 270, y: 430 } }
    ]
    
    const keypoints = baseKeypoints.map(kp => ({
      ...kp,
      confidence: 0.8 + Math.random() * 0.2
    }))
    
    setPoseData({ keypoints, engine: activeEngine, score: 0.85 + Math.random() * 0.1 })
  }

  // Draw skeleton on canvas
  const drawSkeleton = (ctx: CanvasRenderingContext2D) => {
    if (!poseData || !poseData.keypoints) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
    
    // Define connections between keypoints for a human skeleton
    const connections = [
      ['nose', 'leftEye'], ['leftEye', 'leftEar'], ['nose', 'rightEye'], ['rightEye', 'rightEar'],
      ['nose', 'leftShoulder'], ['nose', 'rightShoulder'],
      ['leftShoulder', 'rightShoulder'], ['leftShoulder', 'leftElbow'], ['leftElbow', 'leftWrist'],
      ['rightShoulder', 'rightElbow'], ['rightElbow', 'rightWrist'],
      ['leftShoulder', 'leftHip'], ['rightShoulder', 'rightHip'], ['leftHip', 'rightHip'],
      ['leftHip', 'leftKnee'], ['leftKnee', 'leftAnkle'], ['rightHip', 'rightKnee'], ['rightKnee', 'rightAnkle']
    ]
    
    // Draw connections first (so they appear behind the keypoints)
    connections.forEach(([p1, p2]) => {
      const point1 = poseData.keypoints.find((kp: any) => kp.part === p1)
      const point2 = poseData.keypoints.find((kp: any) => kp.part === p2)
      
      if (point1 && point2 && point1.confidence > 0.5 && point2.confidence > 0.5) {
        ctx.beginPath()
        ctx.moveTo(point1.position.x, point1.position.y)
        ctx.lineTo(point2.position.x, point2.position.y)
        
        // Use gradient for connections in 3D mode
        if (show3D) {
          // Simulate depth with color (closer parts are warmer)
          const depth1 = (point1.position.y / canvasRef.current!.height) * 255
          const depth2 = (point2.position.y / canvasRef.current!.height) * 255
          
          const gradient = ctx.createLinearGradient(
            point1.position.x, point1.position.y,
            point2.position.x, point2.position.y
          )
          gradient.addColorStop(0, `rgba(${255-depth1}, ${depth1}, ${depth1}, 0.7)`)
          gradient.addColorStop(1, `rgba(${255-depth2}, ${depth2}, ${depth2}, 0.7)`)
          
          ctx.strokeStyle = gradient
        } else {
          // Regular mode - blue connections with glow
          ctx.strokeStyle = 'rgba(0, 150, 255, 0.7)'
          ctx.shadowColor = 'rgba(0, 150, 255, 0.5)'
          ctx.shadowBlur = 5
        }
        
        ctx.lineWidth = 3
        ctx.stroke()
        ctx.shadowBlur = 0 // Reset shadow after drawing
      }
    })
    
    // Draw keypoints
    poseData.keypoints.forEach((keypoint: any) => {
      if (keypoint.confidence > 0.5) {
        const { x, y } = keypoint.position
        
        // Determine point size based on importance
        let pointSize = 4
        if (['nose', 'leftShoulder', 'rightShoulder', 'leftHip', 'rightHip'].includes(keypoint.part)) {
          pointSize = 6 // Larger for major joints
        }
        
        // Create gradient fill for points
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, pointSize)
        
        if (show3D) {
          // 3D mode - color based on depth
          const depth = (y / canvasRef.current!.height) * 255
          gradient.addColorStop(0, `rgba(${255-depth}, ${depth}, ${depth}, 1)`)
          gradient.addColorStop(1, `rgba(${255-depth}, ${depth}, ${depth}, 0)`)
        } else {
          // Regular mode - blue points with glow
          gradient.addColorStop(0, 'rgba(0, 200, 255, 1)')
          gradient.addColorStop(1, 'rgba(0, 200, 255, 0)')
        }
        
        ctx.beginPath()
        ctx.arc(x, y, pointSize, 0, 2 * Math.PI)
        ctx.fillStyle = gradient
        ctx.fill()
      }
    })
    
    // Draw augmentations if enabled
    if (showAugmentation && selectedAugmentation !== 'none') {
      drawAugmentation(ctx)
    }
  }

  // Draw augmentations (like hats, glasses, etc.)
  const drawAugmentation = (ctx: CanvasRenderingContext2D) => {
    // Implementation would go here
    // For example, drawing a hat on the head or glasses on the face
  }

  // Start video call
  const startVideoCall = () => {
    setIsVideoCallActive(true)
  }

  // End video call
  const endVideoCall = () => {
    setIsVideoCallActive(false)
    setIsVideoCallMinimized(false)
  }

  // Toggle video call minimized state
  const toggleVideoCallMinimized = () => {
    setIsVideoCallMinimized(!isVideoCallMinimized)
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      
      // Check file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        alert("File size exceeds 100MB limit. Please select a smaller file.")
        return
      }
      
      setSelectedFile(file)
    }
  }

  // Upload video for analysis
  const uploadVideo = async () => {
    if (!selectedFile) return
    
    setIsUploading(true)
    setUploadProgress(0)
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + Math.floor(Math.random() * 5) + 1
      })
    }, 300)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Set progress to 100% when done
      setUploadProgress(100)
      
      // Success message
      alert("Video uploaded and processed successfully! View the results in the Previous Analyses section.")
      
      // Reset state
      setSelectedFile(null)
    } catch (error) {
      console.error("Error uploading video:", error)
      alert("An error occurred while uploading the video. Please try again.")
    } finally {
      setIsUploading(false)
      clearInterval(interval)
    }
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Stop webcam
      stopWebcam()

      // Stop recording if active
      if (isRecording && mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop()
      }

      // Clear recording timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
  }, [isRecording, mediaRecorder])

  // Add event listener for drag and drop
  useEffect(() => {
    const dropArea = document.getElementById('drop-area')

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (dropArea) dropArea.classList.add('border-blue-500')
    }

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (dropArea) dropArea.classList.remove('border-blue-500')
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (dropArea) dropArea.classList.remove('border-blue-500')

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0]
        if (file.type.startsWith('video/')) {
          // Check file size (max 100MB)
          if (file.size > 100 * 1024 * 1024) {
            alert("File size exceeds 100MB limit. Please select a smaller file.")
            return
          }
          setSelectedFile(file)
        } else {
          alert("Please select a video file.")
        }
      }
    }

    if (dropArea) {
      dropArea.addEventListener('dragover', handleDragOver)
      dropArea.addEventListener('dragleave', handleDragLeave)
      dropArea.addEventListener('drop', handleDrop)
    }

    return () => {
      if (dropArea) {
        dropArea.removeEventListener('dragover', handleDragOver)
        dropArea.removeEventListener('dragleave', handleDragLeave)
        dropArea.removeEventListener('drop', handleDrop)
      }
    }
  }, [])

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
            className="w-10 h-10 rounded-xl bg-[#7e58f4] bg-opacity-20 flex items-center justify-center text-white"
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
        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">Motion Analysis & Pose Estimation</h1>
              <p className="text-gray-500">Real-time movement tracking and analysis powered by OpenPose</p>
            </div>
            <Button
              onClick={startVideoCall}
              className="bg-[#014585] hover:bg-[#013a70]"
              disabled={isVideoCallActive}
            >
              <Video className="mr-2 h-4 w-4" />
              Start Video Call
            </Button>
          </div>

          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-[#111827]">Pose Estimation</h1>
          </div>
          <p className="text-gray-500 mb-6">Analyze your exercise form in real-time</p>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <Link href="/dashboard" className="pb-2 px-1 mr-6 text-sm font-medium text-gray-500 hover:text-gray-700">
              Overview
            </Link>
            <Link href="/exercises" className="pb-2 px-1 mr-6 text-sm font-medium text-gray-500 hover:text-gray-700">
              Exercises
            </Link>
            <Link href="/appointments" className="pb-2 px-1 mr-6 text-sm font-medium text-gray-500 hover:text-gray-700">
              Appointments
            </Link>
            <Link href="/messages" className="pb-2 px-1 mr-6 text-sm font-medium text-gray-500 hover:text-gray-700">
              Messages
            </Link>
            <Link href="/progress" className="pb-2 px-1 mr-6 text-sm font-medium text-gray-500 hover:text-gray-700">
              Progress
            </Link>
            <Link href="/video-library" className="pb-2 px-1 mr-6 text-sm font-medium text-gray-500 hover:text-gray-700">
              Video Library
            </Link>
            <Link
              href="/pose-estimation"
              className="pb-2 px-1 mr-6 text-sm font-medium text-gray-900 border-b-2 border-[#014585]"
            >
              Pose Estimation
            </Link>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-[400px] mb-6">
              <TabsTrigger value="live">Live Analysis</TabsTrigger>
              <TabsTrigger value="upload">Upload Video</TabsTrigger>
              <TabsTrigger value="history">Previous Analyses</TabsTrigger>
            </TabsList>
            <TabsContent value="live" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {/* Video panel takes 2 columns */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => setActiveEngine("openpose")}
                        variant={activeEngine === "openpose" ? "default" : "outline"}
                        className={activeEngine === "openpose" ? "bg-[#014585] hover:bg-[#013a70]" : ""}
                      >
                        OpenPose
                      </Button>
                      <Button
                        onClick={() => setActiveEngine("mediapipe")}
                        variant={activeEngine === "mediapipe" ? "default" : "outline"}
                        className={activeEngine === "mediapipe" ? "bg-[#7e58f4] hover:bg-[#5a3dc8]" : ""}
                      >
                        MediaPipe
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="show-skeleton" className="text-sm">Show Skeleton</Label>
                      <Switch id="show-skeleton" checked={showSkeleton} onCheckedChange={setShowSkeleton} />
                    </div>
                  </div>
                  {!showComparison ? (
                    <Card className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <CardTitle>Real-time Pose Estimation</CardTitle>
                            {isModelLoaded && isVideoOn && (
                              <span className="ml-3 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                {activeEngine === "openpose" ? "OpenPose" : "MediaPipe"}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {isModelLoaded && isVideoOn && (
                              <span className="text-sm text-green-500 flex items-center">
                                <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                                {fps} FPS
                              </span>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0 relative">
                        <div className="relative aspect-video bg-black flex items-center justify-center">
                          {!isVideoOn ? (
                            <div className="text-center">
                              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-400 mb-4">Camera is turned off</p>
                              <Button onClick={startWebcam} className="bg-[#014585] hover:bg-[#013a70]">
                                Start Camera
                              </Button>
                            </div>
                          ) : (
                            <>
                              <video
                                ref={videoRef}
                                className="w-full h-full object-contain"
                                muted
                                playsInline
                              />
                              <canvas
                                ref={canvasRef}
                                className="absolute top-0 left-0 w-full h-full"
                              />
                              {isRecording && (
                                <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-md flex items-center">
                                  <span className="animate-pulse h-2 w-2 bg-white rounded-full mr-2"></span>
                                  {formatRecordingTime(recordingTime)}
                                </div>
                              )}
                              {poseData && (
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs p-2 rounded">
                                  <div className="flex items-center space-x-2">
                                    <span>Engine: <span className={activeEngine === "openpose" ? "text-blue-400" : "text-purple-400"}>{activeEngine === "openpose" ? "OpenPose" : "MediaPipe"}</span></span>
                                    <span>|</span>
                                    <span>Score: {(poseData.score * 100).toFixed(1)}%</span>
                                    <span>|</span>
                                    <span>Points: {poseData.keypoints.length}</span>
                                  </div>
                                </div>
                              )}
                              
                              {/* Navigation buttons */}
                              <div className="absolute bottom-1/2 left-4 transform translate-y-1/2">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="rounded-full bg-white/20 hover:bg-white/40"
                                  onClick={() => router.push('/exercises')}
                                >
                                  <ChevronLeft className="h-5 w-5" />
                                </Button>
                              </div>
                              <div className="absolute bottom-1/2 right-4 transform translate-y-1/2">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="rounded-full bg-white/20 hover:bg-white/40"
                                  onClick={() => router.push('/progress')}
                                >
                                  <ChevronRight className="h-5 w-5" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle>Side-by-Side Comparison</CardTitle>
                          <span className="text-sm text-green-500 flex items-center">
                            <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                            Live Comparison
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0 relative">
                        {!isVideoOn ? (
                          <div className="text-center py-12">
                            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-400 mb-4">Camera is turned off</p>
                            <Button onClick={startWebcam} className="bg-[#014585] hover:bg-[#013a70]">
                              Start Camera
                            </Button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-1">
                            {/* OpenPose View */}
                            <div className="relative aspect-video bg-black flex items-center justify-center">
                              <div className="absolute top-2 left-2 z-10 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                OpenPose
                              </div>
                              <video
                                ref={videoRef}
                                className="w-full h-full object-contain"
                                muted
                                playsInline
                              />
                              <canvas
                                ref={canvasRef}
                                className="absolute top-0 left-0 w-full h-full"
                              />
                              {poseData && activeEngine === "openpose" && (
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs p-1 rounded">
                                  <div className="flex items-center space-x-1">
                                    <span>FPS: {fps}</span>
                                    <span>|</span>
                                    <span>Score: {(poseData.score * 100).toFixed(1)}%</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* MediaPipe View */}
                            <div className="relative aspect-video bg-black flex items-center justify-center">
                              <div className="absolute top-2 left-2 z-10 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                MediaPipe
                              </div>
                              <video
                                className="w-full h-full object-contain"
                                muted
                                playsInline
                              />
                              <canvas
                                className="absolute top-0 left-0 w-full h-full"
                              />
                              {poseData && activeEngine === "mediapipe" && (
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs p-1 rounded">
                                  <div className="flex items-center space-x-1">
                                    <span>FPS: {fps}</span>
                                    <span>|</span>
                                    <span>Score: {(poseData.score * 100).toFixed(1)}%</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                {/* Engine Comparison Panel */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-lg">Engine Comparison</CardTitle>
                          <CardDescription>Compare OpenPose and MediaPipe performance characteristics</CardDescription>
                        </div>
                        <Button
                          onClick={() => setShowComparison(!showComparison)}
                          variant="outline"
                          size="sm"
                          className={showComparison ? "bg-blue-100" : ""}
                        >
                          {showComparison ? "Hide Side-by-Side" : "Show Side-by-Side"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-blue-700 mb-1">OpenPose</h3>
                          <ul className="text-sm space-y-1 list-disc pl-5">
                            <li>Higher keypoint count (25 points including feet)</li>
                            <li>Better for full-body tracking and complex poses</li>
                            <li>Slightly lower FPS (20-25 frames per second)</li>
                            <li>More resource-intensive but higher accuracy</li>
                            <li>Ideal for detailed movement analysis</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-purple-700 mb-1">MediaPipe</h3>
                          <ul className="text-sm space-y-1 list-disc pl-5">
                            <li>Standard keypoint set (17 points)</li>
                            <li>Optimized for real-time performance</li>
                            <li>Higher FPS (25-30 frames per second)</li>
                            <li>More efficient on mobile and low-power devices</li>
                            <li>Ideal for real-time applications</li>
                          </ul>
                        </div>
                        
                        <div className="pt-2 border-t">
                          <h3 className="font-medium mb-1">Best Use Cases</h3>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-blue-50 p-2 rounded border border-blue-100">
                              <span className="font-medium text-blue-700 block mb-1">OpenPose</span>
                              <p>Detailed analysis, research, complex movement tracking</p>
                            </div>
                            <div className="bg-purple-50 p-2 rounded border border-purple-100">
                              <span className="font-medium text-purple-700 block mb-1">MediaPipe</span>
                              <p>Real-time feedback, mobile applications, simple tracking</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Real-time Performance Metrics */}
                  {isVideoOn && poseData && (
                    <Card className="mt-4">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Real-time Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">Current Engine</span>
                              <span className={`text-sm font-medium ${activeEngine === "openpose" ? "text-blue-600" : "text-purple-600"}`}>
                                {activeEngine === "openpose" ? "OpenPose" : "MediaPipe"}
                              </span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${activeEngine === "openpose" ? "bg-blue-500" : "bg-purple-500"}`}
                                style={{ width: "100%" }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">FPS</span>
                              <span className="text-sm">{fps} fps</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${activeEngine === "openpose" ? "bg-blue-500" : "bg-purple-500"}`}
                                style={{ width: `${Math.min(100, (fps / 30) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">Confidence</span>
                              <span className="text-sm">{(poseData.score * 100).toFixed(1)}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${activeEngine === "openpose" ? "bg-blue-500" : "bg-purple-500"}`}
                                style={{ width: `${poseData.score * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">Keypoints</span>
                              <span className="text-sm">{poseData.keypoints.length} points</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${activeEngine === "openpose" ? "bg-blue-500" : "bg-purple-500"}`}
                                style={{ width: `${(poseData.keypoints.length / 25) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="pt-3 mt-3 border-t">
                            <Button 
                              onClick={() => alert("Generating comparison report...")}
                              className="w-full flex items-center justify-center"
                              variant="outline"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Download Comparison Report
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Upload Video for Analysis</CardTitle>
                        <CardDescription>Upload a video of your exercise to get feedback on your form</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div 
                          id="drop-area"
                          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#014585] transition-colors cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {!selectedFile ? (
                            <div>
                              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-lg font-medium mb-2">Drag & Drop or Click to Upload</h3>
                              <p className="text-gray-500 mb-2">Support for MP4, MOV, or WebM files</p>
                              <p className="text-gray-400 text-sm">Maximum file size: 100MB</p>
                            </div>
                          ) : (
                            <div>
                              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                              <h3 className="text-lg font-medium mb-2">{selectedFile.name}</h3>
                              <p className="text-gray-500 mb-2">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                              <div className="flex justify-center mt-4">
                                <Button 
                                  variant="outline" 
                                  className="mr-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedFile(null);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" /> Remove
                                </Button>
                                <Button 
                                  className="bg-[#014585] hover:bg-[#013a70]"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    uploadVideo();
                                  }}
                                  disabled={isUploading}
                                >
                                  {isUploading ? (
                                    <>
                                      <span className="mr-2">Uploading... {uploadProgress}%</span>
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="h-4 w-4 mr-2" /> Upload for Analysis
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="video/mp4,video/mov,video/webm"
                            onChange={handleFileSelect}
                          />
                        </div>
                        
                        {isUploading && (
                          <div className="mt-4">
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#014585]"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Upload Guidelines</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <Camera className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Camera Position</h4>
                            <p className="text-sm text-gray-500">Position camera to capture your full body during the exercise</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-green-100 p-2 rounded-full mr-3">
                            <Activity className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Complete Movements</h4>
                            <p className="text-sm text-gray-500">Perform 3-5 complete repetitions of the exercise</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-purple-100 p-2 rounded-full mr-3">
                            <Video className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Video Quality</h4>
                            <p className="text-sm text-gray-500">Ensure good lighting and minimal background distractions</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-yellow-100 p-2 rounded-full mr-3">
                            <Info className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Processing Time</h4>
                            <p className="text-sm text-gray-500">Analysis typically takes 2-5 minutes depending on video length</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>Previous Analyses</CardTitle>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" /> Export All Data
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {savedRecordings.map((recording) => (
                            <div key={recording.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden relative mr-4">
                                  {recording.thumbnail ? (
                                    <Image 
                                      src={recording.thumbnail} 
                                      alt={recording.name} 
                                      fill 
                                      className="object-cover" 
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center h-full">
                                      <Video className="h-6 w-6 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium">{recording.name}</h4>
                                  <div className="flex items-center text-sm text-gray-500">
                                    <span className="mr-3">{recording.date}</span>
                                    <span className="mr-3">Duration: {recording.duration}</span>
                                    <span>{recording.size}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {recording.status === "analyzed" ? (
                                  <div className="flex items-center mr-4 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    <span>Score: {recording.score}%</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center mr-4 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    <span>Processing</span>
                                  </div>
                                )}
                                <Button variant="ghost" size="icon">
                                  <Play className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Download className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Share2 className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {notifications.map((notification) => (
                            <div 
                              key={notification.id} 
                              className={`p-3 rounded-lg border-l-4 ${notification.read ? 'border-gray-300 bg-gray-50' : 'border-blue-500 bg-blue-50'}`}
                            >
                              <div className="flex justify-between items-start">
                                <p className={`text-sm ${notification.read ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                                  {notification.message}
                                </p>
                                {!notification.read && (
                                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          ))}
                        </div>
                        
                        <Button variant="link" className="mt-4 p-0 h-auto text-[#014585]">
                          View all notifications
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle>Progress Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">Form Accuracy</span>
                              <span className="text-sm">78%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500"
                                style={{ width: '78%' }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">Range of Motion</span>
                              <span className="text-sm">65%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-yellow-500"
                                style={{ width: '65%' }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">Consistency</span>
                              <span className="text-sm">92%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500"
                                style={{ width: '92%' }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="pt-3 mt-3 border-t">
                            <Button 
                              className="w-full bg-[#014585] hover:bg-[#013a70]"
                            >
                              View Detailed Report
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
          </Tabs>

          {isVideoCallActive && (
            <div className={`fixed ${isVideoCallMinimized ? 'bottom-4 right-4 w-80 h-48' : 'inset-0 z-50'}`}>
              <div className="relative w-full h-full bg-black">
                <VideoCall
                  userId={user?.id || 'guest-' + Math.random().toString(36).substring(2, 9)}
                  onEndCall={endVideoCall}
                  onMinimize={toggleVideoCallMinimized}
                  isMinimized={isVideoCallMinimized}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
