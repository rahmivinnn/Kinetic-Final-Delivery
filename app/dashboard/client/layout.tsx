"use client"

import type { ReactNode } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function ClientDashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout activeLink="home">{children}</DashboardLayout>
}