"use client"

import useSWR from "swr"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getApiStatus, getApplicationsCount, getPaginatedApplications } from "@/lib/api"
import { FileText, Users, CreditCard, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const { data: status } = useSWR("api-status", getApiStatus)
  const { data: countData } = useSWR("applications-count", getApplicationsCount)
  const { data: recentApps } = useSWR("recent-applications", () => getPaginatedApplications(0, 5))

  const stats = [
    {
      title: "Total Applications",
      value: countData?.total_applications ?? 0,
      icon: FileText,
      change: "+12%",
      trend: "up",
    },
    {
      title: "Active Accounts",
      value: Math.floor((countData?.total_applications ?? 0) * 0.85),
      icon: Users,
      change: "+8%",
      trend: "up",
    },
    {
      title: "Pending Review",
      value: Math.floor((countData?.total_applications ?? 0) * 0.1),
      icon: CreditCard,
      change: "-5%",
      trend: "down",
    },
    {
      title: "API Status",
      value: status?.status === "API is running" ? "Online" : "Offline",
      icon: Activity,
      change: status?.version ?? "v1.0.0",
      trend: "up",
    },
  ]

  return (
    <div className="min-h-screen">
      <Header title="Dashboard" description="Overview of account applications" />
      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                  <div className="flex items-center text-xs">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="mr-1 h-3 w-3 text-primary" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-3 w-3 text-destructive" />
                    )}
                    <span className={stat.trend === "up" ? "text-primary" : "text-destructive"}>{stat.change}</span>
                    <span className="ml-1 text-muted-foreground">from last month</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-card-foreground">Recent Applications</CardTitle>
              <Link href="/applications">
                <Button variant="ghost" size="sm" className="text-primary">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApps?.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{app.name}</p>
                        <p className="text-sm text-muted-foreground">{app.cnic_no}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        {app.account_type ?? "SAVINGS"}
                      </Badge>
                      <p className="mt-1 text-xs text-muted-foreground">{app.city ?? "N/A"}</p>
                    </div>
                  </div>
                )) ?? <p className="text-center text-muted-foreground">No applications found</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Link href="/applications/new">
                <Button className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90">
                  <FileText className="mr-2 h-4 w-4" />
                  Create New Application
                </Button>
              </Link>
              <Link href="/search">
                <Button
                  variant="outline"
                  className="w-full justify-start border-border text-foreground hover:bg-secondary bg-transparent"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Search Applications
                </Button>
              </Link>
              <Link href="/applications">
                <Button
                  variant="outline"
                  className="w-full justify-start border-border text-foreground hover:bg-secondary bg-transparent"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  View All Applications
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
