"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
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
  X,
  Save,
  Upload,
  Info,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function AdminProvidersPage() {
  const { user, logout } = useAuth()
  
  // State for search and filter
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [filterOpen, setFilterOpen] = useState(false)
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("")
  const [clinicFilter, setClinicFilter] = useState<string>("")
  
  // State untuk modal
  const [addProviderOpen, setAddProviderOpen] = useState(false)
  const [editProviderOpen, setEditProviderOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<any>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    clinic: "",
    status: "active",
    joinDate: new Date().toISOString().split('T')[0],
    bio: "",
    address: "",
    education: "",
    certifications: "",
    profileImage: "",
  })
  
  // Mock data untuk providers
  const [providers, setProviders] = useState([
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "+1 (555) 123-4567",
      specialty: "Orthopedic",
      clinic: "Main Street Clinic",
      status: "active",
      joinDate: "2023-01-15",
      patients: 24,
      bio: "Dr. Sarah Johnson is a board-certified orthopedic specialist with over 10 years of experience in treating musculoskeletal conditions and injuries.",
      address: "123 Main St, Suite 101, Boston, MA 02108",
      education: "MD, Harvard Medical School\nResidency, Massachusetts General Hospital",
      certifications: "Board Certified in Orthopedic Surgery\nSports Medicine Certification",
      profileImage: "/placeholder-user.jpg",
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      email: "michael.chen@example.com",
      phone: "+1 (555) 987-6543",
      specialty: "Neurological",
      clinic: "City Health Center",
      status: "active",
      joinDate: "2023-02-20",
      patients: 18,
      bio: "Dr. Michael Chen specializes in neurological rehabilitation with a focus on stroke recovery and spinal cord injury rehabilitation.",
      address: "456 Park Ave, Suite 202, Boston, MA 02116",
      education: "MD, Johns Hopkins University\nResidency, NYU Langone Medical Center",
      certifications: "Neurological Rehabilitation Specialist\nCertified in Advanced Stroke Rehabilitation",
      profileImage: "/placeholder-user.jpg",
    },
    {
      id: "3",
      name: "Dr. Emily Rodriguez",
      email: "emily.rodriguez@example.com",
      phone: "+1 (555) 234-5678",
      specialty: "Sports Medicine",
      clinic: "Elite Sports Rehab",
      status: "inactive",
      joinDate: "2023-03-10",
      patients: 0,
      bio: "Dr. Emily Rodriguez is a sports medicine specialist who works with athletes of all levels, from amateur to professional, helping them recover from injuries and improve performance.",
      address: "789 Sports Blvd, Suite 303, Boston, MA 02215",
      education: "DPT, University of Southern California\nSports Medicine Fellowship, Andrews Institute",
      certifications: "Certified Sports Physical Therapist\nStrength and Conditioning Specialist",
      profileImage: "/placeholder-user.jpg",
    },
    {
      id: "4",
      name: "Dr. James Wilson",
      email: "james.wilson@example.com",
      phone: "+1 (555) 345-6789",
      specialty: "Geriatric",
      clinic: "Senior Care Wellness",
      status: "active",
      joinDate: "2023-04-05",
      patients: 31,
      bio: "Dr. James Wilson specializes in geriatric rehabilitation, focusing on improving mobility, balance, and quality of life for older adults.",
      address: "101 Elder St, Suite 404, Boston, MA 02120",
      education: "DPT, Northwestern University\nGeriatric Rehabilitation Residency, Mayo Clinic",
      certifications: "Certified Geriatric Specialist\nFall Prevention Certified",
      profileImage: "/placeholder-user.jpg",
    },
    {
      id: "5",
      name: "Dr. Aisha Patel",
      email: "aisha.patel@example.com",
      phone: "+1 (555) 456-7890",
      specialty: "Pediatric",
      clinic: "Children's Wellness Center",
      status: "active",
      joinDate: "2023-05-12",
      patients: 27,
      bio: "Dr. Aisha Patel is a pediatric rehabilitation specialist who works with children of all ages, helping them develop motor skills and recover from injuries or surgeries.",
      address: "202 Child Ave, Suite 505, Boston, MA 02130",
      education: "DPT, Boston University\nPediatric Specialty Certification, Children's Hospital",
      certifications: "Pediatric Certified Specialist\nNeurodevelopmental Treatment Certified",
      profileImage: "/placeholder-user.jpg",
    },
  ])
  
  // Handler untuk search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }
  
  // Handler untuk filter
  const handleFilterChange = (filter, value) => {
    if (filter === "specialty") {
      setSpecialtyFilter(value)
    } else if (filter === "clinic") {
      setClinicFilter(value)
    }
  }
  
  // Handler untuk export
  const handleExport = () => {
    alert("Exporting provider data...")
    // Implementasi export ke CSV atau Excel
  }
  
  // Handler untuk form input
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }
  
  // Handler untuk toggle status
  const handleStatusToggle = (e) => {
    setFormData({
      ...formData,
      status: e.target.checked ? "active" : "inactive",
    })
  }
  
  // Handler untuk add provider
  const handleAddProvider = async (e) => {
    e.preventDefault()
    
    try {
      // Simulasi API call
      const newProvider = {
        id: (providers.length + 1).toString(),
        ...formData,
        patients: 0,
      }
      
      setProviders([...providers, newProvider])
      setAddProviderOpen(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        specialty: "",
        clinic: "",
        status: "active",
        joinDate: new Date().toISOString().split('T')[0],
        bio: "",
        address: "",
        education: "",
        certifications: "",
        profileImage: "",
      })
      
      alert("Provider berhasil ditambahkan")
    } catch (error) {
      console.error('Error adding provider:', error)
      alert(error.message || 'Terjadi kesalahan saat menambahkan provider')
    }
  }
  
  // Handler untuk edit provider
  const handleEditProvider = async (e) => {
    e.preventDefault()
    
    try {
      // Simulasi API call
      const updatedProviders = providers.map(provider => 
        provider.id === selectedProvider.id ? { ...provider, ...formData } : provider
      )
      
      setProviders(updatedProviders)
      setEditProviderOpen(false)
      setSelectedProvider(null)
      
      alert("Provider berhasil diperbarui")
    } catch (error) {
      console.error('Error updating provider:', error)
      alert(error.message || 'Terjadi kesalahan saat memperbarui provider')
    }
  }
  
  // Handler untuk delete provider
  const handleDeleteProvider = async () => {
    if (!selectedProvider) return
    
    try {
      // Simulasi API call
      const updatedProviders = providers.filter(provider => provider.id !== selectedProvider.id)
      
      setProviders(updatedProviders)
      setDeleteConfirmOpen(false)
      setSelectedProvider(null)
      
      alert("Provider berhasil dihapus")
    } catch (error) {
      console.error('Error deleting provider:', error)
      alert(error.message || 'Terjadi kesalahan saat menghapus provider')
    }
  }

  return (
    <div className="flex h-screen bg-[#f0f4f9]">
      {/* Sidebar Navigation */}
      <div className="w-[78px] bg-gradient-to-b from-[#001a41] to-[#003366] flex flex-col items-center py-6">
        <div className="mb-8">
          <Image src="/kinetic-logo.png" alt="Kinetic Logo" width={60} height={60} />
          
        </div>

        <nav className="flex flex-col items-center space-y-6 flex-1">
          <Link href="/dashboard/admin" className="text-white/70 hover:text-white transition-colors">
            <Home size={24} />
          </Link>
          <Link href="/dashboard/admin/patients" className="text-white/70 hover:text-white transition-colors">
            <User size={24} />
          </Link>
          <Link href="/dashboard/admin/providers" className="text-white bg-white/20 p-2 rounded-lg">
            <UserCog size={24} />
          </Link>
          <Link href="/dashboard/admin/clinics" className="text-white/70 hover:text-white transition-colors">
            <Building2 size={24} />
          </Link>
          <Link href="/dashboard/admin/analytics" className="text-white/70 hover:text-white transition-colors">
            <LineChart size={24} />
          </Link>
          <Link href="/dashboard/admin/security" className="text-white/70 hover:text-white transition-colors">
            <Shield size={24} />
          </Link>
        </nav>

        <div className="mt-auto">
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white transition-colors" onClick={() => alert("Notifications")}>
            <Bell size={24} />
          </Button>
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white transition-colors" onClick={logout}>
            <LogOut size={24} />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800">Provider Management</h1>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Search providers..."
                className="pl-10 w-[300px]"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            
            <Button variant="outline" size="sm" onClick={() => setFilterOpen(true)}>
              <Filter size={16} className="mr-2" />
              Filter
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download size={16} className="mr-2" />
              Export
            </Button>
            
            <Button size="sm" onClick={() => setAddProviderOpen(true)}>
              <Plus size={16} className="mr-2" />
              Add Provider
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => alert("Settings")}>
                  <Settings size={16} className="mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert("Help")}>
                  <Info size={16} className="mr-2" />
                  Help
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="p-6">
          <Tabs defaultValue="all" className="mb-6" onValueChange={setStatusFilter}>
            <TabsList>
              <TabsTrigger value="all">All Providers</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers
              .filter(provider => 
                (statusFilter === "all" || provider.status === statusFilter) &&
                (searchQuery === "" || 
                  provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  provider.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  provider.specialty.toLowerCase().includes(searchQuery.toLowerCase())
                ) &&
                (specialtyFilter === "" || provider.specialty === specialtyFilter) &&
                (clinicFilter === "" || provider.clinic === clinicFilter)
              )
              .map(provider => (
                <Card key={provider.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-3">
                          <Image 
                            src={provider.profileImage || "/placeholder-user.jpg"} 
                            alt={provider.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{provider.name}</CardTitle>
                          <CardDescription className="text-sm">{provider.specialty}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={provider.status === "active" ? "success" : "secondary"}>
                        {provider.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-sm">
                        <Mail size={14} className="mr-2 text-gray-500" />
                        {provider.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone size={14} className="mr-2 text-gray-500" />
                        {provider.phone}
                      </div>
                      <div className="flex items-center text-sm">
                        <Building2 size={14} className="mr-2 text-gray-500" />
                        {provider.clinic}
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar size={14} className="mr-2 text-gray-500" />
                        Joined: {new Date(provider.joinDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm">
                        <User size={14} className="mr-2 text-gray-500" />
                        {provider.patients} active patients
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => {
                      setSelectedProvider(provider)
                      setDetailOpen(true)
                    }}>
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => {
                      setSelectedProvider(provider)
                      setFormData({
                        name: provider.name,
                        email: provider.email,
                        phone: provider.phone,
                        specialty: provider.specialty,
                        clinic: provider.clinic,
                        status: provider.status,
                        joinDate: provider.joinDate,
                        bio: provider.bio,
                        address: provider.address,
                        education: provider.education,
                        certifications: provider.certifications,
                        profileImage: provider.profileImage,
                      })
                      setEditProviderOpen(true)
                    }}>
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => {
                      setSelectedProvider(provider)
                      setDeleteConfirmOpen(true)
                    }}>
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
          
          {providers.filter(provider => 
            (statusFilter === "all" || provider.status === statusFilter) &&
            (searchQuery === "" || 
              provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              provider.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
              provider.specialty.toLowerCase().includes(searchQuery.toLowerCase())
            ) &&
            (specialtyFilter === "" || provider.specialty === specialtyFilter) &&
            (clinicFilter === "" || provider.clinic === clinicFilter)
          ).length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No providers found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <Button className="mt-4" onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
                setSpecialtyFilter("")
                setClinicFilter("")
              }}>
                Clear filters
              </Button>
            </div>
          )}
        </main>
      </div>
      
      {/* Filter Sheet */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Providers</SheetTitle>
            <SheetDescription>
              Apply filters to narrow down the provider list.
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Specialty</h3>
              <div className="grid grid-cols-1 gap-3">
                {["Orthopedic", "Neurological", "Sports Medicine", "Geriatric", "Pediatric"].map(specialty => (
                  <div key={specialty} className="flex items-center">
                    <input
                      type="radio"
                      id={`specialty-${specialty}`}
                      name="specialty"
                      className="mr-2"
                      checked={specialtyFilter === specialty}
                      onChange={() => handleFilterChange("specialty", specialty)}
                    />
                    <label htmlFor={`specialty-${specialty}`}>{specialty}</label>
                  </div>
                ))}
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="specialty-all"
                    name="specialty"
                    className="mr-2"
                    checked={specialtyFilter === ""}
                    onChange={() => handleFilterChange("specialty", "")}
                  />
                  <label htmlFor="specialty-all">All Specialties</label>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Clinic</h3>
              <div className="grid grid-cols-1 gap-3">
                {["Main Street Clinic", "City Health Center", "Elite Sports Rehab", "Senior Care Wellness", "Children's Wellness Center"].map(clinic => (
                  <div key={clinic} className="flex items-center">
                    <input
                      type="radio"
                      id={`clinic-${clinic}`}
                      name="clinic"
                      className="mr-2"
                      checked={clinicFilter === clinic}
                      onChange={() => handleFilterChange("clinic", clinic)}
                    />
                    <label htmlFor={`clinic-${clinic}`}>{clinic}</label>
                  </div>
                ))}
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="clinic-all"
                    name="clinic"
                    className="mr-2"
                    checked={clinicFilter === ""}
                    onChange={() => handleFilterChange("clinic", "")}
                  />
                  <label htmlFor="clinic-all">All Clinics</label>
                </div>
              </div>
            </div>
          </div>
          
          <SheetFooter>
            <Button variant="outline" onClick={() => {
              setSpecialtyFilter("")
              setClinicFilter("")
            }}>
              Reset Filters
            </Button>
            <Button onClick={() => setFilterOpen(false)}>Apply Filters</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      {/* Add Provider Dialog */}
      <Dialog open={addProviderOpen} onOpenChange={setAddProviderOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Provider</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new healthcare provider to the system.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddProvider}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Select name="specialty" value={formData.specialty} onValueChange={(value) => setFormData({...formData, specialty: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Orthopedic">Orthopedic</SelectItem>
                    <SelectItem value="Neurological">Neurological</SelectItem>
                    <SelectItem value="Sports Medicine">Sports Medicine</SelectItem>
                    <SelectItem value="Geriatric">Geriatric</SelectItem>
                    <SelectItem value="Pediatric">Pediatric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clinic">Clinic</Label>
                <Select name="clinic" value={formData.clinic} onValueChange={(value) => setFormData({...formData, clinic: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select clinic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Street Clinic">Main Street Clinic</SelectItem>
                    <SelectItem value="City Health Center">City Health Center</SelectItem>
                    <SelectItem value="Elite Sports Rehab">Elite Sports Rehab</SelectItem>
                    <SelectItem value="Senior Care Wellness">Senior Care Wellness</SelectItem>
                    <SelectItem value="Children's Wellness Center">Children's Wellness Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <Input id="joinDate" name="joinDate" type="date" value={formData.joinDate} onChange={handleInputChange} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="status" checked={formData.status === "active"} onCheckedChange={handleStatusToggle} />
                  <Label htmlFor="status" className="cursor-pointer">{formData.status === "active" ? "Active" : "Inactive"}</Label>
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} className="min-h-[100px]" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Textarea id="education" name="education" value={formData.education} onChange={handleInputChange} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications</Label>
                <Textarea id="certifications" name="certifications" value={formData.certifications} onChange={handleInputChange} />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddProviderOpen(false)}>Cancel</Button>
              <Button type="submit">Add Provider</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Provider Dialog */}
      <Dialog open={editProviderOpen} onOpenChange={setEditProviderOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Provider</DialogTitle>
            <DialogDescription>
              Update the provider's information.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditProvider}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <Input id="edit-email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input id="edit-phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-specialty">Specialty</Label>
                <Select name="specialty" value={formData.specialty} onValueChange={(value) => setFormData({...formData, specialty: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Orthopedic">Orthopedic</SelectItem>
                    <SelectItem value="Neurological">Neurological</SelectItem>
                    <SelectItem value="Sports Medicine">Sports Medicine</SelectItem>
                    <SelectItem value="Geriatric">Geriatric</SelectItem>
                    <SelectItem value="Pediatric">Pediatric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-clinic">Clinic</Label>
                <Select name="clinic" value={formData.clinic} onValueChange={(value) => setFormData({...formData, clinic: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select clinic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Street Clinic">Main Street Clinic</SelectItem>
                    <SelectItem value="City Health Center">City Health Center</SelectItem>
                    <SelectItem value="Elite Sports Rehab">Elite Sports Rehab</SelectItem>
                    <SelectItem value="Senior Care Wellness">Senior Care Wellness</SelectItem>
                    <SelectItem value="Children's Wellness Center">Children's Wellness Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-joinDate">Join Date</Label>
                <Input id="edit-joinDate" name="joinDate" type="date" value={formData.joinDate} onChange={handleInputChange} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="edit-status" checked={formData.status === "active"} onCheckedChange={handleStatusToggle} />
                  <Label htmlFor="edit-status" className="cursor-pointer">{formData.status === "active" ? "Active" : "Inactive"}</Label>
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input id="edit-address" name="address" value={formData.address} onChange={handleInputChange} />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-bio">Professional Bio</Label>
                <Textarea id="edit-bio" name="bio" value={formData.bio} onChange={handleInputChange} className="min-h-[100px]" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-education">Education</Label>
                <Textarea id="edit-education" name="education" value={formData.education} onChange={handleInputChange} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-certifications">Certifications</Label>
                <Textarea id="edit-certifications" name="certifications" value={formData.certifications} onChange={handleInputChange} />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditProviderOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this provider? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProvider && (
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  <Image 
                    src={selectedProvider.profileImage || "/placeholder-user.jpg"} 
                    alt={selectedProvider.name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{selectedProvider.name}</h3>
                <p className="text-sm text-gray-500">{selectedProvider.specialty} • {selectedProvider.clinic}</p>
                
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center">
                    <Mail size={14} className="mr-2 text-gray-500" />
                    {selectedProvider.email}
                  </div>
                  <div className="flex items-center">
                    <Phone size={14} className="mr-2 text-gray-500" />
                    {selectedProvider.phone}
                  </div>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-2 text-gray-500" />
                    Joined: {new Date(selectedProvider.joinDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <User size={14} className="mr-2 text-gray-500" />
                    {selectedProvider.patients} active patients
                  </div>
                  <div className="flex items-center">
                    {selectedProvider.status === "active" ? (
                      <span className="text-green-600 font-medium ml-1 flex items-center">
                        <CheckCircle size={14} className="mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-medium ml-1 flex items-center">
                        <Clock size={14} className="mr-1" />
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteProvider}>Delete Provider</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Provider Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Provider Details</DialogTitle>
          </DialogHeader>
          
          {selectedProvider && (
            <div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden mb-4">
                    <Image 
                      src={selectedProvider.profileImage || "/placeholder-user.jpg"} 
                      alt={selectedProvider.name}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold">{selectedProvider.patients}</div>
                      <div className="text-sm text-gray-500">Active Patients</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold">{new Date(selectedProvider.joinDate).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">Join Date</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold">
                        {Math.floor((new Date() - new Date(selectedProvider.joinDate)) / (1000 * 60 * 60 * 24 * 30))} months
                      </div>
                      <div className="text-sm text-gray-500">Account Age</div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedProvider.name}</h2>
                      <p className="text-gray-500">{selectedProvider.specialty} Specialist</p>
                    </div>
                    <Badge variant={selectedProvider.status === "active" ? "success" : "secondary"} className="text-sm">
                      {selectedProvider.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center">
                          <Mail size={16} className="mr-2 text-gray-500" />
                          {selectedProvider.email}
                        </div>
                        <div className="flex items-center">
                          <Phone size={16} className="mr-2 text-gray-500" />
                          {selectedProvider.phone}
                        </div>
                        <div className="flex items-center md:col-span-2">
                          <Building2 size={16} className="mr-2 text-gray-500" />
                          {selectedProvider.clinic} - {selectedProvider.address}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Professional Bio</h3>
                      <p className="text-sm text-gray-700">{selectedProvider.bio}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Education</h3>
                        <div className="text-sm text-gray-700 whitespace-pre-line">{selectedProvider.education}</div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Certifications</h3>
                        <div className="text-sm text-gray-700 whitespace-pre-line">{selectedProvider.certifications}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <Button variant="outline" onClick={() => {
                  setFormData({
                    name: selectedProvider.name,
                    email: selectedProvider.email,
                    phone: selectedProvider.phone,
                    specialty: selectedProvider.specialty,
                    clinic: selectedProvider.clinic,
                    status: selectedProvider.status,
                    joinDate: selectedProvider.joinDate,
                    bio: selectedProvider.bio,
                    address: selectedProvider.address,
                    education: selectedProvider.education,
                    certifications: selectedProvider.certifications,
                    profileImage: selectedProvider.profileImage,
                  })
                  setDetailOpen(false)
                  setEditProviderOpen(true)
                }}>
                  <Edit size={16} className="mr-2" />
                  Edit Provider
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}