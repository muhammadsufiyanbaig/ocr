"use client"

import { useState } from "react"
import useSWR from "swr"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardCharts, generateMockStats } from "@/components/dashboard-charts"
import { getApiStatus, getApplicationsCount, getPaginatedApplications } from "@/lib/api"
import { FileText, Users, CreditCard, Activity, ArrowUpRight, ArrowDownRight, Sparkles, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: status } = useSWR("api-status", getApiStatus)
  const { data: countData } = useSWR("applications-count", getApplicationsCount)
  const { data: recentApps } = useSWR("recent-applications", () => getPaginatedApplications(0, 5))

  const totalApps = countData?.total_applications ?? 0
  const chartStats = generateMockStats(totalApps)

  const stats = [
    {
      title: "Total Applications",
      value: totalApps,
      icon: FileText,
      change: "+12%",
      trend: "up",
      color: "from-emerald-500/20 to-emerald-500/5",
      iconColor: "text-emerald-400",
    },
    {
      title: "Active Accounts",
      value: Math.floor(totalApps * 0.85),
      icon: Users,
      change: "+8%",
      trend: "up",
      color: "from-violet-500/20 to-violet-500/5",
      iconColor: "text-violet-400",
    },
    {
      title: "Pending Review",
      value: Math.floor(totalApps * 0.1),
      icon: CreditCard,
      change: "-5%",
      trend: "down",
      color: "from-amber-500/20 to-amber-500/5",
      iconColor: "text-amber-400",
    },
    {
      title: "API Status",
      value: status?.status === "API is running" ? "Online" : "Offline",
      icon: Activity,
      change: status?.version ?? "v1.0.0",
      trend: "up",
      color: "from-cyan-500/20 to-cyan-500/5",
      iconColor: "text-cyan-400",
    },
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 transition-all duration-300 md:pl-72">
        <Header 
          title="Dashboard" 
          description="Overview of account applications"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="p-4 md:p-6 space-y-6">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-primary/20 via-primary/10 to-transparent p-6 md:p-8 gradient-border">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Welcome back</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                DS-OCR Banking Dashboard
              </h2>
              <p className="text-muted-foreground max-w-lg">
                Manage your bank account applications with OCR-powered document processing
              </p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card 
                  key={stat.title} 
                  className={`bg-linear-to-br ${stat.color} border-border stat-card overflow-hidden relative`}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg bg-background/50 ${stat.iconColor}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl md:text-2xl font-bold text-card-foreground">{stat.value}</div>
                    <div className="flex items-center text-xs mt-1">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-3 w-3 text-red-400" />
                      )}
                      <span className={stat.trend === "up" ? "text-emerald-400" : "text-red-400"}>
                        {stat.change}
                      </span>
                      <span className="ml-1 text-muted-foreground hidden sm:inline">from last month</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Charts Section */}
          <DashboardCharts stats={chartStats} />

          {/* Bottom Section */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Recent Applications */}
            <Card className="bg-card border-border glow-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-semibold text-card-foreground">Recent Applications</CardTitle>
                </div>
                <Link href="/applications">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentApps?.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-3 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-card-foreground truncate">{app.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{app.cnic_no}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                          {app.account_type ?? "SAVINGS"}
                        </Badge>
                        <p className="mt-1 text-xs text-muted-foreground">{app.city ?? "N/A"}</p>
                      </div>
                    </div>
                  )) ?? (
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      No applications found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-card border-border glow-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-semibold text-card-foreground">Quick Actions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Link href="/applications/new">
                  <Button className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-medium rounded-xl">
                    <FileText className="mr-3 h-5 w-5" />
                    Create New Application
                  </Button>
                </Link>
                <Link href="/search">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-border text-foreground hover:bg-secondary bg-transparent h-12 text-base font-medium rounded-xl"
                  >
                    <Users className="mr-3 h-5 w-5" />
                    Search Applications
                  </Button>
                </Link>
                <Link href="/applications">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-border text-foreground hover:bg-secondary bg-transparent h-12 text-base font-medium rounded-xl"
                  >
                    <CreditCard className="mr-3 h-5 w-5" />
                    View All Applications
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
