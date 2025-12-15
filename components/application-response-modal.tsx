"use client"

import { AccountApplication } from "@/lib/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Copy, CreditCard, User, MapPin, Briefcase, Smartphone, Users } from "lucide-react"
import { toast } from "sonner"

interface ApplicationResponseModalProps {
  isOpen: boolean
  onClose: () => void
  data: AccountApplication | null
}

export function ApplicationResponseModal({ isOpen, onClose, data }: ApplicationResponseModalProps) {
  if (!data) return null

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied!", { description: `${label} copied to clipboard` })
  }

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return "—"
    if (typeof value === "boolean") return value ? "Yes" : "No"
    if (typeof value === "number") return value.toLocaleString()
    return String(value)
  }

  const sections = [
    {
      title: "Account Details",
      icon: CreditCard,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      fields: [
        { label: "Account No", key: "account_no", highlight: true },
        { label: "IBAN", key: "iban", highlight: true },
        { label: "Account Type", key: "account_type" },
        { label: "Branch City", key: "branch_city" },
        { label: "Branch Code", key: "branch_code" },
        { label: "SBP Code", key: "sbp_code" },
        { label: "Date", key: "date" },
      ],
    },
    {
      title: "Personal Information",
      icon: User,
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
      fields: [
        { label: "Name", key: "name" },
        { label: "Title of Account", key: "title_of_account" },
        { label: "Name on Card", key: "name_on_card" },
        { label: "CNIC No", key: "cnic_no" },
        { label: "Father's/Husband's Name", key: "fathers_husbands_name" },
        { label: "Mother's Name", key: "mothers_name" },
        { label: "Gender", key: "gender" },
        { label: "Marital Status", key: "marital_status" },
        { label: "Nationality", key: "nationality" },
        { label: "Place of Birth", key: "place_of_birth" },
        { label: "Date of Birth", key: "date_of_birth" },
        { label: "CNIC Expiry", key: "cnic_expiry_date" },
      ],
    },
    {
      title: "Address Information",
      icon: MapPin,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      fields: [
        { label: "House/Block/Street", key: "house_no_block_street" },
        { label: "Area/Location", key: "area_location" },
        { label: "City", key: "city" },
        { label: "Postal Code", key: "postal_code" },
        { label: "Residential Status", key: "residential_status" },
        { label: "Residential Status Other", key: "residential_status_other" },
        { label: "Residing Since", key: "residing_since" },
      ],
    },
    {
      title: "Occupation & Financial",
      icon: Briefcase,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      fields: [
        { label: "Occupation", key: "occupation" },
        { label: "Occupation Other", key: "occupation_other" },
        { label: "Purpose of Account", key: "purpose_of_account" },
        { label: "Source of Income", key: "source_of_income" },
        { label: "Expected Monthly DR", key: "expected_monthly_turnover_dr" },
        { label: "Expected Monthly CR", key: "expected_monthly_turnover_cr" },
      ],
    },
    {
      title: "Next of Kin",
      icon: Users,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
      fields: [
        { label: "Name", key: "next_of_kin_name" },
        { label: "Relation", key: "next_of_kin_relation" },
        { label: "Relationship", key: "next_of_kin_relationship" },
        { label: "CNIC", key: "next_of_kin_cnic" },
        { label: "Contact No", key: "next_of_kin_contact_no" },
        { label: "Email", key: "next_of_kin_email" },
        { label: "Address", key: "next_of_kin_address" },
      ],
    },
    {
      title: "Banking Services",
      icon: Smartphone,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      fields: [
        { label: "Internet Banking", key: "internet_banking" },
        { label: "Mobile Banking", key: "mobile_banking" },
        { label: "Check Book", key: "check_book" },
        { label: "SMS Alerts", key: "sms_alerts" },
        { label: "Gold Card", key: "card_type_gold" },
        { label: "Classic Card", key: "card_type_classic" },
        { label: "Zakat Deduction", key: "zakat_deduction" },
      ],
    },
  ]

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="bg-card border-border max-w-2xl w-[95vw] max-h-[85vh] overflow-hidden flex flex-col p-0">
        {/* Header */}
        <AlertDialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/20">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-bold text-foreground">
                Application Created Successfully!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground mt-1">
                Account <span className="font-mono text-primary">{data.account_no}</span> has been created
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
          {/* Highlight Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div 
              className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/15 transition-colors"
              onClick={() => copyToClipboard(data.account_no || "", "Account Number")}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Account Number</span>
                <Copy className="h-3 w-3 text-muted-foreground" />
              </div>
              <p className="font-mono font-bold text-emerald-400 text-lg">{data.account_no}</p>
            </div>
            <div 
              className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 cursor-pointer hover:bg-violet-500/15 transition-colors"
              onClick={() => copyToClipboard(data.iban || "", "IBAN")}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">IBAN</span>
                <Copy className="h-3 w-3 text-muted-foreground" />
              </div>
              <p className="font-mono font-bold text-violet-400 text-sm break-all">{data.iban}</p>
            </div>
          </div>

          {/* Sections */}
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <div key={section.title} className="rounded-xl border border-border bg-secondary/20 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/30">
                  <div className={`p-1.5 rounded-lg ${section.bgColor}`}>
                    <Icon className={`h-4 w-4 ${section.color}`} />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground">{section.title}</h3>
                </div>
                <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-2">
                  {section.fields.map((field) => {
                    const value = data[field.key as keyof AccountApplication]
                    const displayValue = formatValue(value)
                    const isBoolean = typeof value === "boolean"
                    
                    return (
                      <div key={field.key} className="flex flex-col gap-0.5">
                        <span className="text-xs text-muted-foreground">{field.label}</span>
                        {isBoolean ? (
                          <Badge 
                            variant="outline" 
                            className={value 
                              ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 w-fit" 
                              : "border-muted text-muted-foreground w-fit"
                            }
                          >
                            {displayValue}
                          </Badge>
                        ) : (
                          <span className={`text-sm font-medium ${displayValue === "—" ? "text-muted-foreground" : "text-foreground"}`}>
                            {displayValue}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <AlertDialogFooter className="px-6 py-4 border-t border-border shrink-0">
          <AlertDialogAction 
            onClick={onClose}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8"
          >
            Continue to Applications
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
