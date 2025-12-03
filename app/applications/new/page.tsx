import { Header } from "@/components/header"
import { ApplicationForm } from "@/components/application-form"

export default function NewApplicationPage() {
  return (
    <div className="min-h-screen">
      <Header title="New Application" description="Create a new bank account application" />
      <div className="p-6">
        <ApplicationForm />
      </div>
    </div>
  )
}
