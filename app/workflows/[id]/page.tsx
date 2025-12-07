"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { getWorkflow, updateWorkflow } from "@/lib/workflows-client"
import { useWorkflowStore } from "@/lib/workflow-store"
import { EditorTopBar } from "@/components/editor-top-bar"
import { EditorBody } from "@/components/editor-body"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"


export default function WorkflowEditorPage() {
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const initFromWorkflow = useWorkflowStore((s) => s.initFromWorkflow)
  const getWorkflowSnapshot = useWorkflowStore((s) => s.getWorkflowSnapshot)
  const markClean = useWorkflowStore((s) => s.markClean)
  const isDirty = useWorkflowStore((s) => s.isDirty)
  const workflow = useWorkflowStore((s) => s.workflow)

  useEffect(() => {
    const load = async () => {
      const wf = await getWorkflow(id)
      if (!wf) {
        setNotFound(true)
      } else {
        initFromWorkflow(wf)
      }
      setLoading(false)
    }
    load()
  }, [id, initFromWorkflow])

  const handleSave = async () => {
    const snapshot = getWorkflowSnapshot()
    if (!snapshot) return

    setSaving(true)
    await updateWorkflow(snapshot)
    markClean()
    setSaving(false)
  }

  const handleRun = () => {
    const snapshot = getWorkflowSnapshot()
    if (snapshot) {
      console.log("Workflow JSON:", JSON.stringify(snapshot, null, 2))
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">Workflow not found</p>
        <Button onClick={() => router.push("/workflows")}>Back to Workflows</Button>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <EditorTopBar
        workflowName={workflow?.name || ""}
        isDirty={isDirty}
        saving={saving}
        onSave={handleSave}
        onRun={handleRun}
      />
      <EditorBody />
    </div>
  )
}
