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
  BarChart,
  PieChart,
  Calendar,
  Users,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Printer,
  Mail,
  Share2,
  ChevronRight,
  Clock,
  CalendarRange,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminReportsPage() {
  const { user, logout } = useAuth()
  
  // State untuk periode laporan
  const [reportPeriod, setReportPeriod] = useState("month")
  
  // State untuk jenis laporan yang dipilih
  const [selectedReportType, setSelectedReportType] = useState("overview")

  // Data untuk laporan ringkasan
  const overviewData = {
    clinics: {
      total: 24,
      active: 22,
      inactive: 2,
      growth: "+3",
      growthPercent: "+14.3%",
    },
    providers: {
      total: 87,
      active: 82,
      pending: 3,
      inactive: 2,
      growth: "+12",
      growthPercent: "+16.0%",
    },
    patients: {
      total: 1458,
      active: 1245,
      completed: 156,
      inactive: 57,
      growth: "+124",
      growthPercent: "+9.3%",
    },
    appointments: {
      total: 3245,
      completed: 2876,
      cancelled: 189,
      noShow: 180,
      growth: "+342",
      growthPercent: "+11.8%",
    },
    satisfaction: {
      overall: 4.7,
      providers: 4.8,
      facilities: 4.6,
      treatment: 4.7,
      growth: "+0.2",
      growthPercent: "+4.4%",
    },
    revenue: {
      total: "$487,250",
      insurance: "$365,438",
      outOfPocket: "$121,812",
      growth: "+$42,180",
      growthPercent: "+9.5%",
    },
  }

  // Data untuk laporan klinik
  const clinicReports = [
    {
      id: 1,
      name: "Clinic Performance Report",
      description: "Comprehensive analysis of all clinic metrics including patient volume, provider efficiency, and satisfaction scores.",
      lastGenerated: "2023-11-15",
      frequency: "Monthly",
      format: "PDF, Excel",
    },
    {
      id: 2,
      name: "Clinic Comparison Analysis",
      description: "Side-by-side comparison of all clinics based on key performance indicators and growth metrics.",
      lastGenerated: "2023-11-01",
      frequency: "Quarterly",
      format: "PDF, Excel, Interactive",
    },
    {
      id: 3,
      name: "Clinic Utilization Report",
      description: "Analysis of facility usage, appointment density, and resource allocation across all clinics.",
      lastGenerated: "2023-10-31",
      frequency: "Monthly",
      format: "PDF, Excel",
    },
  ]

  // Data untuk laporan penyedia layanan
  const providerReports = [
    {
      id: 4,
      name: "Provider Performance Report",
      description: "Detailed metrics on provider productivity, patient outcomes, and satisfaction ratings.",
      lastGenerated: "2023-11-10",
      frequency: "Monthly",
      format: "PDF, Excel",
    },
    {
      id: 5,
      name: "Provider Certification Status",
      description: "Summary of all provider certifications, license status, and continuing education requirements.",
      lastGenerated: "2023-11-05",
      frequency: "Monthly",
      format: "PDF, Excel",
    },
    {
      id: 6,
      name: "Provider Scheduling Efficiency",
      description: "Analysis of appointment scheduling, cancellations, and provider availability optimization.",
      lastGenerated: "2023-10-25",
      frequency: "Bi-weekly",
      format: "PDF, Excel",
    },
  ]

  // Data untuk laporan pasien
  const patientReports = [
    {
      id: 7,
      name: "Patient Outcomes Report",
      description: "Comprehensive analysis of treatment outcomes, recovery rates, and patient progress metrics.",
      lastGenerated: "2023-11-12",
      frequency: "Monthly",
      format: "PDF, Excel",
    },
    {
      id: 8,
      name: "Patient Satisfaction Analysis",
      description: "Detailed breakdown of patient feedback, satisfaction scores, and improvement opportunities.",
      lastGenerated: "2023-11-08",
      frequency: "Monthly",
      format: "PDF, Excel, Interactive",
    },
    {
      id: 9,
      name: "Patient Demographics Report",
      description: "Analysis of patient population by age, condition, insurance type, and geographic distribution.",
      lastGenerated: "2023-10-30",
      frequency: "Quarterly",
      format: "PDF, Excel",
    },
  ]

  // Data untuk laporan keuangan
  const financialReports = [
    {
      id: 10,
      name: "Revenue Analysis Report",
      description: "Detailed breakdown of revenue streams, insurance reimbursements, and financial performance.",
      lastGenerated: "2023-11-14",
      frequency: "Monthly",
      format: "PDF, Excel",
    },
    {
      id: 11,
      name: "Billing Efficiency Report",
      description: "Analysis of billing cycles, claim processing times, and reimbursement rates across all clinics.",
      lastGenerated: "2023-11-07",
      frequency: "Bi-weekly",
      format: "PDF, Excel",
    },
    {
      id: 12,
      name: "Financial Forecasting Report",
      description: "Predictive analysis of future revenue, expenses, and growth opportunities based on historical data.",
      lastGenerated: "2023-10-31",
      frequency: "Quarterly",
      format: "PDF, Excel, Interactive",
    },
  ]

  // Handler untuk mengubah periode laporan
  const handlePeriodChange = (value: string) => {
    setReportPeriod(value)
  }

  // Handler untuk mengunduh laporan
  const handleDownloadReport = (id: number) => {
    alert(`Downloading report ${id} - Feature coming soon!`)
  }

  // Handler untuk mencetak laporan
  const handlePrintReport = (id: number) => {
    alert(`Printing report ${id} - Feature coming soon!`)
  }

  // Handler untuk mengirim laporan melalui email
  const handleEmailReport = (id: number) => {
    alert(`Emailing report ${id} - Feature coming soon!`)
  }

  // Handler untuk membagikan laporan
  const handleShareReport = (id: number) => {
    alert(`Sharing report ${id} - Feature coming soon!`)
  }

  // Handler untuk melihat detail laporan
  const handleViewReportDetails = (id: number) => {
    alert(`View details for report ${id} - Feature coming soon!`)
  }

  // Handler untuk membuat laporan kustom
  const handleCreateCustomReport = () => {
    alert("Create custom report feature coming soon!")
  }

  // Mendapatkan data laporan berdasarkan jenis yang dipilih
  const getReportsByType = () => {
    switch (selectedReportType) {
      case "clinics":
        return clinicReports
      case "providers":
        return providerReports
      case "patients":
        return patientReports
      case "financial":
        return financialReports
      default:
        return []
    }
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
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white"
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
              <h1 className="text-2xl font-bold text-[#111827]">System Reports</h1>
              <p className="text-gray-500">Comprehensive analytics and reports for the Kinetic Rehab system</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Period:</span>
                <Select value={reportPeriod} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-[#014585] hover:bg-[#013a70]" onClick={handleCreateCustomReport}>
                <Plus className="mr-2 h-4 w-4" /> Create Custom Report
              </Button>
            </div>
          </div>

          {/* Report Navigation */}
          <Tabs defaultValue="overview" className="w-full mb-6" onValueChange={setSelectedReportType}>
            <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="clinics">Clinic Reports</TabsTrigger>
              <TabsTrigger value="providers">Provider Reports</TabsTrigger>
              <TabsTrigger value="patients">Patient Reports</TabsTrigger>
              <TabsTrigger value="financial">Financial Reports</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Overview Dashboard */}
          {selectedReportType === "overview" && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Building2 className="mr-2 h-5 w-5 text-[#014585]" />
                      Clinics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-baseline">
                      <div>
                        <p className="text-3xl font-bold">{overviewData.clinics.total}</p>
                        <p className="text-sm text-gray-500">Total Clinics</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600 flex items-center">
                          {overviewData.clinics.growthPercent}
                          <ArrowUpRight className="ml-1 h-4 w-4" />
                        </p>
                        <p className="text-xs text-gray-500">vs. previous period</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                      <div>
                        <p className="text-sm font-medium">{overviewData.clinics.active}</p>
                        <p className="text-xs text-gray-500">Active</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{overviewData.clinics.inactive}</p>
                        <p className="text-xs text-gray-500">Inactive</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-600">{overviewData.clinics.growth}</p>
                        <p className="text-xs text-gray-500">New</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <UserCog className="mr-2 h-5 w-5 text-[#014585]" />
                      Providers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-baseline">
                      <div>
                        <p className="text-3xl font-bold">{overviewData.providers.total}</p>
                        <p className="text-sm text-gray-500">Total Providers</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600 flex items-center">
                          {overviewData.providers.growthPercent}
                          <ArrowUpRight className="ml-1 h-4 w-4" />
                        </p>
                        <p className="text-xs text-gray-500">vs. previous period</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                      <div>
                        <p className="text-sm font-medium">{overviewData.providers.active}</p>
                        <p className="text-xs text-gray-500">Active</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{overviewData.providers.pending}</p>
                        <p className="text-xs text-gray-500">Pending</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{overviewData.providers.inactive}</p>
                        <p className="text-xs text-gray-500">Inactive</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-600">{overviewData.providers.growth}</p>
                        <p className="text-xs text-gray-500">New</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Users className="mr-2 h-5 w-5 text-[#014585]" />
                      Patients
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-baseline">
                      <div>
                        <p className="text-3xl font-bold">{overviewData.patients.total}</p>
                        <p className="text-sm text-gray-500">Total Patients</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600 flex items-center">
                          {overviewData.patients.growthPercent}
                          <ArrowUpRight className="ml-1 h-4 w-4" />
                        </p>
                        <p className="text-xs text-gray-500">vs. previous period</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                      <div>
                        <p className="text-sm font-medium">{overviewData.patients.active}</p>
                        <p className="text-xs text-gray-500">Active</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{overviewData.patients.completed}</p>
                        <p className="text-xs text-gray-500">Completed</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{overviewData.patients.inactive}</p>
                        <p className="text-xs text-gray-500">Inactive</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-600">{overviewData.patients.growth}</p>
                        <p className="text-xs text-gray-500">New</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Secondary Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-[#014585]" />
                      Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-baseline">
                      <div>
                        <p className="text-3xl font-bold">{overviewData.appointments.total}</p>
                        <p className="text-sm text-gray-500">Total Appointments</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600 flex items-center">
                          {overviewData.appointments.growthPercent}
                          <ArrowUpRight className="ml-1 h-4 w-4" />
                        </p>
                        <p className="text-xs text-gray-500">vs. previous period</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                      <div>
                        <p className="text-sm font-medium">{overviewData.appointments.completed}</p>
                        <p className="text-xs text-gray-500">Completed</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{overviewData.appointments.cancelled}</p>
                        <p className="text-xs text-gray-500">Cancelled</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{overviewData.appointments.noShow}</p>
                        <p className="text-xs text-gray-500">No-show</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-600">{overviewData.appointments.growth}</p>
                        <p className="text-xs text-gray-500">Growth</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <BarChart className="mr-2 h-5 w-5 text-[#014585]" />
                      Patient Satisfaction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-baseline">
                      <div>
                        <p className="text-3xl font-bold">{overviewData.satisfaction.overall}<span className="text-sm text-gray-500">/5</span></p>
                        <p className="text-sm text-gray-500">Overall Rating</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600 flex items-center">
                          {overviewData.satisfaction.growthPercent}
                          <ArrowUpRight className="ml-1 h-4 w-4" />
                        </p>
                        <p className="text-xs text-gray-500">vs. previous period</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                      <div>
                        <p className="text-sm font-medium">{overviewData.satisfaction.providers}</p>
                        <p className="text-xs text-gray-500">Providers</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{overviewData.satisfaction.facilities}</p>
                        <p className="text-xs text-gray-500">Facilities</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{overviewData.satisfaction.treatment}</p>
                        <p className="text-xs text-gray-500">Treatment</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-600">{overviewData.satisfaction.growth}</p>
                        <p className="text-xs text-gray-500">Growth</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <PieChart className="mr-2 h-5 w-5 text-[#014585]" />
                      Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-baseline">
                      <div>
                        <p className="text-3xl font-bold">{overviewData.revenue.total}</p>
                        <p className="text-sm text-gray-500">Total Revenue</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600 flex items-center">
                          {overviewData.revenue.growthPercent}
                          <ArrowUpRight className="ml-1 h-4 w-4" />
                        </p>
                        <p className="text-xs text-gray-500">vs. previous period</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                      <div>
                        <p className="text-sm font-medium">{overviewData.revenue.insurance}</p>
                        <p className="text-xs text-gray-500">Insurance</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{overviewData.revenue.outOfPocket}</p>
                        <p className="text-xs text-gray-500">Out-of-pocket</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-600">{overviewData.revenue.growth}</p>
                        <p className="text-xs text-gray-500">Growth</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Access Reports */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Access Reports</CardTitle>
                  <CardDescription>Frequently accessed reports and analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center space-y-2 border-dashed"
                      onClick={() => setSelectedReportType("clinics")}
                    >
                      <Building2 className="h-6 w-6 text-[#014585]" />
                      <span>Clinic Reports</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center space-y-2 border-dashed"
                      onClick={() => setSelectedReportType("providers")}
                    >
                      <UserCog className="h-6 w-6 text-[#014585]" />
                      <span>Provider Reports</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center space-y-2 border-dashed"
                      onClick={() => setSelectedReportType("patients")}
                    >
                      <Users className="h-6 w-6 text-[#014585]" />
                      <span>Patient Reports</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center space-y-2 border-dashed"
                      onClick={() => setSelectedReportType("financial")}
                    >
                      <PieChart className="h-6 w-6 text-[#014585]" />
                      <span>Financial Reports</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center space-y-2 border-dashed"
                      onClick={handleCreateCustomReport}
                    >
                      <Plus className="h-6 w-6 text-[#014585]" />
                      <span>Create Custom Report</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Report Lists */}
          {selectedReportType !== "overview" && (
            <div className="space-y-4">
              {getReportsByType().map((report) => (
                <Card key={report.id}>
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                      </div>
                      
                      <div className="mt-4 md:mt-0 flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[#014585]"
                          onClick={() => handleDownloadReport(report.id)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[#014585]"
                          onClick={() => handlePrintReport(report.id)}
                        >
                          <Printer className="mr-2 h-4 w-4" />
                          Print
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[#014585]"
                          onClick={() => handleEmailReport(report.id)}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Email
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[#014585]"
                          onClick={() => handleShareReport(report.id)}
                        >
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#014585]"
                          onClick={() => handleViewReportDetails(report.id)}
                        >
                          View Details
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">
                          Last Generated: <span className="text-gray-700">{new Date(report.lastGenerated).toLocaleDateString()}</span>
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CalendarRange className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">
                          Frequency: <span className="text-gray-700">{report.frequency}</span>
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">
                          Available Formats: <span className="text-gray-700">{report.format}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}