import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function DemoPage() {
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

      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-[#111827] mb-6">Watch Our Demo</h1>
        <div className="aspect-video bg-[#111827] rounded-lg mb-8 flex items-center justify-center">
          <p className="text-white">Demo video will play here</p>
        </div>
        <p className="text-[#4b5563] mb-8">
          See how our AI-powered rehabilitation platform can transform your recovery journey with personalized
          exercises, real-time feedback, and progress tracking.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button variant="outline" className="border-[#111827] text-[#111827]">
              Back to Home
            </Button>
          </Link>
          <Link href="/free-trial">
            <Button className="bg-[#111827] hover:bg-[#1f2937]">Start Free Trial</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
