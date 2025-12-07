"use client"

import type React from "react"

import { getNodesByCategory } from "@/lib/node-catalog"
import { useWorkflowStore } from "@/lib/workflow-store"
import { cn } from "@/lib/utils"
import { Webhook, Clock, Globe, Timer, Variable, GitBranch, Repeat, Mail, MessageSquare } from "lucide-react"
import type { NodeCatalogItem } from "@/lib/workflow-types"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
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

const categoryLabels: Record<NodeCatalogItem["category"], string> = {
  trigger: "Triggers",
  action: "Actions",
  logic: "Logic",
  integration: "Integrations",
}

const categoryOrder: NodeCatalogItem["category"][] = ["trigger", "action", "logic", "integration"]

export function NodePaletteSidebar() {
  const addNode = useWorkflowStore((s) => s.addNode)

  const handleDragStart = (e: React.DragEvent, nodeType: string) => {
    e.dataTransfer.setData("application/reactflow", nodeType)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleClick = (nodeType: string) => {
    // Add node at a default position when clicked
    addNode(nodeType, { x: 250, y: 150 + Math.random() * 200 })
  }

  return (
    <aside className="w-64 shrink-0 overflow-y-auto border-r border-border bg-card p-4">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nodes</h2>
      <div className="space-y-6">
        {categoryOrder.map((category) => {
          const nodes = getNodesByCategory(category)
          if (nodes.length === 0) return null

          return (
            <div key={category}>
              <h3 className="mb-2 text-xs font-medium text-muted-foreground">{categoryLabels[category]}</h3>
              <div className="space-y-1">
                {nodes.map((node) => {
                  const Icon = iconMap[node.icon] || Globe
                  return (
                    <div
                      key={node.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, node.type)}
                      onClick={() => handleClick(node.type)}
                      className={cn(
                        "flex cursor-grab items-center gap-3 rounded-md border border-transparent p-2",
                        "hover:border-border hover:bg-muted/50",
                        "active:cursor-grabbing",
                      )}
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded"
                        style={{ backgroundColor: `${node.color}20` }}
                      >
                        <Icon className="h-4 w-4" style={{ color: node.color }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{node.label}</p>
                        <p className="truncate text-xs text-muted-foreground">{node.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
