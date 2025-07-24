"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, X, Maximize } from "lucide-react"

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  videoUrl?: string
  posterUrl?: string
  feedbackText?: string
}

export function VideoModal({ isOpen, onClose, title, videoUrl, posterUrl, feedbackText }: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }, [isOpen])
  
  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
      
      // If unmuting, restore previous volume
      if (isMuted && videoRef.current.volume === 0) {
        videoRef.current.volume = volume || 0.5
      }
    }
  }
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      
      // Periksa apakah video telah selesai diputar
      if (videoRef.current.currentTime >= videoRef.current.duration) {
        setIsPlaying(false)
      }
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (value: number[]) => {
    const time = value[0]
    setCurrentTime(time)
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl h-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#111827] mb-2">{title}</DialogTitle>
        </DialogHeader>
        
        {videoUrl ? (
          <div className="relative aspect-video bg-black rounded-lg mb-4">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              poster={posterUrl || "/placeholder.svg"}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              controls={false}
              preload="auto"
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 rounded-full p-4 text-white hover:bg-black/70 transition-colors"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                <div className="flex items-center space-x-4">
                  <button onClick={toggleMute} className="text-white">
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                  
                  <div className="w-20 hidden sm:block">
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      min={0}
                      max={1}
                      step={0.1}
                      onValueChange={handleVolumeChange}
                      className="cursor-pointer"
                    />
                  </div>
                  
                  <button onClick={toggleFullscreen} className="text-white">
                    <Maximize className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <Slider
                value={[currentTime]}
                min={0}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="cursor-pointer"
              />
            </div>
          </div>
        ) : (
          // Tampilan untuk analisis tanpa video
          <div className="bg-gray-100 rounded-lg p-6 mb-4 text-center">
            <h3 className="text-lg font-medium mb-2">Analysis Report</h3>
            <p className="text-gray-600 mb-2">Detailed analysis of your exercise performance</p>
            <div className="flex justify-center space-x-4 mt-4">
              <div className="bg-blue-100 rounded-lg p-3 text-center w-24">
                <div className="text-xl font-bold text-blue-600">78%</div>
                <div className="text-xs text-gray-600">Overall Score</div>
              </div>
              <div className="bg-green-100 rounded-lg p-3 text-center w-24">
                <div className="text-xl font-bold text-green-600">85%</div>
                <div className="text-xs text-gray-600">Form</div>
              </div>
              <div className="bg-purple-100 rounded-lg p-3 text-center w-24">
                <div className="text-xl font-bold text-purple-600">75%</div>
                <div className="text-xs text-gray-600">Stability</div>
              </div>
            </div>
          </div>
        )}

        {feedbackText && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium mb-2">Feedback</h3>
            <p className="text-gray-700">{feedbackText}</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}