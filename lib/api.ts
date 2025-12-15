const API_BASE_URL = "https://ds-ocr-project.vercel.app"

// Enums
export type AccountType = "CURRENT" | "SAVINGS" | "AHU_LAT"
export type CardType = "CLASSIC" | "GOLD" | "TITANIUM" | "PLATINUM" | "SIGNATURE" | "INFINITE"
export type CardNetwork = "VISA" | "MASTERCARD"
export type Occupation = 
  | "SERVICE_GOVT" | "SERVICE_PRIVATE" | "BUSINESS" | "SELF_EMPLOYED" 
  | "FARMER" | "HOUSE_WIFE" | "STUDENT" | "RETIRED" 
  | "DOCTOR" | "ENGINEER" | "TEACHER" | "LAWYER" 
  | "ACCOUNTANT" | "IT_PROFESSIONAL" | "BANKER" | "UNEMPLOYED" | "OTHER"
export type MaritalStatus = "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED"
export type Gender = "MALE" | "FEMALE" | "OTHER"
export type ResidentialStatus = "HOUSE_OWNED" | "RENTAL" | "FAMILY" | "OTHER"

export interface AccountApplication {
  id?: number
  account_no?: string
  iban?: string
  date?: string
  branch_city?: string
  branch_code?: string
  sbp_code?: string
  account_type: AccountType
  title_of_account: string
  name: string
  name_on_card?: string
  cnic_no: string
  fathers_husbands_name?: string
  mothers_name?: string
  marital_status?: MaritalStatus
  gender?: Gender
  nationality?: string
  place_of_birth?: string
  date_of_birth?: string
  cnic_expiry_date?: string
  house_no_block_street?: string
  area_location?: string
  city?: string
  postal_code?: string
  occupation?: Occupation
  occupation_other?: string
  purpose_of_account?: string
  source_of_income?: string
  expected_monthly_turnover_dr?: number
  expected_monthly_turnover_cr?: number
  residential_status?: ResidentialStatus
  residential_status_other?: string
  residing_since?: string
  // Next of Kin
  has_next_of_kin: boolean
  next_of_kin_name?: string
  next_of_kin_relation?: string
  next_of_kin_cnic?: string
  next_of_kin_relationship?: string
  next_of_kin_contact_no?: string
  next_of_kin_address?: string
  next_of_kin_email?: string
  // Services
  internet_banking?: boolean
  mobile_banking?: boolean
  check_book?: boolean
  sms_alerts?: boolean
  // Card Selection (single choice)
  card_type?: CardType | null
  card_network?: CardNetwork | null
  zakat_deduction?: boolean
}

// Analytics Interfaces
export interface AnalyticsBreakdown {
  total: number
  breakdown: Record<string, number>
  percentages: Record<string, number>
}

export interface ServicesAnalytics {
  total_applications: number
  services: {
    internet_banking: number
    mobile_banking: number
    check_book: number
    sms_alerts: number
    zakat_deduction: number
  }
  percentages: Record<string, number>
}

export interface DashboardSummary {
  total_applications: number
  account_types: Record<string, number>
  gender_distribution: Record<string, number>
  card_types: Record<string, number>
  card_networks: Record<string, number>
  top_cities: Record<string, number>
  services_adoption: ServicesAnalytics["services"]
  kin_stats: {
    with_next_of_kin: number
    without_next_of_kin: number
  }
}

export interface ExecutiveSummary {
  key_metrics: {
    total_customers: number
    total_expected_monthly_deposits: number
    average_customer_value: number
    digital_adoption_rate: number
    service_engagement_score: number
    profile_completeness: number
  }
  health_indicators: {
    digital_maturity: "HIGH" | "MEDIUM" | "LOW"
    data_quality: "HIGH" | "MEDIUM" | "LOW"
    customer_engagement: "HIGH" | "MEDIUM" | "LOW"
  }
  top_insights: string[]
  recommendations: string[]
}

export interface FinancialInsights {
  summary: {
    debit_turnover: {
      average: number
      minimum: number
      maximum: number
      total: number
    }
    credit_turnover: {
      average: number
      minimum: number
      maximum: number
      total: number
    }
  }
  insights: {
    average_net_monthly_flow: number
    flow_direction: "POSITIVE" | "NEGATIVE"
    total_expected_monthly_deposits: number
    total_expected_monthly_withdrawals: number
    highest_single_deposit_expectation: number
    total_applications_analyzed: number
  }
}

export interface CityPerformance {
  city_performance: Array<{
    city: string
    total_applications: number
    avg_monthly_credit: number
    total_monthly_credit: number
  }>
  rankings: {
    by_application_volume: string[]
    by_total_credit_value: string[]
    by_average_customer_value: string[]
  }
  insights: {
    highest_volume_city: string | null
    highest_value_city: string | null
    highest_avg_customer_value_city: string | null
    total_cities: number
  }
}

export interface CustomerSegmentation {
  segmentation_data: {
    total_customers: number
    segments: Record<string, {
      count: number
      percentage: number
    }>
  }
  insights: {
    largest_segment: string | null
    smallest_segment: string | null
    growth_opportunity: string | null
  }
  segment_recommendations: Record<string, string>
}

export interface DigitalBankingInsights {
  adoption_data: {
    total_customers: number
    full_digital_customers: number
    internet_only: number
    mobile_only: number
    no_digital: number
    digital_adoption_rate: number
    any_digital_rate: number
    digital_by_account_type: Record<string, number>
  }
  insights: {
    digital_maturity_score: number
    digital_maturity_level: "ADVANCED" | "GROWING" | "DEVELOPING"
    non_digital_opportunity: number
    recommendation: string
  }
}

export interface ProfileCompletenessAnalysis {
  completeness_data: {
    total_applications: number
    average_completeness_percentage: number
    fully_complete_profiles: number
    above_80_percent: number
    below_50_percent: number
    field_completion_rates: Record<string, number>
  }
  insights: {
    overall_health: "GOOD" | "MODERATE" | "NEEDS_IMPROVEMENT"
    weakest_fields: string[]
    strongest_fields: string[]
    improvement_priority: string | null
    fully_complete_rate: number
  }
}

export interface ApiStatus {
  message: string
  status: string
  version: string
}

export interface CountResponse {
  total_applications: number
}

// Health check
export async function getApiStatus(): Promise<ApiStatus> {
  const res = await fetch(`${API_BASE_URL}/`)
  if (!res.ok) throw new Error("Failed to fetch API status")
  return res.json()
}

// Get all applications
export async function getAllApplications(): Promise<AccountApplication[]> {
  const res = await fetch(`${API_BASE_URL}/account-applications`)
  if (!res.ok) throw new Error("Failed to fetch applications")
  return res.json()
}

// Get paginated applications
export async function getPaginatedApplications(skip = 0, limit = 10): Promise<AccountApplication[]> {
  const res = await fetch(`${API_BASE_URL}/account-applications/paginated?skip=${skip}&limit=${limit}`)
  if (!res.ok) throw new Error("Failed to fetch applications")
  return res.json()
}

// Get application by ID
export async function getApplicationById(id: number): Promise<AccountApplication> {
  const res = await fetch(`${API_BASE_URL}/account-applications/${id}`)
  if (!res.ok) throw new Error("Application not found")
  return res.json()
}

// Create application
export async function createApplication(
  data: Omit<AccountApplication, "id" | "account_no" | "iban">,
): Promise<AccountApplication> {
  const res = await fetch(`${API_BASE_URL}/account-applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    console.error("API Error:", res.status, errorData)
    if (errorData?.detail) {
      // FastAPI validation error format
      if (Array.isArray(errorData.detail)) {
        const messages = errorData.detail.map((err: { loc: string[], msg: string }) => 
          `${err.loc.join('.')}: ${err.msg}`
        ).join(', ')
        throw new Error(`Validation Error: ${messages}`)
      }
      throw new Error(errorData.detail)
    }
    throw new Error(`Failed to create application (${res.status})`)
  }
  return res.json()
}

// Update application
export async function updateApplication(id: number, data: AccountApplication): Promise<AccountApplication> {
  const res = await fetch(`${API_BASE_URL}/account-applications/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update application")
  return res.json()
}

// Delete application
export async function deleteApplication(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/account-applications/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Failed to delete application")
}

// Get count
export async function getApplicationsCount(): Promise<CountResponse> {
  const res = await fetch(`${API_BASE_URL}/account-applications/count`)
  if (!res.ok) throw new Error("Failed to fetch count")
  return res.json()
}

// Search by CNIC
export async function searchByCnic(cnic: string): Promise<AccountApplication> {
  const res = await fetch(`${API_BASE_URL}/account-applications/search/cnic/${encodeURIComponent(cnic)}`)
  if (!res.ok) throw new Error("Application not found")
  return res.json()
}

// Search by account type
export async function searchByAccountType(type: string): Promise<AccountApplication[]> {
  const res = await fetch(`${API_BASE_URL}/account-applications/search/account-type/${type}`)
  if (!res.ok) throw new Error("Failed to search by account type")
  return res.json()
}

// Search by city
export async function searchByCity(city: string): Promise<AccountApplication[]> {
  const res = await fetch(`${API_BASE_URL}/account-applications/search/city/${encodeURIComponent(city)}`)
  if (!res.ok) throw new Error("Failed to search by city")
  return res.json()
}

// Search by account number
export async function searchByAccountNumber(accountNo: string): Promise<AccountApplication> {
  const res = await fetch(`${API_BASE_URL}/account-applications/search/account-number/${accountNo}`)
  if (!res.ok) throw new Error("Application not found")
  return res.json()
}

// Search by IBAN
export async function searchByIban(iban: string): Promise<AccountApplication> {
  const res = await fetch(`${API_BASE_URL}/account-applications/search/iban/${encodeURIComponent(iban)}`)
  if (!res.ok) throw new Error("Application not found")
  return res.json()
}

// Analytics API Functions

// Get Dashboard Summary
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const res = await fetch(`${API_BASE_URL}/analytics/dashboard`)
  if (!res.ok) throw new Error("Failed to fetch dashboard summary")
  return res.json()
}

// Get Account Types Analytics
export async function getAccountTypesAnalytics(): Promise<AnalyticsBreakdown> {
  const res = await fetch(`${API_BASE_URL}/analytics/account-types`)
  if (!res.ok) throw new Error("Failed to fetch account types analytics")
  return res.json()
}

// Get Cities Analytics
export async function getCitiesAnalytics(): Promise<AnalyticsBreakdown> {
  const res = await fetch(`${API_BASE_URL}/analytics/cities`)
  if (!res.ok) throw new Error("Failed to fetch cities analytics")
  return res.json()
}

// Get Gender Analytics
export async function getGenderAnalytics(): Promise<AnalyticsBreakdown> {
  const res = await fetch(`${API_BASE_URL}/analytics/gender`)
  if (!res.ok) throw new Error("Failed to fetch gender analytics")
  return res.json()
}

// Get Occupation Analytics
export async function getOccupationAnalytics(): Promise<AnalyticsBreakdown> {
  const res = await fetch(`${API_BASE_URL}/analytics/occupation`)
  if (!res.ok) throw new Error("Failed to fetch occupation analytics")
  return res.json()
}

// Get Card Types Analytics
export async function getCardTypesAnalytics(): Promise<AnalyticsBreakdown> {
  const res = await fetch(`${API_BASE_URL}/analytics/card-types`)
  if (!res.ok) throw new Error("Failed to fetch card types analytics")
  return res.json()
}

// Get Card Networks Analytics
export async function getCardNetworksAnalytics(): Promise<AnalyticsBreakdown> {
  const res = await fetch(`${API_BASE_URL}/analytics/card-networks`)
  if (!res.ok) throw new Error("Failed to fetch card networks analytics")
  return res.json()
}

// Get Marital Status Analytics
export async function getMaritalStatusAnalytics(): Promise<AnalyticsBreakdown> {
  const res = await fetch(`${API_BASE_URL}/analytics/marital-status`)
  if (!res.ok) throw new Error("Failed to fetch marital status analytics")
  return res.json()
}

// Get Residential Status Analytics
export async function getResidentialStatusAnalytics(): Promise<AnalyticsBreakdown> {
  const res = await fetch(`${API_BASE_URL}/analytics/residential-status`)
  if (!res.ok) throw new Error("Failed to fetch residential status analytics")
  return res.json()
}

// Get Services Analytics
export async function getServicesAnalytics(): Promise<ServicesAnalytics> {
  const res = await fetch(`${API_BASE_URL}/analytics/services`)
  if (!res.ok) throw new Error("Failed to fetch services analytics")
  return res.json()
}

// Get Next of Kin Analytics
export async function getNextOfKinAnalytics(): Promise<AnalyticsBreakdown> {
  const res = await fetch(`${API_BASE_URL}/analytics/next-of-kin`)
  if (!res.ok) throw new Error("Failed to fetch next of kin analytics")
  return res.json()
}

// Advanced Analytics

// Get Executive Summary
export async function getExecutiveSummary(): Promise<ExecutiveSummary> {
  const res = await fetch(`${API_BASE_URL}/analytics/executive-summary`)
  if (!res.ok) throw new Error("Failed to fetch executive summary")
  return res.json()
}

// Get Financial Insights
export async function getFinancialInsights(): Promise<FinancialInsights> {
  const res = await fetch(`${API_BASE_URL}/analytics/financial-insights`)
  if (!res.ok) throw new Error("Failed to fetch financial insights")
  return res.json()
}

// Get City Performance
export async function getCityPerformance(): Promise<CityPerformance> {
  const res = await fetch(`${API_BASE_URL}/analytics/city-performance`)
  if (!res.ok) throw new Error("Failed to fetch city performance")
  return res.json()
}

// Get Customer Segments
export async function getCustomerSegments(): Promise<CustomerSegmentation> {
  const res = await fetch(`${API_BASE_URL}/analytics/customer-segments`)
  if (!res.ok) throw new Error("Failed to fetch customer segments")
  return res.json()
}

// Get Digital Banking Insights
export async function getDigitalBankingInsights(): Promise<DigitalBankingInsights> {
  const res = await fetch(`${API_BASE_URL}/analytics/digital-banking`)
  if (!res.ok) throw new Error("Failed to fetch digital banking insights")
  return res.json()
}

// Get Profile Completeness
export async function getProfileCompleteness(): Promise<ProfileCompletenessAnalysis> {
  const res = await fetch(`${API_BASE_URL}/analytics/profile-completeness`)
  if (!res.ok) throw new Error("Failed to fetch profile completeness")
  return res.json()
}
