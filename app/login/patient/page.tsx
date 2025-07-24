"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PatientLoginPage() {
  // Login form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Register form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerError, setRegisterError] = useState("")
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  const { user, login, loginWithGoogle, loginWithApple, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    if (user && !authLoading) {
      // Redirect all users to dashboard
      router.push("/dashboard")
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setIsLoading(true)

    try {
      // For testing purposes, let's add some console logs
      console.log("Attempting login with:", email, password)

      const success = await login(email, password)
      console.log("Login success:", success)

      if (success) {
        // Add a small delay to ensure the user state is updated
        setTimeout(() => {
          console.log("Redirecting to dashboard")
          router.push("/dashboard")
        }, 100)
      } else {
        setLoginError("Login failed. Please check your credentials and try again.")
      }
    } catch (err) {
      setLoginError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle registration form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setIsRegistering(true);

    try {
      // Validate form
      if (!firstName || !lastName || !registerEmail || !registerPassword) {
        setRegisterError("All fields are required");
        return;
      }

      if (registerPassword.length < 8) {
        setRegisterError("Password must be at least 8 characters");
        return;
      }

      // For demo purposes, we'll simulate a successful registration
      console.log("Registering user:", { firstName, lastName, registerEmail });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message and reset form
      setRegisterSuccess(true);
      setFirstName("");
      setLastName("");
      setRegisterEmail("");
      setRegisterPassword("");

      // Automatically switch to login tab after successful registration
      setTimeout(() => {
        document.getElementById("login-tab")?.click();
        setEmail(registerEmail);
      }, 1500);

    } catch (err) {
      setRegisterError("An error occurred during registration. Please try again.");
      console.error(err);
    } finally {
      setIsRegistering(false);
    }
  };

  // For demo purposes, let's add a quick login function
  const handleQuickLogin = async (userType: string) => {
    let loginEmail = "";
    let loginPassword = "";

    if (userType === "patient") {
      loginEmail = "sarah@example.com";
      loginPassword = "password123";
    } else if (userType === "provider") {
      loginEmail = "johnson@clinic.com";
      loginPassword = "doctor123";
    }

    setEmail(loginEmail);
    setPassword(loginPassword);

    // Automatically login after setting credentials
    setLoginError("");
    setIsLoading(true);

    try {
      console.log("Quick login with:", loginEmail, loginPassword);
      const success = await login(loginEmail, loginPassword);

      if (success) {
        console.log("Quick login successful, redirecting to dashboard");
        router.push("/dashboard");
      } else {
        setLoginError("Login failed. Please check your credentials and try again.");
      }
    } catch (err) {
      setLoginError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const success = await loginWithGoogle();
      if (success) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setLoginError("Gagal login dengan Google. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setIsLoading(true);
    try {
      const success = await loginWithApple();
      if (success) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Apple login error:", error);
      setLoginError("Gagal login dengan Apple. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#000a2c] to-[#00487c] p-4">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Image src="/kinetic-logo.png" alt="Kinetic Logo" width={80} height={80} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-1"></h1>
            <p className="text-xl text-white">Patient Portal</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
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
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-[#53d08a] w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Patient Access</h2>
                  <p className="text-gray-600 text-sm">
                    Access your personalized recovery plan and track your progress
                  </p>
                </div>
              </div>

              {loginError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
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
                  <Label htmlFor="password" className="text-gray-700">
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
                  <Link href="/forgot-password" className="text-[#3e82e7] hover:underline text-sm">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 bg-[#53d08a] hover:bg-[#31bd7c] text-white font-medium rounded-md"
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

              {/* Demo Quick Login Buttons */}
              <div className="mt-4 border-t pt-4">
                <p className="text-xs text-gray-500 mb-2 text-center">Demo Quick Login:</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => handleQuickLogin("patient")}
                  >
                    Patient Login
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => handleQuickLogin("provider")}
                  >
                    Provider Login
                  </Button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-2">
                  Don&apos;t have an account?{" "}
                  <button
                    className="text-[#3e82e7] hover:underline"
                    onClick={() => document.getElementById("register-tab")?.click()}
                  >
                    Register now
                  </button>
                </p>
                <p className="text-sm text-gray-500">
                  Are you a healthcare provider?{" "}
                  <Link href="/login/provider" className="text-[#3e82e7] hover:underline">
                    Provider Login
                  </Link>
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="register" className="p-0">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-[#53d08a] w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Create Account</h2>
                  <p className="text-gray-500 text-sm">Join Kinetic to start your personalized recovery journey</p>
                </div>
              </div>

              {registerSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Registration Successful!</h3>
                  <p className="text-gray-600 mb-4">Your account has been created successfully.</p>
                  <p className="text-sm text-gray-500">You can now log in with your credentials.</p>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  {registerError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{registerError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-700">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="Enter first name"
                        className="py-6"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-700">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Enter last name"
                        className="py-6"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerEmail" className="text-gray-700">
                      Email
                    </Label>
                    <div className="relative">
                      <Input
                        id="registerEmail"
                        type="email"
                        placeholder="Enter your email address"
                        className="pl-10 py-6"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerPassword" className="text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="registerPassword"
                        type="password"
                        placeholder="Create a password"
                        className="pl-10 py-6"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                    <p className="text-xs text-gray-500">
                      Password must be at least 8 characters with a number and special character
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-6 bg-[#53d08a] hover:bg-[#31bd7c] text-white font-medium rounded-md mt-4"
                    disabled={isRegistering}
                  >
                    {isRegistering ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span> Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              )}

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <button
                    className="text-[#3e82e7] hover:underline"
                    onClick={() => document.getElementById("login-tab")?.click()}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="px-8 py-4 bg-gray-50 text-center">
          <p className="text-xs text-gray-500">
            By signing in or creating an account, you agree to our{" "}
            <Link href="/terms" className="text-[#3e82e7] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#3e82e7] hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-white hover:underline text-sm">
          Return to Home
        </Link>
      </div>
    </div>
  )
}
