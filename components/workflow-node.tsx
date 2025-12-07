"use client"

import type React from "react"

import { memo } from "react"
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react"
import { getNodeCatalogItem } from "@/lib/node-catalog"
import { cn } from "@/lib/utils"
import { Webhook, Clock, Globe, Timer, Variable, GitBranch, Repeat, Mail, MessageSquare } from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Webhook,
  Clock,
  Globe,
  Timer,
  Variable,
  GitBranch,
  Repeat,
  Mail,
  MessageSquare,
}

interface WorkflowNodeData {
  label: string
  nodeType: string
  config: Record<string, unknown>
  [key: string]: unknown
}

export const WorkflowNode = memo(function WorkflowNode({ data, selected }: NodeProps<Node<WorkflowNodeData>>) {
  const catalogItem = getNodeCatalogItem(data.nodeType)
  const Icon = catalogItem ? iconMap[catalogItem.icon] || Globe : Globe
  const color = catalogItem?.color || "#3b82f6"
  const inputs = catalogItem?.inputs ?? 1
  const outputs = catalogItem?.outputs ?? 1

  return (
    <div
      className={cn(
        "min-w-[180px] rounded-lg border-2 bg-card shadow-sm transition-shadow",
        selected ? "border-primary shadow-md" : "border-border",
      )}
    >
      {/* Input Handle */}
      {inputs > 0 && (
        <Handle
          type="target"
          position={Position.Top}
          className="!h-3 !w-3 !border-2 !border-background !bg-muted-foreground"
        />
      )}

      {/* Node Content */}
      <div className="flex items-center gap-3 p-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{data.label}</p>
          <p className="truncate text-xs text-muted-foreground">{catalogItem?.description || "Node"}</p>
        </div>
      </div>

      {/* Output Handles */}
      {outputs === 1 && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!h-3 !w-3 !border-2 !border-background !bg-muted-foreground"
        />
      )}
      {outputs === 2 && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            className="!h-3 !w-3 !border-2 !border-background !bg-green-500 !-translate-x-4"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            className="!h-3 !w-3 !border-2 !border-background !bg-red-500 !translate-x-4"
          />
        </>
      )}
    </div>
  )
})
