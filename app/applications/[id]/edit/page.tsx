"use client"

import { use, useState } from "react"
import useSWR from "swr"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ApplicationForm } from "@/components/application-form"
import { getApplicationById } from "@/lib/api"
import { FileText } from "lucide-react"

export default function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: application, isLoading } = useSWR(`application-${id}`, () => getApplicationById(Number.parseInt(id)))

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 transition-all duration-300 md:pl-72">
          <Header 
            title="Edit Application"
            onMenuClick={() => setSidebarOpen(true)}
          />
          <div className="flex h-64 items-center justify-center">
            <div className="flex items-center gap-3 text-muted-foreground">
              <FileText className="h-5 w-5 animate-pulse" />
              <span>Loading application...</span>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 transition-all duration-300 md:pl-72">
          <Header 
            title="Edit Application"
            onMenuClick={() => setSidebarOpen(true)}
          />
          <div className="flex h-64 items-center justify-center">
            <div className="text-destructive">Application not found</div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 transition-all duration-300 md:pl-72">
        <Header 
          title="Edit Application" 
          description={`Editing application for ${application.name}`}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="p-4 md:p-6">
          <ApplicationForm initialData={application} isEditing />
        </div>
      </main>
    </div>
  )
}
