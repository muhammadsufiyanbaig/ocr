"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { ApplicationsTable } from "@/components/application-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  type AccountApplication,
  searchByCnic,
  searchByAccountNumber,
  searchByIban,
  searchByCity,
  searchByAccountType,
} from "@/lib/api"
import { Search, CreditCard, Award as IdCard, Building, MapPin, Loader2 } from "lucide-react"

type SearchType = "cnic" | "account_number" | "iban" | "city" | "account_type"

export default function SearchPage() {
  const [searchType, setSearchType] = useState<SearchType>("cnic")
  const [searchValue, setSearchValue] = useState("")
  const [accountType, setAccountType] = useState<string>("")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<AccountApplication[]>([])
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!searchValue && searchType !== "account_type") {
      setError("Please enter a search value")
      return
    }
    if (searchType === "account_type" && !accountType) {
      setError("Please select an account type")
      return
    }

    setIsSearching(true)
    setError(null)
    setResults([])
    setHasSearched(true)

    try {
      let result: AccountApplication | AccountApplication[]

      switch (searchType) {
        case "cnic":
          result = await searchByCnic(searchValue)
          setResults([result])
          break
        case "account_number":
          result = await searchByAccountNumber(searchValue)
          setResults([result])
          break
        case "iban":
          result = await searchByIban(searchValue)
          setResults([result])
          break
        case "city":
          result = await searchByCity(searchValue.toUpperCase())
          setResults(result)
          break
        case "account_type":
          result = await searchByAccountType(accountType)
          setResults(result)
          break
      }
    } catch {
      setError("No results found")
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const searchConfigs = [
    {
      value: "cnic" as const,
      label: "CNIC",
      icon: IdCard,
      placeholder: "12345-1234567-1",
      description: "Search by CNIC number",
    },
    {
      value: "account_number" as const,
      label: "Account No",
      icon: CreditCard,
      placeholder: "123456789012",
      description: "Search by 12-digit account number",
    },
    {
      value: "iban" as const,
      label: "IBAN",
      icon: Building,
      placeholder: "PK123456789012345678",
      description: "Search by IBAN",
    },
    {
      value: "city" as const,
      label: "City",
      icon: MapPin,
      placeholder: "KARACHI",
      description: "Search by city name",
    },
    {
      value: "account_type" as const,
      label: "Type",
      icon: Search,
      placeholder: "Select account type",
      description: "Search by account type",
    },
  ]

  return (
    <div className="min-h-screen">
      <Header title="Search Applications" description="Search for account applications by various criteria" />
      <div className="p-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Search className="h-5 w-5 text-primary" />
              Search Criteria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={searchType}
              onValueChange={(v) => {
                setSearchType(v as SearchType)
                setSearchValue("")
                setAccountType("")
                setError(null)
                setResults([])
                setHasSearched(false)
              }}
            >
              <TabsList className="mb-6 grid w-full grid-cols-5 bg-secondary">
                {searchConfigs.map((config) => {
                  const Icon = config.icon
                  return (
                    <TabsTrigger
                      key={config.value}
                      value={config.value}
                      className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{config.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              {searchConfigs.map((config) => (
                <TabsContent key={config.value} value={config.value}>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                    <div className="flex gap-4">
                      {config.value === "account_type" ? (
                        <div className="flex-1">
                          <Label className="sr-only">Account Type</Label>
                          <Select value={accountType} onValueChange={setAccountType}>
                            <SelectTrigger className="bg-input border-border text-foreground">
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                              <SelectItem value="CURRENT">Current</SelectItem>
                              <SelectItem value="SAVINGS">Savings</SelectItem>
                              <SelectItem value="AHU_LAT">Ahu Lat</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <Label className="sr-only">{config.label}</Label>
                          <Input
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={config.placeholder}
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                          />
                        </div>
                      )}
                      <Button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {isSearching ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="mr-2 h-4 w-4" />
                        )}
                        Search
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {error && (
              <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {hasSearched && (
          <div className="mt-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Search Results ({results.length})</h2>
            <ApplicationsTable applications={results} />
          </div>
        )}
      </div>
    </div>
  )
}
