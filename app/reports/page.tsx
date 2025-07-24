"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
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
  Download,
  Filter,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  CheckCircle,
  AlertCircle,
  Info,
  Search,
  RefreshCw,
  Share2,
  Printer,
  Mail,
  Eye,
  Edit,
  Trash2,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Camera,
  Video,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface ReportData {
  id: string
  title: string
  type: 'pose-analysis' | 'physiotherapy' | 'progress' | 'comparison'
  patientId: string
  patientName: string
  providerId: string
  providerName: string
  createdAt: Date
  updatedAt: Date
  status: 'draft' | 'completed' | 'shared' | 'archived'
  summary: string
  metrics: {
    accuracy: number
    improvement: number
    compliance: number
    duration: number
  }
  tags: string[]
  attachments: number
}

interface AnalyticsData {
  totalReports: number
  completedReports: number
  averageAccuracy: number
  averageImprovement: number
  reportsByType: {
    poseAnalysis: number
    physiotherapy: number
    progress: number
    comparison: number
  }
  monthlyTrends: {
    month: string
    reports: number
    accuracy: number
  }[]
}

export default function ReportsPage() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [dateRange, setDateRange] = useState('30d')
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Mock data
  const [reports, setReports] = useState<ReportData[]>([
    {
      id: '1',
      title: 'Shoulder Rehabilitation Progress Report',
      type: 'physiotherapy',
      patientId: 'p001',
      patientName: 'Sarah Johnson',
      providerId: 'pr001',
      providerName: 'Dr. Michael Chen',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      status: 'completed',
      summary: 'Significant improvement in shoulder flexion and extension range of motion over 4-week period.',
      metrics: {
        accuracy: 87,
        improvement: 23,
        compliance: 92,
        duration: 28
      },
      tags: ['shoulder', 'rehabilitation', 'range-of-motion'],
      attachments: 3
    },
    {
      id: '2',
      title: 'Knee Extension Pose Analysis',
      type: 'pose-analysis',
      patientId: 'p002',
      patientName: 'Robert Davis',
      providerId: 'pr002',
      providerName: 'Dr. Lisa Wang',
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-14'),
      status: 'completed',
      summary: 'Detailed biomechanical analysis of knee extension exercise with pose detection technology.',
      metrics: {
        accuracy: 94,
        improvement: 15,
        compliance: 88,
        duration: 45
      },
      tags: ['knee', 'pose-detection', 'biomechanics'],
      attachments: 5
    },
    {
      id: '3',
      title: 'Weekly Progress Comparison',
      type: 'comparison',
      patientId: 'p003',
      patientName: 'Emily Rodriguez',
      providerId: 'pr001',
      providerName: 'Dr. Michael Chen',
      createdAt: new Date('2024-01-13'),
      updatedAt: new Date('2024-01-13'),
      status: 'shared',
      summary: 'Comparative analysis of patient progress across multiple exercise sessions.',
      metrics: {
        accuracy: 76,
        improvement: 31,
        compliance: 95,
        duration: 21
      },
      tags: ['progress', 'comparison', 'weekly'],
      attachments: 2
    },
    {
      id: '4',
      title: 'Balance Training Assessment',
      type: 'physiotherapy',
      patientId: 'p004',
      patientName: 'James Wilson',
      providerId: 'pr003',
      providerName: 'Dr. Amanda Foster',
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-12'),
      status: 'draft',
      summary: 'Comprehensive assessment of balance training exercises using AI-powered pose detection.',
      metrics: {
        accuracy: 82,
        improvement: 18,
        compliance: 79,
        duration: 35
      },
      tags: ['balance', 'training', 'assessment'],
      attachments: 1
    },
    {
      id: '5',
      title: 'Hip Mobility Progress Report',
      type: 'progress',
      patientId: 'p005',
      patientName: 'Maria Garcia',
      providerId: 'pr002',
      providerName: 'Dr. Lisa Wang',
      createdAt: new Date('2024-01-11'),
      updatedAt: new Date('2024-01-11'),
      status: 'completed',
      summary: 'Monthly progress report showing improvement in hip mobility and flexibility.',
      metrics: {
        accuracy: 91,
        improvement: 27,
        compliance: 86,
        duration: 42
      },
      tags: ['hip', 'mobility', 'flexibility'],
      attachments: 4
    }
  ])

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalReports: 45,
    completedReports: 38,
    averageAccuracy: 86.2,
    averageImprovement: 22.4,
    reportsByType: {
      poseAnalysis: 15,
      physiotherapy: 18,
      progress: 8,
      comparison: 4
    },
    monthlyTrends: [
      { month: 'Sep', reports: 12, accuracy: 84.2 },
      { month: 'Oct', reports: 15, accuracy: 85.1 },
      { month: 'Nov', reports: 18, accuracy: 86.8 },
      { month: 'Dec', reports: 22, accuracy: 87.3 },
      { month: 'Jan', reports: 25, accuracy: 88.1 }
    ]
  })

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = selectedType === 'all' || report.type === selectedType
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const handleExportReport = (reportId: string) => {
    // Simulate export functionality
    console.log('Exporting report:', reportId)
    alert('Report exported successfully!')
  }

  const handleShareReport = (reportId: string) => {
    // Simulate share functionality
    console.log('Sharing report:', reportId)
    alert('Report shared successfully!')
  }

  const handleDeleteReport = (reportId: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      setReports(prev => prev.filter(r => r.id !== reportId))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'shared': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pose-analysis': return <Camera className="h-4 w-4" />
      case 'physiotherapy': return <Activity className="h-4 w-4" />
      case 'progress': return <TrendingUp className="h-4 w-4" />
      case 'comparison': return <BarChart3 className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pose-analysis': return 'text-purple-600'
      case 'physiotherapy': return 'text-green-600'
      case 'progress': return 'text-blue-600'
      case 'comparison': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="h-4 w-4 text-green-600" />
    if (value < 0) return <ArrowDownRight className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-600" />
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
            href="/analytics"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
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
            href="/reports"
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white"
          >
            <FileText className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard/admin/providers"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Users className="w-5 h-5" />
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
              <h1 className="text-2xl font-bold text-[#111827]">Reports & Analytics</h1>
              <p className="text-gray-500">Comprehensive reports untuk pose estimation dan physiotherapy sessions</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                className="text-[#014585] border-[#014585]"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button className="bg-[#014585] hover:bg-[#013a70]">
                <Plus className="mr-2 h-4 w-4" />
                New Report
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Reports</p>
                        <p className="text-2xl font-bold">{analyticsData.totalReports}</p>
                        <div className="flex items-center mt-1">
                          {getTrendIcon(8)}
                          <span className="text-xs text-green-600 ml-1">+8 this month</span>
                        </div>
                      </div>
                      <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Completed</p>
                        <p className="text-2xl font-bold">{analyticsData.completedReports}</p>
                        <div className="flex items-center mt-1">
                          {getTrendIcon(5)}
                          <span className="text-xs text-green-600 ml-1">+5 this week</span>
                        </div>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg Accuracy</p>
                        <p className="text-2xl font-bold">{analyticsData.averageAccuracy}%</p>
                        <div className="flex items-center mt-1">
                          {getTrendIcon(2.3)}
                          <span className="text-xs text-green-600 ml-1">+2.3% improvement</span>
                        </div>
                      </div>
                      <Target className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg Improvement</p>
                        <p className="text-2xl font-bold">{analyticsData.averageImprovement}%</p>
                        <div className="flex items-center mt-1">
                          {getTrendIcon(1.8)}
                          <span className="text-xs text-green-600 ml-1">+1.8% this month</span>
                        </div>
                      </div>
                      <TrendingUp className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Report Types Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Reports by Type</CardTitle>
                    <CardDescription>Distribution of report types in the last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Physiotherapy</span>
                        </div>
                        <span className="font-medium">{analyticsData.reportsByType.physiotherapy}</span>
                      </div>
                      <Progress value={(analyticsData.reportsByType.physiotherapy / analyticsData.totalReports) * 100} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm">Pose Analysis</span>
                        </div>
                        <span className="font-medium">{analyticsData.reportsByType.poseAnalysis}</span>
                      </div>
                      <Progress value={(analyticsData.reportsByType.poseAnalysis / analyticsData.totalReports) * 100} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">Progress</span>
                        </div>
                        <span className="font-medium">{analyticsData.reportsByType.progress}</span>
                      </div>
                      <Progress value={(analyticsData.reportsByType.progress / analyticsData.totalReports) * 100} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="text-sm">Comparison</span>
                        </div>
                        <span className="font-medium">{analyticsData.reportsByType.comparison}</span>
                      </div>
                      <Progress value={(analyticsData.reportsByType.comparison / analyticsData.totalReports) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Trends</CardTitle>
                    <CardDescription>Report generation and accuracy trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.monthlyTrends.map((trend, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="text-sm font-medium">{trend.month}</div>
                            <div className="text-xs text-gray-500">{trend.reports} reports</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-sm font-medium">{trend.accuracy}%</div>
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500"
                                style={{ width: `${trend.accuracy}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Reports */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Recent Reports</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('reports')}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reports.slice(0, 3).map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${getTypeColor(report.type)} bg-gray-100`}>
                            {getTypeIcon(report.type)}
                          </div>
                          <div>
                            <h4 className="font-medium">{report.title}</h4>
                            <p className="text-sm text-gray-600">{report.patientName} • {formatDate(report.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                          <div className="text-sm font-medium">{report.metrics.accuracy}%</div>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search reports, patients, or providers..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-3 py-2 border rounded-md text-sm"
                      >
                        <option value="all">All Types</option>
                        <option value="pose-analysis">Pose Analysis</option>
                        <option value="physiotherapy">Physiotherapy</option>
                        <option value="progress">Progress</option>
                        <option value="comparison">Comparison</option>
                      </select>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-3 py-2 border rounded-md text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="completed">Completed</option>
                        <option value="shared">Shared</option>
                        <option value="archived">Archived</option>
                      </select>
                      <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-3 py-2 border rounded-md text-sm"
                      >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="1y">Last year</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reports List */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>All Reports ({filteredReports.length})</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm">
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredReports.map((report) => (
                      <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className={`p-3 rounded-lg ${getTypeColor(report.type)} bg-gray-100`}>
                              {getTypeIcon(report.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-medium text-lg">{report.title}</h3>
                                <Badge className={getStatusColor(report.status)}>
                                  {report.status}
                                </Badge>
                              </div>
                              <p className="text-gray-600 mb-3">{report.summary}</p>
                              <div className="flex items-center space-x-6 text-sm text-gray-500">
                                <span>Patient: {report.patientName}</span>
                                <span>Provider: {report.providerName}</span>
                                <span>Created: {formatDate(report.createdAt)}</span>
                                <span>{report.attachments} attachments</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {report.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <div className="grid grid-cols-2 gap-4 text-center">
                              <div>
                                <div className="text-lg font-bold text-green-600">{report.metrics.accuracy}%</div>
                                <div className="text-xs text-gray-500">Accuracy</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-blue-600">+{report.metrics.improvement}%</div>
                                <div className="text-xs text-gray-500">Improvement</div>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleShareReport(report.id)}>
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleExportReport(report.id)}>
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteReport(report.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {filteredReports.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                      <p className="text-gray-600">Try adjusting your search or filters</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Average Accuracy</span>
                        <span className="text-lg font-bold">{analyticsData.averageAccuracy}%</span>
                      </div>
                      <Progress value={analyticsData.averageAccuracy} className="h-3" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Completion Rate</span>
                        <span className="text-lg font-bold">{Math.round((analyticsData.completedReports / analyticsData.totalReports) * 100)}%</span>
                      </div>
                      <Progress value={(analyticsData.completedReports / analyticsData.totalReports) * 100} className="h-3" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Average Improvement</span>
                        <span className="text-lg font-bold">{analyticsData.averageImprovement}%</span>
                      </div>
                      <Progress value={analyticsData.averageImprovement} className="h-3" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Report Generation Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analyticsData.monthlyTrends.map((trend, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <BarChart3 className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{trend.month}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">{trend.reports} reports</span>
                            <span className="text-sm font-medium">{trend.accuracy}% avg</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-green-900">Improvement Trend</h4>
                            <p className="text-sm text-green-700">Patient accuracy has improved by 12% over the last month</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900">Most Effective Exercise</h4>
                            <p className="text-sm text-blue-700">Shoulder flexion exercises show highest compliance rates</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-900">Attention Needed</h4>
                            <p className="text-sm text-yellow-700">3 patients require follow-up for incomplete sessions</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Optimize Session Duration</h4>
                        <p className="text-sm text-gray-600 mb-3">Consider reducing session length to 30 minutes for better compliance</p>
                        <Button size="sm" variant="outline">
                          Apply Recommendation
                        </Button>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Increase Pose Detection Frequency</h4>
                        <p className="text-sm text-gray-600 mb-3">More frequent pose analysis could improve accuracy by 8%</p>
                        <Button size="sm" variant="outline">
                          Apply Recommendation
                        </Button>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Focus on Balance Exercises</h4>
                        <p className="text-sm text-gray-600 mb-3">Patients show 23% better improvement with balance-focused routines</p>
                        <Button size="sm" variant="outline">
                          Apply Recommendation
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}