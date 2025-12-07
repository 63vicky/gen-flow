import type { Workflow } from "../workflow-types"
import { nanoid } from "nanoid"

const STORAGE_KEY = "lowcode_workflows_v1"

function loadAll(): Workflow[] {
  if (typeof window === "undefined") return []
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveAll(list: Workflow[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export async function listWorkflows(): Promise<Workflow[]> {
  // Simulate network delay for realistic feel
  await new Promise((resolve) => setTimeout(resolve, 100))
  return loadAll()
}

export async function getWorkflow(id: string): Promise<Workflow | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 50))
  return loadAll().find((w) => w.id === id)
}

export async function createWorkflow(name: string, description?: string): Promise<Workflow> {
  const list = loadAll()
  const now = new Date().toISOString()

  const workflow: Workflow = {
    id: nanoid(),
    name,
    description: description || "",
    nodes: [],
    edges: [],
    createdAt: now,
    updatedAt: now,
  }

  const next = [...list, workflow]
  saveAll(next)
  return workflow
}

export async function updateWorkflow(updated: Workflow): Promise<Workflow> {
  const list = loadAll()
  const updatedWorkflow = {
    ...updated,
    updatedAt: new Date().toISOString(),
  }
  const next = list.map((w) => (w.id === updated.id ? updatedWorkflow : w))
  saveAll(next)
  return updatedWorkflow
}

export async function deleteWorkflow(id: string): Promise<void> {
  const list = loadAll()
  const next = list.filter((w) => w.id !== id)
  saveAll(next)
}

export async function duplicateWorkflow(id: string): Promise<Workflow | undefined> {
  const workflow = await getWorkflow(id)
  if (!workflow) return undefined

  const now = new Date().toISOString()
  const duplicated: Workflow = {
    ...workflow,
    id: nanoid(),
    name: `${workflow.name} (Copy)`,
    createdAt: now,
    updatedAt: now,
  }

  const list = loadAll()
  saveAll([...list, duplicated])
  return duplicated
}
