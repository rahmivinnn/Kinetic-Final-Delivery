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
  Plus,
  Filter,
  Download,
  MoreVertical,
  Edit,
  Calendar,
  MessageSquare,
  Phone,
  Trash2,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Award,
  FileCheck,
  AlertCircle,
  RefreshCw,
  FileText,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function AdminLicensesPage() {
  const { user, logout } = useAuth()
  
  // State untuk data lisensi
  const [licenses, setLicenses] = useState([
    {
      id: 1,
      type: "Clinic License",
      number: "CL-12345-NY",
      entity: "Kinetic Rehab Center - Downtown",
      entityId: 1,
      entityType: "clinic",
      issueDate: "2023-01-15",
      expiryDate: "2025-01-15",
      status: "active",
      renewalStatus: null,
      verificationStatus: "verified",
      documents: [
        { id: 1, name: "License Certificate", type: "certificate", uploadDate: "2023-01-10" },
        { id: 2, name: "Business Registration", type: "registration", uploadDate: "2023-01-10" },
      ],
      notes: "Annual renewal required. Inspection scheduled for November 2024.",
    },
    {
      id: 2,
      type: "Provider License",
      number: "PT-23456-CA",
      entity: "Dr. Michael Chen",
      entityId: 2,
      entityType: "provider",
      issueDate: "2022-11-22",
      expiryDate: "2024-11-22",
      status: "active",
      renewalStatus: "pending",
      verificationStatus: "verified",
      documents: [
        { id: 3, name: "License Certificate", type: "certificate", uploadDate: "2022-11-15" },
        { id: 4, name: "Professional Credentials", type: "credentials", uploadDate: "2022-11-15" },
      ],
      notes: "Renewal application submitted on 2024-10-01. Pending review.",
    },
    {
      id: 3,
      type: "Clinic License",
      number: "CL-34567-IL",
      entity: "Kinetic Movement Clinic - North",
      entityId: 3,
      entityType: "clinic",
      issueDate: "2022-10-22",
      expiryDate: "2024-10-22",
      status: "active",
      renewalStatus: null,
      verificationStatus: "verified",
      documents: [
        { id: 5, name: "License Certificate", type: "certificate", uploadDate: "2022-10-15" },
        { id: 6, name: "Business Registration", type: "registration", uploadDate: "2022-10-15" },
        { id: 7, name: "Insurance Documentation", type: "insurance", uploadDate: "2022-10-15" },
      ],
      notes: "Renewal reminder sent on 2024-08-22.",
    },
    {
      id: 4,
      type: "Provider License",
      number: "PT-45678-MA",
      entity: "Dr. James Wilson",
      entityId: 4,
      entityType: "provider",
      issueDate: "2022-08-12",
      expiryDate: "2024-08-12",
      status: "expiring",
      renewalStatus: null,
      verificationStatus: "verified",
      documents: [
        { id: 8, name: "License Certificate", type: "certificate", uploadDate: "2022-08-05" },
        { id: 9, name: "Professional Credentials", type: "credentials", uploadDate: "2022-08-05" },
      ],
      notes: "Urgent renewal required. Expiring in less than 30 days.",
    },
    {
      id: 5,
      type: "Clinic License",
      number: "CL-56789-FL",
      entity: "Kinetic Recovery Center - South",
      entityId: 5,
      entityType: "clinic",
      issueDate: "2023-05-18",
      expiryDate: "2024-05-18",
      status: "expired",
      renewalStatus: "in_progress",
      verificationStatus: "verified",
      documents: [
        { id: 10, name: "License Certificate", type: "certificate", uploadDate: "2023-05-10" },
        { id: 11, name: "Business Registration", type: "registration", uploadDate: "2023-05-10" },
      ],
      notes: "License expired. Renewal application in progress. Temporary operation permit issued.",
    },
    {
      id: 6,
      type: "Provider License",
      number: "PT-67890-NY",
      entity: "Dr. Robert Taylor",
      entityId: 6,
      entityType: "provider",
      issueDate: "2023-02-18",
      expiryDate: "2025-02-18",
      status: "active",
      renewalStatus: null,
      verificationStatus: "pending",
      documents: [
        { id: 12, name: "License Certificate", type: "certificate", uploadDate: "2023-02-10" },
        { id: 13, name: "Professional Credentials", type: "credentials", uploadDate: "2023-02-10" },
      ],
      notes: "Verification in progress. Temporary practice approval granted.",
    },
  ])

  // State untuk pencarian
  const [searchQuery, setSearchQuery] = useState("")
  
  // State untuk filter status
  const [statusFilter, setStatusFilter] = useState("all")

  // Handler untuk pencarian
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Handler untuk filter
  const handleFilter = () => {
    alert("Filter feature coming soon!")
  }

  // Handler untuk export
  const handleExport = () => {
    alert("Export feature coming soon!")
  }

  // Handler untuk menambah lisensi baru
  const handleAddNewLicense = () => {
    alert("Add new license feature coming soon!")
  }

  // Handler untuk melihat detail lisensi
  const handleViewLicenseDetails = (id: number) => {
    alert(`View details for license ${id} - Feature coming soon!`)
  }

  // Handler untuk mengedit lisensi
  const handleEditLicense = (id: number) => {
    alert(`Edit license ${id} - Feature coming soon!`)
  }

  // Handler untuk memperbarui lisensi
  const handleRenewLicense = (id: number) => {
    alert(`Renew license ${id} - Feature coming soon!`)
  }

  // Handler untuk verifikasi lisensi
  const handleVerifyLicense = (id: number) => {
    const updatedLicenses = licenses.map(license => {
      if (license.id === id) {
        return {
          ...license,
          verificationStatus: "verified"
        }
      }
      return license
    })
    setLicenses(updatedLicenses)
    alert(`License ${id} has been verified successfully!`)
  }

  // Handler untuk menghapus lisensi
  const handleDeleteLicense = (id: number) => {
    if (confirm(`Are you sure you want to delete license ${id}?`)) {
      setLicenses(licenses.filter(license => license.id !== id))
    }
  }

  // Fungsi untuk menghitung hari tersisa sebelum kedaluwarsa
  const getDaysRemaining = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Fungsi untuk mendapatkan persentase waktu yang tersisa
  const getTimeRemainingPercentage = (issueDate: string, expiryDate: string) => {
    const today = new Date()
    const issue = new Date(issueDate)
    const expiry = new Date(expiryDate)
    
    const totalDuration = expiry.getTime() - issue.getTime()
    const elapsedDuration = today.getTime() - issue.getTime()
    
    const percentage = 100 - (elapsedDuration / totalDuration * 100)
    return Math.max(0, Math.min(100, percentage))
  }

  // Filter lisensi berdasarkan pencarian dan status
  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = license.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         license.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         license.type.toLowerCase().includes(searchQuery.toLowerCase())
    
    let matchesStatus = true
    if (statusFilter === "active") {
      matchesStatus = license.status === "active"
    } else if (statusFilter === "expiring") {
      matchesStatus = license.status === "expiring" || getDaysRemaining(license.expiryDate) <= 30
    } else if (statusFilter === "expired") {
      matchesStatus = license.status === "expired" || getDaysRemaining(license.expiryDate) < 0
    } else if (statusFilter === "pending") {
      matchesStatus = license.verificationStatus === "pending" || license.renewalStatus === "pending"
    }
    
    return matchesSearch && matchesStatus
  })

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
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white"
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
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">License Management</h1>
              <p className="text-gray-500">Manage all clinic and provider licenses in the Kinetic Rehab system</p>
            </div>
            <Button className="bg-[#014585] hover:bg-[#013a70]" onClick={handleAddNewLicense}>
              <Plus className="mr-2 h-4 w-4" /> Add New License
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by entity name, license number or type..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <Button variant="outline" onClick={handleFilter}>
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>

            <Tabs defaultValue="all" className="w-full" onValueChange={setStatusFilter}>
              <TabsList className="grid w-full grid-cols-5 lg:w-[500px]">
                <TabsTrigger value="all">All Licenses</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
                <TabsTrigger value="expired">Expired</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Licenses List */}
          <div className="space-y-4">
            {filteredLicenses.length > 0 ? (
              filteredLicenses.map((license) => {
                const daysRemaining = getDaysRemaining(license.expiryDate)
                const timeRemainingPercentage = getTimeRemainingPercentage(license.issueDate, license.expiryDate)
                
                let statusColor = "bg-green-100 text-green-800"
                let statusIcon = <CheckCircle className="h-3 w-3 mr-1" />
                
                if (license.status === "expired" || daysRemaining < 0) {
                  statusColor = "bg-red-100 text-red-800"
                  statusIcon = <XCircle className="h-3 w-3 mr-1" />
                } else if (license.status === "expiring" || daysRemaining <= 30) {
                  statusColor = "bg-amber-100 text-amber-800"
                  statusIcon = <AlertCircle className="h-3 w-3 mr-1" />
                } else if (license.verificationStatus === "pending") {
                  statusColor = "bg-blue-100 text-blue-800"
                  statusIcon = <Clock className="h-3 w-3 mr-1" />
                }
                
                let progressColor = "bg-green-500"
                if (timeRemainingPercentage <= 25) {
                  progressColor = "bg-red-500"
                } else if (timeRemainingPercentage <= 50) {
                  progressColor = "bg-amber-500"
                } else if (timeRemainingPercentage <= 75) {
                  progressColor = "bg-blue-500"
                }
                
                return (
                  <Card key={license.id} className="overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">{license.type}</Badge>
                            <h3 className="text-lg font-semibold text-gray-900">{license.number}</h3>
                            <span
                              className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
                            >
                              {statusIcon}
                              {daysRemaining < 0 
                                ? "Expired" 
                                : license.verificationStatus === "pending" 
                                  ? "Verification Pending" 
                                  : daysRemaining <= 30 
                                    ? "Expiring Soon" 
                                    : "Active"}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-500 mt-1">
                            <Link 
                              href={`/dashboard/admin/${license.entityType === "clinic" ? "clinics" : "providers"}/${license.entityId}`} 
                              className="text-[#014585] hover:underline"
                            >
                              {license.entity}
                            </Link>
                          </div>
                        </div>
                        
                        <div className="mt-4 md:mt-0 flex items-center space-x-2">
                          {license.verificationStatus === "pending" && (
                            <Button
                              size="sm"
                              className="bg-amber-500 hover:bg-amber-600"
                              onClick={() => handleVerifyLicense(license.id)}
                            >
                              <FileCheck className="mr-2 h-4 w-4" />
                              Verify License
                            </Button>
                          )}
                          
                          {(license.status === "expired" || license.status === "expiring" || daysRemaining <= 30) && (
                            <Button
                              size="sm"
                              className="bg-[#014585] hover:bg-[#013a70]"
                              onClick={() => handleRenewLicense(license.id)}
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Renew License
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#014585]"
                            onClick={() => handleViewLicenseDetails(license.id)}
                          >
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditLicense(license.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit License
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteLicense(license.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete License
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>License Validity</span>
                          <span>
                            {daysRemaining < 0 
                              ? "Expired" 
                              : `${daysRemaining} days remaining`}
                          </span>
                        </div>
                        <Progress value={timeRemainingPercentage} className="h-2" indicatorClassName={progressColor} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-sm text-gray-500">Issue Date</p>
                          <p className="text-sm">{new Date(license.issueDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Expiry Date</p>
                          <p className="text-sm">{new Date(license.expiryDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Documents</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {license.documents.map(doc => (
                              <Badge key={doc.id} variant="outline" className="flex items-center">
                                <FileText className="h-3 w-3 mr-1" />
                                {doc.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {license.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-500">Notes</p>
                          <p className="text-sm">{license.notes}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Shield className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No licenses found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {searchQuery
                    ? "No licenses match your search criteria. Try a different search term."
                    : "There are no licenses in the system yet."}
                </p>
                <Button className="mt-4 bg-[#014585] hover:bg-[#013a70]" onClick={handleAddNewLicense}>
                  <Plus className="mr-2 h-4 w-4" /> Add New License
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}