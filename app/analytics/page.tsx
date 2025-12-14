"use client"

import { useState } from "react"
import useSWR from "swr"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { getAllApplications } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, BarChart3, TrendingUp, Users, PieChart, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: applications, isLoading, error, mutate } = useSWR("all-applications", getAllApplications)

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 transition-all duration-300 md:pl-72">
        <Header 
          title="Analytics" 
          description="Comprehensive data insights and visualizations"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="p-4 md:p-6 space-y-6">
          {/* Analytics Header */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-violet-500/20 via-primary/10 to-transparent p-6 md:p-8 gradient-border">
            <div className="relative z-10">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-violet-400" />
                    <span className="text-sm font-medium text-violet-400">Analytics Dashboard</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Business Intelligence
                  </h2>
                  <p className="text-muted-foreground max-w-lg">
                    Deep dive into your application data with real-time analytics and insights
                  </p>
                </div>
                <Button 
                  onClick={() => mutate()}
                  variant="outline" 
                  className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10 rounded-xl"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Data
                </Button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>

          {/* Quick Stats */}
          {applications && (
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              <Card className="bg-linear-to-br from-emerald-500/20 to-emerald-500/5 border-border stat-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                      <TrendingUp className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Records</p>
                      <p className="text-2xl font-bold text-card-foreground">{applications.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-linear-to-br from-violet-500/20 to-violet-500/5 border-border stat-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-violet-500/20">
                      <PieChart className="h-5 w-5 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Account Types</p>
                      <p className="text-2xl font-bold text-card-foreground">
                        {new Set(applications.map(a => a.account_type)).size}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-linear-to-br from-cyan-500/20 to-cyan-500/5 border-border stat-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/20">
                      <Users className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Cities Covered</p>
                      <p className="text-2xl font-bold text-card-foreground">
                        {new Set(applications.map(a => a.city)).size}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-linear-to-br from-amber-500/20 to-amber-500/5 border-border stat-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20">
                      <BarChart3 className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Digital Users</p>
                      <p className="text-2xl font-bold text-card-foreground">
                        {applications.filter(a => a.internet_banking || a.mobile_banking).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Charts */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading analytics data...</p>
            </div>
          ) : error ? (
            <Card className="bg-card border-border">
              <CardContent className="flex flex-col items-center justify-center h-64 gap-4">
                <p className="text-red-400">Failed to load analytics data</p>
                <Button onClick={() => mutate()} variant="outline" className="rounded-xl">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : applications && applications.length > 0 ? (
            <AnalyticsCharts applications={applications} />
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                No data available for analytics
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
