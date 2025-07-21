import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function FreeTrialPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f9fafb] p-4">
      <header className="w-full bg-[#111827] text-white py-3 px-4 mb-8">
        <div className="container mx-auto flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/kinetic-new-logo.png" alt="Kinetic Logo" width={40} height={40} />
            <span className="font-bold text-xl">KINETIC</span>
          </Link>
        </div>
      </header>

      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-[#111827] mb-6 text-center">Start Your Free Trial</h1>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Enter your full name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" placeholder="Enter your phone number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="condition">Rehabilitation Condition</Label>
            <Input id="condition" placeholder="E.g., Knee injury, back pain, etc." />
          </div>
          <div className="pt-4">
            <Button className="w-full bg-[#111827] hover:bg-[#1f2937]">Create Free Account</Button>
          </div>
          <p className="text-sm text-[#4b5563] text-center">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-[#111827] underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#111827] underline">
              Privacy Policy
            </Link>
          </p>
        </form>
        <div className="mt-6 text-center">
          <Link href="/" className="text-[#111827] text-sm hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
