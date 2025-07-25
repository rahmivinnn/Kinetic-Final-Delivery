"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { PoseVideoCall } from "@/components/pose-video-call"
import { Camera, Upload, Play, Pause, SkipBack, SkipForward, Download, Share2, Layers, Activity, Maximize2, Minimize2, ChevronRight, ChevronLeft, RotateCcw, Zap } from "lucide-react"

export default function MovementLabPage() {
  // State for real-time pose viewer
  const [activeTab, setActiveTab] = useState("realtime")
  const [videoActive, setVideoActive] = useState(false)
  const [recordingActive, setRecordingActive] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [show3D, setShow3D] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [showAugmentation, setShowAugmentation] = useState(false)
  const [videoCallActive, setVideoCallActive] = useState(false)
  const [videoCallMinimized, setVideoCallMinimized] = useState(false)
  const [detectionQuality, setDetectionQuality] = useState(75)
  const [poseData, setPoseData] = useState<any>(null)
  const [poseEngine, setPoseEngine] = useState<'openpose' | 'mediapipe'>('mediapipe')
  
  // State for video upload & analysis
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  
  // State for video playback controls
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  
  // State for comparison view
  const [comparisonSource, setComparisonSource] = useState("ideal")
  const [comparisonOpacity, setComparisonOpacity] = useState(50)
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const uploadedVideoRef = useRef<HTMLVideoElement>(null)
  const uploadedCanvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      const url = URL.createObjectURL(file)
      setUploadedVideoUrl(url)
      setAnalysisComplete(false)
      setAnalysisResults(null)
    }
  }
  
  // Start video analysis
  const startAnalysis = () => {
    if (!uploadedVideoUrl) return
    
    setIsAnalyzing(true)
    
    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisComplete(true)
      
      // Generate mock analysis results
      setAnalysisResults({
        jointAngles: {
          knee: { left: 85, right: 82, symmetry: 96 },
          hip: { left: 110, right: 105, symmetry: 95 },
          shoulder: { left: 78, right: 75, symmetry: 96 },
          elbow: { left: 95, right: 92, symmetry: 97 },
          ankle: { left: 88, right: 85, symmetry: 97 }
        },
        movementQuality: {
          stability: 82,
          range: 88,
          tempo: 90,
          smoothness: 85
        },
        riskFactors: [
          { name: "Knee valgus", severity: "moderate", timePoints: ["0:15", "0:42"] },
          { name: "Forward head posture", severity: "mild", timePoints: ["0:28", "1:05"] }
        ],
        recommendations: [
          "Focus on maintaining knee alignment during squats",
          "Add neck strengthening exercises to improve head posture",
          "Consider reducing weight/resistance until form improves"
        ]
      })
    }, 3000)
  }
  
  // Toggle video playback
  const togglePlayback = () => {
    if (!uploadedVideoRef.current) return
    
    if (isPlaying) {
      uploadedVideoRef.current.pause()
    } else {
      uploadedVideoRef.current.play()
    }
    
    setIsPlaying(!isPlaying)
  }
  
  // Update current time during playback
  useEffect(() => {
    if (!uploadedVideoRef.current) return
    
    const video = uploadedVideoRef.current
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }
    
    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }
    
    const handleEnded = () => {
      setIsPlaying(false)
    }
    
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleEnded)
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
    }
  }, [uploadedVideoRef])
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  // Seek to specific time
  const seekTo = (time: number) => {
    if (!uploadedVideoRef.current) return
    uploadedVideoRef.current.currentTime = time
    setCurrentTime(time)
  }
  
  // Change playback speed
  const changePlaybackSpeed = (speed: number) => {
    if (!uploadedVideoRef.current) return
    uploadedVideoRef.current.playbackRate = speed
    setPlaybackSpeed(speed)
  }
  
  // Skip forward/backward
  const skipForward = () => {
    if (!uploadedVideoRef.current) return
    const newTime = Math.min(uploadedVideoRef.current.currentTime + 5, duration)
    seekTo(newTime)
  }
  
  const skipBackward = () => {
    if (!uploadedVideoRef.current) return
    const newTime = Math.max(uploadedVideoRef.current.currentTime - 5, 0)
    seekTo(newTime)
  }
  
  // Start real-time video
  const startRealTimeVideo = async () => {
    try {
      if (!videoRef.current || !canvasRef.current) return
      
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoRef.current.srcObject = stream
      videoRef.current.play()
      
      setVideoActive(true)
      
      // In a real app, you would initialize pose detection here
      // For this example, we'll simulate pose detection
      simulatePoseDetection()
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }
  
  // Simulate pose detection
  const simulatePoseDetection = () => {
    // Generate simulated pose data
    const simulatedPoseData = {
      keypoints: [
        { part: 'nose', position: { x: 300, y: 100 }, confidence: 0.9 },
        { part: 'leftShoulder', position: { x: 340, y: 150 }, confidence: 0.85 },
        { part: 'rightShoulder', position: { x: 260, y: 150 }, confidence: 0.85 },
        { part: 'leftElbow', position: { x: 350, y: 200 }, confidence: 0.8 },
        { part: 'rightElbow', position: { x: 250, y: 200 }, confidence: 0.8 },
        { part: 'leftWrist', position: { x: 360, y: 250 }, confidence: 0.75 },
        { part: 'rightWrist', position: { x: 240, y: 250 }, confidence: 0.75 },
        { part: 'leftHip', position: { x: 330, y: 270 }, confidence: 0.7 },
        { part: 'rightHip', position: { x: 270, y: 270 }, confidence: 0.7 },
        { part: 'leftKnee', position: { x: 330, y: 350 }, confidence: 0.65 },
        { part: 'rightKnee', position: { x: 270, y: 350 }, confidence: 0.65 },
        { part: 'leftAnkle', position: { x: 330, y: 430 }, confidence: 0.6 },
        { part: 'rightAnkle', position: { x: 270, y: 430 }, confidence: 0.6 }
      ],
      engine: poseEngine,
      score: 0.85,
      timestamp: Date.now()
    }
    
    setPoseData(simulatedPoseData)
    
    // Draw pose on canvas
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        if (showSkeleton) {
          // Draw connections between keypoints
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
          
          // Create a map for quick lookup
          const keypointMap = new Map()
          simulatedPoseData.keypoints.forEach((kp: any) => {
            keypointMap.set(kp.part, kp)
          })
          
          // Draw connections
          ctx.strokeStyle = poseEngine === 'mediapipe' ? 'rgba(126, 88, 244, 0.7)' : 'rgba(0, 150, 255, 0.7)'
          ctx.lineWidth = 3
          
          connections.forEach(([start, end]) => {
            const startPoint = keypointMap.get(start)
            const endPoint = keypointMap.get(end)
            
            if (startPoint && endPoint && startPoint.confidence > 0.5 && endPoint.confidence > 0.5) {
              ctx.beginPath()
              ctx.moveTo(startPoint.position.x, startPoint.position.y)
              ctx.lineTo(endPoint.position.x, endPoint.position.y)
              ctx.stroke()
            }
          })
          
          // Draw keypoints
          ctx.fillStyle = poseEngine === 'mediapipe' ? 'rgba(126, 88, 244, 0.8)' : 'rgba(255, 0, 0, 0.8)'
          
          simulatedPoseData.keypoints.forEach((kp: any) => {
            if (kp.confidence > 0.5) {
              ctx.beginPath()
              ctx.arc(kp.position.x, kp.position.y, 4, 0, 2 * Math.PI)
              ctx.fill()
            }
          })
        }
        
        if (showAugmentation) {
          // Add augmented reality elements
          // For example, draw angle measurements
          ctx.font = '14px Arial'
          ctx.fillStyle = 'white'
          ctx.strokeStyle = 'black'
          ctx.lineWidth = 3
          
          // Draw knee angle
          const leftKnee = simulatedPoseData.keypoints.find((kp: any) => kp.part === 'leftKnee')
          if (leftKnee && leftKnee.confidence > 0.5) {
            ctx.strokeText('85°', leftKnee.position.x + 10, leftKnee.position.y)
            ctx.fillText('85°', leftKnee.position.x + 10, leftKnee.position.y)
          }
          
          // Draw hip angle
          const leftHip = simulatedPoseData.keypoints.find((kp: any) => kp.part === 'leftHip')
          if (leftHip && leftHip.confidence > 0.5) {
            ctx.strokeText('110°', leftHip.position.x + 10, leftHip.position.y)
            ctx.fillText('110°', leftHip.position.x + 10, leftHip.position.y)
          }
        }
      }
    }
  }
  
  // Stop real-time video
  const stopRealTimeVideo = () => {
    if (!videoRef.current) return
    
    const stream = videoRef.current.srcObject as MediaStream
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    
    videoRef.current.srcObject = null
    setVideoActive(false)
  }
  
  // Toggle recording
  const toggleRecording = () => {
    setRecordingActive(!recordingActive)
    // In a real app, you would start/stop recording here
  }
  
  // Start video call
  const startVideoCall = () => {
    setVideoCallActive(true)
  }
  
  // End video call
  const endVideoCall = () => {
    setVideoCallActive(false)
    setVideoCallMinimized(false)
  }
  
  // Toggle video call minimize
  const toggleVideoCallMinimize = () => {
    setVideoCallMinimized(!videoCallMinimized)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Movement Lab</h2>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="realtime">
            <Camera className="mr-2 h-4 w-4" />
            Real-Time Pose Viewer
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload & Analyze
          </TabsTrigger>
          <TabsTrigger value="annotation">
            <Layers className="mr-2 h-4 w-4" />
            Manual Annotation
          </TabsTrigger>
          <TabsTrigger value="comparison">
            <Activity className="mr-2 h-4 w-4" />
            Compare vs Baseline
          </TabsTrigger>
        </TabsList>
        
        {/* Real-Time Pose Viewer */}
        <TabsContent value="realtime" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle>Live Camera Feed</CardTitle>
                    <div className="flex space-x-2">
                      {!videoActive ? (
                        <Button onClick={startRealTimeVideo} className="bg-[#014585] hover:bg-[#013a70]">
                          <Play className="mr-2 h-4 w-4" /> Start Camera
                        </Button>
                      ) : (
                        <>
                          <Button 
                            onClick={toggleRecording} 
                            variant={recordingActive ? "destructive" : "outline"}
                            className={recordingActive ? "bg-red-600 hover:bg-red-700" : ""}
                          >
                            {recordingActive ? (
                              <>
                                <Pause className="mr-2 h-4 w-4" /> Stop Recording
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-4 w-4" /> Record
                              </>
                            )}
                          </Button>
                          <Button onClick={stopRealTimeVideo} variant="outline">
                            Stop Camera
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
                    {!videoActive ? (
                      <div className="text-gray-400 flex flex-col items-center">
                        <Camera className="h-12 w-12 mb-2" />
                        <p>Click "Start Camera" to begin</p>
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
                          width={640}
                          height={480}
                        />
                        {recordingActive && (
                          <div className="absolute top-4 left-4 flex items-center bg-black/50 text-white px-3 py-1 rounded-full">
                            <div className="h-3 w-3 rounded-full bg-red-600 mr-2 animate-pulse" />
                            Recording
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 flex justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="skeleton"
                        checked={showSkeleton}
                        onCheckedChange={setShowSkeleton}
                      />
                      <Label htmlFor="skeleton">Skeleton</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="3d"
                        checked={show3D}
                        onCheckedChange={setShow3D}
                      />
                      <Label htmlFor="3d">3D View</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="augmentation"
                        checked={showAugmentation}
                        onCheckedChange={setShowAugmentation}
                      />
                      <Label htmlFor="augmentation">Augmentation</Label>
                    </div>
                  </div>
                  <Button onClick={startVideoCall} className="bg-[#014585] hover:bg-[#013a70]">
                    <Zap className="mr-2 h-4 w-4" /> Start Video Call
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card className="h-full">
                <CardHeader className="p-4">
                  <CardTitle>Detection Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="engine">Pose Engine</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setPoseEngine('openpose')}
                        variant={poseEngine === "openpose" ? "default" : "outline"}
                        size="sm"
                        className={poseEngine === "openpose" ? "bg-[#014585] hover:bg-[#013a70]" : ""}
                      >
                        OpenPose
                      </Button>
                      <Button
                        onClick={() => setPoseEngine('mediapipe')}
                        variant={poseEngine === "mediapipe" ? "default" : "outline"}
                        size="sm"
                        className={poseEngine === "mediapipe" ? "bg-[#7e58f4] hover:bg-[#5a3dc8]" : ""}
                      >
                        MediaPipe
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="quality">Detection Quality</Label>
                      <span className="text-sm text-gray-500">{detectionQuality}%</span>
                    </div>
                    <Slider
                      id="quality"
                      min={25}
                      max={100}
                      step={5}
                      value={[detectionQuality]}
                      onValueChange={(value) => setDetectionQuality(value[0])}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Performance</span>
                      <span>Accuracy</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="protocol">Analysis Protocol</Label>
                    <Select defaultValue="custom">
                      <SelectTrigger id="protocol">
                        <SelectValue placeholder="Select protocol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom">Custom Analysis</SelectItem>
                        <SelectItem value="fms">FMS Screening</SelectItem>
                        <SelectItem value="mckenzie">McKenzie Protocol</SelectItem>
                        <SelectItem value="gait">Gait Analysis</SelectItem>
                        <SelectItem value="balance">Balance Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {videoActive && poseData && (
                    <div className="space-y-4 pt-4">
                      <h4 className="font-medium text-sm">Live Metrics</h4>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Knee Angle (L/R)</span>
                          <span className="text-green-600">85° / 82°</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Hip Angle (L/R)</span>
                          <span className="text-green-600">110° / 105°</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Symmetry Score</span>
                          <span className="text-green-600">96%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Stability Index</span>
                          <span className="text-amber-600">82%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Upload & Analyze */}
        <TabsContent value="upload" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle>Video Analysis</CardTitle>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => fileInputRef.current?.click()} 
                        variant="outline"
                      >
                        <Upload className="mr-2 h-4 w-4" /> Upload Video
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="video/*"
                        className="hidden"
                      />
                      {uploadedVideoUrl && !isAnalyzing && !analysisComplete && (
                        <Button 
                          onClick={startAnalysis}
                          className="bg-[#014585] hover:bg-[#013a70]"
                        >
                          <Play className="mr-2 h-4 w-4" /> Analyze
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
                    {!uploadedVideoUrl ? (
                      <div className="text-gray-400 flex flex-col items-center">
                        <Upload className="h-12 w-12 mb-2" />
                        <p>Upload a video to analyze</p>
                      </div>
                    ) : (
                      <>
                        <video
                          ref={uploadedVideoRef}
                          src={uploadedVideoUrl}
                          className="w-full h-full object-contain"
                          controls={false}
                          playsInline
                        />
                        <canvas
                          ref={uploadedCanvasRef}
                          className={`absolute inset-0 w-full h-full ${showSkeleton ? '' : 'hidden'}`}
                          width={640}
                          height={480}
                        />
                        {isAnalyzing && (
                          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                            <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-lg font-medium">Analyzing video...</p>
                            <p className="text-sm text-gray-300 mt-2">This may take a few moments</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
                {uploadedVideoUrl && (
                  <CardFooter className="p-4 flex flex-col space-y-4">
                    <div className="w-full flex items-center space-x-2">
                      <span className="text-sm text-gray-500 w-12">{formatTime(currentTime)}</span>
                      <div className="flex-1 relative">
                        <input
                          type="range"
                          min="0"
                          max={duration}
                          step="0.01"
                          value={currentTime}
                          onChange={(e) => seekTo(parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-12">{formatTime(duration)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Select 
                          value={playbackSpeed.toString()} 
                          onValueChange={(value) => changePlaybackSpeed(parseFloat(value))}
                        >
                          <SelectTrigger className="w-[110px] h-9">
                            <SelectValue placeholder="Speed" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0.25">0.25x</SelectItem>
                            <SelectItem value="0.5">0.5x</SelectItem>
                            <SelectItem value="1">1x</SelectItem>
                            <SelectItem value="1.5">1.5x</SelectItem>
                            <SelectItem value="2">2x</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="video-skeleton"
                            checked={showSkeleton}
                            onCheckedChange={setShowSkeleton}
                          />
                          <Label htmlFor="video-skeleton">Skeleton</Label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" onClick={skipBackward}>
                          <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-10 w-10 rounded-full" 
                          onClick={togglePlayback}
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="outline" size="icon" onClick={skipForward}>
                          <SkipForward className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        {analysisComplete && (
                          <>
                            <Button variant="outline">
                              <Download className="mr-2 h-4 w-4" /> Export
                            </Button>
                            <Button variant="outline">
                              <Share2 className="mr-2 h-4 w-4" /> Share
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardFooter>
                )}
              </Card>
            </div>
            
            <div>
              <Card className="h-full">
                <CardHeader className="p-4">
                  <CardTitle>Analysis Results</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {!uploadedVideoUrl ? (
                    <div className="h-64 flex items-center justify-center text-gray-400 text-center">
                      <div>
                        <Activity className="h-12 w-12 mx-auto mb-2" />
                        <p>Upload and analyze a video to see results</p>
                      </div>
                    </div>
                  ) : isAnalyzing ? (
                    <div className="h-64 flex items-center justify-center text-gray-400 text-center">
                      <div>
                        <p>Analysis in progress...</p>
                      </div>
                    </div>
                  ) : analysisComplete && analysisResults ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Joint Angles</h4>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Knee (L/R)</span>
                              <span className="text-green-600">
                                {analysisResults.jointAngles.knee.left}° / {analysisResults.jointAngles.knee.right}°
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 rounded-full" 
                                style={{ width: `${analysisResults.jointAngles.knee.symmetry}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-end text-xs mt-1">
                              <span className="text-gray-500">Symmetry: {analysisResults.jointAngles.knee.symmetry}%</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Hip (L/R)</span>
                              <span className="text-green-600">
                                {analysisResults.jointAngles.hip.left}° / {analysisResults.jointAngles.hip.right}°
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 rounded-full" 
                                style={{ width: `${analysisResults.jointAngles.hip.symmetry}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-end text-xs mt-1">
                              <span className="text-gray-500">Symmetry: {analysisResults.jointAngles.hip.symmetry}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-2">Movement Quality</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-lg font-semibold text-green-600">
                              {analysisResults.movementQuality.stability}%
                            </div>
                            <div className="text-xs text-gray-500">Stability</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-lg font-semibold text-green-600">
                              {analysisResults.movementQuality.range}%
                            </div>
                            <div className="text-xs text-gray-500">Range</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-lg font-semibold text-green-600">
                              {analysisResults.movementQuality.tempo}%
                            </div>
                            <div className="text-xs text-gray-500">Tempo</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-lg font-semibold text-green-600">
                              {analysisResults.movementQuality.smoothness}%
                            </div>
                            <div className="text-xs text-gray-500">Smoothness</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-2">Risk Factors</h4>
                        <ul className="space-y-2 text-xs">
                          {analysisResults.riskFactors.map((risk: any, index: number) => (
                            <li key={index} className="flex items-start">
                              <div className={`h-4 w-4 rounded-full mr-2 mt-0.5 flex-shrink-0 ${risk.severity === 'mild' ? 'bg-amber-500' : 'bg-red-500'}`} />
                              <div>
                                <span className="font-medium">{risk.name}</span>
                                <span className="text-gray-500 ml-1">({risk.severity})</span>
                                <div className="text-gray-500 mt-0.5">
                                  Detected at: {risk.timePoints.join(', ')}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-2">Recommendations</h4>
                        <ul className="space-y-1 text-xs">
                          {analysisResults.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <ChevronRight className="h-3 w-3 mr-1 mt-0.5 text-blue-500" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-400 text-center">
                      <div>
                        <RotateCcw className="h-12 w-12 mx-auto mb-2" />
                        <p>Click "Analyze" to process the video</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Manual Annotation */}
        <TabsContent value="annotation">
          <Card>
            <CardHeader>
              <CardTitle>Manual Annotation Tool</CardTitle>
              <CardDescription>
                Upload a video and manually annotate key points and angles for detailed analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-400 text-center">
                <div>
                  <Layers className="h-12 w-12 mx-auto mb-2" />
                  <p>Manual annotation tool coming soon</p>
                  <p className="text-sm mt-2">This feature is under development</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Compare vs Baseline */}
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Compare vs Baseline / Ideal</CardTitle>
              <CardDescription>
                Compare current movement patterns with baseline recordings or ideal form templates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-400 text-center">
                <div>
                  <Activity className="h-12 w-12 mx-auto mb-2" />
                  <p>Comparison tool coming soon</p>
                  <p className="text-sm mt-2">This feature is under development</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {videoCallActive && (
        <PoseVideoCall
          therapistName="Patient Name"
          therapistImage="/placeholder-avatar.png"
          onEndCall={endVideoCall}
          isMinimized={videoCallMinimized}
          onToggleMinimize={toggleVideoCallMinimize}
          sessionId={`session_${Date.now()}`}
          userRole="provider"
          showPoseOverlay={showSkeleton}
          onTogglePoseOverlay={() => setShowSkeleton(!showSkeleton)}
          poseEngine={poseEngine}
          onChangePoseEngine={setPoseEngine}
        />
      )}
    </div>
  )
}