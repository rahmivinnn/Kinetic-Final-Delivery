"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  Camera,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Target,
  Zap
} from "lucide-react"

interface AnalyticsData {
  totalSessions: number
  activeSessions: number
  poseEstimationSessions: number
  physiotherapySessions: number
  averageSessionDuration: number
  successRate: number
  patientSatisfaction: number
  improvementRate: number
  dailyGrowth: number
  weeklyGrowth: number
}

interface RealTimeAnalyticsProps {
  className?: string
}

export function RealTimeAnalytics({ className }: RealTimeAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalSessions: 0,
    activeSessions: 0,
    poseEstimationSessions: 0,
    physiotherapySessions: 0,
    averageSessionDuration: 0,
    successRate: 0,
    patientSatisfaction: 0,
    improvementRate: 0,
    dailyGrowth: 0,
    weeklyGrowth: 0
  })
  const [loading, setLoading] = useState(true)

  // Simulasi data real-time
  useEffect(() => {
    const fetchAnalytics = () => {
      // Simulasi data yang berubah secara real-time
      const mockData: AnalyticsData = {
        totalSessions: Math.floor(Math.random() * 50) + 150,
        activeSessions: Math.floor(Math.random() * 10) + 5,
        poseEstimationSessions: Math.floor(Math.random() * 30) + 70,
        physiotherapySessions: Math.floor(Math.random() * 25) + 80,
        averageSessionDuration: Math.floor(Math.random() * 15) + 35,
        successRate: Math.floor(Math.random() * 10) + 85,
        patientSatisfaction: Math.floor(Math.random() * 5) + 90,
        improvementRate: Math.floor(Math.random() * 8) + 78,
        dailyGrowth: Math.floor(Math.random() * 10) + 5,
        weeklyGrowth: Math.floor(Math.random() * 20) + 15
      }
      
      setAnalytics(mockData)
      setLoading(false)
    }

    // Initial load
    fetchAnalytics()

    // Update setiap 5 detik untuk simulasi real-time
    const interval = setInterval(fetchAnalytics, 5000)

    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num)
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {/* Total Sessions */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Total Sessions</span>
            </div>
            <Badge variant="secondary" className="bg-blue-200 text-blue-800">
              Live
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-blue-900">{formatNumber(analytics.totalSessions)}</p>
            <div className={`flex items-center space-x-1 text-sm ${getGrowthColor(analytics.dailyGrowth)}`}>
              {getGrowthIcon(analytics.dailyGrowth)}
              <span>+{analytics.dailyGrowth}% hari ini</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Active Now</span>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-green-900">{analytics.activeSessions}</p>
            <p className="text-sm text-green-700">Sesi sedang berlangsung</p>
          </div>
        </CardContent>
      </Card>

      {/* Pose Estimation */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Camera className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Pose Detection</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-purple-900">{analytics.poseEstimationSessions}</p>
            <Progress value={(analytics.poseEstimationSessions / analytics.totalSessions) * 100} className="h-2" />
            <p className="text-xs text-purple-700">
              {Math.round((analytics.poseEstimationSessions / analytics.totalSessions) * 100)}% dari total
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Physiotherapy */}
      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">Physiotherapy</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-emerald-900">{analytics.physiotherapySessions}</p>
            <Progress value={(analytics.physiotherapySessions / analytics.totalSessions) * 100} className="h-2" />
            <p className="text-xs text-emerald-700">
              {Math.round((analytics.physiotherapySessions / analytics.totalSessions) * 100)}% dari total
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Average Duration */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Avg Duration</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-orange-900">{analytics.averageSessionDuration}m</p>
            <p className="text-sm text-orange-700">Rata-rata per sesi</p>
          </div>
        </CardContent>
      </Card>

      {/* Success Rate */}
      <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-teal-600" />
              <span className="text-sm font-medium text-teal-800">Success Rate</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-teal-900">{analytics.successRate}%</p>
            <Progress value={analytics.successRate} className="h-2" />
            <p className="text-xs text-teal-700">Tingkat keberhasilan</p>
          </div>
        </CardContent>
      </Card>

      {/* Patient Satisfaction */}
      <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-pink-600" />
              <span className="text-sm font-medium text-pink-800">Satisfaction</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-pink-900">{analytics.patientSatisfaction}%</p>
            <Progress value={analytics.patientSatisfaction} className="h-2" />
            <p className="text-xs text-pink-700">Kepuasan pasien</p>
          </div>
        </CardContent>
      </Card>

      {/* Improvement Rate */}
      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-800">Improvement</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-indigo-900">{analytics.improvementRate}%</p>
            <div className={`flex items-center space-x-1 text-sm ${getGrowthColor(analytics.weeklyGrowth)}`}>
              {getGrowthIcon(analytics.weeklyGrowth)}
              <span>+{analytics.weeklyGrowth}% minggu ini</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}