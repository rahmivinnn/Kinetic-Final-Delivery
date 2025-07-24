"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  Building2,
  UserCog,
  Shield,
  LineChart,
  Bell,
  User,
  Settings,
  LogOut,
  Search,
  Filter,
  Download,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  X,
  CheckSquare,
  MoreVertical,
  ChevronRight,
  Eye,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminAlertsPage() {
  const { user, logout } = useAuth()
  
  // State untuk pencarian dan filter
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  
  // Data untuk sistem peringatan
  const [systemAlerts, setSystemAlerts] = useState([
    {
      id: 1,
      title: "License Expiring Soon",
      message: "Coastal Rehabilitation Center's license will expire in 15 days. Renewal required.",
      type: "warning",
      priority: "high",
      status: "pending",
      entity: "Coastal Rehabilitation Center",
      entityType: "clinic",
      entityId: "clinic-12",
      createdAt: "2023-11-15T09:30:00",
      requiresAction: true,
    },
    {
      id: 2,
      title: "New Provider Registration",
      message: "Dr. Sarah Johnson has registered as a new provider. Verification required.",
      type: "info",
      priority: "medium",
      status: "pending",
      entity: "Dr. Sarah Johnson",
      entityType: "provider",
      entityId: "provider-45",
      createdAt: "2023-11-14T14:20:00",
      requiresAction: true,
    },
    {
      id: 3,
      title: "System Maintenance",
      message: "Scheduled system maintenance on November 20, 2023, from 2:00 AM to 4:00 AM EST.",
      type: "info",
      priority: "low",
      status: "active",
      entity: "System",
      entityType: "system",
      entityId: "system-1",
      createdAt: "2023-11-13T11:45:00",
      requiresAction: false,
    },
    {
      id: 4,
      title: "Critical Error in Billing Module",
      message: "The billing module is experiencing errors when processing insurance claims. Technical team has been notified.",
      type: "error",
      priority: "critical",
      status: "active",
      entity: "Billing System",
      entityType: "system",
      entityId: "system-2",
      createdAt: "2023-11-15T08:15:00",
      requiresAction: true,
    },
    {
      id: 5,
      title: "New Clinic Onboarding Complete",
      message: "Metro Physical Therapy has completed the onboarding process successfully.",
      type: "success",
      priority: "medium",
      status: "resolved",
      entity: "Metro Physical Therapy",
      entityType: "clinic",
      entityId: "clinic-18",
      createdAt: "2023-11-12T16:30:00",
      requiresAction: false,
      resolvedAt: "2023-11-13T10:15:00",
    },
    {
      id: 6,
      title: "Provider License Verification Failed",
      message: "License verification for Dr. Michael Chen failed. Additional documentation required.",
      type: "warning",
      priority: "high",
      status: "pending",
      entity: "Dr. Michael Chen",
      entityType: "provider",
      entityId: "provider-32",
      createdAt: "2023-11-14T09:45:00",
      requiresAction: true,
    },
    {
      id: 7,
      title: "Database Backup Completed",
      message: "Weekly database backup completed successfully. All systems operating normally.",
      type: "success",
      priority: "low",
      status: "resolved",
      entity: "Database System",
      entityType: "system",
      entityId: "system-3",
      createdAt: "2023-11-11T03:20:00",
      requiresAction: false,
      resolvedAt: "2023-11-11T03:25:00",
    },
    {
      id: 8,
      title: "Patient Data Migration Complete",
      message: "Patient data migration for Riverdale Therapy Center completed successfully.",
      type: "success",
      priority: "medium",
      status: "resolved",
      entity: "Riverdale Therapy Center",
      entityType: "clinic",
      entityId: "clinic-9",
      createdAt: "2023-11-10T14:30:00",
      requiresAction: false,
      resolvedAt: "2023-11-10T17:45:00",
    },
    {
      id: 9,
      title: "Security Alert: Multiple Failed Login Attempts",
      message: "Multiple failed login attempts detected for admin account. IP has been temporarily blocked.",
      type: "error",
      priority: "high",
      status: "active",
      entity: "Security System",
      entityType: "system",
      entityId: "system-4",
      createdAt: "2023-11-15T07:10:00",
      requiresAction: true,
    },
    {
      id: 10,
      title: "New Feature Deployment",
      message: "New telehealth integration features will be deployed on November 25, 2023.",
      type: "info",
      priority: "medium",
      status: "active",
      entity: "System",
      entityType: "system",
      entityId: "system-1",
      createdAt: "2023-11-13T15:20:00",
      requiresAction: false,
    },
  ])

  // Handler untuk pencarian
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Handler untuk filter status
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
  }

  // Handler untuk filter tipe
  const handleTypeFilter = (value: string) => {
    setTypeFilter(value)
  }

  // Handler untuk filter prioritas
  const handlePriorityFilter = (value: string) => {
    setPriorityFilter(value)
  }

  // Handler untuk ekspor data
  const handleExport = () => {
    alert("Exporting alerts data - Feature coming soon!")
  }

  // Handler untuk menandai peringatan sebagai sudah dibaca
  const handleMarkAsRead = (id: number) => {
    setSystemAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === id
          ? { ...alert, status: "resolved", resolvedAt: new Date().toISOString() }
          : alert
      )
    )
  }

  // Handler untuk mengambil tindakan pada peringatan
  const handleTakeAction = (id: number) => {
    const alert = systemAlerts.find(a => a.id === id)
    if (alert) {
      if (alert.entityType === "clinic") {
        alert(`Redirecting to clinic management for ${alert.entity} - Feature coming soon!`)
      } else if (alert.entityType === "provider") {
        alert(`Redirecting to provider management for ${alert.entity} - Feature coming soon!`)
      } else {
        alert(`Taking action on system alert: ${alert.title} - Feature coming soon!`)
      }
    }
  }

  // Handler untuk melihat detail peringatan
  const handleViewDetails = (id: number) => {
    const alert = systemAlerts.find(a => a.id === id)
    if (alert) {
      alert(`Viewing details for alert: ${alert.title} - Feature coming soon!`)
    }
  }

  // Handler untuk menghapus peringatan
  const handleDismiss = (id: number) => {
    setSystemAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id))
  }

  // Filter peringatan berdasarkan pencarian dan filter
  const filteredAlerts = systemAlerts.filter(alert => {
    // Filter pencarian
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.entity.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Filter status
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter
    
    // Filter tipe
    const matchesType = typeFilter === "all" || alert.type === typeFilter
    
    // Filter prioritas
    const matchesPriority = priorityFilter === "all" || alert.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority
  })

  // Mengurutkan peringatan berdasarkan prioritas dan waktu pembuatan
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    // Prioritas: critical > high > medium > low
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
    
    if (priorityDiff !== 0) return priorityDiff
    
    // Jika prioritas sama, urutkan berdasarkan waktu (terbaru dulu)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  // Mendapatkan jumlah peringatan berdasarkan status
  const alertCounts = {
    all: systemAlerts.length,
    active: systemAlerts.filter(alert => alert.status === "active").length,
    pending: systemAlerts.filter(alert => alert.status === "pending").length,
    resolved: systemAlerts.filter(alert => alert.status === "resolved").length,
  }

  // Fungsi untuk mendapatkan ikon berdasarkan tipe peringatan
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  // Fungsi untuk mendapatkan warna latar belakang berdasarkan tipe peringatan
  const getAlertBgColor = (type: string) => {
    switch (type) {
      case "error":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-amber-50 border-amber-200"
      case "info":
        return "bg-blue-50 border-blue-200"
      case "success":
        return "bg-green-50 border-green-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  // Fungsi untuk mendapatkan warna latar belakang badge prioritas
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-amber-100 text-amber-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex h-screen bg-[#f0f4f9]">
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
                maxWidth: "100%",
                height: "auto"
              }}
            />
          </div>
          
        </div>

        <nav className="flex flex-col items-center space-y-6 flex-1">
          <Link
            href="/dashboard/admin"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Home className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard/admin/clinics"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Building2 className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard/admin/providers"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <UserCog className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard/admin/licenses"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Shield className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard/admin/reports"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <LineChart className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard/admin/alerts"
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white"
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
              <h1 className="text-2xl font-bold text-[#111827]">System Alerts</h1>
              <p className="text-gray-500">Manage and respond to system notifications and alerts</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-[#014585] hover:bg-[#013a70]" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" /> Export Alerts
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search alerts by title, message, or entity..."
                className="pl-10"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="flex gap-3">
              <Select value={typeFilter} onValueChange={handleTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Alert Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={handlePriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Status Tabs */}
          <Tabs defaultValue="all" className="w-full mb-6" onValueChange={handleStatusFilter}>
            <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
              <TabsTrigger value="all">
                All
                <span className="ml-2 bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                  {alertCounts.all}
                </span>
              </TabsTrigger>
              <TabsTrigger value="active">
                Active
                <span className="ml-2 bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs">
                  {alertCounts.active}
                </span>
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending
                <span className="ml-2 bg-amber-100 text-amber-700 rounded-full px-2 py-0.5 text-xs">
                  {alertCounts.pending}
                </span>
              </TabsTrigger>
              <TabsTrigger value="resolved">
                Resolved
                <span className="ml-2 bg-green-100 text-green-700 rounded-full px-2 py-0.5 text-xs">
                  {alertCounts.resolved}
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Alerts List */}
          <div className="space-y-4">
            {sortedAlerts.length > 0 ? (
              sortedAlerts.map((alert) => (
                <Card 
                  key={alert.id} 
                  className={`border ${getAlertBgColor(alert.type)} overflow-hidden transition-all hover:shadow-md`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBadgeColor(alert.priority)}`}>
                              {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)}
                            </span>
                            {alert.status === "resolved" && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                                Resolved
                              </span>
                            )}
                            {alert.status === "pending" && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                Pending
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mt-1">{alert.message}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {formatDate(alert.createdAt)}
                            </div>
                            {alert.resolvedAt && (
                              <div className="flex items-center gap-1">
                                <CheckSquare className="h-3.5 w-3.5 text-green-500" />
                                Resolved: {formatDate(alert.resolvedAt)}
                              </div>
                            )}
                            <div>
                              Entity: <span className="text-gray-700">{alert.entity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {alert.status !== "resolved" && alert.requiresAction && (
                          <Button 
                            size="sm" 
                            className="bg-[#014585] hover:bg-[#013a70]"
                            onClick={() => handleTakeAction(alert.id)}
                          >
                            Take Action
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(alert.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        
                        {alert.status !== "resolved" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMarkAsRead(alert.id)}
                          >
                            <CheckSquare className="h-4 w-4 mr-1" />
                            Mark as Read
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDismiss(alert.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Bell className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No alerts found</h3>
                  <p className="text-gray-500 max-w-md">
                    {searchQuery || statusFilter !== "all" || typeFilter !== "all" || priorityFilter !== "all"
                      ? "No alerts match your current filters. Try adjusting your search or filter criteria."
                      : "You don't have any system alerts at the moment. All systems are operating normally."}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}