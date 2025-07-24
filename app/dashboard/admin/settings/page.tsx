"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Save,
  RefreshCw,
  Database,
  HardDrive,
  Cpu,
  Globe,
  Mail,
  MessageSquare,
  Palette,
  FileText,
  Lock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Upload,
  Trash2,
  Info,
  Cloud,
  Server,
  Smartphone,
  Tablet,
  Monitor,
  Laptop,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function AdminSettingsPage() {
  const { user, logout } = useAuth()
  
  // State untuk pengaturan sistem
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    systemVersion: "2.5.1",
    lastUpdated: "2023-11-01",
    autoUpdate: true,
    updateChannel: "stable",
    dataRetentionDays: 365,
    maxUploadSize: 50, // MB
    sessionTimeout: 30, // menit
    backupFrequency: "daily",
    backupRetention: 30, // hari
    lastBackup: "2023-11-14T03:15:00",
    nextBackup: "2023-11-15T03:15:00",
  })
  
  // State untuk pengaturan tampilan
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    accentColor: "blue",
    sidebarCollapsed: false,
    denseMode: false,
    animationsEnabled: true,
    fontScale: 1,
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
  })
  
  // State untuk pengaturan notifikasi
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    inAppNotifications: true,
    desktopNotifications: true,
    criticalAlertsOnly: false,
    digestFrequency: "daily",
    quietHoursEnabled: true,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
  })
  
  // State untuk pengaturan keamanan
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    twoFactorMethod: "app",
    passwordExpiry: 90, // hari
    passwordComplexity: "high",
    loginAttempts: 5,
    ipWhitelisting: false,
    auditLogRetention: 180, // hari
    sessionConcurrency: "multiple",
  })
  
  // State untuk pengaturan integrasi
  const [integrationSettings, setIntegrationSettings] = useState({
    apiEnabled: true,
    webhooksEnabled: true,
    ssoEnabled: false,
    ldapEnabled: false,
    emailProvider: "smtp",
    smsProvider: "twilio",
    paymentGateway: "stripe",
    analyticsProvider: "google",
  })
  
  // State untuk statistik sistem
  const [systemStats, setSystemStats] = useState({
    cpuUsage: 32,
    memoryUsage: 45,
    diskUsage: 68,
    activeUsers: 127,
    totalUsers: 1542,
    activeSessions: 89,
    averageResponseTime: 235, // ms
    uptime: "99.98%",
    uptimeDays: 124,
    databaseSize: 8.7, // GB
    mediaStorageSize: 156.3, // GB
    totalStorageSize: 500, // GB
    apiRequests: {
      today: 12458,
      yesterday: 11982,
      thisWeek: 87654,
      lastWeek: 82341
    },
    errorRate: 0.12, // %
  })
  
  // State untuk riwayat pembaruan sistem
  const [updateHistory, setUpdateHistory] = useState([
    {
      id: 1,
      version: "2.5.1",
      date: "2023-11-01",
      type: "minor",
      description: "Performance improvements and bug fixes",
      changes: [
        "Improved dashboard loading speed by 30%",
        "Fixed provider license expiry notification bug",
        "Added new report export formats",
        "Updated security protocols"
      ]
    },
    {
      id: 2,
      version: "2.5.0",
      date: "2023-10-15",
      type: "feature",
      description: "New reporting system and UI improvements",
      changes: [
        "Completely redesigned reporting system",
        "Added customizable dashboards",
        "Improved mobile responsiveness",
        "Enhanced data visualization tools"
      ]
    },
    {
      id: 3,
      version: "2.4.2",
      date: "2023-09-22",
      type: "patch",
      description: "Critical security update",
      changes: [
        "Patched authentication vulnerability",
        "Updated third-party dependencies",
        "Improved error logging",
        "Fixed cross-site scripting issues"
      ]
    },
    {
      id: 4,
      version: "2.4.1",
      date: "2023-09-10",
      type: "patch",
      description: "Bug fixes and minor improvements",
      changes: [
        "Fixed clinic assignment issues",
        "Improved search functionality",
        "Updated email templates",
        "Fixed calendar sync problems"
      ]
    },
    {
      id: 5,
      version: "2.4.0",
      date: "2023-08-15",
      type: "feature",
      description: "License management system overhaul",
      changes: [
        "New license verification workflow",
        "Automated renewal notifications",
        "Document storage improvements",
        "Added bulk operations for licenses"
      ]
    },
  ])
  
  // State untuk riwayat backup
  const [backupHistory, setBackupHistory] = useState([
    {
      id: 1,
      date: "2023-11-14T03:15:00",
      size: "4.2 GB",
      status: "success",
      type: "automatic",
      location: "Cloud Storage",
      retention: "30 days"
    },
    {
      id: 2,
      date: "2023-11-13T03:15:00",
      size: "4.1 GB",
      status: "success",
      type: "automatic",
      location: "Cloud Storage",
      retention: "30 days"
    },
    {
      id: 3,
      date: "2023-11-12T03:15:00",
      size: "4.1 GB",
      status: "success",
      type: "automatic",
      location: "Cloud Storage",
      retention: "30 days"
    },
    {
      id: 4,
      date: "2023-11-11T03:15:00",
      size: "4.0 GB",
      status: "success",
      type: "automatic",
      location: "Cloud Storage",
      retention: "30 days"
    },
    {
      id: 5,
      date: "2023-11-10T15:22:00",
      size: "4.0 GB",
      status: "success",
      type: "manual",
      location: "Local Storage",
      retention: "90 days"
    },
  ])
  
  // Handler untuk perubahan pengaturan sistem
  const handleSystemSettingChange = (key: string, value: any) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }
  
  // Handler untuk perubahan pengaturan tampilan
  const handleAppearanceSettingChange = (key: string, value: any) => {
    setAppearanceSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }
  
  // Handler untuk perubahan pengaturan notifikasi
  const handleNotificationSettingChange = (key: string, value: any) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }
  
  // Handler untuk perubahan pengaturan keamanan
  const handleSecuritySettingChange = (key: string, value: any) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }))
  }
  
  // Handler untuk perubahan pengaturan integrasi
  const handleIntegrationSettingChange = (key: string, value: any) => {
    setIntegrationSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }
  
  // Handler untuk backup manual
  const handleManualBackup = () => {
    alert("Manual backup initiated. This may take a few minutes.")
    // Simulasi backup baru
    const newBackup = {
      id: backupHistory.length + 1,
      date: new Date().toISOString(),
      size: "4.2 GB",
      status: "in_progress",
      type: "manual",
      location: "Cloud Storage",
      retention: "90 days"
    }
    setBackupHistory([newBackup, ...backupHistory])
  }
  
  // Handler untuk restore backup
  const handleRestoreBackup = (backupId: number) => {
    alert(`Restore from backup ID ${backupId} initiated. System will be temporarily unavailable.`)
  }
  
  // Handler untuk download backup
  const handleDownloadBackup = (backupId: number) => {
    alert(`Downloading backup ID ${backupId}. This may take some time depending on your connection.`)
  }
  
  // Handler untuk delete backup
  const handleDeleteBackup = (backupId: number) => {
    if (confirm(`Are you sure you want to delete backup ID ${backupId}? This action cannot be undone.`)) {
      setBackupHistory(backupHistory.filter(backup => backup.id !== backupId))
      alert("Backup deleted successfully.")
    }
  }
  
  // Handler untuk check update
  const handleCheckUpdate = () => {
    alert("Checking for updates... No new updates available. Your system is up to date.")
  }
  
  // Fungsi untuk memformat tanggal
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  // Fungsi untuk memformat timestamp
  const formatTimestamp = (timestamp: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(timestamp).toLocaleString(undefined, options)
  }
  
  // Fungsi untuk mendapatkan warna badge berdasarkan tipe update
  const getUpdateTypeBadgeColor = (type: string) => {
    switch (type) {
      case "major":
        return "bg-blue-500 hover:bg-blue-600"
      case "feature":
        return "bg-green-500 hover:bg-green-600"
      case "minor":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "patch":
        return "bg-orange-500 hover:bg-orange-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }
  
  // Fungsi untuk mendapatkan warna badge berdasarkan status backup
  const getBackupStatusBadgeColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500 hover:bg-green-600"
      case "in_progress":
        return "bg-blue-500 hover:bg-blue-600"
      case "failed":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }
  
  // Fungsi untuk mendapatkan ikon berdasarkan status backup
  const getBackupStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "failed":
        return <XCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
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
                objectPosition: "center",
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
                aspectRatio: "1/1"
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
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Bell className="w-5 h-5" />
          </Link>
        </nav>

        <div className="mt-auto flex flex-col items-center space-y-6">
          <Link
            href="/dashboard/admin/profile"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <User className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard/admin/settings"
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white"
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
              <h1 className="text-2xl font-bold text-[#111827]">System Settings</h1>
              <p className="text-gray-500">Configure and manage system preferences</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-[#014585] hover:bg-[#013a70]">
                <Save className="mr-2 h-4 w-4" /> Save All Changes
              </Button>
            </div>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>
            
            {/* General Tab */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                  <CardDescription>Basic information about your Kinetic Rehab system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">System Version</h3>
                      <div className="flex items-center">
                        <span className="text-lg font-semibold mr-2">{systemSettings.systemVersion}</span>
                        <Badge className="bg-green-500 hover:bg-green-600">Up to date</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Last updated: {formatDate(systemSettings.lastUpdated)}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Update Settings</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="autoUpdate">Automatic Updates</Label>
                          <Switch 
                            id="autoUpdate" 
                            checked={systemSettings.autoUpdate}
                            onCheckedChange={(checked) => handleSystemSettingChange('autoUpdate', checked)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="updateChannel">Update Channel</Label>
                          <Select 
                            value={systemSettings.updateChannel}
                            onValueChange={(value) => handleSystemSettingChange('updateChannel', value)}
                          >
                            <SelectTrigger id="updateChannel">
                              <SelectValue placeholder="Select update channel" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="stable">Stable (Recommended)</SelectItem>
                              <SelectItem value="beta">Beta</SelectItem>
                              <SelectItem value="dev">Development</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">System Mode</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                            <p className="text-xs text-gray-500">When enabled, only administrators can access the system</p>
                          </div>
                          <Switch 
                            id="maintenanceMode" 
                            checked={systemSettings.maintenanceMode}
                            onCheckedChange={(checked) => handleSystemSettingChange('maintenanceMode', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="debugMode">Debug Mode</Label>
                            <p className="text-xs text-gray-500">Enable detailed logging and error messages</p>
                          </div>
                          <Switch 
                            id="debugMode" 
                            checked={systemSettings.debugMode}
                            onCheckedChange={(checked) => handleSystemSettingChange('debugMode', checked)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Data Settings</h3>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <Label htmlFor="dataRetentionDays">Data Retention (days)</Label>
                            <span className="text-sm">{systemSettings.dataRetentionDays} days</span>
                          </div>
                          <Slider
                            id="dataRetentionDays"
                            min={30}
                            max={730}
                            step={30}
                            value={[systemSettings.dataRetentionDays]}
                            onValueChange={(value) => handleSystemSettingChange('dataRetentionDays', value[0])}
                          />
                          <p className="text-xs text-gray-500">How long to keep logs and temporary data</p>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <Label htmlFor="maxUploadSize">Max Upload Size (MB)</Label>
                            <span className="text-sm">{systemSettings.maxUploadSize} MB</span>
                          </div>
                          <Slider
                            id="maxUploadSize"
                            min={5}
                            max={200}
                            step={5}
                            value={[systemSettings.maxUploadSize]}
                            onValueChange={(value) => handleSystemSettingChange('maxUploadSize', value[0])}
                          />
                          <p className="text-xs text-gray-500">Maximum file size for uploads</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Session Settings</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                          <span className="text-sm">{systemSettings.sessionTimeout} min</span>
                        </div>
                        <Slider
                          id="sessionTimeout"
                          min={5}
                          max={120}
                          step={5}
                          value={[systemSettings.sessionTimeout]}
                          onValueChange={(value) => handleSystemSettingChange('sessionTimeout', value[0])}
                        />
                        <p className="text-xs text-gray-500">Automatically log out after period of inactivity</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Check for Updates</h3>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={handleCheckUpdate}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" /> Check for Updates
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">Last checked: Today at 9:45 AM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Backup & Restore</CardTitle>
                  <CardDescription>Manage system backups and restoration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Backup Settings</h3>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <Label htmlFor="backupFrequency">Backup Frequency</Label>
                          <Select 
                            value={systemSettings.backupFrequency}
                            onValueChange={(value) => handleSystemSettingChange('backupFrequency', value)}
                          >
                            <SelectTrigger id="backupFrequency">
                              <SelectValue placeholder="Select backup frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">Hourly</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="manual">Manual Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <Label htmlFor="backupRetention">Backup Retention (days)</Label>
                            <span className="text-sm">{systemSettings.backupRetention} days</span>
                          </div>
                          <Slider
                            id="backupRetention"
                            min={7}
                            max={365}
                            step={7}
                            value={[systemSettings.backupRetention]}
                            onValueChange={(value) => handleSystemSettingChange('backupRetention', value[0])}
                          />
                          <p className="text-xs text-gray-500">How long to keep automatic backups</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Backup Status</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Last Backup:</span>
                          <span className="text-sm">{formatTimestamp(systemSettings.lastBackup)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Next Scheduled Backup:</span>
                          <span className="text-sm">{formatTimestamp(systemSettings.nextBackup)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Backup Storage:</span>
                          <span className="text-sm">Cloud Storage (AWS S3)</span>
                        </div>
                        <Button 
                          className="w-full mt-2 bg-[#014585] hover:bg-[#013a70]" 
                          onClick={handleManualBackup}
                        >
                          <Database className="mr-2 h-4 w-4" /> Create Manual Backup
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-4">Recent Backups</h3>
                    <div className="space-y-3">
                      {backupHistory.map((backup) => (
                        <div key={backup.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center space-x-4">
                            <Badge className={`${getBackupStatusBadgeColor(backup.status)} flex items-center space-x-1`}>
                              {getBackupStatusIcon(backup.status)}
                              <span>{backup.status === "in_progress" ? "In Progress" : backup.status === "success" ? "Success" : "Failed"}</span>
                            </Badge>
                            <div>
                              <p className="text-sm font-medium">{formatTimestamp(backup.date)}</p>
                              <p className="text-xs text-gray-500">{backup.type === "automatic" ? "Automatic" : "Manual"} • {backup.size} • {backup.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8" 
                              onClick={() => handleRestoreBackup(backup.id)}
                              disabled={backup.status === "in_progress"}
                            >
                              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Restore
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8" 
                              onClick={() => handleDownloadBackup(backup.id)}
                              disabled={backup.status === "in_progress"}
                            >
                              <Download className="h-3.5 w-3.5 mr-1" /> Download
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 text-red-500 hover:text-red-600" 
                              onClick={() => handleDeleteBackup(backup.id)}
                              disabled={backup.status === "in_progress"}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Theme & Display</CardTitle>
                  <CardDescription>Customize the look and feel of the application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Theme</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                          <div 
                            className={`flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer ${appearanceSettings.theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                            onClick={() => handleAppearanceSettingChange('theme', 'light')}
                          >
                            <div className="w-full h-12 bg-white rounded-md border border-gray-200 mb-2"></div>
                            <span className="text-xs font-medium">Light</span>
                          </div>
                          <div 
                            className={`flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer ${appearanceSettings.theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                            onClick={() => handleAppearanceSettingChange('theme', 'dark')}
                          >
                            <div className="w-full h-12 bg-gray-900 rounded-md border border-gray-700 mb-2"></div>
                            <span className="text-xs font-medium">Dark</span>
                          </div>
                          <div 
                            className={`flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer ${appearanceSettings.theme === 'system' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                            onClick={() => handleAppearanceSettingChange('theme', 'system')}
                          >
                            <div className="w-full h-12 bg-gradient-to-r from-white to-gray-900 rounded-md border border-gray-200 mb-2"></div>
                            <span className="text-xs font-medium">System</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Accent Color</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-5 gap-2">
                          <div 
                            className={`w-full h-10 bg-blue-500 rounded-md cursor-pointer ${appearanceSettings.accentColor === 'blue' ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                            onClick={() => handleAppearanceSettingChange('accentColor', 'blue')}
                          ></div>
                          <div 
                            className={`w-full h-10 bg-green-500 rounded-md cursor-pointer ${appearanceSettings.accentColor === 'green' ? 'ring-2 ring-offset-2 ring-green-500' : ''}`}
                            onClick={() => handleAppearanceSettingChange('accentColor', 'green')}
                          ></div>
                          <div 
                            className={`w-full h-10 bg-purple-500 rounded-md cursor-pointer ${appearanceSettings.accentColor === 'purple' ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`}
                            onClick={() => handleAppearanceSettingChange('accentColor', 'purple')}
                          ></div>
                          <div 
                            className={`w-full h-10 bg-red-500 rounded-md cursor-pointer ${appearanceSettings.accentColor === 'red' ? 'ring-2 ring-offset-2 ring-red-500' : ''}`}
                            onClick={() => handleAppearanceSettingChange('accentColor', 'red')}
                          ></div>
                          <div 
                            className={`w-full h-10 bg-amber-500 rounded-md cursor-pointer ${appearanceSettings.accentColor === 'amber' ? 'ring-2 ring-offset-2 ring-amber-500' : ''}`}
                            onClick={() => handleAppearanceSettingChange('accentColor', 'amber')}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Layout Options</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="sidebarCollapsed">Collapsed Sidebar</Label>
                            <p className="text-xs text-gray-500">Use icons-only sidebar to maximize screen space</p>
                          </div>
                          <Switch 
                            id="sidebarCollapsed" 
                            checked={appearanceSettings.sidebarCollapsed}
                            onCheckedChange={(checked) => handleAppearanceSettingChange('sidebarCollapsed', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="denseMode">Dense Mode</Label>
                            <p className="text-xs text-gray-500">Reduce spacing to fit more content on screen</p>
                          </div>
                          <Switch 
                            id="denseMode" 
                            checked={appearanceSettings.denseMode}
                            onCheckedChange={(checked) => handleAppearanceSettingChange('denseMode', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="animationsEnabled">Enable Animations</Label>
                            <p className="text-xs text-gray-500">Use animations for smoother transitions</p>
                          </div>
                          <Switch 
                            id="animationsEnabled" 
                            checked={appearanceSettings.animationsEnabled}
                            onCheckedChange={(checked) => handleAppearanceSettingChange('animationsEnabled', checked)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Text & Format</h3>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <Label htmlFor="fontScale">Font Size</Label>
                            <span className="text-sm">{appearanceSettings.fontScale}x</span>
                          </div>
                          <Slider
                            id="fontScale"
                            min={0.8}
                            max={1.4}
                            step={0.1}
                            value={[appearanceSettings.fontScale]}
                            onValueChange={(value) => handleAppearanceSettingChange('fontScale', value[0])}
                          />
                          <p className="text-xs text-gray-500">Adjust the text size throughout the application</p>
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="dateFormat">Date Format</Label>
                          <Select 
                            value={appearanceSettings.dateFormat}
                            onValueChange={(value) => handleAppearanceSettingChange('dateFormat', value)}
                          >
                            <SelectTrigger id="dateFormat">
                              <SelectValue placeholder="Select date format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                              <SelectItem value="MMMM D, YYYY">MMMM D, YYYY</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="timeFormat">Time Format</Label>
                          <Select 
                            value={appearanceSettings.timeFormat}
                            onValueChange={(value) => handleAppearanceSettingChange('timeFormat', value)}
                          >
                            <SelectTrigger id="timeFormat">
                              <SelectValue placeholder="Select time format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="12h">12-hour (1:30 PM)</SelectItem>
                              <SelectItem value="24h">24-hour (13:30)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>See how your settings will look</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 p-4 border-b">
                      <h3 className="text-lg font-medium">Dashboard Preview</h3>
                    </div>
                    <div className="p-4 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Total Clinics</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">24</div>
                            <p className="text-xs text-green-600 mt-1">+2 this month</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Active Providers</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">142</div>
                            <p className="text-xs text-green-600 mt-1">+5 this month</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Pending Licenses</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">7</div>
                            <p className="text-xs text-amber-600 mt-1">3 expiring soon</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Channels</CardTitle>
                  <CardDescription>Configure how you receive system notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          <Label htmlFor="emailNotifications">Email Notifications</Label>
                        </div>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <Switch 
                        id="emailNotifications" 
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => handleNotificationSettingChange('emailNotifications', checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <Smartphone className="h-4 w-4 mr-2 text-gray-500" />
                          <Label htmlFor="smsNotifications">SMS Notifications</Label>
                        </div>
                        <p className="text-sm text-gray-500">Receive notifications via text message</p>
                      </div>
                      <Switch 
                        id="smsNotifications" 
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) => handleNotificationSettingChange('smsNotifications', checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <Bell className="h-4 w-4 mr-2 text-gray-500" />
                          <Label htmlFor="inAppNotifications">In-App Notifications</Label>
                        </div>
                        <p className="text-sm text-gray-500">Show notifications within the application</p>
                      </div>
                      <Switch 
                        id="inAppNotifications" 
                        checked={notificationSettings.inAppNotifications}
                        onCheckedChange={(checked) => handleNotificationSettingChange('inAppNotifications', checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <Monitor className="h-4 w-4 mr-2 text-gray-500" />
                          <Label htmlFor="desktopNotifications">Desktop Notifications</Label>
                        </div>
                        <p className="text-sm text-gray-500">Show browser notifications when the app is in background</p>
                      </div>
                      <Switch 
                        id="desktopNotifications" 
                        checked={notificationSettings.desktopNotifications}
                        onCheckedChange={(checked) => handleNotificationSettingChange('desktopNotifications', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Customize which notifications you receive and when</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="criticalAlertsOnly">Critical Alerts Only</Label>
                        <p className="text-sm text-gray-500">Only receive high-priority notifications</p>
                      </div>
                      <Switch 
                        id="criticalAlertsOnly" 
                        checked={notificationSettings.criticalAlertsOnly}
                        onCheckedChange={(checked) => handleNotificationSettingChange('criticalAlertsOnly', checked)}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="digestFrequency">Notification Digest</Label>
                      <Select 
                        value={notificationSettings.digestFrequency}
                        onValueChange={(value) => handleNotificationSettingChange('digestFrequency', value)}
                      >
                        <SelectTrigger id="digestFrequency">
                          <SelectValue placeholder="Select digest frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time (Immediate)</SelectItem>
                          <SelectItem value="hourly">Hourly Summary</SelectItem>
                          <SelectItem value="daily">Daily Summary</SelectItem>
                          <SelectItem value="weekly">Weekly Summary</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-1">How often to receive notification summaries</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="quietHoursEnabled">Quiet Hours</Label>
                          <p className="text-sm text-gray-500">Pause non-critical notifications during specified hours</p>
                        </div>
                        <Switch 
                          id="quietHoursEnabled" 
                          checked={notificationSettings.quietHoursEnabled}
                          onCheckedChange={(checked) => handleNotificationSettingChange('quietHoursEnabled', checked)}
                        />
                      </div>
                      
                      {notificationSettings.quietHoursEnabled && (
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="space-y-1">
                            <Label htmlFor="quietHoursStart">Start Time</Label>
                            <Input 
                              id="quietHoursStart" 
                              type="time" 
                              value={notificationSettings.quietHoursStart}
                              onChange={(e) => handleNotificationSettingChange('quietHoursStart', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="quietHoursEnd">End Time</Label>
                            <Input 
                              id="quietHoursEnd" 
                              type="time" 
                              value={notificationSettings.quietHoursEnd}
                              onChange={(e) => handleNotificationSettingChange('quietHoursEnd', e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Notification Types</CardTitle>
                  <CardDescription>Select which types of notifications you want to receive</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="system_updates" defaultChecked />
                        <Label htmlFor="system_updates">System Updates</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="security_alerts" defaultChecked />
                        <Label htmlFor="security_alerts">Security Alerts</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="license_expiry" defaultChecked />
                        <Label htmlFor="license_expiry">License Expiry</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="new_providers" defaultChecked />
                        <Label htmlFor="new_providers">New Provider Registrations</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="backup_status" defaultChecked />
                        <Label htmlFor="backup_status">Backup Status</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="maintenance_alerts" />
                        <Label htmlFor="maintenance_alerts">Maintenance Alerts</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="report_generation" defaultChecked />
                        <Label htmlFor="report_generation">Report Generation</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="user_login" />
                        <Label htmlFor="user_login">User Login Activity</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Settings</CardTitle>
                  <CardDescription>Configure how users authenticate with the system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Two-Factor Authentication</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="twoFactorAuth">Require Two-Factor Authentication</Label>
                            <p className="text-xs text-gray-500">Add an extra layer of security to user accounts</p>
                          </div>
                          <Switch 
                            id="twoFactorAuth" 
                            checked={securitySettings.twoFactorAuth}
                            onCheckedChange={(checked) => handleSecuritySettingChange('twoFactorAuth', checked)}
                          />
                        </div>
                        
                        {securitySettings.twoFactorAuth && (
                          <div className="space-y-1">
                            <Label htmlFor="twoFactorMethod">Default 2FA Method</Label>
                            <Select 
                              value={securitySettings.twoFactorMethod}
                              onValueChange={(value) => handleSecuritySettingChange('twoFactorMethod', value)}
                            >
                              <SelectTrigger id="twoFactorMethod">
                                <SelectValue placeholder="Select 2FA method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="app">Authenticator App</SelectItem>
                                <SelectItem value="sms">SMS</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Session Management</h3>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <Label htmlFor="sessionConcurrency">Concurrent Sessions</Label>
                          <Select 
                            value={securitySettings.sessionConcurrency}
                            onValueChange={(value) => handleSecuritySettingChange('sessionConcurrency', value)}
                          >
                            <SelectTrigger id="sessionConcurrency">
                              <SelectValue placeholder="Select session policy" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single">Single Session Only</SelectItem>
                              <SelectItem value="multiple">Allow Multiple Sessions</SelectItem>
                              <SelectItem value="limited">Limited (Max 3 Sessions)</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500 mt-1">Control how many active sessions a user can have</p>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <Label htmlFor="loginAttempts">Failed Login Attempts</Label>
                            <span className="text-sm">{securitySettings.loginAttempts}</span>
                          </div>
                          <Slider
                            id="loginAttempts"
                            min={3}
                            max={10}
                            step={1}
                            value={[securitySettings.loginAttempts]}
                            onValueChange={(value) => handleSecuritySettingChange('loginAttempts', value[0])}
                          />
                          <p className="text-xs text-gray-500">Number of failed attempts before account lockout</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Password Policy</h3>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                            <span className="text-sm">{securitySettings.passwordExpiry} days</span>
                          </div>
                          <Slider
                            id="passwordExpiry"
                            min={0}
                            max={180}
                            step={30}
                            value={[securitySettings.passwordExpiry]}
                            onValueChange={(value) => handleSecuritySettingChange('passwordExpiry', value[0])}
                          />
                          <p className="text-xs text-gray-500">Days until password must be changed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}