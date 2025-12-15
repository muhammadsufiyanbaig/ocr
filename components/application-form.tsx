"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { type AccountApplication, createApplication, updateApplication } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ApplicationResponseModal } from "@/components/application-response-modal"
import { Loader2, Save, User, MapPin, Briefcase, Users, Smartphone, Building2 } from "lucide-react"

interface ApplicationFormProps {
  initialData?: AccountApplication
  isEditing?: boolean
}

export function ApplicationForm({ initialData, isEditing = false }: ApplicationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [createdApplication, setCreatedApplication] = useState<AccountApplication | null>(null)

  const [formData, setFormData] = useState<Partial<AccountApplication>>({
    branch_city: initialData?.branch_city ?? "",
    branch_code: initialData?.branch_code ?? "",
    sbp_code: initialData?.sbp_code ?? "",
    title_of_account: initialData?.title_of_account ?? "",
    name: initialData?.name ?? "",
    name_on_card: initialData?.name_on_card ?? "",
    cnic_no: initialData?.cnic_no ?? "",
    fathers_husbands_name: initialData?.fathers_husbands_name ?? "",
    mothers_name: initialData?.mothers_name ?? "",
    marital_status: initialData?.marital_status ?? undefined,
    gender: initialData?.gender ?? undefined,
    nationality: initialData?.nationality ?? "PAKISTANI",
    place_of_birth: initialData?.place_of_birth ?? "",
    date_of_birth: initialData?.date_of_birth ?? "",
    cnic_expiry_date: initialData?.cnic_expiry_date ?? "",
    house_no_block_street: initialData?.house_no_block_street ?? "",
    area_location: initialData?.area_location ?? "",
    city: initialData?.city ?? "",
    postal_code: initialData?.postal_code ?? "",
    occupation: initialData?.occupation ?? undefined,
    occupation_other: initialData?.occupation_other ?? "",
    purpose_of_account: initialData?.purpose_of_account ?? "",
    source_of_income: initialData?.source_of_income ?? "",
    expected_monthly_turnover_dr: initialData?.expected_monthly_turnover_dr ?? 0,
    expected_monthly_turnover_cr: initialData?.expected_monthly_turnover_cr ?? 0,
    residential_status: initialData?.residential_status ?? undefined,
    residential_status_other: initialData?.residential_status_other ?? "",
    residing_since: initialData?.residing_since ?? "",
    next_of_kin_name: initialData?.next_of_kin_name ?? "",
    next_of_kin_relation: initialData?.next_of_kin_relation ?? "",
    next_of_kin_cnic: initialData?.next_of_kin_cnic ?? "",
    next_of_kin_relationship: initialData?.next_of_kin_relationship ?? "",
    next_of_kin_contact_no: initialData?.next_of_kin_contact_no ?? "",
    next_of_kin_address: initialData?.next_of_kin_address ?? "",
    next_of_kin_email: initialData?.next_of_kin_email ?? "",
    internet_banking: initialData?.internet_banking ?? false,
    mobile_banking: initialData?.mobile_banking ?? false,
    check_book: initialData?.check_book ?? false,
    sms_alerts: initialData?.sms_alerts ?? false,
    card_type_gold: initialData?.card_type_gold ?? false,
    card_type_classic: initialData?.card_type_classic ?? false,
    zakat_deduction: initialData?.zakat_deduction ?? false,
  })

  const updateField = (field: keyof AccountApplication, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Convert YYYY-MM-DD to DD MM YY format
  const formatDateForApi = (dateStr: string | undefined | null): string | null => {
    if (!dateStr) return null
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (match) {
      const [, year, month, day] = match
      return `${day} ${month} ${year.slice(-2)}`
    }
    return dateStr // Already in correct format or different format
  }

  // Clean empty strings to null for optional fields
  const cleanFormData = (data: Partial<AccountApplication>): Partial<AccountApplication> => {
    const cleaned: Partial<AccountApplication> = {}
    
    for (const [key, value] of Object.entries(data)) {
      if (value === "" || value === undefined) {
        (cleaned as Record<string, unknown>)[key] = null
      } else {
        (cleaned as Record<string, unknown>)[key] = value
      }
    }
    
    // Convert date fields to API format
    cleaned.date_of_birth = formatDateForApi(data.date_of_birth) ?? undefined
    cleaned.cnic_expiry_date = formatDateForApi(data.cnic_expiry_date) ?? undefined
    cleaned.residing_since = formatDateForApi(data.residing_since) ?? undefined
    
    return cleaned
  }

  const handleModalClose = () => {
    setShowResponseModal(false)
    setCreatedApplication(null)
    router.push("/applications")
    router.refresh()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const cleanedData = cleanFormData(formData)
      
      if (isEditing && initialData?.id) {
        await updateApplication(initialData.id, {
          ...initialData,
          ...cleanedData,
        } as AccountApplication)
        toast.success("Application Updated", {
          description: "The application has been successfully updated.",
        })
        router.push("/applications")
        router.refresh()
      } else {
        const response = await createApplication(cleanedData as Omit<AccountApplication, "id" | "account_no" | "iban">)
        setCreatedApplication(response)
        setShowResponseModal(true)
        toast.success("Application Created", {
          description: "The new application has been successfully created.",
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      toast.error("Operation Failed", {
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
    <ApplicationResponseModal 
      isOpen={showResponseModal}
      onClose={handleModalClose}
      data={createdApplication}
    />
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Branch Information */}
      <Card className="bg-card border-border glow-card">
        <CardHeader className="flex flex-row items-center gap-2 pb-4">
          <div className="p-2 rounded-lg bg-cyan-500/10">
            <Building2 className="h-5 w-5 text-cyan-400" />
          </div>
          <CardTitle className="text-card-foreground text-base">Branch Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="branch_city" className="text-foreground text-sm">
              Branch City
            </Label>
            <Input
              id="branch_city"
              value={formData.branch_city}
              onChange={(e) => updateField("branch_city", e.target.value.toUpperCase())}
              placeholder="KARACHI"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch_code" className="text-foreground text-sm">
              Branch Code
            </Label>
            <Input
              id="branch_code"
              value={formData.branch_code}
              onChange={(e) => updateField("branch_code", e.target.value.toUpperCase())}
              placeholder="0001"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sbp_code" className="text-foreground text-sm">
              SBP Code
            </Label>
            <Input
              id="sbp_code"
              value={formData.sbp_code}
              onChange={(e) => updateField("sbp_code", e.target.value.toUpperCase())}
              placeholder="ABCD0001"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="bg-card border-border glow-card">
        <CardHeader className="flex flex-row items-center gap-2 pb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-card-foreground text-base">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="title_of_account" className="text-foreground text-sm">
              Title of Account *
            </Label>
            <Input
              id="title_of_account"
              value={formData.title_of_account}
              onChange={(e) => updateField("title_of_account", e.target.value.toUpperCase())}
              placeholder="JOHN DOE"
              required
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground text-sm">
              Name (as per CNIC) *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value.toUpperCase())}
              placeholder="JOHN DOE"
              required
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name_on_card" className="text-foreground text-sm">
              Name on Card
            </Label>
            <Input
              id="name_on_card"
              value={formData.name_on_card}
              onChange={(e) => updateField("name_on_card", e.target.value.toUpperCase())}
              placeholder="JOHN DOE"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cnic_no" className="text-foreground text-sm">
              CNIC Number *
            </Label>
            <Input
              id="cnic_no"
              value={formData.cnic_no}
              onChange={(e) => updateField("cnic_no", e.target.value)}
              placeholder="12345-1234567-1"
              required
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fathers_husbands_name" className="text-foreground text-sm">
              {"Father's/Husband's Name"}
            </Label>
            <Input
              id="fathers_husbands_name"
              value={formData.fathers_husbands_name}
              onChange={(e) => updateField("fathers_husbands_name", e.target.value.toUpperCase())}
              placeholder="JAMES DOE"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mothers_name" className="text-foreground text-sm">
              {"Mother's Name"}
            </Label>
            <Input
              id="mothers_name"
              value={formData.mothers_name}
              onChange={(e) => updateField("mothers_name", e.target.value.toUpperCase())}
              placeholder="JANE DOE"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground text-sm">Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => updateField("gender", value)}>
              <SelectTrigger className="bg-input border-border text-foreground rounded-xl h-11">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground text-sm">Marital Status</Label>
            <Select value={formData.marital_status} onValueChange={(value) => updateField("marital_status", value)}>
              <SelectTrigger className="bg-input border-border text-foreground rounded-xl h-11">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="SINGLE">Single</SelectItem>
                <SelectItem value="MARRIED">Married</SelectItem>
                <SelectItem value="DIVORCED">Divorced</SelectItem>
                <SelectItem value="WIDOWED">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nationality" className="text-foreground text-sm">
              Nationality
            </Label>
            <Input
              id="nationality"
              value={formData.nationality}
              onChange={(e) => updateField("nationality", e.target.value.toUpperCase())}
              placeholder="PAKISTANI"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="place_of_birth" className="text-foreground text-sm">
              Place of Birth
            </Label>
            <Input
              id="place_of_birth"
              value={formData.place_of_birth}
              onChange={(e) => updateField("place_of_birth", e.target.value.toUpperCase())}
              placeholder="KARACHI"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date_of_birth" className="text-foreground text-sm">
              Date of Birth
            </Label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => updateField("date_of_birth", e.target.value)}
              className="bg-input border-border text-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cnic_expiry_date" className="text-foreground text-sm">
              CNIC Expiry Date
            </Label>
            <Input
              id="cnic_expiry_date"
              type="date"
              value={formData.cnic_expiry_date}
              onChange={(e) => updateField("cnic_expiry_date", e.target.value)}
              className="bg-input border-border text-foreground rounded-xl h-11"
            />
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card className="bg-card border-border glow-card">
        <CardHeader className="flex flex-row items-center gap-2 pb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-card-foreground text-base">Address Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="house_no_block_street" className="text-foreground text-sm">
              House No / Block / Street
            </Label>
            <Input
              id="house_no_block_street"
              value={formData.house_no_block_street}
              onChange={(e) => updateField("house_no_block_street", e.target.value.toUpperCase())}
              placeholder="HOUSE 123, BLOCK A, STREET 5"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="area_location" className="text-foreground text-sm">
              Area / Location
            </Label>
            <Input
              id="area_location"
              value={formData.area_location}
              onChange={(e) => updateField("area_location", e.target.value.toUpperCase())}
              placeholder="GULSHAN"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city" className="text-foreground text-sm">
              City
            </Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => updateField("city", e.target.value.toUpperCase())}
              placeholder="KARACHI"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postal_code" className="text-foreground text-sm">
              Postal Code
            </Label>
            <Input
              id="postal_code"
              value={formData.postal_code}
              onChange={(e) => updateField("postal_code", e.target.value)}
              placeholder="75300"
              maxLength={5}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground text-sm">Residential Status</Label>
            <Select
              value={formData.residential_status}
              onValueChange={(value) => updateField("residential_status", value)}
            >
              <SelectTrigger className="bg-input border-border text-foreground rounded-xl h-11">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="HOUSE_OWNED">Owned</SelectItem>
                <SelectItem value="RENTAL">Rental</SelectItem>
                <SelectItem value="FAMILY">Family</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="residing_since" className="text-foreground text-sm">
              Residing Since
            </Label>
            <Input
              id="residing_since"
              type="date"
              value={formData.residing_since}
              onChange={(e) => updateField("residing_since", e.target.value)}
              className="bg-input border-border text-foreground rounded-xl h-11"
            />
          </div>
        </CardContent>
      </Card>

      {/* Occupation & Financial */}
      <Card className="bg-card border-border glow-card">
        <CardHeader className="flex flex-row items-center gap-2 pb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-card-foreground text-base">Occupation & Financial Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label className="text-foreground text-sm">Occupation</Label>
            <Select value={formData.occupation} onValueChange={(value) => updateField("occupation", value)}>
              <SelectTrigger className="bg-input border-border text-foreground rounded-xl h-11">
                <SelectValue placeholder="Select occupation" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="SERVICE_GOVT">Government Service</SelectItem>
                <SelectItem value="SERVICE_PRIVATE">Private Service</SelectItem>
                <SelectItem value="FARMER">Farmer</SelectItem>
                <SelectItem value="HOUSE_WIFE">House Wife</SelectItem>
                <SelectItem value="STUDENT">Student</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose_of_account" className="text-foreground text-sm">
              Purpose of Account
            </Label>
            <Input
              id="purpose_of_account"
              value={formData.purpose_of_account}
              onChange={(e) => updateField("purpose_of_account", e.target.value.toUpperCase())}
              placeholder="SALARY"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="source_of_income" className="text-foreground text-sm">
              Source of Income
            </Label>
            <Input
              id="source_of_income"
              value={formData.source_of_income}
              onChange={(e) => updateField("source_of_income", e.target.value.toUpperCase())}
              placeholder="EMPLOYMENT"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expected_monthly_turnover_dr" className="text-foreground text-sm">
              Expected Monthly Debit (Rs)
            </Label>
            <Input
              id="expected_monthly_turnover_dr"
              type="number"
              value={formData.expected_monthly_turnover_dr}
              onChange={(e) => updateField("expected_monthly_turnover_dr", Number.parseFloat(e.target.value) || 0)}
              className="bg-input border-border text-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expected_monthly_turnover_cr" className="text-foreground text-sm">
              Expected Monthly Credit (Rs)
            </Label>
            <Input
              id="expected_monthly_turnover_cr"
              type="number"
              value={formData.expected_monthly_turnover_cr}
              onChange={(e) => updateField("expected_monthly_turnover_cr", Number.parseFloat(e.target.value) || 0)}
              className="bg-input border-border text-foreground rounded-xl h-11"
            />
          </div>
        </CardContent>
      </Card>

      {/* Next of Kin */}
      <Card className="bg-card border-border glow-card">
        <CardHeader className="flex flex-row items-center gap-2 pb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-card-foreground text-base">Next of Kin Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="next_of_kin_name" className="text-foreground text-sm">
              Name
            </Label>
            <Input
              id="next_of_kin_name"
              value={formData.next_of_kin_name}
              onChange={(e) => updateField("next_of_kin_name", e.target.value.toUpperCase())}
              placeholder="JANE DOE"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="next_of_kin_relation" className="text-foreground text-sm">
              Relation (S/W/D/O)
            </Label>
            <Input
              id="next_of_kin_relation"
              value={formData.next_of_kin_relation}
              onChange={(e) => updateField("next_of_kin_relation", e.target.value.toUpperCase())}
              placeholder="S/O"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="next_of_kin_cnic" className="text-foreground text-sm">
              CNIC
            </Label>
            <Input
              id="next_of_kin_cnic"
              value={formData.next_of_kin_cnic}
              onChange={(e) => updateField("next_of_kin_cnic", e.target.value)}
              placeholder="12345-1234567-2"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="next_of_kin_relationship" className="text-foreground text-sm">
              Relationship
            </Label>
            <Input
              id="next_of_kin_relationship"
              value={formData.next_of_kin_relationship}
              onChange={(e) => updateField("next_of_kin_relationship", e.target.value.toUpperCase())}
              placeholder="MOTHER"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="next_of_kin_contact_no" className="text-foreground text-sm">
              Contact Number
            </Label>
            <Input
              id="next_of_kin_contact_no"
              value={formData.next_of_kin_contact_no}
              onChange={(e) => updateField("next_of_kin_contact_no", e.target.value)}
              placeholder="03001234567"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="next_of_kin_email" className="text-foreground text-sm">
              Email
            </Label>
            <Input
              id="next_of_kin_email"
              type="email"
              value={formData.next_of_kin_email}
              onChange={(e) => updateField("next_of_kin_email", e.target.value)}
              placeholder="jane.doe@email.com"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2 sm:col-span-2 lg:col-span-3">
            <Label htmlFor="next_of_kin_address" className="text-foreground text-sm">
              Address
            </Label>
            <Input
              id="next_of_kin_address"
              value={formData.next_of_kin_address}
              onChange={(e) => updateField("next_of_kin_address", e.target.value.toUpperCase())}
              placeholder="HOUSE 456, BLOCK B"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-11"
            />
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card className="bg-card border-border glow-card">
        <CardHeader className="flex flex-row items-center gap-2 pb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Smartphone className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-card-foreground text-base">Banking Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <Checkbox
                id="internet_banking"
                checked={formData.internet_banking}
                onCheckedChange={(checked) => updateField("internet_banking", checked)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="internet_banking" className="cursor-pointer text-foreground text-sm">
                Internet Banking
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <Checkbox
                id="mobile_banking"
                checked={formData.mobile_banking}
                onCheckedChange={(checked) => updateField("mobile_banking", checked)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="mobile_banking" className="cursor-pointer text-foreground text-sm">
                Mobile Banking
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <Checkbox
                id="check_book"
                checked={formData.check_book}
                onCheckedChange={(checked) => updateField("check_book", checked)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="check_book" className="cursor-pointer text-foreground text-sm">
                Check Book
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <Checkbox
                id="sms_alerts"
                checked={formData.sms_alerts}
                onCheckedChange={(checked) => updateField("sms_alerts", checked)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="sms_alerts" className="cursor-pointer text-foreground text-sm">
                SMS Alerts
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <Checkbox
                id="card_type_gold"
                checked={formData.card_type_gold}
                onCheckedChange={(checked) => updateField("card_type_gold", checked)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="card_type_gold" className="cursor-pointer text-foreground text-sm">
                Gold Card
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <Checkbox
                id="card_type_classic"
                checked={formData.card_type_classic}
                onCheckedChange={(checked) => updateField("card_type_classic", checked)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="card_type_classic" className="cursor-pointer text-foreground text-sm">
                Classic Card
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <Checkbox
                id="zakat_deduction"
                checked={formData.zakat_deduction}
                onCheckedChange={(checked) => updateField("zakat_deduction", checked)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="zakat_deduction" className="cursor-pointer text-foreground text-sm">
                Zakat Deduction
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="border-border text-foreground hover:bg-secondary rounded-xl h-11 px-6 order-2 sm:order-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11 px-8 glow-primary order-1 sm:order-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? "Update Application" : "Create Application"}
            </>
          )}
        </Button>
      </div>
    </form>
    </>
  )
}
