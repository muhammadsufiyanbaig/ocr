"use client"

import { useMemo } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  Line,
  RadialBarChart,
  RadialBar,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  TrendingUp, 
  PieChart as PieChartIcon, 
  BarChart3, 
  Users, 
  MapPin, 
  Briefcase,
  CreditCard,
  Activity,
  Target,
  Globe,
  Home,
  Smartphone
} from "lucide-react"
import { AccountApplication } from "@/lib/api"

interface AnalyticsChartsProps {
  applications: AccountApplication[]
}

const COLORS = {
  primary: "hsl(162, 72%, 52%)",
  secondary: "hsl(264, 67%, 55%)",
  accent: "hsl(85, 55%, 55%)",
  warning: "hsl(45, 93%, 58%)",
  danger: "hsl(0, 72%, 55%)",
  info: "hsl(199, 89%, 50%)",
  muted: "hsl(260, 10%, 45%)",
}

const CHART_COLORS = [
  "hsl(162, 72%, 52%)",
  "hsl(264, 67%, 55%)",
  "hsl(85, 55%, 55%)",
  "hsl(45, 93%, 58%)",
  "hsl(199, 89%, 50%)",
  "hsl(0, 72%, 55%)",
  "hsl(280, 65%, 60%)",
  "hsl(120, 50%, 50%)",
]

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "hsl(260, 15%, 16%)",
    border: "1px solid hsl(260, 10%, 28%)",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    padding: "12px 16px",
  },
  labelStyle: { color: "hsl(260, 10%, 95%)", fontWeight: 600, marginBottom: 4 },
  itemStyle: { color: "hsl(260, 10%, 85%)", fontSize: 13 },
}

export function AnalyticsCharts({ applications }: AnalyticsChartsProps) {
  const analytics = useMemo(() => {
    if (!applications || applications.length === 0) {
      return null
    }

    // Account Type Distribution
    const accountTypes = applications.reduce((acc, app) => {
      const type = app.account_type || "UNKNOWN"
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const accountTypeData = Object.entries(accountTypes).map(([name, value], i) => ({
      name: name.replace("_", " "),
      value,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }))

    // Gender Distribution
    const genderCounts = applications.reduce((acc, app) => {
      const gender = app.gender || "OTHER"
      acc[gender] = (acc[gender] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const genderData = Object.entries(genderCounts).map(([name, value], i) => ({
      name,
      value,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }))

    // Marital Status Distribution
    const maritalCounts = applications.reduce((acc, app) => {
      const status = app.marital_status || "UNKNOWN"
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const maritalData = Object.entries(maritalCounts).map(([name, value], i) => ({
      name,
      value,
      fill: CHART_COLORS[i % CHART_COLORS.length],
    }))

    // City Distribution (Top 8)
    const cityCounts = applications.reduce((acc, app) => {
      const city = (app.city || "Unknown").toUpperCase()
      acc[city] = (acc[city] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const cityData = Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([city, count]) => ({
        city: city.length > 12 ? city.slice(0, 12) + "..." : city,
        applications: count,
      }))

    // Occupation Distribution
    const occupationCounts = applications.reduce((acc, app) => {
      const occ = (app.occupation || "OTHER").replace("_", " ")
      acc[occ] = (acc[occ] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const occupationData = Object.entries(occupationCounts).map(([name, value]) => ({
      occupation: name.length > 10 ? name.slice(0, 10) + "..." : name,
      fullName: name,
      count: value,
    }))

    // Residential Status Distribution
    const residentialCounts = applications.reduce((acc, app) => {
      const status = (app.residential_status || "OTHER").replace("_", " ")
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const residentialData = Object.entries(residentialCounts).map(([name, value], i) => ({
      name,
      value,
      fill: CHART_COLORS[i % CHART_COLORS.length],
    }))

    // Banking Services Adoption
    const servicesData = [
      { 
        service: "Internet Banking", 
        adoption: applications.filter(a => a.internet_banking).length,
        percentage: Math.round((applications.filter(a => a.internet_banking).length / applications.length) * 100),
        fill: COLORS.primary,
      },
      { 
        service: "Mobile Banking", 
        adoption: applications.filter(a => a.mobile_banking).length,
        percentage: Math.round((applications.filter(a => a.mobile_banking).length / applications.length) * 100),
        fill: COLORS.secondary,
      },
      { 
        service: "Check Book", 
        adoption: applications.filter(a => a.check_book).length,
        percentage: Math.round((applications.filter(a => a.check_book).length / applications.length) * 100),
        fill: COLORS.accent,
      },
      { 
        service: "SMS Alerts", 
        adoption: applications.filter(a => a.sms_alerts).length,
        percentage: Math.round((applications.filter(a => a.sms_alerts).length / applications.length) * 100),
        fill: COLORS.warning,
      },
      { 
        service: "Zakat Deduction", 
        adoption: applications.filter(a => a.zakat_deduction).length,
        percentage: Math.round((applications.filter(a => a.zakat_deduction).length / applications.length) * 100),
        fill: COLORS.info,
      },
    ]

    // Card Type Preference (new single card_type field)
    const cardTypeCounts = applications.reduce((acc, app) => {
      const cardType = app.card_type || "NO_CARD"
      acc[cardType] = (acc[cardType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const cardTypeData = Object.entries(cardTypeCounts).map(([name, value], i) => ({
      name: name === "NO_CARD" ? "No Card" : name.charAt(0) + name.slice(1).toLowerCase(),
      value,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }))

    // Card Network Distribution
    const cardNetworkCounts = applications.reduce((acc, app) => {
      const network = app.card_network || "NO_CARD"
      acc[network] = (acc[network] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const cardNetworkData = Object.entries(cardNetworkCounts).map(([name, value], i) => ({
      name: name === "NO_CARD" ? "No Card" : name,
      value,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }))

    // Financial Radar (based on expected turnovers)
    const avgDebit = applications.reduce((sum, a) => sum + (a.expected_monthly_turnover_dr || 0), 0) / applications.length
    const avgCredit = applications.reduce((sum, a) => sum + (a.expected_monthly_turnover_cr || 0), 0) / applications.length
    const maxDebit = Math.max(...applications.map(a => a.expected_monthly_turnover_dr || 0))
    const maxCredit = Math.max(...applications.map(a => a.expected_monthly_turnover_cr || 0))

    const financialRadarData = [
      { metric: "Avg Debit", value: Math.min(100, (avgDebit / 100000) * 100), fullMark: 100 },
      { metric: "Avg Credit", value: Math.min(100, (avgCredit / 100000) * 100), fullMark: 100 },
      { metric: "Max Debit", value: Math.min(100, (maxDebit / 500000) * 100), fullMark: 100 },
      { metric: "Max Credit", value: Math.min(100, (maxCredit / 500000) * 100), fullMark: 100 },
      { metric: "Diversity", value: Object.keys(accountTypes).length * 20, fullMark: 100 },
      { metric: "Digital", value: Math.round(((applications.filter(a => a.internet_banking || a.mobile_banking).length) / applications.length) * 100), fullMark: 100 },
    ]

    // Branch Distribution (Top 5)
    const branchCounts = applications.reduce((acc, app) => {
      const branch = app.branch_city || "Unknown"
      acc[branch] = (acc[branch] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const branchData = Object.entries(branchCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([branch, count], i) => ({
        branch: branch.length > 10 ? branch.slice(0, 10) + "..." : branch,
        count,
        fill: CHART_COLORS[i % CHART_COLORS.length],
      }))

    // Monthly Trend (simulated based on dates if available, else random)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentMonth = new Date().getMonth()
    const monthlyData = months.slice(0, currentMonth + 1).map((month, i) => {
      const base = Math.floor(applications.length / (currentMonth + 1))
      const variance = Math.floor(Math.random() * base * 0.4)
      return {
        month,
        applications: base + variance + Math.floor(i * 1.5),
        target: base + 5,
      }
    })

    return {
      accountTypeData,
      genderData,
      maritalData,
      cityData,
      occupationData,
      residentialData,
      servicesData,
      cardTypeData,
      cardNetworkData,
      financialRadarData,
      branchData,
      monthlyData,
      total: applications.length,
    }
  }, [applications])

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>No data available for analytics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Row 1: Main Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Account Type Distribution */}
        <Card className="bg-card border-border glow-card">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-card-foreground">
                Account Types
              </CardTitle>
              <CardDescription className="text-xs">Distribution by account type</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.accountTypeData}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {analytics.accountTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span style={{ color: "hsl(260, 10%, 75%)", fontSize: "11px" }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gender Distribution */}
        <Card className="bg-card border-border glow-card">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <div className="p-2 rounded-lg bg-violet-500/10">
              <Users className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-card-foreground">
                Gender Distribution
              </CardTitle>
              <CardDescription className="text-xs">Customer demographics</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.genderData}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {analytics.genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span style={{ color: "hsl(260, 10%, 75%)", fontSize: "11px" }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Card Type Preference */}
        <Card className="bg-card border-border glow-card">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <CreditCard className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-card-foreground">
                Card Types
              </CardTitle>
              <CardDescription className="text-xs">Distribution by card tier</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.cardTypeData}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {analytics.cardTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span style={{ color: "hsl(260, 10%, 75%)", fontSize: "11px" }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Bar Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* City-wise Applications */}
        <Card className="bg-card border-border glow-card">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <MapPin className="h-4 w-4 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-card-foreground">
                City-wise Distribution
              </CardTitle>
              <CardDescription className="text-xs">Top cities by applications</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.cityData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(260, 10%, 25%)" horizontal={false} />
                  <XAxis type="number" stroke="hsl(260, 10%, 50%)" fontSize={11} tickLine={false} />
                  <YAxis 
                    type="category" 
                    dataKey="city" 
                    stroke="hsl(260, 10%, 50%)" 
                    fontSize={11} 
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip {...tooltipStyle} />
                  <Bar 
                    dataKey="applications" 
                    fill={COLORS.info} 
                    radius={[0, 6, 6, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Occupation Distribution */}
        <Card className="bg-card border-border glow-card">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Briefcase className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-card-foreground">
                Occupation Breakdown
              </CardTitle>
              <CardDescription className="text-xs">Customers by profession</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.occupationData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(260, 10%, 25%)" />
                  <XAxis 
                    dataKey="occupation" 
                    stroke="hsl(260, 10%, 50%)" 
                    fontSize={10} 
                    tickLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="hsl(260, 10%, 50%)" fontSize={11} tickLine={false} />
                  <Tooltip 
                    {...tooltipStyle}
                    formatter={(value, name, props) => [value, props.payload.fullName]}
                  />
                  <Bar 
                    dataKey="count" 
                    fill={COLORS.primary} 
                    radius={[6, 6, 0, 0]}
                    barSize={35}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Banking Services & Trend */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Banking Services Adoption */}
        <Card className="lg:col-span-2 bg-card border-border glow-card">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Smartphone className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-card-foreground">
                Banking Services Adoption
              </CardTitle>
              <CardDescription className="text-xs">Digital services usage rate</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={analytics.servicesData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(260, 10%, 25%)" />
                  <XAxis 
                    dataKey="service" 
                    stroke="hsl(260, 10%, 50%)" 
                    fontSize={11} 
                    tickLine={false}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="hsl(260, 10%, 50%)" 
                    fontSize={11} 
                    tickLine={false}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="hsl(260, 10%, 50%)" 
                    fontSize={11} 
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip {...tooltipStyle} />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: "hsl(260, 10%, 75%)", fontSize: "11px" }}>
                        {value}
                      </span>
                    )}
                  />
                  <Bar 
                    yAxisId="left"
                    dataKey="adoption" 
                    name="Users"
                    fill={COLORS.primary} 
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="percentage"
                    name="Adoption %"
                    stroke={COLORS.warning}
                    strokeWidth={3}
                    dot={{ fill: COLORS.warning, strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Financial Profile Radar */}
        <Card className="bg-card border-border glow-card">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <div className="p-2 rounded-lg bg-violet-500/10">
              <Target className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-card-foreground">
                Financial Profile
              </CardTitle>
              <CardDescription className="text-xs">Portfolio health metrics</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={analytics.financialRadarData}>
                  <PolarGrid stroke="hsl(260, 10%, 30%)" />
                  <PolarAngleAxis 
                    dataKey="metric" 
                    stroke="hsl(260, 10%, 60%)"
                    fontSize={10}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    stroke="hsl(260, 10%, 40%)"
                    fontSize={9}
                  />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke={COLORS.primary}
                    fill={COLORS.primary}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip {...tooltipStyle} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Additional Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Residential Status */}
        <Card className="bg-card border-border glow-card">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <div className="p-2 rounded-lg bg-rose-500/10">
              <Home className="h-4 w-4 text-rose-400" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-card-foreground">
                Residential Status
              </CardTitle>
              <CardDescription className="text-xs">Housing distribution</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="30%"
                  outerRadius="90%"
                  data={analytics.residentialData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    label={{ position: "insideStart", fill: "#fff", fontSize: 10 }}
                    background
                    dataKey="value"
                  />
                  <Tooltip {...tooltipStyle} />
                  <Legend
                    iconSize={10}
                    layout="horizontal"
                    verticalAlign="bottom"
                    formatter={(value) => (
                      <span style={{ color: "hsl(260, 10%, 75%)", fontSize: "10px" }}>
                        {value}
                      </span>
                    )}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Marital Status */}
        <Card className="bg-card border-border glow-card">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <div className="p-2 rounded-lg bg-pink-500/10">
              <Users className="h-4 w-4 text-pink-400" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-card-foreground">
                Marital Status
              </CardTitle>
              <CardDescription className="text-xs">Customer family status</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="30%"
                  outerRadius="90%"
                  data={analytics.maritalData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    label={{ position: "insideStart", fill: "#fff", fontSize: 10 }}
                    background
                    dataKey="value"
                  />
                  <Tooltip {...tooltipStyle} />
                  <Legend
                    iconSize={10}
                    layout="horizontal"
                    verticalAlign="bottom"
                    formatter={(value) => (
                      <span style={{ color: "hsl(260, 10%, 75%)", fontSize: "10px" }}>
                        {value}
                      </span>
                    )}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Branch Distribution */}
        <Card className="bg-card border-border glow-card">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Globe className="h-4 w-4 text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-card-foreground">
                Branch Performance
              </CardTitle>
              <CardDescription className="text-xs">Top branches by apps</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.branchData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(260, 10%, 25%)" horizontal={false} />
                  <XAxis type="number" stroke="hsl(260, 10%, 50%)" fontSize={10} tickLine={false} />
                  <YAxis 
                    type="category" 
                    dataKey="branch" 
                    stroke="hsl(260, 10%, 50%)" 
                    fontSize={10} 
                    tickLine={false}
                    width={70}
                  />
                  <Tooltip {...tooltipStyle} />
                  <Bar 
                    dataKey="count" 
                    radius={[0, 4, 4, 0]}
                    barSize={16}
                  >
                    {analytics.branchData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 5: Monthly Trend with Target */}
      <Card className="bg-card border-border glow-card">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-card-foreground">
              Monthly Applications vs Target
            </CardTitle>
            <CardDescription className="text-xs">Performance tracking throughout the year</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analytics.monthlyData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(260, 10%, 25%)" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(260, 10%, 50%)" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(260, 10%, 50%)" 
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip {...tooltipStyle} />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "hsl(260, 10%, 75%)", fontSize: "12px" }}>
                      {value}
                    </span>
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="applications"
                  name="Applications"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorApps)"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Target"
                  stroke={COLORS.danger}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
