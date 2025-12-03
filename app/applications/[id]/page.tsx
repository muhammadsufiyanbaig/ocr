"use client"

import { use, useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
} from "lucide-react"

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
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
      <div className="min-h-screen">
        <Header title="Application Details" />
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted-foreground">Loading application...</div>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen">
        <Header title="Application Details" />
        <div className="flex h-64 flex-col items-center justify-center gap-4">
          <div className="text-destructive">Application not found</div>
          <Link href="/applications">
            <Button variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Applications
            </Button>
          </Link>
        </div>
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
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value || "—"}</p>
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
      {value ? <CheckCircle className="h-4 w-4 text-primary" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}
      <span className={value ? "text-foreground" : "text-muted-foreground"}>{label}</span>
    </div>
  )

  return (
    <div className="min-h-screen">
      <Header title="Application Details" description={`Viewing application #${application.id}`} />
      <div className="p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link href="/applications">
            <Button variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link href={`/applications/${id}/edit`}>
              <Button variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-foreground">Delete Application</AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    Are you sure you want to delete this application? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-border text-foreground hover:bg-secondary">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Account Information */}
        <Card className="mb-6 bg-card border-border">
          <CardHeader className="flex flex-row items-center gap-2 pb-4">
            <CreditCard className="h-5 w-5 text-primary" />
            <CardTitle className="text-card-foreground">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <InfoItem label="Account Number" value={application.account_no} />
            <InfoItem label="IBAN" value={application.iban} />
            <div>
              <p className="text-sm text-muted-foreground">Account Type</p>
              <Badge variant="outline" className="mt-1 border-primary/30 text-primary">
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
        <Card className="mb-6 bg-card border-border">
          <CardHeader className="flex flex-row items-center gap-2 pb-4">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-card-foreground">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        <Card className="mb-6 bg-card border-border">
          <CardHeader className="flex flex-row items-center gap-2 pb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle className="text-card-foreground">Address Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2">
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
        <Card className="mb-6 bg-card border-border">
          <CardHeader className="flex flex-row items-center gap-2 pb-4">
            <Briefcase className="h-5 w-5 text-primary" />
            <CardTitle className="text-card-foreground">Occupation & Financial</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        <Card className="mb-6 bg-card border-border">
          <CardHeader className="flex flex-row items-center gap-2 pb-4">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-card-foreground">Next of Kin</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="Name" value={application.next_of_kin_name} />
            <InfoItem label="Relation" value={application.next_of_kin_relation} />
            <InfoItem label="CNIC" value={application.next_of_kin_cnic} />
            <InfoItem label="Relationship" value={application.next_of_kin_relationship} />
            <InfoItem label="Contact Number" value={application.next_of_kin_contact_no} />
            <InfoItem label="Email" value={application.next_of_kin_email} />
            <div className="md:col-span-2 lg:col-span-3">
              <InfoItem label="Address" value={application.next_of_kin_address} />
            </div>
          </CardContent>
        </Card>

        {/* Banking Services */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center gap-2 pb-4">
            <Smartphone className="h-5 w-5 text-primary" />
            <CardTitle className="text-card-foreground">Banking Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
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
    </div>
  )
}
