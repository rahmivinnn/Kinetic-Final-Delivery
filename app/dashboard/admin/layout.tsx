"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and is an admin
    if (!isLoading) {
      if (!user) {
        console.log("No user found, redirecting to admin login")
        router.push("/login/admin")
      } else if (user.role !== "admin") {
        console.log("User is not an admin, redirecting to appropriate dashboard")
        if (user.role === "provider") {
          router.push("/dashboard/provider")
        } else {
          router.push("/dashboard")
        }
      }
    }
  }, [user, isLoading, router])

  // If no user or not an admin, return empty until redirect happens
  if ((!user || user.role !== "admin") && !isLoading) {
    return null
  }

  return <>{children}</>
}