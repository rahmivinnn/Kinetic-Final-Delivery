"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, User, AlertCircle, Shield } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProviderLoginPage() {
  // Login form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Register form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerError, setRegisterError] = useState("")
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  const { user, login, loginWithGoogle, loginWithApple, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      if (user.role === "provider") {
        router.push("/dashboard/provider")
      } else if (user.role === "patient") {
        router.push("/dashboard")
      }
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(email, password)

      if (success) {
        // Check if the user is a provider
        if (user?.role === "provider") {
          router.push("/dashboard/provider")
        } else if (user?.role === "patient") {
          setError("This login is for healthcare providers only. Please use the patient login.")
        } else {
          setError("Invalid user role. Please contact support.")
        }
      } else {
        setError("Login failed. Please check your credentials and try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Quick login for demo purposes
  const handleQuickLogin = async () => {
    const providerEmail = "provider@gmail.com"
    const providerPassword = "provider"

    setEmail(providerEmail)
    setPassword(providerPassword)

    setError("")
    setIsLoading(true)

    try {
      const success = await login(providerEmail, providerPassword)

      if (success) {
        if (user?.role === "provider") {
          router.push("/dashboard/provider")
        } else {
          setError("This login is for healthcare providers only.")
        }
      } else {
        setError("Login failed. Please check your credentials and try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const success = await loginWithGoogle();
      if (success) {
        router.push("/dashboard/provider");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setError("Gagal login dengan Google. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setIsLoading(true);
    try {
      const success = await loginWithApple();
      if (success) {
        router.push("/dashboard/provider");
      }
    } catch (error) {
      console.error("Apple login error:", error);
      setError("Gagal login dengan Apple. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError("")
    setIsRegistering(true)

    try {
      if (!firstName || !lastName || !specialization || !licenseNumber || !registerEmail || !registerPassword) {
        setRegisterError("All fields are required")
        return
      }

      if (registerPassword.length < 8) {
        setRegisterError("Password must be at least 8 characters")
        return
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      setRegisterSuccess(true)
      setFirstName("")
      setLastName("")
      setSpecialization("")
      setLicenseNumber("")
      setRegisterEmail("")
      setRegisterPassword("")

      setTimeout(() => {
        document.getElementById("login-tab")?.click()
        setEmail(registerEmail)
      }, 1500)

    } catch (err) {
      setRegisterError("An error occurred during registration. Please try again.")
      console.error(err)
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#00305a] to-[#0066a2] px-4 py-6 sm:p-4">
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex justify-center mb-3 sm:mb-4">
          <Image src="/kinetic-logo.png" alt="Kinetic Logo" width={80} height={80} className="w-16 h-16 sm:w-20 sm:h-20" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1"></h1>
        <p className="text-lg sm:text-xl text-white">Provider Portal</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden mx-4 sm:mx-0">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 w-full rounded-none">
            <TabsTrigger value="login" className="rounded-none py-4" id="login-tab">
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="rounded-none py-4" id="register-tab">
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="p-0">
            <div className="p-4 sm:p-8">
          <div className="flex items-center mb-6">
            <div className="bg-[#0066a2] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-3 sm:mr-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Provider Access</h2>
              <p className="text-black text-sm">
                Manage your patients and monitor their recovery progress
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black">
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 py-6"
                  required
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-black">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 py-6"
                  required
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>

            <div className="text-right">
              <Link href="/forgot-password" className="text-[#0066a2] hover:underline text-sm">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full py-6 bg-[#0066a2] hover:bg-[#004d7a] text-white font-medium rounded-md"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Atau login dengan</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                type="button" 
                variant="outline" 
                className="py-5 relative text-black bg-white hover:bg-gray-50 active:bg-gray-50"
                onClick={handleGoogleLogin}
              >
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <span className="text-sm font-medium">Google</span>
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="py-5 relative text-black bg-white hover:bg-gray-50 active:bg-gray-50"
                onClick={handleAppleLogin}
              >
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.05 20.28c-.98.95-2.05.94-3.08.43-1.09-.53-2.08-.53-3.22 0-1.44.62-2.2.44-3.06-.43C4.3 16.75 3.9 12.76 6.47 10.26c1.38-1.39 2.82-1.17 4.12-.53.83.41 1.42.41 2.24 0 1.42-.56 2.7-.69 3.95.53-3.91 2.32-2.8 7.95 1.37 10.02-.4.36-.77.72-1.1 1zm-3.38-17.4c.06 1.8-1.6 3.75-3.7 3.65-.16-1.7 1.5-3.75 3.7-3.65z" fill="#000"/>
                  </svg>
                </div>
                <span className="text-sm font-medium">Apple</span>
              </Button>
            </div>
          </form>

          {/* Demo Quick Login Button */}
          <div className="mt-4 border-t pt-4">
            <p className="text-xs text-black mb-2 text-center">Demo Quick Login:</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={handleQuickLogin}
            >
              Provider Demo Login (provider@gmail.com / provider)
            </Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="register" className="p-0">
        <div className="p-4 sm:p-8">
          <div className="flex items-center mb-6">
            <div className="bg-[#0066a2] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-3 sm:mr-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-black">Provider Registration</h2>
              <p className="text-black text-sm">
                Create your provider account to access the platform
              </p>
            </div>
          </div>

          {registerError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{registerError}</AlertDescription>
            </Alert>
          )}

          {registerSuccess && (
            <Alert className="mb-6 bg-green-50 text-green-700 border-green-200">
              <AlertDescription>
                Registration successful! Redirecting to login...
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-black">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="py-6"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-black">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="py-6"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization" className="text-black">
                Specialization
              </Label>
              <Input
                id="specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="py-6"
                placeholder="e.g., Physical Therapist, Orthopedic Specialist"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber" className="text-black">
                License Number
              </Label>
              <Input
                id="licenseNumber"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="py-6"
                placeholder="Enter your professional license number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registerEmail" className="text-black">
                Email
              </Label>
              <Input
                id="registerEmail"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="py-6"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registerPassword" className="text-black">
                Password
              </Label>
              <Input
                id="registerPassword"
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="py-6"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0066a2] hover:bg-[#005a91] text-white py-6"
              disabled={isRegistering}
            >
              {isRegistering ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </div>
      </TabsContent>
    </Tabs>
  </div>

  <div className="mt-6 text-center">
    <p className="text-sm text-white">
      Are you a patient?{" "}
      <Link href="/login/patient" className="text-white hover:underline">
        Patient Login
    </Link>
    </p>
  </div>
</div>
  )
}
