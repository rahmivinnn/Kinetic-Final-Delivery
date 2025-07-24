"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
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
  Settings,
  Bell,
  Shield,
  Palette,
  Globe,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  MessageSquare,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  User,
  Clock,
  Calendar,
  Languages,
  Zap,
  Database,
  Wifi,
  Bluetooth,
  Camera,
  Mic,
  Speaker,
  Monitor,
  HardDrive,
  Cpu,
  MemoryStick,
  Battery,
  Power,
  CheckCircle,
  AlertTriangle,
  Info,
  X
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  // State untuk pengaturan umum
  const [generalSettings, setGeneralSettings] = useState({
    language: "en",
    timezone: "UTC-7",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    autoSave: true,
    autoSync: true,
    offlineMode: false,
    dataUsage: "normal",
    cacheSize: 500, // MB
    sessionTimeout: 30, // minutes
  })
  
  // State untuk pengaturan tampilan
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    accentColor: "blue",
    fontSize: 14,
    fontFamily: "system",
    sidebarCollapsed: false,
    compactMode: false,
    animationsEnabled: true,
    highContrast: false,
    reducedMotion: false,
    colorBlindMode: "none",
  })
  
  // State untuk pengaturan notifikasi
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    inAppNotifications: true,
    desktopNotifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    quietHours: false,
    quietStart: "22:00",
    quietEnd: "07:00",
    appointmentReminders: true,
    exerciseReminders: true,
    medicationReminders: true,
    progressUpdates: true,
    systemAlerts: true,
    marketingEmails: false,
    weeklyDigest: true,
    monthlyReport: true,
  })
  
  // State untuk pengaturan privasi
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "private",
    shareProgress: false,
    shareExercises: false,
    allowAnalytics: true,
    allowCookies: true,
    allowLocationTracking: false,
    allowCameraAccess: true,
    allowMicrophoneAccess: true,
    allowNotificationAccess: true,
    dataRetention: "1year",
    autoDeleteInactive: false,
    twoFactorAuth: false,
    loginAlerts: true,
    deviceTracking: true,
  })
  
  // State untuk pengaturan perangkat
  const [deviceSettings, setDeviceSettings] = useState({
    cameraQuality: "high",
    microphoneGain: 75,
    speakerVolume: 80,
    screenBrightness: 70,
    autoRotation: true,
    hapticFeedback: true,
    gestureControls: true,
    voiceCommands: false,
    bluetoothEnabled: true,
    wifiAutoConnect: true,
    locationServices: true,
    backgroundRefresh: true,
    lowPowerMode: false,
    developerMode: false,
  })
  
  // State untuk pengaturan backup
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    backupLocation: "cloud",
    includeMedia: true,
    includeSettings: true,
    includeProgress: true,
    includeMessages: false,
    encryptBackup: true,
    lastBackup: "2023-11-14T15:30:00",
    nextBackup: "2023-11-15T15:30:00",
    backupSize: "2.3 GB",
    availableSpace: "47.2 GB",
  })
  
  // State untuk dialog reset
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  
  // Handler functions
  const handleGeneralSettingChange = (key: string, value: any) => {
    setGeneralSettings(prev => ({ ...prev, [key]: value }))
    toast({
      title: "Setting Updated",
      description: `${key} has been updated successfully.`,
      duration: 2000,
    })
  }
  
  const handleAppearanceSettingChange = (key: string, value: any) => {
    setAppearanceSettings(prev => ({ ...prev, [key]: value }))
    toast({
      title: "Appearance Updated",
      description: `${key} has been updated successfully.`,
      duration: 2000,
    })
  }
  
  const handleNotificationSettingChange = (key: string, value: any) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }))
    toast({
      title: "Notification Setting Updated",
      description: `${key} has been updated successfully.`,
      duration: 2000,
    })
  }
  
  const handlePrivacySettingChange = (key: string, value: any) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }))
    toast({
      title: "Privacy Setting Updated",
      description: `${key} has been updated successfully.`,
      duration: 2000,
    })
  }
  
  const handleDeviceSettingChange = (key: string, value: any) => {
    setDeviceSettings(prev => ({ ...prev, [key]: value }))
    toast({
      title: "Device Setting Updated",
      description: `${key} has been updated successfully.`,
      duration: 2000,
    })
  }
  
  const handleBackupSettingChange = (key: string, value: any) => {
    setBackupSettings(prev => ({ ...prev, [key]: value }))
    toast({
      title: "Backup Setting Updated",
      description: `${key} has been updated successfully.`,
      duration: 2000,
    })
  }
  
  const handleSaveAllSettings = () => {
    // Simulate API call to save all settings
    toast({
      title: "All Settings Saved",
      description: "Your preferences have been saved successfully.",
      action: <ToastAction altText="Close">Close</ToastAction>,
    })
  }
  
  const handleResetSettings = () => {
    // Reset all settings to default
    setGeneralSettings({
      language: "en",
      timezone: "UTC-7",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
      autoSave: true,
      autoSync: true,
      offlineMode: false,
      dataUsage: "normal",
      cacheSize: 500,
      sessionTimeout: 30,
    })
    
    setAppearanceSettings({
      theme: "light",
      accentColor: "blue",
      fontSize: 14,
      fontFamily: "system",
      sidebarCollapsed: false,
      compactMode: false,
      animationsEnabled: true,
      highContrast: false,
      reducedMotion: false,
      colorBlindMode: "none",
    })
    
    setNotificationSettings({
      pushNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
      inAppNotifications: true,
      desktopNotifications: true,
      soundEnabled: true,
      vibrationEnabled: true,
      quietHours: false,
      quietStart: "22:00",
      quietEnd: "07:00",
      appointmentReminders: true,
      exerciseReminders: true,
      medicationReminders: true,
      progressUpdates: true,
      systemAlerts: true,
      marketingEmails: false,
      weeklyDigest: true,
      monthlyReport: true,
    })
    
    setPrivacySettings({
      profileVisibility: "private",
      shareProgress: false,
      shareExercises: false,
      allowAnalytics: true,
      allowCookies: true,
      allowLocationTracking: false,
      allowCameraAccess: true,
      allowMicrophoneAccess: true,
      allowNotificationAccess: true,
      dataRetention: "1year",
      autoDeleteInactive: false,
      twoFactorAuth: false,
      loginAlerts: true,
      deviceTracking: true,
    })
    
    setDeviceSettings({
      cameraQuality: "high",
      microphoneGain: 75,
      speakerVolume: 80,
      screenBrightness: 70,
      autoRotation: true,
      hapticFeedback: true,
      gestureControls: true,
      voiceCommands: false,
      bluetoothEnabled: true,
      wifiAutoConnect: true,
      locationServices: true,
      backgroundRefresh: true,
      lowPowerMode: false,
      developerMode: false,
    })
    
    setBackupSettings({
      autoBackup: true,
      backupFrequency: "daily",
      backupLocation: "cloud",
      includeMedia: true,
      includeSettings: true,
      includeProgress: true,
      includeMessages: false,
      encryptBackup: true,
      lastBackup: "2023-11-14T15:30:00",
      nextBackup: "2023-11-15T15:30:00",
      backupSize: "2.3 GB",
      availableSpace: "47.2 GB",
    })
    
    setResetDialogOpen(false)
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
      action: <ToastAction altText="Close">Close</ToastAction>,
    })
  }
  
  const handleExportSettings = () => {
    // Simulate exporting settings
    const settingsData = {
      general: generalSettings,
      appearance: appearanceSettings,
      notifications: notificationSettings,
      privacy: privacySettings,
      device: deviceSettings,
      backup: backupSettings,
      exportDate: new Date().toISOString(),
      version: "1.0"
    }
    
    const dataStr = JSON.stringify(settingsData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `kinetic-rehab-settings-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    setExportDialogOpen(false)
    toast({
      title: "Settings Exported",
      description: "Your settings have been exported successfully.",
      action: <ToastAction altText="Close">Close</ToastAction>,
    })
  }
  
  const handleImportSettings = () => {
    // Simulate importing settings
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const settingsData = JSON.parse(e.target?.result as string)
            
            if (settingsData.general) setGeneralSettings(settingsData.general)
            if (settingsData.appearance) setAppearanceSettings(settingsData.appearance)
            if (settingsData.notifications) setNotificationSettings(settingsData.notifications)
            if (settingsData.privacy) setPrivacySettings(settingsData.privacy)
            if (settingsData.device) setDeviceSettings(settingsData.device)
            if (settingsData.backup) setBackupSettings(settingsData.backup)
            
            toast({
              title: "Settings Imported",
              description: "Your settings have been imported successfully.",
              action: <ToastAction altText="Close">Close</ToastAction>,
            })
          } catch (error) {
            toast({
              title: "Import Failed",
              description: "Failed to import settings. Please check the file format.",
              variant: "destructive",
            })
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
    setImportDialogOpen(false)
  }
  
  const handleBackupNow = () => {
    // Simulate backup process
    toast({
      title: "Backup Started",
      description: "Creating backup of your data...",
      duration: 2000,
    })
    
    setTimeout(() => {
      setBackupSettings(prev => ({
        ...prev,
        lastBackup: new Date().toISOString(),
        nextBackup: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }))
      
      toast({
        title: "Backup Complete",
        description: "Your data has been backed up successfully.",
        action: <ToastAction altText="Close">Close</ToastAction>,
      })
    }, 3000)
  }
  
  const handleRestoreBackup = () => {
    // Simulate restore process
    toast({
      title: "Restore Started",
      description: "Restoring data from backup...",
      duration: 2000,
    })
    
    setTimeout(() => {
      toast({
        title: "Restore Complete",
        description: "Your data has been restored successfully.",
        action: <ToastAction altText="Close">Close</ToastAction>,
      })
    }, 3000)
  }

  return (
    <DashboardLayout activeLink="settings">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your application preferences and configurations</p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Settings</DialogTitle>
                  <DialogDescription>
                    Export your current settings to a JSON file for backup or transfer.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleExportSettings}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Settings</DialogTitle>
                  <DialogDescription>
                    Import settings from a previously exported JSON file.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleImportSettings}>
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button onClick={handleSaveAllSettings} className="bg-[#014585] hover:bg-[#013a70]">
              <Save className="mr-2 h-4 w-4" />
              Save All
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="device">Device</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Language & Region
                </CardTitle>
                <CardDescription>
                  Configure your language and regional preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={generalSettings.language}
                      onValueChange={(value) => handleGeneralSettingChange('language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="it">Italiano</SelectItem>
                        <SelectItem value="pt">Português</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                        <SelectItem value="ko">한국어</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={generalSettings.timezone}
                      onValueChange={(value) => handleGeneralSettingChange('timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-12">UTC-12 (Baker Island)</SelectItem>
                        <SelectItem value="UTC-11">UTC-11 (American Samoa)</SelectItem>
                        <SelectItem value="UTC-10">UTC-10 (Hawaii)</SelectItem>
                        <SelectItem value="UTC-9">UTC-9 (Alaska)</SelectItem>
                        <SelectItem value="UTC-8">UTC-8 (Pacific Time)</SelectItem>
                        <SelectItem value="UTC-7">UTC-7 (Mountain Time)</SelectItem>
                        <SelectItem value="UTC-6">UTC-6 (Central Time)</SelectItem>
                        <SelectItem value="UTC-5">UTC-5 (Eastern Time)</SelectItem>
                        <SelectItem value="UTC-4">UTC-4 (Atlantic Time)</SelectItem>
                        <SelectItem value="UTC-3">UTC-3 (Argentina)</SelectItem>
                        <SelectItem value="UTC-2">UTC-2 (South Georgia)</SelectItem>
                        <SelectItem value="UTC-1">UTC-1 (Azores)</SelectItem>
                        <SelectItem value="UTC+0">UTC+0 (London)</SelectItem>
                        <SelectItem value="UTC+1">UTC+1 (Central Europe)</SelectItem>
                        <SelectItem value="UTC+2">UTC+2 (Eastern Europe)</SelectItem>
                        <SelectItem value="UTC+3">UTC+3 (Moscow)</SelectItem>
                        <SelectItem value="UTC+4">UTC+4 (Dubai)</SelectItem>
                        <SelectItem value="UTC+5">UTC+5 (Pakistan)</SelectItem>
                        <SelectItem value="UTC+6">UTC+6 (Bangladesh)</SelectItem>
                        <SelectItem value="UTC+7">UTC+7 (Thailand)</SelectItem>
                        <SelectItem value="UTC+8">UTC+8 (China)</SelectItem>
                        <SelectItem value="UTC+9">UTC+9 (Japan)</SelectItem>
                        <SelectItem value="UTC+10">UTC+10 (Australia East)</SelectItem>
                        <SelectItem value="UTC+11">UTC+11 (Solomon Islands)</SelectItem>
                        <SelectItem value="UTC+12">UTC+12 (New Zealand)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select
                      value={generalSettings.dateFormat}
                      onValueChange={(value) => handleGeneralSettingChange('dateFormat', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
                        <SelectItem value="MM-DD-YYYY">MM-DD-YYYY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeFormat">Time Format</Label>
                    <Select
                      value={generalSettings.timeFormat}
                      onValueChange={(value) => handleGeneralSettingChange('timeFormat', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                        <SelectItem value="24h">24 Hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance & Data
                </CardTitle>
                <CardDescription>
                  Configure performance and data usage settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Save</Label>
                    <p className="text-sm text-muted-foreground">Automatically save changes</p>
                  </div>
                  <Switch
                    checked={generalSettings.autoSave}
                    onCheckedChange={(checked) => handleGeneralSettingChange('autoSave', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Sync</Label>
                    <p className="text-sm text-muted-foreground">Sync data across devices</p>
                  </div>
                  <Switch
                    checked={generalSettings.autoSync}
                    onCheckedChange={(checked) => handleGeneralSettingChange('autoSync', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Offline Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable offline functionality</p>
                  </div>
                  <Switch
                    checked={generalSettings.offlineMode}
                    onCheckedChange={(checked) => handleGeneralSettingChange('offlineMode', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data Usage</Label>
                  <Select
                    value={generalSettings.dataUsage}
                    onValueChange={(value) => handleGeneralSettingChange('dataUsage', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Save data)</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High (Best quality)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cache Size: {generalSettings.cacheSize} MB</Label>
                  <Slider
                    value={[generalSettings.cacheSize]}
                    onValueChange={([value]) => handleGeneralSettingChange('cacheSize', value)}
                    max={2000}
                    min={100}
                    step={50}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Session Timeout: {generalSettings.sessionTimeout} minutes</Label>
                  <Slider
                    value={[generalSettings.sessionTimeout]}
                    onValueChange={([value]) => handleGeneralSettingChange('sessionTimeout', value)}
                    max={120}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Theme & Colors
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={appearanceSettings.theme}
                    onValueChange={(value) => handleAppearanceSettingChange('theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <Select
                    value={appearanceSettings.accentColor}
                    onValueChange={(value) => handleAppearanceSettingChange('accentColor', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="pink">Pink</SelectItem>
                      <SelectItem value="teal">Teal</SelectItem>
                      <SelectItem value="indigo">Indigo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Font Size: {appearanceSettings.fontSize}px</Label>
                  <Slider
                    value={[appearanceSettings.fontSize]}
                    onValueChange={([value]) => handleAppearanceSettingChange('fontSize', value)}
                    max={24}
                    min={10}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select
                    value={appearanceSettings.fontFamily}
                    onValueChange={(value) => handleAppearanceSettingChange('fontFamily', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System Default</SelectItem>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="opensans">Open Sans</SelectItem>
                      <SelectItem value="lato">Lato</SelectItem>
                      <SelectItem value="montserrat">Montserrat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Display Options
                </CardTitle>
                <CardDescription>
                  Configure display and layout preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sidebar Collapsed</Label>
                    <p className="text-sm text-muted-foreground">Start with sidebar collapsed</p>
                  </div>
                  <Switch
                    checked={appearanceSettings.sidebarCollapsed}
                    onCheckedChange={(checked) => handleAppearanceSettingChange('sidebarCollapsed', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">Use compact layout</p>
                  </div>
                  <Switch
                    checked={appearanceSettings.compactMode}
                    onCheckedChange={(checked) => handleAppearanceSettingChange('compactMode', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Animations</Label>
                    <p className="text-sm text-muted-foreground">Enable UI animations</p>
                  </div>
                  <Switch
                    checked={appearanceSettings.animationsEnabled}
                    onCheckedChange={(checked) => handleAppearanceSettingChange('animationsEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>High Contrast</Label>
                    <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                  </div>
                  <Switch
                    checked={appearanceSettings.highContrast}
                    onCheckedChange={(checked) => handleAppearanceSettingChange('highContrast', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Reduced Motion</Label>
                    <p className="text-sm text-muted-foreground">Reduce motion for accessibility</p>
                  </div>
                  <Switch
                    checked={appearanceSettings.reducedMotion}
                    onCheckedChange={(checked) => handleAppearanceSettingChange('reducedMotion', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color Blind Support</Label>
                  <Select
                    value={appearanceSettings.colorBlindMode}
                    onValueChange={(value) => handleAppearanceSettingChange('colorBlindMode', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="protanopia">Protanopia</SelectItem>
                      <SelectItem value="deuteranopia">Deuteranopia</SelectItem>
                      <SelectItem value="tritanopia">Tritanopia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingChange('pushNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingChange('emailNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive SMS notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingChange('smsNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>In-App Notifications</Label>
                    <p className="text-sm text-muted-foreground">Show notifications within the app</p>
                  </div>
                  <Switch
                    checked={notificationSettings.inAppNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingChange('inAppNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Desktop Notifications</Label>
                    <p className="text-sm text-muted-foreground">Show desktop notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.desktopNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingChange('desktopNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sound</Label>
                    <p className="text-sm text-muted-foreground">Play notification sounds</p>
                  </div>
                  <Switch
                    checked={notificationSettings.soundEnabled}
                    onCheckedChange={(checked) => handleNotificationSettingChange('soundEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Vibration</Label>
                    <p className="text-sm text-muted-foreground">Enable vibration for notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.vibrationEnabled}
                    onCheckedChange={(checked) => handleNotificationSettingChange('vibrationEnabled', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Quiet Hours
                </CardTitle>
                <CardDescription>
                  Set times when notifications should be silenced
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Quiet Hours</Label>
                    <p className="text-sm text-muted-foreground">Silence notifications during specified hours</p>
                  </div>
                  <Switch
                    checked={notificationSettings.quietHours}
                    onCheckedChange={(checked) => handleNotificationSettingChange('quietHours', checked)}
                  />
                </div>
                {notificationSettings.quietHours && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quietStart">Start Time</Label>
                      <Input
                        id="quietStart"
                        type="time"
                        value={notificationSettings.quietStart}
                        onChange={(e) => handleNotificationSettingChange('quietStart', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quietEnd">End Time</Label>
                      <Input
                        id="quietEnd"
                        type="time"
                        value={notificationSettings.quietEnd}
                        onChange={(e) => handleNotificationSettingChange('quietEnd', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Notification Types
                </CardTitle>
                <CardDescription>
                  Choose which types of notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Appointment Reminders</Label>
                    <p className="text-sm text-muted-foreground">Upcoming appointment notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.appointmentReminders}
                    onCheckedChange={(checked) => handleNotificationSettingChange('appointmentReminders', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Exercise Reminders</Label>
                    <p className="text-sm text-muted-foreground">Exercise schedule notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.exerciseReminders}
                    onCheckedChange={(checked) => handleNotificationSettingChange('exerciseReminders', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Medication Reminders</Label>
                    <p className="text-sm text-muted-foreground">Medication schedule notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.medicationReminders}
                    onCheckedChange={(checked) => handleNotificationSettingChange('medicationReminders', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Progress Updates</Label>
                    <p className="text-sm text-muted-foreground">Progress tracking notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.progressUpdates}
                    onCheckedChange={(checked) => handleNotificationSettingChange('progressUpdates', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>System Alerts</Label>
                    <p className="text-sm text-muted-foreground">Important system notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.systemAlerts}
                    onCheckedChange={(checked) => handleNotificationSettingChange('systemAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Promotional and marketing emails</p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) => handleNotificationSettingChange('marketingEmails', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">Weekly summary emails</p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyDigest}
                    onCheckedChange={(checked) => handleNotificationSettingChange('weeklyDigest', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Monthly Report</Label>
                    <p className="text-sm text-muted-foreground">Monthly progress reports</p>
                  </div>
                  <Switch
                    checked={notificationSettings.monthlyReport}
                    onCheckedChange={(checked) => handleNotificationSettingChange('monthlyReport', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>
                  Control your privacy and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select
                    value={privacySettings.profileVisibility}
                    onValueChange={(value) => handlePrivacySettingChange('profileVisibility', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="contacts">Contacts Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Share Progress</Label>
                    <p className="text-sm text-muted-foreground">Allow sharing progress with providers</p>
                  </div>
                  <Switch
                    checked={privacySettings.shareProgress}
                    onCheckedChange={(checked) => handlePrivacySettingChange('shareProgress', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Share Exercises</Label>
                    <p className="text-sm text-muted-foreground">Allow sharing exercise data</p>
                  </div>
                  <Switch
                    checked={privacySettings.shareExercises}
                    onCheckedChange={(checked) => handlePrivacySettingChange('shareExercises', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Analytics</Label>
                    <p className="text-sm text-muted-foreground">Allow anonymous usage analytics</p>
                  </div>
                  <Switch
                    checked={privacySettings.allowAnalytics}
                    onCheckedChange={(checked) => handlePrivacySettingChange('allowAnalytics', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cookies</Label>
                    <p className="text-sm text-muted-foreground">Allow cookies for better experience</p>
                  </div>
                  <Switch
                    checked={privacySettings.allowCookies}
                    onCheckedChange={(checked) => handlePrivacySettingChange('allowCookies', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Location Tracking</Label>
                    <p className="text-sm text-muted-foreground">Allow location-based features</p>
                  </div>
                  <Switch
                    checked={privacySettings.allowLocationTracking}
                    onCheckedChange={(checked) => handlePrivacySettingChange('allowLocationTracking', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure security and authentication options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                  </div>
                  <Switch
                    checked={privacySettings.twoFactorAuth}
                    onCheckedChange={(checked) => handlePrivacySettingChange('twoFactorAuth', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified of new logins</p>
                  </div>
                  <Switch
                    checked={privacySettings.loginAlerts}
                    onCheckedChange={(checked) => handlePrivacySettingChange('loginAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Device Tracking</Label>
                    <p className="text-sm text-muted-foreground">Track devices used to access account</p>
                  </div>
                  <Switch
                    checked={privacySettings.deviceTracking}
                    onCheckedChange={(checked) => handlePrivacySettingChange('deviceTracking', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data Retention</Label>
                  <Select
                    value={privacySettings.dataRetention}
                    onValueChange={(value) => handlePrivacySettingChange('dataRetention', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">3 Months</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                      <SelectItem value="2years">2 Years</SelectItem>
                      <SelectItem value="5years">5 Years</SelectItem>
                      <SelectItem value="forever">Forever</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-delete Inactive Data</Label>
                    <p className="text-sm text-muted-foreground">Automatically delete old inactive data</p>
                  </div>
                  <Switch
                    checked={privacySettings.autoDeleteInactive}
                    onCheckedChange={(checked) => handlePrivacySettingChange('autoDeleteInactive', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Permissions
                </CardTitle>
                <CardDescription>
                  Manage app permissions and access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Camera Access</Label>
                    <p className="text-sm text-muted-foreground">Allow camera for pose estimation</p>
                  </div>
                  <Switch
                    checked={privacySettings.allowCameraAccess}
                    onCheckedChange={(checked) => handlePrivacySettingChange('allowCameraAccess', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Microphone Access</Label>
                    <p className="text-sm text-muted-foreground">Allow microphone for video calls</p>
                  </div>
                  <Switch
                    checked={privacySettings.allowMicrophoneAccess}
                    onCheckedChange={(checked) => handlePrivacySettingChange('allowMicrophoneAccess', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notification Access</Label>
                    <p className="text-sm text-muted-foreground">Allow sending notifications</p>
                  </div>
                  <Switch
                    checked={privacySettings.allowNotificationAccess}
                    onCheckedChange={(checked) => handlePrivacySettingChange('allowNotificationAccess', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Device Settings */}
          <TabsContent value="device" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Camera & Media
                </CardTitle>
                <CardDescription>
                  Configure camera and media settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Camera Quality</Label>
                  <Select
                    value={deviceSettings.cameraQuality}
                    onValueChange={(value) => handleDeviceSettingChange('cameraQuality', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (480p)</SelectItem>
                      <SelectItem value="medium">Medium (720p)</SelectItem>
                      <SelectItem value="high">High (1080p)</SelectItem>
                      <SelectItem value="ultra">Ultra (4K)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Microphone Gain: {deviceSettings.microphoneGain}%</Label>
                  <Slider
                    value={[deviceSettings.microphoneGain]}
                    onValueChange={([value]) => handleDeviceSettingChange('microphoneGain', value)}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Speaker Volume: {deviceSettings.speakerVolume}%</Label>
                  <Slider
                    value={[deviceSettings.speakerVolume]}
                    onValueChange={([value]) => handleDeviceSettingChange('speakerVolume', value)}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Screen Brightness: {deviceSettings.screenBrightness}%</Label>
                  <Slider
                    value={[deviceSettings.screenBrightness]}
                    onValueChange={([value]) => handleDeviceSettingChange('screenBrightness', value)}
                    max={100}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Device Controls
                </CardTitle>
                <CardDescription>
                  Configure device behavior and controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Rotation</Label>
                    <p className="text-sm text-muted-foreground">Automatically rotate screen</p>
                  </div>
                  <Switch
                    checked={deviceSettings.autoRotation}
                    onCheckedChange={(checked) => handleDeviceSettingChange('autoRotation', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Haptic Feedback</Label>
                    <p className="text-sm text-muted-foreground">Enable vibration feedback</p>
                  </div>
                  <Switch
                    checked={deviceSettings.hapticFeedback}
                    onCheckedChange={(checked) => handleDeviceSettingChange('hapticFeedback', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Gesture Controls</Label>
                    <p className="text-sm text-muted-foreground">Enable gesture navigation</p>
                  </div>
                  <Switch
                    checked={deviceSettings.gestureControls}
                    onCheckedChange={(checked) => handleDeviceSettingChange('gestureControls', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Voice Commands</Label>
                    <p className="text-sm text-muted-foreground">Enable voice control</p>
                  </div>
                  <Switch
                    checked={deviceSettings.voiceCommands}
                    onCheckedChange={(checked) => handleDeviceSettingChange('voiceCommands', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  Connectivity
                </CardTitle>
                <CardDescription>
                  Configure network and connectivity settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Bluetooth</Label>
                    <p className="text-sm text-muted-foreground">Enable Bluetooth connectivity</p>
                  </div>
                  <Switch
                    checked={deviceSettings.bluetoothEnabled}
                    onCheckedChange={(checked) => handleDeviceSettingChange('bluetoothEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>WiFi Auto-Connect</Label>
                    <p className="text-sm text-muted-foreground">Automatically connect to known networks</p>
                  </div>
                  <Switch
                    checked={deviceSettings.wifiAutoConnect}
                    onCheckedChange={(checked) => handleDeviceSettingChange('wifiAutoConnect', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Location Services</Label>
                    <p className="text-sm text-muted-foreground">Enable location-based features</p>
                  </div>
                  <Switch
                    checked={deviceSettings.locationServices}
                    onCheckedChange={(checked) => handleDeviceSettingChange('locationServices', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Background Refresh</Label>
                    <p className="text-sm text-muted-foreground">Allow background data refresh</p>
                  </div>
                  <Switch
                    checked={deviceSettings.backgroundRefresh}
                    onCheckedChange={(checked) => handleDeviceSettingChange('backgroundRefresh', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Battery className="h-5 w-5" />
                  Power Management
                </CardTitle>
                <CardDescription>
                  Configure power and performance settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Low Power Mode</Label>
                    <p className="text-sm text-muted-foreground">Reduce performance to save battery</p>
                  </div>
                  <Switch
                    checked={deviceSettings.lowPowerMode}
                    onCheckedChange={(checked) => handleDeviceSettingChange('lowPowerMode', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Developer Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable advanced developer options</p>
                  </div>
                  <Switch
                    checked={deviceSettings.developerMode}
                    onCheckedChange={(checked) => handleDeviceSettingChange('developerMode', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backup Settings */}
          <TabsContent value="backup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backup Configuration
                </CardTitle>
                <CardDescription>
                  Configure automatic backup settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Backup</Label>
                    <p className="text-sm text-muted-foreground">Automatically backup your data</p>
                  </div>
                  <Switch
                    checked={backupSettings.autoBackup}
                    onCheckedChange={(checked) => handleBackupSettingChange('autoBackup', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Backup Frequency</Label>
                  <Select
                    value={backupSettings.backupFrequency}
                    onValueChange={(value) => handleBackupSettingChange('backupFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Backup Location</Label>
                  <Select
                    value={backupSettings.backupLocation}
                    onValueChange={(value) => handleBackupSettingChange('backupLocation', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cloud">Cloud Storage</SelectItem>
                      <SelectItem value="local">Local Storage</SelectItem>
                      <SelectItem value="external">External Drive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Backup Content
                </CardTitle>
                <CardDescription>
                  Choose what data to include in backups
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Media</Label>
                    <p className="text-sm text-muted-foreground">Backup photos and videos</p>
                  </div>
                  <Switch
                    checked={backupSettings.includeMedia}
                    onCheckedChange={(checked) => handleBackupSettingChange('includeMedia', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Settings</Label>
                    <p className="text-sm text-muted-foreground">Backup app settings and preferences</p>
                  </div>
                  <Switch
                    checked={backupSettings.includeSettings}
                    onCheckedChange={(checked) => handleBackupSettingChange('includeSettings', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Progress</Label>
                    <p className="text-sm text-muted-foreground">Backup exercise progress and metrics</p>
                  </div>
                  <Switch
                    checked={backupSettings.includeProgress}
                    onCheckedChange={(checked) => handleBackupSettingChange('includeProgress', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Messages</Label>
                    <p className="text-sm text-muted-foreground">Backup chat messages and conversations</p>
                  </div>
                  <Switch
                    checked={backupSettings.includeMessages}
                    onCheckedChange={(checked) => handleBackupSettingChange('includeMessages', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Encrypt Backup</Label>
                    <p className="text-sm text-muted-foreground">Encrypt backup files for security</p>
                  </div>
                  <Switch
                    checked={backupSettings.encryptBackup}
                    onCheckedChange={(checked) => handleBackupSettingChange('encryptBackup', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Backup Status
                </CardTitle>
                <CardDescription>
                  View backup information and manage backups
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Last Backup</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(backupSettings.lastBackup).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Next Backup</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(backupSettings.nextBackup).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Backup Size</Label>
                    <p className="text-sm text-muted-foreground">{backupSettings.backupSize}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Available Space</Label>
                    <p className="text-sm text-muted-foreground">{backupSettings.availableSpace}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button onClick={handleBackupNow} className="flex-1">
                    <Database className="mr-2 h-4 w-4" />
                    Backup Now
                  </Button>
                  <Button onClick={handleRestoreBackup} variant="outline" className="flex-1">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Restore
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Reset Settings Dialog */}
        <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
          <div className="flex justify-center mt-8">
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Reset All Settings
              </Button>
            </DialogTrigger>
          </div>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Reset All Settings
              </DialogTitle>
              <DialogDescription>
                This will reset all settings to their default values. This action cannot be undone.
                Are you sure you want to continue?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setResetDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleResetSettings}>
                <Trash2 className="mr-2 h-4 w-4" />
                Reset Settings
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}