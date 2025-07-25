"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, ScreenShare, Maximize2, Minimize2, Camera, Activity, Download, Share2 } from "lucide-react"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface PoseVideoCallProps {
  therapistName: string
  therapistImage: string
  onEndCall: () => void
  isMinimized?: boolean
  onToggleMinimize?: () => void
  sessionId?: string
  userRole: 'provider' | 'client'
  showPoseOverlay?: boolean
  onTogglePoseOverlay?: () => void
  poseEngine?: 'openpose' | 'mediapipe'
  onChangePoseEngine?: (engine: 'openpose' | 'mediapipe') => void
}

export function PoseVideoCall({
  therapistName,
  therapistImage,
  onEndCall,
  isMinimized = false,
  onToggleMinimize,
  sessionId,
  userRole,
  showPoseOverlay = true,
  onTogglePoseOverlay,
  poseEngine = 'mediapipe',
  onChangePoseEngine
}: PoseVideoCallProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isConnecting, setIsConnecting] = useState(true)
  const [signalingStatus, setSignalingStatus] = useState<string>("")
  const [showAnalytics, setShowAnalytics] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [poseData, setPoseData] = useState<any>(null)
  const [detectionQuality, setDetectionQuality] = useState(75)
  const [fps, setFps] = useState(0)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const remoteCanvasRef = useRef<HTMLCanvasElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Generate a unique user ID for this session or use the provided sessionId
  const [userId] = useState(sessionId || `user_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`);
  const [targetId, setTargetId] = useState(userRole === 'provider' ? 'client_1' : 'therapist_1');
  
  // Simulate connecting and then showing the video
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnecting(false)
      startLocalVideo()
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Update call duration
  useEffect(() => {
    if (!isConnecting) {
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isConnecting])
  
  // Log session information
  useEffect(() => {
    console.log(`Video call initialized with session ID: ${userId}`);
    console.log(`User role: ${userRole}`);
    console.log(`Target ID: ${targetId}`);
  }, [userId, userRole, targetId]);

  // Connect to WebSocket server for signaling and pose data
  useEffect(() => {
    if (!isConnecting) {
      // Connect to WebSocket signaling server
      wsRef.current = new WebSocket("ws://localhost:3002")
      
      wsRef.current.onopen = () => {
        setSignalingStatus("WebSocket connected")
        
        // Register with the signaling server
        if (wsRef.current) {
          console.log(`Registering with signaling server using session ID: ${userId}`)
          wsRef.current.send(JSON.stringify({
            type: 'register',
            userId: userId,
            role: userRole,
            sessionId: sessionId || userId // Include session ID in registration
          }))
        }
      }
      
      wsRef.current.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data)
          console.log(`Received WebSocket message type: ${msg.type}`)
          
          // Verify session ID if present in message
          if (msg.sessionId && msg.sessionId !== sessionId && msg.target !== userId) {
            console.log(`Ignoring message for different session: ${msg.sessionId}`)
            return
          }
          
          if (msg.type === "registered") {
            setSignalingStatus("Registered with signaling server")
            console.log(`Successfully registered with signaling server as: ${userId}`)
            startSignaling()
          }
          else if (msg.type === "answer" && peerConnectionRef.current) {
            console.log(`Received answer from remote for session: ${sessionId || userId}`)
            await peerConnectionRef.current.setRemoteDescription({ type: "answer", sdp: msg.sdp })
            setSignalingStatus("Received answer from remote")
          }
          else if (msg.type === "ice-candidate" && peerConnectionRef.current) {
            console.log(`Received ICE candidate for session: ${sessionId || userId}`)
            await peerConnectionRef.current.addIceCandidate(msg.candidate)
            setSignalingStatus("Received ICE candidate")
          }
          else if (msg.type === "pose-data") {
            // Handle incoming pose data
            console.log(`Received pose data for session: ${msg.sessionId}`)
            setPoseData(msg.poseData)
            
            // Draw pose overlay on remote video if enabled
            if (showPoseOverlay && remoteCanvasRef.current && msg.poseData) {
              drawPoseOverlay(remoteCanvasRef.current, msg.poseData)
            }
          }
          else if (msg.type === "analytics") {
            // Handle incoming analytics data
            console.log(`Received analytics data for session: ${msg.sessionId}`)
            setAnalyticsData(msg.analyticsData)
          }
          else if (msg.type === "chat") {
            // Handle incoming chat message
            console.log(`Received chat message for session: ${msg.sessionId}`)
            setChatMessages(prev => [...prev, {
              sender: msg.sender,
              senderRole: msg.senderRole,
              message: msg.message,
              timestamp: new Date(msg.timestamp)
            }])
            
            // Auto-scroll chat to bottom
            if (chatContainerRef.current) {
              setTimeout(() => {
                if (chatContainerRef.current) {
                  chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
                }
              }, 100)
            }
          }
          else if (msg.type === "session-control") {
            // Handle session control messages
            console.log(`Received session control: ${msg.action} for session: ${msg.sessionId}`)
            
            if (msg.action === "end") {
              // End the call if the other party ended it
              onEndCall()
            }
          }
          else if (msg.type === "session-ended") {
            // Handle session ended notification
            console.log(`Session ended: ${msg.sessionId}`)
            // You might want to show a summary or redirect
          }
          else if (msg.type === "error") {
            console.error(`Signaling error: ${msg.message}`)
            setSignalingStatus(`Error: ${msg.message}`)
          }
          else if (msg.type === "user-disconnected") {
            console.log(`Remote user disconnected: ${msg.userId}`)
            setSignalingStatus(`Remote user disconnected: ${msg.userId}`)
            // In a real app, you might want to end the call here
          }
        } catch (error) {
          console.error("Error parsing message:", error)
        }
      }
      
      wsRef.current.onerror = () => setSignalingStatus("WebSocket error")
      wsRef.current.onclose = () => setSignalingStatus("WebSocket closed")
    }
    
    return () => {
      wsRef.current?.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnecting, userId, userRole, sessionId, showPoseOverlay])

  // Format duration as mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Start local video (user's camera)
  const startLocalVideo = async () => {
    try {
      if (localVideoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        localVideoRef.current.srcObject = stream

        // Initialize canvas for pose detection
        if (canvasRef.current) {
          const canvas = canvasRef.current
          canvas.width = localVideoRef.current.videoWidth || 640
          canvas.height = localVideoRef.current.videoHeight || 480
          
          // Start pose detection if overlay is enabled
          if (showPoseOverlay) {
            startPoseDetection()
          }
        }

        // Simulate remote video (therapist) with a delayed connection
        setTimeout(() => {
          if (remoteVideoRef.current) {
            // In a real app, this would be the remote peer's stream
            // For demo, we'll use a static image with a video overlay effect
            remoteVideoRef.current.poster = therapistImage
            remoteVideoRef.current.classList.add("remote-connected")
            
            // Initialize remote canvas
            if (remoteCanvasRef.current) {
              remoteCanvasRef.current.width = remoteVideoRef.current.videoWidth || 640
              remoteCanvasRef.current.height = remoteVideoRef.current.videoHeight || 480
            }
          }
        }, 3000)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setIsVideoOff(true)
    }
  }

  // Start pose detection on local video
  const startPoseDetection = async () => {
    if (!localVideoRef.current || !canvasRef.current) return
    
    // In a real implementation, you would initialize the pose detection model here
    // For this example, we'll simulate pose detection with random data
    
    // Simulate pose detection loop
    const detectionInterval = setInterval(() => {
      if (!showPoseOverlay) {
        clearInterval(detectionInterval)
        return
      }
      
      // Generate simulated pose data
      const simulatedPoseData = generateSimulatedPoseData()
      setPoseData(simulatedPoseData)
      
      // Draw pose overlay on local video
      if (canvasRef.current) {
        drawPoseOverlay(canvasRef.current, simulatedPoseData)
      }
      
      // Send pose data to server if connected
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'pose-data',
          sessionId: sessionId || userId,
          poseData: simulatedPoseData,
          sender: userId,
          timestamp: Date.now()
        }))
      }
      
      // Update FPS
      setFps(Math.floor(Math.random() * 10) + 20) // Simulate 20-30 FPS
      
    }, 100) // Run at approximately 10 FPS for simulation
    
    return () => clearInterval(detectionInterval)
  }

  // Generate simulated pose data for demonstration
  const generateSimulatedPoseData = () => {
    // This would be replaced with actual pose detection in production
    const baseKeypoints = [
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
    ]
    
    // Add small random movements to simulate motion
    const keypoints = baseKeypoints.map(kp => ({
      ...kp,
      position: {
        x: kp.position.x + (Math.random() * 10 - 5),
        y: kp.position.y + (Math.random() * 10 - 5)
      },
      confidence: Math.min(1, kp.confidence + (Math.random() * 0.1 - 0.05))
    }))
    
    return {
      keypoints,
      engine: poseEngine,
      score: 0.85 + Math.random() * 0.1,
      timestamp: Date.now()
    }
  }

  // Draw pose overlay on canvas
  const drawPoseOverlay = (canvas: HTMLCanvasElement, poseData: any) => {
    const ctx = canvas.getContext('2d')
    if (!ctx || !poseData || !poseData.keypoints) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
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
    poseData.keypoints.forEach((kp: any) => {
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
    
    poseData.keypoints.forEach((kp: any) => {
      if (kp.confidence > 0.5) {
        ctx.beginPath()
        ctx.arc(kp.position.x, kp.position.y, 4, 0, 2 * Math.PI)
        ctx.fill()
      }
    })
  }

  const startSignaling = async () => {
    setSignalingStatus("Starting signaling...")
    console.log(`Starting WebRTC signaling with session ID: ${sessionId || userId}`)
    
    const pc = new RTCPeerConnection()
    peerConnectionRef.current = pc
    
    // Add local stream if available
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      (localVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => {
        pc.addTrack(track)
        console.log(`Added track to peer connection: ${track.kind}`)
      })
    }
    
    // ICE candidate handler
    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current) {
        console.log(`Sending ICE candidate for session: ${sessionId || userId}`)
        wsRef.current.send(JSON.stringify({ 
          type: "ice-candidate", 
          sender: userId,
          target: targetId,
          candidate: event.candidate,
          sessionId: sessionId || userId // Include session ID in all signaling messages
        }))
      }
    }
    
    // Create offer
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    setSignalingStatus("Sending offer via WebSocket...")
    console.log(`Sending WebRTC offer for session: ${sessionId || userId}`)
    
    wsRef.current?.send(JSON.stringify({ 
      type: "offer", 
      sender: userId,
      target: targetId,
      sdp: offer.sdp,
      sessionId: sessionId || userId // Include session ID in all signaling messages
    }))
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      stream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted
      })
    }
  }

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff)
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      stream.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff
      })
    }
  }

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        // Return to camera
        startLocalVideo()
      } else {
        // Share screen
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
      }
      setIsScreenSharing(!isScreenSharing)
    } catch (err) {
      console.error("Error sharing screen:", err)
    }
  }

  const togglePoseOverlay = () => {
    if (onTogglePoseOverlay) {
      onTogglePoseOverlay()
    }
  }

  const changePoseEngine = () => {
    if (onChangePoseEngine) {
      onChangePoseEngine(poseEngine === 'openpose' ? 'mediapipe' : 'openpose')
    }
  }

  const sendChatMessage = () => {
    if (!newMessage.trim() || !wsRef.current) return
    
    // Send message via WebSocket
    wsRef.current.send(JSON.stringify({
      type: 'chat',
      sessionId: sessionId || userId,
      message: newMessage,
      sender: userId,
      senderRole: userRole,
      timestamp: Date.now()
    }))
    
    // Add message to local chat
    setChatMessages(prev => [...prev, {
      sender: userId,
      senderRole: userRole,
      message: newMessage,
      timestamp: new Date()
    }])
    
    // Clear input
    setNewMessage('')
    
    // Auto-scroll chat to bottom
    if (chatContainerRef.current) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
      }, 100)
    }
  }

  const endCall = async () => {
    // Stop all tracks on local stream
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }

    // Send end-call message to signaling server
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log(`Sending end-call message for session: ${sessionId || userId}`)
      wsRef.current.send(JSON.stringify({
        type: "session-control",
        action: "end",
        sender: userId,
        target: targetId,
        sessionId: sessionId || userId
      }))
    }

    // Reset state
    setIsConnecting(false)
    setIsMuted(false)
    setIsVideoOff(false)
    setIsScreenSharing(false)
    setCallDuration(0)

    // Call onEndCall from props
    onEndCall()
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg overflow-hidden z-50 w-72">
        <div className="p-2 bg-[#014585] text-white flex justify-between items-center">
          <div>
            <span className="text-sm font-medium">Call with {therapistName}</span>
            {userId && <span className="block text-xs text-blue-200">ID: {userId.substring(0, 8)}...</span>}
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-blue-700"
              onClick={onToggleMinimize}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-red-600" onClick={endCall}>
              <PhoneOff className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative h-40 bg-gray-900">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
            poster={therapistImage}
          />
          <canvas
            ref={remoteCanvasRef}
            className={`absolute inset-0 w-full h-full ${showPoseOverlay ? '' : 'hidden'}`}
          />
          <div className="absolute bottom-2 right-2 w-20 h-20 bg-gray-800 rounded overflow-hidden border border-gray-700">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${isVideoOff ? "hidden" : ""}`}
            />
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full ${showPoseOverlay ? '' : 'hidden'}`}
            />
            {isVideoOff && (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <Video className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
          <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {formatDuration(callDuration)}
          </div>
        </div>
        {signalingStatus && (
          <div className="text-xs text-blue-600 p-2">
            {signalingStatus}
            {userId && <span className="block text-gray-500 text-xs mt-1">Session ID: {userId.substring(0, 8)}...</span>}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden w-full max-w-6xl flex flex-col h-[90vh]">
        <div className="p-4 bg-[#014585] text-white flex justify-between items-center">
          <h3 className="font-semibold">Video Call with {therapistName}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm">{formatDuration(callDuration)}</span>
            {onToggleMinimize && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-blue-700"
                onClick={onToggleMinimize}
              >
                <Minimize2 className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Main video area */}
          <div className="flex-1 relative bg-gray-900">
            {isConnecting ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
                  <Image
                    src={therapistImage || "/placeholder.svg"}
                    alt={therapistName}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <p className="text-white text-lg mb-2">Connecting to {therapistName}...</p>
                <div className="flex space-x-2">
                  <div
                    className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "200ms" }}
                  ></div>
                  <div
                    className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "400ms" }}
                  ></div>
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  poster={therapistImage}
                />
                <canvas
                  ref={remoteCanvasRef}
                  className={`absolute inset-0 w-full h-full ${showPoseOverlay ? '' : 'hidden'}`}
                />
                <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded overflow-hidden border-2 border-white shadow-lg">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${isVideoOff ? "hidden" : ""}`}
                  />
                  <canvas
                    ref={canvasRef}
                    className={`absolute inset-0 w-full h-full ${showPoseOverlay ? '' : 'hidden'}`}
                  />
                  {isVideoOff && (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <Video className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Pose detection info overlay */}
                {showPoseOverlay && poseData && (
                  <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-3 py-2 rounded">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">Pose Engine:</span>
                      <span className={poseEngine === 'mediapipe' ? 'text-purple-300' : 'text-blue-300'}>
                        {poseEngine === 'mediapipe' ? 'MediaPipe' : 'OpenPose'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">FPS:</span>
                      <span>{fps}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Score:</span>
                      <span>{(poseData.score * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Analytics panel (conditionally shown) */}
          {showAnalytics && !isConnecting && (
            <div className="w-80 bg-gray-50 border-l border-gray-200 overflow-y-auto">
              <div className="p-4">
                <h4 className="font-medium text-gray-900 mb-4">Real-time Analytics</h4>
                
                {/* Engine selection */}
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Pose Engine</h5>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => onChangePoseEngine?.('openpose')}
                      variant={poseEngine === "openpose" ? "default" : "outline"}
                      size="sm"
                      className={poseEngine === "openpose" ? "bg-[#014585] hover:bg-[#013a70]" : ""}
                    >
                      OpenPose
                    </Button>
                    <Button
                      onClick={() => onChangePoseEngine?.('mediapipe')}
                      variant={poseEngine === "mediapipe" ? "default" : "outline"}
                      size="sm"
                      className={poseEngine === "mediapipe" ? "bg-[#7e58f4] hover:bg-[#5a3dc8]" : ""}
                    >
                      MediaPipe
                    </Button>
                  </div>
                </div>
                
                {/* Detection quality slider */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="detection-quality" className="text-sm font-medium text-gray-700">
                      Detection Quality
                    </Label>
                    <span className="text-xs text-gray-500">{detectionQuality}%</span>
                  </div>
                  <Slider
                    id="detection-quality"
                    min={25}
                    max={100}
                    step={5}
                    value={[detectionQuality]}
                    onValueChange={(value) => setDetectionQuality(value[0])}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Performance</span>
                    <span>Accuracy</span>
                  </div>
                </div>
                
                {/* Overlay toggle */}
                <div className="flex items-center justify-between mb-6">
                  <Label htmlFor="show-skeleton" className="text-sm font-medium text-gray-700">
                    Show Pose Overlay
                  </Label>
                  <Switch id="show-skeleton" checked={showPoseOverlay} onCheckedChange={togglePoseOverlay} />
                </div>
                
                {/* Simulated analytics data */}
                <div className="space-y-4">
                  <div className="p-3 bg-white rounded-lg border border-gray-200">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Joint Angles</h5>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Knee Flexion</span>
                          <span className="text-green-600">85° (Good)</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Hip Rotation</span>
                          <span className="text-amber-600">62° (Caution)</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: '62%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Shoulder Abduction</span>
                          <span className="text-green-600">78° (Good)</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg border border-gray-200">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Movement Quality</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="text-lg font-semibold text-green-600">92%</div>
                        <div className="text-xs text-gray-500">Symmetry</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="text-lg font-semibold text-amber-600">68%</div>
                        <div className="text-xs text-gray-500">Stability</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="text-lg font-semibold text-green-600">88%</div>
                        <div className="text-xs text-gray-500">Range</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="text-lg font-semibold text-green-600">85%</div>
                        <div className="text-xs text-gray-500">Tempo</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-sm font-medium text-gray-700">Risk Factors</h5>
                      <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">2 Detected</span>
                    </div>
                    <ul className="space-y-2 text-xs">
                      <li className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Slight knee valgus detected during squat phase</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Forward head posture during extension</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex space-x-2 mt-6">
                  <Button size="sm" className="flex-1 bg-[#014585] hover:bg-[#013a70]">
                    <Download className="h-4 w-4 mr-1" /> Save Report
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-1" /> Share
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Chat panel (conditionally shown) */}
          {showChat && !isConnecting && (
            <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
              <div className="p-3 bg-gray-100 border-b border-gray-200">
                <h4 className="font-medium text-gray-900">Session Chat</h4>
              </div>
              
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 space-y-3">
                {chatMessages.length > 0 ? (
                  chatMessages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex ${msg.senderRole === userRole ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg px-3 py-2 ${msg.senderRole === userRole 
                          ? 'bg-blue-100 text-blue-900' 
                          : 'bg-gray-200 text-gray-900'}`}
                      >
                        <div className="text-sm">{msg.message}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                    No messages yet
                  </div>
                )}
              </div>
              
              <div className="p-3 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button 
                    size="icon" 
                    onClick={sendChatMessage}
                    className="h-9 w-9 bg-[#014585] hover:bg-[#013a70]"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-100 flex items-center justify-between border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full h-10 w-10 ${isMuted ? "bg-red-100 text-red-600 border-red-300" : ""}`}
              onClick={toggleMute}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full h-10 w-10 ${isVideoOff ? "bg-red-100 text-red-600 border-red-300" : ""}`}
              onClick={toggleVideo}
            >
              {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full h-10 w-10 ${isScreenSharing ? "bg-blue-100 text-blue-600 border-blue-300" : ""}`}
              onClick={toggleScreenShare}
            >
              <ScreenShare className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full h-10 w-10 ${showPoseOverlay ? "bg-purple-100 text-purple-600 border-purple-300" : ""}`}
              onClick={togglePoseOverlay}
            >
              <Camera className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full h-10 w-10 ${showAnalytics ? "bg-green-100 text-green-600 border-green-300" : ""}`}
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              <Activity className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full h-10 w-10 ${showChat ? "bg-blue-100 text-blue-600 border-blue-300" : ""}`}
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
          <Button
            variant="destructive"
            className="rounded-full h-12 w-12 bg-red-600 hover:bg-red-700"
            onClick={endCall}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}