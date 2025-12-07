"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Loader2, Play } from "lucide-react"

interface EditorTopBarProps {
  workflowName: string
  isDirty: boolean
  saving: boolean
  onSave: () => void
  onRun: () => void
}

export function EditorTopBar({ workflowName, isDirty, saving, onSave, onRun }: EditorTopBarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-4">
        <Link href="/workflows">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-medium">{workflowName}</h1>
          {isDirty && <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">Unsaved</span>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onRun}>
          <Play className="mr-2 h-4 w-4" />
          Run
        </Button>
        <Button size="sm" onClick={onSave} disabled={!isDirty || saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save
        </Button>
      </div>
    </header>
  )
}
