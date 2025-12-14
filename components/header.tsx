"use client"

import { Bell, Menu, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  title: string
  description?: string
  onMenuClick?: () => void
}

export function Header({ title, description, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-foreground md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-foreground md:text-xl">{title}</h1>
            <Sparkles className="h-4 w-4 text-primary hidden sm:block" />
          </div>
          {description && <p className="text-xs text-muted-foreground md:text-sm">{description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
        </Button>
      </div>
    </header>
  )
}
