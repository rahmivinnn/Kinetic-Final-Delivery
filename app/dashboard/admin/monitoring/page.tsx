"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
  AlertCircle,
  CheckCircle,
  Play,
  Pause,
  Eye,
  RefreshCw,
  Building2,
  UserCog,
  Shield,
  LineChart,
  Bell,
  HelpCircle
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface PoseSession {
  id: number
  patientId: string
  patientName: string
  providerId: string
  providerName: string
  sessionType: 'pose-estimation' | 'physiotherapy'
  startTime: Date
  endTime?: Date
  duration: number
  status: 'in-progress' | 'completed' | 'paused'
  analysis?: {
    posture_score?: number
    movement_quality?: string
    overall_performance?: number
    pain_level?: number
    range_of_motion?: number
    recommendations?: string[]
    notes?: string
  }
  createdAt: Date
}

export default function AdminMonitoringPage() {
  const { user, logout } = useAuth()
  const [sessions, setSessions] = useState<PoseSession[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [refreshing, setRefreshing] = useState(false)

  // Mock data untuk demonstrasi
  const mockSessions: PoseSession[] = [
    {
      id: 1,
      patientId: 'patient_001',
      patientName: 'Alex Johnson',
      providerId: 'provider_001',
      providerName: 'Dr. Sarah Wilson',
      sessionType: 'pose-estimation',
      startTime: new Date('2024-01-15T09:00:00Z'),
      endTime: new Date('2024-01-15T09:30:00Z'),
      duration: 30,
      status: 'completed',
      analysis: {
        posture_score: 85,
        movement_quality: 'good',
        recommendations: ['Maintain shoulder alignment', 'Focus on core stability']
      },
      createdAt: new Date('2024-01-15T09:00:00Z')
    },
    {
      id: 2,
      patientId: 'patient_002',
      patientName: 'Michael Smith',
      providerId: 'provider_002',
      providerName: 'Dr. Emily Davis',
      sessionType: 'physiotherapy',
      startTime: new Date('2024-01-15T10:30:00Z'),
      duration: 45,
      status: 'in-progress',
      analysis: {
        overall_performance: 82,
        pain_level: 3,
        range_of_motion: 75,
        notes: 'Patient showing improvement in shoulder mobility'
      },
      createdAt: new Date('2024-01-15T10:30:00Z')
    },
    {
      id: 3,
      patientId: 'patient_003',
      patientName: 'Emily Davis',
      providerId: 'provider_001',
      providerName: 'Dr. Sarah Wilson',
      sessionType: 'pose-estimation',
      startTime: new Date('2024-01-15T14:00:00Z'),
      duration: 25,
      status: 'paused',
      analysis: {
        posture_score: 72,
        movement_quality: 'needs improvement',
        recommendations: ['Improve spinal alignment', 'Strengthen core muscles']
      },
      createdAt: new Date('2024-01-15T14:00:00Z')
    }
  ]

  useEffect(() => {
    // Simulasi loading data
    const loadSessions = async () => {
      setLoading(true)
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSessions(mockSessions)
      setLoading(false)
    }

    loadSessions()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulasi refresh data
    await new Promise(resolve => setTimeout(resolve, 500))
    setSessions([...mockSessions])
    setRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSessionTypeColor = (type: string) => {
    return type === 'pose-estimation' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-green-100 text-green-800'
  }

  const filteredSessions = sessions.filter(session => {
    if (activeTab === 'all') return true
    if (activeTab === 'pose') return session.sessionType === 'pose-estimation'
    if (activeTab === 'physio') return session.sessionType === 'physiotherapy'
    if (activeTab === 'active') return session.status === 'in-progress'
    return true
  })

  const stats = {
    total: sessions.length,
    active: sessions.filter(s => s.status === 'in-progress').length,
    completed: sessions.filter(s => s.status === 'completed').length,
    pose: sessions.filter(s => s.sessionType === 'pose-estimation').length,
    physio: sessions.filter(s => s.sessionType === 'physiotherapy').length
  }

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
            href="/dashboard/admin/monitoring"
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white"
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
          <Link
            href="/dashboard/admin/reports"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <LineChart className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard/admin/alerts"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Bell className="w-5 h-5" />
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
              <h1 className="text-2xl font-bold text-[#111827]">Session Monitoring</h1>
              <p className="text-gray-500">Monitor real-time pose estimation and physiotherapy sessions</p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-[#014585] hover:bg-[#013a70]"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Sessions</p>
                    <p className="text-2xl font-bold text-[#014585]">{stats.total}</p>
                  </div>
                  <Activity className="h-8 w-8 text-[#014585]" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Now</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
                  </div>
                  <Play className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pose Detection</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.pose}</p>
                  </div>
                  <Camera className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Physiotherapy</p>
                    <p className="text-2xl font-bold text-green-600">{stats.physio}</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sessions List */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Live Sessions</CardTitle>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="pose">Pose Detection</TabsTrigger>
                    <TabsTrigger value="physio">Physiotherapy</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-[#014585]" />
                  <p className="text-gray-500">Loading sessions...</p>
                </div>
              ) : filteredSessions.length > 0 ? (
                <div className="space-y-4">
                  {filteredSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {session.sessionType === 'pose-estimation' ? (
                            <Camera className="h-8 w-8 text-purple-600" />
                          ) : (
                            <Activity className="h-8 w-8 text-green-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900">{session.patientName}</h3>
                            <Badge className={getSessionTypeColor(session.sessionType)}>
                              {session.sessionType === 'pose-estimation' ? 'Pose Detection' : 'Physiotherapy'}
                            </Badge>
                            <Badge className={getStatusColor(session.status)}>
                              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <span>Provider: {session.providerName}</span>
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {session.duration} min
                            </span>
                            <span>{new Date(session.startTime).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {session.analysis && (
                          <div className="text-right mr-4">
                            {session.analysis.posture_score && (
                              <div className="text-sm">
                                <span className="text-gray-500">Posture: </span>
                                <span className="font-medium">{session.analysis.posture_score}%</span>
                              </div>
                            )}
                            {session.analysis.overall_performance && (
                              <div className="text-sm">
                                <span className="text-gray-500">Performance: </span>
                                <span className="font-medium">{session.analysis.overall_performance}%</span>
                              </div>
                            )}
                          </div>
                        )}
                        <Button variant="ghost" size="sm" className="text-[#014585]">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No sessions found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}