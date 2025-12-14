"use client"

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
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, PieChart as PieChartIcon, BarChart3 } from "lucide-react"

interface ApplicationStats {
  total: number
  byType: { name: string; value: number; color: string }[]
  monthly: { month: string; applications: number; approved: number }[]
}

interface DashboardChartsProps {
  stats: ApplicationStats
}

const COLORS = {
  primary: "hsl(162, 72%, 52%)",
  secondary: "hsl(264, 67%, 45%)",
  accent: "hsl(85, 55%, 55%)",
  muted: "hsl(260, 10%, 35%)",
}

export function DashboardCharts({ stats }: DashboardChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Area Chart - Applications Trend */}
      <Card className="col-span-full lg:col-span-2 bg-card border-border glow-card">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle className="text-base font-semibold text-card-foreground">
            Applications Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.monthly}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(260, 10%, 25%)" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(260, 10%, 50%)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(260, 10%, 50%)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(260, 15%, 16%)",
                    border: "1px solid hsl(260, 10%, 28%)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                  }}
                  labelStyle={{ color: "hsl(260, 10%, 95%)" }}
                  itemStyle={{ color: "hsl(260, 10%, 85%)" }}
                />
                <Area
                  type="monotone"
                  dataKey="applications"
                  name="Total Applications"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorApplications)"
                />
                <Area
                  type="monotone"
                  dataKey="approved"
                  name="Approved"
                  stroke={COLORS.secondary}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorApproved)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart - Account Types */}
      <Card className="bg-card border-border glow-card">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <PieChartIcon className="h-5 w-5 text-primary" />
          <CardTitle className="text-base font-semibold text-card-foreground">
            Account Types
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.byType}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.byType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(260, 15%, 16%)",
                    border: "1px solid hsl(260, 10%, 28%)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                  }}
                  labelStyle={{ color: "hsl(260, 10%, 95%)" }}
                  itemStyle={{ color: "hsl(260, 10%, 85%)" }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span style={{ color: "hsl(260, 10%, 75%)", fontSize: "12px" }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart - Monthly Comparison */}
      <Card className="col-span-full bg-card border-border glow-card">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle className="text-base font-semibold text-card-foreground">
            Monthly Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.monthly}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(260, 10%, 25%)" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(260, 10%, 50%)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(260, 10%, 50%)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(260, 15%, 16%)",
                    border: "1px solid hsl(260, 10%, 28%)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                  }}
                  labelStyle={{ color: "hsl(260, 10%, 95%)" }}
                  itemStyle={{ color: "hsl(260, 10%, 85%)" }}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "hsl(260, 10%, 75%)", fontSize: "12px" }}>
                      {value}
                    </span>
                  )}
                />
                <Bar 
                  dataKey="applications" 
                  name="Applications" 
                  fill={COLORS.primary} 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="approved" 
                  name="Approved" 
                  fill={COLORS.secondary} 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Generate mock data for demo
export function generateMockStats(totalApplications: number): ApplicationStats {
  const currentMonth = new Date().getMonth()
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  
  const savingsCount = Math.floor(totalApplications * 0.5)
  const currentCount = Math.floor(totalApplications * 0.35)
  const ahuLatCount = totalApplications - savingsCount - currentCount

  return {
    total: totalApplications,
    byType: [
      { name: "Savings", value: savingsCount, color: "hsl(162, 72%, 52%)" },
      { name: "Current", value: currentCount, color: "hsl(264, 67%, 55%)" },
      { name: "Ahu Lat", value: ahuLatCount, color: "hsl(85, 55%, 55%)" },
    ],
    monthly: months.slice(0, currentMonth + 1).map((month, i) => {
      const base = Math.max(5, Math.floor(totalApplications / 12))
      const variance = Math.floor(Math.random() * base * 0.5)
      const apps = base + variance + (i * 2)
      return {
        month,
        applications: apps,
        approved: Math.floor(apps * 0.85),
      }
    }),
  }
}
