"use client"

import { use } from "react"
import useSWR from "swr"
import { Header } from "@/components/header"
import { ApplicationForm } from "@/components/application-form"
import { getApplicationById } from "@/lib/api"

export default function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: application, isLoading } = useSWR(`application-${id}`, () => getApplicationById(Number.parseInt(id)))

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header title="Edit Application" />
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted-foreground">Loading application...</div>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen">
        <Header title="Edit Application" />
        <div className="flex h-64 items-center justify-center">
          <div className="text-destructive">Application not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header title="Edit Application" description={`Editing application for ${application.name}`} />
      <div className="p-6">
        <ApplicationForm initialData={application} isEditing />
      </div>
    </div>
  )
}
