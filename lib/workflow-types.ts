export interface WorkflowNodePosition {
  x: number
  y: number
}

export interface WorkflowNodeConfig {
  [key: string]: unknown
}

export interface WorkflowNodeData {
  id: string
  type: string
  label: string
  position: WorkflowNodePosition
  config: WorkflowNodeConfig
}

export interface WorkflowEdgeData {
  id: string
  source: string
  sourceHandle?: string
  target: string
  targetHandle?: string
}

export interface Workflow {
  id: string
  name: string
  description: string
  nodes: WorkflowNodeData[]
  edges: WorkflowEdgeData[]
  createdAt: string
  updatedAt: string
}

// Node catalog types
export interface NodeFieldOption {
  label: string
  value: string
}

export interface NodeField {
  name: string
  label: string
  type: "text" | "number" | "select" | "textarea" | "boolean"
  placeholder?: string
  defaultValue?: unknown
  options?: NodeFieldOption[]
  required?: boolean
}

export interface NodeCatalogItem {
  type: string
  label: string
  description: string
  category: "trigger" | "action" | "logic" | "integration"
  icon: string
  color: string
  fields: NodeField[]
  inputs: number
  outputs: number
}
