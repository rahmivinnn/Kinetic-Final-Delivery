"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Home,
  Activity,
  Users,
  MessageSquare,
  BarChart2,
  FileText,
  User,
  Settings,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Search,
  Plus,
  LogOut,
  Camera,
  Building2,
  Shield,
  UserCog,
  LineChart,
  Bell,
  HelpCircle,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { motion } from "framer-motion"

export default function AdminDashboardPage() {
  const { user, logout } = useAuth()
  const [clinicStats, setClinicStats] = useState([
    {
      id: 1,
      name: "Total Clinics",
      value: 24,
      change: "+3",
      trend: "up",
    },
    {
      id: 2,
      name: "Active Providers",
      value: 87,
      change: "+12",
      trend: "up",
    },
    {
      id: 3,
      name: "Total Patients",
      value: 1458,
      change: "+124",
      trend: "up",
    },
    {
      id: 4,
      name: "Avg. Patient Satisfaction",
      value: 4.7,
      total: 5,
      change: "+0.2",
      trend: "up",
    },
  ])

  const [recentClinics, setRecentClinics] = useState([
    {
      id: 1,
      name: "Kinetic Rehab Center - Downtown",
      location: "123 Main St, New York, NY",
      providers: 8,
      patients: 245,
      status: "active",
    },
    {
      id: 2,
      name: "Kinetic Physical Therapy - Westside",
      location: "456 Park Ave, Los Angeles, CA",
      providers: 5,
      patients: 178,
      status: "active",
    },
    {
      id: 3,
      name: "Kinetic Movement Clinic - North",
      location: "789 Oak St, Chicago, IL",
      providers: 6,
      patients: 203,
      status: "pending",
    },
  ])

  const [systemAlerts, setSystemAlerts] = useState([
    {
      id: 1,
      title: "System Maintenance",
      message: "Scheduled maintenance will occur on May 30th from 2-4 AM EST. The system will be unavailable during this time.",
      type: "info",
      time: "2 days ago",
    },
    {
      id: 2,
      title: "License Renewal",
      message: "Westside clinic license expires in 15 days. Please renew to avoid service interruption.",
      type: "warning",
      time: "Yesterday",
    },
    {
      id: 3,
      title: "New Provider Approvals",
      message: "12 new provider accounts are pending approval. Please review and verify credentials.",
      type: "action",
      time: "Just now",
    },
  ])

  // Handler untuk menambah klinik baru
  const handleAddNewClinic = () => {
    alert("Add new clinic feature coming soon!")
  }

  // Handler untuk melihat detail klinik
  const handleViewClinicDetails = (id: number) => {
    alert(`View details for clinic ${id} - Feature coming soon!`)
  }

  // Handler untuk mengelola penyedia layanan
  const handleManageProviders = () => {
    alert("Manage providers feature coming soon!")
  }

  // Handler untuk mengelola lisensi
  const handleManageLicenses = () => {
    alert("Manage licenses feature coming soon!")
  }

  // Handler untuk laporan sistem
  const handleSystemReports = () => {
    alert("System reports feature coming soon!")
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
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white"
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
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#111827]">Welcome back, {user?.name || "Admin"}</h1>
            <p className="text-gray-500">Here's an overview of your system and clinics</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {clinicStats.map((stat) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: stat.id * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">{stat.name}</p>
                        <div className="flex items-baseline">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {stat.value}
                            {stat.total && <span className="text-sm text-gray-500 ml-1">/ {stat.total}</span>}
                          </h3>
                        </div>
                      </div>
                      <div
                        className={`flex items-center ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}
                      >
                        <span className="text-sm font-medium">{stat.change}</span>
                        <ArrowRight
                          className={`h-4 w-4 ml-1 ${stat.trend === "up" ? "rotate-[-45deg]" : "rotate-45deg"}`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Clinic Management */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Clinic Management</CardTitle>
                    <Button className="bg-[#014585] hover:bg-[#013a70]" onClick={handleAddNewClinic}>
                      <Plus className="mr-2 h-4 w-4" /> Add New Clinic
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentClinics.length > 0 ? (
                    <div className="space-y-4">
                      {recentClinics.map((clinic) => (
                        <div
                          key={clinic.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <h3 className="font-medium text-gray-900">{clinic.name}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="mr-2">{clinic.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="mr-4 text-right">
                              <div className="flex items-center space-x-4">
                                <div>
                                  <span className="text-xs text-gray-500">Providers</span>
                                  <p className="font-medium">{clinic.providers}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">Patients</span>
                                  <p className="font-medium">{clinic.patients}</p>
                                </div>
                                <div>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${clinic.status === "active" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
                                  >
                                    {clinic.status.charAt(0).toUpperCase() + clinic.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#014585]"
                              onClick={() => handleViewClinicDetails(clinic.id)}
                            >
                              View Details
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No clinics found</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* System Management */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>System Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center space-y-2 border-dashed"
                      onClick={handleManageProviders}
                    >
                      <UserCog className="h-6 w-6 text-[#014585]" />
                      <span>Provider Management</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center space-y-2 border-dashed"
                      onClick={handleManageLicenses}
                    >
                      <Shield className="h-6 w-6 text-[#014585]" />
                      <span>License Management</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center space-y-2 border-dashed"
                      onClick={handleSystemReports}
                    >
                      <LineChart className="h-6 w-6 text-[#014585]" />
                      <span>System Reports</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center space-y-2 border-dashed bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200"
                      onClick={() => window.open('/pose-estimation', '_blank')}
                    >
                      <Camera className="h-6 w-6 text-[#7e58f4]" />
                      <span className="text-[#7e58f4]">Pose Monitoring</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center space-y-2 border-dashed bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200"
                      onClick={() => window.open('/physiotherapy', '_blank')}
                    >
                      <Activity className="h-6 w-6 text-[#10b981]" />
                      <span className="text-[#10b981]">Therapy Sessions</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* System Alerts */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>System Alerts</CardTitle>
                    <Link href="/dashboard/admin/alerts">
                      <Button variant="ghost" className="h-8 text-[#014585]">
                        View All
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {systemAlerts.length > 0 ? (
                    <div className="space-y-4">
                      {systemAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className={`p-3 rounded-lg ${alert.type === "warning" ? "bg-amber-50 border-l-2 border-amber-500" : alert.type === "action" ? "bg-blue-50 border-l-2 border-blue-500" : "bg-gray-50 border-l-2 border-gray-300"}`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium text-gray-900">{alert.title}</h3>
                            <span className="text-xs text-gray-500">{alert.time}</span>
                          </div>
                          <p className="text-sm text-gray-600">{alert.message}</p>
                          {alert.type === "action" && (
                            <div className="flex justify-end mt-2">
                              <Button size="sm" className="bg-[#014585] hover:bg-[#013a70]">
                                Take Action
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No system alerts</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link href="/dashboard/admin/clinics">
                      <Button
                        variant="outline"
                        className="w-full justify-between text-[#014585] hover:text-[#013a70]"
                      >
                        Manage Clinics
                        <Building2 className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/dashboard/admin/providers">
                      <Button
                        variant="outline"
                        className="w-full justify-between text-[#014585] hover:text-[#013a70]"
                      >
                        Provider Approvals
                        <UserCog className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/dashboard/admin/reports">
                      <Button
                        variant="outline"
                        className="w-full justify-between text-[#014585] hover:text-[#013a70]"
                      >
                        System Analytics
                        <LineChart className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/dashboard/admin/monitoring">
                      <Button
                        variant="outline"
                        className="w-full justify-between text-[#014585] hover:text-[#013a70]"
                      >
                        Session Monitoring
                        <Activity className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/help">
                      <Button
                        variant="outline"
                        className="w-full justify-between text-[#014585] hover:text-[#013a70]"
                      >
                        Help & Support
                        <HelpCircle className="ml-2 h-4 w-4" />
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