"use client"

import type React from "react"

import { useCallback, useEffect, useMemo } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  reconnectEdge,
  type Connection,
  type Node,
  type Edge,
  type NodeTypes,
  type OnNodesChange,
  type OnEdgesChange,
  type OnReconnect,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useWorkflowStore } from "@/lib/workflow-store"
import { WorkflowNode } from "./workflow-node"
import type { WorkflowNodeData as WFNodeData, WorkflowEdgeData } from "@/lib/workflow-types"

// Convert our workflow nodes to React Flow nodes
function toReactFlowNodes(nodes: WFNodeData[]): Node[] {
  return nodes.map((n, index) => ({
    id: n.id,
    type: "workflowNode",
    position: {
      x: n.position?.x ?? 100 + index * 50,
      y: n.position?.y ?? 100 + index * 50,
    },
    data: {
      label: n.label,
      nodeType: n.type,
      config: n.config,
    },
  }))
}

// Convert our workflow edges to React Flow edges
function toReactFlowEdges(edges: WorkflowEdgeData[]): Edge[] {
  return edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
    animated: true,
    reconnectable: true,
    style: { stroke: "#64748b", strokeWidth: 2 },
  }))
}

const nodeTypes: NodeTypes = {
  workflowNode: WorkflowNode,
}

export function WorkflowCanvas() {
  const workflow = useWorkflowStore((s) => s.workflow)
  const setNodePosition = useWorkflowStore((s) => s.setNodePosition)
  const addEdgeToStore = useWorkflowStore((s) => s.addEdge)
  const deleteEdge = useWorkflowStore((s) => s.deleteEdge)
  const updateEdge = useWorkflowStore((s) => s.updateEdge)
  const selectNode = useWorkflowStore((s) => s.selectNode)
  const addNode = useWorkflowStore((s) => s.addNode)

  const initialNodes = useMemo(() => toReactFlowNodes(workflow?.nodes || []), [workflow?.nodes])
  const initialEdges = useMemo(() => toReactFlowEdges(workflow?.edges || []), [workflow?.edges])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Sync React Flow state back to our store
  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes)
      changes.forEach((change) => {
        if (change.type === "position" && change.position && change.id) {
          setNodePosition(change.id, change.position)
        }
      })
    },
    [onNodesChange, setNodePosition],
  )

  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes)
      changes.forEach((change) => {
        if (change.type === "remove") {
          deleteEdge(change.id)
        }
      })
    },
    [onEdgesChange, deleteEdge],
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        addEdgeToStore({
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle || undefined,
          targetHandle: connection.targetHandle || undefined,
        })
        setEdges((eds) =>
          addEdge(
            {
              ...connection,
              animated: true,
              style: { stroke: "#64748b", strokeWidth: 2 },
            },
            eds,
          ),
        )
      }
    },
    [addEdgeToStore, setEdges],
  )

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node.id)
    },
    [selectNode],
  )

  const onPaneClick = useCallback(() => {
    selectNode(null)
  }, [selectNode])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData("application/reactflow")
      if (!type) return

      const bounds = event.currentTarget.getBoundingClientRect()
      const position = {
        x: event.clientX - bounds.left - 100,
        y: event.clientY - bounds.top - 25,
      }

      addNode(type, position)
    },
    [addNode],
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  // Sync when workflow changes externally
  useEffect(() => {
    setNodes(toReactFlowNodes(workflow?.nodes || []))
    setEdges(toReactFlowEdges(workflow?.edges || []))
  }, [workflow?.nodes, workflow?.edges, setNodes, setEdges])

  const onReconnect: OnReconnect = useCallback(
    (oldEdge, newConnection) => {
      // Update the edge in our store
      if (newConnection.source && newConnection.target) {
        updateEdge(oldEdge.id, {
          source: newConnection.source,
          target: newConnection.target,
          sourceHandle: newConnection.sourceHandle || undefined,
          targetHandle: newConnection.targetHandle || undefined,
        })
        setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds))
      }
    },
    [updateEdge, setEdges],
  )

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      // Store selected edge ID for deletion
      setEdges((eds) =>
        eds.map((e) =>
          e.id === edge.id
            ? { ...e, selected: true, style: { ...e.style, stroke: "#ef4444", strokeWidth: 3 } }
            : { ...e, selected: false, style: { ...e.style, stroke: "#64748b", strokeWidth: 2 } },
        ),
      )
    },
    [setEdges],
  )

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        onEdgeClick={onEdgeClick}
        deleteKeyCode={["Backspace", "Delete"]}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        className="bg-muted/20"
      >
        <Background gap={15} size={1} color="#e2e8f0" />
        <Controls className="bg-card border border-border rounded-lg" />
        <MiniMap className="bg-card border border-border rounded-lg" nodeColor="#3b82f6" maskColor="rgba(0,0,0,0.1)" />
      </ReactFlow>
    </div>
  )
}
