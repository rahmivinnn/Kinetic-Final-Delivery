"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RealTimeAnalytics } from "@/components/real-time-analytics"
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
  Clock,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  Target,
  Zap,
  Building2,
  LineChart,
  Bell
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface SessionData {
  date: string
  poseEstimation: number
  physiotherapy: number
  total: number
}

interface PerformanceMetric {
  name: string
  current: number
  previous: number
  change: number
  trend: 'up' | 'down' | 'stable'
  unit: string
}

export default function AnalyticsPage() {
  const { user, logout } = useAuth()
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Mock data untuk grafik
  const [sessionData, setSessionData] = useState<SessionData[]>([
    { date: '2024-01-09', poseEstimation: 12, physiotherapy: 18, total: 30 },
    { date: '2024-01-10', poseEstimation: 15, physiotherapy: 22, total: 37 },
    { date: '2024-01-11', poseEstimation: 18, physiotherapy: 25, total: 43 },
    { date: '2024-01-12', poseEstimation: 14, physiotherapy: 20, total: 34 },
    { date: '2024-01-13', poseEstimation: 20, physiotherapy: 28, total: 48 },
    { date: '2024-01-14', poseEstimation: 22, physiotherapy: 30, total: 52 },
    { date: '2024-01-15', poseEstimation: 25, physiotherapy: 32, total: 57 }
  ])

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([
    {
      name: 'Session Completion Rate',
      current: 94.5,
      previous: 91.2,
      change: 3.3,
      trend: 'up',
      unit: '%'
    },
    {
      name: 'Average Session Duration',
      current: 42.3,
      previous: 45.1,
      change: -2.8,
      trend: 'down',
      unit: ' min'
    },
    {
      name: 'Patient Engagement Score',
      current: 87.8,
      previous: 85.4,
      change: 2.4,
      trend: 'up',
      unit: '%'
    },
    {
      name: 'Technical Issues Rate',
      current: 2.1,
      previous: 3.7,
      change: -1.6,
      trend: 'down',
      unit: '%'
    }
  ])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      // Simulasi loading data
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLoading(false)
    }

    loadData()
  }, [timeRange])

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulasi refresh data
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Update data dengan nilai random untuk simulasi real-time
    const updatedData = sessionData.map(item => ({
      ...item,
      poseEstimation: Math.max(1, item.poseEstimation + Math.floor(Math.random() * 6) - 3),
      physiotherapy: Math.max(1, item.physiotherapy + Math.floor(Math.random() * 6) - 3)
    }))
    
    updatedData.forEach(item => {
      item.total = item.poseEstimation + item.physiotherapy
    })
    
    setSessionData(updatedData)
    setRefreshing(false)
  }

  const handleExportData = () => {
    // Simulasi export data
    const dataStr = JSON.stringify(sessionData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analytics-data-${timeRange}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  const getTrendColor = (trend: string, change: number) => {
    if (trend === 'up' && change > 0) return 'text-green-600'
    if (trend === 'down' && change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    })
  }

  const totalSessions = sessionData.reduce((sum, item) => sum + item.total, 0)
  const totalPoseEstimation = sessionData.reduce((sum, item) => sum + item.poseEstimation, 0)
  const totalPhysiotherapy = sessionData.reduce((sum, item) => sum + item.physiotherapy, 0)

  return (
    <div className="flex h-screen bg-[#f0f4f9]">
      {/* Sidebar */}
      <div className="w-[78px] bg-gradient-to-b from-[#001a41] to-[#003366] flex flex-col items-center py-6">
        <div className="mb-8">
          <Image src="/kinetic-logo.png" alt="Kinetic Logo" width={60} height={60} />
        </div>

        <nav className="flex flex-col items-center space-y-6 flex-1">
          <Link
            href="/dashboard/admin"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Home className="w-5 h-5" />
          </Link>
          <Link
            href="/analytics"
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white"
          >
            <BarChart2 className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard/admin/monitoring"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Activity className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard/admin/providers"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Users className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard/admin/clinics"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Building2 className="w-5 h-5" />
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
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">Analytics Dashboard</h1>
              <p className="text-gray-500">Real-time analytics untuk pose estimation dan physiotherapy sessions</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  <option value="24h">24 Jam</option>
                  <option value="7d">7 Hari</option>
                  <option value="30d">30 Hari</option>
                  <option value="90d">90 Hari</option>
                </select>
              </div>
              <Button
                onClick={handleExportData}
                variant="outline"
                className="text-[#014585] border-[#014585]"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-[#014585] hover:bg-[#013a70]"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Real-time Analytics Cards */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Real-time Metrics</h2>
            <RealTimeAnalytics />
          </div>

          {/* Main Analytics Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Session Trends */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Session Trends</CardTitle>
                      <CardDescription>Tren sesi dalam {timeRange === '7d' ? '7 hari' : timeRange === '30d' ? '30 hari' : timeRange === '90d' ? '90 hari' : '24 jam'} terakhir</CardDescription>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span>Pose Estimation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Physiotherapy</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-64 flex items-center justify-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-[#014585]" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Simple Bar Chart Representation */}
                      <div className="space-y-3">
                        {sessionData.map((item, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">{formatDate(item.date)}</span>
                              <span className="font-medium">{item.total} sesi</span>
                            </div>
                            <div className="flex space-x-1 h-6">
                              <div
                                className="bg-purple-500 rounded-l"
                                style={{ width: `${(item.poseEstimation / Math.max(...sessionData.map(d => d.total))) * 100}%` }}
                              ></div>
                              <div
                                className="bg-green-500 rounded-r"
                                style={{ width: `${(item.physiotherapy / Math.max(...sessionData.map(d => d.total))) * 100}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Pose: {item.poseEstimation}</span>
                              <span>Physio: {item.physiotherapy}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Metrik kinerja sistem dalam periode yang dipilih</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {performanceMetrics.map((metric, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">{metric.name}</h3>
                          {getTrendIcon(metric.trend)}
                        </div>
                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-gray-900">
                            {metric.current}{metric.unit}
                          </p>
                          <div className={`flex items-center space-x-1 text-sm ${getTrendColor(metric.trend, metric.change)}`}>
                            <span>
                              {metric.change > 0 ? '+' : ''}{metric.change}{metric.unit} dari periode sebelumnya
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-6">
              {/* Summary Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                  <CardDescription>Ringkasan periode {timeRange === '7d' ? '7 hari' : timeRange === '30d' ? '30 hari' : timeRange === '90d' ? '90 hari' : '24 jam'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Sessions</span>
                      <span className="font-bold text-lg">{totalSessions}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-600">Pose Estimation</span>
                        <span className="font-medium">{totalPoseEstimation}</span>
                      </div>
                      <Progress value={(totalPoseEstimation / totalSessions) * 100} className="h-2" />
                      <p className="text-xs text-gray-500">
                        {Math.round((totalPoseEstimation / totalSessions) * 100)}% dari total
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-green-600">Physiotherapy</span>
                        <span className="font-medium">{totalPhysiotherapy}</span>
                      </div>
                      <Progress value={(totalPhysiotherapy / totalSessions) * 100} className="h-2" />
                      <p className="text-xs text-gray-500">
                        {Math.round((totalPhysiotherapy / totalSessions) * 100)}% dari total
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link href="/dashboard/admin/monitoring">
                      <Button variant="outline" className="w-full justify-start text-[#014585]">
                        <Activity className="mr-2 h-4 w-4" />
                        Live Monitoring
                      </Button>
                    </Link>
                    <Link href="/pose-estimation">
                      <Button variant="outline" className="w-full justify-start text-purple-600">
                        <Camera className="mr-2 h-4 w-4" />
                        Pose Estimation
                      </Button>
                    </Link>
                    <Link href="/physiotherapy">
                      <Button variant="outline" className="w-full justify-start text-green-600">
                        <Activity className="mr-2 h-4 w-4" />
                        Physiotherapy
                      </Button>
                    </Link>
                    <Link href="/dashboard/admin/reports">
                      <Button variant="outline" className="w-full justify-start text-[#014585]">
                        <FileText className="mr-2 h-4 w-4" />
                        Detailed Reports
                      </Button>
                    </Link>
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