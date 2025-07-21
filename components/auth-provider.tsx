"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Define user types
export type UserRole = "patient" | "provider" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

// Mock users for demo purposes
const MOCK_USERS = [
  {
    id: "1",
    email: "sarah@example.com",
    password: "password123",
    name: "Alex Johnson",
    role: "patient" as UserRole,
    avatar: "/smiling-brown-haired-woman.png"
  },
  {
    id: "2",
    email: "johnson@clinic.com",
    password: "doctor123",
    name: "Dr. Rebecca Chen",
    role: "provider" as UserRole,
    avatar: "/caring-doctor.png"
  },
  {
    id: "3",
    email: "admin@kinetic.com",
    password: "admin123",
    name: "Admin User",
    role: "admin" as UserRole,
  },
  {
    id: "4",
    email: "michael@example.com",
    password: "password123",
    name: "Michael Smith",
    role: "patient" as UserRole,
    avatar: "/athletic-man-short-hair.png"
  },
  {
    id: "5",
    email: "emily@example.com",
    password: "password123",
    name: "Emily Davis",
    role: "patient" as UserRole,
  },
  {
    id: "6",
    email: "williams@clinic.com",
    password: "doctor123",
    name: "Dr. Williams",
    role: "provider" as UserRole,
  },
  {
    id: "7",
    email: "provider@gmail.com",
    password: "provider",
    name: "Dr. James Wilson",
    role: "provider" as UserRole,
    avatar: "/older-man-glasses.png"
  }
]

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("kineticUser")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("kineticUser")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find user with matching credentials
    const foundUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (foundUser) {
      // Create user object without password
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("kineticUser", JSON.stringify(userWithoutPassword))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("kineticUser")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
