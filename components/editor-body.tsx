"use client"

import { NodePaletteSidebar } from "./node-palette-sidebar"
import { WorkflowCanvas } from "./workflow-canvas"
import { NodeConfigPanel } from "./node-config-panel"
import { useWorkflowStore } from "@/lib/workflow-store"

export function EditorBody() {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId)

  return (
    <div className="flex flex-1 overflow-hidden">
      <NodePaletteSidebar />
      <div className="flex-1">
        <WorkflowCanvas />
      </div>
      {selectedNodeId && <NodeConfigPanel />}
    </div>
  )
}
