"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
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
  Mail,
  Phone,
  Calendar,
  Lock,
  Key,
  Bell as BellIcon,
  Eye,
  EyeOff,
  Save,
  Upload,
  Edit,
  Clock,
  Shield as ShieldIcon,
  FileText,
  Activity,
  AlertTriangle,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function AdminProfilePage() {
  const { user, logout } = useAuth()
  
  // State untuk mode edit
  const [isEditing, setIsEditing] = useState(false)
  
  // State untuk data profil
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@kineticrehab.com",
    phone: "+1 (555) 123-4567",
    role: "System Administrator",
    department: "IT Administration",
    joinDate: "2022-03-15",
    lastLogin: "2023-11-15T08:30:45",
    avatar: "/admin-avatar.png",
    bio: "Experienced system administrator with over 10 years in healthcare IT management. Responsible for overseeing the Kinetic Rehab platform and ensuring smooth operations across all clinics."
  })
  
  // State untuk form data
  const [formData, setFormData] = useState({
    ...profile
  })
  
  // State untuk pengaturan notifikasi
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    systemAlerts: true,
    securityAlerts: true,
    maintenanceAlerts: false,
    weeklyReports: true,
    monthlyReports: true
  })
  
  // State untuk pengaturan keamanan
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: "30", // dalam menit
    passwordLastChanged: "2023-10-01",
    passwordExpiry: "2024-01-01"
  })
  
  // State untuk menampilkan password
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // State untuk form password
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  
  // State untuk riwayat aktivitas
  const [activityHistory, setActivityHistory] = useState([
    {
      id: 1,
      action: "Login",
      timestamp: "2023-11-15T08:30:45",
      ipAddress: "192.168.1.45",
      device: "Chrome on Windows",
      location: "New York, USA"
    },
    {
      id: 2,
      action: "Updated Provider License",
      timestamp: "2023-11-14T15:22:10",
      ipAddress: "192.168.1.45",
      device: "Chrome on Windows",
      location: "New York, USA"
    },
    {
      id: 3,
      action: "Added New Clinic",
      timestamp: "2023-11-14T11:05:33",
      ipAddress: "192.168.1.45",
      device: "Chrome on Windows",
      location: "New York, USA"
    },
    {
      id: 4,
      action: "Generated Monthly Report",
      timestamp: "2023-11-13T16:40:22",
      ipAddress: "192.168.1.45",
      device: "Chrome on Windows",
      location: "New York, USA"
    },
    {
      id: 5,
      action: "Login",
      timestamp: "2023-11-13T09:15:30",
      ipAddress: "192.168.1.45",
      device: "Chrome on Windows",
      location: "New York, USA"
    },
    {
      id: 6,
      action: "Password Changed",
      timestamp: "2023-10-01T14:22:15",
      ipAddress: "192.168.1.45",
      device: "Chrome on Windows",
      location: "New York, USA"
    },
  ])
  
  // Handler untuk mengubah mode edit
  const handleEditToggle = () => {
    if (isEditing) {
      // Jika sedang dalam mode edit dan ingin menyimpan
      setProfile(formData)
      setIsEditing(false)
    } else {
      // Jika ingin masuk mode edit
      setFormData({...profile})
      setIsEditing(true)
    }
  }
  
  // Handler untuk perubahan form
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Handler untuk perubahan pengaturan notifikasi
  const handleNotificationChange = (key: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }))
  }
  
  // Handler untuk perubahan pengaturan keamanan
  const handleSecurityChange = (key: string, value: string | boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }))
  }
  
  // Handler untuk perubahan form password
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Handler untuk submit form password
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New password and confirmation do not match!")
      return
    }
    
    // Simulasi perubahan password
    alert("Password changed successfully!")
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
    
    // Update tanggal perubahan password
    const today = new Date()
    const expiryDate = new Date()
    expiryDate.setMonth(expiryDate.getMonth() + 3) // Password berlaku 3 bulan
    
    setSecuritySettings(prev => ({
      ...prev,
      passwordLastChanged: today.toISOString().split('T')[0],
      passwordExpiry: expiryDate.toISOString().split('T')[0]
    }))
    
    // Tambahkan ke riwayat aktivitas
    const newActivity = {
      id: activityHistory.length + 1,
      action: "Password Changed",
      timestamp: new Date().toISOString(),
      ipAddress: "192.168.1.45",
      device: "Chrome on Windows",
      location: "New York, USA"
    }
    
    setActivityHistory([newActivity, ...activityHistory])
  }
  
  // Handler untuk upload avatar
  const handleAvatarUpload = () => {
    alert("Avatar upload feature coming soon!")
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
  
  // Menghitung waktu tersisa hingga password expired
  const calculatePasswordExpiryDays = () => {
    const today = new Date()
    const expiryDate = new Date(securitySettings.passwordExpiry)
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
  
  const passwordExpiryDays = calculatePasswordExpiryDays()

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
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white"
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
              <h1 className="text-2xl font-bold text-[#111827]">My Profile</h1>
              <p className="text-gray-500">Manage your account information and settings</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                className={isEditing ? "bg-green-600 hover:bg-green-700" : "bg-[#014585] hover:bg-[#013a70]"} 
                onClick={handleEditToggle}
              >
                {isEditing ? (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader className="text-center pb-2">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                      <AvatarImage src={profile.avatar} alt={`${profile.firstName} ${profile.lastName}`} />
                      <AvatarFallback className="text-2xl bg-[#014585] text-white">
                        {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button 
                        size="icon" 
                        className="absolute bottom-0 right-0 rounded-full bg-[#014585] hover:bg-[#013a70] h-8 w-8"
                        onClick={handleAvatarUpload}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <CardTitle className="mt-4 text-xl">
                    {profile.firstName} {profile.lastName}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {profile.role}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mt-2">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">{profile.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">{profile.department}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">Joined {formatDate(profile.joinDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">Last login: {formatTimestamp(profile.lastLogin)}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">About</h4>
                  <p className="text-sm text-gray-600">{profile.bio}</p>
                </div>
              </CardContent>
            </Card>

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
                
                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            name="firstName" 
                            value={isEditing ? formData.firstName : profile.firstName} 
                            onChange={handleFormChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            name="lastName" 
                            value={isEditing ? formData.lastName : profile.lastName} 
                            onChange={handleFormChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={isEditing ? formData.email : profile.email} 
                            onChange={handleFormChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={isEditing ? formData.phone : profile.phone} 
                            onChange={handleFormChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea 
                            id="bio" 
                            name="bio" 
                            rows={4} 
                            value={isEditing ? formData.bio : profile.bio} 
                            onChange={handleFormChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Manage how you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="emailAlerts">Email Alerts</Label>
                            <p className="text-sm text-gray-500">Receive notifications via email</p>
                          </div>
                          <Switch 
                            id="emailAlerts" 
                            checked={notificationSettings.emailAlerts}
                            onCheckedChange={() => handleNotificationChange('emailAlerts')}
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="systemAlerts">System Alerts</Label>
                            <p className="text-sm text-gray-500">Notifications about system updates and changes</p>
                          </div>
                          <Switch 
                            id="systemAlerts" 
                            checked={notificationSettings.systemAlerts}
                            onCheckedChange={() => handleNotificationChange('systemAlerts')}
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="securityAlerts">Security Alerts</Label>
                            <p className="text-sm text-gray-500">Notifications about security events and login attempts</p>
                          </div>
                          <Switch 
                            id="securityAlerts" 
                            checked={notificationSettings.securityAlerts}
                            onCheckedChange={() => handleNotificationChange('securityAlerts')}
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="maintenanceAlerts">Maintenance Alerts</Label>
                            <p className="text-sm text-gray-500">Notifications about scheduled maintenance</p>
                          </div>
                          <Switch 
                            id="maintenanceAlerts" 
                            checked={notificationSettings.maintenanceAlerts}
                            onCheckedChange={() => handleNotificationChange('maintenanceAlerts')}
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="weeklyReports">Weekly Reports</Label>
                            <p className="text-sm text-gray-500">Receive weekly summary reports</p>
                          </div>
                          <Switch 
                            id="weeklyReports" 
                            checked={notificationSettings.weeklyReports}
                            onCheckedChange={() => handleNotificationChange('weeklyReports')}
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="monthlyReports">Monthly Reports</Label>
                            <p className="text-sm text-gray-500">Receive monthly detailed reports</p>
                          </div>
                          <Switch 
                            id="monthlyReports" 
                            checked={notificationSettings.monthlyReports}
                            onCheckedChange={() => handleNotificationChange('monthlyReports')}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Security Tab */}
                <TabsContent value="security" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>Update your password to maintain account security</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative">
                            <Input 
                              id="currentPassword" 
                              name="currentPassword" 
                              type={showPassword ? "text" : "password"} 
                              value={passwordForm.currentPassword} 
                              onChange={handlePasswordChange}
                              required
                            />
                            <button 
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Input 
                              id="newPassword" 
                              name="newPassword" 
                              type={showNewPassword ? "text" : "password"} 
                              value={passwordForm.newPassword} 
                              onChange={handlePasswordChange}
                              required
                            />
                            <button 
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500">Password must be at least 8 characters and include uppercase, lowercase, number, and special character</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <div className="relative">
                            <Input 
                              id="confirmPassword" 
                              name="confirmPassword" 
                              type={showConfirmPassword ? "text" : "password"} 
                              value={passwordForm.confirmPassword} 
                              onChange={handlePasswordChange}
                              required
                            />
                            <button 
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <Button type="submit" className="bg-[#014585] hover:bg-[#013a70]">
                          <Key className="mr-2 h-4 w-4" /> Update Password
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>Manage your account security preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                          </div>
                          <Switch 
                            id="twoFactorAuth" 
                            checked={securitySettings.twoFactorAuth}
                            onCheckedChange={(checked) => handleSecurityChange('twoFactorAuth', checked)}
                          />
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                          <Input 
                            id="sessionTimeout" 
                            type="number" 
                            min="5" 
                            max="120" 
                            value={securitySettings.sessionTimeout} 
                            onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                          />
                          <p className="text-xs text-gray-500">Automatically log out after period of inactivity</p>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Password Status</h4>
                          <div className="flex flex-col space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Last changed:</span>
                              <span className="text-sm">{formatDate(securitySettings.passwordLastChanged)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Expires on:</span>
                              <span className="text-sm">{formatDate(securitySettings.passwordExpiry)}</span>
                            </div>
                            <div className="flex items-center">
                              {passwordExpiryDays <= 0 ? (
                                <div className="flex items-center text-red-600">
                                  <AlertTriangle className="h-4 w-4 mr-1" />
                                  <span className="text-sm">Password expired</span>
                                </div>
                              ) : passwordExpiryDays <= 7 ? (
                                <div className="flex items-center text-amber-600">
                                  <AlertTriangle className="h-4 w-4 mr-1" />
                                  <span className="text-sm">{passwordExpiryDays} days until password expires</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-green-600">
                                  <ShieldIcon className="h-4 w-4 mr-1" />
                                  <span className="text-sm">{passwordExpiryDays} days until password expires</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Activity Tab */}
                <TabsContent value="activity" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your recent account activity and login history</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {activityHistory.map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                            <div className="mt-0.5">
                              {activity.action.includes("Login") ? (
                                <User className="h-5 w-5 text-blue-500" />
                              ) : activity.action.includes("Password") ? (
                                <Lock className="h-5 w-5 text-amber-500" />
                              ) : activity.action.includes("Report") ? (
                                <FileText className="h-5 w-5 text-green-500" />
                              ) : (
                                <Activity className="h-5 w-5 text-purple-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="text-sm font-medium">{activity.action}</h4>
                                <span className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</span>
                              </div>
                              <div className="mt-1 text-xs text-gray-500">
                                <div className="flex items-center space-x-4">
                                  <span>IP: {activity.ipAddress}</span>
                                  <span>{activity.device}</span>
                                  <span>{activity.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}