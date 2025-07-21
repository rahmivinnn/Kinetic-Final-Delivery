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
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { VideoCall } from "@/components/video-call"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function PoseEstimationPage() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("live")
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [show3D, setShow3D] = useState(false)
  const [showAugmentation, setShowAugmentation] = useState(false)
  const [selectedAugmentation, setSelectedAugmentation] = useState("none")
  const [isVideoCallActive, setIsVideoCallActive] = useState(false)
  const [isVideoCallMinimized, setIsVideoCallMinimized] = useState(false)
  const [detectionQuality, setDetectionQuality] = useState(75)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [fps, setFps] = useState(0)
  const [poseData, setPoseData] = useState<any>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    }
  }

  // Format recording time
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Toggle recording
  const toggleRecording = () => {
    if (!isVideoOn || !videoRef.current?.srcObject) return;

    if (isRecording) {
      // Stop recording
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }

      // Clear timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }

      setIsRecording(false);
    } else {
      // Start recording
      try {
        const stream = videoRef.current.srcObject as MediaStream;
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        recorder.onstop = () => {
          // Create a single blob from all chunks
          const blob = new Blob(chunks, { type: 'video/webm' });
          setRecordedChunks([...chunks]);

          // Create download link
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `pose-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
          document.body.appendChild(a);
          a.click();

          // Clean up
          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 100);

          // Reset recording time
          setRecordingTime(0);
        };

        // Start recording
        recorder.start(1000); // Collect data every second
        setMediaRecorder(recorder);

        // Start timer
        setRecordingTime(0);
        recordingTimerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);

        setIsRecording(true);
      } catch (error) {
        console.error('Error starting recording:', error);
        alert('Failed to start recording. Please make sure your browser supports MediaRecorder API.');
      }
    }
  }

  // Start pose detection
  const startPoseDetection = () => {
    // In a real implementation, this would initialize OpenPose
    // For demo purposes, we'll simulate pose detection with random data
    const poseDetectionInterval = setInterval(() => {
      if (!isVideoOn) {
        clearInterval(poseDetectionInterval)
        return
      }

      // Simulate FPS
      setFps(Math.floor(Math.random() * 10) + 20)

      // Draw to canvas
      if (canvasRef.current && videoRef.current) {
        const ctx = canvasRef.current.getContext('2d')
        if (ctx) {
          // Match canvas size to video
          canvasRef.current.width = videoRef.current.videoWidth
          canvasRef.current.height = videoRef.current.videoHeight

          // Draw video frame
          ctx.drawImage(videoRef.current, 0, 0)

          if (showSkeleton) {
            // Draw skeleton (simplified for demo)
            drawSkeleton(ctx)
          }
        }
      }
    }, 1000 / 30) // Target 30 FPS

    return () => clearInterval(poseDetectionInterval)
  }

  // Previous keypoints for smooth animation
  const [prevKeypoints, setPrevKeypoints] = useState<any[]>([])

  // Draw skeleton on canvas
  const drawSkeleton = (ctx: CanvasRenderingContext2D) => {
    if (!canvasRef.current) return

    const width = canvasRef.current.width
    const height = canvasRef.current.height

    // Base keypoints positions
    const baseKeypoints = [
      { x: width * 0.5, y: height * 0.1 }, // head
      { x: width * 0.5, y: height * 0.3 }, // neck
      { x: width * 0.4, y: height * 0.4 }, // left shoulder
      { x: width * 0.6, y: height * 0.4 }, // right shoulder
      { x: width * 0.3, y: height * 0.6 }, // left elbow
      { x: width * 0.7, y: height * 0.6 }, // right elbow
      { x: width * 0.25, y: height * 0.75 }, // left wrist
      { x: width * 0.75, y: height * 0.75 }, // right wrist
      { x: width * 0.5, y: height * 0.5 }, // torso
      { x: width * 0.45, y: height * 0.7 }, // left hip
      { x: width * 0.55, y: height * 0.7 }, // right hip
      { x: width * 0.4, y: height * 0.85 }, // left knee
      { x: width * 0.6, y: height * 0.85 }, // right knee
      { x: width * 0.35, y: height * 0.95 }, // left ankle
      { x: width * 0.65, y: height * 0.95 }, // right ankle
    ]

    // Add realistic movement to keypoints
    const time = Date.now() / 1000
    const keypoints = baseKeypoints.map((point, index) => {
      // Different oscillation for different body parts
      let xOffset = 0
      let yOffset = 0

      // Breathing movement for torso
      if (index === 8) { // torso
        yOffset = Math.sin(time * 1.5) * height * 0.005
      }

      // Slight movement for head
      if (index === 0) { // head
        xOffset = Math.sin(time * 0.8) * width * 0.005
        yOffset = Math.sin(time * 1.2) * height * 0.005
      }

      // Arm movement
      if ([4, 5, 6, 7].includes(index)) { // elbows and wrists
        xOffset = Math.sin(time * (index % 2 === 0 ? 1.2 : 1.5)) * width * 0.01
        yOffset = Math.cos(time * (index % 2 === 0 ? 1.0 : 0.8)) * height * 0.01
      }

      // Slight leg movement
      if ([11, 12, 13, 14].includes(index)) { // knees and ankles
        xOffset = Math.sin(time * (index % 2 === 0 ? 0.5 : 0.7)) * width * 0.005
        yOffset = Math.cos(time * (index % 2 === 0 ? 0.6 : 0.4)) * height * 0.005
      }

      return {
        x: point.x + xOffset,
        y: point.y + yOffset
      }
    })

    // Smooth transition between frames
    let smoothKeypoints = keypoints
    if (prevKeypoints.length > 0) {
      smoothKeypoints = keypoints.map((point, i) => {
        return {
          x: prevKeypoints[i].x + (point.x - prevKeypoints[i].x) * 0.3,
          y: prevKeypoints[i].y + (point.y - prevKeypoints[i].y) * 0.3
        }
      })
    }

    // Save current keypoints for next frame
    setPrevKeypoints(smoothKeypoints)

    // Draw keypoints with glow effect
    const drawPoint = (x: number, y: number, radius: number, color: string) => {
      // Outer glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');

      ctx.beginPath();
      ctx.arc(x, y, radius * 2, 0, 2 * Math.PI);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Inner point
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    };

    // Draw connections with gradient
    const drawConnection = (x1: number, y1: number, x2: number, y2: number, color: string) => {
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Add glow effect
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
      ctx.lineWidth = 6;
      ctx.stroke();
    };

    // Define connections for better readability
    const connections = [
      [0, 1], // Head to neck
      [1, 2], // Neck to left shoulder
      [1, 3], // Neck to right shoulder
      [2, 4], // Left shoulder to left elbow
      [3, 5], // Right shoulder to right elbow
      [4, 6], // Left elbow to left wrist
      [5, 7], // Right elbow to right wrist
      [1, 8], // Neck to torso
      [8, 9], // Torso to left hip
      [8, 10], // Torso to right hip
      [9, 11], // Left hip to left knee
      [10, 12], // Right hip to right knee
      [11, 13], // Left knee to left ankle
      [12, 14], // Right knee to right ankle
    ];

    // Draw connections first (so they appear behind points)
    connections.forEach(([i, j]) => {
      drawConnection(
        smoothKeypoints[i].x,
        smoothKeypoints[i].y,
        smoothKeypoints[j].x,
        smoothKeypoints[j].y,
        '#00ff00'
      );
    });

    // Draw keypoints
    smoothKeypoints.forEach((point, i) => {
      // Different sizes for different joints
      let radius = 4;
      if ([0].includes(i)) radius = 5; // Head
      if ([1, 8].includes(i)) radius = 4.5; // Neck, torso
      if ([2, 3, 9, 10].includes(i)) radius = 4; // Shoulders, hips

      // Different colors based on body part
      let color = '#00ff00';
      if (show3D) {
        // In 3D mode, use depth-based coloring
        const depthValue = Math.sin(Date.now() / 1000 + i) * 0.5 + 0.5; // 0-1 value
        const r = Math.round(depthValue * 255);
        const g = Math.round(255 - depthValue * 100);
        const b = Math.round(depthValue * 100);
        color = `rgb(${r}, ${g}, ${b})`;
      }

      drawPoint(point.x, point.y, radius, color);
    });

    // Add augmentation if enabled
    if (showAugmentation) {
      // Example: Add a hat on the head
      const headX = smoothKeypoints[0].x;
      const headY = smoothKeypoints[0].y;
      const hatWidth = width * 0.1;
      const hatHeight = height * 0.05;

      ctx.fillStyle = '#ff5500';
      ctx.beginPath();
      ctx.ellipse(headX, headY - hatHeight * 0.5, hatWidth * 0.5, hatHeight * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Add more augmentations based on selectedAugmentation
      if (selectedAugmentation === 'sword') {
        // Draw a sword in the right hand
        const handX = smoothKeypoints[7].x;
        const handY = smoothKeypoints[7].y;
        const swordLength = height * 0.2;

        ctx.strokeStyle = '#silver';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(handX, handY);
        ctx.lineTo(handX + swordLength * 0.7, handY - swordLength * 0.7);
        ctx.stroke();

        // Sword handle
        ctx.strokeStyle = '#brown';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(handX, handY);
        ctx.lineTo(handX - 10, handY + 10);
        ctx.stroke();
      }
    }

    // Store pose data for analysis with confidence scores
    const poseWithConfidence = smoothKeypoints.map((point, i) => ({
      ...point,
      confidence: 0.7 + Math.random() * 0.3, // Simulate confidence scores between 0.7-1.0
      part: ['head', 'neck', 'leftShoulder', 'rightShoulder', 'leftElbow', 'rightElbow',
             'leftWrist', 'rightWrist', 'torso', 'leftHip', 'rightHip', 'leftKnee',
             'rightKnee', 'leftAnkle', 'rightAnkle'][i]
    }));

    setPoseData(poseWithConfidence);
  }

  const drawKeypointsFromBackend = (keypoints: any) => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    // Asumsi format COCO: keypoints = [{x, y, confidence}, ...]
    if (keypoints.people && keypoints.people.length > 0) {
      const pts = keypoints.people[0].pose_keypoints_2d
      // COCO skeleton connections (index pairs)
      const skeleton = [
        [0, 1], [1, 2], [2, 3], [3, 4], // head to right arm
        [1, 5], [5, 6], [6, 7],         // head to left arm
        [1, 8], [8, 9], [9, 10],        // body to right leg
        [8, 12], [12, 13], [13, 14],    // body to left leg
        [1, 11], [11, 12],              // body to left hip
        [8, 11]                         // body to right hip
      ]
      // Gambar garis skeleton
      ctx.strokeStyle = 'lime'
      ctx.lineWidth = 3
      skeleton.forEach(([a, b]) => {
        const x1 = pts[a * 3], y1 = pts[a * 3 + 1], c1 = pts[a * 3 + 2]
        const x2 = pts[b * 3], y2 = pts[b * 3 + 1], c2 = pts[b * 3 + 2]
        if (c1 > 0.1 && c2 > 0.1) {
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
      })
      // Gambar titik keypoints
      for (let i = 0; i < pts.length; i += 3) {
        const x = pts[i]
        const y = pts[i+1]
        const conf = pts[i+2]
        if (conf > 0.1) {
          ctx.beginPath()
          ctx.arc(x, y, 5, 0, 2 * Math.PI)
          ctx.fillStyle = 'red'
          ctx.fill()
        }
      }
    }
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
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      // Check file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        alert("File size exceeds 100MB limit. Please select a smaller file.")
        return
      }

      setSelectedFile(file)
      // Reset the file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // Handle file upload and analysis
  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) {
      alert("Please select a video file first.")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Kirim file ke backend /api/pose-estimation
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const res = await fetch("/api/pose-estimation", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      setUploadProgress(100)
      setIsUploading(false)
      setSelectedFile(null)

      if (data.success) {
        alert("Keypoints received!\n" + JSON.stringify(data.result, null, 2))
        console.log("OpenPose result:", data.result)
        drawKeypointsFromBackend(data.result)
      } else {
        alert("OpenPose error: " + data.message)
      }
    } catch (error) {
      setIsUploading(false)
      alert("An error occurred while uploading the video. Please try again.")
      console.error(error)
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
    <DashboardLayout activeLink="pose-estimation">
      <main className="flex-1 p-8">
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

          <Tabs defaultValue="live" className="mb-6" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="live">Live Analysis</TabsTrigger>
              <TabsTrigger value="recorded">Recorded Sessions</TabsTrigger>
              <TabsTrigger value="exercises">Guided Exercises</TabsTrigger>
            </TabsList>
            <TabsContent value="live" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle>Real-time Pose Estimation</CardTitle>
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
                              className="absolute inset-0 w-full h-full"
                            />
                            {isModelLoading && (
                              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                                <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-white">Loading OpenPose model...</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="p-4 bg-gray-50 flex justify-between items-center">
                        <div className="flex space-x-2">
                          {isVideoOn ? (
                            <Button onClick={stopWebcam} variant="outline" size="sm" className="text-red-500">
                              <VideoOff className="h-4 w-4 mr-1" /> Stop Camera
                            </Button>
                          ) : (
                            <Button onClick={startWebcam} variant="outline" size="sm">
                              <Video className="h-4 w-4 mr-1" /> Start Camera
                            </Button>
                          )}
                          <Button
                            onClick={toggleRecording}
                            variant="outline"
                            size="sm"
                            disabled={!isVideoOn}
                            className={isRecording ? "text-red-500 border-red-200 bg-red-50" : ""}
                          >
                            {isRecording ? (
                              <>
                                <Pause className="h-4 w-4 mr-1" /> Stop Recording {formatRecordingTime(recordingTime)}
                                <span className="ml-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-1" /> Record
                              </>
                            )}
                          </Button>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!isVideoOn || !poseData}
                            onClick={() => {
                              if (poseData) {
                                // Create a blob with the pose data
                                const dataStr = JSON.stringify(poseData, null, 2);
                                const blob = new Blob([dataStr], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);

                                // Create a link and trigger download
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `pose-data-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
                                document.body.appendChild(a);
                                a.click();

                                // Clean up
                                setTimeout(() => {
                                  document.body.removeChild(a);
                                  URL.revokeObjectURL(url);
                                }, 100);

                                // Show success message
                                alert('Pose data saved successfully!');
                              }
                            }}
                          >
                            <Download className="h-4 w-4 mr-1" /> Save Data
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!isVideoOn || !poseData}
                            onClick={() => {
                              if (poseData) {
                                // In a real app, this would open a sharing dialog
                                // For demo, we'll simulate a share action

                                // Create a temporary input to copy a share URL
                                const input = document.createElement('input');
                                const shareUrl = `https://kinetic-ai.example.com/share/pose-${Date.now().toString(36)}`;
                                input.value = shareUrl;
                                document.body.appendChild(input);
                                input.select();
                                document.execCommand('copy');
                                document.body.removeChild(input);

                                // Show success message
                                alert(`Share link copied to clipboard: ${shareUrl}`);
                              }
                            }}
                          >
                            <Share2 className="h-4 w-4 mr-1" /> Share
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Detection Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="quality">Detection Quality</Label>
                            <span className="text-sm text-gray-500">{detectionQuality}%</span>
                          </div>
                          <Slider
                            id="quality"
                            defaultValue={[75]}
                            max={100}
                            step={5}
                            onValueChange={(value) => setDetectionQuality(value[0])}
                            disabled={!isVideoOn}
                          />
                        </div>

                        <div className="space-y-4 pt-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="skeleton">Show Skeleton</Label>
                            <Switch
                              id="skeleton"
                              checked={showSkeleton}
                              onCheckedChange={setShowSkeleton}
                              disabled={!isVideoOn}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="3d">3D Visualization</Label>
                            <Switch
                              id="3d"
                              checked={show3D}
                              onCheckedChange={setShow3D}
                              disabled={!isVideoOn}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="augmentation">Augmentation</Label>
                            <Switch
                              id="augmentation"
                              checked={showAugmentation}
                              onCheckedChange={setShowAugmentation}
                              disabled={!isVideoOn}
                            />
                          </div>

                          {showAugmentation && (
                            <div className="mt-2 pl-4 space-y-2">
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id="aug-none"
                                  name="augmentation"
                                  value="none"
                                  checked={selectedAugmentation === 'none'}
                                  onChange={() => setSelectedAugmentation('none')}
                                  className="mr-2"
                                />
                                <Label htmlFor="aug-none" className="text-sm">None</Label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id="aug-hat"
                                  name="augmentation"
                                  value="hat"
                                  checked={selectedAugmentation === 'hat'}
                                  onChange={() => setSelectedAugmentation('hat')}
                                  className="mr-2"
                                />
                                <Label htmlFor="aug-hat" className="text-sm">Hat</Label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id="aug-sword"
                                  name="augmentation"
                                  value="sword"
                                  checked={selectedAugmentation === 'sword'}
                                  onChange={() => setSelectedAugmentation('sword')}
                                  className="mr-2"
                                />
                                <Label htmlFor="aug-sword" className="text-sm">Sword</Label>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isModelLoaded && isVideoOn ? (
                          <div className="space-y-3">
                            <div>
                              <h3 className="text-sm font-medium">Posture Score</h3>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-500">Score</span>
                                <span className="text-xs font-medium">85/100</span>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-sm font-medium">Movement Accuracy</h3>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-500">Accuracy</span>
                                <span className="text-xs font-medium">72%</span>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-sm font-medium">Range of Motion</h3>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-500">ROM</span>
                                <span className="text-xs font-medium">68%</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500">
                            <p>Start camera to view analysis</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="recorded">
              <Card>
                <CardHeader>
                  <CardTitle>Recorded Sessions</CardTitle>
                  <CardDescription>View and analyze your previous sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Upload Video for Analysis</CardTitle>
                        <CardDescription>Upload a video to analyze with OpenPose AI</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div
                          id="drop-area"
                          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4 transition-colors"
                        >
                          {selectedFile ? (
                            <div>
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Video className="h-6 w-6 text-green-600" />
                              </div>
                              <p className="text-sm font-medium mb-1">{selectedFile.name}</p>
                              <p className="text-xs text-gray-500 mb-2">
                                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 border-red-200 hover:bg-red-50"
                                onClick={() => setSelectedFile(null)}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500 mb-2">Drag and drop a video file here, or click to browse</p>
                              <p className="text-xs text-gray-400">Supports MP4, MOV, AVI (max 100MB)</p>
                              <Button
                                onClick={() => fileInputRef.current?.click()}
                                variant="outline"
                                className="mt-4"
                              >
                                Select Video
                              </Button>
                            </>
                          )}
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            id="video-upload"
                            accept="video/mp4,video/mov,video/avi"
                            onChange={handleFileSelect}
                          />
                        </div>

                        {isUploading ? (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Uploading...</span>
                              <span>{Math.round(uploadProgress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          <Button
                            className="w-full bg-[#014585] hover:bg-[#013a70]"
                            onClick={handleUploadAndAnalyze}
                            disabled={!selectedFile}
                          >
                            <Upload className="mr-2 h-4 w-4" /> Upload & Analyze
                          </Button>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Processing Status</CardTitle>
                        <CardDescription>Track the progress of your video analysis</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-sm font-medium">OpenPose Model</span>
                            </div>
                            <span className="text-sm text-green-500">Ready</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-sm font-medium">3D Projection</span>
                            </div>
                            <span className="text-sm text-green-500">Ready</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-sm font-medium">Augmentation Engine</span>
                            </div>
                            <span className="text-sm text-green-500">Ready</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                              <span className="text-sm font-medium">GPU Acceleration</span>
                            </div>
                            <span className="text-sm text-amber-500">Available</span>
                          </div>

                          <div className="pt-2">
                            <p className="text-sm text-gray-500 mb-2">System Status</p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-gray-500">Ready for processing</span>
                              <span className="text-xs font-medium">100%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <h3 className="text-lg font-semibold mb-4">Previous Analyses</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-200 rounded mr-3 flex items-center justify-center">
                            <Video className="h-6 w-6 text-gray-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Walking Gait Analysis</h4>
                            <p className="text-sm text-gray-500">Processed on May 15, 2024</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View Results</Button>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-2">
                        <span className="mr-4">Duration: 1:24</span>
                        <span className="mr-4">18 keypoints</span>
                        <span>3D model available</span>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-200 rounded mr-3 flex items-center justify-center">
                            <Video className="h-6 w-6 text-gray-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Shoulder Exercise Form</h4>
                            <p className="text-sm text-gray-500">Processed on May 10, 2024</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View Results</Button>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-2">
                        <span className="mr-4">Duration: 2:38</span>
                        <span className="mr-4">18 keypoints</span>
                        <span>3D model available</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="exercises">
              <Card>
                <CardHeader>
                  <CardTitle>Guided Exercise Programs</CardTitle>
                  <CardDescription>Follow along with guided exercise routines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Shoulder Mobility</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="aspect-video bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                          <Play className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Improve shoulder range of motion with guided exercises
                        </p>
                        <Button className="w-full bg-[#014585] hover:bg-[#013a70]">Start Program</Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Knee Stability</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="aspect-video bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                          <Play className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Strengthen knee stability with targeted exercises
                        </p>
                        <Button className="w-full bg-[#014585] hover:bg-[#013a70]">Start Program</Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Core Strength</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="aspect-video bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                          <Play className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Build core strength and stability with guided routines
                        </p>
                        <Button className="w-full bg-[#014585] hover:bg-[#013a70]">Start Program</Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Video Call Component */}
      {isVideoCallActive && (
        <VideoCall
          therapistName="Dr. Rebecca Chen"
          therapistImage="/caring-doctor.png"
          onEndCall={endVideoCall}
          isMinimized={isVideoCallMinimized}
          onToggleMinimize={toggleVideoCallMinimized}
        />
      )}
    </DashboardLayout>
  )
}
