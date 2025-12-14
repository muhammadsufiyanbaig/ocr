"use client"

import { use, useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getApplicationById, deleteApplication } from "@/lib/api"
import {
  Pencil,
  Trash2,
  ArrowLeft,
  User,
  MapPin,
  Briefcase,
  Users,
  Smartphone,
  CreditCard,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react"

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data: application, isLoading } = useSWR(`application-${id}`, () => getApplicationById(Number.parseInt(id)))

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteApplication(Number.parseInt(id))
      router.push("/applications")
    } catch (error) {
      console.error("Failed to delete:", error)
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 transition-all duration-300 md:pl-72">
          <Header 
            title="Application Details"
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
            title="Application Details"
            onMenuClick={() => setSidebarOpen(true)}
          />
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <div className="text-destructive">Application not found</div>
            <Link href="/applications">
              <Button variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent rounded-xl">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Applications
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const InfoItem = ({
    label,
    value,
  }: {
    label: string
    value?: string | number | null
  }) => (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground text-sm">{value || "—"}</p>
    </div>
  )

  const BooleanItem = ({
    label,
    value,
  }: {
    label: string
    value?: boolean
  }) => (
    <div className="flex items-center gap-2">
      {value ? (
        <CheckCircle className="h-4 w-4 text-emerald-400" />
      ) : (
        <XCircle className="h-4 w-4 text-muted-foreground" />
      )}
      <span className={`text-sm ${value ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
    </div>
  )

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 transition-all duration-300 md:pl-72">
        <Header 
          title="Application Details" 
          description={`Viewing application #${application.id}`}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="p-4 md:p-6">
          {/* Action Buttons */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <Link href="/applications">
              <Button variant="outline" className="w-full sm:w-auto border-border text-foreground hover:bg-secondary bg-transparent rounded-xl">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex gap-2">
              <Link href={`/applications/${id}/edit`} className="flex-1 sm:flex-none">
                <Button variant="outline" className="w-full border-border text-foreground hover:bg-secondary bg-transparent rounded-xl">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex-1 sm:flex-none rounded-xl">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-border max-w-[90vw] sm:max-w-lg rounded-xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">Delete Application</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      Are you sure you want to delete this application? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                    <AlertDialogCancel className="border-border text-foreground hover:bg-secondary rounded-xl">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Account Information */}
          <Card className="mb-4 bg-card border-border glow-card">
            <CardHeader className="flex flex-row items-center gap-2 pb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-card-foreground text-base">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <InfoItem label="Account Number" value={application.account_no} />
              <InfoItem label="IBAN" value={application.iban} />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Account Type</p>
                <Badge variant="outline" className="border-emerald-400/30 text-emerald-400 bg-emerald-400/10">
                  {application.account_type ?? "SAVINGS"}
                </Badge>
              </div>
              <InfoItem label="Application Date" value={application.date} />
              <InfoItem label="Branch City" value={application.branch_city} />
              <InfoItem label="Branch Code" value={application.branch_code} />
              <InfoItem label="SBP Code" value={application.sbp_code} />
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="mb-4 bg-card border-border glow-card">
            <CardHeader className="flex flex-row items-center gap-2 pb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-card-foreground text-base">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <InfoItem label="Title of Account" value={application.title_of_account} />
              <InfoItem label="Name" value={application.name} />
              <InfoItem label="Name on Card" value={application.name_on_card} />
              <InfoItem label="CNIC Number" value={application.cnic_no} />
              <InfoItem label="Father's/Husband's Name" value={application.fathers_husbands_name} />
              <InfoItem label="Mother's Name" value={application.mothers_name} />
              <InfoItem label="Gender" value={application.gender} />
              <InfoItem label="Marital Status" value={application.marital_status} />
              <InfoItem label="Nationality" value={application.nationality} />
              <InfoItem label="Place of Birth" value={application.place_of_birth} />
              <InfoItem label="Date of Birth" value={application.date_of_birth} />
              <InfoItem label="CNIC Expiry Date" value={application.cnic_expiry_date} />
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card className="mb-4 bg-card border-border glow-card">
            <CardHeader className="flex flex-row items-center gap-2 pb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-card-foreground text-base">Address Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 grid-cols-2 md:grid-cols-3">
              <div className="col-span-2">
                <InfoItem label="House No / Block / Street" value={application.house_no_block_street} />
              </div>
              <InfoItem label="Area / Location" value={application.area_location} />
              <InfoItem label="City" value={application.city} />
              <InfoItem label="Postal Code" value={application.postal_code} />
              <InfoItem label="Residential Status" value={application.residential_status} />
              <InfoItem label="Residing Since" value={application.residing_since} />
            </CardContent>
          </Card>

          {/* Occupation & Financial */}
          <Card className="mb-4 bg-card border-border glow-card">
            <CardHeader className="flex flex-row items-center gap-2 pb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-card-foreground text-base">Occupation & Financial</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 grid-cols-2 md:grid-cols-3">
              <InfoItem label="Occupation" value={application.occupation} />
              <InfoItem label="Purpose of Account" value={application.purpose_of_account} />
              <InfoItem label="Source of Income" value={application.source_of_income} />
              <InfoItem
                label="Expected Monthly Debit"
                value={
                  application.expected_monthly_turnover_dr
                    ? `Rs ${application.expected_monthly_turnover_dr.toLocaleString()}`
                    : null
                }
              />
              <InfoItem
                label="Expected Monthly Credit"
                value={
                  application.expected_monthly_turnover_cr
                    ? `Rs ${application.expected_monthly_turnover_cr.toLocaleString()}`
                    : null
                }
              />
            </CardContent>
          </Card>

          {/* Next of Kin */}
          <Card className="mb-4 bg-card border-border glow-card">
            <CardHeader className="flex flex-row items-center gap-2 pb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-card-foreground text-base">Next of Kin</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 grid-cols-2 md:grid-cols-3">
              <InfoItem label="Name" value={application.next_of_kin_name} />
              <InfoItem label="Relation" value={application.next_of_kin_relation} />
              <InfoItem label="CNIC" value={application.next_of_kin_cnic} />
              <InfoItem label="Relationship" value={application.next_of_kin_relationship} />
              <InfoItem label="Contact Number" value={application.next_of_kin_contact_no} />
              <InfoItem label="Email" value={application.next_of_kin_email} />
              <div className="col-span-2 md:col-span-3">
                <InfoItem label="Address" value={application.next_of_kin_address} />
              </div>
            </CardContent>
          </Card>

          {/* Banking Services */}
          <Card className="bg-card border-border glow-card">
            <CardHeader className="flex flex-row items-center gap-2 pb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-card-foreground text-base">Banking Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <BooleanItem label="Internet Banking" value={application.internet_banking} />
                <BooleanItem label="Mobile Banking" value={application.mobile_banking} />
                <BooleanItem label="Check Book" value={application.check_book} />
                <BooleanItem label="SMS Alerts" value={application.sms_alerts} />
                <BooleanItem label="Gold Card" value={application.card_type_gold} />
                <BooleanItem label="Classic Card" value={application.card_type_classic} />
                <BooleanItem label="Zakat Deduction" value={application.zakat_deduction} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
