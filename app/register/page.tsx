import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SiteHeader } from "@/components/site-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Register() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-[#001a41] to-[#003366] p-4">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex justify-center w-full">
              <Image src="/kinetic-new-logo.png" alt="Kinetic" width={80} height={80} />
            </div>
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-sm text-gray-500">Sign up to start your recovery journey</p>
          </div>
          <Tabs defaultValue="patient" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patient">Patient</TabsTrigger>
              <TabsTrigger value="provider">Provider</TabsTrigger>
            </TabsList>
            <TabsContent value="patient" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="patient-name">Full Name</Label>
                <Input id="patient-name" placeholder="Enter your full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-email">Email</Label>
                <Input id="patient-email" placeholder="Enter your email address" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-password">Password</Label>
                <Input id="patient-password" placeholder="Create a password (min. 8 characters)" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-confirm-password">Confirm Password</Label>
                <Input id="patient-confirm-password" placeholder="Confirm your password" type="password" />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="patient-terms" className="h-4 w-4 rounded border-gray-300" />
                <Label htmlFor="patient-terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              <Button className="w-full bg-[#001a41]">Create Account</Button>
            </TabsContent>
            <TabsContent value="provider" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="provider-name">Full Name</Label>
                <Input id="provider-name" placeholder="Enter your full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider-email">Email</Label>
                <Input id="provider-email" placeholder="Enter your email address" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider-password">Password</Label>
                <Input id="provider-password" placeholder="Create a password (min. 8 characters)" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider-confirm-password">Confirm Password</Label>
                <Input id="provider-confirm-password" placeholder="Confirm your password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider-license">License Number</Label>
                <Input id="provider-license" placeholder="Enter your professional license number" />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="provider-terms" className="h-4 w-4 rounded border-gray-300" />
                <Label htmlFor="provider-terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              <Button className="w-full bg-[#001a41]">Create Account</Button>
            </TabsContent>
          </Tabs>
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <span className="relative bg-white px-2 text-xs text-gray-500">Or sign up with</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
                <path d="M10 2c1 .5 2 2 2 5" />
              </svg>
              Apple
            </Button>
          </div>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
