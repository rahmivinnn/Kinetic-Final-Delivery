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
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AdminClinicsPage() {
  const { user, logout } = useAuth()
  
  // State untuk data klinik
  const [clinics, setClinics] = useState([
    {
      id: 1,
      name: "Kinetic Rehab Center - Downtown",
      location: "123 Main St, New York, NY",
      image: "/clinic-1.jpg",
      providers: 8,
      patients: 245,
      status: "active",
      licenseExpiry: "2024-12-15",
      contactEmail: "downtown@kineticrehab.com",
      contactPhone: "(212) 555-1234",
      openingHours: "Mon-Fri: 8AM-7PM, Sat: 9AM-3PM",
    },
    {
      id: 2,
      name: "Kinetic Physical Therapy - Westside",
      location: "456 Park Ave, Los Angeles, CA",
      image: "/clinic-2.jpg",
      providers: 5,
      patients: 178,
      status: "active",
      licenseExpiry: "2024-08-30",
      contactEmail: "westside@kineticrehab.com",
      contactPhone: "(310) 555-6789",
      openingHours: "Mon-Fri: 7AM-8PM, Sat: 8AM-4PM",
    },
    {
      id: 3,
      name: "Kinetic Movement Clinic - North",
      location: "789 Oak St, Chicago, IL",
      image: "/clinic-3.jpg",
      providers: 6,
      patients: 203,
      status: "pending",
      licenseExpiry: "2024-10-22",
      contactEmail: "north@kineticrehab.com",
      contactPhone: "(312) 555-9012",
      openingHours: "Mon-Fri: 8AM-6PM, Sat: 9AM-2PM",
    },
    {
      id: 4,
      name: "Kinetic Sports Rehab - Eastside",
      location: "321 Pine St, Boston, MA",
      image: "/clinic-4.jpg",
      providers: 7,
      patients: 192,
      status: "active",
      licenseExpiry: "2025-01-10",
      contactEmail: "eastside@kineticrehab.com",
      contactPhone: "(617) 555-3456",
      openingHours: "Mon-Fri: 6AM-8PM, Sat-Sun: 8AM-2PM",
    },
    {
      id: 5,
      name: "Kinetic Recovery Center - South",
      location: "654 Elm St, Miami, FL",
      image: "/clinic-5.jpg",
      providers: 4,
      patients: 156,
      status: "inactive",
      licenseExpiry: "2024-05-18",
      contactEmail: "south@kineticrehab.com",
      contactPhone: "(305) 555-7890",
      openingHours: "Mon-Fri: 8AM-7PM, Sat: 9AM-1PM",
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

  // Handler untuk menambah klinik baru
  const handleAddNewClinic = () => {
    alert("Add new clinic feature coming soon!")
  }

  // Handler untuk melihat detail klinik
  const handleViewClinicDetails = (id: number) => {
    alert(`View details for clinic ${id} - Feature coming soon!`)
  }

  // Handler untuk mengedit klinik
  const handleEditClinic = (id: number) => {
    alert(`Edit clinic ${id} - Feature coming soon!`)
  }

  // Handler untuk mengelola penyedia layanan klinik
  const handleManageProviders = (id: number) => {
    alert(`Manage providers for clinic ${id} - Feature coming soon!`)
  }

  // Handler untuk mengelola lisensi klinik
  const handleManageLicense = (id: number) => {
    alert(`Manage license for clinic ${id} - Feature coming soon!`)
  }

  // Handler untuk menghapus klinik
  const handleDeleteClinic = (id: number) => {
    if (confirm(`Are you sure you want to delete clinic ${id}?`)) {
      setClinics(clinics.filter(clinic => clinic.id !== id))
    }
  }

  // Filter klinik berdasarkan pencarian dan status
  const filteredClinics = clinics.filter(clinic => {
    const matchesSearch = clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         clinic.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || clinic.status === statusFilter
    
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
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white"
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
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">Clinic Management</h1>
              <p className="text-gray-500">Manage all Kinetic Rehab clinics in the system</p>
            </div>
            <Button className="bg-[#014585] hover:bg-[#013a70]" onClick={handleAddNewClinic}>
              <Plus className="mr-2 h-4 w-4" /> Add New Clinic
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by clinic name or location..."
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
              <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                <TabsTrigger value="all">All Clinics</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Clinics List */}
          <div className="space-y-4">
            {filteredClinics.length > 0 ? (
              filteredClinics.map((clinic) => (
                <Card key={clinic.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-[200px] h-[150px] relative bg-gray-100">
                      <Image
                        src={clinic.image}
                        alt={clinic.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{clinic.name}</h3>
                          <div className="flex items-center text-gray-500 mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{clinic.location}</span>
                          </div>
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${clinic.status === "active" ? "bg-green-100 text-green-800" : clinic.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-800"}`}
                          >
                            {clinic.status === "active" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {clinic.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                            {clinic.status === "inactive" && <XCircle className="h-3 w-3 mr-1" />}
                            {clinic.status.charAt(0).toUpperCase() + clinic.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-500">Contact</p>
                          <p className="text-sm">{clinic.contactEmail}</p>
                          <p className="text-sm">{clinic.contactPhone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Hours</p>
                          <p className="text-sm">{clinic.openingHours}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">License Expires</p>
                          <p className="text-sm">{new Date(clinic.licenseExpiry).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm">
                              <span className="font-medium">{clinic.providers}</span> Providers
                            </span>
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm">
                              <span className="font-medium">{clinic.patients}</span> Patients
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#014585]"
                            onClick={() => handleViewClinicDetails(clinic.id)}
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
                              <DropdownMenuItem onClick={() => handleEditClinic(clinic.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Clinic
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleManageProviders(clinic.id)}>
                                <UserCog className="mr-2 h-4 w-4" />
                                Manage Providers
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleManageLicense(clinic.id)}>
                                <Shield className="mr-2 h-4 w-4" />
                                Manage License
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteClinic(clinic.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Clinic
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Building2 className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No clinics found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {searchQuery
                    ? "No clinics match your search criteria. Try a different search term."
                    : "There are no clinics in the system yet."}
                </p>
                <Button className="mt-4 bg-[#014585] hover:bg-[#013a70]" onClick={handleAddNewClinic}>
                  <Plus className="mr-2 h-4 w-4" /> Add New Clinic
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}