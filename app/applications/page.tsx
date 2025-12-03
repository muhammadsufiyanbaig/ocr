"use client"

import { useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { Header } from "@/components/header"
import { ApplicationsTable } from "@/components/application-table"
import { getPaginatedApplications, getApplicationsCount } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { PlusCircle, ChevronLeft, ChevronRight } from "lucide-react"

const PAGE_SIZE = 10

export default function ApplicationsPage() {
  const [page, setPage] = useState(0)

  const { data: countData } = useSWR("applications-count", getApplicationsCount)
  const {
    data: applications,
    isLoading,
    mutate,
  } = useSWR(["applications", page], () => getPaginatedApplications(page * PAGE_SIZE, PAGE_SIZE))

  const totalPages = Math.ceil((countData?.total_applications ?? 0) / PAGE_SIZE)

  return (
    <div className="min-h-screen">
      <Header title="Applications" description="Manage all account applications" />
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {page * PAGE_SIZE + 1} to {Math.min((page + 1) * PAGE_SIZE, countData?.total_applications ?? 0)} of{" "}
            {countData?.total_applications ?? 0} applications
          </div>
          <Link href="/applications/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Application
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-muted-foreground">Loading applications...</div>
          </div>
        ) : (
          <ApplicationsTable applications={applications ?? []} onDelete={() => mutate()} />
        )}

        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="border-border text-foreground hover:bg-secondary"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages - 1}
            className="border-border text-foreground hover:bg-secondary"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
