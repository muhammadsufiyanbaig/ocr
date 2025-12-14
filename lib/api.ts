const API_BASE_URL = "https://ds-ocr-project.vercel.app"

export interface AccountApplication {
  id?: number
  account_no?: string
  iban?: string
  date?: string
  branch_city?: string
  branch_code?: string
  sbp_code?: string
  account_type?: "CURRENT" | "SAVINGS" | "AHU_LAT"
  title_of_account: string
  name: string
  name_on_card?: string
  cnic_no: string
  fathers_husbands_name?: string
  mothers_name?: string
  marital_status?: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED"
  gender?: "MALE" | "FEMALE" | "OTHER"
  nationality?: string
  place_of_birth?: string
  date_of_birth?: string
  cnic_expiry_date?: string
  house_no_block_street?: string
  area_location?: string
  city?: string
  postal_code?: string
  occupation?: "SERVICE_GOVT" | "SERVICE_PRIVATE" | "FARMER" | "HOUSE_WIFE" | "STUDENT" | "OTHER"
  occupation_other?: string
  purpose_of_account?: string
  source_of_income?: string
  expected_monthly_turnover_dr?: number
  expected_monthly_turnover_cr?: number
  residential_status?: "HOUSE_OWNED" | "RENTAL" | "FAMILY" | "OTHER"
  residential_status_other?: string
  residing_since?: string
  next_of_kin_name?: string
  next_of_kin_relation?: string
  next_of_kin_cnic?: string
  next_of_kin_relationship?: string
  next_of_kin_contact_no?: string
  next_of_kin_address?: string
  next_of_kin_email?: string
  internet_banking?: boolean
  mobile_banking?: boolean
  check_book?: boolean
  sms_alerts?: boolean
  card_type_gold?: boolean
  card_type_classic?: boolean
  zakat_deduction?: boolean
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
