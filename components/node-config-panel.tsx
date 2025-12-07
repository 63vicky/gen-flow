"use client"

import { useWorkflowStore } from "@/lib/workflow-store"
import { getNodeCatalogItem } from "@/lib/node-catalog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Trash2 } from "lucide-react"
import type { NodeField } from "@/lib/workflow-types"

export function NodeConfigPanel() {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId)
  const workflow = useWorkflowStore((s) => s.workflow)
  const selectNode = useWorkflowStore((s) => s.selectNode)
  const updateNodeConfig = useWorkflowStore((s) => s.updateNodeConfig)
  const updateNode = useWorkflowStore((s) => s.updateNode)
  const deleteNode = useWorkflowStore((s) => s.deleteNode)

  const node = workflow?.nodes.find((n) => n.id === selectedNodeId)
  if (!node) return null

  const catalogItem = getNodeCatalogItem(node.type)
  if (!catalogItem) return null

  const handleFieldChange = (fieldName: string, value: unknown) => {
    updateNodeConfig(node.id, { [fieldName]: value })
  }

  const handleLabelChange = (label: string) => {
    updateNode(node.id, { label })
  }

  const handleDelete = () => {
    deleteNode(node.id)
  }

  const renderField = (field: NodeField) => {
    const value = node.config[field.name] ?? field.defaultValue ?? ""

    switch (field.type) {
      case "text":
        return (
          <Input
            id={field.name}
            value={String(value)}
            placeholder={field.placeholder}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          />
        )
      case "number":
        return (
          <Input
            id={field.name}
            type="number"
            value={String(value)}
            placeholder={field.placeholder}
            onChange={(e) => handleFieldChange(field.name, Number(e.target.value))}
          />
        )
      case "textarea":
        return (
          <Textarea
            id={field.name}
            value={String(value)}
            placeholder={field.placeholder}
            rows={3}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          />
        )
      case "select":
        return (
          <Select value={String(value)} onValueChange={(v) => handleFieldChange(field.name, v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      default:
        return null
    }
  }

  return (
    <aside className="w-80 shrink-0 overflow-y-auto border-l border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="text-sm font-semibold">Configure Node</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => selectNode(null)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-6 p-4">
        {/* Node Label */}
        <div className="space-y-2">
          <Label htmlFor="node-label">Label</Label>
          <Input id="node-label" value={node.label} onChange={(e) => handleLabelChange(e.target.value)} />
        </div>

        {/* Node Type Info */}
        <div className="rounded-md bg-muted/50 p-3">
          <p className="text-xs font-medium text-muted-foreground">{catalogItem.category.toUpperCase()}</p>
          <p className="text-sm font-medium">{catalogItem.label}</p>
          <p className="text-xs text-muted-foreground">{catalogItem.description}</p>
        </div>

        {/* Config Fields */}
        {catalogItem.fields.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Configuration</h3>
            {catalogItem.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required && <span className="ml-1 text-destructive">*</span>}
                </Label>
                {renderField(field)}
              </div>
            ))}
          </div>
        )}

        {/* Delete Button */}
        <div className="pt-4">
          <Button variant="destructive" size="sm" className="w-full" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Node
          </Button>
        </div>
      </div>
    </aside>
  )
}
