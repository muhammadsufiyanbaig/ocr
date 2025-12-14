"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

interface AppShellProps {
  children: React.ReactNode
  title: string
  description?: string
}

export function AppShell({ children, title, description }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 transition-all duration-300 md:pl-72">
        <Header 
          title={title} 
          description={description}
          onMenuClick={() => setSidebarOpen(true)}
        />
        {children}
      </main>
    </div>
  )
}
