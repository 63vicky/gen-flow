import { create } from "zustand"
import { nanoid } from "nanoid"
import type { Workflow, WorkflowNodeData, WorkflowEdgeData, WorkflowNodePosition } from "./workflow-types"
import { getNodeCatalogItem } from "./node-catalog"

interface WorkflowState {
  // Current workflow
  workflow: Workflow | null

  // Selection state
  selectedNodeId: string | null

  // UI state
  isDirty: boolean

  // Actions
  initFromWorkflow: (workflow: Workflow) => void
  resetStore: () => void

  // Node operations
  addNode: (type: string, position: WorkflowNodePosition) => void
  updateNode: (id: string, updates: Partial<WorkflowNodeData>) => void
  updateNodeConfig: (id: string, config: Record<string, unknown>) => void
  deleteNode: (id: string) => void
  setNodePosition: (id: string, position: WorkflowNodePosition) => void

  // Edge operations
  addEdge: (edge: Omit<WorkflowEdgeData, "id">) => void
  deleteEdge: (id: string) => void
  updateEdge: (id: string, updates: Partial<Omit<WorkflowEdgeData, "id">>) => void

  // Selection
  selectNode: (id: string | null) => void

  // Workflow metadata
  updateWorkflowMeta: (updates: Partial<Pick<Workflow, "name" | "description">>) => void

  // Sync helpers
  getWorkflowSnapshot: () => Workflow | null
  markClean: () => void
}

const initialState = {
  workflow: null,
  selectedNodeId: null,
  isDirty: false,
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  ...initialState,

  initFromWorkflow: (workflow) => {
    set({
      workflow: structuredClone(workflow),
      selectedNodeId: null,
      isDirty: false,
    })
  },

  resetStore: () => {
    set(initialState)
  },

  addNode: (type, position) => {
    const { workflow } = get()
    if (!workflow) return

    const catalogItem = getNodeCatalogItem(type)
    if (!catalogItem) return

    // Build default config from catalog fields
    const defaultConfig: Record<string, unknown> = {}
    catalogItem.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        defaultConfig[field.name] = field.defaultValue
      }
    })

    const newNode: WorkflowNodeData = {
      id: nanoid(),
      type,
      label: catalogItem.label,
      position,
      config: defaultConfig,
    }

    set({
      workflow: {
        ...workflow,
        nodes: [...workflow.nodes, newNode],
      },
      selectedNodeId: newNode.id,
      isDirty: true,
    })
  },

  updateNode: (id, updates) => {
    const { workflow } = get()
    if (!workflow) return

    set({
      workflow: {
        ...workflow,
        nodes: workflow.nodes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
      },
      isDirty: true,
    })
  },

  updateNodeConfig: (id, config) => {
    const { workflow } = get()
    if (!workflow) return

    set({
      workflow: {
        ...workflow,
        nodes: workflow.nodes.map((n) => (n.id === id ? { ...n, config: { ...n.config, ...config } } : n)),
      },
      isDirty: true,
    })
  },

  deleteNode: (id) => {
    const { workflow, selectedNodeId } = get()
    if (!workflow) return

    set({
      workflow: {
        ...workflow,
        nodes: workflow.nodes.filter((n) => n.id !== id),
        edges: workflow.edges.filter((e) => e.source !== id && e.target !== id),
      },
      selectedNodeId: selectedNodeId === id ? null : selectedNodeId,
      isDirty: true,
    })
  },

  setNodePosition: (id, position) => {
    const { workflow } = get()
    if (!workflow) return

    set({
      workflow: {
        ...workflow,
        nodes: workflow.nodes.map((n) => (n.id === id ? { ...n, position } : n)),
      },
      isDirty: true,
    })
  },

  addEdge: (edge) => {
    const { workflow } = get()
    if (!workflow) return

    // Prevent duplicate edges
    const exists = workflow.edges.some(
      (e) =>
        e.source === edge.source &&
        e.target === edge.target &&
        e.sourceHandle === edge.sourceHandle &&
        e.targetHandle === edge.targetHandle,
    )
    if (exists) return

    const newEdge: WorkflowEdgeData = {
      id: nanoid(),
      ...edge,
    }

    set({
      workflow: {
        ...workflow,
        edges: [...workflow.edges, newEdge],
      },
      isDirty: true,
    })
  },

  deleteEdge: (id) => {
    const { workflow } = get()
    if (!workflow) return

    set({
      workflow: {
        ...workflow,
        edges: workflow.edges.filter((e) => e.id !== id),
      },
      isDirty: true,
    })
  },

  updateEdge: (id, updates) => {
    const { workflow } = get()
    if (!workflow) return

    set({
      workflow: {
        ...workflow,
        edges: workflow.edges.map((e) => (e.id === id ? { ...e, ...updates } : e)),
      },
      isDirty: true,
    })
  },

  selectNode: (id) => {
    set({ selectedNodeId: id })
  },

  updateWorkflowMeta: (updates) => {
    const { workflow } = get()
    if (!workflow) return

    set({
      workflow: {
        ...workflow,
        ...updates,
      },
      isDirty: true,
    })
  },

  getWorkflowSnapshot: () => {
    const { workflow } = get()
    return workflow ? structuredClone(workflow) : null
  },

  markClean: () => {
    set({ isDirty: false })
  },
}))
