"use client"

import { useState } from "react"
import Link from "next/link"
import { type AccountApplication, deleteApplication } from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Eye, Pencil, Trash2, User, CreditCard, MapPin } from "lucide-react"

interface ApplicationsTableProps {
  applications: AccountApplication[]
  onDelete?: () => void
}

export function ApplicationsTable({ applications, onDelete }: ApplicationsTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await deleteApplication(deleteId)
      onDelete?.()
    } catch (error) {
      console.error("Failed to delete:", error)
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const getAccountTypeBadge = (type?: string) => {
    const variants: Record<string, string> = {
      CURRENT: "border-violet-400/30 text-violet-400 bg-violet-400/10",
      SAVINGS: "border-emerald-400/30 text-emerald-400 bg-emerald-400/10",
      AHU_LAT: "border-amber-400/30 text-amber-400 bg-amber-400/10",
    }
    return variants[type ?? "SAVINGS"] ?? variants.SAVINGS
  }

  // Mobile Card View
  const MobileCardView = () => (
    <div className="space-y-3 md:hidden">
      {applications.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="flex items-center justify-center h-32 text-muted-foreground">
            No applications found.
          </CardContent>
        </Card>
      ) : (
        applications.map((app) => (
          <Card key={app.id} className="bg-card border-border glow-card overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{app.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">#{app.id}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border-border">
                    <DropdownMenuItem asChild>
                      <Link href={`/applications/${app.id}`} className="flex items-center">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/applications/${app.id}/edit`} className="flex items-center">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteId(app.id!)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="h-3.5 w-3.5" />
                  <span className="font-mono text-xs truncate">{app.cnic_no}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate">{app.city ?? "N/A"}</span>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <Badge variant="outline" className={getAccountTypeBadge(app.account_type)}>
                  {app.account_type ?? "SAVINGS"}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  {app.account_no ?? "—"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )

  // Desktop Table View
  const DesktopTableView = () => (
    <div className="hidden md:block rounded-xl border border-border overflow-hidden glow-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent bg-secondary/30">
            <TableHead className="text-muted-foreground font-semibold">ID</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Name</TableHead>
            <TableHead className="text-muted-foreground font-semibold">CNIC</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Account No</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Type</TableHead>
            <TableHead className="text-muted-foreground font-semibold">City</TableHead>
            <TableHead className="text-right text-muted-foreground font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No applications found.
              </TableCell>
            </TableRow>
          ) : (
            applications.map((app) => (
              <TableRow key={app.id} className="border-border hover:bg-secondary/30 transition-colors">
                <TableCell className="font-mono text-sm text-muted-foreground">#{app.id}</TableCell>
                <TableCell className="font-medium text-foreground">{app.name}</TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">{app.cnic_no}</TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">{app.account_no ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getAccountTypeBadge(app.account_type)}>
                    {app.account_type ?? "SAVINGS"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{app.city ?? "—"}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                      <DropdownMenuItem asChild>
                        <Link href={`/applications/${app.id}`} className="flex items-center">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/applications/${app.id}/edit`} className="flex items-center">
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteId(app.id!)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <>
      <MobileCardView />
      <DesktopTableView />

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-border max-w-[90vw] sm:max-w-lg rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Application</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete this application? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogCancel className="border-border text-foreground hover:bg-secondary rounded-xl">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
