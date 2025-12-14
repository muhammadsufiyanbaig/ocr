"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, PlusCircle, Search, Building2, X, Sparkles, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/applications", label: "Applications", icon: FileText },
  { href: "/applications/new", label: "New Application", icon: PlusCircle },
  { href: "/search", label: "Search", icon: Search },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        "fixed left-0 top-0 z-50 h-screen w-72 border-r border-sidebar-border bg-sidebar transition-transform duration-300 ease-in-out",
        "md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 glow-primary">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-sidebar-foreground">DS-OCR Bank</span>
                <span className="text-[10px] text-muted-foreground">Account Management</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="rounded-lg p-2 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1.5 p-4">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Menu
            </p>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary glow-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive ? "text-primary" : "group-hover:scale-110"
                  )} />
                  {item.label}
                  {isActive && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Status Card */}
          <div className="border-t border-sidebar-border p-4">
            <div className="rounded-xl bg-linear-to-br from-primary/20 via-primary/10 to-transparent p-4 gradient-border">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-sidebar-foreground">API Status</p>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-sm font-medium text-primary">Connected</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Version 1.0.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
