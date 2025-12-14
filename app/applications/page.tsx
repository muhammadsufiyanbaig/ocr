"use client"

import { useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ApplicationsTable } from "@/components/application-table"
import { getPaginatedApplications, getApplicationsCount } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { PlusCircle, ChevronLeft, ChevronRight, FileText } from "lucide-react"

const PAGE_SIZE = 10

export default function ApplicationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [page, setPage] = useState(0)

  const { data: countData } = useSWR("applications-count", getApplicationsCount)
  const {
    data: applications,
    isLoading,
    mutate,
  } = useSWR(["applications", page], () => getPaginatedApplications(page * PAGE_SIZE, PAGE_SIZE))

  const totalPages = Math.ceil((countData?.total_applications ?? 0) / PAGE_SIZE)

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 transition-all duration-300 md:pl-72">
        <Header 
          title="Applications" 
          description="Manage all account applications"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="p-4 md:p-6">
          {/* Header Actions */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{page * PAGE_SIZE + 1}</span> to{" "}
              <span className="font-medium text-foreground">
                {Math.min((page + 1) * PAGE_SIZE, countData?.total_applications ?? 0)}
              </span>{" "}
              of <span className="font-medium text-foreground">{countData?.total_applications ?? 0}</span> applications
            </div>
            <Link href="/applications/new">
              <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Application
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3 text-muted-foreground">
                <FileText className="h-5 w-5 animate-pulse" />
                <span>Loading applications...</span>
              </div>
            </div>
          ) : (
            <ApplicationsTable applications={applications ?? []} onDelete={() => mutate()} />
          )}

          {/* Pagination */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="border-border text-foreground hover:bg-secondary rounded-xl"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>Page</span>
              <span className="rounded-lg bg-secondary px-3 py-1 font-medium text-foreground">
                {page + 1}
              </span>
              <span>of {totalPages || 1}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
              className="border-border text-foreground hover:bg-secondary rounded-xl"
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
